import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => (
  <div className="bg-white shadow rounded-lg p-6 mb-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">{title}</h3>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'blue' }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800 mr-2`}>
    {children}
  </span>
);
