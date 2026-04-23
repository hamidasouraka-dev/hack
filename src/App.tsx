import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, ShieldAlert, Zap, Lock } from "lucide-react";
import { Navbar } from "./components/layout/Navbar";
import { Hero } from "./components/layout/Hero";
import { FeatureCard } from "./components/features/FeatureCard";
import { Analyzer } from "./components/analyzer/Analyzer";
import { ResultDisplay } from "./components/results/ResultDisplay";
import { Footer } from "./components/layout/Footer";
import { ScamAnalysis } from "./types";

export default function App() {
  const [analysis, setAnalysis] = useState<ScamAnalysis | null>(null);

  const features = [
    {
      icon: ShieldCheck,
      title: "Précision Fintech",
      description: "Identifie les anomalies bancaires et Mobile Money avec une rigueur digne des meilleures institutions financières.",
      delay: 0.1
    },
    {
      icon: Zap,
      title: "Analyse Instantanée",
      description: "Notre moteur d'IA souverain fournit un diagnostic en moins de 3 secondes pour neutraliser la menace immédiatement.",
      delay: 0.2
    },
    {
      icon: Lock,
      title: "Confidentialité Totale",
      description: "Vos données sont chiffrées de bout en bout. Nous analysons le risque, sans jamais stocker vos informations personnelles.",
      delay: 0.3
    }
  ];

  return (
    <div className="relative isolate overflow-x-hidden">
      <div className="grain-overlay" />
      <Navbar />

      <main className="min-h-screen">
        <Hero />

        {/* Features Section */}
        <section id="features" className="py-32 px-8 bg-white/30 relative">
          <div className="max-w-7xl mx-auto">
            <header className="mb-20">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-ink mb-6 tracking-tight">Sécurité sans compromis.</h2>
              <p className="text-muted text-xl max-w-xl font-medium">Une technologie de pointe conçue spécifiquement pour les défis numériques quotidiens en Afrique de l'Ouest.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} delay={f.delay} />
              ))}
            </div>
          </div>
        </section>

        {/* Analyzer & Results Section */}
        <section id="demo" className="py-40 px-8">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-ink mb-6 tracking-tight">Outil de Diagnostic Sécurisé</h2>
              <p className="text-muted text-xl max-w-2xl mx-auto font-medium">Capturez l'élément suspect et laissez ArnaqueDetect AI neutraliser le risque.</p>
            </header>

            <div className="space-y-24">
              <Analyzer 
                onStart={() => setAnalysis(null)}
                onResult={(res) => {
                  setAnalysis(res);
                  // Dynamic scroll to results
                  setTimeout(() => {
                    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }} 
              />

              <AnimatePresence>
                {analysis && (
                  <div id="results" className="pt-20 border-t border-brand/5">
                    <ResultDisplay analysis={analysis} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Reassurance Banner */}
        <section className="py-24 px-8 mb-20">
          <div className="max-w-4xl mx-auto glass-card rounded-panel p-16 text-center border-t-accent/30 bg-gradient-to-b from-white/60 to-alabaster/60">
            <h3 className="text-3xl md:text-4xl font-display font-bold text-brand mb-6 leading-tight">
              Plus de 50 000 familles <br /> protégées chaque jour.
            </h3>
            <p className="text-muted text-lg mb-12 max-w-xl mx-auto">
              Rejoignez une communauté qui refuse le risque et choisit la sérénité technologique.
            </p>
            <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale contrast-125">
              <span className="font-display font-black text-2xl tracking-tighter">FINANCE-CI</span>
              <span className="font-display font-black text-2xl tracking-tighter">BÉNIN-SECURE</span>
              <span className="font-display font-black text-2xl tracking-tighter">WEST-SAFE</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
