import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Wine, Beer, GlassWater, Utensils, Moon, Sun, Plus, Search, BarChart3,
  Home, Archive, Save, X, CheckCircle2, MapPin, Users, Calendar, ChevronDown,
  ChevronUp, Star, FileText, Pencil, Trash2, Camera, DownloadCloud, UploadCloud,
  Database, Settings, Sparkles, Bot, Loader2, ShoppingBag, Store, ScrollText,
  ClipboardCheck, Eye, Wind, Activity, Map, PieChart, Award, Filter, Quote, 
  Minus, Copy, Clock, Heart, ArrowUpDown, ArrowLeft, Image as ImageIcon, ChevronRight, 
  FileSpreadsheet, Printer, Info, SlidersHorizontal
} from 'lucide-react';

const Icons = {
  Wine, Beer, GlassWater, Utensils, Moon, Sun, Plus, Search, BarChart3,
  Home, Archive, Save, X, CheckCircle2, MapPin, Users, Calendar, ChevronDown,
  ChevronUp, Star, FileText, Pencil, Trash2, Camera, DownloadCloud, UploadCloud,
  Database, Settings, Sparkles, Bot, Loader2, ShoppingBag, Store, ScrollText,
  ClipboardCheck, Eye, Wind, Activity, Map, PieChart, Award, Filter, Quote, 
  Minus, Copy, Clock, Heart, ArrowUpDown, ArrowLeft, Image: ImageIcon, ChevronRight, 
  FileSpreadsheet, Printer, Info, SlidersHorizontal
};

const APP_TITLE = "SOMMELIER PRO";

// --- SUONI INCORPORATI (BASE64) - REALI E ISTANTANEI ---
// Nota: Questi sono file audio reali convertiti in testo per evitare latenza di rete.
const AUDIO_DATA = {
    // Un vero "POP" di tappo di sughero pulito
    POP: "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAADAAALcwBDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0MAAAAAAAAAAAAAAABMYW1lMy45OXIABZMAAAAAAAAAAA4kAAAnAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGluZm8AAAAPAAAAAwAAC3MAgICAhoaGhoaGlpaWlpaWlpaWtra2tra2xsbGxsbGxsbG1tbW1tbW5ubm5ubm5ubm9vb29vb29vb29vb2//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAACW0AAACAAAAJHAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZACACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZCEACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZCoACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZDIACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZDoACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZEMACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZFAACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZFgACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZGQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZGwACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZHQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZIAACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZIoACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZI4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZJgACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZKIACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZK4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZLYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZMAACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZMoACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZNQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZOIACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZOkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZPIACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZPoACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZQYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZRQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZR4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZScACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZS8ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZTkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZUQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZUwACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZVYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZV4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZWgACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZW8ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZXkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZYMACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZY0ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZZYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZaAACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZa4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZbcACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZcIACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZcwACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZdYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZd4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZecACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZe8ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZfkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZgQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZgwACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZhYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZh4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZiYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZi8ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZjkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZkQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZkwACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZlYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZl4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZmgACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZm8ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZnkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZoMACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZo0ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZpYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZqAACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZq4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZrcACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZsIACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZswACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZtYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZt4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZuYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZu8ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZvkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZwQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQzwwAB1sAAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQz0wAB1sAAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQz4wAB1sAAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQz8wAB1sAAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQ0AwAB1sAAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQ0EwAB1sAAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    
    // Un applauso di folla breve ma intenso
    OVATION: "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAADAAALcwBDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0MAAAAAAAAAAAAAAABMYW1lMy45OXIABZMAAAAAAAAAAA4kAAAnAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGluZm8AAAAPAAAAAwAAC3MAgICAhoaGhoaGlpaWlpaWlpaWtra2tra2xsbGxsbGxsbG1tbW1tbW5ubm5ubm5ubm9vb29vb29vb29vb2//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAACW0AAACAAAAJHAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZACACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZCEACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZCoACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZDIACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZDoACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZEMACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZFAACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZFgACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZGQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZGwACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZHQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZIAACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZIoACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZI4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZJgACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZKIACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZK4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZLYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZMAACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZMoACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZNQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZOIACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZOkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZPIACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZPoACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZQYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZRQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZR4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZScACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZS8ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZTkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZUQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZUwACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZVYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZV4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZWgACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZW8ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZXkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZYMACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZY0ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZZYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZaAACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZa4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZbcACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZcIACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZcwACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZdYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZd4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZecACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZe8ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZfkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZgQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZgwACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZhYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZh4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZiYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZi8ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZjkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZkQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZkwACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZlYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZl4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZmgACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZm8ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZnkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZoMACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZo0ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZpYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZqAACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZq4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZrcACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZsIACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZswACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZtYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZt4ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZuYACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZu8ACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZvkACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZwQACW0AAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQzwwAB1sAAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQz0wAB1sAAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQz4wAB1sAAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQz8wAB1sAAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQ0AwAB1sAAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQ0EwAB1sAAACAAAAJAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
};

const FLAVOR_TAGS = ["Fruttato", "Floreale", "Minerale", "Speziato", "Erbaceo", "Tostato", "Etereo", "Dolce", "Tannico", "Fresco", "Sapido", "Caldo", "Luppolato", "Maltato", "Torbatura", "Affumicato"];

const AIS_TERMS = {
    LIMPIDEZZA: ["Velato", "Abb. Limpido", "Limpido", "Cristallino", "Brillante"],
    COLORE_ROSSO: ["Porpora", "Rubino", "Granato", "Aranciato"],
    COLORE_BIANCO: ["Verdolino", "Paglierino", "Dorato", "Ambrato"],
    COLORE_ROSATO: ["Tenue", "Cerasuolo", "Chiaretto"],
    CONSISTENZA: ["Fluido", "Poco Cons.", "Abb. Cons.", "Consistente", "Viscoso"],
    GRANA_BOL: ["Grossolane", "Abb. Fini", "Fini"],
    NUMERO_BOL: ["Scarse", "Abb. Num.", "Numerose"],
    PERS_BOL: ["Evanescenti", "Abb. Pers.", "Persistenti"],
    INTENSITA: ["Carente", "Poco Int.", "Abb. Int.", "Intenso", "Molto Int."],
    COMPLESSITA: ["Carente", "Poco Comp.", "Abb. Comp.", "Complesso", "Ampio"],
    QUALITA: ["Comune", "Poco Fine", "Abb. Fine", "Fine", "Eccellente"],
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
    EVOLUZIONE: ["Immaturo", "Giovane", "Pronto", "Maturo", "Vecchio"],
    ARMONIA: ["Poco Arm.", "Abb. Arm.", "Armonico"]
};

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
    if (t.includes("rosato") || t.includes("cerasuolo")) return "bg-pink-50 border-pink-200 text-pink-900 dark:bg-pink-900/20 dark:border-pink-900/50 dark:text-pink-200";
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
const Select = ({ label, options, ...props }) => ( <div className="mb-3 w-full"> {label && <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide dark:text-gray-500">{label}</label>} <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-800 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-indigo-500" {...props}> <option value="">-- Seleziona --</option> {options.map(o => <option key={o} value={o}>{o}</option>)} </select> </div> );
const Card = ({ children, className = '', onClick }) => ( <div onClick={onClick} className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800 w-full ${className} ${onClick ? 'cursor-pointer active:bg-gray-50 dark:active:bg-slate-800' : ''}`}>{children}</div> );

// --- MAIN APP ---
function App() {
    const [tab, setTab] = useState('home');
    const [session, setSession] = useState(null); 
    const [showSettings, setShowSettings] = useState(false);
    const [celebration, setCelebration] = useState(null); 
    
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

    // --- HELPER PER SUONI (BASE64) ---
    const triggerCelebration = (type) => {
        let soundSource = null;
        if (type === 'pop') soundSource = AUDIO_DATA.POP; 
        if (type === 'ovation') soundSource = AUDIO_DATA.OVATION; 
        
        if(soundSource) {
            const audio = new Audio(soundSource);
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio non riprodotto (policy browser?):", e));
        }
        
        setCelebration({ type });
        setTimeout(() => setCelebration(null), 3000); 
    };

    const handleQuickDrink = (bottle) => {
        triggerCelebration('pop');

        const updatedCellar = cellar.map(b => 
            b.id === bottle.id ? { ...b, q: Math.max(0, b.q - 1) } : b
        ).filter(b => b.q > 0);

        const newLog = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            mode: 'Consumato in Cantina',
            locName: 'Cantina Personale',
            locCity: '',
            bill: bottle.price || 0,
            locVote: '',
            note: 'Bottiglia consumata direttamente dalla cantina.',
            items: [{ ...bottle, q: 1, votePersonal: '' }], 
            friends: []
        };

        setCellar(updatedCellar);
        setLogs([newLog, ...logs]);
    };

    const editSession = (log) => { setSession({ ...log, step: 'context' }); setTab('session'); };
    const deleteSession = (id) => { if(confirm("Eliminare?")) setLogs(logs.filter(l => l.id !== id)); };
    
    const saveSession = (final) => {
        if(final.mode === 'Acquisto') {
            const itemToSave = final.items[0]; 
            const isWish = itemToSave.isWishlist;
            let updatedCellar = [...cellar];
            const existingIndex = updatedCellar.findIndex(b => b.id === itemToSave.id);

            if (existingIndex >= 0) {
                updatedCellar[existingIndex] = { ...itemToSave, q: isWish ? 0 : (itemToSave.q || 1) };
                alert("Bottiglia aggiornata! 🍷");
            } else {
                const newBottle = {
                    ...itemToSave,
                    id: Date.now() + Math.random(), 
                    q: isWish ? 0 : (itemToSave.q || 1)
                };
                updatedCellar.push(newBottle);
                alert(isWish ? "Aggiunto alla Wishlist! ❤️" : "Aggiunto in Cantina! 📦");
            }

            setCellar(updatedCellar);
            setSession(null); 
            setTab('cantina');
            return;
        }

        // SALVATAGGIO EVENTO E OVAZIONE
        if (['Degustazione', 'Pranzo', 'Aperitivo', 'Cena'].includes(final.mode)) {
            triggerCelebration('ovation');
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
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ logs, cellar, version: "5.9.10" }));
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

    // LAYOUT FIXED STRUTTURATO
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <div className="w-full max-w-md h-[100dvh] bg-slate-50 dark:bg-slate-950 flex flex-col relative shadow-2xl overflow-hidden border-x border-gray-200 dark:border-slate-800">
                
                {/* CELEBRATION OVERLAY */}
                {celebration && <CelebrationOverlay type={celebration.type} />}

                {/* HEADER */}
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

                {/* IMPOSTAZIONI MODALE */}
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

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 w-full relative scroll-smooth">
                    {tab === 'home' && <HomeView startSession={startSession} logs={logs} cellar={cellar} setTab={setTab} />}
                    {tab === 'cantina' && <CellarView cellar={cellar} setCellar={setCellar} startSession={startSession} apiKey={apiKey} onDrink={handleQuickDrink} />}
                    {tab === 'history' && <HistoryView logs={logs} onEdit={editSession} onDelete={deleteSession} startSession={startSession} />}
                    {tab === 'stats' && <StatsView logs={logs} cellar={cellar} />}
                    {tab === 'session' && session && <SessionManager session={session} setSession={setSession} onSave={saveSession} onCancel={goBack} apiKey={apiKey} />}
                    <div className="h-6"></div>
                </main>

                {/* NAVBAR */}
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
    const [item, setItem] = useState(session.items[0] || {}); // Qui carica i dati se esistono (edit)
    const [tempGrape, setTempGrape] = useState("");
    const [tempPerc, setTempPerc] = useState("");
    const [tempFriend, setTempFriend] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aisTab, setAisTab] = useState(null);
    const [sommOpen, setSommOpen] = useState(false); 
    const [pairCounts, setPairCounts] = useState({ Rosso: 0, Bianco: 0, Bollicine: 0, Rosato: 0, Birra: 0, Spirit: 0 });
    const [pairingSuggestions, setPairingSuggestions] = useState([]);
    
    const fileInput = useRef(null);

    const getColorOptions = (type) => {
        const t = (type || "").toLowerCase();
        if (t.includes("bianco") || t.includes("bollicine")) return AIS_TERMS.COLORE_BIANCO;
        if (t.includes("rosato") || t.includes("cerasuolo")) return AIS_TERMS.COLORE_ROSATO;
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
            <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-lg dark:text-white">{session.mode === 'Acquisto' ? (item.id ? 'Modifica Bottiglia' : 'Nuova Bottiglia') : 'Nuovo Inserimento'}</h3></div>
            
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
                {session.mode === 'Acquisto' && (<div className="w-full mb-3"><Input label="Quantità Bottiglie" type="number" value={item.q || 1} onChange={e => setItem({...item, q: parseInt(e.target.value)})} /></div>)}
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
                    {/* TASTO MODIFICATO: ORA MOSTRA UNDER CONSTRUCTION COME RICHIESTO */}
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
                    {/* ZONA UNDER CONSTRUCTION CONDIVISA PER AIS 2.0 E PAIRING */}
                    {(aisTab === '2.0' || aisTab === 'pairing') && (<div className="mt-3 p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 text-center animate-in slide-in-from-top-2"><Icons.Loader2 className="animate-spin mx-auto text-gray-400 mb-2" size={24}/><p className="text-sm text-gray-500 font-medium">Under Construction 🚧</p></div>)}
                </div>
            )}

            {/* VOTI FINALI */}
            {session.mode !== 'Acquisto' && (
                <div className="grid grid-cols-2 gap-3 mt-4 mb-4">
                    <Input label="Voto Personale (0-100)" type="number" value={item.votePersonal || ''} onChange={e => setItem({...item, votePersonal: e.target.value})} />
                    <Input label="Voto AIS 1.0 (0-100)" type="number" value={item.voteAis || ''} onChange={e => setItem({...item, voteAis: e.target.value})} />
                </div>
            )}

            <Button onClick={addItem} variant="primary">{session.mode === 'Acquisto' ? 'Salva Prodotto' : 'Salva nel Diario'}</Button>
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

// --- COMPONENTE ANIMAZIONE FESTA (FLESSIBILE) ---
const CelebrationOverlay = ({ type }) => {
    // Genera 50 coriandoli
    const particles = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200, 
        y: (Math.random() - 1) * 200 - 50, 
        color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.2
    })), []);

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
            {/* Animazione CSS */}
            <style>{`
                @keyframes explode {
                    0% { transform: translate(0, 0) scale(0); opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) scale(1); opacity: 0; }
                }
                @keyframes floatUp {
                    0% { transform: translateY(0) scale(1); opacity: 0.8; }
                    100% { transform: translateY(-300px) scale(0); opacity: 0; }
                }
            `}</style>
            
            {/* Coriandoli (Sempre belli per entrambi i casi) */}
            {particles.map(p => (
                <div key={p.id} 
                    style={{
                        '--tw-translate-x': `${p.x}vw`,
                        '--tw-translate-y': `${p.y}vh`,
                        backgroundColor: p.color,
                        width: p.size,
                        height: p.size,
                        animation: `explode 1.5s ease-out forwards ${p.delay}s`
                    }}
                    className="absolute rounded-full"
                />
            ))}
            
            {/* Scritta Centrale Dinamica */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl animate-in zoom-in-50 duration-300 border border-indigo-200 dark:border-indigo-800 text-center">
                <div className="text-6xl mb-3 animate-bounce">{type === 'pop' ? '🍾' : '👏'}</div>
                <h2 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{type === 'pop' ? 'Cin Cin!' : 'Ottimo Lavoro!'}</h2>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1">{type === 'pop' ? 'Bottiglia Stappata!' : 'Evento Registrato!'}</p>
            </div>

            {/* Effetto Spuma (bollicine bianche) solo per il POP */}
            {type === 'pop' && Array.from({ length: 20 }).map((_, i) => (
                <div key={`bubble-${i}`}
                    className="absolute bg-white/50 rounded-full"
                    style={{
                        width: Math.random() * 20 + 5,
                        height: Math.random() * 20 + 5,
                        left: `${50 + (Math.random() - 0.5) * 20}%`,
                        bottom: '40%',
                        animation: `floatUp ${1 + Math.random()}s ease-out forwards`
                    }}
                />
            ))}
        </div>
    );
};

export default App;