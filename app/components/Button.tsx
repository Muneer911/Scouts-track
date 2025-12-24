'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'secondary-on-dark' | 'outline-light';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-scout-green text-white hover:bg-scout-green-light focus:ring-scout-green',
    secondary: 'bg-white text-scout-green border-2 border-scout-green hover:bg-scout-neutral focus:ring-scout-green',
    'secondary-on-dark': 'bg-white text-scout-green border-2 border-transparent hover:bg-gray-100 focus:ring-scout-green',
    'outline-light': 'bg-transparent text-white border-2 border-white hover:bg-white/10 focus:ring-white',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
