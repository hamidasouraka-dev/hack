import { ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-16 md:py-24 px-6 md:px-8 border-t border-brand/5 bg-white/20 mt-12 md:mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-12">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <ShieldAlert className="text-alabaster w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg tracking-tighter text-brand">ArnaqueDetect</span>
          </div>
          <p className="text-muted text-sm leading-relaxed font-medium">
            La solution leader de protection contre la cybercriminalité en Afrique de l'Ouest. Utilise une intelligence artificielle souveraine pour sécuriser vos transactions et vos familles.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">
          <div>
            <h5 className="font-bold text-ink text-sm uppercase tracking-widest mb-4 md:mb-6">Produit</h5>
            <ul className="space-y-3 md:space-y-4 text-sm text-muted font-medium">
              <li><a href="#" className="hover:text-brand transition-colors">Analyzer</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">API Sécurité</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Rapports</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-ink text-sm uppercase tracking-widest mb-4 md:mb-6">Compagnie</h5>
            <ul className="space-y-3 md:space-y-4 text-sm text-muted font-medium">
              <li><a href="#" className="hover:text-brand transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 md:mt-20 pt-8 md:pt-10 border-t border-brand/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] text-center md:text-left">
          &copy; 2024 ArnaqueDetect Africa &bull; Global Financial Protection
        </p>
        <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
          <span>Lagos</span>
          <span>Cotonou</span>
          <span>Dakar</span>
          <span>Abidjan</span>
        </div>
      </div>
    </footer>
  );
}
