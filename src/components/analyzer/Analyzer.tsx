import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Camera, Upload, X, MessageSquare, Mic, Mail, Square, Play, Trash2, Zap } from "lucide-react";
import { analyzeWithArnaqueDetect } from "../../services/geminiService";
import { ScamAnalysis } from "../../types";

interface AnalyzerProps {
  onResult: (result: ScamAnalysis) => void;
  onStart: () => void;
}

export function Analyzer({ onResult, onStart }: AnalyzerProps) {
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'voice' | 'email'>('text');
  
  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingDuration(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (file.type.startsWith('image/')) {
        setSelectedImage(result);
        setMimeType(file.type);
      } else if (file.type.startsWith('audio/')) {
        setSelectedAudio(result);
        setMimeType(file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedAudio(e.target?.result as string);
          setMimeType('audio/webm');
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Accès au microphone refusé ou non supporté.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAnalyze = async () => {
    onStart();
    setIsAnalyzing(true);

    try {
      const input: any = {};
      if (activeTab === 'text' || activeTab === 'email') input.text = inputText;
      if (activeTab === 'image' && selectedImage) {
        input.imageBase64 = selectedImage.split(',')[1];
        input.mimeType = mimeType;
      }
      if (activeTab === 'voice' && selectedAudio) {
        input.audioBase64 = selectedAudio.split(',')[1];
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto" id="demo">
      <div className="glass-card rounded-[40px] p-2 overflow-hidden shadow-2xl">
        {/* Tabs - Horizontal Scroll on Mobile */}
        <div className="flex border-b border-brand/5 bg-alabaster/30 overflow-x-auto no-scrollbar">
          <div className="flex min-w-full">
            {[
              { id: 'text', icon: MessageSquare, label: 'TEXTE' },
              { id: 'image', icon: Camera, label: 'IMAGE' },
              { id: 'voice', icon: Mic, label: 'VOCAL' },
              { id: 'email', icon: Mail, label: 'EMAIL' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 md:py-6 px-4 text-[10px] md:text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-brand border-b-2 border-brand bg-white/50' : 'text-muted hover:text-brand'}`}
              >
                <tab.icon className="w-4 h-4 md:w-5 md:h-5 " />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-10 min-h-[250px] md:min-h-[300px] flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 md:py-20 text-center"
              >
                <div className="relative mb-6 md:mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 md:w-20 md:h-20 border-t-2 border-brand rounded-full"
                  />
                  <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 text-brand" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-brand mb-2">Analyse sécurisée...</h3>
                <p className="text-sm md:text-base text-muted italic">Votre protection est notre priorité.</p>
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
                className="space-y-6 md:space-y-8"
              >
                {(activeTab === 'text' || activeTab === 'email') && (
                  <textarea
                    className="w-full bg-transparent border-none focus:ring-0 text-xl sm:text-2xl md:text-3xl placeholder-slate-300 text-ink min-h-[150px] md:min-h-[200px] leading-tight font-display font-medium text-center"
                    placeholder={activeTab === 'text' ? "Collez le message suspect ici..." : "Copiez le contenu de l'email ici..."}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                )}

                {activeTab === 'image' && (
                  <div className="flex flex-col items-center justify-center py-6 md:py-10">
                    <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f) processFile(f); }} accept="image/*" />
                    {!selectedImage ? (
                      <div 
                        className="w-full max-w-lg p-8 md:p-16 border-2 border-dashed border-brand/10 rounded-[24px] md:rounded-[32px] flex flex-col items-center cursor-pointer hover:bg-brand/5 hover:border-brand/30 transition-all group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-12 h-12 text-brand mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-lg md:text-xl font-bold text-brand mb-2 text-center">Importer une capture d'écran</p>
                        <p className="text-muted text-xs md:text-sm">PNG, JPG jusqu'à 10MB</p>
                      </div>
                    ) : (
                      <div className="relative group">
                        <img src={selectedImage} alt="Capture" className="max-h-[200px] md:max-h-[300px] rounded-[16px] md:rounded-[24px] shadow-2xl border border-white" />
                        <button onClick={() => setSelectedImage(null)} className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center shadow-xl">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'voice' && (
                  <div className="flex flex-col items-center justify-center py-10 space-y-8">
                    {!selectedAudio ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
                        {/* Recording Option */}
                        <div className="flex flex-col items-center p-6 bg-white/40 rounded-3xl border border-brand/5">
                          <div className="relative mb-6">
                            {isRecording && (
                              <motion.div 
                                animate={{ scale: [1, 1.2, 1] }} 
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
                              />
                            )}
                            <button
                              onClick={isRecording ? stopRecording : startRecording}
                              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 scale-110' : 'bg-brand shadow-lg hover:scale-105'}`}
                            >
                              {isRecording ? <Square className="text-white w-7 h-7" /> : <Mic className="text-white w-9 h-9" />}
                            </button>
                          </div>
                          <p className="font-bold text-ink text-center mb-1">
                            {isRecording ? "Enregistrement..." : "Enregistrer un vocal"}
                          </p>
                          <p className="text-brand font-mono text-sm font-bold">{formatDuration(recordingDuration)}</p>
                        </div>

                        {/* Upload Option */}
                        <div 
                          className="flex flex-col items-center p-6 bg-white/40 rounded-3xl border border-brand/5 border-dashed border-2 cursor-pointer hover:bg-brand/5 transition-all group"
                          onClick={() => audioInputRef.current?.click()}
                        >
                          <input 
                            type="file" 
                            className="hidden" 
                            ref={audioInputRef} 
                            onChange={(e) => { const f = e.target.files?.[0]; if(f) processFile(f); }} 
                            accept="audio/mp3,audio/wav,audio/mpeg,audio/x-wav" 
                          />
                          <div className="w-20 h-20 rounded-full bg-brand/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Upload className="w-10 h-10 text-brand" />
                          </div>
                          <p className="font-bold text-brand text-center mb-1">Importer un fichier</p>
                          <p className="text-muted text-[10px] uppercase font-black opacity-40">MP3, WAV (Max 20MB)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-w-md bg-alabaster p-6 rounded-3xl border border-brand/5 flex items-center gap-6">
                        <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center shrink-0">
                          <Mic className="text-brand w-6 h-6" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-bold text-ink truncate">Audio prêt pour analyse</p>
                          <p className="text-[10px] text-muted uppercase tracking-widest font-bold">Sécurisé & Chiffré</p>
                        </div>
                        <button onClick={() => setSelectedAudio(null)} className="text-muted hover:text-red-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col items-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={
                      activeTab === 'text' || activeTab === 'email' ? !inputText.trim() :
                      activeTab === 'image' ? !selectedImage :
                      !selectedAudio
                    }
                    className="premium-button w-full sm:w-auto disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-4 text-base md:text-lg"
                  >
                    <Shield className="w-5 h-5 md:w-6 md:h-6" />
                    ACTIVER L'ANALYSE
                  </button>
                  {activeTab === 'email' && (
                    <button className="mt-4 text-xs font-bold text-brand hover:underline flex items-center gap-2 opacity-60">
                      <Zap className="w-3 h-3" />
                      Synchroniser Gmail AUTOMATIQUEMENT (Bientôt)
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
