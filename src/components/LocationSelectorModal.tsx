import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Search,
  Loader2,
  Building2
} from 'lucide-react';
import { 
  POPULAR_HUBS, 
  LocationHub, 
  DetectedLocationResult, 
  detectCurrentLocation, 
  lookupPincode 
} from '../utils/location';
import { triggerHaptic } from '../utils/haptics';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPincode?: string;
  currentCity?: string;
  currentLocation?: DetectedLocationResult;
  onLocationSelect?: (location: DetectedLocationResult) => void;
  onSelectLocation?: (location: DetectedLocationResult) => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  currentPincode,
  currentCity,
  currentLocation,
  onLocationSelect,
  onSelectLocation,
}) => {
  const activePincode = currentPincode || currentLocation?.pincode || '500101';
  const activeCity = currentCity || currentLocation?.city || 'Hyderabad';
  const handleLocationCallback = onLocationSelect || onSelectLocation || (() => {});

  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState<string>(activePincode);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    setDetectError(null);
    triggerHaptic('light');

    try {
      const detected = await detectCurrentLocation();
      triggerHaptic('success');
      handleLocationCallback(detected);
      onClose();
    } catch (err: any) {
      triggerHaptic('warning');
      setDetectError(err.message || 'Could not detect your location automatically. Please select your city below.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSelectHub = (hub: LocationHub) => {
    triggerHaptic('light');
    const locationData: DetectedLocationResult = {
      city: hub.city,
      locality: hub.hubName,
      state: hub.state,
      pincode: hub.pincode,
      formattedAddress: `${hub.hubName}, ${hub.city}, ${hub.state} - ${hub.pincode}`,
      hubName: hub.hubName,
      trialAtHomeAvailable: hub.trialAtHomeAvailable,
      deliveryEta: hub.deliveryEta,
      lat: hub.lat,
      lng: hub.lng,
      source: 'manual',
    };
    handleLocationCallback(locationData);
    onClose();
  };

  const handleApplyPincode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualInput.trim()) return;

    triggerHaptic('success');
    const result = lookupPincode(manualInput.trim());
    handleLocationCallback(result);
    onClose();
  };

  const queryLower = (searchQuery || '').toLowerCase();
  const filteredHubs = POPULAR_HUBS.filter(
    h => (h.city || '').toLowerCase().includes(queryLower) || 
         (h.state || '').toLowerCase().includes(queryLower) ||
         (h.pincode || '').includes(searchQuery || '')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-stone-900 border-t sm:border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-1 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-100 text-sm">Select Delivery Location</h3>
              <p className="text-[11px] text-stone-400">Doorstep Trial &amp; Express Delivery Hubs</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live GPS Auto-Detect Button */}
        <div className="space-y-2">
          <button
            onClick={handleAutoDetect}
            disabled={isDetecting}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 active:scale-[0.98] text-stone-950 font-extrabold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all disabled:opacity-75"
          >
            {isDetecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                <span>Detecting GPS Coordinates &amp; Nearest Hub...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 text-stone-950" />
                <span>Detect My Current Location (GPS / Network)</span>
              </>
            )}
          </button>

          {detectError && (
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[11px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{detectError}</span>
            </div>
          )}
        </div>

        {/* Manual Pincode Input */}
        <form onSubmit={handleApplyPincode} className="space-y-1.5">
          <label className="text-[11px] font-semibold text-stone-300 block">
            Enter Pincode or Locality:
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="e.g. 500101, 560001, 400050"
                maxLength={6}
                className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-hidden font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
            >
              Apply
            </button>
          </div>
        </form>

        {/* Major Express Cities / Hubs */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-400">
            <span>Select Popular Express Hub:</span>
            <span className="text-[10px] text-amber-400">⚡ 20–35 min Trial</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredHubs.map((hub) => {
              const isSelected = hub.pincode === activePincode || (hub.city || '').toLowerCase() === (activeCity || '').toLowerCase();
              return (
                <button
                  key={hub.pincode}
                  onClick={() => handleSelectHub(hub)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/40 text-stone-100'
                      : 'bg-stone-950/60 border-stone-800 hover:border-amber-500/30 text-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-amber-400" />
                        <span>{hub.city}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 block truncate mt-0.5">
                        {hub.state} · PIN {hub.pincode}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-stone-800/80 flex items-center justify-between text-[9.5px]">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> 20m Trial @Home
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[10.5px] text-stone-400">
          <div className="flex items-center gap-1 text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Insured Valet Delivery</span>
          </div>
          <span>GPS Geo-Fenced</span>
        </div>

      </div>
    </div>
  );
};
