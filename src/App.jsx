import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Cpu,
  Search,
  Menu,
  X,
  CheckCircle,
  AlertTriangle,
  User,
  Filter,
  ArrowRight,
  Upload,
  Gavel,
  Check,
  Zap,
  Lock,
  Clock,
  MapPin,
  ShoppingBag,
  MessageCircle,
  HelpCircle,
  Loader,
  ThumbsUp,
  CreditCard,
  Send,
  DollarSign,
  MoreVertical,
  FileText,
  Info,
  Image as ImageIcon,
  Sparkles,
  BrainCircuit,
  Database,
  QrCode,
  Scan,
  MessageSquare,
  Bot,
  Settings,
  Save,
  Smartphone
} from 'lucide-react';
import Onboarding from './Onboarding';

// --- API HELPER ---
const callGemini = async (prompt, apiKey) => {
  if (!apiKey) return "⚠️ API Key Missing. Please set your Gemini API Key in the Settings menu (top right).";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("AI Service Unavailable. Check Key.");
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble processing that right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI. Please check your API Key in Settings.";
  }
};

// --- SYSTEM CONFIG & MOCK DATA ---

const SYSTEM_CONFIG = {
  tiers: {
    unverified: { level: 0, label: "L0 Unverified", short: "L0", scoreBonus: 0, color: "zinc", protectionWindow: "12 Hours", desc: "No ID provided." },
    student: { level: 1, label: "L3 Basic", short: "L3", scoreBonus: 20, color: "yellow", protectionWindow: "24 Hours", desc: "Software Verification (Student ID/Email)" },
    license: { level: 2, label: "L2 Standard", short: "L2", scoreBonus: 50, color: "blue", protectionWindow: "48 Hours", desc: "Gov ID (License) + Basic Biometrics" },
    passport: { level: 3, label: "L1 Secure", short: "L1", scoreBonus: 80, color: "emerald", protectionWindow: "72 Hours", desc: "Hardware-backed ID (Passport) + Face Scan" },
    official: { level: 4, label: "L1+ Official", short: "L1+", scoreBonus: 100, color: "purple", protectionWindow: "7 Days", desc: "Verto Official Partner / Direct Stock" }
  }
};

const MOCK_LISTINGS = [
  {
    id: 1,
    title: "NVIDIA RTX 3060 12GB (Sealed)",
    price: 16500,
    seller: "Verto Exchange",
    sellerTier: "official",
    trustScore: 100,
    category: "GPU",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000",
    location: "Verto HQ, Cebu City",
    isAiCurated: true,
    description: "Verified Stock sold directly by Verto. 100% Authenticity Guaranteed."
  },
  {
    id: 2,
    title: "Ryzen 5 5600X",
    price: 7200,
    seller: "Renz Balajoro",
    sellerTier: "license",
    trustScore: 85,
    category: "CPU",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=1000",
    location: "IT Park, Cebu",
    isAiCurated: false,
    description: "Used for 6 months. Pins straight. Meetup at Ayala Central Bloc."
  },
  {
    id: 3,
    title: "Keychron K2 V2",
    price: 3500,
    seller: "Niño Aliser",
    sellerTier: "passport",
    trustScore: 95,
    category: "Peripherals",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000",
    location: "Lahug, Cebu City",
    isAiCurated: true,
    description: "RFS: Upgrading. Box and cable included."
  },
  {
    id: 4,
    title: "Logitech G Pro X Superlight",
    price: 4500,
    seller: "Jules Paqueo",
    sellerTier: "passport",
    trustScore: 98,
    category: "Peripherals",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=1000",
    location: "Mandaue City",
    isAiCurated: true,
    description: "Good condition. No double click issues."
  },
  {
    id: 5,
    title: "RTX 4090 24GB - RUSH SALE",
    price: 45000,
    seller: "Anon_User_99",
    sellerTier: "unverified",
    trustScore: 12,
    category: "GPU",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000",
    location: "Meet anywhere",
    isAiCurated: false,
    description: "Gift from uncle. No box. Need cash ASAP. Meet now. No testing."
  }
];

// --- UTILS ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
};

const renderAiMarkdown = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    const isBullet = line.trim().startsWith('* ');
    const cleanLine = isBullet ? line.trim().substring(2) : line;
    const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

    return (
      <div key={i} className={`mb-1 ${isBullet ? 'pl-4 relative' : ''}`}>
        {isBullet && <span className="absolute left-0 text-purple-400">•</span>}
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-white font-bold">{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        })}
      </div>
    );
  });
};

// --- SUB-COMPONENTS ---

const Badge = ({ tier, size = "sm", onClick }) => {
  const config = SYSTEM_CONFIG.tiers[tier] || SYSTEM_CONFIG.tiers.unverified;

  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/50",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    zinc: "bg-zinc-800 text-zinc-400 border-zinc-700"
  };

  const icons = {
    official: <Database size={size === "lg" ? 18 : 12} className="animate-pulse" />,
    passport: <Shield size={size === "lg" ? 18 : 12} />,
    license: <CheckCircle size={size === "lg" ? 18 : 12} />,
    student: <User size={size === "lg" ? 18 : 12} />,
    unverified: <AlertTriangle size={size === "lg" ? 18 : 12} />
  };

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${colors[config.color]} font-mono uppercase tracking-wider ${size === "lg" ? "text-xs" : "text-[10px]"} transition-all duration-300 hover:scale-105 cursor-pointer`}
    >
      {icons[tier]}
      {size === "lg" ? config.label : config.short}
    </button>
  );
};

// --- GLOBAL ASSISTANT ---
const GlobalAssistant = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hello! I'm Verto Bot. I can help you find deals or answer questions about safety. Try asking for 'cheap GPUs'!" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const inventoryContext = JSON.stringify(MOCK_LISTINGS.map(l => ({
      item: l.title,
      price: l.price,
      trust: l.trustScore,
      id: l.id
    })));

    const prompt = `
      System: You are Verto Bot, a helpful AI assistant for a peer-to-peer hardware marketplace in Cebu.
      Current Inventory Data: ${inventoryContext}
      User Query: "${userMsg.text}"
      Instructions:
      1. If the user asks for recommendations, suggest items from the inventory based on price/category.
      2. If they ask about safety, explain the Escrow system.
      3. Keep responses brief, friendly, and formatted nicely.
    `;

    const responseText = await callGemini(prompt, apiKey);

    setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: responseText }]);
    setIsTyping(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-[90] p-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-zinc-800 text-white rotate-90' : 'bg-emerald-500 text-black'}`}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 z-[90] w-80 md:w-96 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 flex flex-col h-[500px]">
          <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30">
              <Bot className="text-emerald-400" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Verto Assistant</h3>
              <p className="text-zinc-500 text-xs">Online • Powered by Gemini</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900/95 scrollbar-thin scrollbar-thumb-zinc-700">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-sm'
                  : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-sm'
                  }`}>
                  {renderAiMarkdown(msg.text)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask for recommendations..."
              className="flex-grow bg-zinc-900 border border-zinc-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button type="submit" className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors active:scale-95">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

// --- MODALS ---

const SettingsModal = ({ isOpen, onClose, apiKey, setApiKey }) => {
  const [localKey, setLocalKey] = useState(apiKey);

  useEffect(() => {
    setLocalKey(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    setApiKey(localKey);
    localStorage.setItem('verto_api_key', localKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md relative shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white z-50"><X size={20} /></button>

        <div className="p-6 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2 mb-1">
            <Settings className="text-emerald-500" size={24} />
            <h2 className="text-xl font-bold text-white tracking-tighter">SETTINGS</h2>
          </div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">System Configuration</p>
        </div>

        <div className="p-6">
          <label className="text-sm font-bold text-white block mb-2">Gemini API Key</label>
          <p className="text-xs text-zinc-400 mb-4">Required for Verto Shield AI, Negotiation Bot, and Global Assistant.</p>
          <div className="relative">
            <input
              type="password"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder="Paste your API key here..."
              className="w-full bg-zinc-950 border border-zinc-700 text-white p-3 text-sm focus:border-emerald-500 outline-none font-mono rounded"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider py-3 rounded active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save size={16} /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

const SecurityLevelsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const levels = [
    { id: 'official', label: 'L1+', title: 'Official Partner', desc: 'Verified direct stock. Maximum trust.', win: '7 Days' },
    { id: 'passport', label: 'L1', title: 'Secure (Hardware)', desc: 'Government ID + Face Scan matched.', win: '72 Hours' },
    { id: 'license', label: 'L2', title: 'Standard (Gov ID)', desc: 'Verified Driver\'s License.', win: '48 Hours' },
    { id: 'student', label: 'L3', title: 'Basic (Software)', desc: 'Student ID or Email verification.', win: '24 Hours' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg relative shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white z-50"><X size={20} /></button>
        <div className="p-6 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="text-emerald-500" size={24} />
            <h2 className="text-xl font-bold text-white tracking-tighter">VERTO SECURITY LEVELS</h2>
          </div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Verification & Protection Standards</p>
        </div>
        <div className="p-6 space-y-4">
          {levels.map((lvl) => (
            <div key={lvl.id} className="flex items-center gap-4 p-3 border border-zinc-800 bg-zinc-950/50 rounded hover:border-zinc-700 transition-colors">
              <div className="w-12 flex-shrink-0">
                <Badge tier={lvl.id} size="lg" />
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-bold text-sm">{lvl.title}</h4>
                <p className="text-zinc-500 text-xs">{lvl.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 uppercase">Protection</p>
                <p className="text-emerald-400 font-bold text-sm">{lvl.win}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HowItWorksModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const steps = [
    { icon: <Lock className="text-emerald-400" size={24} />, title: "1. Secure Deposit", desc: "Buyer pays Verto. We hold the funds in a secure vault." },
    { icon: <QrCode className="text-blue-400" size={24} />, title: "2. Verify Meetup", desc: "Meet in person. Show your Digital Handshake QR to the seller." },
    { icon: <CheckCircle className="text-emerald-400" size={24} />, title: "3. Inspect & Approve", desc: "If the item works, Buyer clicks 'Release Funds'." },
    { icon: <Shield className="text-purple-400" size={24} />, title: "4. Protection", desc: "If there's an issue, funds stay frozen while we investigate." }
  ];
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl relative shadow-2xl overflow-hidden flex flex-col h-auto max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white z-50 transition-colors"><X size={24} /></button>
        <div className="p-10 text-center border-b border-zinc-800 bg-zinc-950">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tighter">THE VERTO <span className="text-emerald-500">ESCROW</span> PROTOCOL</h2>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Trustless Trading // Secured by Code</p>
        </div>
        <div className="p-8 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4 p-6 border border-zinc-800 bg-zinc-950/50 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex-shrink-0 w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 group-hover:border-emerald-500/50 transition-colors duration-300">{step.icon}</div>
                <div><h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{step.title}</h3><p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex justify-center"><button onClick={onClose} className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 active:scale-95 transition-all duration-200">Got it</button></div>
      </div>
    </div>
  );
};

const ChatWindow = ({ item, onClose, onLaunchTrade, apiKey }) => {
  const [messages, setMessages] = useState([{ id: 1, type: 'text', sender: 'seller', text: `Hi! Are you interested in the ${item.title}?` }]);
  const [inputText, setInputText] = useState('');
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const handleSellerResponse = async (userAction) => {
    setIsTyping(true);
    let responseText = ""; let responseType = "text"; let acceptedAmount = null;
    const userMessage = userAction.type === 'offer' ? `I offer ${userAction.amount} PHP.` : userAction.text;
    const minPrice = item.price * 0.9;
    const prompt = `You are roleplaying as a seller named ${item.seller} on Verto Exchange. Selling: ${item.title}. Listed Price: ${item.price} PHP. Seller Trust: ${item.trustScore}. User said: "${userMessage}". If offer >= ${minPrice} PHP, accept enthusiastically starting with "ACCEPTED:". If lower, reject/counter. Keep under 25 words.`;

    const aiResponse = await callGemini(prompt, apiKey);

    if (aiResponse && !aiResponse.includes("API Key Missing")) {
      if (aiResponse.startsWith("ACCEPTED:") || (userAction.type === 'offer' && userAction.amount >= minPrice)) {
        responseText = aiResponse.replace("ACCEPTED:", "").trim(); responseType = "offer_accepted"; acceptedAmount = userAction.amount || item.price;
      } else { responseText = aiResponse; }
    } else {
      // Fallback
      if (userAction.type === 'offer' && userAction.amount >= minPrice) { responseText = "That works! Let's do it."; responseType = "offer_accepted"; acceptedAmount = userAction.amount; }
      else { responseText = aiResponse.includes("API Key") ? aiResponse : "I'm considering it..."; }
    }

    setMessages(prev => [...prev, { id: Date.now(), type: responseType, sender: 'seller', text: responseText, amount: acceptedAmount }]);
    setIsTyping(false);
  };

  const sendMessage = (e) => { e.preventDefault(); if (!inputText.trim()) return; const newMsg = { id: Date.now(), type: 'text', sender: 'user', text: inputText }; setMessages([...messages, newMsg]); setInputText(''); handleSellerResponse(newMsg); };
  const sendOffer = () => { if (!offerAmount) return; const amount = parseInt(offerAmount); const newMsg = { id: Date.now(), type: 'offer', sender: 'user', amount: amount, text: `Offered ${formatCurrency(amount)}` }; setMessages([...messages, newMsg]); setShowOfferInput(false); handleSellerResponse(newMsg); };

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-80 md:w-96 bg-zinc-900 border border-zinc-700 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500 rounded-lg">
      <div className="p-3 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative"><div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700"><User size={16} className="text-zinc-400" /></div><div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-950 rounded-full animate-pulse"></div></div>
          <div><div className="flex items-center gap-2"><p className="text-sm font-bold text-white leading-none">{item.seller}</p><span className="text-[10px] bg-purple-500/20 text-purple-400 px-1 rounded flex items-center gap-0.5"><Sparkles size={8} /> AI</span></div><div className="flex items-center gap-1 mt-0.5"><span className="text-[10px] text-zinc-500">Trust: {item.trustScore}%</span><Badge tier={item.sellerTier} /></div></div>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors"><X size={18} /></button>
      </div>
      <div className="flex-1 h-80 overflow-y-auto p-4 space-y-3 bg-zinc-900/50 scrollbar-thin scrollbar-thumb-zinc-700">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {msg.type === 'offer' && <div className="mb-1 bg-zinc-800 border border-emerald-500/30 p-3 rounded-lg w-full max-w-[80%]"><p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Offer Made</p><p className="text-xl font-mono font-bold text-white">{formatCurrency(msg.amount)}</p></div>}
            {msg.type === 'offer_accepted' && <div className="w-full mb-2 animate-in zoom-in duration-300"><div className="bg-emerald-500/10 border border-emerald-500/50 p-3 rounded mb-2"><p className="text-sm text-zinc-200 mb-2">{msg.text}</p><button onClick={() => onLaunchTrade({ ...item, price: msg.amount || item.price })} className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all text-black text-xs font-bold uppercase py-2 flex items-center justify-center gap-2"><Lock size={12} /> Launch Secure Trade</button></div></div>}
            {msg.type === 'text' && <div className={`px-3 py-2 rounded-lg max-w-[85%] text-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-none'}`}>{msg.text}</div>}
          </div>
        ))}
        {isTyping && <div className="flex items-center gap-1 text-zinc-500 text-xs pl-2 animate-pulse">Seller is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 bg-zinc-950 border-t border-zinc-800">
        {showOfferInput && <div className="mb-3 p-3 bg-zinc-900 border border-zinc-700 animate-in slide-in-from-bottom-2 duration-300"><div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-white uppercase">Make an Offer</span><button onClick={() => setShowOfferInput(false)}><X size={14} className="text-zinc-500" /></button></div><div className="flex gap-2"><div className="relative flex-grow"><span className="absolute left-3 top-2 text-zinc-400">₱</span><input type="number" value={offerAmount} onChange={(e) => setOfferAmount(e.target.value)} placeholder={item.price} className="w-full bg-zinc-950 border border-zinc-700 text-white pl-7 pr-3 py-1.5 text-sm focus:border-emerald-500 outline-none font-mono transition-colors" /></div><button onClick={sendOffer} className="bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-emerald-500 active:scale-95 transition-all">Send</button></div></div>}
        <form onSubmit={sendMessage} className="flex gap-2"><button type="button" onClick={() => setShowOfferInput(!showOfferInput)} className={`p-2 rounded hover:bg-zinc-800 transition-colors ${showOfferInput ? 'text-emerald-500 bg-zinc-800' : 'text-zinc-400'}`}><DollarSign size={20} /></button><input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type a message..." className="flex-grow bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors" /><button type="submit" className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"><Send size={18} /></button></form>
      </div>
    </div>
  );
};

const EscrowModal = ({ isOpen, onClose, item, onReportIssue, onShowSecurity, onContinueInChat, apiKey }) => {
  const [tradeState, setTradeState] = useState('initial');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [meetupVerified, setMeetupVerified] = useState(false);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isOpen) { setTradeState('initial'); setAiAnalysis(null); setMeetupVerified(false); setIsQrVisible(false); setIsScanning(false); }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const tierConfig = SYSTEM_CONFIG.tiers[item.sellerTier] || SYSTEM_CONFIG.tiers.unverified;
  const protectionWindow = tierConfig.protectionWindow || "24 Hours";

  const handleAnalyzeDeal = async () => {
    setIsAnalyzing(true);
    const prompt = `Analyze this hardware deal on Verto Exchange. Item: ${item.title}. Price: ${item.price} PHP. Seller: ${item.seller} (Tier: ${item.sellerTier}, Trust: ${item.trustScore}%). Description: ${item.description}. Output 3 short bullet points using markdown bold (**text**): * **Price Fairness:** (Is it good value?) * **Risk Level:** (Low/Medium/High) * **Final Verdict:** (Buy/Caution/Avoid). Keep it very concise.`;
    const analysis = await callGemini(prompt, apiKey);
    setAiAnalysis(analysis || "Analysis currently unavailable.");
    setIsAnalyzing(false);
  };

  const handleStartTrade = () => { setTradeState('processing'); setTimeout(() => { setTradeState('active'); }, 2000); };
  const handleVerifyMeetup = () => { setIsQrVisible(true); setIsScanning(true); setTimeout(() => { setIsScanning(false); setMeetupVerified(true); setTimeout(() => { setIsQrVisible(false); }, 1500); }, 3000); };
  const handleConfirmItem = () => { setTradeState('completed'); };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-3xl relative shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto min-h-[500px] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white z-50 transition-colors"><X size={20} /></button>
        <div className="bg-zinc-950 p-8 md:w-1/3 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col">
          <img src={item.image} alt="item" className="w-full h-40 object-cover rounded mb-4 opacity-80" />
          <h3 className="text-white font-bold mb-1 text-lg">{item.title}</h3>
          <div className="mb-4"><p className="text-emerald-500 font-mono font-bold text-xl">{formatCurrency(item.price)}</p>{item.originalPrice && item.price !== item.originalPrice && (<p className="text-zinc-500 text-xs line-through">{formatCurrency(item.originalPrice)}</p>)}</div>
          <div className="text-xs text-zinc-500 space-y-2 mt-auto"><p>Seller: <span className="text-zinc-300 font-bold">{item.seller}</span></p><div className="flex items-center gap-1 cursor-pointer hover:opacity-80" onClick={onShowSecurity}><span>Security:</span> <Badge tier={item.sellerTier} /></div><p>Loc: <span className="text-zinc-300">{item.location}</span></p><div className="mt-4 pt-4 border-t border-zinc-800"><p className="uppercase tracking-widest mb-1">Status</p>{tradeState === 'initial' && <span className="text-zinc-400 font-bold">Waiting for Deposit</span>}{tradeState === 'processing' && <span className="text-yellow-400 font-bold animate-pulse">Processing...</span>}{tradeState === 'active' && !meetupVerified && <span className="text-blue-400 font-bold">Funds Locked</span>}{tradeState === 'active' && meetupVerified && <span className="text-emerald-400 font-bold">Meetup Verified</span>}{tradeState === 'completed' && <span className="text-emerald-400 font-bold">Funds Released</span>}</div></div>
        </div>
        <div className="p-8 md:w-2/3 flex flex-col justify-center relative">
          {tradeState === 'initial' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-start mb-6"><div className="flex items-center gap-2"><Lock className="text-emerald-500" /><h2 className="text-xl font-bold text-white uppercase tracking-tight">Verto Secure Escrow</h2></div><button onClick={handleAnalyzeDeal} disabled={isAnalyzing} className="text-[10px] flex items-center gap-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-1 rounded uppercase font-bold tracking-wider hover:bg-purple-500/20 transition-all">{isAnalyzing ? <Loader size={10} className="animate-spin" /> : <BrainCircuit size={12} />}{isAnalyzing ? 'Scanning...' : 'Analyze Deal Risk'}</button></div>
              {aiAnalysis && (<div className="mb-6 p-4 bg-purple-900/10 border border-purple-500/30 rounded animate-in zoom-in duration-300 relative"><h4 className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Sparkles size={12} /> Verto Shield AI Report</h4><div className="text-zinc-300 text-xs leading-relaxed font-mono mb-3">{renderAiMarkdown(aiAnalysis)}</div><button onClick={() => onContinueInChat(item)} className="w-full bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase py-2 flex items-center justify-center gap-2 rounded transition-colors"><MessageSquare size={12} /> Continue in Chat</button></div>)}
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">Funds are held by Verto. <br />Because this seller is <span className={`font-bold text-${tierConfig.color}-400`}>{tierConfig.label}</span>, you get a <span className="text-white font-bold underline decoration-emerald-500 decoration-2">{protectionWindow}</span> protection window after pickup.</p>
              <div className="space-y-6 relative mb-8"><div className="absolute left-3 top-2 bottom-2 w-0.5 bg-zinc-800"></div>{['Secure Deposit', 'Meet & Inspect', 'Funds Released'].map((step, i) => (<div key={i} className="relative pl-10" style={{ animationDelay: `${i * 150}ms` }}><div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-600 text-zinc-400 flex items-center justify-center font-bold text-xs group-hover:bg-emerald-500">{i + 1}</div><h4 className="text-zinc-300 font-bold text-sm">{step}</h4></div>))}</div>
              <button onClick={handleStartTrade} className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all text-black font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-2">Start Secure Trade <ArrowRight size={16} /></button>
            </div>
          )}
          {tradeState === 'processing' && <div className="text-center py-10 animate-in fade-in duration-500"><Loader className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" /><h3 className="text-white font-bold text-lg">Securing Funds...</h3><p className="text-zinc-500 text-sm mt-2">Transferring {formatCurrency(item.price)} to Verto Vault</p></div>}
          {tradeState === 'active' && !isQrVisible && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className={`border p-4 rounded mb-6 flex items-center gap-3 transition-colors ${meetupVerified ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>{meetupVerified ? <CheckCircle className="text-emerald-400 w-8 h-8 flex-shrink-0" /> : <Shield className="text-blue-400 w-8 h-8 flex-shrink-0 animate-pulse" />}<div><h3 className={`${meetupVerified ? 'text-emerald-400' : 'text-blue-400'} font-bold text-sm uppercase tracking-wide`}>{meetupVerified ? "Proximity Confirmed" : "Funds Secured"}</h3><p className="text-zinc-400 text-xs">{meetupVerified ? "Digital handshake successful. Safe to proceed." : "Verto is holding your payment. Meet seller to verify."}</p></div></div>
              <div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-zinc-900 border border-zinc-800 p-4"><p className="text-[10px] text-zinc-500 uppercase">Meetup Location</p><p className="text-white font-bold text-sm flex items-center gap-1 mt-1"><MapPin size={14} className="text-emerald-500" /> {item.location}</p></div><div className="bg-zinc-900 border border-zinc-800 p-4"><p className="text-[10px] text-zinc-500 uppercase">Protection Window</p><p className="text-white font-bold text-sm flex items-center gap-1 mt-1"><Clock size={14} className="text-emerald-500" /> {protectionWindow}</p></div></div>
              <div className="flex flex-col gap-3">{!meetupVerified ? (<button onClick={handleVerifyMeetup} className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white font-bold uppercase tracking-widest py-3 rounded-none flex items-center justify-center gap-2"><QrCode size={18} /> Verify Meetup (QR)</button>) : (<button onClick={handleConfirmItem} className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all text-black font-bold uppercase tracking-widest py-3 rounded-none flex items-center justify-center gap-2"><CheckCircle size={18} /> I Have Inspected the Item</button>)}<button onClick={() => { onClose(); onReportIssue(); }} className="w-full bg-transparent border border-red-900 text-red-500 hover:bg-red-900/20 active:scale-95 transition-all font-bold uppercase tracking-widest py-3 rounded-none flex items-center justify-center gap-2"><AlertTriangle size={18} /> Report an Issue / Dispute</button></div>
            </div>
          )}
          {tradeState === 'active' && isQrVisible && <div className="text-center py-6 animate-in zoom-in duration-300">{!meetupVerified ? (<><div className="bg-white p-4 inline-block rounded mb-4"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Verto_Secure_Handshake_${item.id}_${Date.now()}`} alt="Meetup QR" className="w-32 h-32" /></div><h3 className="text-white font-bold text-lg mb-1 animate-pulse">Waiting for scan...</h3><p className="text-zinc-500 text-xs mb-6 max-w-xs mx-auto">Ask the seller to scan this code to confirm you have met in person.</p><div className="w-48 h-1 bg-zinc-800 mx-auto rounded overflow-hidden"><div className="h-full bg-blue-500 animate-[loading_3s_ease-in-out_infinite]" style={{ width: '100%' }}></div></div></>) : (<div className="flex flex-col items-center"><div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.5)]"><Check size={40} className="text-black" /></div><h3 className="text-2xl font-bold text-white mb-2">Handshake Confirmed</h3><p className="text-zinc-400 text-sm">Proximity Verified. You may now inspect the item.</p></div>)}</div>}
          {tradeState === 'completed' && <div className="text-center py-6 animate-in zoom-in duration-500"><div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-bounce"><Check size={40} className="text-black" /></div><h2 className="text-2xl font-bold text-white mb-2">Transaction Complete!</h2><p className="text-zinc-400 text-sm mb-8">Funds have been released to <span className="text-white font-bold">{item.seller}</span>.</p><button onClick={onClose} className="mt-8 text-zinc-500 hover:text-white underline text-sm transition-colors">Close Window</button></div>}
        </div>
      </div>
    </div>
  );
};

const VerificationModal = ({ isOpen, onClose, currentTier, onUpgrade }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  if (!isOpen) return null;
  const handleUpload = () => { if (!selectedType) return; setUploading(true); setTimeout(() => { onUpgrade(selectedType); setUploading(false); onClose(); }, 2000); };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6"><Shield className="text-emerald-500 w-8 h-8" /><div><h2 className="text-2xl font-bold text-white">Identity Verification</h2><p className="text-zinc-400 text-sm">Upload ID to unlock Escrow features and higher Trust Scores.</p></div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">{['student', 'license', 'passport'].map((type) => (<button key={type} onClick={() => setSelectedType(type)} className={`p-4 border text-left transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 ${selectedType === type ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'}`}><div className="mb-3"><Badge tier={type} /></div><p className="text-zinc-300 text-sm font-bold mb-1">{SYSTEM_CONFIG.tiers[type].label}</p><p className="text-zinc-500 text-xs">{SYSTEM_CONFIG.tiers[type].desc}</p></button>))}</div>
          <div className="flex justify-end"><button onClick={handleUpload} disabled={!selectedType || uploading} className="bg-emerald-500 text-black font-bold uppercase tracking-wider px-8 py-3 hover:bg-emerald-400 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2">{uploading ? 'Verifying...' : 'Submit ID'}</button></div>
        </div>
      </div>
    </div>
  );
};

const TicketSupportModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [fileAttached, setFileAttached] = useState(null);
  useEffect(() => { if (isOpen) { setSubmitted(false); setFileAttached(null); } }, [isOpen]);
  if (!isOpen) return null;
  const handleSubmit = () => { setTicketId(`#VRTO-${Math.floor(1000 + Math.random() * 9000)}-X`); setSubmitted(true); };
  const handleFileChange = (e) => { if (e.target.files && e.target.files[0]) { setFileAttached(e.target.files[0].name); } };
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg relative shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
        {!submitted ? (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6"><FileText className="text-emerald-500 w-6 h-6" /><h2 className="text-xl font-bold text-white">Create Support Ticket</h2></div>
            <p className="text-zinc-400 text-sm mb-4">Describe the issue with your transaction. Our team reviews all tickets within <span className="text-white font-bold">4 hours</span>.<br /><span className="text-red-400 text-xs">Note: Funds are frozen automatically upon ticket submission.</span></p>
            <div className="mb-4"><label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Issue Type</label><select className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 text-sm focus:border-emerald-500 outline-none appearance-none transition-colors"><option>Item not as described</option><option>Seller did not show up</option><option>Item is defective/broken</option><option>Safety concern</option></select></div>
            <div className="mb-4"><label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Description</label><textarea className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 text-sm h-32 focus:border-emerald-500 outline-none resize-none transition-colors" placeholder="Please provide details..."></textarea></div>
            <div className="mb-6"><label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Evidence (Optional)</label><div className="relative border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 bg-zinc-950/50 transition-all duration-300 rounded p-4 text-center group cursor-pointer hover:bg-zinc-900"><input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*,video/*" /><div className="flex flex-col items-center justify-center pointer-events-none">{fileAttached ? (<><CheckCircle className="text-emerald-500 w-8 h-8 mb-2 animate-bounce" /><p className="text-emerald-400 text-sm font-bold truncate max-w-[200px]">{fileAttached}</p><p className="text-zinc-600 text-xs mt-1">Click to change</p></>) : (<><ImageIcon className="text-zinc-500 w-8 h-8 mb-2 group-hover:text-emerald-400 transition-colors duration-300" /><p className="text-zinc-400 text-sm font-bold group-hover:text-white transition-colors">Upload Photos or Video</p><p className="text-zinc-600 text-xs mt-1">JPG, PNG, MP4 (Max 10MB)</p></>)}</div></div></div>
            <button onClick={handleSubmit} className="w-full bg-emerald-600 text-white font-bold uppercase tracking-wider py-3 hover:bg-emerald-500 active:scale-95 transition-all">Submit Ticket</button>
          </div>
        ) : (
          <div className="p-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><Check size={32} /></div><h3 className="text-xl font-bold text-white mb-2">Ticket Created</h3><p className="text-emerald-500 font-mono text-lg font-bold mb-4">{ticketId}</p><p className="text-zinc-400 text-sm mb-6">We have received your report. A moderator has been assigned to your case.<br /><span className="text-zinc-500 text-xs">Estimated response time: 2-4 hours.</span></p><button onClick={onClose} className="text-zinc-500 hover:text-white text-xs underline transition-colors">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

const Hero = ({ setActiveTab, onOpenInfo, forceMobile }) => (
  <div className="relative bg-zinc-950 pt-12 pb-16 border-b border-zinc-900 overflow-hidden min-h-[400px] flex flex-col justify-center">
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] animate-[pulse_8s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[10%] right-[20%] w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
    <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-900/10 backdrop-blur-md mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></span>
        <span className="text-[10px] font-mono text-emerald-100 uppercase tracking-[0.15em]">System Online</span>
      </div>
      <h1 className={`font-bold tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 drop-shadow-[0_0_35px_rgba(255,255,255,0.15)] ${forceMobile ? 'text-4xl' : 'text-6xl md:text-8xl'}`}>TRUST <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-blue-200">REDEFINED</span></h1>
      <p className={`max-w-md mx-auto text-zinc-400 mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 font-light ${forceMobile ? 'text-sm' : 'text-lg md:text-xl'}`}>The hardware marketplace powered by <span className="text-white font-medium">Escrow</span> & <span className="text-white font-medium">AI Verification</span>.</p>
      <div className={`flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 ${forceMobile ? 'flex-col px-4' : 'flex-col sm:flex-row'}`}>
        <button onClick={() => setActiveTab('marketplace')} className={`group relative bg-white text-black font-bold uppercase tracking-wider overflow-hidden rounded-sm transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] ${forceMobile ? 'px-6 py-3 text-sm' : 'px-10 py-4'}`}><span className="relative z-10 flex items-center justify-center gap-2">Enter Market <ArrowRight size={forceMobile ? 14 : 18} className="group-hover:translate-x-1 transition-transform" /></span></button>
        <button onClick={onOpenInfo} className={`bg-zinc-900/50 border border-zinc-700 text-white font-bold uppercase tracking-wider hover:bg-zinc-800 hover:border-zinc-500 transition-all rounded-sm backdrop-blur-sm ${forceMobile ? 'px-6 py-3 text-sm' : 'px-10 py-4'}`}>Protocol Specs</button>
      </div>
    </div>
  </div>
);


const Marketplace = ({ tier, trustScore, onStartTrade, onStartChat, onShowSecurity, forceMobile }) => {
  const [filter, setFilter] = useState('All');
  const filteredListings = filter === 'All' ? MOCK_LISTINGS : MOCK_LISTINGS.filter(item => item.category === filter);
  return (
    <div className="min-h-screen bg-zinc-950 pb-20 animate-in fade-in duration-500">
      <div className={`mx-auto px-4 pt-8 ${forceMobile ? 'max-w-full' : 'max-w-7xl sm:px-6 lg:px-8 pt-12'}`}>
        <div className={`flex flex-col justify-between mb-6 border-b border-zinc-800 pb-4 ${forceMobile ? '' : 'md:flex-row items-end mb-10 pb-6'}`}>
          <div className="animate-in slide-in-from-left-4 duration-700"><h1 className={`font-bold text-white tracking-tighter mb-1 ${forceMobile ? 'text-2xl' : 'text-4xl mb-2'}`}>MARKETPLACE</h1><p className={`text-zinc-500 font-mono ${forceMobile ? 'text-xs' : 'text-sm'}`}>REGION: CEBU_CITY</p></div>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">{['All', 'GPU', 'CPU', 'Peripherals'].map(cat => (<button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all whitespace-nowrap active:scale-95 duration-200 ${filter === cat ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-500'}`}>{cat}</button>))}</div>
        <div className={`grid gap-4 ${forceMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'}`}>{filteredListings.map((item, index) => (<div key={item.id} className="group bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}><div className="absolute top-2 left-2 z-10 flex flex-col gap-1">{item.sellerTier === 'official' && (<div className="bg-purple-500 text-white text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider shadow-lg flex items-center gap-1 animate-pulse"><Shield size={8} fill="currentColor" /> Official</div>)}{item.isAiCurated && item.sellerTier !== 'official' && (<div className="bg-emerald-500 text-black text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider shadow-lg flex items-center gap-1"><Zap size={8} /> Select</div>)}</div><div className={`relative overflow-hidden bg-zinc-800 ${forceMobile ? 'h-36' : 'h-48'}`}><img src={item.image} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" /></div><div className="p-3 flex flex-col flex-grow"><div className="flex justify-between items-start mb-1"><Badge tier={item.sellerTier} onClick={onShowSecurity} /><span className={`font-mono text-emerald-400 font-bold ${forceMobile ? 'text-xs' : 'text-sm'}`}>{formatCurrency(item.price)}</span></div><h3 className={`text-white font-bold mb-1 truncate group-hover:text-emerald-400 transition-colors ${forceMobile ? 'text-sm' : ''}`}>{item.title}</h3><p className="text-zinc-500 text-[10px] mb-2 line-clamp-1">{item.description}</p><p className="text-zinc-600 text-[9px] mb-3 uppercase flex items-center gap-1"><MapPin size={8} /> {item.location}</p><div className="mt-auto pt-3 border-t border-zinc-800 flex gap-2"><button onClick={() => onStartTrade(item)} className="flex-1 bg-zinc-100 hover:bg-emerald-400 text-black text-[10px] font-bold uppercase py-1.5 transition-all active:scale-95 flex items-center justify-center gap-1">Buy <Lock size={8} /></button><button onClick={() => onStartChat(item)} className="flex-1 border border-zinc-700 text-zinc-400 hover:text-white hover:border-white text-[10px] font-bold uppercase py-1.5 transition-all active:scale-95 flex items-center justify-center gap-1">Chat <MessageCircle size={8} /></button></div></div></div>))}</div>
      </div>
    </div>
  );
};


const Profile = ({ userTier, trustScore, onOpenVerify, onOpenDispute, onShowSecurity, forceMobile }) => (
  <div className="min-h-screen bg-zinc-950 pt-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className={`mx-auto px-4 ${forceMobile ? 'max-w-full' : 'max-w-4xl'}`}>
      <div className="relative bg-zinc-900 border border-zinc-800 p-6 mb-6 overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110"><Shield size={80} /></div>
        <div className={`flex items-center gap-4 relative z-10 ${forceMobile ? 'flex-col text-center' : 'flex-col md:flex-row gap-8'}`}>
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center border-2 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"><User size={28} className="text-zinc-400" /></div>
          <div className={forceMobile ? 'text-center' : 'text-center md:text-left'}><h1 className="text-xl font-bold text-white mb-1">Guest User</h1><div className="flex items-center justify-center gap-2 mb-3"><span className="text-zinc-500 text-xs font-mono">ID: 99-2810-X</span><Badge tier={userTier} onClick={onShowSecurity} /></div><button onClick={onOpenVerify} className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 px-3 py-1.5 uppercase font-bold tracking-wider hover:bg-emerald-500 hover:text-black active:scale-95 transition-all">{userTier === 'unverified' ? 'Start Verification' : 'Upgrade Tier'}</button></div>
          <div className={`bg-zinc-950 p-4 border border-zinc-800 text-center hover:border-emerald-500/50 transition-colors duration-300 ${forceMobile ? 'w-full mt-4' : 'ml-auto min-w-[160px]'}`}><p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Trust Score</p><p className="text-4xl font-mono font-bold text-emerald-500 animate-in zoom-in duration-500">{trustScore}</p><p className="text-zinc-600 text-[9px] mt-1">Top 15% of Buyers</p></div>
        </div>
      </div>
      <div className={`grid gap-4 ${forceMobile ? 'grid-cols-1' : 'md:grid-cols-2 gap-6'}`}>
        <div className="bg-zinc-900 border border-zinc-800 p-4 hover:-translate-y-1 transition-transform duration-300"><h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm"><Lock size={14} className="text-emerald-500" /> Active Escrows</h3><div className="text-center py-6 border border-dashed border-zinc-800 rounded"><p className="text-zinc-500 text-xs">No active transactions.</p><button className="text-emerald-500 text-[10px] font-bold uppercase mt-2 hover:underline">Start Shopping</button></div></div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 hover:-translate-y-1 transition-transform duration-300"><h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm"><HelpCircle size={14} className="text-emerald-500" /> Support</h3><p className="text-zinc-400 text-xs mb-4">Need help? Submit a ticket for assistance.</p><button onClick={onOpenDispute} className="w-full border border-zinc-700 hover:bg-zinc-800 text-white text-[10px] font-bold uppercase py-2.5 transition-all active:scale-95 flex items-center justify-center gap-2"><MessageCircle size={12} /> Submit Ticket</button></div>
      </div>
    </div>
  </div>
);


const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isMobileSimulated, setIsMobileSimulated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [userTier, setUserTier] = useState('unverified');
  const [showVerify, setShowVerify] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // New Settings State
  const [trustScore, setTrustScore] = useState(15);
  const [selectedItem, setSelectedItem] = useState(null);
  const [chatItem, setChatItem] = useState(null);

  // API Key State (persisted in localStorage)
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('verto_api_key') || "";
  });

  useEffect(() => {
    setTrustScore(15 + SYSTEM_CONFIG.tiers[userTier].scoreBonus);
  }, [userTier]);

  const handleContinueInChat = (item) => {
    setSelectedItem(null); // Close Escrow Modal
    setChatItem(item); // Open Chat
  };

  return (
    <>
      <div className={`bg-zinc-950 min-h-screen text-zinc-200 font-sans selection:bg-emerald-500 selection:text-black flex flex-col transition-all duration-500 ease-in-out ${isMobileSimulated ? 'max-w-[420px] h-[844px] mx-auto my-8 rounded-[3rem] border-[8px] border-zinc-900 shadow-2xl overflow-hidden ring-1 ring-zinc-800 transform translate-z-0' : 'w-full'}`}>
        {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
        <div className={isMobileSimulated ? "h-full w-full overflow-y-auto overflow-x-hidden scrollbar-hide relative" : "flex flex-col min-h-screen"}>
          <nav className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 transition-all duration-300">
            <div className={`mx-auto h-14 flex items-center justify-between ${isMobileSimulated ? 'px-4' : 'max-w-7xl px-4 sm:px-6 lg:px-8 h-16'}`}>
              <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveTab('home')}>
                <div className={`bg-emerald-500 flex items-center justify-center transform rotate-45 group-hover:rotate-90 transition-transform duration-500 ${isMobileSimulated ? 'w-6 h-6' : 'w-8 h-8'}`}><span className={`transform -rotate-45 group-hover:-rotate-90 transition-transform duration-500 font-bold text-black ${isMobileSimulated ? 'text-xs' : ''}`}>V</span></div>
                {!isMobileSimulated && <span className="font-bold tracking-tighter text-white group-hover:text-emerald-400 transition-colors">VERTO<span className="text-zinc-600 group-hover:text-zinc-400">EXCHANGE</span></span>}
              </div>
              <div className="flex items-center gap-2">
                {/* Desktop nav links (hidden when simulating mobile) */}
                {!isMobileSimulated && (
                  <div className="hidden md:flex items-center gap-8 mr-4">
                    {['Home', 'Marketplace', 'Profile'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`text-xs uppercase font-bold tracking-widest hover:text-emerald-400 transition-colors relative group ${activeTab === tab.toLowerCase() ? 'text-emerald-400' : 'text-zinc-500'}`}
                      >
                        {tab}
                        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full ${activeTab === tab.toLowerCase() ? 'w-full' : ''}`}></span>
                      </button>
                    ))}
                  </div>
                )}
                {/* Mobile simulator bottom tab bar placeholder - actual tabs */}
                {isMobileSimulated && (
                  <div className="flex items-center gap-1">
                    {[{ name: 'Home', icon: 'H' }, { name: 'Marketplace', icon: 'M' }, { name: 'Profile', icon: 'P' }].map(tab => (
                      <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name.toLowerCase())}
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded transition-colors ${activeTab === tab.name.toLowerCase() ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500 hover:text-white'}`}
                      >
                        {tab.name.substring(0, 4)}
                      </button>
                    ))}
                  </div>
                )}
                <button onClick={() => setShowSettings(true)} className="text-zinc-500 hover:text-white transition-colors p-1">
                  <Settings size={isMobileSimulated ? 16 : 20} />
                </button>
              </div>
            </div>
          </nav>


          <main className="flex-grow">
            {activeTab === 'home' && <Hero setActiveTab={setActiveTab} onOpenInfo={() => setShowInfo(true)} forceMobile={isMobileSimulated} />}
            {activeTab === 'marketplace' && (
              <Marketplace
                tier={userTier}
                trustScore={trustScore}
                onStartTrade={setSelectedItem}
                onStartChat={setChatItem}
                onShowSecurity={() => setShowSecurityModal(true)}
                forceMobile={isMobileSimulated}
              />
            )}
            {activeTab === 'profile' && (
              <Profile
                userTier={userTier}
                trustScore={trustScore}
                onOpenVerify={() => setShowVerify(true)}
                onOpenDispute={() => setShowDispute(true)}
                onShowSecurity={() => setShowSecurityModal(true)}
                forceMobile={isMobileSimulated}
              />
            )}
          </main>
          <footer className="border-t border-zinc-900 py-8 bg-zinc-950 text-center">
            <p className="text-zinc-600 text-xs font-mono">© 2025 VERTO EXCHANGE. DESIGNED FOR CEBU.</p>
          </footer>
        </div>

        <VerificationModal
          isOpen={showVerify}
          onClose={() => setShowVerify(false)}
          currentTier={userTier}
          onUpgrade={setUserTier}
        />
        <TicketSupportModal isOpen={showDispute} onClose={() => setShowDispute(false)} />
        <HowItWorksModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
        <SecurityLevelsModal isOpen={showSecurityModal} onClose={() => setShowSecurityModal(false)} />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />

        <EscrowModal
          isOpen={!!selectedItem}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onReportIssue={() => setShowDispute(true)}
          onShowSecurity={() => setShowSecurityModal(true)}
          onContinueInChat={handleContinueInChat}
          apiKey={apiKey}
        />

        {chatItem && (
          <ChatWindow
            item={chatItem}
            onClose={() => setChatItem(null)}
            onLaunchTrade={(negotiatedItem) => {
              setChatItem(null);
              setSelectedItem(negotiatedItem);
            }}
            apiKey={apiKey}
          />
        )}

        <GlobalAssistant apiKey={apiKey} />


      </div>

      {/* Mobile Simulator Toggle */}
      <button
        onClick={() => setIsMobileSimulated(!isMobileSimulated)}
        className={`fixed bottom-6 right-24 z-[100] p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border ${isMobileSimulated ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'}`}
        title="Toggle Mobile Simulator"
      >
        <Smartphone size={24} />
      </button>
    </>
  );
};

export default App;