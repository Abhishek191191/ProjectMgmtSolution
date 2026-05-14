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

const badgeColors: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  gray: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const Badge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = 'blue' }) => {
  const colorClass = badgeColors[color] || badgeColors.blue;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
      {children}
    </span>
  );
};
