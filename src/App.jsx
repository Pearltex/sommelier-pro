import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Wine, Beer, GlassWater, Utensils, Moon, Sun, Plus, Search, BarChart3,
  Home, Archive, Save, X, CheckCircle2, MapPin, Users, Calendar, ChevronDown,
  ChevronUp, Star, FileText, Pencil, Trash2, Camera, DownloadCloud, UploadCloud,
  Database, Settings, Sparkles, Bot, Loader2, ShoppingBag, Store, ScrollText,
  ClipboardCheck, Eye, Wind, Activity, Map, PieChart, Award, Filter, Quote, 
  Minus, Copy, Clock, Heart, ArrowUpDown, ArrowLeft, Image as ImageIcon, ChevronRight
} from 'lucide-react';

const Icons = {
  Wine, Beer, GlassWater, Utensils, Moon, Sun, Plus, Search, BarChart3,
  Home, Archive, Save, X, CheckCircle2, MapPin, Users, Calendar, ChevronDown,
  ChevronUp, Star, FileText, Pencil, Trash2, Camera, DownloadCloud, UploadCloud,
  Database, Settings, Sparkles, Bot, Loader2, ShoppingBag, Store, ScrollText,
  ClipboardCheck, Eye, Wind, Activity, Map, PieChart, Award, Filter, Quote, 
  Minus, Copy, Clock, Heart, ArrowUpDown, ArrowLeft, Image: ImageIcon, ChevronRight
};

const APP_TITLE = "SOMMELIER PRO";

// --- DATABASE TERMINI AIS ---
const AIS_TERMS = {
    LIMPIDEZZA: ["Velato", "Abbastanza Limpido", "Limpido", "Cristallino", "Brillante"],
    COLORE_ROSSO: ["Porpora", "Rubino", "Granato", "Aranciato"],
    COLORE_BIANCO: ["Verdolino", "Paglierino", "Dorato", "Ambrato"],
    COLORE_ROSATO: ["Tenue", "Cerasuolo", "Chiaretto"],
    CONSISTENZA: ["Fluido", "Poco Consistente", "Abb. Consistente", "Consistente", "Viscoso"],
    GRANA_BOL: ["Grossolane", "Abb. Fini", "Fini"],
    NUMERO_BOL: ["Scarse", "Abb. Numerose", "Numerose"],
    PERS_BOL: ["Evanescenti", "Abb. Persistenti", "Persistenti"],
    INTENSITA: ["Carente", "Poco Intenso", "Abb. Intenso", "Intenso", "Molto Intenso"],
    COMPLESSITA: ["Carente", "Poco Complesso", "Abb. Complesso", "Complesso", "Ampio"],
    QUALITA: ["Comune", "Poco Fine", "Abb. Fine", "Fine", "Eccellente"],
    ZUCCHERI: ["Secco", "Abboccato", "Amabile", "Dolce", "Stucchevole"],
    ALCOLI: ["Leggero", "Poco Caldo", "Abb. Caldo", "Caldo", "Alcolico"],
    POLIALCOLI: ["Spigoloso", "Poco Morbido", "Abb. Morbido", "Morbido", "Pastoso"],
    ACIDI: ["Piatto", "Poco Fresco", "Abb. Fresco", "Fresco", "Acidulo"],
    TANNINI: ["Molle", "Poco Tannico", "Abb. Tannico", "Tannico", "Astringente"],
    MINERALI: ["Scipito", "Poco Sapido", "Abb. Sapido", "Sapido", "Salato"],
    CORPO: ["Magro", "Debole", "Di Corpo", "Robusto", "Pesante"],
    EQUILIBRIO: ["Poco Equilibrato", "Abb. Equilibrato", "Equilibrato"],
    INTENSITA_GUS: ["Carente", "Poco Intenso", "Abb. Intenso", "Intenso", "Molto Intenso"],
    PERSISTENZA: ["Corto", "Poco Persistente", "Abb. Persistente", "Persistente", "Molto Persistente"],
    QUALITA_GUS: ["Comune", "Poco Fine", "Abb. Fine", "Fine", "Eccellente"],
    EVOLUZIONE: ["Immaturo", "Giovane", "Pronto", "Maturo", "Vecchio"],
    ARMONIA: ["Poco Armonico", "Abb. Armonico", "Armonico"]
};

// --- INFRASTRUTTURA AI ---
const callGemini = async (apiKey, prompt, base64Image = null) => {
    if (!apiKey) throw new Error("API Key mancante.");
    const MODEL = "gemini-1.5-flash"; 
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

// --- UTILITY ---
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
    if (t.includes("birra") || t.includes("beer") || t.includes("ipa") || t.includes("lager")) return "bg-orange-100 border-orange-300 text-orange-900 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-200";
    if (t.includes("spirit") || t.includes("distillato") || t.includes("whisky") || t.includes("rum")) return "bg-slate-200 border-slate-300 text-slate-900 dark:bg-slate-700 dark:border-slate-500 dark:text-slate-200";
    return "bg-white border-gray-100 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200";
};

// --- UI COMPONENTS ---
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
const Select = ({ label, options, ...props }) => ( <div className="mb-3 w-full"> {label && <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide dark:text-gray-500">{label}</label>} <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-800 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-indigo-500" {...props}> <option value="">-- Seleziona --</option> {options.map(o => <option key={o} value={o}>{o}</option>)} </select> </div> );
const Card = ({ children, className = '', onClick }) => ( <div onClick={onClick} className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800 ${className} ${onClick ? 'cursor-pointer active:bg-gray-50 dark:active:bg-slate-800' : ''}`}>{children}</div> );

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

    // NAVIGATION HELPERS
    const goBack = () => {
        if (session) {
            if (session.step === 'adding') setSession({ ...session, step: 'context' });
            else if (session.step === 'context') { setSession(null); setTab('home'); }
            else if (session.step === 'finish') setSession({ ...session, step: 'context' });
        } else {
            setTab('home');
        }
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

    // CSV EXPORT
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
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ logs, cellar, version: "20.0" }));
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

    // NOTA: Aggiunto overflow-x-hidden per evitare scroll laterale indesiderato
    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
            <div className="bg-white dark:bg-slate-900 sticky top-0 z-50 px-4 py-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center shadow-sm h-16 w-full max-w-md mx-auto">
                <div className="flex items-center gap-2">
                    {tab !== 'home' && <button onClick={goBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"><Icons.ArrowLeft size={20}/></button>}
                    <h1 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">{APP_TITLE}</h1>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setDarkMode(!darkMode)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                        {darkMode ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}
                    </button>
                    <button onClick={() => setShowSettings(true)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"><Icons.Settings size={20}/></button>
                </div>
            </div>

            {showSettings && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-sm animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg flex items-center gap-2"><Icons.Sparkles size={18} className="text-indigo-500"/> Impostazioni</h3><button onClick={() => setShowSettings(false)}><Icons.X size={20}/></button></div>
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

            {/* NOTA: max-w-md mx-auto centra il contenuto e evita overflow */}
            <main className="p-4 max-w-md mx-auto w-full">
                {tab === 'home' && <HomeView startSession={startSession} logs={logs} cellar={cellar} setTab={setTab} />}
                {tab === 'cantina' && <CellarView cellar={cellar} setCellar={setCellar} startSession={startSession} apiKey={apiKey} />}
                {tab === 'history' && <HistoryView logs={logs} onEdit={editSession} onDelete={deleteSession} startSession={startSession} />}
                {tab === 'stats' && <StatsView logs={logs} cellar={cellar} />}
                {tab === 'session' && session && <SessionManager session={session} setSession={setSession} onSave={saveSession} onCancel={goBack} apiKey={apiKey} />}
            </main>

            {(!session || tab !== 'session') && (
                <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 pb-safe pt-2 flex justify-around items-center z-50 h-16 max-w-md mx-auto left-0 right-0">
                    <NavItem icon={Icons.Home} label="Home" active={tab === 'home'} onClick={() => setTab('home')} />
                    <NavItem icon={Icons.Archive} label="Cantina" active={tab === 'cantina'} onClick={() => setTab('cantina')} />
                    <NavItem icon={Icons.Search} label="Diario" active={tab === 'history'} onClick={() => setTab('history')} />
                    <NavItem icon={Icons.BarChart3} label="Stats" active={tab === 'stats'} onClick={() => setTab('stats')} />
                </nav>
            )}
        </div>
    );
}

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${active ? 'text-slate-900 dark:text-white' : 'text-gray-300 dark:text-slate-600'}`}>
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
    const [sommOpen, setSommOpen] = useState(false); // Accordion state
    
    // SOMMELIER
    const [pairCounts, setPairCounts] = useState({ Rosso: 0, Bianco: 0, Bollicine: 0, Rosato: 0, Birra: 0, Spirit: 0 });
    const [pairingSuggestions, setPairingSuggestions] = useState([]);
    
    const fileInput = useRef(null);

    // LOGICHE DINAMICHE
    const getColorOptions = (type) => {
        const t = (type || "").toLowerCase();
        if (t.includes("bianco") || t.includes("bollicine") || t.includes("spumante") || t.includes("champagne")) return AIS_TERMS.COLORE_BIANCO;
        if (t.includes("rosato") || t.includes("cerasuolo") || t.includes("chiaretto")) return AIS_TERMS.COLORE_ROSATO;
        return AIS_TERMS.COLORE_ROSSO; 
    };
    const showEffervescence = (type) => { const t = (type || "").toLowerCase(); return t.includes("bollicin") || t.includes("spumante") || t.includes("champagne") || t.includes("prosecco") || t.includes("franciacorta") || t.includes("trento"); };
    const showTannins = (type) => { const t = (type || "").toLowerCase(); return t.includes("rosso"); };

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
            const data = await callGemini(apiKey, prompt, null); // No image for pairing for simplicity
            setPairingSuggestions(Array.isArray(data) ? data : (data.suggestions || []));
        } catch (e) { alert(e.message); } finally { setIsAiLoading(false); }
    };

    const updateCount = (type, delta) => setPairCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));
    const currentGrapeTotal = (item.grapes || []).reduce((acc, g) => acc + parseInt(g.perc || 0), 0);
    const addGrape = () => { if (!tempGrape || !tempPerc) return; setItem(prev => ({ ...prev, grapes: [...(prev.grapes || []), { name: tempGrape, perc: parseInt(tempPerc) }] })); setTempGrape(""); setTempPerc(""); };
    const removeGrape = (idx) => setItem(prev => ({ ...prev, grapes: prev.grapes.filter((_, i) => i !== idx) }));
    
    // GALLERIA FOTO
    const handlePhotoAdd = async (e) => { 
        const files = Array.from(e.target.files);
        for (const f of files) {
            const b64 = await resizeImage(f);
            setItem(prev => ({ ...prev, photos: [...(prev.photos || []), b64] }));
        }
    };
    const removePhoto = (idx) => setItem(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }));

    const addItem = () => { if(session.mode === 'Acquisto') onSave({ ...session, items: [item] }); else { setSession(prev => ({ ...prev, items: [...prev.items, item] })); setItem({}); setStep('context'); } };
    
    const CounterBtn = ({ type, label }) => (
        <div className="flex flex-col items-center bg-gray-50 dark:bg-slate-800 p-2 rounded-xl border border-gray-100 dark:border-slate-700">
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

                {/* GALLERY */}
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
                
                {/* Uvaggio */}
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 mb-3"><label className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide"><span>Uvaggio</span> <span className={currentGrapeTotal === 100 ? "text-emerald-500" : "text-orange-500"}>{currentGrapeTotal}%</span></label><div className="flex flex-wrap gap-2 mb-2">{(item.grapes || []).map((g, i) => (<div key={i} className="flex items-center gap-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 px-2 py-1 rounded-lg text-xs font-bold shadow-sm"><span className="text-indigo-600 dark:text-indigo-400">{g.perc}%</span> <span className="dark:text-gray-300">{g.name}</span> <button onClick={() => removeGrape(i)} className="text-red-400 ml-1">×</button></div>))}</div>{currentGrapeTotal < 100 && (<div className="flex gap-2 items-center"><input className="flex-1 p-2 text-sm border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="Vitigno" value={tempGrape} onChange={e => setTempGrape(e.target.value)} /><input className="w-16 p-2 text-sm border rounded-lg text-center bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="%" type="number" value={tempPerc} onChange={e => setTempPerc(e.target.value)} /><button onClick={addGrape} className="bg-slate-800 dark:bg-indigo-600 text-white p-2 rounded-lg font-bold">+</button></div>)}</div>
                
                {/* Dati Tecnici */}
                <div className="flex gap-2"><Input label="Alcol %" type="number" value={item.alcohol || ''} onChange={e => setItem({...item, alcohol: e.target.value})} /><Input label="Prezzo €" type="number" value={item.price || ''} onChange={e => setItem({...item, price: e.target.value})} /></div>
                
                {/* 📅 DRINK WINDOW */}
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 mb-3">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide flex items-center gap-1"><Icons.Clock size={10}/> Finestra Consumo</label>
                    <div className="flex gap-2 items-center">
                        <span className="text-xs text-gray-500">Bere dal</span>
                        <input type="number" className="w-16 p-2 text-sm border rounded-lg text-center bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="2024" value={item.drinkFrom || ''} onChange={e => setItem({...item, drinkFrom: e.target.value})} />
                        <span className="text-xs text-gray-500">al</span>
                        <input type="number" className="w-16 p-2 text-sm border rounded-lg text-center bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="2030" value={item.drinkTo || ''} onChange={e => setItem({...item, drinkTo: e.target.value})} />
                    </div>
                </div>
                
                {/* 📍 LOCATION */}
                {(session.mode === 'Acquisto' || item.buyPlace) && (
                    <div className="grid grid-cols-2 gap-2">
                        <Input label="Dove l'hai preso?" placeholder="Enoteca..." value={item.buyPlace || ''} onChange={e => setItem({...item, buyPlace: e.target.value})} />
                        <Input label="Posizione Cantina" placeholder="Scaffale A..." value={item.location || ''} onChange={e => setItem({...item, location: e.target.value})} />
                    </div>
                )}
                
                {/* ❤️ WISHLIST TOGGLE */}
                {session.mode === 'Acquisto' && (
                    <div onClick={() => setItem({...item, isWishlist: !item.isWishlist})} className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-colors mb-3 ${item.isWishlist ? 'bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-900/20 dark:text-pink-300' : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-slate-800 dark:border-slate-700'}`}>
                        <Icons.Heart size={18} fill={item.isWishlist ? "currentColor" : "none"} />
                        <span className="text-sm font-bold">{item.isWishlist ? "Nella Lista Desideri" : "Aggiungi ai Desideri"}</span>
                    </div>
                )}
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
                                <div className="mt-2"><Select label="Consistenza" options={AIS_TERMS.CONSISTENZA} value={item.ais?.cons || ''} onChange={e => setItem({...item, ais: {...item.ais, cons: e.target.value}})} /></div>
                                {showEffervescence(item.type) && (<div className="mt-3 pt-3 border-t border-emerald-100 dark:border-emerald-900/30"><h5 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2">Effervescenza</h5><div className="grid grid-cols-3 gap-2"><Select label="Grana" options={AIS_TERMS.GRANA_BOL} value={item.ais?.grana || ''} onChange={e => setItem({...item, ais: {...item.ais, grana: e.target.value}})} /><Select label="Numero" options={AIS_TERMS.NUMERO_BOL} value={item.ais?.numBol || ''} onChange={e => setItem({...item, ais: {...item.ais, numBol: e.target.value}})} /><Select label="Persistenza" options={AIS_TERMS.PERS_BOL} value={item.ais?.persBol || ''} onChange={e => setItem({...item, ais: {...item.ais, persBol: e.target.value}})} /></div></div>)}
                            </div>
                            <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 relative border-t-4 border-t-gray-300 dark:border-t-slate-600 mt-4">
                                <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase mb-2 flex items-center gap-2"><Icons.Wind size={14}/> Esame Olfattivo</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select label="Intensità" options={AIS_TERMS.INTENSITA} value={item.ais?.int || ''} onChange={e => setItem({...item, ais: {...item.ais, int: e.target.value}})} />
                                    <Select label="Complessità" options={AIS_TERMS.COMPLESSITA} value={item.ais?.comp || ''} onChange={e => setItem({...item, ais: {...item.ais, comp: e.target.value}})} />
                                </div>
                                <div className="mt-2"><Select label="Qualità" options={AIS_TERMS.QUALITA} value={item.ais?.qualOlf || ''} onChange={e => setItem({...item, ais: {...item.ais, qualOlf: e.target.value}})} /></div>
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
                                <div className="space-y-3 pt-2 border-t-2 border-emerald-100 dark:border-emerald-900/30">
                                    <Select label="Struttura" options={AIS_TERMS.CORPO} value={item.ais?.corpo || ''} onChange={e => setItem({...item, ais: {...item.ais, corpo: e.target.value}})} />
                                    <Select label="Equilibrio" options={AIS_TERMS.EQUILIBRIO} value={item.ais?.equil || ''} onChange={e => setItem({...item, ais: {...item.ais, equil: e.target.value}})} />
                                    <Select label="Armonia" options={AIS_TERMS.ARMONIA} value={item.ais?.arm || ''} onChange={e => setItem({...item, ais: {...item.ais, arm: e.target.value}})} />
                                </div>
                            </div>
                        </div>
                    )}
                    {(aisTab === '2.0' || aisTab === 'pairing') && (<div className="mt-3 p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 text-center animate-in slide-in-from-top-2"><Icons.Loader2 className="animate-spin mx-auto text-gray-400 mb-2" size={24}/><p className="text-sm text-gray-500 font-medium">Under Construction 🚧</p></div>)}
                </div>
            )}

            {/* VOTI FINALI (RIPRISTINATI) */}
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

function CellarView({ cellar, setCellar, apiKey, startSession }) {
    const [addMode, setAddMode] = useState(false);
    const [filter, setFilter] = useState('all');
    const [newBot, setNewBot] = useState({});
    const [loading, setLoading] = useState(false);
    const [sortMode, setSortMode] = useState('date-desc');

    const filteredCellar = useMemo(() => {
        let data = cellar.filter(b => {
            const isWish = b.q === 0 || b.isWishlist;
            if (filter === 'wishlist') return isWish;
            if (isWish) return false; 
            
            if (filter === 'all') return true;
            const t = (b.type || "").toLowerCase();
            if (filter === 'rossi') return t.includes('rosso');
            if (filter === 'bianchi') return t.includes('bianco');
            if (filter === 'bolle') return t.includes('boll') || t.includes('spumante');
            if (filter === 'rosati') return t.includes('rosato') || t.includes('cerasuolo');
            if (filter === 'birre') return t.includes('birra') || t.includes('beer');
            if (filter === 'spirits') return t.includes('spirit') || t.includes('distillato') || t.includes('rum') || t.includes('whisky');
            return true;
        });

        return data.sort((a, b) => {
            if (sortMode === 'price-desc') return (b.pr || 0) - (a.pr || 0);
            if (sortMode === 'price-asc') return (a.pr || 0) - (b.pr || 0);
            if (sortMode === 'alpha') return (a.n || "").localeCompare(b.n || "");
            return (b.id || 0) - (a.id || 0); 
        });
    }, [cellar, filter, sortMode]);

    const handleAdd = () => { setCellar([...cellar, { ...newBot, id: Date.now() }]); setAddMode(false); setNewBot({}); };
    const handleClone = (bottle) => { setNewBot({ ...bottle, id: null, q: 1, isWishlist: false }); setAddMode(true); };
    const handleSmartFill = async () => { if(!newBot.n) return; setLoading(true); try { const prompt = `Analizza vino: "${newBot.n}". JSON STRETTO: {"prod": "Produttore", "year": "Anno", "type": "Rosso/Bianco/Bollicine/Rosato/Birra/Distillato", "drinkFrom": "2024", "drinkTo": "2030"}`; const data = await callGemini(apiKey, prompt); setNewBot(prev => ({ ...prev, p: data.prod, y: data.year, type: data.type, drinkFrom: data.drinkFrom, drinkTo: data.drinkTo })); } catch(e) { alert("Errore AI: " + e.message); } finally { setLoading(false); } };
    const openBottle = (b) => { if(confirm("Stappi questa bottiglia?")) { if (b.q > 1) setCellar(cellar.map(item => item.id === b.id ? { ...item, q: item.q - 1 } : item)); else setCellar(cellar.filter(item => item.id !== b.id)); startSession('Degustazione', { wine: b.n, prod: b.p, year: b.y, type: b.type, price: b.pr, buyPlace: b.buyPlace }); } };
    
    const FilterBtn = ({ id, label, icon: Icon }) => (<button onClick={() => setFilter(id)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1 whitespace-nowrap ${filter === id ? 'bg-slate-800 text-white border-slate-800 dark:bg-indigo-600 dark:border-indigo-600' : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700'}`}>{Icon && <Icon size={12}/>} {label}</button>);

    return (
        <div className="space-y-4 pb-20">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-xl dark:text-white">{filter === 'wishlist' ? 'Lista Desideri' : 'La Tua Cantina'}</h2>
                <div className="flex gap-2">
                    <button onClick={() => setSortMode(sortMode === 'price-desc' ? 'price-asc' : 'price-desc')} className="bg-white dark:bg-slate-800 p-2 rounded-full border dark:border-slate-700 text-slate-500 dark:text-white"><Icons.ArrowUpDown size={20}/></button>
                    <button onClick={() => setAddMode(!addMode)} className="bg-slate-900 dark:bg-indigo-600 text-white p-2 rounded-full shadow-lg shadow-slate-200 dark:shadow-none"><Icons.Plus size={20}/></button>
                </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <FilterBtn id="all" label="Tutti" />
                <FilterBtn id="wishlist" label="Desideri" icon={Icons.Heart} />
                <FilterBtn id="rossi" label="Rossi" />
                <FilterBtn id="bianchi" label="Bianchi" />
                <FilterBtn id="bolle" label="Bollicine" />
                <FilterBtn id="rosati" label="Rosati" />
                <FilterBtn id="birre" label="Birre" />
                <FilterBtn id="spirits" label="Spirits" />
            </div>

            {addMode && ( <Card className="animate-in slide-in-from-top-4 border-2 border-slate-900 dark:border-indigo-500"><div className="flex gap-2 items-end"><div className="flex-1"><Input label="Vino" value={newBot.n || ''} onChange={e => setNewBot({...newBot, n: e.target.value})} /></div><button onClick={handleSmartFill} disabled={loading} className="mb-3 p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-xl"><Icons.Sparkles size={20}/></button></div><div className="flex gap-2"><Input label="Produttore" value={newBot.p || ''} onChange={e => setNewBot({...newBot, p: e.target.value})} /><div className="w-24"><Input label="Anno" type="number" value={newBot.y || ''} onChange={e => setNewBot({...newBot, y: e.target.value})} /></div></div>
            <div className="flex gap-2">
                <div className="flex-1"><Input label="Tipologia" placeholder="Rosso..." value={newBot.type || ''} onChange={e => setNewBot({...newBot, type: e.target.value})} /></div>
                <div className="w-24"><Input label="Qtà" type="number" value={newBot.q || 1} onChange={e => setNewBot({...newBot, q: parseInt(e.target.value)})} /></div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 mb-3 flex gap-2 items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Icons.Clock size={10}/> Bere:</span>
                <div className="flex gap-1 items-center"><input type="number" className="w-14 p-1 text-sm border rounded text-center bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600" placeholder="2024" value={newBot.drinkFrom || ''} onChange={e => setNewBot({...newBot, drinkFrom: e.target.value})} /><span className="text-xs text-gray-400">-</span><input type="number" className="w-14 p-1 text-sm border rounded text-center bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600" placeholder="2030" value={newBot.drinkTo || ''} onChange={e => setNewBot({...newBot, drinkTo: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Input label="Dove l'hai preso?" value={newBot.buyPlace || ''} onChange={e => setNewBot({...newBot, buyPlace: e.target.value})} />
                <Input label="Posizione" value={newBot.location || ''} onChange={e => setNewBot({...newBot, location: e.target.value})} />
            </div>
            <div onClick={() => setNewBot({...newBot, isWishlist: !newBot.isWishlist})} className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer mb-3 ${newBot.isWishlist ? 'bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-900/20' : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-slate-800'}`}><Icons.Heart size={18} fill={newBot.isWishlist ? "currentColor" : "none"} /><span className="text-sm font-bold">{newBot.isWishlist ? "Solo Desiderio" : "In Cantina"}</span></div>
            <Button onClick={handleAdd} variant="success">Salva</Button></Card> )}
            
            <div className="space-y-3">{filteredCellar.length === 0 ? <p className="text-center text-gray-400 text-sm py-10">Lista vuota.</p> : filteredCellar.map(b => ( 
                <div key={b.id} className={`p-4 rounded-xl border shadow-sm flex justify-between items-center transition-colors ${getItemStyle(b.type)}`}>
                    <div className="flex-1">
                        <div className="font-bold text-lg leading-tight flex items-center gap-2">
                            {b.n} 
                            {b.isWishlist && <Icons.Heart size={12} className="text-pink-500" fill="currentColor"/>}
                        </div>
                        <div className="text-xs opacity-80 font-medium mt-1">{b.p} • {b.y} {b.location && `• ${b.location}`}</div>
                        {b.drinkFrom && !b.isWishlist && (
                            <div className="mt-1 flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${new Date().getFullYear() >= b.drinkFrom && new Date().getFullYear() <= b.drinkTo ? 'bg-green-500' : (new Date().getFullYear() < b.drinkFrom ? 'bg-yellow-400' : 'bg-red-500')}`}></span>
                                <span className="text-[10px] opacity-70">{b.drinkFrom}-{b.drinkTo}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 pl-2">
                        <button onClick={() => handleClone(b)} className="p-2 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400"><Icons.Copy size={16}/></button>
                        {!b.isWishlist && <span className="bg-white/50 dark:bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-black shadow-sm">x{b.q}</span>}
                        <button onClick={() => openBottle(b)} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2 rounded-full shadow-sm active:scale-95"><Icons.Wine size={18}/></button>
                    </div>
                </div> 
            ))}</div>
        </div>
    );
}

function HistoryView({ logs, onEdit, onDelete, startSession }) {
    const [q, setQ] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const filtered = logs.filter(l => JSON.stringify(l).toLowerCase().includes(q.toLowerCase()));
    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);
    
    return (
        <div className="space-y-4 pb-20">
            <div className="sticky top-0 bg-slate-50 dark:bg-slate-950 pb-2 z-10 pt-2"><div className="relative shadow-sm rounded-xl"><Icons.Search className="absolute left-3 top-3.5 text-gray-400" size={16} /><input className="w-full pl-10 p-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white dark:bg-slate-900 dark:text-white" placeholder="Cerca..." value={q} onChange={e => setQ(e.target.value)} /></div></div>
            {filtered.map(l => { const isExpanded = expandedId === l.id; return ( <div key={l.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-all"><div onClick={() => toggleExpand(l.id)} className="cursor-pointer"><div className="flex justify-between mb-2"><div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><Icons.Calendar size={10} /> {l.date.split('-').reverse().join('/')} • {l.mode}</div><div className="font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">€{l.bill}</div></div><div className="flex justify-between items-center"><div><div className="font-bold text-xl text-slate-800 dark:text-white leading-none mb-1">{l.locName || 'Evento'}</div><div className="text-xs text-gray-500 flex items-center gap-1"><Icons.MapPin size={10}/> {l.locCity || 'Nessun luogo'}</div></div>{isExpanded ? <Icons.ChevronUp size={24} className="text-slate-300"/> : <Icons.ChevronDown size={24} className="text-slate-300"/>}</div></div>{isExpanded && (<div className="mt-6 pt-4 border-t border-dashed border-gray-200 dark:border-slate-700 animate-in slide-in-from-top-2 fade-in"><div className="space-y-3 mb-6">{l.items.map((i, idx) => ( <div key={idx} className={`flex gap-3 p-3 rounded-2xl border ${getItemStyle(i.type)}`}>
                <div className="flex gap-2 overflow-x-auto w-16 flex-shrink-0 no-scrollbar snap-x">
                    {i.photos && i.photos.length > 0 ? (
                        i.photos.map((p, idx) => (
                            <div key={idx} className="w-14 h-20 bg-cover bg-center rounded-xl flex-shrink-0 shadow-sm snap-center" style={{backgroundImage: `url(${p})`}}></div>
                        ))
                    ) : (
                        <div className="w-14 h-20 bg-white/50 dark:bg-black/20 rounded-xl flex items-center justify-center flex-shrink-0"><Icons.Wine size={20} className="opacity-30"/></div>
                    )}
                </div>
                <div className="flex-1 min-w-0"><div className="font-black text-base truncate">{i.wine || i.food}</div><div className="text-xs opacity-80 truncate">{i.prod} {i.year}</div><div className="flex flex-wrap gap-1 mt-2">{i.votePersonal && <span className="text-[9px] font-bold bg-white/80 dark:bg-black/30 px-1.5 py-0.5 rounded shadow-sm">⭐ {i.votePersonal}</span>}</div><button onClick={(e) => { e.stopPropagation(); startSession('Degustazione', i); }} className="mt-2 text-[10px] flex items-center gap-1 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"><Icons.Copy size={10}/> Ripeti</button></div></div> ))}</div><div className="grid grid-cols-2 gap-3 mb-4"><div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700"><div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase mb-1"><Icons.Star size={10}/> Location</div><div className="font-black text-xl text-slate-800 dark:text-white">{l.locVote || '-'}</div></div><div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700"><div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase mb-1"><Icons.Users size={10}/> Amici</div><div className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight line-clamp-2">{l.friends && l.friends.length > 0 ? l.friends.join(", ") : "-"}</div></div></div>{l.note && (<div className="bg-yellow-50/50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30 mb-4 text-sm text-slate-700 dark:text-yellow-100 italic relative"><Icons.Quote size={16} className="text-yellow-200 absolute top-2 right-2"/>"{l.note}"</div>)}<div className="flex gap-2"><Button onClick={() => onEdit(l)} variant="ghost" className="h-10 text-xs text-indigo-500 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50" icon={Icons.Pencil}>Modifica</Button><Button onClick={() => onDelete(l.id)} variant="ghost" className="h-10 text-xs text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50" icon={Icons.Trash2}>Elimina</Button></div></div>)}</div> ); })}</div>
    );
}

function StatsView({ logs, cellar }) {
    const stats = useMemo(() => {
        let totalSpent = 0; let totalBottles = 0; let totalValueCellar = 0; let scoreSum = 0; let scoreCount = 0;
        const typeCounts = { Rosso: 0, Bianco: 0, Bollicine: 0, Rosato: 0, Altro: 0 };
        logs.forEach(l => {
            totalSpent += (l.bill || 0);
            l.items.forEach(i => {
                totalBottles++;
                const t = (i.type || "Altro").toLowerCase();
                if (t.includes('rosso')) typeCounts.Rosso++; else if (t.includes('bianco')) typeCounts.Bianco++; else if (t.includes('boll') || t.includes('spumante')) typeCounts.Bollicine++; else if (t.includes('rosato')) typeCounts.Rosato++; else typeCounts.Altro++;
                if (i.votePersonal) { scoreSum += parseFloat(i.votePersonal); scoreCount++; }
            });
        });
        cellar.forEach(b => { if (!b.isWishlist) totalValueCellar += (b.pr || 0) * (b.q || 1); });
        
        const avgPrice = totalBottles > 0 ? (totalSpent / totalBottles).toFixed(1) : 0;
        const avgScore = scoreCount > 0 ? (scoreSum / scoreCount).toFixed(1) : "-";
        const totalTypes = Object.values(typeCounts).reduce((a, b) => a + b, 0) || 1;
        const typeSegments = [{ l: 'Rossi', v: typeCounts.Rosso, c: '#ef4444' }, { l: 'Bianchi', v: typeCounts.Bianco, c: '#facc15' }, { l: 'Bolle', v: typeCounts.Bollicine, c: '#fbbf24' }, { l: 'Rosati', v: typeCounts.Rosato, c: '#f472b6' }].map(s => ({...s, p: (s.v / totalTypes) * 100})).filter(s => s.v > 0);

        return { totalSpent, totalValueCellar, avgPrice, avgScore, typeSegments };
    }, [logs, cellar]);

    const getConicGradient = () => { let angle = 0; return `conic-gradient(${stats.typeSegments.map(s => { const start = angle; angle += (s.p * 3.6); return `${s.c} ${start}deg ${angle}deg`; }).join(', ')})`; };

    return (
        <div className="space-y-6 pb-20 animate-in slide-in-from-bottom-4 fade-in">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white px-1">Dashboard</h2>
            <div className="grid grid-cols-2 gap-3"><div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800"><div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase"><Icons.Archive size={14} className="text-indigo-500"/> Valore Cantina</div><div className="text-2xl font-black text-slate-800 dark:text-white">€{stats.totalValueCellar.toLocaleString()}</div></div><div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800"><div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase"><Icons.Wine size={14} className="text-emerald-500"/> Investito Tot.</div><div className="text-2xl font-black text-slate-800 dark:text-white">€{stats.totalSpent.toLocaleString()}</div></div><div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800"><div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase"><Icons.Activity size={14} className="text-orange-500"/> Prezzo Medio</div><div className="text-2xl font-black text-slate-800 dark:text-white">€{stats.avgPrice}</div></div><div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800"><div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase"><Icons.Star size={14} className="text-yellow-500"/> Voto Medio</div><div className="text-2xl font-black text-slate-800 dark:text-white">{stats.avgScore}</div></div></div>
            {stats.typeSegments.length > 0 && (<Card><h3 className="font-bold text-lg mb-4 flex items-center gap-2 dark:text-white"><Icons.PieChart size={20} className="text-slate-400"/> Cosa Bevi?</h3><div className="flex items-center gap-6"><div className="relative w-32 h-32 rounded-full shadow-inner" style={{ background: getConicGradient() }}><div className="absolute inset-0 m-auto w-20 h-20 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm"><Icons.Wine className="text-slate-300 dark:text-slate-700 opacity-50" size={24}/></div></div><div className="flex-1 space-y-2">{stats.typeSegments.map((s, i) => (<div key={i} className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{backgroundColor: s.c}}></span><span className="font-medium text-slate-700 dark:text-slate-300">{s.l}</span></div><span className="font-bold text-slate-900 dark:text-white">{Math.round(s.p)}%</span></div>))}</div></div></Card>)}
        </div>
    );
}

export default App;