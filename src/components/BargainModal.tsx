import React, { useState, useEffect, useRef } from 'react';
import { Product, BargainMessage } from '../types';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Tag, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare, 
  Flame, 
  Percent, 
  X,
  RefreshCw,
  Gift
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface BargainModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onDealLocked: (product: Product, lockedPrice: number) => void;
}

export const BargainModal: React.FC<BargainModalProps> = ({
  product,
  isOpen,
  onClose,
  onDealLocked,
}) => {
  const [messages, setMessages] = useState<BargainMessage[]>([]);
  const [bidAmount, setBidAmount] = useState<number>(Math.round(product.price * 0.9));
  const [selectedTactic, setSelectedTactic] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [finalLockedPrice, setFinalLockedPrice] = useState<number | null>(null);
  const [savingsPercent, setSavingsPercent] = useState<number>(0);
  const [specialPerk, setSpecialPerk] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation when modal opens
  useEffect(() => {
    if (isOpen && product) {
      const initialPrice = product.bargainedPrice || product.price;
      setBidAmount(Math.round(initialPrice * 0.88));
      setFinalLockedPrice(product.bargainedPrice || null);
      
      const welcomeMsg: BargainMessage = {
        id: 'msg-0',
        sender: 'jeweller',
        text: `Namaste! I am Master Ramesh from RoldyGoldy Jewels. The ${product.name} is one of our finest royal creations with pure 22K micron rold gold plating. Our showroom tag is ₹${product.price.toLocaleString('en-IN')}. What counter-offer do you have in mind today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proposedPrice: initialPrice,
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, product]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickDiscountPills = [
    { label: '5% OFF', pct: 0.05, amount: Math.round(product.price * 0.95) },
    { label: '10% OFF', pct: 0.10, amount: Math.round(product.price * 0.90) },
    { label: '15% OFF', pct: 0.15, amount: Math.round(product.price * 0.85) },
    { label: '20% OFF (Artisan Floor)', pct: 0.20, amount: Math.round(product.price * 0.80) },
  ];

  const bargainingTactics = [
    '💍 Buying for an upcoming family wedding',
    '⚡ Will pay immediately via instant UPI',
    '✨ Also planning to buy matching earrings',
    '⭐ Loyal first-time customer on RoldyGoldy',
  ];

  const handleSendOffer = async () => {
    if (bidAmount <= 0) return;
    triggerHaptic('light');

    const userArgument = selectedTactic ? `${selectedTactic}. ${customNote}` : customNote || 'Looking for best boutique festive discount.';
    
    const userMsg: BargainMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: `I'd love to take this piece for ₹${bidAmount.toLocaleString('en-IN')}. ${userArgument ? `(${userArgument})` : ''}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      proposedPrice: bidAmount,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setSelectedTactic('');
    setCustomNote('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9500);

    try {
      const res = await fetch('/api/bargain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          productName: product.name,
          originalPrice: product.originalPrice,
          currentPrice: product.price,
          userBid: bidAmount,
          messageHistory: messages.map((m) => ({ sender: m.sender, text: m.text })),
          userArgument,
        }),
      });

      clearTimeout(timeoutId);
      const data = await res.json();
      
      // Strict client-side boundary: counter offer can never exceed current product store price
      const floorLimit = Math.round(product.price * 0.78);
      const rawCounter = Number(data.counterOffer) || product.price;
      const safeCounter = Math.min(product.price, Math.max(floorLimit, rawCounter));

      const jewellerReply: BargainMessage = {
        id: `jwl-${Date.now()}`,
        sender: 'jeweller',
        text: data.sellerReply || `We respect your proposal! Let's lock ₹${safeCounter.toLocaleString('en-IN')} for your order.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proposedPrice: safeCounter,
        isAccepted: data.isAccepted,
      };

      setMessages((prev) => [...prev, jewellerReply]);
      setSpecialPerk(data.specialPerks || 'Complimentary Velvet Jewellery Box');

      if (data.isAccepted) {
        triggerHaptic('success');
        setFinalLockedPrice(safeCounter);
        setSavingsPercent(data.savingsPercent || Math.round(((product.originalPrice - safeCounter) / product.originalPrice) * 100));
      } else if (safeCounter) {
        setBidAmount(safeCounter);
      }
    } catch (err: any) {
      console.warn('Bargain fallback negotiation engaged:', err?.message || err);
      // Smart offline fallback
      const counter = Math.min(product.price, Math.max(Math.round(product.price * 0.82), bidAmount));
      const fallbackMsg: BargainMessage = {
        id: `jwl-${Date.now()}`,
        sender: 'jeweller',
        text: `You have an eye for fine craftsmanship! I can offer this special festive price of ₹${counter.toLocaleString('en-IN')} with doorstep express handling. Deal locked!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proposedPrice: counter,
        isAccepted: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setFinalLockedPrice(counter);
      triggerHaptic('success');
      setSavingsPercent(Math.round(((product.originalPrice - counter) / product.originalPrice) * 100));
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleAcceptDeal = (priceToLock: number) => {
    const safeLockedPrice = Math.min(product.price, priceToLock);
    triggerHaptic('success');
    setFinalLockedPrice(safeLockedPrice);
    onDealLocked(product, safeLockedPrice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-stone-900 border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-stone-950 px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" 
                  alt="Jeweller Ramesh" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-stone-950 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-stone-100 text-sm">Master Jeweller Ramesh</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded-sm border border-amber-500/30">Verified</span>
              </div>
              <p className="text-xs text-stone-400">RoldyGoldy Boutique Concierge · Live AI Negotiation</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Snapshot Bar */}
        <div className="bg-stone-900/90 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-amber-500/20 shrink-0" />
            <div className="truncate">
              <div className="font-medium text-stone-200 truncate">{product.name}</div>
              <div className="flex items-center gap-2 text-stone-400 text-[11px]">
                <span>Tag: <s className="text-stone-500">₹{product.originalPrice.toLocaleString('en-IN')}</s></span>
                <span className="text-amber-400 font-semibold">Store: ₹{product.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          {finalLockedPrice ? (
            <div className="text-right shrink-0 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
              <span className="text-[10px] text-emerald-400 font-bold block">DEAL LOCKED</span>
              <span className="text-sm font-extrabold text-emerald-300">₹{finalLockedPrice.toLocaleString('en-IN')}</span>
            </div>
          ) : (
            <div className="text-right shrink-0">
              <span className="text-[9.5px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                🛡️ Seller Floor Price Authorized
              </span>
            </div>
          )}
        </div>

        {/* Transparent Seller Guardrail Note */}
        <div className="bg-stone-950 px-4 py-2 border-b border-stone-800/80 flex items-center gap-2 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong className="text-stone-300">Artisan Floor Price Protected: </strong>
            Bargains negotiate automatically within pre-authorized discount limits set by the master artisan.
          </span>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-950/60">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950 font-medium rounded-br-xs'
                    : 'bg-stone-800/95 border border-stone-700 text-stone-200 rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>

                {msg.proposedPrice && msg.sender === 'jeweller' && (
                  <div className="mt-2.5 pt-2 border-t border-stone-700/60 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase tracking-wider">Jeweller Proposed:</span>
                      <span className="text-base font-bold text-amber-400">₹{msg.proposedPrice.toLocaleString('en-IN')}</span>
                    </div>
                    {!finalLockedPrice && (
                      <button
                        onClick={() => handleAcceptDeal(msg.proposedPrice!)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accept ₹{msg.proposedPrice.toLocaleString('en-IN')}
                      </button>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-stone-500 mt-1 px-1">{msg.time}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="bg-stone-800 border border-stone-700 rounded-2xl px-4 py-3 text-xs text-stone-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Jeweller Ramesh is calculating artisan making costs...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Locked Deal Success Banner */}
        {finalLockedPrice ? (
          <div className="bg-emerald-950/90 border-t border-emerald-500/40 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <span>🎉 Agreed at ₹{finalLockedPrice.toLocaleString('en-IN')} ({savingsPercent}% Total Savings)</span>
                </div>
                <div className="text-[11px] text-emerald-400/90">{specialPerk}</div>
              </div>
              <button
                onClick={() => {
                  onDealLocked(product, finalLockedPrice);
                  onClose();
                }}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all shrink-0"
              >
                Apply to Cart &rarr;
              </button>
            </div>
          </div>
        ) : (
          /* Negotiation Controls */
          <div className="bg-stone-900 p-3.5 border-t border-stone-800 space-y-3">
            
            {/* Quick Bid Percentages */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5 font-medium">
                <span>Quick Offers:</span>
                <span className="text-amber-400 font-mono">Current Bid: ₹{bidAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {quickDiscountPills.map((pill) => (
                  <button
                    key={pill.label}
                    onClick={() => setBidAmount(pill.amount)}
                    className={`text-[11px] py-1.5 px-2 rounded-lg font-semibold border text-center transition-all ${
                      bidAmount === pill.amount
                        ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-bold'
                        : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:border-amber-500/50'
                    }`}
                  >
                    <div>{pill.label}</div>
                    <div className="text-[10px] opacity-80">₹{pill.amount}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tactical Bargaining Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              {bargainingTactics.map((tactic) => (
                <button
                  key={tactic}
                  onClick={() => setSelectedTactic(selectedTactic === tactic ? '' : tactic)}
                  className={`shrink-0 px-2.5 py-1 rounded-full border text-[10.5px] transition-all ${
                    selectedTactic === tactic
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-medium'
                      : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-300'
                  }`}
                >
                  {tactic}
                </button>
              ))}
            </div>

            {/* Input & Bid Action */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs font-bold">₹</span>
                <input
                  type="number"
                  value={bidAmount || ''}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  placeholder="Enter your target offer"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-7 pr-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                />
              </div>
              <button
                disabled={isLoading || !bidAmount}
                onClick={handleSendOffer}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 disabled:opacity-50 text-stone-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Propose Bid</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
