'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-scout-neutral">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Topbar title={title} />
          <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

