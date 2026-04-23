import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import type { FC } from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard: FC<FeatureCardProps> = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-8 md:p-10 glass-card rounded-panel"
    >
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-brand/5 flex items-center justify-center mb-6 md:mb-8 border border-brand/10">
        <Icon className="w-6 h-6 md:w-7 md:h-7 text-brand" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-ink mb-3 md:mb-4 tracking-tight">{title}</h3>
      <p className="text-sm md:text-base text-muted leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
}
