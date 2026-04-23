import { motion } from "motion/react";
import { ShieldCheck, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-bold uppercase tracking-[0.2em] mb-8"
        >
          <ShieldCheck className="w-4 h-4" />
          Technologie Certifiée Anti-Fraude
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-display font-bold leading-[1.1] md:leading-[0.9] text-ink mb-8 tracking-[-0.04em]"
        >
          Protégez votre argent <br className="hidden sm:block" /> <span className="text-muted/40 italic">en toute sérénité.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed px-4 md:px-0"
        >
          ArnaqueDetect utilise une IA de pointe pour identifier les fraudes Mobile Money, les faux emplois et les tentatives de phishing en quelques secondes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a href="#demo" className="premium-button flex items-center gap-3 no-underline shadow-xl">
            Analyser un message <ArrowRight className="w-5 h-5" />
          </a>
          <button className="secondary-button">
            En savoir plus
          </button>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] bg-brand/5 blur-[120px] rounded-full" />
    </section>
  );
}
