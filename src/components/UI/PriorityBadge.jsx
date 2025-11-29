import React from 'react';

const PriorityBadge = ({ level }) => {
  const colors = {
    High: 'bg-red-500/10 text-red-400 border-red-500/20',
    Medium: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${colors[level] || colors.Low} font-medium`}>
      {level}
    </span>
  );
};

export default PriorityBadge;