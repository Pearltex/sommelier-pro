import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Wine, Beer, GlassWater, Utensils, Moon, Sun, Plus, Search, BarChart3,
  Home, Archive, Save, X, CheckCircle2, MapPin, Users, Calendar, ChevronDown,
  ChevronUp, Star, FileText, Pencil, Trash2, Camera, DownloadCloud, UploadCloud,
  Database, Settings, Sparkles, Bot, Loader2, ShoppingBag, Store, ScrollText,
  ClipboardCheck, Eye, Wind, Activity
} from 'lucide-react';

// Mappatura icone per mantenere compatibilità con il tuo codice
const Icons = {
  Wine, Beer, GlassWater, Utensils, Moon, Sun, Plus, Search, BarChart3,
  Home, Archive, Save, X, CheckCircle2, MapPin, Users, Calendar, ChevronDown,
  ChevronUp, Star, FileText, Pencil, Trash2, Camera, DownloadCloud, UploadCloud,
  Database, Settings, Sparkles, Bot, Loader2, ShoppingBag, Store, ScrollText,
  ClipboardCheck, Eye, Wind, Activity
};

const APP_TITLE = "SOMMELIER PRO";

// --- GEMINI AI AVANZATA (TESTO + IMMAGINI) ---
const callGemini = async (apiKey, prompt, base64Image = null) => {
    if (!apiKey) throw new Error("API Key mancante. Impostala (⚙️).");
    
    // Prepariamo il contenuto
    const parts = [{ text: prompt }];
    
    // Se c'è un'immagine, la aggiungiamo alla richiesta
    if (base64Image) {
        // Rimuoviamo l'intestazione del base64 (es. "data:image/jpeg;base64,") per inviarla a Google
        const imageContent = base64Image.split(",")[1];
        parts.push({
            inline_data: {
                mime_type: "image/jpeg",
                data: imageContent
            }
        });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: parts }] })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.candidates[0].content.parts[0].text;
    } catch (error) { console.error("Gemini Error:", error); throw error; }
};

// --- UTILITY ---
const resizeImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 600; const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH; canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            }; img.src = e.target.result;
        }; reader.readAsDataURL(file);
    });
};

const DB_CATS = { WINE: "Vino", BEER: "Birra", SPIRIT: "Distillato" };
const DB_METHODS = ["Metodo Classico", "Charmat", "Barrique", "Botte Grande", "Acciaio", "Anfora", "Appassimento", "Solera", "Torbatura"];

// --- TERMINI AIS AGGIORNATI ---
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
    DESCRIZIONE: ["Aromatico", "Vinoso", "Floreale", "Fruttato", "Fragrante", "Erbaceo", "Minerale", "Speziato", "Etereo", "Tostato"],
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

const GEO_DB = {
    "milano": { r: "Lombardia", c: "Italia" }, "roma": { r: "Lazio", c: "Italia" },
    "napoli": { r: "Campania", c: "Italia" }, "torino": { r: "Piemonte", c: "Italia" },
    "firenze": { r: "Toscana", c: "Italia" }, "pescara": { r: "Abruzzo", c: "Italia" },
    "verona": { r: "Veneto", c: "Italia" }, "bologna": { r: "Emilia-Romagna", c: "Italia" },
    "palermo": { r: "Sicilia", c: "Italia" }, "bari": { r: "Puglia", c: "Italia" },
    "genova": { r: "Liguria", c: "Italia" }, "venezia": { r: "Veneto", c: "Italia" }
};

const DB_MASTER = [
    { n: "Sassicaia", p: "Tenuta San Guido", t: "Rosso", c: DB_CATS.WINE, m: "Barrique" },
    { n: "Tignanello", p: "Antinori", t: "Rosso", c: DB_CATS.WINE, m: "Barrique" },
    { n: "Krug Grande Cuvée", p: "Krug", t: "Bollicine", c: DB_CATS.WINE, m: "Metodo Classico" },
    { n: "Dom Pérignon", p: "Moët & Chandon", t: "Bollicine", c: DB_CATS.WINE, m: "Metodo Classico" },
    { n: "Cervaro della Sala", p: "Antinori", t: "Bianco", c: DB_CATS.WINE, m: "Barrique" },
    { n: "Lagavulin 16", p: "Lagavulin", t: "Whisky", c: DB_CATS.SPIRIT, m: "Torbatura" }
];

// --- UI COMPONENTS ---
const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, isLoading = false }) => {
    const base = "w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed";
    const styles = {
        primary: "bg-slate-900 text-white shadow-slate-300",
        success: "bg-emerald-600 text-white shadow-emerald-200",
        danger: "bg-red-50 text-red-500 hover:bg-red-100 border border-red-200",
        ghost: "bg-transparent text-gray-500 hover:bg-gray-100 shadow-none",
        ai: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-purple-200"
    };
    return ( <button onClick={onClick} disabled={isLoading} className={`${base} ${styles[variant]} ${className}`}> {isLoading ? <Icons.Loader2 size={18} className="animate-spin"/> : (Icon && <Icon size={18} />)} {children} </button> );
};

const Input = ({ label, ...props }) => ( <div className="mb-3 w-full"> {label && <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide">{label}</label>} <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-800 focus:bg-white transition-colors" {...props} /> </div> );
const Select = ({ label, options, ...props }) => ( <div className="mb-3 w-full"> {label && <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide">{label}</label>} <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-800 bg-white" {...props}> <option value="">-- Seleziona --</option> {options.map(o => <option key={o} value={o}>{o}</option>)} </select> </div> );
const Card = ({ children, className = '', onClick }) => ( <div onClick={onClick} className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 ${className} ${onClick ? 'cursor-pointer active:bg-gray-50' : ''}`}>{children}</div> );

// --- MAIN APP COMPONENT ---
function App() {
    const [tab, setTab] = useState('home');
    const [session, setSession] = useState(null); 
    const [showSettings, setShowSettings] = useState(false);
    
    // In React/Vite, localStorage access needs to be safe
    const [apiKey, setApiKey] = useState(() => {
      try { return localStorage.getItem('somm_apikey') || ""; } catch { return ""; }
    });
    const [logs, setLogs] = useState(() => {
      try { return JSON.parse(localStorage.getItem('somm_logs')) || []; } catch { return []; }
    });
    const [cellar, setCellar] = useState(() => {
      try { return JSON.parse(localStorage.getItem('somm_cellar')) || []; } catch { return []; }
    });
    const [localDB, setLocalDB] = useState(() => {
      try { return JSON.parse(localStorage.getItem('somm_db')) || DB_MASTER; } catch { return DB_MASTER; }
    });

    useEffect(() => {
        localStorage.setItem('somm_logs', JSON.stringify(logs));
        localStorage.setItem('somm_cellar', JSON.stringify(cellar));
        localStorage.setItem('somm_db', JSON.stringify(localDB));
        localStorage.setItem('somm_apikey', apiKey);
    }, [logs, cellar, localDB, apiKey]);

    // NAVIGATION ACTIONS
    const startSession = (mode, initialItemData = null) => {
        const initialStep = mode === 'Acquisto' ? 'adding' : 'context';
        setSession({ 
            id: Date.now(), mode, date: new Date().toISOString().split('T')[0], 
            locName: '', locCity: '', locRegion: '', locCountry: '', 
            friends: [], items: initialItemData ? [initialItemData] : [], 
            step: initialItemData ? 'adding' : initialStep
        });
        setTab('session');
    };

    const editSession = (log) => { setSession({ ...log, step: 'context' }); setTab('session'); };
    const deleteSession = (id) => { if(confirm("Eliminare?")) setLogs(logs.filter(l => l.id !== id)); };
    
    const saveSession = (final) => {
        if(final.mode === 'Acquisto') {
            const newBottles = final.items.map(i => ({
                id: Date.now() + Math.random(), n: i.wine, p: i.prod, y: i.year, q: 1, pr: i.price, buyPlace: i.buyPlace
            }));
            setCellar([...cellar, ...newBottles]);
            alert("Aggiunto in Cantina! 📦");
            setSession(null); setTab('cantina');
            return;
        }
        const idx = logs.findIndex(l => l.id === final.id);
        if (idx >= 0) { const u = [...logs]; u[idx] = final; setLogs(u); } else { setLogs([final, ...logs]); }
        setSession(null); setTab('history');
    };

    const exportBackup = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ logs, cellar, localDB, version: "7.4" }));
        const a = document.createElement('a'); a.href = dataStr; a.download = "somm_backup.json"; document.body.appendChild(a); a.click(); a.remove();
    };
    const importBackup = (e) => {
        const file = e.target.files[0]; if(!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try { const j = JSON.parse(ev.target.result); if(confirm("Sovrascrivere dati?")) {
                if(j.logs) localStorage.setItem('somm_logs', JSON.stringify(j.logs));
                if(j.cellar) localStorage.setItem('somm_cellar', JSON.stringify(j.cellar));
                if(j.db) localStorage.setItem('somm_db', JSON.stringify(j.db));
                window.location.reload();
            }} catch(x){alert("Errore file");}
        }; reader.readAsText(file);
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
            <div className="bg-white sticky top-0 z-50 px-4 py-4 border-b border-gray-200 flex justify-between items-center shadow-sm">
                <h1 className="text-xl font-black tracking-tight text-slate-800">{APP_TITLE}</h1>
                <div className="flex gap-2">
                    {session && tab !== 'session' && <button onClick={() => setTab('session')} className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">REC</button>}
                    <button onClick={() => setShowSettings(true)} className="text-slate-400 hover:text-slate-800"><Icons.Settings size={20}/></button>
                </div>
            </div>

            {showSettings && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-sm animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg flex items-center gap-2"><Icons.Sparkles size={18} className="text-indigo-500"/> AI Settings</h3><button onClick={() => setShowSettings(false)}><Icons.X size={20}/></button></div>
                        <Input label="Gemini API Key" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="AIzaSy..." />
                        <Button onClick={() => setShowSettings(false)} variant="primary">Salva</Button>
                    </Card>
                </div>
            )}

            <main className="p-4 max-w-md mx-auto">
                {tab === 'home' && <HomeView startSession={startSession} logs={logs} cellar={cellar} onExp={exportBackup} onImp={importBackup} />}
                {tab === 'cantina' && <CellarView cellar={cellar} setCellar={setCellar} startSession={startSession} apiKey={apiKey} />}
                {tab === 'history' && <HistoryView logs={logs} onEdit={editSession} onDelete={deleteSession} />}
                {tab === 'stats' && <StatsView logs={logs} cellar={cellar} />}
                {tab === 'session' && session && <SessionManager session={session} setSession={setSession} onSave={saveSession} onCancel={() => { setSession(null); setTab('home'); }} apiKey={apiKey} db={localDB} />}
            </main>

            {(!session || tab !== 'session') && (
                <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe pt-2 flex justify-around items-center z-50 h-16">
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
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${active ? 'text-slate-900' : 'text-gray-300'}`}>
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);

// --- VISTE ---
function HomeView({ startSession, logs, cellar, onExp, onImp }) {
    const totalSpent = logs.reduce((acc, l) => acc + (l.bill || 0), 0);
    return (
        <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-300 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Investimento Totale</p>
                    <h2 className="text-4xl font-black tracking-tight mt-1">€{totalSpent.toLocaleString()}</h2>
                    <div className="flex gap-3 mt-4">
                        <div className="bg-slate-800/50 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2"><Icons.Wine size={12} className="text-pink-500"/> {logs.length} Eventi</div>
                        <div className="bg-slate-800/50 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2"><Icons.Archive size={12} className="text-emerald-500"/> {cellar.length} Bottiglie</div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                {[{ l: "Degustazione", i: Icons.Wine, c: "bg-pink-50 text-pink-900" }, { l: "Pranzo", i: Icons.Utensils, c: "bg-emerald-50 text-emerald-900" }, { l: "Aperitivo", i: Icons.Sun, c: "bg-orange-50 text-orange-900" }, { l: "Cena", i: Icons.Moon, c: "bg-indigo-50 text-indigo-900" }].map(m => (
                    <button key={m.l} onClick={() => startSession(m.l)} className={`${m.c} p-5 rounded-2xl flex flex-col items-center gap-2 font-bold transition-transform active:scale-95 border border-transparent hover:border-current shadow-sm`}><m.i size={28} /> <span>{m.l}</span></button>
                ))}
                <button onClick={() => startSession('Acquisto')} className="col-span-2 bg-slate-800 text-white p-5 rounded-2xl flex flex-row items-center justify-center gap-3 font-bold transition-transform active:scale-95 shadow-lg shadow-slate-200">
                    <Icons.ShoppingBag size={24} /> <span>Acquisto / Cantina Rapida</span>
                </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-1"><Icons.Database size={12}/> Gestione Dati</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={onExp} className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 font-bold text-sm text-slate-700 active:bg-gray-50"><Icons.DownloadCloud size={16} /> Backup</button>
                    <label className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 font-bold text-sm text-slate-700 active:bg-gray-50 cursor-pointer"><Icons.UploadCloud size={16} /> Ripristina<input type="file" hidden accept=".json" onChange={onImp} /></label>
                </div>
            </div>
        </div>
    );
}

function SessionManager({ session, setSession, onSave, onCancel, apiKey, db }) {
    const [step, setStep] = useState(session.step);
    const [item, setItem] = useState(session.items[0] || {});
    const [tempGrape, setTempGrape] = useState("");
    const [tempPerc, setTempPerc] = useState("");
    const [tempFriend, setTempFriend] = useState("");
    const [tempDescAis, setTempDescAis] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);
    const fileInputFood = useRef(null);
    const fileInputWine = useRef(null);

    const handleCityChange = (e) => {
        const val = e.target.value;
        const lower = val.toLowerCase().trim();
        let update = { locCity: val };
        if (GEO_DB[lower]) { update.locRegion = GEO_DB[lower].r; update.locCountry = GEO_DB[lower].c; }
        setSession(prev => ({ ...prev, ...update }));
    };

    const handleSmartFill = async () => {
    // Controllo: serve almeno il nome O una foto
    if (!item.wine && !item.food && !item.imgWine && !item.imgFood) return alert("Inserisci un nome o una foto!");
    
    setIsAiLoading(true);
    try {
        let prompt = "";
        let imageToSend = null;

        // Se stiamo analizzando un VINO
        if (item.wine || item.imgWine) {
            imageToSend = item.imgWine;
            prompt = `
                Analizza questo vino (dal nome "${item.wine || ''}" o dall'immagine etichetta).
                Restituisci ESCLUSIVAMENTE un JSON valido (senza markdown) con questi campi:
                {
                    "wine": "Nome completo preciso",
                    "prod": "Nome Produttore",
                    "year": "Anno (se visibile o deducibile, numero o stringa vuota)",
                    "type": "Tipologia (es. Rosso, Bianco, Bollicine...)",
                    "method": "Metodo (es. Classico, Charmat, Barrique, Acciaio...)",
                    "alcohol": "Gradazione alcolica (solo numero, es. 13.5)",
                    "price": "Prezzo medio stimato in enoteca (solo numero)",
                    "grapes": [ {"name": "Nome Vitigno", "perc": 100} ] 
                    // Se è un blend, stima le percentuali (es. cabernet 85, cabernet franc 15). La somma deve fare 100.
                }
            `;
        } 
        // Se stiamo analizzando un PIATTO
        else if (item.food || item.imgFood) {
            imageToSend = item.imgFood;
            prompt = `
                Analizza questo piatto (dal nome "${item.food || ''}" o dall'immagine).
                Restituisci ESCLUSIVAMENTE un JSON valido (senza markdown) con questi campi:
                {
                    "food": "Nome preciso del piatto",
                    "desc": "Breve descrizione degli ingredienti principali"
                }
            `;
        }

        // Chiamata all'AI
        const text = await callGemini(apiKey, prompt, imageToSend);
        
        // Pulizia del risultato JSON
        const jsonString = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(jsonString);
        
        // Aggiorniamo i dati
        setItem(prev => ({ ...prev, ...data }));
        
    } catch (e) { 
        console.error(e);
        alert("Errore AI: " + e.message); 
    } finally { 
        setIsAiLoading(false); 
    }
};
// --- LOGICA VITIGNI ---
    const currentGrapeTotal = (item.grapes || []).reduce((acc, g) => acc + parseInt(g.perc || 0), 0);

    const addGrape = () => {
        if (!tempGrape || !tempPerc) return;
        const p = parseInt(tempPerc);
        if (p <= 0) return alert("La percentuale deve essere maggiore di 0");
        if (currentGrapeTotal + p > 100) return alert(`Totale supera 100%! Hai ancora a disposizione il ${100 - currentGrapeTotal}%`);
        
        setItem(prev => ({ 
            ...prev, 
            grapes: [...(prev.grapes || []), { name: tempGrape, perc: p }] 
        }));
        setTempGrape(""); 
        setTempPerc("");
    };

    const addResidualGrape = () => {
        const left = 100 - currentGrapeTotal;
        if (left > 0) {
            setItem(prev => ({ 
                ...prev, 
                grapes: [...(prev.grapes || []), { name: "Altri vitigni", perc: left }] 
            }));
        }
    };

    const removeGrape = (idx) => {
        setItem(prev => ({ 
            ...prev, 
            grapes: prev.grapes.filter((_, i) => i !== idx) 
        }));
    };
    const handlePhoto = async (e, type) => { const f = e.target.files[0]; if (f) { const b64 = await resizeImage(f); setItem(prev => ({ ...prev, [type]: b64 })); } };
    
    const addItem = () => { 
        if (!item.wine && !item.food) return; 
        if(session.mode === 'Acquisto') {
            onSave({ ...session, items: [item] });
        } else {
            setSession(prev => ({ ...prev, items: [...prev.items, item] })); 
            setItem({}); 
            setStep('context'); 
        }
    };
    
    const addFriend = () => { if(tempFriend.trim()) { setSession(prev => ({ ...prev, friends: [...prev.friends, tempFriend] })); setTempFriend(""); } };
    const removeItem = (idx) => { setSession(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) })); };

    // Helper per i colori dinamici AIS
    const getColorOptions = (type) => {
        const t = (type || "").toLowerCase();
        if (t.includes("bianco") || t.includes("bollicine") || t.includes("spumante")) return AIS_TERMS.COLORE_BIANCO;
        if (t.includes("rosato") || t.includes("cerasuolo") || t.includes("chiaretto")) return AIS_TERMS.COLORE_ROSATO;
        return AIS_TERMS.COLORE_ROSSO; // Default rosso
    };

    const showEffervescence = (type) => {
        const t = (type || "").toLowerCase();
        return t.includes("bianco") || t.includes("bollicine") || t.includes("champagne") || t.includes("franciacorta") || t.includes("spumante") || t.includes("prosecco");
    };

    const showTannins = (type) => {
        const t = (type || "").toLowerCase();
        return t.includes("rosso") || t.includes("rosato") || t.includes("cerasuolo") || t.includes("chiaretto");
    };

    const addAisDesc = () => {
        if(!tempDescAis) return;
        const current = item.ais?.descTags || [];
        setItem({ ...item, ais: { ...item.ais, descTags: [...current, tempDescAis] } });
        setTempDescAis("");
    };
    const removeAisDesc = (idx) => {
        const current = item.ais?.descTags || [];
        setItem({ ...item, ais: { ...item.ais, descTags: current.filter((_, i) => i !== idx) } });
    };

    // 1. CONTESTO
    if (step === 'context') return (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in">
            <Card>
                <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold"><Icons.MapPin className="text-red-500" size={20} /> <h3>Dettagli Evento</h3></div>
                <Input label="Data Evento" type="date" value={session.date} onChange={e => setSession({...session, date: e.target.value})} />
                <Input label="Nome Location" placeholder="Es. Ristorante Da Vittorio" value={session.locName} onChange={e => setSession({...session, locName: e.target.value})} />
                
                <Input label="Città" placeholder="Es. Pescara" value={session.locCity} onChange={handleCityChange} />
                <div className="flex gap-2">
                    <div className="flex-1"><Input label="Regione" value={session.locRegion || ''} onChange={e => setSession({...session, locRegion: e.target.value})} /></div>
                    <div className="flex-1"><Input label="Stato" value={session.locCountry || ''} onChange={e => setSession({...session, locCountry: e.target.value})} /></div>
                </div>
            </Card>
            <Card>
                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold"><Icons.Users className="text-blue-500" size={20} /><h3>Compagnia</h3></div>
                <div className="flex gap-2 mb-3"><input className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" placeholder="Nome..." value={tempFriend} onChange={e => setTempFriend(e.target.value)} /><button onClick={addFriend} className="bg-blue-100 text-blue-600 p-3 rounded-xl font-bold">+</button></div>
                <div className="flex flex-wrap gap-2">{session.friends.map((f, i) => ( <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">{f} <button onClick={() => setSession(prev => ({...prev, friends: prev.friends.filter((_, ix) => ix !== i)}))} className="text-red-400 font-bold">×</button></span> ))}</div>
            </Card>
            <div className="space-y-2">{session.items.map((i, idx) => ( <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center"><div><div className="font-bold text-slate-800">{i.wine || i.food}</div><div className="text-xs text-gray-400 uppercase font-bold">{i.type}</div></div><button onClick={() => removeItem(idx)} className="text-red-300 hover:text-red-500"><Icons.Trash2 size={16} /></button></div> ))}</div>
            <Button onClick={() => setStep('adding')} icon={Icons.Plus}>Aggiungi Elemento</Button>
            {session.items.length > 0 && <Button onClick={() => setStep('finish')} variant="success" icon={Icons.Save} className="mt-4">Concludi</Button>}
            <Button onClick={onCancel} variant="ghost" className="text-red-400">Annulla</Button>
        </div>
    );

    // 2. AGGIUNTA
    if (step === 'adding') return (
        <div className="space-y-4 animate-in slide-in-from-right-8 fade-in">
            <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-lg">{session.mode === 'Acquisto' ? 'Nuova Bottiglia' : 'Nuovo Inserimento'}</h3><button onClick={onCancel}><Icons.X size={20} className="text-gray-400"/></button></div>
            
            {session.mode !== 'Degustazione' && session.mode !== 'Acquisto' && (
                <Card>
                    <div className="flex gap-2 items-end"><div className="flex-1 flex items-end gap-2">
    <Input label="Piatto" value={item.food || ''} onChange={e => setItem({...item, food: e.target.value})} />
    <button onClick={handleSmartFill} disabled={isAiLoading} className="mb-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg shadow-purple-200 disabled:opacity-50">
        {isAiLoading ? <Icons.Loader2 size={20} className="animate-spin"/> : <Icons.Sparkles size={20}/>}
    </button>
</div><div className="mb-3"><input type="file" ref={fileInputFood} hidden accept="image/*" onChange={(e) => handlePhoto(e, 'imgFood')} /><button onClick={() => fileInputFood.current.click()} className="p-3 rounded-xl border bg-gray-50 text-gray-400"><Icons.Camera size={24}/></button></div></div>
                    {item.imgFood && <div className="h-24 w-full bg-cover bg-center rounded-lg mt-2" style={{backgroundImage: `url(${item.imgFood})`}}></div>}
                </Card>
            )}

            <Card className="border-l-4 border-l-indigo-500">
                <div className="flex gap-2 items-end">
                    <div className="flex-1"><Input label="Etichetta / Nome" value={item.wine || ''} onChange={e => setItem({...item, wine: e.target.value})} list="db_names"/><datalist id="db_names">{db.map(d => <option key={d.n + d.p} value={d.n} />)}</datalist></div>
                    <button onClick={handleSmartFill} disabled={isAiLoading} className="mb-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg shadow-purple-200 disabled:opacity-50">{isAiLoading ? <Icons.Loader2 size={20} className="animate-spin"/> : <Icons.Sparkles size={20}/>}</button>
                    <div className="mb-3"><input type="file" ref={fileInputWine} hidden accept="image/*" onChange={(e) => handlePhoto(e, 'imgWine')} /><button onClick={() => fileInputWine.current.click()} className="p-3 rounded-xl border bg-gray-50 text-gray-400"><Icons.Camera size={24}/></button></div>
                </div>
                {item.imgWine && <div className="h-40 w-full bg-contain bg-no-repeat bg-center rounded-lg mt-2 mb-4 bg-gray-100" style={{backgroundImage: `url(${item.imgWine})`}}></div>}
                <div className="flex gap-2"><Input label="Produttore" value={item.prod || ''} onChange={e => setItem({...item, prod: e.target.value})} /><div className="w-24"><Input label="Anno" type="number" value={item.year || ''} onChange={e => setItem({...item, year: e.target.value})} /></div></div>
                <div className="flex gap-2"><Input label="Tipologia" placeholder="Rosso, Bianco..." value={item.type || ''} onChange={e => setItem({...item, type: e.target.value})} /><div className="w-1/2"><Select label="Metodo" value={item.method || ''} onChange={e => setItem({...item, method: e.target.value})} options={DB_METHODS} /></div></div>
{/* SEZIONE VITIGNI */}
                <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 mb-3">
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide flex justify-between">
                        <span>Uvaggio / Vitigni</span>
                        <span className={currentGrapeTotal === 100 ? "text-emerald-500" : "text-orange-500"}>{currentGrapeTotal}% / 100%</span>
                    </label>
                    
                    {/* Lista Vitigni Inseriti */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {(item.grapes || []).map((g, i) => (
                            <div key={i} className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                <span className="text-indigo-600">{g.perc}%</span>
                                <span className="text-slate-700">{g.name}</span>
                                <button onClick={() => removeGrape(i)} className="text-red-400 hover:text-red-600 ml-1">×</button>
                            </div>
                        ))}
                    </div>

                    {/* Input Nuovo Vitigno */}
                    {currentGrapeTotal < 100 && (
                        <div className="flex gap-2 items-center">
                            <div className="flex-1">
                                <input 
                                    className="w-full p-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none" 
                                    placeholder="Es. Sangiovese" 
                                    value={tempGrape} 
                                    onChange={e => setTempGrape(e.target.value)} 
                                />
                            </div>
                            <div className="w-16">
                                <input 
                                    type="number" 
                                    className="w-full p-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none text-center" 
                                    placeholder="%" 
                                    value={tempPerc} 
                                    onChange={e => setTempPerc(e.target.value)} 
                                />
                            </div>
                            <button onClick={addGrape} className="bg-slate-800 text-white p-2 rounded-lg font-bold text-sm">+</button>
                        </div>
                    )}

                    {/* Pulsante Rapido "Altri vitigni" */}
                    {currentGrapeTotal < 100 && currentGrapeTotal > 0 && (
                        <button onClick={addResidualGrape} className="mt-2 text-[10px] text-indigo-500 font-bold underline">
                            + Aggiungi il restante {100 - currentGrapeTotal}% come "Altri vitigni"
                        </button>
                    )}
                </div>
<div className="flex gap-2">
    <div className="flex-1">
        <Input 
            label="Alcol %" 
            type="number" 
            step="0.5" 
            placeholder="13.5" 
            value={item.alcohol || ''} 
            onChange={e => setItem({...item, alcohol: e.target.value})} 
        />
    </div>
    <div className="flex-1">
        <Input 
            label="Prezzo €" 
            type="number" 
            value={item.price || ''} 
            onChange={e => setItem({...item, price: e.target.value})} 
        />
    </div>
</div>                {(session.mode === 'Acquisto' || item.buyPlace) && (<Input label="Dove l'hai preso?" placeholder="Enoteca..." value={item.buyPlace || ''} onChange={e => setItem({...item, buyPlace: e.target.value})} />)}
            </Card>

            {session.mode !== 'Acquisto' && (
                <div className="mt-4 mb-4">
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Schede Tecniche (Opzionali)</label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <button onClick={() => setItem({...item, aisType: item.aisType === 'old' ? null : 'old'})} className={`py-3 rounded-xl text-sm font-bold border transition-all ${item.aisType === 'old' ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-600'}`}>Scheda AIS Old</button>
                        <button onClick={() => setItem({...item, aisType: item.aisType === 'new' ? null : 'new'})} className={`py-3 rounded-xl text-sm font-bold border transition-all ${item.aisType === 'new' ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}>Scheda AIS New</button>
                    </div>
                    <button onClick={() => setItem({...item, aisType: item.aisType === 'pairing' ? null : 'pairing'})} className={`w-full py-3 rounded-xl text-sm font-bold border transition-all ${item.aisType === 'pairing' ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-white border-gray-200 text-gray-600'}`}>Scheda Abbinamento Cibo-Vino</button>

                    {item.aisType === 'old' && (
                        <div className="mt-3 space-y-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in slide-in-from-top-2">
                            <div className="bg-white/50 p-3 rounded-xl border border-emerald-100">
                                <h4 className="text-xs font-black text-emerald-800 uppercase mb-2 flex items-center gap-2"><Icons.Eye size={14}/> 1. Esame Visivo</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select label="Limpidezza" options={AIS_TERMS.LIMPIDEZZA} value={item.ais?.limp || ''} onChange={e => setItem({...item, ais: {...item.ais, limp: e.target.value}})} />
                                    <Select label="Colore" options={getColorOptions(item.type)} value={item.ais?.col || ''} onChange={e => setItem({...item, ais: {...item.ais, col: e.target.value}})} />
                                </div>
                                <div className="mt-2"><Select label="Consistenza" options={AIS_TERMS.CONSISTENZA} value={item.ais?.cons || ''} onChange={e => setItem({...item, ais: {...item.ais, cons: e.target.value}})} /></div>
                                {showEffervescence(item.type) && (
                                    <div className="mt-3 pt-3 border-t border-emerald-100">
                                        <h5 className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Effervescenza</h5>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Select label="Grana" options={AIS_TERMS.GRANA_BOL} value={item.ais?.grana || ''} onChange={e => setItem({...item, ais: {...item.ais, grana: e.target.value}})} />
                                            <Select label="Numero" options={AIS_TERMS.NUMERO_BOL} value={item.ais?.numBol || ''} onChange={e => setItem({...item, ais: {...item.ais, numBol: e.target.value}})} />
                                            <Select label="Persistenza" options={AIS_TERMS.PERS_BOL} value={item.ais?.persBol || ''} onChange={e => setItem({...item, ais: {...item.ais, persBol: e.target.value}})} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white/50 p-3 rounded-xl border border-emerald-100">
                                <h4 className="text-xs font-black text-emerald-800 uppercase mb-2 flex items-center gap-2"><Icons.Wind size={14}/> 2. Esame Olfattivo</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select label="Intensità" options={AIS_TERMS.INTENSITA} value={item.ais?.int || ''} onChange={e => setItem({...item, ais: {...item.ais, int: e.target.value}})} />
                                    <Select label="Complessità" options={AIS_TERMS.COMPLESSITA} value={item.ais?.comp || ''} onChange={e => setItem({...item, ais: {...item.ais, comp: e.target.value}})} />
                                </div>
                                <div className="mt-2"><Select label="Qualità" options={AIS_TERMS.QUALITA} value={item.ais?.qualOlf || ''} onChange={e => setItem({...item, ais: {...item.ais, qualOlf: e.target.value}})} /></div>
                                <div className="mt-3 pt-2 border-t border-emerald-100">
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide">Descrizione</label>
                                    <div className="flex gap-2 mb-2">
                                        <div className="flex-1"><Select options={AIS_TERMS.DESCRIZIONE} value={tempDescAis} onChange={e => setTempDescAis(e.target.value)} /></div>
                                        <button onClick={addAisDesc} className="bg-emerald-100 text-emerald-700 p-2 rounded-lg font-bold w-10 h-[46px] flex items-center justify-center mt-[1px]">+</button>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {item.ais?.descTags?.map((tag, i) => (
                                            <span key={i} className="text-[10px] bg-white border border-emerald-200 px-2 py-1 rounded-full text-emerald-700 flex items-center gap-1">{tag} <button onClick={()=>removeAisDesc(i)} className="text-emerald-400 font-bold">×</button></span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/50 p-3 rounded-xl border border-emerald-100">
                                <h4 className="text-xs font-black text-emerald-800 uppercase mb-2 flex items-center gap-2"><Icons.Activity size={14}/> 3. Esame Gusto-Olfattivo</h4>
                                <div className="flex gap-4 mb-4 relative">
                                    <div className="flex-1 space-y-2 pr-2 border-r border-gray-300">
                                        <div className="text-[10px] font-bold text-orange-400 uppercase text-center border-b border-orange-200 pb-1">Morbidezze</div>
                                        <Select label="Zuccheri" options={AIS_TERMS.ZUCCHERI} value={item.ais?.zuc || ''} onChange={e => setItem({...item, ais: {...item.ais, zuc: e.target.value}})} />
                                        <Select label="Alcoli" options={AIS_TERMS.ALCOLI} value={item.ais?.alc || ''} onChange={e => setItem({...item, ais: {...item.ais, alc: e.target.value}})} />
                                        <Select label="Polialcoli" options={AIS_TERMS.POLIALCOLI} value={item.ais?.pol || ''} onChange={e => setItem({...item, ais: {...item.ais, pol: e.target.value}})} />
                                    </div>
                                    <div className="flex-1 space-y-2 pl-2">
                                        <div className="text-[10px] font-bold text-blue-400 uppercase text-center border-b border-blue-200 pb-1">Durezze</div>
                                        <Select label="Acidi" options={AIS_TERMS.ACIDI} value={item.ais?.acidi || ''} onChange={e => setItem({...item, ais: {...item.ais, acidi: e.target.value}})} />
                                        {showTannins(item.type) && ( <Select label="Tannini" options={AIS_TERMS.TANNINI} value={item.ais?.tan || ''} onChange={e => setItem({...item, ais: {...item.ais, tan: e.target.value}})} /> )}
                                        <Select label="Minerali" options={AIS_TERMS.MINERALI} value={item.ais?.min || ''} onChange={e => setItem({...item, ais: {...item.ais, min: e.target.value}})} />
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2 border-t-2 border-emerald-100">
                                    <Select label="Struttura" options={AIS_TERMS.CORPO} value={item.ais?.corpo || ''} onChange={e => setItem({...item, ais: {...item.ais, corpo: e.target.value}})} />
                                    <hr className="border-gray-300" />
                                    <Select label="Equilibrio" options={AIS_TERMS.EQUILIBRIO} value={item.ais?.equil || ''} onChange={e => setItem({...item, ais: {...item.ais, equil: e.target.value}})} />
                                    <hr className="border-gray-300" />
                                    <div className="bg-emerald-100/50 p-2 rounded-lg space-y-2">
                                        <h5 className="text-[10px] font-bold text-emerald-600 uppercase text-center">Analisi Retro-Olfattiva</h5>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Select label="Intensità" options={AIS_TERMS.INTENSITA_GUS} value={item.ais?.intGus || ''} onChange={e => setItem({...item, ais: {...item.ais, intGus: e.target.value}})} />
                                            <Select label="Persistenza" options={AIS_TERMS.PERSISTENZA} value={item.ais?.pers || ''} onChange={e => setItem({...item, ais: {...item.ais, pers: e.target.value}})} />
                                        </div>
                                        <Select label="Qualità" options={AIS_TERMS.QUALITA_GUS} value={item.ais?.qualGus || ''} onChange={e => setItem({...item, ais: {...item.ais, qualGus: e.target.value}})} />
                                    </div>
                                    <hr className="border-gray-300" />
                                    <Select label="Evoluzione" options={AIS_TERMS.EVOLUZIONE} value={item.ais?.evol || ''} onChange={e => setItem({...item, ais: {...item.ais, evol: e.target.value}})} />
                                    <hr className="border-gray-300" />
                                    <Select label="Armonia" options={AIS_TERMS.ARMONIA} value={item.ais?.arm || ''} onChange={e => setItem({...item, ais: {...item.ais, arm: e.target.value}})} />
                                </div>
                                <div className="mt-4 pt-3 border-t-2 border-emerald-100 text-center">
                                    <label className="block text-xs font-bold text-emerald-700 mb-2 uppercase">Punteggio Finale (0-100)</label>
                                    <input type="number" className="w-24 h-12 text-center text-2xl font-black text-emerald-600 border-2 border-emerald-200 rounded-xl outline-none focus:border-emerald-500 bg-white" placeholder="-" value={item.ais?.score || ''} onChange={e => setItem({...item, ais: {...item.ais, score: e.target.value}})} />
                                </div>
                            </div>
                        </div>
                    )}

                    {item.aisType === 'new' && (
                        <div className="mt-3 space-y-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in slide-in-from-top-2">
                            <h4 className="text-center text-sm font-bold text-indigo-800 mb-2">Scheda AIS 2.0 (Punteggio)</h4>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-white p-2 rounded-lg"><div className="text-xs text-gray-500">Visivo</div><input type="number" className="w-full text-center font-bold text-indigo-600 outline-none" placeholder="0-100" value={item.aisNew?.scoreVis || ''} onChange={e => setItem({...item, aisNew: {...item.aisNew, scoreVis: e.target.value}})} /></div>
                                <div className="bg-white p-2 rounded-lg"><div className="text-xs text-gray-500">Olfattivo</div><input type="number" className="w-full text-center font-bold text-indigo-600 outline-none" placeholder="0-100" value={item.aisNew?.scoreOlf || ''} onChange={e => setItem({...item, aisNew: {...item.aisNew, scoreOlf: e.target.value}})} /></div>
                                <div className="bg-white p-2 rounded-lg"><div className="text-xs text-gray-500">Gusto</div><input type="number" className="w-full text-center font-bold text-indigo-600 outline-none" placeholder="0-100" value={item.aisNew?.scoreGus || ''} onChange={e => setItem({...item, aisNew: {...item.aisNew, scoreGus: e.target.value}})} /></div>
                            </div>
                            <Input label="Valutazione Finale" placeholder="Considerazioni tecniche..." value={item.aisNew?.notes || ''} onChange={e => setItem({...item, aisNew: {...item.aisNew, notes: e.target.value}})} />
                        </div>
                    )}

                    {item.aisType === 'pairing' && (
                        <div className="mt-3 p-4 bg-orange-50 rounded-2xl border border-orange-100 animate-in slide-in-from-top-2 text-center">
                            <Icons.Utensils className="mx-auto text-orange-300 mb-2" size={32} />
                            <p className="text-sm text-orange-800 font-bold">Scheda Abbinamento</p>
                            <p className="text-xs text-orange-600">Modulo in arrivo nel prossimo aggiornamento.</p>
                        </div>
                    )}
                </div>
            )}
            
            {session.mode !== 'Acquisto' && (
                <div className="flex gap-3 mt-2"><Input label="Voto Personale" type="number" value={item.voteWine || ''} onChange={e => setItem({...item, voteWine: e.target.value})} />{session.mode !== 'Degustazione' && <Input label="Abbinam." type="number" value={item.votePair || ''} onChange={e => setItem({...item, votePair: e.target.value})} />}</div>
            )}
            
            <Button onClick={addItem} variant="primary">{session.mode === 'Acquisto' ? 'Salva in Cantina' : 'Salva Prodotto'}</Button>
        </div>
    );

    if (step === 'finish') return (
        <div className="space-y-6 pt-10 animate-in zoom-in-95 fade-in">
            <div className="text-center"><Icons.CheckCircle2 size={64} className="mx-auto text-emerald-500 mb-4" /><h2 className="text-2xl font-black">Salvataggio</h2></div>
            <Card><Input label="Totale €" type="number" value={session.bill || ''} onChange={e => setSession({...session, bill: parseFloat(e.target.value)})} /><Input label="Voto Location" type="number" value={session.locVote || ''} onChange={e => setSession({...session, locVote: e.target.value})} /><textarea className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" rows={4} placeholder="Note..." value={session.note || ''} onChange={e => setSession({...session, note: e.target.value})} /></Card>
            <Button onClick={() => onSave(session)} variant="success" className="h-16 text-lg">CONFERMA</Button><Button onClick={() => setStep('context')} variant="ghost">Indietro</Button>
        </div>
    );
}

function CellarView({ cellar, setCellar, apiKey, startSession }) {
    const [addMode, setAddMode] = useState(false);
    const [newBot, setNewBot] = useState({});
    const [loading, setLoading] = useState(false);

    const handleAdd = () => { setCellar([...cellar, { ...newBot, id: Date.now() }]); setAddMode(false); setNewBot({}); };
    
    const handleSmartFill = async () => {
        if(!newBot.n) return; setLoading(true);
        try { 
            const p = `Info vino "${newBot.n}". JSON: {"prod": "Produttore", "year": "Anno"}`; 
            const t = await callGemini(apiKey, p); 
            const d = JSON.parse(t.replace(/```json|```/g, '').trim()); 
            setNewBot(prev => ({ ...prev, p: d.prod, y: d.year })); 
        } catch(e) { alert("Errore AI"); } finally { setLoading(false); }
    };

    const openBottle = (b) => {
        if(confirm("Stappi questa bottiglia?")) {
            if (b.q > 1) setCellar(cellar.map(item => item.id === b.id ? { ...item, q: item.q - 1 } : item));
            else setCellar(cellar.filter(item => item.id !== b.id));
            startSession('Degustazione', { wine: b.n, prod: b.p, year: b.y, price: b.pr, buyPlace: b.buyPlace });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center"><h2 className="font-bold text-xl">Cantina</h2><button onClick={() => setAddMode(!addMode)} className="bg-slate-900 text-white p-2 rounded-full"><Icons.Plus size={20}/></button></div>
            {addMode && ( <Card className="animate-in slide-in-from-top-4"><div className="flex gap-2 items-end"><div className="flex-1"><Input label="Vino" value={newBot.n || ''} onChange={e => setNewBot({...newBot, n: e.target.value})} /></div><button onClick={handleSmartFill} disabled={loading} className="mb-3 p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Icons.Sparkles size={20}/></button></div><div className="flex gap-2"><Input label="Produttore" value={newBot.p || ''} onChange={e => setNewBot({...newBot, p: e.target.value})} /><div className="w-24"><Input label="Anno" type="number" value={newBot.y || ''} onChange={e => setNewBot({...newBot, y: e.target.value})} /></div></div><Input label="Quantità" type="number" value={newBot.q || 1} onChange={e => setNewBot({...newBot, q: parseInt(e.target.value)})} /><Input label="Dove l'hai preso?" value={newBot.buyPlace || ''} onChange={e => setNewBot({...newBot, buyPlace: e.target.value})} /><Button onClick={handleAdd} variant="success">Carica</Button></Card> )}
            <div className="space-y-2">{cellar.map(b => ( <div key={b.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center"><div><div className="font-bold text-slate-800">{b.n} <span className="text-gray-400 font-normal text-sm">{b.y}</span></div><div className="text-xs text-gray-500">{b.p} {b.buyPlace && <span className="text-indigo-500 ml-1">• {b.buyPlace}</span>}</div></div><div className="flex items-center gap-3"><span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-bold">x{b.q}</span><button onClick={() => openBottle(b)} className="text-slate-900 hover:bg-slate-100 p-2 rounded-full"><Icons.Wine size={18}/></button></div></div> ))}</div>
        </div>
    );
}

function HistoryView({ logs, onEdit, onDelete }) {
    const [q, setQ] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const filtered = logs.filter(l => JSON.stringify(l).toLowerCase().includes(q.toLowerCase()));
    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);
    return (
        <div className="space-y-4">
            <div className="sticky top-0 bg-slate-50 pb-2 z-10"><div className="relative"><Icons.Search className="absolute left-3 top-3.5 text-gray-400" size={16} /><input className="w-full pl-10 p-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-slate-500" placeholder="Cerca..." value={q} onChange={e => setQ(e.target.value)} /></div></div>
            {filtered.map(l => { const isExpanded = expandedId === l.id; return ( <div key={l.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition-all"><div onClick={() => toggleExpand(l.id)} className="cursor-pointer"><div className="flex justify-between mb-2"><div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><Icons.Calendar size={10} /> {l.date.split('-').reverse().join('/')} • {l.mode}</div><div className="font-black text-slate-900">€{l.bill}</div></div><div className="flex justify-between items-start"><div className="font-bold text-lg mb-1 text-slate-800">{l.locName || 'Evento'} <span className="text-xs font-normal text-gray-500 block">{l.locCity}</span></div>{isExpanded ? <Icons.ChevronUp size={20} className="text-gray-400"/> : <Icons.ChevronDown size={20} className="text-gray-400"/>}</div></div>{isExpanded && (<div className="mt-4 pt-3 border-t border-dashed border-gray-200 animate-in slide-in-from-top-2 fade-in"><div className="space-y-4 mb-4">{l.items.map((i, idx) => ( <div key={idx} className="flex gap-3 text-sm">{i.imgWine ? <div className="w-12 h-16 bg-cover bg-center rounded bg-gray-200 flex-shrink-0" style={{backgroundImage: `url(${i.imgWine})`}}></div> : <div className="w-12 h-16 bg-slate-100 rounded flex items-center justify-center flex-shrink-0"><Icons.Wine size={20} className="text-gray-300"/></div>}<div className="flex-1"><div className="font-bold text-slate-800">{i.wine || i.food}</div><div className="text-xs text-gray-500">{i.prod} {i.year} {i.buyPlace && <span className="text-indigo-500">• {i.buyPlace}</span>}</div>{i.aisType === 'old' && <div className="text-[10px] text-emerald-600 mt-1 font-medium bg-emerald-50 inline-block px-1 rounded">AIS OLD</div>}{i.aisType === 'new' && <div className="text-[10px] text-indigo-600 mt-1 font-medium bg-indigo-50 inline-block px-1 rounded">AIS NEW</div>}</div>{i.voteWine && <span className="bg-slate-100 text-[10px] font-bold px-2 py-1 rounded h-fit">{i.voteWine}</span>}</div> ))}</div><div className="grid grid-cols-2 gap-4 mb-3"><div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100"><div className="flex items-center gap-1 text-xs font-bold text-yellow-600 uppercase mb-1"><Icons.Star size={12}/> Voto Location</div><div className="font-black text-xl text-slate-800">{l.locVote || '-'}</div></div><div className="bg-blue-50 p-3 rounded-lg border border-blue-100"><div className="flex items-center gap-1 text-xs font-bold text-blue-600 uppercase mb-1"><Icons.Users size={12}/> Compagnia</div><div className="text-sm font-medium text-slate-700 leading-tight">{l.friends && l.friends.length > 0 ? l.friends.join(", ") : "-"}</div></div></div>{l.note && (<div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4"><div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase mb-1"><Icons.FileText size={12}/> Note</div><div className="text-sm text-slate-700 italic">"{l.note}"</div></div>)}<div className="flex gap-2 mt-4 pt-4 border-t border-gray-100"><Button onClick={() => onEdit(l)} variant="primary" className="h-10 text-xs" icon={Icons.Pencil}>Modifica</Button><Button onClick={() => onDelete(l.id)} variant="danger" className="h-10 text-xs" icon={Icons.Trash2}>Elimina</Button></div></div>)}</div> ); })}</div>
    );
}

function StatsView({ logs, cellar }) {
    const stats = useMemo(() => {
        const counts = {};
        let aisOld = 0, aisNew = 0, pairing = 0;
        
        cellar.forEach(b => { if(b.buyPlace) counts[b.buyPlace] = (counts[b.buyPlace] || 0) + 1; });
        logs.forEach(l => l.items.forEach(i => { 
            if(i.buyPlace) counts[i.buyPlace] = (counts[i.buyPlace] || 0) + 1; 
            if(i.aisType === 'old') aisOld++;
            if(i.aisType === 'new') aisNew++;
            if(i.aisType === 'pairing') pairing++;
        }));
        return { places: Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 5), aisOld, aisNew, pairing };
    }, [logs, cellar]);

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Top Fornitori</h3>
                {stats.places.length === 0 ? <div className="text-center text-sm text-slate-500 py-4">Nessun dato acquisto</div> :
                 stats.places.map(([place, count], idx) => (
                    <div key={idx} className="flex items-center justify-between mb-3 last:mb-0">
                        <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">{idx+1}</span><span className="font-bold">{place}</span></div>
                        <span className="text-sm font-medium text-indigo-400">{count} bott.</span>
                    </div>
                ))}
            </Card>
            
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center"><div className="text-2xl font-black text-emerald-600">{stats.aisOld}</div><div className="text-[10px] font-bold text-emerald-800 uppercase">AIS Old</div></div>
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-center"><div className="text-2xl font-black text-indigo-600">{stats.aisNew}</div><div className="text-[10px] font-bold text-indigo-800 uppercase">AIS New</div></div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-center"><div className="text-2xl font-black text-orange-600">{stats.pairing}</div><div className="text-[10px] font-bold text-orange-800 uppercase">Abbin.</div></div>
            </div>

            <div className="text-center py-10 text-gray-400"><Icons.BarChart3 size={48} className="mx-auto mb-4 opacity-20"/><p>Altre statistiche in arrivo...</p></div>
        </div>
    );
}

export default App;