import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fast Gemini text & multimodal generation with rapid fallback
async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
) {
  // Use official supported high-speed models (gemini-flash-latest prioritized)
  const models = ["gemini-flash-latest", "gemini-3.7-flash"];
  let lastError: any = null;

  for (const model of models) {
    try {
      // 8 second timeout to allow robust JSON schema responses without hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Model call timed out")), 8000)
      );

      const apiPromise = ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });

      const response: any = await Promise.race([apiPromise, timeoutPromise]);
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      lastError = err;
      // Immediately try next model candidate
      continue;
    }
  }

  throw lastError || new Error("AI models temporarily unavailable.");
}

function calculateMetalRate(metalType: string): number {
  const lower = (metalType || "").toLowerCase();
  if (lower.includes("rold gold") || lower.includes("1-gram") || lower.includes("1 gram")) {
    return 0.35; // Rold gold / 1-gram gold polish scrap (₹0.35/g)
  }
  if (lower.includes("brass") || lower.includes("copper")) {
    return 0.32; // Brass & copper imitation scrap (₹0.32/g)
  }
  if (lower.includes("broken") || lower.includes("mixed")) {
    return 0.33; // Mixed broken imitation ornaments (₹0.33/g)
  }
  return 0.30; // Fashion / alloy core scrap (₹0.30/g)
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", aiConfigured: Boolean(process.env.GEMINI_API_KEY) });
  });

  // AI Bargain with Jeweller endpoint
  app.post("/api/bargain", async (req, res) => {
    try {
      const currentPriceNum = Number(req.body.currentPrice) || Number(req.body.originalPrice) || 999;
      const originalPriceNum = Number(req.body.originalPrice) || currentPriceNum;
      const userBidNum = Number(req.body.userBid) || Math.round(currentPriceNum * 0.85);
      const productName = req.body.productName || "Handcrafted Jewellery";
      const messageHistory = Array.isArray(req.body.messageHistory) ? req.body.messageHistory : [];
      const userArgument = req.body.userArgument || "Looking for the best boutique festive discount.";

      // Floor price: up to 22% discount below current store price
      const floorPrice = Math.max(10, Math.round(currentPriceNum * 0.78));

      const ai = getGeminiClient();

      // If no AI key configured, use local intelligent negotiation logic
      if (!ai) {
        let isAccepted = false;
        let counterOffer = currentPriceNum;
        let reply = "";

        if (userBidNum >= currentPriceNum) {
          isAccepted = true;
          counterOffer = currentPriceNum;
          reply = `Namaste! We are happy to confirm your order at our store price of ₹${counterOffer.toLocaleString('en-IN')}. Added to your cart!`;
        } else if (userBidNum >= floorPrice) {
          isAccepted = true;
          counterOffer = userBidNum;
          reply = `You have great negotiation skills! Since this piece is handcrafted with 22K micron rold gold tone plating, we agree to your offer of ₹${userBidNum.toLocaleString('en-IN')}. Deal locked for your cart!`;
        } else {
          // Counter offer midway between floor and current store price, NEVER above current store price
          counterOffer = Math.min(currentPriceNum, Math.max(floorPrice, Math.round((currentPriceNum + userBidNum) / 2)));
          reply = `Namaste! While ₹${userBidNum.toLocaleString('en-IN')} is below our direct artisan making cost, in the spirit of festivities, the absolute best special price I can do is ₹${counterOffer.toLocaleString('en-IN')} with free micro-polishing. Would you like to lock this?`;
        }

        return res.json({
          sellerReply: reply,
          counterOffer,
          isAccepted,
          savingsPercent: Math.round(((originalPriceNum - counterOffer) / originalPriceNum) * 100),
          specialPerks: "Complimentary Velvet Jewellery Pouch & Care Cloth",
        });
      }

      // Gemini AI Prompt
      const systemInstruction = `You are Master Jeweller Ramesh from 'RoldyGoldy Boutique' (selling premium imitation and rold gold jewellery).
You are negotiating live with a customer for product: "${productName}".

CRITICAL PRICING RULES:
- Current Store Price: ₹${currentPriceNum} (Original Tag MRP: ₹${originalPriceNum})
- Customer Proposed Bid: ₹${userBidNum}
- Customer Note: "${userArgument}"
- Hard Floor Minimum: ₹${floorPrice}

STRICT CONSTRAINTS:
1. Your counterOffer MUST NEVER EXCEED the Current Store Price of ₹${currentPriceNum}. Counter offers above ₹${currentPriceNum} are strictly forbidden.
2. If customer bid (₹${userBidNum}) >= Hard Floor (₹${floorPrice}):
   - If user proposed a reasonable offer >= ₹${floorPrice}, you may accept (isAccepted = true) with counterOffer = ${userBidNum} (or within ₹20-50).
3. If customer bid (₹${userBidNum}) < Hard Floor (₹${floorPrice}):
   - You MUST counter with a price between ₹${floorPrice} and ₹${currentPriceNum} (isAccepted = false).
   - NEVER counter with a price higher than ₹${currentPriceNum}.
4. Keep 'sellerReply' respectful, warm, and authentic to an Indian boutique jeweller (1-2 sentences).
5. Always return strict JSON matching the schema.`;

      const response = await generateContentWithFallback(ai, {
        contents: `Negotiate customer bid of ₹${userBidNum} for product "${productName}" (Store Price: ₹${currentPriceNum}, MRP: ₹${originalPriceNum}). Previous conversation: ${JSON.stringify(messageHistory.slice(-4))}. Customer reason: "${userArgument}".`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sellerReply: { type: Type.STRING, description: "Boutique master jeweller reply to the buyer" },
              counterOffer: { type: Type.NUMBER, description: "Counter offer price in INR or accepted bid price" },
              isAccepted: { type: Type.BOOLEAN, description: "Whether the customer's bid or final agreement is accepted" },
              savingsPercent: { type: Type.NUMBER, description: "Percentage discount from original price" },
              specialPerks: { type: Type.STRING, description: "Special value perk offered by the jeweller" },
            },
            required: ["sellerReply", "counterOffer", "isAccepted", "savingsPercent", "specialPerks"],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      let counterOffer = Number(parsed.counterOffer) || currentPriceNum;

      // Strict sanity clamps: counterOffer can NEVER exceed currentPriceNum or be below floorPrice
      if (counterOffer > currentPriceNum) {
        counterOffer = currentPriceNum;
      }
      if (counterOffer < floorPrice) {
        counterOffer = floorPrice;
      }
      if (parsed.isAccepted) {
        counterOffer = Math.min(currentPriceNum, Math.max(floorPrice, userBidNum));
      }

      return res.json({
        ...parsed,
        counterOffer,
        savingsPercent: Math.round(((originalPriceNum - counterOffer) / originalPriceNum) * 100),
      });
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.log(`[Bargain Engine] Using local artisan rule engine (${errMsg.includes('429') || errMsg.includes('quota') ? 'API quota limit' : 'offline mode'})`);
      // Safe, intelligent boutique jeweller negotiation fallback response
      const currentPriceNum = Number(req.body?.currentPrice) || 999;
      const originalPriceNum = Number(req.body?.originalPrice) || currentPriceNum;
      const userBidNum = Number(req.body?.userBid) || Math.round(currentPriceNum * 0.85);
      const floorPrice = Math.max(10, Math.round(currentPriceNum * 0.78));
      
      let isAccepted = false;
      let counter = currentPriceNum;
      let reply = "";

      if (userBidNum >= floorPrice) {
        isAccepted = true;
        counter = Math.min(currentPriceNum, userBidNum);
        reply = `Namaste! Because you appreciate authentic handcrafted work, we accept your offer of ₹${counter.toLocaleString('en-IN')}. Deal locked for your cart!`;
      } else {
        counter = Math.min(currentPriceNum, Math.max(floorPrice, Math.round((currentPriceNum + userBidNum) / 2)));
        reply = `Namaste! While ₹${userBidNum.toLocaleString('en-IN')} is below our direct workshop making cost, in the spirit of festivities, the best special price I can do is ₹${counter.toLocaleString('en-IN')} with free velvet pouch. Would you like to lock this?`;
      }

      return res.json({
        sellerReply: reply,
        counterOffer: counter,
        isAccepted,
        savingsPercent: Math.round(((originalPriceNum - counter) / originalPriceNum) * 100),
        specialPerks: "Authentic Hallmark Guarantee & Velvet Keepsake Box",
      });
    }
  });

  // AI Scrap & Old Imitation Jewellery Photo Appraisal Endpoint
  app.post("/api/appraise-scrap", async (req, res) => {
    try {
      const { 
        imageBase64, 
        grams = 50, 
        metalType = "Rold Gold / 1-Gram Polish Scrap", 
        description = "" 
      } = req.body;
      
      const weightNum = Math.max(1, Number(grams) || 50);
      const ratePerGram = calculateMetalRate(metalType); // strictly 0.30 - 0.35 rs/gram
      const grossEstimatedCredit = weightNum * ratePerGram;
      
      // 10% wastage value deduction
      const wastageValue = grossEstimatedCredit * 0.10;
      const netEstimatedCredit = Math.max(1, Math.round(grossEstimatedCredit - wastageValue));

      if (!imageBase64 || imageBase64.trim() === "") {
        return res.status(400).json({
          isJewelleryDetected: false,
          rejectionReason: "No photo attached. Please attach or capture a clear photo of your old imitation or rold gold scrap jewellery.",
        });
      }

      const ai = getGeminiClient();

      if (!ai) {
        // When AI is not configured, do NOT auto-accept unverified images
        return res.json({
          isJewelleryDetected: false,
          rejectionReason: "Visual AI verification service is temporarily unavailable. Please retry in a few moments or have your scrap inspected physically by the concierge rider.",
        });
      }

      // Multimodal Gemini analysis of the uploaded photo
      let mimeType = "image/jpeg";
      if (imageBase64.includes("image/png")) mimeType = "image/png";
      else if (imageBase64.includes("image/webp")) mimeType = "image/webp";

      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const imagePart = {
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      };

      const prompt = `You are a certified Senior Gemmologist and AI Visual Inspector at RoldyGoldy verifying photos for old broken imitation, rold gold, gold, silver, or metallic scrap jewellery exchange.

MANDATORY FIRST PRIORITY - STRICT JEWELLERY DETECTION (ZERO TOLERANCE FOR NON-JEWELLERY):
Scrutinize the uploaded photo with extreme precision.

YOU MUST REJECT IMMEDIATELY (Set isJewelleryDetected: false) if the photo depicts ANY of the following:
1. Household bedding, mattresses, pillows, cushions, blankets, bedsheets, sofas, chairs, carpets, curtains, tiles, floors, walls, ceilings.
2. Human body parts WITHOUT clearly identifiable gold/silver/imitation jewellery ornaments (e.g. bare feet, toes, legs, arms, selfies, faces, hands without rings/bangles).
3. Footwear or clothing (shoes, sandals, chappals, slippers, socks, shirts, pants, cloth fabric).
4. Furniture, desks, electronics, laptops, phones, chargers, keyboards, wires, boxes, plastic bottles, food, kitchenware, drinks.
5. Blurry, out-of-focus, dark, or generic indoor backgrounds where no metallic jewellery pieces are clearly visible.

YOU MAY ONLY ACCEPT (Set isJewelleryDetected: true) if the photo clearly and undeniably shows:
- Authentic imitation, rold gold, gold, silver, or alloy jewellery items: necklaces, chokers, chains, bangles, kadas, bracelets, rings, earrings, jhumkas, maang tikkas, anklets, mangalsutras, pendants, brooches, or broken metallic ornament scrap links.

IF REJECTED (e.g. Mattress, Pillow, Bare Foot, Furniture, Clothing, Floor):
- isJewelleryDetected: false
- rejectionReason: Explicitly name the non-jewellery object detected (e.g. "The uploaded photo depicts a mattress / pillow / bedding fabric instead of jewellery. Please capture a clear photo of old broken chains, bangles, necklaces, or earrings.").
- identifiedItem: "Non-jewellery item detected"
- netCreditValue: 0
- voucherCode: ""

IF ACCEPTED:
- isJewelleryDetected: true
- rejectionReason: ""
- identifiedItem: Specific jewellery items identified in photo
- estimatedPurity: "${metalType}"
- estimatedWeightGrams: ${weightNum}
- netCreditValue: ${netEstimatedCredit}
- ratePerGram: ${ratePerGram}
- stoneDeductionPercent: 10
- appraisalNotes: "Live visual appraisal confirmed. Metal weight and 10% wastage deduction will be certified at your doorstep using calibrated scales."
- voucherCode: "RG-TRADE-${Math.floor(1000 + Math.random() * 9000)}"

Return STRICT JSON adhering to schema.`;

      const response = await generateContentWithFallback(ai, {
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isJewelleryDetected: { type: Type.BOOLEAN, description: "True ONLY if the photo clearly shows jewellery or metallic ornaments. False for mattress, pillow, bedding, feet, shoes, furniture, or random objects." },
              rejectionReason: { type: Type.STRING, description: "Detailed explanation why the photo was rejected if not jewellery" },
              identifiedItem: { type: Type.STRING, description: "Detailed identification of jewellery pieces in photo" },
              estimatedPurity: { type: Type.STRING, description: "Assessed imitation metal finish category" },
              estimatedWeightGrams: { type: Type.NUMBER, description: "Net assessed metal weight in grams" },
              netCreditValue: { type: Type.NUMBER, description: "Final calculated exchange cashback discount in INR (with 10% wastage)" },
              ratePerGram: { type: Type.NUMBER, description: "Applied rate per gram (0.30 - 0.35 INR)" },
              stoneDeductionPercent: { type: Type.NUMBER, description: "Wastage deduction percentage (10%)" },
              appraisalNotes: { type: Type.STRING, description: "Expert feedback and verification instructions for the rider" },
              voucherCode: { type: Type.STRING, description: "Trade-in coupon code" },
            },
            required: [
              "isJewelleryDetected",
              "identifiedItem",
              "estimatedPurity",
              "estimatedWeightGrams",
              "netCreditValue",
              "ratePerGram",
              "stoneDeductionPercent",
              "appraisalNotes",
              "voucherCode",
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");

      if (parsed.isJewelleryDetected === false) {
        return res.json({
          isJewelleryDetected: false,
          rejectionReason: parsed.rejectionReason || "No imitation jewellery or rold gold ornaments detected in this image. Please upload a clear photo of old broken chains, bangles, necklaces, or earrings.",
        });
      }

      return res.json({
        ...parsed,
        isJewelleryDetected: true,
        netCreditValue: parsed.netCreditValue || netEstimatedCredit,
        ratePerGram: parsed.ratePerGram || ratePerGram,
        stoneDeductionPercent: 10,
        voucherCode: parsed.voucherCode || `RG-TRADE-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.log(`[Scrap Appraisal] Handling visual appraisal check: ${errMsg.slice(0, 80)}`);
      // DO NOT auto-accept unverified images in catch block
      return res.json({
        isJewelleryDetected: false,
        rejectionReason: "Visual gemmological AI could not verify authentic jewellery in this photo. Please ensure good lighting and upload a clear picture of old broken chains, bangles, or rold gold ornaments.",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RoldyGoldy Server running on http://localhost:${PORT}`);
  });
}

startServer();
