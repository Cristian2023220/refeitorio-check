import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  rotulo: string;
  valor: string | number;
  icone: LucideIcon;
}

export function StatCard({ rotulo, valor, icone: Icone }: StatCardProps) {
  return (
    <div className="bg-gradient-to-b from-surface to-surface-container-low p-md rounded-xl border-2 border-border shadow-[0_10px_25px_rgba(0,0,0,0.05)] flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 p-md opacity-10">
        <Icone size={64} />
      </div>
      <span className="font-label-caps text-label-caps text-text-muted uppercase mb-xs z-10">{rotulo}</span>
      <span className="font-stat-value text-stat-value text-text-heading z-10">{valor}</span>
    </div>
  );
}
