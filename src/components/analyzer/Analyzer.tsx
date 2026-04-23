import { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Loader2, Camera, Upload, X, MessageSquare, AlertCircle } from "lucide-react";
import { analyzeWithArnaqueDetect } from "../../services/geminiService";
import { ScamAnalysis } from "../../types";

interface AnalyzerProps {
  onResult: (result: ScamAnalysis) => void;
  onStart: () => void;
}

export function Analyzer({ onResult, onStart }: AnalyzerProps) {
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    onStart();
    setIsAnalyzing(true);

    try {
      const input: any = {};
      if (activeTab === 'text') input.text = inputText;
      if (activeTab === 'image' && selectedImage) {
        input.imageBase64 = selectedImage.split(',')[1];
        input.mimeType = mimeType;
      }

      const result = await analyzeWithArnaqueDetect(input);
      onResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto" id="demo">
      <div className="glass-card rounded-[40px] p-2 overflow-hidden shadow-2xl">
        {/* Tabs */}
        <div className="flex border-b border-brand/5 bg-alabaster/30">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-3 py-6 text-sm font-semibold transition-all ${activeTab === 'text' ? 'text-brand border-b-2 border-brand' : 'text-muted hover:text-brand'}`}
          >
            <MessageSquare className="w-5 h-5" />
            ANALYSE TEXTUELLE
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 flex items-center justify-center gap-3 py-6 text-sm font-semibold transition-all ${activeTab === 'image' ? 'text-brand border-b-2 border-brand' : 'text-muted hover:text-brand'}`}
          >
            <Camera className="w-5 h-5" />
            ANALYSE VISUELLE
          </button>
        </div>

        <div className="p-10 min-h-[300px] flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="relative mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 border-t-2 border-brand rounded-full"
                  />
                  <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-brand" />
                </div>
                <h3 className="text-2xl font-display font-bold text-brand mb-2">Analyse sécurisée en cours...</h3>
                <p className="text-muted italic">Votre protection est notre priorité absolue.</p>
                
                {/* Decorative scanning line */}
                <motion.div 
                  className="absolute left-0 right-0 h-1 bg-brand/5 shadow-[0_0_20px_theme('colors.brand')]"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {activeTab === 'text' ? (
                  <textarea
                    className="w-full bg-transparent border-none focus:ring-0 text-3xl md:text-4xl placeholder-slate-300 text-ink min-h-[200px] leading-tight font-display font-medium text-center"
                    placeholder="Collez le message suspect ici..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f) processFile(f); }} accept="image/*" />
                    {!selectedImage ? (
                      <div 
                        className="w-full max-w-lg p-16 border-2 border-dashed border-brand/10 rounded-[32px] flex flex-col items-center cursor-pointer hover:bg-brand/5 hover:border-brand/30 transition-all group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-16 h-16 rounded-full bg-brand/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-brand" />
                        </div>
                        <p className="text-xl font-bold text-brand mb-2">Importer une capture d'écran</p>
                        <p className="text-muted text-sm">PNG, JPG jusqu'à 10MB</p>
                      </div>
                    ) : (
                      <div className="relative group">
                        <img src={selectedImage} alt="Capture" className="max-h-[300px] rounded-[24px] shadow-2xl border border-white" />
                        <button 
                          onClick={() => setSelectedImage(null)}
                          className="absolute -top-4 -right-4 w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center shadow-xl hover:bg-brand/90 transition-colors"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col items-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={activeTab === 'text' ? !inputText.trim() : !selectedImage}
                    className="premium-button disabled:opacity-30 disabled:scale-100 flex items-center gap-4 text-lg"
                  >
                    <Shield className="w-6 h-6" />
                    ACTIVER L'ANALYSE
                  </button>
                  <div className="mt-8 flex items-center gap-6 text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">
                    <span>Fintech Security</span>
                    <span className="w-1 h-1 rounded-full bg-muted" />
                    <span>AI Cloud Node-X</span>
                    <span className="w-1 h-1 rounded-full bg-muted" />
                    <span>Real-time Shield</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
