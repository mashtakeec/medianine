import React from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="absolute top-10 right-10 flex flex-col items-end max-w-[60%]">
      {/* Main Title Box */}
      <div className="bg-white px-6 py-2 shadow-xl mb-1 ring-1 ring-black/5">
        <span className="text-black text-4xl font-bold tracking-tight">「{title}」</span>
      </div>
      
      {/* Subtitle Bar */}
      <div className="bg-[#f0c300] px-4 py-1.5 shadow-lg flex items-center">
        <span className="text-black text-2xl font-bold">{subtitle}</span>
        <span className="text-[#a08200] ml-3 font-black text-xl italic uppercase">NEWS DIG⚡</span>
      </div>
    </div>
  );
};
