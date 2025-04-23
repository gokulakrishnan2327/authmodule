import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  // Don't show anything if password is empty
  if (!password) return null;
  
  const getPasswordStrength = (password: string): number => {
    if (password.length < 4) return 1; // Weak
    if (password.length < 7) return 2; // Medium
    return 3; // Strong
  };

  const strength = getPasswordStrength(password);
  
  // Define colors and active segments based on strength
  const getColorClass = (strength: number): string => {
    switch (strength) {
      case 1: return 'bg-[#E9263A]'; // Weak - red
      case 2: return 'bg-[#FFC109]'; // Medium - yellow
      case 3: return 'bg-[#85B205]'; // Strong - green
      default: return 'bg-[#E8E8E9]'; // Default - light gray
    }
  };

  // Define message based on strength
  const getMessage = (strength: number): { text: string; color: string } => {
    switch (strength) {
      case 0: return { text: 'Too short password', color: 'text-gray-500' };
      case 1: return { text: 'This is a weak ', color: 'text-[#E9263A]' };
      case 2: return { text: 'This is just a good ', color: 'text-[#FFC109]' };
      case 3: return { text: 'Wohoo! It\'s a strong ', color: 'text-[#85B205]' };
      default: return { text: '', color: '' };
    }
  };

  const message = getMessage(strength);
  
  // Determine which bars should be active and their colors
  const getBarStyles = (barIndex: number): string => {
    // Default style for all bars
    let baseStyle = "w-[30px] h-[5px] rounded-full ";
    
    // Active styles based on strength
    if (strength === 1 && barIndex < 2) {
      return baseStyle + "bg-[#E9263A]"; // Weak - first 2 bars red
    } else if (strength === 2) {
      if (barIndex < 2) {
        return baseStyle + "bg-[#E9263A]"; // First 2 bars red
      } else if (barIndex < 4) {
        return baseStyle + "bg-[#FFC109]"; // Next 2 bars yellow
      }
    } else if (strength === 3) {
      if (barIndex < 2) {
        return baseStyle + "bg-[#E9263A]"; // First 2 bars red
      } else if (barIndex < 4) {
        return baseStyle + "bg-[#FFC109]"; // Next 2 bars yellow
      } else if (barIndex < 6) {
        return baseStyle + "bg-[#85B205]"; // Last 2 bars green
      }
    }
    
    // Default for inactive bars
    return baseStyle + "bg-[#94949B]";
  };

  return (
    <div className="mt-2">
      {/* Container for both bars and message in same line */}
      <div className="flex items-center justify-between">
        {/* Strength bars */}
        <div className="flex space-x-1">
          {[...Array(6)].map((_, index) => (
            <div key={index} className={getBarStyles(index)}></div>
          ))}
        </div>
        
        {/* Strength message with info icon */}
        <div className="flex items-center gap-2">
          <span className={`font-roboto font-medium text-base leading-6 ${message.color}`}>
            {message.text}
          </span>
          <div className="w-5 h-5 rounded-full border-2 border-[#5D40ED] flex items-center justify-center text-[#5D40ED] text-xs font-bold">
            i
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;