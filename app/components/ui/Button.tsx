'use client';

import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  href?: string;
}

export function Button({ variant = 'primary', children, className = '', href, ...props }: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-scout-green to-scout-green-light text-white hover:from-scout-green-light hover:to-scout-green-accent focus:ring-scout-green/30 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-scout-green border-2 border-scout-green/20 hover:border-scout-green hover:bg-scout-green/5 focus:ring-scout-green/30 shadow-sm hover:shadow-md',
    ghost: 'text-scout-gray hover:text-scout-green hover:bg-scout-neutral focus:ring-scout-green/30',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}

