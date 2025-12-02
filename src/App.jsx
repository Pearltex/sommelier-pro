import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Wine, Beer, GlassWater, Utensils, Moon, Sun, Plus, Search, BarChart3,
  Home, Archive, Save, X, CheckCircle2, MapPin, Users, Calendar, ChevronDown,
  ChevronUp, Star, FileText, Pencil, Trash2, Camera, DownloadCloud, UploadCloud,
  Database, Settings, Sparkles, Bot, Loader2, ShoppingBag, Store, ScrollText,
  ClipboardCheck, Eye, Wind, Activity, Map, PieChart, Award, Filter, Quote, 
  Minus, Copy, Clock, Heart, ArrowUpDown, ArrowLeft, Image as ImageIcon, ChevronRight, 
  FileSpreadsheet, Printer, Info
} from 'lucide-react';

const Icons = {
  Wine, Beer, GlassWater, Utensils, Moon, Sun, Plus, Search, BarChart3,
  Home, Archive, Save, X, CheckCircle2, MapPin, Users, Calendar, ChevronDown,
  ChevronUp, Star, FileText, Pencil, Trash2, Camera, DownloadCloud, UploadCloud,
  Database, Settings, Sparkles, Bot, Loader2, ShoppingBag, Store, ScrollText,
  ClipboardCheck, Eye, Wind, Activity, Map, PieChart, Award, Filter, Quote, 
  Minus, Copy, Clock, Heart, ArrowUpDown, ArrowLeft, Image: ImageIcon, ChevronRight, 
  FileSpreadsheet, Printer, Info
};

const APP_TITLE = "SOMMELIER PRO";

const FLAVOR_TAGS = ["Fruttato", "Floreale", "Minerale", "Speziato", "Erbaceo", "Tostato", "Etereo", "Dolce", "Tannico", "Fresco", "Sapido", "Caldo", "Luppolato", "Maltato", "Torbatura", "Affumicato"];

// --- DATABASE TERMINI AIS COMPLETO ---
const AIS_TERMS = {
    LIMPIDEZZA: ["Velato", "Abb. Limpido", "Limpido", "Cristallino", "Brillante"],
    // Colori
    COLORE_ROSSO: ["Porpora", "Rubino", "Granato", "Aranciato"],
    COLORE_BIANCO: ["Verdolino", "Paglierino", "Dorato", "Ambrato"],
    COLORE_ROSATO: ["Tenue", "Cerasuolo", "Chiaretto"],
    COLORE_ROSATO_2: ["Fiore di pesco", "Ramato", "Salmone", "Corallo", "Peonia"], // Per la 2.0
    
    CONSISTENZA: ["Fluido", "Poco Cons.", "Abb. Cons.", "Consistente", "Viscoso"],
    
    // Effervescenza Visiva Dettagliata
    CATENELLE: ["Scarse", "Mediamente numerose", "Numerose"],
    ASCESA: ["Lenta", "Media", "Rapida"],
    GRANA_BOL: ["Grossolane", "Mediamente fini", "Fini"],
    PERS_BOL: ["Evanescenti", "Mediamente persistenti", "Persistenti"],

    // Olfattivo
    INTENSITA: ["Carente", "Poco Int.", "Abb. Int.", "Intenso", "Molto Int."],
    COMPLESSITA: ["Carente", "Poco Comp.", "Abb. Comp.", "Complesso", "Ampio"],
    QUALITA: ["Comune", "Poco Fine", "Abb. Fine", "Fine", "Eccellente"],
    DESCRITTORI: ["Aromatico", "Vinoso", "Floreale", "Fruttato", "Fragrante", "Erbaceo", "Minerale", "Speziato", "Etereo", "Tostato"],
    
    // Gustativo
    ZUCCHERI: ["Secco", "Abboccato", "Amabile", "Dolce", "Stucchevole"],
    ALCOLI: ["Leggero", "Poco Caldo", "Abb. Caldo", "Caldo", "Alcolico"],
    POLIALCOLI: ["Spigoloso", "Poco Morbido", "Abb. Morbido", "Morbido", "Pastoso"],
    ACIDI: ["Piatto", "Poco Fresco", "Abb. Fresco", "Fresco", "Acidulo"],
    TANNINI: ["Molle", "Poco Tannico", "Abb. Tannico", "Tannico", "Astringente"],
    MINERALI: ["Scipito", "Poco Sapido", "Abb. Sapido", "Sapido", "Salato"],
    CORPO: ["Magro", "Debole", "Di Corpo", "Robusto", "Pesante"],
    EQUILIBRIO: ["Poco Equil.", "Abb. Equil.", "Equilibrato"],
    INTENSITA_GUS: ["Carente", "Poco Int.", "Abb. Int.", "Intenso", "Molto Int."],
    PERSISTENZA: ["Corto", "Poco Pers.", "Abb. Pers.", "Persistente", "Molto Pers."],
    QUALITA_GUS: ["Comune", "Poco Fine", "Abb. Fine", "Fine", "Eccellente"],
    
    // Effervescenza Gustativa
    EFFERVESCENZA_GUSTO: ["Delicata", "Moderata", "Vivace", "Esuberante", "Incisiva"],

    EVOLUZIONE: ["Immaturo", "Giovane", "Pronto", "Maturo", "Vecchio"],
    ARMONIA: ["Poco Arm.", "Abb. Arm.", "Armonico"],
    
    // Termini specifici 2.0 (dove differiscono)
    ROTONDITA: ["Poco morbido", "Moderatamente morbido", "Morbido", "Vellutato", "Pastoso"],
    TANNICITA_2: ["Poco tannico", "Moderatamente tannico", "Tannico", "Tenace", "Astringente"],
    ACIDITA_2: ["Poco fresco", "Moderatamente fresco", "Fresco", "Vibrante", "Acidula"],
    SAPIDITA_2: ["Poco sapido", "Moderatamente sapido", "Sapido", "Saporito", "Salato"],
    STRUTTURA_2: ["Di medio corpo", "Di corpo pieno", "Robusto"],
    QUALITA_TOT_2: ["Accettabile", "Buono", "Distinto", "Ottimo", "Eccellente"]
};

// --- MERCADINI CONFIG ---
const MERCADINI_FOOD_CONFIG = [
    { id: 'succulenza', label: 'Succulenza' },
    { id: 'untuosita', label: 'Untuosità' },
    { id: 'persistenza_cibo', label: 'Persistenza G.O.' },
    { id: 'speziatura', label: 'Speziatura' },
    { id: 'aromaticita', label: 'Aromaticità' },
    { id: 'sapidita_cibo', label: 'Sapidità' },
    { id: 'amaro', label: 'T. Amarognola' },
    { id: 'acido', label: 'T. Acida' },
    { id: 'dolcezza_cibo', label: 'Dolcezza' },
    { id: 'grassezza', label: 'Grassezza' },
    { id: 't_dolce', label: 'T. Dolce' }
];

// --- AI ENGINE ---
const callGemini = async (apiKey, prompt, base64Image = null) => {
    if (!apiKey) throw new Error("API Key mancante.");
    const MODEL = "gemini-2.5-flash"; 
    const parts = [{ text: prompt }];
    if (base64Image) {
        const imageContent = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;
        parts.push({ inline_data: { mime_type: "image/jpeg", data: imageContent } });
    }
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: parts }] })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        if (!data.candidates || !data.candidates[0]) throw new Error("Nessuna risposta.");
        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const s = text.indexOf('{'); const e = text.lastIndexOf('}');
        const sa = text.indexOf('['); const ea = text.lastIndexOf(']');
        let start = -1, end = -1;
        if (s !== -1 && (sa === -1 || s < sa)) { start = s; end = e; } else if (sa !== -1) { start = sa; end = ea; }
        if (start !== -1 && end !== -1) text = text.substring(start, end + 1);
        return JSON.parse(text);
    } catch (error) { throw new Error(error.message); }
};

// --- UTILS ---
const resizeImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH; canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            }; img.src = e.target.result;
        }; reader.readAsDataURL(file);
    });
};

const getItemStyle = (type) => {
    const t = (type || "").toLowerCase();
    if (t.includes("rosso")) return "bg-red-50 border-red-100 text-red-900 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-200";
    if (t.includes("bianco")) return "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-200";
    if (t.includes("boll") || t.includes("spumante") || t.includes("champagne")) return "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-200";
    if (t.includes("rosato") || t.includes("cerasuolo") || t.includes("chiaretto")) return "bg-pink-50 border-pink-200 text-pink-900 dark:bg-pink-900/20 dark:border-pink-900/50 dark:text-pink-200";
    if (t.includes("birra")) return "bg-orange-100 border-orange-300 text-orange-900 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-200";
    if (t.includes("spirit") || t.includes("distillato")) return "bg-slate-200 border-slate-300 text-slate-900 dark:bg-slate-700 dark:border-slate-500 dark:text-slate-200";
    return "bg-white border-gray-100 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200";
};

// --- COMPONENTS ---
const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, isLoading = false }) => {
    const styles = {
        primary: "bg-slate-900 text-white shadow-slate-300 dark:bg-indigo-600 dark:text-white dark:shadow-none",
        success: "bg-emerald-600 text-white shadow-emerald-200 dark:bg-emerald-600 dark:shadow-none",
        danger: "bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50",
        ghost: "bg-transparent text-gray-500 hover:bg-gray-100 shadow-none dark:text-gray-400 dark:hover:bg-slate-800",
        ai: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-purple-200 dark:shadow-none"
    };
    return ( <button onClick={onClick} disabled={isLoading} className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed ${styles[variant]} ${className}`}> {isLoading ? <Icons.Loader2 size={18} className="animate-spin"/> : (Icon && <Icon size={18} />)} {children} </button> );
};

const Input = ({ label, ...props }) => ( <div className="mb-3 w-full"> {label && <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide dark:text-gray-500">{label}</label>} <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-800 focus:bg-white transition-colors disabled:bg-gray-100 disabled:text-gray-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-indigo-500" {...props} /> </div> );
const Select = ({ label, options, customBg, ...props }) => ( 
    <div className="mb-3 w-full"> 
        {label && <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide dark:text-gray-500">{label}</label>} 
        <select className={`w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-indigo-500 ${customBg ? '' : 'bg-white'}`} style={customBg ? {backgroundColor: customBg} : {}} {...props}> 
            <option value="">-- Seleziona --</option> 
            {options.map(o => <option key={o} value={o}>{o}</option>)} 
        </select> 
    </div> 
);
const Card = ({ children, className = '', onClick }) => ( <div onClick={onClick} className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800 w-full ${className} ${onClick ? 'cursor-pointer active:bg-gray-50 dark:active:bg-slate-800' : ''}`}>{children}</div> );

// --- COMPONENTI SPECIALI MERCADINI ---

const AmbiguousInput = ({ label, value, onChange, labels, textValue }) => {
    const val = parseInt(value) || 0;
    let statusText = textValue || ""; 
    let needsClarification = false;
    
    if (!textValue) {
        if (val > 0 && val < 4) statusText = labels[0];
        else if (val > 4 && val < 7) statusText = labels[1];
        else if (val > 7) statusText = labels[2];
        else if (val === 4 || val === 7) needsClarification = true;
    }

    useEffect(() => {
        if (val !== 4 && val !== 7 && textValue) onChange(val, null);
    }, [val]);

    return (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">{label}</label>
                <span className="text-lg font-black text-slate-800 dark:text-white">{val}</span>
            </div>
            <input type="range" min="0" max="10" step="1" className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400" value={val} onChange={(e) => onChange(e.target.value, null)} />
            <div className="mt-2 h-8">
                {(statusText) && (<div className="text-center text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 py-1 rounded">{statusText}</div>)}
                {needsClarification && !statusText && (
                    <div className="flex gap-1 animate-in fade-in slide-in-from-top-1">
                        <button onClick={() => onChange(val, labels[val === 4 ? 0 : 1])} className="flex-1 py-1 text-[10px] font-bold bg-white border border-indigo-200 rounded text-indigo-600 hover:bg-indigo-50">{labels[val === 4 ? 0 : 1]}</button>
                        <button onClick={() => onChange(val, labels[val === 4 ? 1 : 2])} className="flex-1 py-1 text-[10px] font-bold bg-white border border-indigo-200 rounded text-indigo-600 hover:bg-indigo-50">{labels[val === 4 ? 1 : 2]}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const PairingGraphReal = ({ values, onChange, foodName, wineName, showEffervescence, showTannins }) => {
    const size = 360;
    const center = size / 2;
    const radius = 130;

    const GROUPS = [
        // --- VINO (Y Invertita) ---
        { type: 'wine', angle: -5, labelPos: 'right', align: 'start', items: [{id: 'intensita', l: 'Intensità G.O.'}, {id: 'pai', l: 'PAI'}] },
        { type: 'wine', angle: 5, labelPos: 'left', align: 'end', items: [{id: 'dolcezza_vino', l: 'Dolcezza'}, {id: 'morbidezza', l: 'Morbidezza'}] },
        { type: 'wine', angle: 115, labelPos: 'right', align: 'start', items: [{id: 'acidita', l: 'Acidità'}, ...(showEffervescence ? [{id: 'effervescenza', l: 'Effervescenza'}] : []), {id: 'sapidita_vino', l: 'Sapidità'}] },
        { type: 'wine', angle: 245, labelPos: 'left', align: 'end', items: [{id: 'alcol', l: 'Alcolicità'}, ...(showTannins ? [{id: 'tannicita', l: 'Tannicità'}] : [])] },
        
        // --- CIBO (Opposti) ---
        { type: 'food', angle: 175, labelPos: 'left', align: 'end', items: [{id: 'persistenza_cibo', l: 'Persistenza'}, {id: 'speziatura', l: 'Speziatura'}, {id: 'aromaticita', l: 'Aromaticità'}] },
        { type: 'food', angle: 185, labelPos: 'right', align: 'start', items: [{id: 'sapidita_cibo', l: 'Sapidità'}, {id: 'amaro', l: 'T. Amarognola'}, {id: 'acido', l: 'T. Acida'}, {id: 'dolcezza_cibo', l: 'Dolcezza'}] },
        { type: 'food', angle: 300, labelPos: 'right', align: 'end', items: [{id: 't_dolce', l: 'T. Dolce'}, {id: 'grassezza', l: 'Grassezza'}] },
        { type: 'food', angle: 60, labelPos: 'left', align: 'start', items: [{id: 'succulenza', l: 'Succulenza'}, {id: 'untuosita', l: 'Untuosità'}] },
    ];

    const getPolyPoints = (targetType) => {
        let points = [];
        const sortedGroups = GROUPS.filter(g => g.type === targetType).sort((a, b) => a.angle - b.angle);
        sortedGroups.forEach(group => {
            const maxVal = Math.max(0, ...group.items.map(i => values[i.id] || 0));
            const rad = (group.angle - 90) * (Math.PI / 180);
            const r = (maxVal / 10) * radius;
            const x = center + r * Math.cos(rad);
            const y = center + r * Math.sin(rad);
            points.push(`${x},${y}`);
        });
        return points.join(" ");
    };

    return (
        <div id="printable-graph" className="relative w-full bg-white p-2 rounded-xl overflow-visible select-none print:p-0">
            <div className="flex justify-between border-b pb-2 mb-4 text-xs font-bold print:mb-8 print:text-xl">
                <span className="text-orange-600">{foodName || "PIATTO"}</span>
                <span className="text-indigo-600">{wineName || "VINO"}</span>
            </div>
            <div className="relative h-[480px] w-full">
                {GROUPS.map((group, gIdx) => {
                    const rad = (group.angle - 90) * (Math.PI / 180);
                    const baseX = center + radius * Math.cos(rad);
                    const baseY = center + radius * Math.sin(rad);
                    const offsetX = Math.cos(rad) * 20;
                    const offsetY = Math.sin(rad) * 20;
                    return (
                        <div key={gIdx} className="absolute z-20 flex flex-col gap-1" style={{ left: baseX + offsetX, top: baseY + offsetY, transform: `translate(${group.align === 'end' ? '-100%' : '0'}, ${group.angle > 90 && group.angle < 270 ? '0' : '-50%'})`, alignItems: group.align === 'end' ? 'flex-end' : 'flex-start' }}>
                            {group.items.map((item) => (
                                <div key={item.id} className={`flex items-center gap-1 ${group.align === 'end' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <span className={`text-[9px] font-bold uppercase whitespace-nowrap ${group.type === 'food' ? 'text-orange-600' : 'text-indigo-600'}`}>{item.l}</span>
                                    <input type="number" min="0" max="10" className={`w-7 h-6 text-center text-xs font-bold border-2 rounded focus:outline-none ${group.type === 'food' ? 'border-orange-300 text-orange-800' : 'border-indigo-300 text-indigo-800'}`} value={values[item.id] || ''} onChange={(e) => { const val = parseInt(e.target.value); if (!isNaN(val) && val >= 0 && val <= 10) onChange(item.id, val); else if (e.target.value === '') onChange(item.id, 0); }} />
                                </div>
                            ))}
                        </div>
                    );
                })}
                <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 pointer-events-none z-10 overflow-visible">
                    {Array.from({length: 10}).map((_, i) => ( <circle key={i} cx={center} cy={center} r={radius * ((i+1)/10)} fill="none" stroke="#cbd5e1" strokeWidth="0.5" /> ))}
                    {GROUPS.map((g, i) => { const rad = (g.angle - 90) * (Math.PI / 180); return ( <line key={i} x1={center} y1={center} x2={center + radius * Math.cos(rad)} y2={center + radius * Math.sin(rad)} stroke={g.type === 'food' ? '#fdba74' : '#a5b4fc'} strokeWidth="1.5" /> ); })}
                    <polygon points={getPolyPoints('food')} fill="rgba(249, 115, 22, 0.4)" stroke="#ea580c" strokeWidth="2" />
                    <polygon points={getPolyPoints('wine')} fill="rgba(99, 102, 241, 0.4)" stroke="#4f46e5" strokeWidth="2" />
                </svg>
            </div>
        </div>
    );
};

const MercadiniEvaluation = ({ label, value, onChange, labels }) => {
    const val = parseInt(value) || 0;
    let text = "";
    let showSelect = false;

    if (val === 4 || val === 7) showSelect = true;
    else if (val > 0 && val < 4) text = labels[0];
    else if (val > 4 && val < 7) text = labels[1];
    else if (val > 7) text = labels[2];

    return (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 border border-gray-200 dark:border-slate-700 rounded-xl mb-2">
            <div className="w-1/3 text-xs font-bold uppercase text-slate-500">{label}</div>
            <div className="w-1/3 flex justify-center">
                <input type="number" min="0" max="10" className="w-10 h-10 text-center font-black text-lg border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none dark:bg-slate-800 dark:text-white" value={val} onChange={(e) => { const v = parseInt(e.target.value); if(!isNaN(v) && v >=0 && v<=10) onChange(v, null); }} />
            </div>
            <div className="w-1/3 flex justify-end">
                {showSelect ? (
                    <select className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded p-1" onChange={(e) => onChange(val, e.target.value)}>
                        <option value="">Scegli...</option>
                        <option value={labels[val===4?0:1]}>{labels[val===4?0:1]}</option>
                        <option value={labels[val===4?1:2]}>{labels[val===4?1:2]}</option>
                    </select>
                ) : (
                    <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded">{text}</span>
                )}
            </div>
        </div>
    );
};

// --- MAIN APP ---
function App() {
    const [tab, setTab] = useState('home');
    const [session, setSession] = useState(null); 
    const [showSettings, setShowSettings] = useState(false);
    const [darkMode, setDarkMode] = useState(() => { try { return localStorage.getItem('somm_theme') === 'dark'; } catch { return false; } });
    const [apiKey, setApiKey] = useState(() => { try { return localStorage.getItem('somm_apikey') || ""; } catch { return ""; } });
    const [logs, setLogs] = useState(() => { try { return JSON.parse(localStorage.getItem('somm_logs')) || []; } catch { return []; } });
    const [cellar, setCellar] = useState(() => { try { return JSON.parse(localStorage.getItem('somm_cellar')) || []; } catch { return []; } });

    useEffect(() => {
        localStorage.setItem('somm_logs', JSON.stringify(logs));
        localStorage.setItem('somm_cellar', JSON.stringify(cellar));
        localStorage.setItem('somm_apikey', apiKey);
        if (darkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('somm_theme', 'dark'); } else { document.documentElement.classList.remove('dark'); localStorage.setItem('somm_theme', 'light'); }
    }, [logs, cellar, apiKey, darkMode]);

    const goBack = () => {
        if (session) {
            if (session.step === 'adding') setSession({ ...session, step: 'context' });
            else if (session.step === 'context') { setSession(null); setTab('home'); }
            else if (session.step === 'finish') setSession({ ...session, step: 'context' });
        } else { setTab('home'); }
    };

    const startSession = (mode, initialItemData = null) => {
        setSession({ 
            id: Date.now(), mode, date: new Date().toISOString().split('T')[0], 
            locName: '', locCity: '', locRegion: '', locCountry: '', 
            friends: [], items: initialItemData ? [initialItemData] : [], 
            step: initialItemData ? 'adding' : (mode === 'Acquisto' ? 'adding' : 'context')
        });
        setTab('session');
    };

    const editSession = (log) => { setSession({ ...log, step: 'context' }); setTab('session'); };
    const deleteSession = (id) => { if(confirm("Eliminare?")) setLogs(logs.filter(l => l.id !== id)); };
    
    const saveSession = (final) => {
        if(final.mode === 'Acquisto') {
            const isWish = final.items.some(i => i.isWishlist);
            const newBottles = final.items.map(i => ({
                id: Date.now() + Math.random(), ...i, q: isWish ? 0 : (i.q || 1)
            }));
            setCellar([...cellar, ...newBottles]);
            alert(isWish ? "Aggiunto alla Wishlist! ❤️" : "Aggiunto in Cantina! 📦");
            setSession(null); setTab('cantina');
            return;
        }
        const idx = logs.findIndex(l => l.id === final.id);
        if (idx >= 0) { const u = [...logs]; u[idx] = final; setLogs(u); } else { setLogs([final, ...logs]); }
        setSession(null); setTab('history');
    };

    const exportCSV = () => {
        let csvContent = "\uFEFFData,Vino,Produttore,Tipologia,Prezzo,Voto\n"; 
        logs.forEach(l => {
            l.items.forEach(i => {
                csvContent += `"${l.date}","${i.wine}","${i.prod}","${i.type}","${i.price || ''}","${i.votePersonal || ''}"\n`;
            });
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "sommelier_export.csv";
        link.click();
    };

    const exportBackup = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ logs, cellar, version: "30.0" }));
        const a = document.createElement('a'); a.href = dataStr; a.download = "somm_backup.json"; document.body.appendChild(a); a.click(); a.remove();
    };
    const importBackup = (e) => {
        const file = e.target.files[0]; if(!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try { const j = JSON.parse(ev.target.result); if(confirm("Sovrascrivere dati?")) {
                if(j.logs) localStorage.setItem('somm_logs', JSON.stringify(j.logs));
                if(j.cellar) localStorage.setItem('somm_cellar', JSON.stringify(j.cellar));
                window.location.reload();
            }} catch(x){alert("Errore file");}
        }; reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #printable-graph, #printable-graph * { visibility: visible; }
                    #printable-graph { position: absolute; left: 0; top: 0; width: 100%; height: 100%; margin: 0; padding: 20px; border: none; transform: scale(1); background: white !important; color: black !important; }
                    #printable-graph input { border: 1px solid black !important; color: black !important; background: transparent !important; }
                    #printable-graph svg { overflow: visible; }
                }
            `}</style>

            <div className="w-full max-w-md h-[100dvh] bg-slate-50 dark:bg-slate-950 flex flex-col relative shadow-2xl overflow-hidden border-x border-gray-200 dark:border-slate-800">
                
                <div className="z-50 px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
                    <div className="flex items-center gap-2">
                        {tab !== 'home' && <button onClick={goBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"><Icons.ArrowLeft size={20}/></button>}
                        <h1 className="text-lg font-black tracking-tight text-slate-800 dark:text-white truncate max-w-[200px]">{APP_TITLE}</h1>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800">
                            {darkMode ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}
                        </button>
                        <button onClick={() => setShowSettings(true)} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"><Icons.Settings size={20}/></button>
                    </div>
                </div>

                {showSettings && (
                    <div className="absolute inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                        <Card className="w-full max-w-sm animate-in zoom-in-95 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl border border-gray-200 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white"><Icons.Sparkles size={18} className="text-indigo-500"/> Impostazioni</h3>
                                <button onClick={() => setShowSettings(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><Icons.X size={20}/></button>
                            </div>
                            <Input label="Gemini API Key" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="AIzaSy..." />
                            <Button onClick={() => setShowSettings(false)} variant="primary">Salva</Button>
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
                                <button onClick={exportCSV} className="w-full p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center gap-2 font-bold text-sm text-emerald-700 dark:text-emerald-400"><Icons.FileSpreadsheet size={16} /> Esporta Excel (CSV)</button>
                                <button onClick={exportBackup} className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center gap-2 font-bold text-sm text-slate-600 dark:text-slate-400"><Icons.DownloadCloud size={16} /> Backup Dati</button>
                                <label className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center gap-2 font-bold text-sm text-slate-600 dark:text-slate-400 cursor-pointer"><Icons.UploadCloud size={16} /> Ripristina<input type="file" hidden accept=".json" onChange={importBackup} /></label>
                            </div>
                        </Card>
                    </div>
                )}

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 w-full relative scroll-smooth">
                    {tab === 'home' && <HomeView startSession={startSession} logs={logs} cellar={cellar} setTab={setTab} />}
                    {tab === 'cantina' && <CellarView cellar={cellar} setCellar={setCellar} startSession={startSession} apiKey={apiKey} />}
                    {tab === 'history' && <HistoryView logs={logs} onEdit={editSession} onDelete={deleteSession} startSession={startSession} />}
                    {tab === 'stats' && <StatsView logs={logs} cellar={cellar} />}
                    {tab === 'session' && session && <SessionManager session={session} setSession={setSession} onSave={saveSession} onCancel={goBack} apiKey={apiKey} />}
                    <div className="h-6"></div>
                </main>

                {(!session || tab !== 'session') && (
                    <nav className="shrink-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 h-16 flex justify-around items-center w-full z-50">
                        <NavItem icon={Icons.Home} label="Home" active={tab === 'home'} onClick={() => setTab('home')} />
                        <NavItem icon={Icons.Archive} label="Cantina" active={tab === 'cantina'} onClick={() => setTab('cantina')} />
                        <NavItem icon={Icons.Search} label="Diario" active={tab === 'history'} onClick={() => setTab('history')} />
                        <NavItem icon={Icons.BarChart3} label="Stats" active={tab === 'stats'} onClick={() => setTab('stats')} />
                    </nav>
                )}

            </div>
        </div>
    );
}

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active ? 'text-slate-900 dark:text-white' : 'text-gray-300 dark:text-slate-600'}`}>
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);

function HomeView({ startSession, logs, cellar, setTab }) {
    const totalSpent = logs.reduce((acc, l) => acc + (l.bill || 0), 0);
    return (
        <div className="space-y-6">
            <div className="bg-slate-900 dark:bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-300 dark:shadow-none relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-slate-400 dark:text-indigo-300 text-xs font-bold uppercase tracking-widest">Investimento Totale</p>
                    <h2 className="text-4xl font-black tracking-tight mt-1">€{totalSpent.toLocaleString()}</h2>
                    <div className="flex gap-3 mt-4">
                        <span onClick={() => setTab('history')} className="cursor-pointer hover:underline opacity-90 hover:opacity-100 text-xs font-bold flex items-center gap-2"><Icons.Wine size={12} className="text-pink-500"/> {logs.length} Eventi</span>
                        <span onClick={() => setTab('cantina')} className="cursor-pointer hover:underline opacity-90 hover:opacity-100 text-xs font-bold flex items-center gap-2"><Icons.Archive size={12} className="text-emerald-500"/> {cellar.length} Bottiglie</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {[{ l: "Degustazione", i: Icons.Wine, c: "bg-pink-50 text-pink-900 dark:bg-pink-900/30 dark:text-pink-200 dark:border-pink-900/50" }, { l: "Pranzo", i: Icons.Utensils, c: "bg-emerald-50 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-900/50" }, { l: "Aperitivo", i: Icons.Sun, c: "bg-orange-50 text-orange-900 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-900/50" }, { l: "Cena", i: Icons.Moon, c: "bg-indigo-50 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-900/50" }].map(m => (
                    <button key={m.l} onClick={() => startSession(m.l)} className={`${m.c} p-5 rounded-2xl flex flex-col items-center gap-2 font-bold transition-transform active:scale-95 border border-transparent hover:border-current shadow-sm dark:shadow-none`}><m.i size={28} /> <span>{m.l}</span></button>
                ))}
                <button onClick={() => startSession('Acquisto')} className="col-span-2 bg-slate-800 dark:bg-slate-700 text-white p-5 rounded-2xl flex flex-row items-center justify-center gap-3 font-bold transition-transform active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none">
                    <Icons.ShoppingBag size={24} /> <span>Acquisto / Cantina Rapida</span>
                </button>
            </div>
        </div>
    );
}

function SessionManager({ session, setSession, onSave, onCancel, apiKey }) {
    const [step, setStep] = useState(session.step);
    const [item, setItem] = useState(session.items[0] || {});
    const [tempGrape, setTempGrape] = useState("");
    const [tempPerc, setTempPerc] = useState("");
    const [tempFriend, setTempFriend] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aisTab, setAisTab] = useState(null);
    const [sommOpen, setSommOpen] = useState(false); 
    const [pairCounts, setPairCounts] = useState({ Rosso: 0, Bianco: 0, Bollicine: 0, Rosato: 0, Birra: 0, Spirit: 0 });
    const [pairingSuggestions, setPairingSuggestions] = useState([]);
    
    // GRAFICO MERCADINI STATE
    const [pairingValuesFood, setPairingValuesFood] = useState({});
    const [pairingValuesWine, setPairingValuesWine] = useState({});
    
    // STATO AMBIGUITA' STRUTTURA
    // structure/body/harmony value is stored in item state

    const fileInput = useRef(null);

    // LOGICHE DINAMICHE
    const getColorOptions = (type) => {
        const t = (type || "").toLowerCase();
        if (t.includes("bianco") || t.includes("bollicine") || t.includes("spumante") || t.includes("champagne")) return AIS_TERMS.COLORE_BIANCO;
        if (t.includes("rosato") || t.includes("cerasuolo") || t.includes("chiaretto")) return AIS_TERMS.COLORE_ROSATO;
        if (t.includes("rosato") || t.includes("cerasuolo") || t.includes("chiaretto")) return AIS_TERMS.COLORE_ROSATO_2; // Per la 2.0
        return AIS_TERMS.COLORE_ROSSO; 
    };
    const showEffervescence = (type) => { const t = (type || "").toLowerCase(); return t.includes("bollicin") || t.includes("spumante") || t.includes("champagne") || t.includes("prosecco") || t.includes("franciacorta") || t.includes("trento"); };
    const showTannins = (type) => { const t = (type || "").toLowerCase(); return t.includes("rosso") || t.includes("rosato") || t.includes("cerasuolo"); };

    const handleGeoFill = async () => {
        if (!session.locCity) return alert("Scrivi una città!");
        setIsAiLoading(true);
        try {
            const prompt = `Dato la città "${session.locCity}", restituisci JSON: {"r": "Regione", "c": "Stato"}`;
            const data = await callGemini(apiKey, prompt);
            setSession(prev => ({ ...prev, locRegion: data.r, locCountry: data.c }));
        } catch (e) { alert(e.message); } finally { setIsAiLoading(false); }
    };

    const handleWineFill = async () => {
        if (!item.wine && (!item.photos || item.photos.length === 0)) return alert("Nome o Foto necessari!");
        setIsAiLoading(true);
        try {
            const prompt = `Analizza vino "${item.wine || ''}". Restituisci JSON STRETTO: {"wine": "Nome Corretto", "prod": "Produttore", "year": "Anno", "type": "Rosso/Bianco/ecc", "method": "Metodo", "alcohol": 13.5, "price": 20, "grapes": [{"name": "Uva", "perc": 100}], "drinkFrom": "2024", "drinkTo": "2028"}`;
            const img = item.photos && item.photos.length > 0 ? item.photos[0] : null;
            const data = await callGemini(apiKey, prompt, img);
            setItem(prev => ({ ...prev, ...data }));
        } catch (e) { alert(e.message); } finally { setIsAiLoading(false); }
    };

    const handleFoodPairing = async () => {
        if (!item.food) return alert("Inserisci un piatto!");
        let reqs = [];
        Object.entries(pairCounts).forEach(([type, count]) => { if(count > 0) reqs.push(`${count} ${type}`); });
        const reqString = reqs.length > 0 ? "Voglio: " + reqs.join(", ") : "Consigliami tu.";
        setIsAiLoading(true);
        try {
            const prompt = `Piatto: "${item.food}". Richiesta: ${reqString}. Restituisci JSON Array: [{"name": "Vino", "type": "Rosso/Bianco", "reason": "Motivo"}]`;
            const data = await callGemini(apiKey, prompt, null);
            setPairingSuggestions(Array.isArray(data) ? data : (data.suggestions || []));
        } catch (e) { alert(e.message); } finally { setIsAiLoading(false); }
    };

    const updateCount = (type, delta) => setPairCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));
    const currentGrapeTotal = (item.grapes || []).reduce((acc, g) => acc + parseInt(g.perc || 0), 0);
    const addGrape = () => { if (!tempGrape || !tempPerc) return; setItem(prev => ({ ...prev, grapes: [...(prev.grapes || []), { name: tempGrape, perc: parseInt(tempPerc) }] })); setTempGrape(""); setTempPerc(""); };
    const removeGrape = (idx) => setItem(prev => ({ ...prev, grapes: prev.grapes.filter((_, i) => i !== idx) }));
    const handlePhotoAdd = async (e) => { 
        const files = Array.from(e.target.files);
        for (const f of files) {
            const b64 = await resizeImage(f);
            setItem(prev => ({ ...prev, photos: [...(prev.photos || []), b64] }));
        }
    };
    const removePhoto = (idx) => setItem(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }));
    const addItem = () => { if(session.mode === 'Acquisto') onSave({ ...session, items: [item] }); else { setSession(prev => ({ ...prev, items: [...prev.items, item] })); setItem({}); setStep('context'); } };
    
    // EXPORT PDF (STAMPA)
    const handlePrint = () => { window.print(); };

    // EXPORT EXCEL PAIRING
    const handleExportPairing = () => {
        let csv = "\uFEFFParametro,Valore\n";
        Object.entries(pairingValues).forEach(([key, val]) => {
             csv += `${key},${val}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `abbinamento_${item.food || 'cibo'}_${item.wine || 'vino'}.csv`;
        link.click();
    };

    const CounterBtn = ({ type, label }) => (
        <div className="flex flex-col items-center bg-gray-50 dark:bg-slate-800 p-2 rounded-xl border border-gray-100 dark:border-slate-700 min-w-[70px] flex-shrink-0">
            <span className="text-[9px] font-bold uppercase text-gray-400 mb-1">{label}</span>
            <div className="flex items-center gap-2">
                <button onClick={() => updateCount(type, -1)} className="w-6 h-6 bg-white dark:bg-slate-700 rounded-full shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-200 active:scale-90"><Icons.Minus size={12}/></button>
                <span className={`font-black ${pairCounts[type] > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'}`}>{pairCounts[type]}</span>
                <button onClick={() => updateCount(type, 1)} className="w-6 h-6 bg-white dark:bg-slate-700 rounded-full shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-200 active:scale-90"><Icons.Plus size={12}/></button>
            </div>
        </div>
    );

    if (step === 'context') return (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in">
            <Card>
                <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold"><Icons.MapPin className="text-red-500" size={20} /> <h3>Dettagli Evento</h3></div>
                <Input label="Data" type="date" value={session.date} onChange={e => setSession({...session, date: e.target.value})} />
                <Input label="Location" placeholder="Ristorante..." value={session.locName} onChange={e => setSession({...session, locName: e.target.value})} />
                <div className="flex gap-2 items-end mb-3"><div className="flex-1"><Input label="Città" placeholder="Es. Tokyo" value={session.locCity} onChange={e => setSession({...session, locCity: e.target.value})} /></div><button onClick={handleGeoFill} disabled={isAiLoading || !session.locCity} className="mb-3 p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-200 rounded-xl shadow-sm hover:bg-indigo-200 disabled:opacity-50">{isAiLoading ? <Icons.Loader2 className="animate-spin"/> : <Icons.MapPin />}</button></div>
                <div className="flex gap-2"><div className="flex-1"><Input label="Regione" value={session.locRegion || ''} disabled /></div><div className="flex-1"><Input label="Stato" value={session.locCountry || ''} disabled /></div></div>
            </Card>
            <Card>
                <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-white font-bold"><Icons.Users className="text-blue-500" size={20} /><h3>Compagnia</h3></div>
                <div className="flex gap-2 mb-3"><input className="flex-1 p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white" placeholder="Nome..." value={tempFriend} onChange={e => setTempFriend(e.target.value)} /><button onClick={() => {if(tempFriend){setSession(p=>({...p, friends:[...p.friends, tempFriend]})); setTempFriend("")}}} className="bg-blue-100 text-blue-600 p-3 rounded-xl font-bold">+</button></div>
                <div className="flex flex-wrap gap-2">{session.friends.map((f, i) => ( <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">{f} <button onClick={() => setSession(prev => ({...prev, friends: prev.friends.filter((_, ix) => ix !== i)}))} className="text-red-400 font-bold">×</button></span> ))}</div>
            </Card>
            <div className="space-y-2">{session.items.map((i, idx) => ( <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex justify-between items-center"><div><div className="font-bold text-slate-800 dark:text-white">{i.wine || i.food}</div><div className="text-xs text-gray-400 uppercase font-bold">{i.type}</div></div><button onClick={() => setSession(p => ({...p, items: p.items.filter((_,x)=>x!==idx)}))} className="text-red-300 hover:text-red-500"><Icons.Trash2 size={16} /></button></div> ))}</div>
            <Button onClick={() => setStep('adding')} icon={Icons.Plus}>Aggiungi Elemento</Button>
            {session.items.length > 0 && <Button onClick={() => setStep('finish')} variant="success" icon={Icons.Save} className="mt-4">Concludi</Button>}
        </div>
    );

    if (step === 'adding') return (
        <div className="space-y-4 animate-in slide-in-from-right-8 fade-in pb-20">
            <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-lg dark:text-white">{session.mode === 'Acquisto' ? 'Nuova Bottiglia' : 'Nuovo Inserimento'}</h3></div>
            
            {/* CIBO & SOMMELIER ACCORDION */}
            {session.mode !== 'Degustazione' && session.mode !== 'Acquisto' && (
                <Card className="bg-orange-50/50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30">
                    <div className="mb-3"><Input label="Piatto" placeholder="Es. Carbonara" value={item.food || ''} onChange={e => setItem({...item, food: e.target.value})} /></div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-orange-100 dark:border-orange-900/30">
                        <div onClick={() => setSommOpen(!sommOpen)} className="flex justify-between items-center cursor-pointer">
                            <label className="text-[10px] font-bold text-orange-400 uppercase block cursor-pointer">Sommelier consiglia:</label>
                            {sommOpen ? <Icons.ChevronDown size={16} className="text-orange-400"/> : <Icons.ChevronRight size={16} className="text-orange-400"/>}
                        </div>
                        {sommOpen && (
                            <div className="mt-3 animate-in slide-in-from-top-2">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 border-b border-gray-100 dark:border-slate-800 pb-2">
                                    <CounterBtn type="Rosso" label="Rossi" /><CounterBtn type="Rosato" label="Ros./Cer." /><CounterBtn type="Bianco" label="Bianchi" /><CounterBtn type="Bollicine" label="Bolle" />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                                    <CounterBtn type="Birra" label="Birre" /><CounterBtn type="Spirit" label="Superalc." />
                                </div>
                                <Button onClick={handleFoodPairing} variant="ai" isLoading={isAiLoading} icon={Icons.Sparkles}>{pairingSuggestions.length > 0 ? "Ricalcola" : "Chiedi Consigli"}</Button>
                                {pairingSuggestions.length > 0 && (<div className="mt-3 space-y-2">{pairingSuggestions.map((s, i) => (<div key={i} onClick={() => setItem(prev => ({...prev, wine: s.name, type: s.type}))} className="p-3 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-900/50 rounded-lg cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"><div className="flex justify-between items-start"><span className="font-bold text-slate-800 dark:text-orange-100">{s.name}</span><span className="text-[10px] uppercase font-bold bg-white dark:bg-black/30 px-2 py-0.5 rounded text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-transparent">{s.type}</span></div><p className="text-xs text-slate-600 dark:text-orange-200/70 mt-1 leading-tight">{s.reason}</p></div>))}</div>)}
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {/* VINO */}
            <Card className="border-l-4 border-l-indigo-500 dark:border-l-indigo-400">
                <div className="flex gap-2 items-end mb-4">
                    <div className="flex-1"><Input label="Etichetta / Nome" value={item.wine || ''} onChange={e => setItem({...item, wine: e.target.value})} /></div>
                    <button onClick={handleWineFill} disabled={isAiLoading} className="mb-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg shadow-purple-200 disabled:opacity-50">{isAiLoading ? <Icons.Loader2 size={20} className="animate-spin"/> : <Icons.Sparkles size={20}/>}</button>
                </div>
                <div className="mb-4">
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide dark:text-gray-500">Galleria Foto</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-dashed border-gray-300 dark:border-slate-600 cursor-pointer relative">
                            <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePhotoAdd} />
                            <Icons.Plus className="text-gray-400"/>
                        </div>
                        {item.photos && item.photos.map((p, i) => (
                            <div key={i} className="flex-shrink-0 w-20 h-20 bg-cover bg-center rounded-xl relative group" style={{backgroundImage: `url(${p})`}}>
                                <button onClick={() => removePhoto(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm"><Icons.X size={12}/></button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2"><Input label="Produttore" value={item.prod || ''} onChange={e => setItem({...item, prod: e.target.value})} /><div className="w-24"><Input label="Anno" type="number" value={item.year || ''} onChange={e => setItem({...item, year: e.target.value})} /></div></div>
                <div className="flex gap-2">
                    <div className="w-1/2"><Input label="Tipologia" placeholder="Rosso..." value={item.type || ''} onChange={e => setItem({...item, type: e.target.value})} /></div>
                    <div className="w-1/2"><Input label="Metodo" placeholder="Classico..." value={item.method || ''} onChange={e => setItem({...item, method: e.target.value})} /></div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 mb-3"><label className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide"><span>Uvaggio</span> <span className={currentGrapeTotal === 100 ? "text-emerald-500" : "text-orange-500"}>{currentGrapeTotal}%</span></label><div className="flex flex-wrap gap-2 mb-2">{(item.grapes || []).map((g, i) => (<div key={i} className="flex items-center gap-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 px-2 py-1 rounded-lg text-xs font-bold shadow-sm"><span className="text-indigo-600 dark:text-indigo-400">{g.perc}%</span> <span className="dark:text-gray-300">{g.name}</span> <button onClick={() => removeGrape(i)} className="text-red-400 ml-1">×</button></div>))}</div>{currentGrapeTotal < 100 && (<div className="flex gap-2 items-center"><input className="flex-1 p-2 text-sm border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="Vitigno" value={tempGrape} onChange={e => setTempGrape(e.target.value)} /><input className="w-16 p-2 text-sm border rounded-lg text-center bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="%" type="number" value={tempPerc} onChange={e => setTempPerc(e.target.value)} /><button onClick={addGrape} className="bg-slate-800 dark:bg-indigo-600 text-white p-2 rounded-lg font-bold">+</button></div>)}</div>
                <div className="flex gap-2"><Input label="Alcol %" type="number" value={item.alcohol || ''} onChange={e => setItem({...item, alcohol: e.target.value})} /><Input label="Prezzo €" type="number" value={item.price || ''} onChange={e => setItem({...item, price: e.target.value})} /></div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 mb-3">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide flex items-center gap-1"><Icons.Clock size={10}/> Finestra Consumo</label>
                    <div className="flex gap-2 items-center">
                        <span className="text-xs text-gray-500">Bere dal</span>
                        <input type="number" className="w-16 p-2 text-sm border rounded-lg text-center bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="2024" value={item.drinkFrom || ''} onChange={e => setItem({...item, drinkFrom: e.target.value})} />
                        <span className="text-xs text-gray-500">al</span>
                        <input type="number" className="w-16 p-2 text-sm border rounded-lg text-center bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="2030" value={item.drinkTo || ''} onChange={e => setItem({...item, drinkTo: e.target.value})} />
                    </div>
                </div>
                {(session.mode === 'Acquisto' || item.buyPlace) && (<div className="grid grid-cols-2 gap-2"><Input label="Dove l'hai preso?" placeholder="Enoteca..." value={item.buyPlace || ''} onChange={e => setItem({...item, buyPlace: e.target.value})} /><Input label="Posizione Cantina" placeholder="Scaffale A..." value={item.location || ''} onChange={e => setItem({...item, location: e.target.value})} /></div>)}
                {session.mode === 'Acquisto' && (<div onClick={() => setItem({...item, isWishlist: !item.isWishlist})} className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer mb-3 ${item.isWishlist ? 'bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-900/20 dark:text-pink-300' : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-slate-800 dark:border-slate-700'}`}><Icons.Heart size={18} fill={item.isWishlist ? "currentColor" : "none"} /><span className="text-sm font-bold">{item.isWishlist ? "Nella Lista Desideri" : "Aggiungi ai Desideri"}</span></div>)}
            </Card>

            {session.mode !== 'Acquisto' && (
                <div className="mt-4 mb-4">
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Schede Tecniche</label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <button onClick={() => setAisTab(aisTab === '1.0' ? null : '1.0')} className={`py-3 rounded-xl text-sm font-bold border transition-all ${aisTab === '1.0' ? 'bg-emerald-100 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400'}`}>Scheda AIS 1.0</button>
                        <button onClick={() => setAisTab(aisTab === '2.0' ? null : '2.0')} className={`py-3 rounded-xl text-sm font-bold border transition-all ${aisTab === '2.0' ? 'bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400'}`}>Scheda AIS 2.0</button>
                    </div>
                    
                    <button onClick={() => setAisTab(aisTab === 'pairing' ? null : 'pairing')} className={`w-full py-3 rounded-xl text-sm font-bold border transition-all ${aisTab === 'pairing' ? 'bg-orange-100 border-orange-500 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400'}`}>Abbinamento Cibo-Vino</button>

                    {/* CONTENUTO SCHEDA 1.0 */}
                    {aisTab === '1.0' && (
                        <div className="mt-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 animate-in slide-in-from-top-2 space-y-4">
                            <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase mb-2 flex items-center gap-2"><Icons.Eye size={14}/> Esame Visivo</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select label="Limpidezza" options={AIS_TERMS.LIMPIDEZZA} value={item.ais?.limp || ''} onChange={e => setItem({...item, ais: {...item.ais, limp: e.target.value}})} />
                                    <Select label="Colore" options={getColorOptions(item.type)} value={item.ais?.col || ''} onChange={e => setItem({...item, ais: {...item.ais, col: e.target.value}})} />
                                </div>
                                <div className="mt-2"><Select label="Consistenza" customBg="#763e8c" style={{color: 'white'}} options={AIS_TERMS.CONSISTENZA} value={item.ais?.cons || ''} onChange={e => setItem({...item, ais: {...item.ais, cons: e.target.value}})} /></div>
                                {showEffervescence(item.type) && (<div className="mt-3 pt-3 border-t border-emerald-100 dark:border-emerald-900/30 bg-[#a7cf3a] p-2 rounded"><h5 className="text-[10px] font-bold text-white uppercase mb-2">Effervescenza</h5><div className="grid grid-cols-3 gap-2"><Select customBg="#d9e8ae" label="Catenelle" options={AIS_TERMS.CATENELLE} value={item.ais?.catenelle || ''} onChange={e => setItem({...item, ais: {...item.ais, catenelle: e.target.value}})} /><Select customBg="#d9e8ae" label="Ascesa" options={AIS_TERMS.ASCESA} value={item.ais?.ascesa || ''} onChange={e => setItem({...item, ais: {...item.ais, ascesa: e.target.value}})} /><Select customBg="#d9e8ae" label="Grana" options={AIS_TERMS.GRANA_BOL} value={item.ais?.grana || ''} onChange={e => setItem({...item, ais: {...item.ais, grana: e.target.value}})} /><Select customBg="#d9e8ae" label="Persistenza" options={AIS_TERMS.PERS_BOL} value={item.ais?.persBol || ''} onChange={e => setItem({...item, ais: {...item.ais, persBol: e.target.value}})} /></div></div>)}
                            </div>
                            <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 relative border-t-4 border-t-gray-300 dark:border-t-slate-600 mt-4">
                                <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase mb-2 flex items-center gap-2"><Icons.Wind size={14}/> Esame Olfattivo</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select label="Intensità" options={AIS_TERMS.INTENSITA} value={item.ais?.int || ''} onChange={e => setItem({...item, ais: {...item.ais, int: e.target.value}})} />
                                    <Select label="Complessità" options={AIS_TERMS.COMPLESSITA} value={item.ais?.comp || ''} onChange={e => setItem({...item, ais: {...item.ais, comp: e.target.value}})} />
                                </div>
                                <div className="mt-2"><Select label="Qualità" customBg="#ed028b" style={{color: 'white', border: '2px solid white'}} options={AIS_TERMS.QUALITA} value={item.ais?.qualOlf || ''} onChange={e => setItem({...item, ais: {...item.ais, qualOlf: e.target.value}})} /></div>
                                <div className="mt-2"><Select label="Descrittori" options={AIS_TERMS.DESCRITTORI} value={item.ais?.desc || ''} onChange={e => setItem({...item, ais: {...item.ais, desc: e.target.value}})} /></div>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 relative border-t-4 border-t-gray-300 dark:border-t-slate-600 mt-4">
                                <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase mb-2 flex items-center gap-2"><Icons.Activity size={14}/> Esame Gusto-Olfattivo</h4>
                                <div className="flex gap-4 mb-4 relative">
                                    <div className="flex-1 space-y-2 pr-2 border-r border-gray-300 dark:border-slate-600">
                                        <div className="text-[10px] font-bold text-orange-400 uppercase text-center border-b border-orange-200 dark:border-orange-900/50 pb-1">Morbidezze</div>
                                        <Select label="Zuccheri" options={AIS_TERMS.ZUCCHERI} value={item.ais?.zuc || ''} onChange={e => setItem({...item, ais: {...item.ais, zuc: e.target.value}})} />
                                        <Select label="Alcoli" options={AIS_TERMS.ALCOLI} value={item.ais?.alc || ''} onChange={e => setItem({...item, ais: {...item.ais, alc: e.target.value}})} />
                                        <Select label="Polialcoli" options={AIS_TERMS.POLIALCOLI} value={item.ais?.pol || ''} onChange={e => setItem({...item, ais: {...item.ais, pol: e.target.value}})} />
                                    </div>
                                    <div className="flex-1 space-y-2 pl-2">
                                        <div className="text-[10px] font-bold text-blue-400 uppercase text-center border-b border-blue-200 dark:border-blue-900/50 pb-1">Durezze</div>
                                        <Select label="Acidi" options={AIS_TERMS.ACIDI} value={item.ais?.acidi || ''} onChange={e => setItem({...item, ais: {...item.ais, acidi: e.target.value}})} />
                                        {showTannins(item.type) && ( <Select label="Tannini" options={AIS_TERMS.TANNINI} value={item.ais?.tan || ''} onChange={e => setItem({...item, ais: {...item.ais, tan: e.target.value}})} /> )}
                                        <Select label="Minerali" options={AIS_TERMS.MINERALI} value={item.ais?.min || ''} onChange={e => setItem({...item, ais: {...item.ais, min: e.target.value}})} />
                                    </div>
                                </div>
                                {showEffervescence(item.type) && (
                                    <div className="mt-3 pt-2 border-t border-emerald-100 bg-[#a7cf3a] p-2 rounded">
                                        <Select customBg="#d9e8ae" label="Effervescenza" options={AIS_TERMS.EFFERVESCENZA_GUSTO} value={item.ais?.effGusto || ''} onChange={e => setItem({...item, ais: {...item.ais, effGusto: e.target.value}})} />
                                    </div>
                                )}
                                <div className="space-y-3 pt-2 border-t-2 border-emerald-100 dark:border-emerald-900/30 mt-2">
                                    <Select label="Struttura" options={AIS_TERMS.CORPO} value={item.ais?.corpo || ''} onChange={e => setItem({...item, ais: {...item.ais, corpo: e.target.value}})} />
                                    <Select label="Equilibrio" options={AIS_TERMS.EQUILIBRIO} value={item.ais?.equil || ''} onChange={e => setItem({...item, ais: {...item.ais, equil: e.target.value}})} />
                                    <Select label="Armonia" options={AIS_TERMS.ARMONIA} value={item.ais?.arm || ''} onChange={e => setItem({...item, ais: {...item.ais, arm: e.target.value}})} />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* ABBINAMENTO CIBO VINO (GRAFICO MERCADINI) */}
                    {aisTab === 'pairing' && (
                        <div className="mt-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800 animate-in slide-in-from-top-2 space-y-4">
                            <h4 className="text-center font-bold text-orange-600 dark:text-orange-300 mb-2">Grafico di Abbinamento</h4>
                            <PairingGraphReal 
                                values={pairingValuesFood} 
                                onChange={(k,v) => setPairingValuesFood({...pairingValuesFood, [k]: v})} 
                                foodName={item.food} 
                                wineName={item.wine} 
                                showEffervescence={showEffervescence(item.type)}
                                showTannins={showTannins(item.type)}
                            />
                            
                            {/* STRUTTURA E ARMONIA CON DROPDOWN PER 4/7 */}
                            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-200 dark:border-slate-700 mt-3 space-y-3">
                                <h5 className="text-xs font-bold text-slate-500 uppercase text-center">Valutazioni Finali</h5>
                                <MercadiniEvaluation 
                                    label="Struttura Cibo" 
                                    value={item.mercadini_structure_food} 
                                    labels={["Poco Strutturato", "Abb. Strutturato", "Strutturato"]}
                                    textValue={item.mercadini_structure_food_text}
                                    onChange={(v, t) => setItem(prev => ({ ...prev, mercadini_structure_food: v, mercadini_structure_food_text: t }))} 
                                />
                                <MercadiniEvaluation 
                                    label="Corpo Vino" 
                                    value={item.mercadini_body_wine} 
                                    labels={["Debole", "Di Corpo", "Robusto"]}
                                    textValue={item.mercadini_body_wine_text}
                                    onChange={(v, t) => setItem(prev => ({ ...prev, mercadini_body_wine: v, mercadini_body_wine_text: t }))} 
                                />
                                <MercadiniEvaluation 
                                    label="Armonia" 
                                    value={item.mercadini_harmony} 
                                    labels={["Poco Armonico", "Abb. Armonico", "Armonico"]}
                                    textValue={item.mercadini_harmony_text}
                                    onChange={(v, t) => setItem(prev => ({ ...prev, mercadini_harmony: v, mercadini_harmony_text: t }))} 
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button onClick={handleExportPairing} className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1"><Icons.FileSpreadsheet size={14}/> Scarica Excel</button>
                                <button onClick={handlePrint} className="flex-1 py-2 bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1"><Icons.Printer size={14}/> Stampa PDF</button>
                            </div>
                        </div>
                    )}
                    
                    {/* SCHEDA 2.0 (NUOVA) */}
                    {aisTab === '2.0' && (
                        <div className="mt-3 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 animate-in slide-in-from-top-2 space-y-4">
                            {/* ESAME VISIVO 2.0 */}
                            <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                                <h4 className="text-xs font-black text-indigo-800 dark:text-indigo-400 uppercase mb-2 flex items-center gap-2"><Icons.Eye size={14}/> Esame Visivo</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select label="Limpidezza" options={AIS_TERMS_2_0.LIMPIDEZZA} value={item.ais2?.limp || ''} onChange={e => setItem({...item, ais2: {...item.ais2, limp: e.target.value}})} />
                                    <Select label="Colore" options={getColorOptions(item.type)} value={item.ais2?.col || ''} onChange={e => setItem({...item, ais2: {...item.ais2, col: e.target.value}})} />
                                </div>
                                <div className="mt-2"><Select label="Consistenza" customBg="#763e8c" style={{color: 'white'}} options={AIS_TERMS_2_0.CONSISTENZA} value={item.ais2?.cons || ''} onChange={e => setItem({...item, ais2: {...item.ais2, cons: e.target.value}})} /></div>
                                {showEffervescence(item.type) && (
                                    <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/30 bg-[#a7cf3a] p-2 rounded">
                                        <h5 className="text-[10px] font-bold text-white uppercase mb-2">Effervescenza</h5>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Select customBg="#d9e8ae" label="Catenelle" options={AIS_TERMS.CATENELLE} value={item.ais2?.catenelle || ''} onChange={e => setItem({...item, ais2: {...item.ais2, catenelle: e.target.value}})} />
                                            <Select customBg="#d9e8ae" label="Ascesa" options={AIS_TERMS.ASCESA} value={item.ais2?.ascesa || ''} onChange={e => setItem({...item, ais2: {...item.ais2, ascesa: e.target.value}})} />
                                            <Select customBg="#d9e8ae" label="Grana" options={AIS_TERMS_2_0.BOL_GRANA} value={item.ais2?.grana || ''} onChange={e => setItem({...item, ais2: {...item.ais2, grana: e.target.value}})} />
                                            <Select customBg="#d9e8ae" label="Persistenza" options={AIS_TERMS_2_0.BOL_PERS} value={item.ais2?.persBol || ''} onChange={e => setItem({...item, ais2: {...item.ais2, persBol: e.target.value}})} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ESAME OLFATTIVO 2.0 */}
                            <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                                <h4 className="text-xs font-black text-indigo-800 dark:text-indigo-400 uppercase mb-2 flex items-center gap-2"><Icons.Wind size={14}/> Esame Olfattivo</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select label="Intensità" options={AIS_TERMS_2_0.INTENSITA} value={item.ais2?.int || ''} onChange={e => setItem({...item, ais2: {...item.ais2, int: e.target.value}})} />
                                    <Select label="Descrittori" options={AIS_TERMS_2_0.DESCRITTORI} value={item.ais2?.desc || ''} onChange={e => setItem({...item, ais2: {...item.ais2, desc: e.target.value}})} />
                                    <Select label="Complessità" options={AIS_TERMS_2_0.COMPLESSITA} value={item.ais2?.comp || ''} onChange={e => setItem({...item, ais2: {...item.ais2, comp: e.target.value}})} />
                                </div>
                                <div className="mt-2"><Select label="Qualità" customBg="#ed028b" style={{color: 'white', border: '2px solid white'}} options={AIS_TERMS_2_0.QUALITA_OLF} value={item.ais2?.qualOlf || ''} onChange={e => setItem({...item, ais2: {...item.ais2, qualOlf: e.target.value}})} /></div>
                            </div>

                            {/* ESAME GUSTO-OLFATTIVO 2.0 */}
                            <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                                <h4 className="text-xs font-black text-indigo-800 dark:text-indigo-400 uppercase mb-2 flex items-center gap-2"><Icons.Activity size={14}/> Esame Gusto-Olfattivo</h4>
                                <div className="flex gap-4 mb-4 relative">
                                    <div className="flex-1 space-y-2 pr-2 border-r border-gray-300 dark:border-slate-600">
                                        <div className="text-[10px] font-bold text-orange-400 uppercase text-center border-b border-orange-200 dark:border-orange-900/50 pb-1">Morbidezze</div>
                                        <Select label="Dolcezza" options={AIS_TERMS_2_0.DOLCEZZA} value={item.ais2?.dolcezza || ''} onChange={e => setItem({...item, ais2: {...item.ais2, dolcezza: e.target.value}})} />
                                        <Select label="Alcolicità" options={AIS_TERMS_2_0.ALCOLICITA} value={item.ais2?.alcol || ''} onChange={e => setItem({...item, ais2: {...item.ais2, alcol: e.target.value}})} />
                                        <Select label="Rotondità" options={AIS_TERMS_2_0.ROTONDITA} value={item.ais2?.rotondita || ''} onChange={e => setItem({...item, ais2: {...item.ais2, rotondita: e.target.value}})} />
                                    </div>
                                    <div className="flex-1 space-y-2 pl-2">
                                        <div className="text-[10px] font-bold text-blue-400 uppercase text-center border-b border-blue-200 dark:border-blue-900/50 pb-1">Durezze</div>
                                        <Select label="Acidità" options={AIS_TERMS_2_0.ACIDITA} value={item.ais2?.acidita || ''} onChange={e => setItem({...item, ais2: {...item.ais2, acidita: e.target.value}})} />
                                        {showTannins(item.type) && <Select label="Tannicità" options={AIS_TERMS_2_0.TANNICITA} value={item.ais2?.tannicita || ''} onChange={e => setItem({...item, ais2: {...item.ais2, tannicita: e.target.value}})} />}
                                        <Select label="Sapidità" options={AIS_TERMS_2_0.SAPIDITA} value={item.ais2?.sapidita || ''} onChange={e => setItem({...item, ais2: {...item.ais2, sapidita: e.target.value}})} />
                                    </div>
                                </div>
                                {showEffervescence(item.type) && (
                                    <div className="mt-3 pt-2 border-t border-indigo-100 bg-[#a7cf3a] p-2 rounded">
                                        <Select customBg="#d9e8ae" label="Effervescenza" options={AIS_TERMS_2_0.EFFERVESCENZA_GUSTO} value={item.ais2?.effGusto || ''} onChange={e => setItem({...item, ais2: {...item.ais2, effGusto: e.target.value}})} />
                                    </div>
                                )}
                                <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/30 space-y-2">
                                    <Select label="Struttura" options={AIS_TERMS_2_0.STRUTTURA} value={item.ais2?.struttura || ''} onChange={e => setItem({...item, ais2: {...item.ais2, struttura: e.target.value}})} />
                                    <Select label="Equilibrio" options={AIS_TERMS_2_0.EQUILIBRIO} value={item.ais2?.equilibrio || ''} onChange={e => setItem({...item, ais2: {...item.ais2, equilibrio: e.target.value}})} />
                                    <Select label="Intensità G.O." options={AIS_TERMS_2_0.INTENSITA_GUS} value={item.ais2?.intGus || ''} onChange={e => setItem({...item, ais2: {...item.ais2, intGus: e.target.value}})} />
                                    <Select label="Persistenza" options={AIS_TERMS_2_0.PERSISTENZA} value={item.ais2?.pers || ''} onChange={e => setItem({...item, ais2: {...item.ais2, pers: e.target.value}})} />
                                    <Select label="Qualità G.O." options={AIS_TERMS_2_0.QUALITA_GUS} value={item.ais2?.qualGus || ''} onChange={e => setItem({...item, ais2: {...item.ais2, qualGus: e.target.value}})} />
                                </div>
                            </div>

                            {/* CONCLUSIONI 2.0 */}
                            <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800">
                                <h4 className="text-xs font-black text-indigo-800 dark:text-indigo-300 uppercase mb-2">Conclusioni</h4>
                                <div className="space-y-2">
                                    <Select label="Stato Evolutivo" options={AIS_TERMS_2_0.EVOLUZIONE} value={item.ais2?.evoluzione || ''} onChange={e => setItem({...item, ais2: {...item.ais2, evoluzione: e.target.value}})} />
                                    <Select label="Armonia" options={AIS_TERMS_2_0.ARMONIA} value={item.ais2?.armonia || ''} onChange={e => setItem({...item, ais2: {...item.ais2, armonia: e.target.value}})} />
                                    <Select label="Qualità Complessiva" options={AIS_TERMS_2_0.QUALITA_COMPLESSIVA} value={item.ais2?.qualitaTot || ''} onChange={e => setItem({...item, ais2: {...item.ais2, qualitaTot: e.target.value}})} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* VOTI FINALI */}
            {session.mode !== 'Acquisto' && (
                <div className="grid grid-cols-2 gap-3 mt-4 mb-4">
                    <Input label="Voto Personale (0-100)" type="number" value={item.votePersonal || ''} onChange={e => setItem({...item, votePersonal: e.target.value})} />
                    <Input label="Voto AIS 1.0 (0-100)" type="number" value={item.voteAis || ''} onChange={e => setItem({...item, voteAis: e.target.value})} />
                </div>
            )}

            <Button onClick={addItem} variant="primary">{session.mode === 'Acquisto' ? 'Salva' : 'Salva Prodotto'}</Button>
        </div>
    );

    if (step === 'finish') return (
        <div className="space-y-6 pt-10 animate-in zoom-in-95 fade-in">
            <div className="text-center"><Icons.CheckCircle2 size={64} className="mx-auto text-emerald-500 mb-4" /><h2 className="text-2xl font-black dark:text-white">Riepilogo</h2></div>
            <Card><Input label="Conto Totale €" type="number" value={session.bill || ''} onChange={e => setSession({...session, bill: parseFloat(e.target.value)})} /><Input label="Voto Location" type="number" value={session.locVote || ''} onChange={e => setSession({...session, locVote: e.target.value})} /><textarea className="w-full p-3 bg-gray-50 dark:bg-slate-800 dark:text-white rounded-xl border border-gray-200 dark:border-slate-700 mt-2" rows={3} placeholder="Note finali..." value={session.note || ''} onChange={e => setSession({...session, note: e.target.value})} /></Card>
            <Button onClick={() => onSave(session)} variant="success" className="h-16 text-lg">ARCHIVIA</Button>
        </div>
    );
}

export default App;