import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-10 glass-card rounded-panel"
    >
      <div className="w-14 h-14 rounded-2xl bg-brand/5 flex items-center justify-center mb-8 border border-brand/10">
        <Icon className="w-7 h-7 text-brand" />
      </div>
      <h3 className="text-2xl font-bold text-ink mb-4 tracking-tight">{title}</h3>
      <p className="text-muted leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
}
