import React from 'react';

interface InterestOption {
  id: string;
  label: string;
}

interface InterestsSelectionProps {
  selectedInterests: string[];
  onChange: (selectedInterests: string[]) => void;
}

const InterestsSelection: React.FC<InterestsSelectionProps> = ({ selectedInterests, onChange }) => {
  const interestOptions: InterestOption[] = [
    { id: 'payments', label: 'Payments' },
    { id: 'lending', label: 'Lending' },
    { id: 'wealth_management', label: 'Wealth Management' },
    { id: 'insurance', label: 'Insurance' },
    { id: 'blockchain', label: 'Blockchain & Crypto' },
    { id: 'regtech', label: 'RegTech' },
    { id: 'banking', label: 'Digital Banking' },
    { id: 'ai', label: 'AI & Machine Learning' },
    { id: 'security', label: 'Cybersecurity' },
    { id: 'investing', label: 'Investment Platforms' },
    { id: 'marketplace', label: 'Marketplaces' },
    { id: 'proptech', label: 'PropTech' }
  ];

  const toggleInterest = (interestId: string): void => {
    if (selectedInterests.includes(interestId)) {
      onChange(selectedInterests.filter(id => id !== interestId));
    } else {
      onChange([...selectedInterests, interestId]);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">What are your interests?</h3>
      <p className="text-gray-600 mb-6">Select at least one area of interest in fintech. This helps us personalize your experience.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {interestOptions.map(interest => (
          <div
            key={interest.id}
            className={`
              px-4 py-3 border rounded-lg cursor-pointer transition-all text-center
              ${selectedInterests.includes(interest.id)
                ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }
            `}
            onClick={() => toggleInterest(interest.id)}
          >
            <span className="text-sm font-medium">{interest.label}</span>
          </div>
        ))}
      </div>
      
      {selectedInterests.length > 0 && (
        <p className="mt-4 text-sm text-gray-500">
          Selected: {selectedInterests.length} {selectedInterests.length === 1 ? 'interest' : 'interests'}
        </p>
      )}
    </div>
  );
};

export default InterestsSelection;