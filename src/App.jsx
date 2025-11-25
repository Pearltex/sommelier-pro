import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Wine, Beer, GlassWater, Utensils, Moon, Sun, Plus, Search, BarChart3,
  Home, Archive, Save, X, CheckCircle2, MapPin, Users, Calendar, ChevronDown,
  ChevronUp, Star, FileText, Pencil, Trash2, Camera, DownloadCloud, UploadCloud,
  Database, Settings, Sparkles, Bot, Loader2, ShoppingBag, Store, ScrollText,
  ClipboardCheck, Eye, Wind, Activity, Map, PieChart, Award, Filter, Quote
} from 'lucide-react';

// Mappatura icone
const Icons = {
  Wine, Beer, GlassWater, Utensils, Moon, Sun, Plus, Search, BarChart3,
  Home, Archive, Save, X, CheckCircle2, MapPin, Users, Calendar, ChevronDown,
  ChevronUp, Star, FileText, Pencil, Trash2, Camera, DownloadCloud, UploadCloud,
  Database, Settings, Sparkles, Bot, Loader2, ShoppingBag, Store, ScrollText,
  ClipboardCheck, Eye, Wind, Activity, Map, PieChart, Award, Filter, Quote
};

const APP_TITLE = "SOMMELIER PRO";

// --- GEMINI AI (AUTO-DISCOVERY PER ACCOUNT BILLING) ---
const callGemini = async (apiKey, prompt, base64Image = null) => {
    if (!apiKey) throw new Error("API Key mancante.");

    // Funzione interna per fare la chiamata vera e propria
    const performRequest = async (modelName) => {
        // Pulisce il nome (toglie "models/" se c'è)
        const cleanName = modelName.replace("models/", "");
        
        const parts = [{ text: prompt }];
        if (base64Image) {
            const imageContent = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;
            parts.push({ inline_data: { mime_type: "image/jpeg", data: imageContent } });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${cleanName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: parts }] })
        });

        const data = await response.json();
        
        if (data.error) {
            // Se errore 404, lanciamo un errore specifico per attivare la ricerca
            if (data.error.code === 404 || data.error.message.includes("not found")) {
                throw new Error("MODEL_NOT_FOUND");
            }
            throw new Error(data.error.message);
        }
        
        return data;
    };

    // Funzione per pulire il JSON
    const parseData = (data) => {
        if (!data.candidates || !data.candidates[0]) throw new Error("Nessuna risposta.");
        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const s = text.indexOf('{'); const e = text.lastIndexOf('}');
        const sa = text.indexOf('['); const ea = text.lastIndexOf(']');
        let start = -1, end = -1;
        if (s !== -1 && (sa === -1 || s < sa)) { start = s; end = e; } else if (sa !== -1) { start = sa; end = ea; }
        if (start !== -1 && end !== -1) text = text.substring(start, end + 1);
        return JSON.parse(text);
    };

    // --- FLUSSO PRINCIPALE ---
    try {
        // 1. Proviamo il modello Flash (che è il migliore)
        const result = await performRequest("gemini-1.5-flash");
        return parseData(result);

    } catch (e) {
        // Se Flash non si trova, CERCHIAMO cosa c'è disponibile
        if (e.message === "MODEL_NOT_FOUND") {
            try {
                // Chiediamo la lista dei modelli disponibili per questa chiave
                const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                const listData = await listRes.json();

                if (listData.models) {
                    // Troviamo il primo modello Gemini disponibile
                    const validModel = listData.models.find(m => 
                        m.name.includes("gemini") && 
                        m.supportedGenerationMethods.includes("generateContent")
                    );

                    if (validModel) {
                        // TENTATIVO 2: Usiamo quello che Google ci ha suggerito
                        const result2 = await performRequest(validModel.name);
                        return parseData(result2);
                    }
                }
            } catch (scanError) {
                console.error("Scansione fallita", scanError);
            }
        }
        // Se siamo qui, è un errore diverso (es. Key non valida) o non abbiamo trovato nulla
        throw new Error(`AI Error: ${e.message}`);
    }
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
    if (t.includes("rosso")) return "bg-red-50 border-red-100 text-red-900";
    if (t.includes("bianco")) return "bg-yellow-50 border-yellow-200 text-yellow-900";
    if (t.includes("boll") || t.includes("spumante") || t.includes("champagne")) return "bg-amber-50 border-amber-200 text-amber-900";
    if (t.includes("rosato") || t.includes("cerasuolo")) return "bg-pink-50 border-pink-200 text-pink-900";
    if (t.includes("birra")) return "bg-orange-50 border-orange-200 text-orange-900";
    return "bg-white border-gray-100 text-slate-800";
};

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

const Input = ({ label, ...props }) => ( <div className="mb-3 w-full"> {label && <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide">{label}</label>} <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-800 focus:bg-white transition-colors disabled:bg-gray-100 disabled:text-gray-500" {...props} /> </div> );
const Select = ({ label, options, ...props }) => ( <div className="mb-3 w-full"> {label && <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide">{label}</label>} <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-800 bg-white" {...props}> <option value="">-- Seleziona --</option> {options.map(o => <option key={o} value={o}>{o}</option>)} </select> </div> );
const Card = ({ children, className = '', onClick }) => ( <div onClick={onClick} className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 ${className} ${onClick ? 'cursor-pointer active:bg-gray-50' : ''}`}>{children}</div> );

// --- MAIN APP COMPONENT ---
function App() {
    const [tab, setTab] = useState('home');
    const [session, setSession] = useState(null); 
    const [showSettings, setShowSettings] = useState(false);
    
    const [apiKey, setApiKey] = useState(() => { try { return localStorage.getItem('somm_apikey') || ""; } catch { return ""; } });
    const [logs, setLogs] = useState(() => { try { return JSON.parse(localStorage.getItem('somm_logs')) || []; } catch { return []; } });
    const [cellar, setCellar] = useState(() => { try { return JSON.parse(localStorage.getItem('somm_cellar')) || []; } catch { return []; } });

    useEffect(() => {
        localStorage.setItem('somm_logs', JSON.stringify(logs));
        localStorage.setItem('somm_cellar', JSON.stringify(cellar));
        localStorage.setItem('somm_apikey', apiKey);
    }, [logs, cellar, apiKey]);

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
                id: Date.now() + Math.random(), n: i.wine, p: i.prod, y: i.year, q: 1, pr: i.price, buyPlace: i.buyPlace, type: i.type
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
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ logs, cellar, version: "11.0" }));
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
                {tab === 'session' && session && <SessionManager session={session} setSession={setSession} onSave={saveSession} onCancel={() => { setSession(null); setTab('home'); }} apiKey={apiKey} />}
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

function SessionManager({ session, setSession, onSave, onCancel, apiKey }) {
    const [step, setStep] = useState(session.step);
    const [item, setItem] = useState(session.items[0] || {});
    const [tempGrape, setTempGrape] = useState("");
    const [tempPerc, setTempPerc] = useState("");
    const [tempFriend, setTempFriend] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [pairingPrefs, setPairingPrefs] = useState({ red: 0, white: 0, rose: 0, sparkling: 0, beer: 0 });
    const [pairingSuggestions, setPairingSuggestions] = useState([]);
    const fileInputFood = useRef(null);
    const fileInputWine = useRef(null);

    const handleGeoFill = async () => {
        if (!session.locCity) return alert("Scrivi prima una città!");
        setIsAiLoading(true);
        try {
            const prompt = `Dato la città "${session.locCity}", restituisci JSON: {"r": "Regione", "c": "Stato"}`;
            const data = await callGemini(apiKey, prompt);
            setSession(prev => ({ ...prev, locRegion: data.r, locCountry: data.c }));
        } catch (e) { alert(e.message); } finally { setIsAiLoading(false); }
    };

    const handleWineFill = async () => {
        if (!item.wine && !item.imgWine) return alert("Nome o Foto necessari!");
        setIsAiLoading(true);
        try {
            const prompt = `Analizza vino "${item.wine || ''}". JSON STRETTO: {"wine": "Nome", "prod": "Produttore", "year": "Anno", "type": "Rosso/Bianco/ecc", "method": "Metodo", "alcohol": 13.5, "price": 20, "grapes": [{"name": "Vitigno", "perc": 100}]}`;
            const data = await callGemini(apiKey, prompt, item.imgWine);
            setItem(prev => ({ ...prev, ...data }));
        } catch (e) { alert(e.message); } finally { setIsAiLoading(false); }
    };

    const handleFoodPairing = async () => {
        if (!item.food && !item.imgFood) return alert("Inserisci un piatto!");
        let prefs = [];
        if (pairingPrefs.red > 0) prefs.push(`${pairingPrefs.red} Rossi`);
        if (pairingPrefs.white > 0) prefs.push(`${pairingPrefs.white} Bianchi`);
        if (pairingPrefs.rose > 0) prefs.push(`${pairingPrefs.rose} Rosati`);
        if (pairingPrefs.sparkling > 0) prefs.push(`${pairingPrefs.sparkling} Bollicine`);
        if (pairingPrefs.beer > 0) prefs.push(`${pairingPrefs.beer} Birre`);
        const prefString = prefs.length > 0 ? "Vorrei: " + prefs.join(", ") : "Consigliami tu.";
        setIsAiLoading(true);
        try {
            const prompt = `Piatto: "${item.food}". ${prefString}. Dammi 3 consigli. JSON Array: [{"name": "Vino", "type": "Rosso/Bianco", "reason": "Motivo"}]`;
            const data = await callGemini(apiKey, prompt, item.imgFood);
            setPairingSuggestions(Array.isArray(data) ? data : (data.suggestions || []));
        } catch (e) { alert(e.message); } finally { setIsAiLoading(false); }
    };

    const currentGrapeTotal = (item.grapes || []).reduce((acc, g) => acc + parseInt(g.perc || 0), 0);
    const addGrape = () => {
        if (!tempGrape || !tempPerc) return;
        setItem(prev => ({ ...prev, grapes: [...(prev.grapes || []), { name: tempGrape, perc: parseInt(tempPerc) }] }));
        setTempGrape(""); setTempPerc("");
    };
    const removeGrape = (idx) => setItem(prev => ({ ...prev, grapes: prev.grapes.filter((_, i) => i !== idx) }));
    const handlePhoto = async (e, type) => { const f = e.target.files[0]; if (f) { const b64 = await resizeImage(f); setItem(prev => ({ ...prev, [type]: b64 })); } };
    const addItem = () => { 
        if(session.mode === 'Acquisto') onSave({ ...session, items: [item] });
        else { setSession(prev => ({ ...prev, items: [...prev.items, item] })); setItem({}); setStep('context'); }
    };
    
    const prefButton = (type, label) => (
        <button onClick={() => setPairingPrefs(p => ({...p, [type]: (p[type] || 0) + 1}))} className={`flex-1 p-2 rounded-lg text-xs font-bold border ${pairingPrefs[type] > 0 ? 'bg-slate-800 text-white' : 'bg-white text-gray-500'}`}>{label} {pairingPrefs[type] > 0 && <span className="ml-1 bg-white text-black px-1 rounded-full">{pairingPrefs[type]}</span>}</button>
    );

    if (step === 'context') return (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in">
            <Card>
                <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold"><Icons.MapPin className="text-red-500" size={20} /> <h3>Dettagli Evento</h3></div>
                <Input label="Data" type="date" value={session.date} onChange={e => setSession({...session, date: e.target.value})} />
                <Input label="Location" placeholder="Ristorante..." value={session.locName} onChange={e => setSession({...session, locName: e.target.value})} />
                <div className="flex gap-2 items-end mb-3"><div className="flex-1"><Input label="Città" placeholder="Es. Tokyo" value={session.locCity} onChange={e => setSession({...session, locCity: e.target.value})} /></div><button onClick={handleGeoFill} disabled={isAiLoading || !session.locCity} className="mb-3 p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm hover:bg-indigo-200 disabled:opacity-50">{isAiLoading ? <Icons.Loader2 className="animate-spin"/> : <Icons.MapPin />}</button></div>
                <div className="flex gap-2"><div className="flex-1"><Input label="Regione" value={session.locRegion || ''} disabled /></div><div className="flex-1"><Input label="Stato" value={session.locCountry || ''} disabled /></div></div>
            </Card>
            <Card>
                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold"><Icons.Users className="text-blue-500" size={20} /><h3>Compagnia</h3></div>
                <div className="flex gap-2 mb-3"><input className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Nome..." value={tempFriend} onChange={e => setTempFriend(e.target.value)} /><button onClick={() => {if(tempFriend){setSession(p=>({...p, friends:[...p.friends, tempFriend]})); setTempFriend("")}}} className="bg-blue-100 text-blue-600 p-3 rounded-xl font-bold">+</button></div>
                <div className="flex flex-wrap gap-2">{session.friends.map((f, i) => ( <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">{f} <button onClick={() => setSession(prev => ({...prev, friends: prev.friends.filter((_, ix) => ix !== i)}))} className="text-red-400 font-bold">×</button></span> ))}</div>
            </Card>
            <div className="space-y-2">{session.items.map((i, idx) => ( <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center"><div><div className="font-bold text-slate-800">{i.wine || i.food}</div><div className="text-xs text-gray-400 uppercase font-bold">{i.type}</div></div><button onClick={() => setSession(p => ({...p, items: p.items.filter((_,x)=>x!==idx)}))} className="text-red-300 hover:text-red-500"><Icons.Trash2 size={16} /></button></div> ))}</div>
            <Button onClick={() => setStep('adding')} icon={Icons.Plus}>Aggiungi Elemento</Button>
            {session.items.length > 0 && <Button onClick={() => setStep('finish')} variant="success" icon={Icons.Save} className="mt-4">Concludi</Button>}
            <Button onClick={onCancel} variant="ghost" className="text-red-400">Esci</Button>
        </div>
    );

    if (step === 'adding') return (
        <div className="space-y-4 animate-in slide-in-from-right-8 fade-in pb-20">
            <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-lg">{session.mode === 'Acquisto' ? 'Nuova Bottiglia' : 'Nuovo Inserimento'}</h3><button onClick={onCancel}><Icons.X size={20} className="text-gray-400"/></button></div>
            {session.mode !== 'Degustazione' && session.mode !== 'Acquisto' && (
                <Card className="bg-orange-50/50 border-orange-100">
                    <div className="flex gap-2 items-end mb-2"><div className="flex-1"><Input label="Piatto" placeholder="Es. Carbonara" value={item.food || ''} onChange={e => setItem({...item, food: e.target.value})} /></div><div className="mb-3"><input type="file" ref={fileInputFood} hidden accept="image/*" onChange={(e) => handlePhoto(e, 'imgFood')} /><button onClick={() => fileInputFood.current.click()} className="p-3 rounded-xl border bg-white text-gray-400"><Icons.Camera size={24}/></button></div></div>
                    {item.imgFood && <div className="h-24 w-full bg-cover bg-center rounded-lg mt-2 mb-3" style={{backgroundImage: `url(${item.imgFood})`}}></div>}
                    <div className="bg-white p-3 rounded-xl border border-orange-100">
                        <label className="text-[10px] font-bold text-orange-400 uppercase mb-2 block">Sommelier Virtuale - Cosa vorresti bere?</label>
                        <div className="flex gap-1 mb-3 overflow-x-auto pb-1">{prefButton('red', 'Rosso')}{prefButton('white', 'Bianco')}{prefButton('sparkling', 'Bolle')}{prefButton('beer', 'Birra')}</div>
                        <div className="flex gap-2"><button onClick={() => setPairingPrefs({ red: 0, white: 0, rose: 0, sparkling: 0, beer: 0 })} className="px-3 py-2 text-xs text-gray-400 font-bold underline">Reset</button><Button onClick={handleFoodPairing} variant="ai" isLoading={isAiLoading} icon={Icons.Sparkles}>Consigliami</Button></div>
                        {pairingSuggestions.length > 0 && (<div className="mt-3 space-y-2 animate-in slide-in-from-top-2">{pairingSuggestions.map((s, i) => (<div key={i} onClick={() => setItem(prev => ({...prev, wine: s.name, type: s.type}))} className="p-3 bg-orange-50 border border-orange-200 rounded-lg cursor-pointer hover:bg-orange-100"><div className="flex justify-between items-start"><span className="font-bold text-slate-800">{s.name}</span><span className="text-[10px] uppercase font-bold bg-white px-2 py-0.5 rounded text-orange-600 border border-orange-200">{s.type}</span></div><p className="text-xs text-slate-600 mt-1 leading-tight">{s.reason}</p></div>))}</div>)}
                    </div>
                </Card>
            )}
            <Card className="border-l-4 border-l-indigo-500">
                <div className="flex gap-2 items-end"><div className="flex-1"><Input label="Etichetta / Nome" value={item.wine || ''} onChange={e => setItem({...item, wine: e.target.value})} /></div><button onClick={handleWineFill} disabled={isAiLoading} className="mb-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg shadow-purple-200 disabled:opacity-50">{isAiLoading ? <Icons.Loader2 size={20} className="animate-spin"/> : <Icons.Sparkles size={20}/>}</button><div className="mb-3"><input type="file" ref={fileInputWine} hidden accept="image/*" onChange={(e) => handlePhoto(e, 'imgWine')} /><button onClick={() => fileInputWine.current.click()} className="p-3 rounded-xl border bg-gray-50 text-gray-400"><Icons.Camera size={24}/></button></div></div>
                {item.imgWine && <div className="h-40 w-full bg-contain bg-no-repeat bg-center rounded-lg mt-2 mb-4 bg-gray-100" style={{backgroundImage: `url(${item.imgWine})`}}></div>}
                <div className="flex gap-2"><Input label="Produttore" value={item.prod || ''} onChange={e => setItem({...item, prod: e.target.value})} /><div className="w-24"><Input label="Anno" type="number" value={item.year || ''} onChange={e => setItem({...item, year: e.target.value})} /></div></div>
                <div className="flex gap-2"><Input label="Tipologia" placeholder="Rosso..." value={item.type || ''} onChange={e => setItem({...item, type: e.target.value})} /><Input label="Metodo" placeholder="Classico..." value={item.method || ''} onChange={e => setItem({...item, method: e.target.value})} /></div>
                <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 mb-3"><label className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide"><span>Uvaggio</span> <span className={currentGrapeTotal === 100 ? "text-emerald-500" : "text-orange-500"}>{currentGrapeTotal}%</span></label><div className="flex flex-wrap gap-2 mb-2">{(item.grapes || []).map((g, i) => (<div key={i} className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-lg text-xs font-bold shadow-sm"><span className="text-indigo-600">{g.perc}%</span> <span>{g.name}</span> <button onClick={() => removeGrape(i)} className="text-red-400 ml-1">×</button></div>))}</div>{currentGrapeTotal < 100 && (<div className="flex gap-2 items-center"><input className="flex-1 p-2 text-sm border rounded-lg" placeholder="Vitigno" value={tempGrape} onChange={e => setTempGrape(e.target.value)} /><input className="w-16 p-2 text-sm border rounded-lg text-center" placeholder="%" type="number" value={tempPerc} onChange={e => setTempPerc(e.target.value)} /><button onClick={addGrape} className="bg-slate-800 text-white p-2 rounded-lg font-bold">+</button></div>)}</div>
                <div className="flex gap-2"><Input label="Alcol %" type="number" value={item.alcohol || ''} onChange={e => setItem({...item, alcohol: e.target.value})} /><Input label="Prezzo €" type="number" value={item.price || ''} onChange={e => setItem({...item, price: e.target.value})} /></div>
                {(session.mode === 'Acquisto' || item.buyPlace) && (<Input label="Dove l'hai preso?" placeholder="Enoteca..." value={item.buyPlace || ''} onChange={e => setItem({...item, buyPlace: e.target.value})} />)}
            </Card>
            <div className="pt-4 border-t border-gray-100 flex gap-3"><Input label="Voto Pers." type="number" value={item.voteWine || ''} onChange={e => setItem({...item, voteWine: e.target.value})} />{session.mode !== 'Degustazione' && <Input label="Voto Abb." type="number" value={item.votePair || ''} onChange={e => setItem({...item, votePair: e.target.value})} />}</div>
            <Button onClick={addItem} variant="primary">{session.mode === 'Acquisto' ? 'Salva in Cantina' : 'Salva Prodotto'}</Button>
        </div>
    );

    if (step === 'finish') return (
        <div className="space-y-6 pt-10 animate-in zoom-in-95 fade-in">
            <div className="text-center"><Icons.CheckCircle2 size={64} className="mx-auto text-emerald-500 mb-4" /><h2 className="text-2xl font-black">Riepilogo</h2></div>
            <Card><Input label="Conto Totale €" type="number" value={session.bill || ''} onChange={e => setSession({...session, bill: parseFloat(e.target.value)})} /><Input label="Voto Location" type="number" value={session.locVote || ''} onChange={e => setSession({...session, locVote: e.target.value})} /><textarea className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 mt-2" rows={3} placeholder="Note finali..." value={session.note || ''} onChange={e => setSession({...session, note: e.target.value})} /></Card>
            <Button onClick={() => onSave(session)} variant="success" className="h-16 text-lg">ARCHIVIA</Button><Button onClick={() => setStep('context')} variant="ghost">Indietro</Button>
        </div>
    );
}

function CellarView({ cellar, setCellar, apiKey, startSession }) {
    const [addMode, setAddMode] = useState(false);
    const [filter, setFilter] = useState('all');
    const [newBot, setNewBot] = useState({});
    const [loading, setLoading] = useState(false);

    const filteredCellar = cellar.filter(b => {
        if (filter === 'all') return true;
        const t = (b.type || "").toLowerCase();
        if (filter === 'rossi') return t.includes('rosso');
        if (filter === 'bianchi') return t.includes('bianco');
        if (filter === 'bolle') return t.includes('boll') || t.includes('spumante') || t.includes('champagne');
        return true;
    });

    const handleAdd = () => { setCellar([...cellar, { ...newBot, id: Date.now() }]); setAddMode(false); setNewBot({}); };
    const handleSmartFill = async () => { if(!newBot.n) return; setLoading(true); try { const prompt = `Analizza vino: "${newBot.n}". JSON: {"prod": "Produttore", "year": "Anno", "type": "Rosso/Bianco/Bollicine/Rosato"}`; const data = await callGemini(apiKey, prompt); setNewBot(prev => ({ ...prev, p: data.prod, y: data.year, type: data.type })); } catch(e) { alert("Errore AI: " + e.message); } finally { setLoading(false); } };
    const openBottle = (b) => { if(confirm("Stappi questa bottiglia?")) { if (b.q > 1) setCellar(cellar.map(item => item.id === b.id ? { ...item, q: item.q - 1 } : item)); else setCellar(cellar.filter(item => item.id !== b.id)); startSession('Degustazione', { wine: b.n, prod: b.p, year: b.y, type: b.type, price: b.pr, buyPlace: b.buyPlace }); } };
    const FilterBtn = ({ id, label }) => (<button onClick={() => setFilter(id)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${filter === id ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-500 border-gray-200'}`}>{label}</button>);

    return (
        <div className="space-y-4 pb-20">
            <div className="flex justify-between items-center"><h2 className="font-bold text-xl">La Tua Cantina</h2><button onClick={() => setAddMode(!addMode)} className="bg-slate-900 text-white p-2 rounded-full shadow-lg shadow-slate-200"><Icons.Plus size={20}/></button></div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"><FilterBtn id="all" label="Tutti" /><FilterBtn id="rossi" label="Rossi" /><FilterBtn id="bianchi" label="Bianchi" /><FilterBtn id="bolle" label="Bollicine" /></div>
            {addMode && ( <Card className="animate-in slide-in-from-top-4 border-2 border-slate-900"><div className="flex gap-2 items-end"><div className="flex-1"><Input label="Vino" value={newBot.n || ''} onChange={e => setNewBot({...newBot, n: e.target.value})} /></div><button onClick={handleSmartFill} disabled={loading} className="mb-3 p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Icons.Sparkles size={20}/></button></div><div className="flex gap-2"><Input label="Produttore" value={newBot.p || ''} onChange={e => setNewBot({...newBot, p: e.target.value})} /><div className="w-24"><Input label="Anno" type="number" value={newBot.y || ''} onChange={e => setNewBot({...newBot, y: e.target.value})} /></div></div><div className="flex gap-2"><div className="flex-1"><Input label="Tipologia" placeholder="Rosso..." value={newBot.type || ''} onChange={e => setNewBot({...newBot, type: e.target.value})} /></div><div className="w-24"><Input label="Qtà" type="number" value={newBot.q || 1} onChange={e => setNewBot({...newBot, q: parseInt(e.target.value)})} /></div></div><Input label="Dove l'hai preso?" value={newBot.buyPlace || ''} onChange={e => setNewBot({...newBot, buyPlace: e.target.value})} /><Button onClick={handleAdd} variant="success">Aggiungi alla Collezione</Button></Card> )}
            <div className="space-y-3">{filteredCellar.length === 0 ? <p className="text-center text-gray-400 text-sm py-10">Nessuna bottiglia trovata.</p> : filteredCellar.map(b => ( <div key={b.id} className={`p-4 rounded-xl border shadow-sm flex justify-between items-center transition-colors ${getItemStyle(b.type)}`}><div><div className="font-bold text-lg leading-tight">{b.n}</div><div className="text-xs opacity-80 font-medium mt-1">{b.p} • {b.y}</div>{b.buyPlace && <div className="text-[10px] opacity-60 mt-1 flex items-center gap-1"><Icons.Store size={10}/> {b.buyPlace}</div>}</div><div className="flex items-center gap-3 pl-2"><span className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-black shadow-sm">x{b.q}</span><button onClick={() => openBottle(b)} className="bg-white text-slate-900 p-2 rounded-full shadow-sm active:scale-95"><Icons.Wine size={18}/></button></div></div> ))}</div>
        </div>
    );
}

function HistoryView({ logs, onEdit, onDelete }) {
    const [q, setQ] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const filtered = logs.filter(l => JSON.stringify(l).toLowerCase().includes(q.toLowerCase()));
    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);
    
    return (
        <div className="space-y-4 pb-20">
            <div className="sticky top-0 bg-slate-50 pb-2 z-10 pt-2"><div className="relative shadow-sm rounded-xl"><Icons.Search className="absolute left-3 top-3.5 text-gray-400" size={16} /><input className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white" placeholder="Cerca..." value={q} onChange={e => setQ(e.target.value)} /></div></div>
            {filtered.map(l => { const isExpanded = expandedId === l.id; return ( <div key={l.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all"><div onClick={() => toggleExpand(l.id)} className="cursor-pointer"><div className="flex justify-between mb-2"><div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><Icons.Calendar size={10} /> {l.date.split('-').reverse().join('/')} • {l.mode}</div><div className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">€{l.bill}</div></div><div className="flex justify-between items-center"><div><div className="font-bold text-xl text-slate-800 leading-none mb-1">{l.locName || 'Evento'}</div><div className="text-xs text-gray-500 flex items-center gap-1"><Icons.MapPin size={10}/> {l.locCity || 'Nessun luogo'}</div></div>{isExpanded ? <Icons.ChevronUp size={24} className="text-slate-300"/> : <Icons.ChevronDown size={24} className="text-slate-300"/>}</div></div>{isExpanded && (<div className="mt-6 pt-4 border-t border-dashed border-gray-200 animate-in slide-in-from-top-2 fade-in"><div className="space-y-3 mb-6">{l.items.map((i, idx) => ( <div key={idx} className={`flex gap-3 p-3 rounded-2xl border ${getItemStyle(i.type)}`}>{i.imgWine ? <div className="w-14 h-20 bg-cover bg-center rounded-xl flex-shrink-0 shadow-sm" style={{backgroundImage: `url(${i.imgWine})`}}></div> : <div className="w-14 h-20 bg-white/50 rounded-xl flex items-center justify-center flex-shrink-0"><Icons.Wine size={20} className="opacity-30"/></div>}<div className="flex-1 min-w-0"><div className="font-black text-base truncate">{i.wine || i.food}</div><div className="text-xs opacity-80 truncate">{i.prod} {i.year}</div><div className="flex flex-wrap gap-1 mt-2">{i.voteWine && <span className="text-[9px] font-bold bg-white/80 px-1.5 py-0.5 rounded shadow-sm">⭐ {i.voteWine}</span>}</div></div></div> ))}</div><div className="grid grid-cols-2 gap-3 mb-4"><div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase mb-1"><Icons.Star size={10}/> Location</div><div className="font-black text-xl text-slate-800">{l.locVote || '-'}</div></div><div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase mb-1"><Icons.Users size={10}/> Amici</div><div className="text-xs font-medium text-slate-700 leading-tight line-clamp-2">{l.friends && l.friends.length > 0 ? l.friends.join(", ") : "-"}</div></div></div>{l.note && (<div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 mb-4 text-sm text-slate-700 italic relative"><Icons.Quote size={16} className="text-yellow-200 absolute top-2 right-2"/>"{l.note}"</div>)}<div className="flex gap-2"><Button onClick={() => onEdit(l)} variant="ghost" className="h-10 text-xs text-indigo-500 bg-indigo-50 hover:bg-indigo-100" icon={Icons.Pencil}>Modifica</Button><Button onClick={() => onDelete(l.id)} variant="ghost" className="h-10 text-xs text-red-500 bg-red-50 hover:bg-red-100" icon={Icons.Trash2}>Elimina</Button></div></div>)}</div> ); })}</div>
    );
}

function StatsView({ logs, cellar }) {
    const stats = useMemo(() => {
        let totalSpent = 0; let totalBottles = 0; let totalValueCellar = 0; let scoreSum = 0; let scoreCount = 0;
        const typeCounts = { Rosso: 0, Bianco: 0, Bollicine: 0, Rosato: 0, Altro: 0 };
        const grapeCounts = {}; const monthlySpend = {};
        logs.forEach(l => {
            totalSpent += (l.bill || 0);
            const monthKey = l.date.substring(0, 7); monthlySpend[monthKey] = (monthlySpend[monthKey] || 0) + (l.bill || 0);
            l.items.forEach(i => {
                totalBottles++;
                const t = (i.type || "Altro").toLowerCase();
                if (t.includes('rosso')) typeCounts.Rosso++; else if (t.includes('bianco')) typeCounts.Bianco++; else if (t.includes('boll') || t.includes('spumante')) typeCounts.Bollicine++; else if (t.includes('rosato')) typeCounts.Rosato++; else typeCounts.Altro++;
                if (i.grapes) i.grapes.forEach(g => grapeCounts[g.name] = (grapeCounts[g.name] || 0) + 1);
                if (i.voteWine) { scoreSum += parseFloat(i.voteWine); scoreCount++; }
            });
        });
        cellar.forEach(b => totalValueCellar += (b.pr || 0) * (b.q || 1));
        const totalTypes = Object.values(typeCounts).reduce((a, b) => a + b, 0) || 1;
        const typeSegments = [{ l: 'Rossi', v: typeCounts.Rosso, c: '#ef4444' }, { l: 'Bianchi', v: typeCounts.Bianco, c: '#facc15' }, { l: 'Bolle', v: typeCounts.Bollicine, c: '#fbbf24' }, { l: 'Rosati', v: typeCounts.Rosato, c: '#f472b6' }].map(s => ({...s, p: (s.v / totalTypes) * 100})).filter(s => s.v > 0);
        const barData = Object.keys(monthlySpend).sort().slice(-6).map(m => ({ l: m.split('-')[1], v: monthlySpend[m] }));
        const maxSpend = Math.max(...barData.map(d => d.v), 100);
        return { totalSpent, totalValueCellar, avgPrice: totalBottles > 0 ? (totalSpent / totalBottles).toFixed(1) : 0, avgScore: scoreCount > 0 ? (scoreSum / scoreCount).toFixed(1) : "-", typeSegments, barData, maxSpend };
    }, [logs, cellar]);

    const getConicGradient = () => { let angle = 0; return `conic-gradient(${stats.typeSegments.map(s => { const start = angle; angle += (s.p * 3.6); return `${s.c} ${start}deg ${angle}deg`; }).join(', ')})`; };

    return (
        <div className="space-y-6 pb-20 animate-in slide-in-from-bottom-4 fade-in">
            <h2 className="text-2xl font-black text-slate-900 px-1">Dashboard</h2>
            <div className="grid grid-cols-2 gap-3"><div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase"><Icons.Archive size={14} className="text-indigo-500"/> Valore Cantina</div><div className="text-2xl font-black text-slate-800">€{stats.totalValueCellar.toLocaleString()}</div></div><div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase"><Icons.Wine size={14} className="text-emerald-500"/> Investito Tot.</div><div className="text-2xl font-black text-slate-800">€{stats.totalSpent.toLocaleString()}</div></div><div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase"><Icons.Activity size={14} className="text-orange-500"/> Prezzo Medio</div><div className="text-2xl font-black text-slate-800">€{stats.avgPrice}</div></div><div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase"><Icons.Star size={14} className="text-yellow-500"/> Voto Medio</div><div className="text-2xl font-black text-slate-800">{stats.avgScore}</div></div></div>
            {stats.typeSegments.length > 0 && (<Card><h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Icons.PieChart size={20} className="text-slate-400"/> Cosa Bevi?</h3><div className="flex items-center gap-6"><div className="relative w-32 h-32 rounded-full shadow-inner" style={{ background: getConicGradient() }}><div className="absolute inset-0 m-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm"><Icons.Wine className="text-slate-300 opacity-50" size={24}/></div></div><div className="flex-1 space-y-2">{stats.typeSegments.map((s, i) => (<div key={i} className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{backgroundColor: s.c}}></span><span className="font-medium text-slate-700">{s.l}</span></div><span className="font-bold text-slate-900">{Math.round(s.p)}%</span></div>))}</div></div></Card>)}
            {stats.barData.length > 0 && (<Card><h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Icons.BarChart3 size={20} className="text-slate-400"/> Andamento Spesa</h3><div className="flex items-end gap-2 h-40 pt-2 pb-6 px-2">{stats.barData.map((d, i) => (<div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 h-full group"><div className="w-full bg-slate-800 rounded-t-md relative" style={{ height: `${(d.v / stats.maxSpend) * 100}%` }}><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold">€{d.v}</div></div><span className="text-[10px] font-bold text-gray-400 uppercase">{d.l}</span></div>))}</div></Card>)}
        </div>
    );
}

export default App;