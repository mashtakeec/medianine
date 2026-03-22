import React from "react";
import { staticFile } from "remotion";

export const Logo: React.FC = () => {
  return (
    <div className="absolute top-10 left-10">
      <div className="bg-white p-1 rounded-xl shadow-lg border-2 border-[#f0c300]">
        <img 
          src={staticFile("logo.jpg")} 
          alt="Logo" 
          className="h-24 w-auto rounded-lg object-contain"
        />
      </div>
    </div>
  );
};
