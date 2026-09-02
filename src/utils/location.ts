export interface LocationHub {
  city: string;
  state: string;
  pincode: string;
  hubName: string;
  trialAtHomeAvailable: boolean;
  deliveryEta: string;
  lat: number;
  lng: number;
}

export const POPULAR_HUBS: LocationHub[] = [
  {
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500101',
    hubName: 'Banjara & Jubilee Hills Flagship Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '20 mins (Instant Trial & Express)',
    lat: 17.3850,
    lng: 78.4867,
  },
  {
    city: 'Eluru',
    state: 'Andhra Pradesh',
    pincode: '534001',
    hubName: 'Eluru Royal Heritage & West Godavari Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '20 mins (Instant Trial & Express)',
    lat: 16.7107,
    lng: 81.0952,
  },
  {
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    pincode: '520001',
    hubName: 'MG Road & Benz Circle Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '25 mins (Instant Trial & Express)',
    lat: 16.5062,
    lng: 80.6480,
  },
  {
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    pincode: '530001',
    hubName: 'Beach Road & Dwaraka Nagar Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '25 mins (Instant Trial & Express)',
    lat: 17.6868,
    lng: 83.2185,
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    hubName: 'Indiranagar & MG Road Lounge Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '25 mins (Instant Trial & Express)',
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    hubName: 'Bandra & South Mumbai Vault Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '30 mins (Instant Trial & Express)',
    lat: 19.0760,
    lng: 72.8777,
  },
  {
    city: 'Delhi NCR',
    state: 'Delhi',
    pincode: '110001',
    hubName: 'Connaught Place & South Ex Atelier Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '25 mins (Instant Trial & Express)',
    lat: 28.6139,
    lng: 77.2090,
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600017',
    hubName: 'T. Nagar & Alwarpet Heritage Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '30 mins (Instant Trial & Express)',
    lat: 13.0827,
    lng: 80.2707,
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    hubName: 'Koregaon Park & Kothrud Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '35 mins (Instant Trial & Express)',
    lat: 18.5204,
    lng: 73.8567,
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700016',
    hubName: 'Park Street & Salt Lake Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '40 mins (Instant Trial & Express)',
    lat: 22.5726,
    lng: 88.3639,
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    hubName: 'Johari Bazaar Artisanal Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '20 mins (Instant Trial & Express)',
    lat: 26.9124,
    lng: 75.7873,
  },
  {
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380015',
    hubName: 'SG Highway & Manek Chowk Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '30 mins (Instant Trial & Express)',
    lat: 23.0225,
    lng: 72.5714,
  }
];

export interface DetectedLocationResult {
  city: string;
  locality?: string;
  state: string;
  pincode: string;
  formattedAddress: string;
  hubName: string;
  trialAtHomeAvailable: boolean;
  deliveryEta: string;
  lat?: number;
  lng?: number;
  source: 'gps' | 'network' | 'saved' | 'manual';
}

/**
 * Calculate distance between two coordinates in kilometers (Haversine formula)
 */
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find closest hub based on coordinates
 */
export function findClosestHub(lat: number, lng: number): LocationHub {
  let closest = POPULAR_HUBS[0];
  let minDistance = Infinity;

  for (const hub of POPULAR_HUBS) {
    const dist = getDistanceFromLatLonInKm(lat, lng, hub.lat, hub.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = hub;
    }
  }

  return closest;
}

/**
 * Perform real browser geolocation detection with reverse geocoding
 */
export async function detectCurrentLocation(): Promise<DetectedLocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Try free reverse geocoding with BigDataCloud / OpenStreetMap
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            { signal: AbortSignal.timeout(5000) }
          );
          
          if (response.ok) {
            const data = await response.json();
            const city = data.city || data.locality || data.principalSubdivision || 'Detected City';
            const locality = data.locality || data.localityInfo?.administrative?.[3]?.name || '';
            const state = data.principalSubdivision || 'India';
            const rawPostcode = data.postcode || '';
            
            // Check nearest hub
            const closestHub = findClosestHub(latitude, longitude);
            const dist = getDistanceFromLatLonInKm(latitude, longitude, closestHub.lat, closestHub.lng);
            const pincode = rawPostcode || closestHub.pincode;

            const isNearHub = dist <= 45; // Within 45km of express hubs
            const deliveryEta = isNearHub ? '25 mins (Trial & Express)' : '1–2 Days (Express Courier)';

            const result: DetectedLocationResult = {
              city: city || closestHub.city,
              locality: locality || closestHub.city,
              state: state,
              pincode: pincode,
              formattedAddress: locality ? `${locality}, ${city}, ${state} - ${pincode}` : `${city}, ${state} - ${pincode}`,
              hubName: `${city} Central Express Hub (${Math.round(dist)} km)`,
              trialAtHomeAvailable: isNearHub,
              deliveryEta: deliveryEta,
              lat: latitude,
              lng: longitude,
              source: 'gps',
            };

            // Save to localStorage for instant subsequent loads
            localStorage.setItem('roldygoldy_detected_location', JSON.stringify(result));
            resolve(result);
            return;
          }
        } catch (fetchErr) {
          console.warn('Reverse geocode API timeout/error, using coordinate lookup:', fetchErr);
        }

        // Coordinate fallback if API timed out
        const closestHub = findClosestHub(latitude, longitude);
        const dist = getDistanceFromLatLonInKm(latitude, longitude, closestHub.lat, closestHub.lng);
        const isNearHub = dist <= 45;

        const result: DetectedLocationResult = {
          city: closestHub.city,
          locality: closestHub.city,
          state: closestHub.state,
          pincode: closestHub.pincode,
          formattedAddress: `${closestHub.city}, ${closestHub.state} - ${closestHub.pincode}`,
          hubName: `${closestHub.hubName} (${Math.round(dist)} km away)`,
          trialAtHomeAvailable: isNearHub,
          deliveryEta: isNearHub ? closestHub.deliveryEta : '1–2 Days (Express Courier)',
          lat: latitude,
          lng: longitude,
          source: 'gps',
        };

        localStorage.setItem('roldygoldy_detected_location', JSON.stringify(result));
        resolve(result);
      },
      (error) => {
        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please select your city or enter a pincode.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please select your city.';
        }
        reject(new Error(msg));
      },
      options
    );
  });
}

/**
 * Lookup hub information for any entered Indian pincode
 */
export function lookupPincode(pincode: string): DetectedLocationResult {
  const cleanPin = pincode.replace(/\D/g, '').slice(0, 6);
  
  // Check exact hub match
  const exact = POPULAR_HUBS.find(h => h.pincode === cleanPin);
  if (exact) {
    return {
      city: exact.city,
      locality: exact.hubName,
      state: exact.state,
      pincode: exact.pincode,
      formattedAddress: `${exact.hubName}, ${exact.city}, ${exact.state} - ${exact.pincode}`,
      hubName: exact.hubName,
      trialAtHomeAvailable: exact.trialAtHomeAvailable,
      deliveryEta: exact.deliveryEta,
      source: 'manual',
    };
  }

  // Specific Andhra Pradesh & Telangana district mappings
  if (cleanPin.startsWith('534')) {
    return {
      city: 'Eluru',
      locality: 'R.R. Pet / Main Bazaar, Eluru',
      state: 'Andhra Pradesh',
      pincode: cleanPin,
      formattedAddress: `Main Bazaar, Eluru, Andhra Pradesh - ${cleanPin}`,
      hubName: 'Eluru Royal Heritage & West Godavari Hub',
      trialAtHomeAvailable: true,
      deliveryEta: '20 mins (Instant Trial & Express)',
      source: 'manual',
    };
  }

  if (cleanPin.startsWith('520') || cleanPin.startsWith('521')) {
    return {
      city: 'Vijayawada',
      locality: 'MG Road, Vijayawada',
      state: 'Andhra Pradesh',
      pincode: cleanPin,
      formattedAddress: `MG Road / Benz Circle, Vijayawada, Andhra Pradesh - ${cleanPin}`,
      hubName: 'MG Road & Benz Circle Hub',
      trialAtHomeAvailable: true,
      deliveryEta: '25 mins (Instant Trial & Express)',
      source: 'manual',
    };
  }

  if (cleanPin.startsWith('530') || cleanPin.startsWith('531')) {
    return {
      city: 'Visakhapatnam',
      locality: 'Dwaraka Nagar, Visakhapatnam',
      state: 'Andhra Pradesh',
      pincode: cleanPin,
      formattedAddress: `Dwaraka Nagar, Visakhapatnam, Andhra Pradesh - ${cleanPin}`,
      hubName: 'Beach Road & Dwaraka Nagar Hub',
      trialAtHomeAvailable: true,
      deliveryEta: '25 mins (Instant Trial & Express)',
      source: 'manual',
    };
  }

  if (cleanPin.startsWith('533')) {
    return {
      city: 'Rajahmundry / Kakinada',
      locality: 'Godavari Heritage Zone',
      state: 'Andhra Pradesh',
      pincode: cleanPin,
      formattedAddress: `Godavari Hub, Rajahmundry, Andhra Pradesh - ${cleanPin}`,
      hubName: 'East Godavari Artisan Hub',
      trialAtHomeAvailable: true,
      deliveryEta: '30 mins (Instant Trial & Express)',
      source: 'manual',
    };
  }

  if (cleanPin.startsWith('522')) {
    return {
      city: 'Guntur',
      locality: 'Brodipet / Arundelpet',
      state: 'Andhra Pradesh',
      pincode: cleanPin,
      formattedAddress: `Brodipet, Guntur, Andhra Pradesh - ${cleanPin}`,
      hubName: 'Guntur Amaravati Hub',
      trialAtHomeAvailable: true,
      deliveryEta: '30 mins (Instant Trial & Express)',
      source: 'manual',
    };
  }

  // Pincode prefix matching for Indian states/cities
  const prefix2 = cleanPin.substring(0, 2);
  let guessedCity = 'Hyderabad';
  let guessedState = 'Telangana';
  let isTrial = false;
  let eta = '1–2 Days (Express Delivery)';

  if (prefix2 === '50' || prefix2 === '51' || prefix2 === '52' || prefix2 === '53') {
    guessedCity = prefix2 === '50' ? 'Hyderabad / Secunderabad' : 'Andhra Pradesh Hub';
    guessedState = prefix2 === '50' ? 'Telangana' : 'Andhra Pradesh';
    isTrial = true;
    eta = '25 mins (Instant Trial @Home)';
  } else if (prefix2 === '56' || prefix2 === '57' || prefix2 === '58' || prefix2 === '59') {
    guessedCity = 'Bengaluru / Karnataka';
    guessedState = 'Karnataka';
    isTrial = prefix2 === '56';
    eta = prefix2 === '56' ? '25 mins (Instant Trial @Home)' : 'Next Day Doorstep';
  } else if (prefix2 === '40' || prefix2 === '41' || prefix2 === '42' || prefix2 === '43' || prefix2 === '44') {
    guessedCity = prefix2 === '40' ? 'Mumbai' : prefix2 === '41' ? 'Pune' : 'Maharashtra';
    guessedState = 'Maharashtra';
    isTrial = prefix2 === '40' || prefix2 === '41';
    eta = isTrial ? '30 mins (Instant Trial @Home)' : 'Next Day Doorstep';
  } else if (prefix2 === '11' || prefix2 === '12' || prefix2 === '20') {
    guessedCity = 'Delhi NCR (Delhi, Gurgaon, Noida)';
    guessedState = 'Delhi NCR';
    isTrial = true;
    eta = '25 mins (Instant Trial @Home)';
  } else if (prefix2 === '60' || prefix2 === '61' || prefix2 === '62' || prefix2 === '63' || prefix2 === '64') {
    guessedCity = prefix2 === '60' ? 'Chennai' : 'Tamil Nadu';
    guessedState = 'Tamil Nadu';
    isTrial = prefix2 === '60';
    eta = prefix2 === '60' ? '30 mins (Instant Trial @Home)' : 'Next Day Doorstep';
  } else if (prefix2 === '70' || prefix2 === '71' || prefix2 === '72') {
    guessedCity = 'Kolkata';
    guessedState = 'West Bengal';
    isTrial = prefix2 === '70';
    eta = prefix2 === '70' ? '35 mins (Instant Trial @Home)' : 'Next Day Doorstep';
  } else if (prefix2 === '30' || prefix2 === '31' || prefix2 === '32' || prefix2 === '33' || prefix2 === '34') {
    guessedCity = 'Jaipur / Rajasthan';
    guessedState = 'Rajasthan';
    isTrial = prefix2 === '30';
    eta = prefix2 === '30' ? '20 mins (Instant Trial @Home)' : 'Next Day Doorstep';
  } else if (prefix2 === '38' || prefix2 === '39') {
    guessedCity = 'Ahmedabad / Gujarat';
    guessedState = 'Gujarat';
    isTrial = prefix2 === '38';
    eta = prefix2 === '38' ? '30 mins (Instant Trial @Home)' : 'Next Day Doorstep';
  }

  return {
    city: guessedCity,
    locality: `PIN ${cleanPin} Express Area`,
    state: guessedState,
    pincode: cleanPin,
    formattedAddress: `Sector ${cleanPin}, ${guessedCity}, ${guessedState}`,
    hubName: `${guessedCity} Regional Dispatch`,
    trialAtHomeAvailable: isTrial,
    deliveryEta: eta,
    source: 'manual',
  };
}
