import { motion } from "motion/react";
import { ShieldCheck, ShieldAlert, ShieldX, Info, List, ArrowRight, MessageCircle } from "lucide-react";
import { ScamAnalysis } from "../../types";
import { useEffect, useState } from "react";
import { AssistantChat } from "./AssistantChat";

interface ResultDisplayProps {
  analysis: ScamAnalysis;
}

export function ResultDisplay({ analysis }: ResultDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(analysis.risk_score);
    }, 500);
    return () => clearTimeout(timer);
  }, [analysis.risk_score]);

  const config = {
    CRITIQUE: { icon: ShieldX, color: "text-red-600", bg: "bg-red-50", border: "border-red-100", label: "DANGER CRITIQUE" },
    ÉLEVÉ: { icon: ShieldAlert, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", label: "RISQUE ÉLEVÉ" },
    MOYEN: { icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", label: "MISE EN GARDE" },
    FAIBLE: { icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", label: "CONFIRME SÉCURISÉ" }
  }[analysis.risk_level] || { icon: ShieldCheck, color: "text-brand", bg: "bg-brand/5", border: "border-brand/10", label: "ANALYSE TERMINÉE" };

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, blur: "10px" }}
      animate={{ opacity: 1, scale: 1, blur: "0px" }}
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      {/* Risk Summary Header */}
      <div className={`p-10 rounded-[40px] border ${config.border} ${config.bg} relative overflow-hidden group`}>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <svg className="w-48 h-48 -rotate-90">
              <circle cx="96" cy="96" r="88" className="fill-none stroke-black/5" strokeWidth="12" />
              <motion.circle
                cx="96" cy="96" r="88"
                className={`fill-none stroke-current ${config.color}`}
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 88}
                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - displayScore / 100) }}
                transition={{ duration: 2, ease: "circOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-display font-black leading-none ${config.color}`}>{displayScore}</span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-1">Indice</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} border ${config.border} ${config.color} text-[10px] font-bold uppercase tracking-widest mb-6`}>
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-ink mb-6 tracking-tight">
              {analysis.type_arnaque}
            </h2>
            <p className="text-xl text-muted font-medium italic leading-relaxed">
              "{analysis.resume}"
            </p>
          </div>
        </div>
        
        {/* Abstract background pattern */}
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
          <Icon className="w-64 h-64 rotate-12" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Indices Card */}
        <div className="p-10 glass-card rounded-panel">
          <div className="flex items-center gap-3 mb-8 text-ink">
            <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center">
              <List className="w-5 h-5 text-brand" />
            </div>
            <h4 className="font-bold text-lg uppercase tracking-tight">Indicateurs de Fraude</h4>
          </div>
          <ul className="space-y-4">
            {analysis.indices_detectes.map((item, i) => (
              <li key={i} className="flex items-start gap-4 text-muted font-medium leading-relaxed group">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-brand/20 shrink-0 group-hover:bg-brand transition-colors" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Advice Card */}
        <div className="p-10 glass-card rounded-panel">
          <div className="flex items-center gap-3 mb-8 text-brand">
            <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-brand" />
            </div>
            <h4 className="font-bold text-lg uppercase tracking-tight">Actions Immédiates</h4>
          </div>
          <div className="space-y-6">
            {analysis.action_immediate.map((action, i) => (
              <div key={i} className="bg-alabaster/50 border border-brand/5 p-5 rounded-2xl flex gap-4">
                <span className="text-brand font-black italic opacity-20 text-3xl">0{i+1}</span>
                <p className="text-ink font-semibold leading-snug">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="p-10 glass-card rounded-panel md:col-span-2">
          <div className="flex items-center gap-3 mb-8 text-ink">
            <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center">
              <Info className="w-5 h-5 text-brand" />
            </div>
            <h4 className="font-bold text-lg uppercase tracking-tight">Rapport de l'IA ArnaqueDetect</h4>
          </div>
          <p className="text-muted text-lg leading-relaxed font-medium indent-12">
            {analysis.analyse_detaillee}
          </p>
          
          <div className="mt-12 pt-12 border-t border-brand/5">
            <h5 className="font-bold text-sm uppercase tracking-widest text-brand mb-6">Prévention & Sécurité</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {analysis.conseils_prevention.map((tip, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-muted">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Follow-up Chat Assistant */}
        <AssistantChat analysis={analysis} />
      </div>

      <div className="text-center py-12">
        <button 
          onClick={() => window.scrollTo({ top: document.getElementById('demo')?.offsetTop, behavior: 'smooth' })}
          className="secondary-button"
        >
          Effectuer une nouvelle analyse
        </button>
      </div>
    </motion.div>
  );
}
