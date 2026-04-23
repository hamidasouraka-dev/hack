import { motion } from "motion/react";
import { ShieldAlert } from "lucide-react";

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 md:py-6 max-w-7xl mx-auto"
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
          <ShieldAlert className="text-alabaster w-6 h-6" />
        </div>
        <span className="font-display font-bold text-xl tracking-tighter text-brand">ArnaqueDetect</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
        <a href="#features" className="hover:text-brand transition-colors">Fonctionnalités</a>
        <a href="#demo" className="hover:text-brand transition-colors">Démo</a>
        <button className="px-5 py-2.5 rounded-full bg-brand/5 text-brand border border-brand/10 hover:bg-brand/10 transition-all font-semibold">
          Documentation
        </button>
      </div>
    </motion.nav>
  );
}
