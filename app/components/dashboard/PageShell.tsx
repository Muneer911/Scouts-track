'use client';

import React from 'react';

interface PageShellProps {
  title: string;
  children: React.ReactNode;
}

export function PageShell({ title, children }: PageShellProps) {
  void title;
  return (
    <div className="p-6 space-y-6">{children}</div>
  );
}

