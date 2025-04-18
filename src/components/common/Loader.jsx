import React from 'react';

const Loader = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed flex flex-col items-center justify-center w-[510px] h-[210px] top-[447px] left-[465px] bg-[#2D3436] rounded-lg z-50 transition-opacity duration-300 opacity-100 shadow-xl">
      <div className="flex flex-col items-center gap-10">
        {/* Loader animation */}
        <div className="relative w-[90px] h-[90px] flex items-center justify-center bg-[#5D40ED] rounded-full">
          <div className="flex space-x-3">
            {/* Three pulsing dots */}
            <div className="w-[45px] h-[45px] bg-[#EFECFD] rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Text content */}
        <div className="flex flex-col items-center">
          <h4 className="font-['Roboto'] font-semibold text-4xl leading-[48px] tracking-[-0.02em] text-center text-white">
            Thanks for the patience
          </h4>
          <p className="font-['Roboto'] font-medium text-xl leading-6 tracking-[0.02em] text-center text-white mt-2">
            Amazing things coming from Pitchmatter
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;