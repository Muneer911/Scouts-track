'use client';

import { cn } from '@/lib/utils';

export function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn('rounded-2xl border border-scout-gray-lighter bg-white p-5 shadow-sm hover:shadow-md hover:border-scout-green/30 transition-all relative overflow-hidden group', className)}>
      {/* Subtle accent gradient */}
      <div className="absolute top-0 start-0 w-full h-1 bg-gradient-to-e from-scout-green/40 via-scout-green-lighter/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="text-sm text-scout-gray">{label}</div>
      <div className="text-3xl font-light text-scout-green mt-2 group-hover:text-scout-green-light transition-colors">{value}</div>
      {hint && <div className="text-xs text-scout-gray mt-2">{hint}</div>}
    </div>
  );
}

