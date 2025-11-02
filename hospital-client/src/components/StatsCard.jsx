import React from 'react';

export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col transition-all duration-300 hover:shadow-lg">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</div>
    </div>
  );
}

