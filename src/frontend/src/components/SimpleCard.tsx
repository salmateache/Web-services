import React from 'react';

// Composant Card (Le conteneur)
export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className || ''}`}>
      {children}
    </div>
  );
}

// Composant CardContent (Le contenu avec padding)
export function CardContent({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={`p-6 ${className || ''}`}>
      {children}
    </div>
  );
}