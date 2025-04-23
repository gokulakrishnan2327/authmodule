import React from 'react';

interface GoalOption {
  id: string;
  label: string;
  description: string;
}

interface GoalsSelectionProps {
  selectedGoals: string[];
  onChange: (selectedGoals: string[]) => void;
}

const GoalsSelection: React.FC<GoalsSelectionProps> = ({ selectedGoals, onChange }) => {
  const goalOptions: GoalOption[] = [
    { id: 'raise_funds', label: 'Raise Funds', description: 'Looking to secure investment for your venture' },
    { id: 'network', label: 'Build Network', description: 'Connect with peers, investors, and industry experts' },
    { id: 'find_partners', label: 'Find Business Partners', description: 'Locate co-founders or strategic partners' },
    { id: 'mentor', label: 'Find Mentorship', description: 'Get guidance from experienced professionals' },
    { id: 'provide_mentorship', label: 'Provide Mentorship', description: 'Share your expertise with others' },
    { id: 'market_research', label: 'Market Research', description: 'Learn about trends and innovations' },
    { id: 'discover_startups', label: 'Discover Startups', description: 'Find promising ventures to invest in or partner with' },
    { id: 'find_talent', label: 'Find Talent', description: 'Recruit professionals for your organization' },
    { id: 'find_opportunities', label: 'Find Job Opportunities', description: 'Discover career opportunities in fintech' },
    { id: 'sell_services', label: 'Market Services', description: 'Sell your products or services to other users' }
  ];

  const toggleGoal = (goalId: string): void => {
    if (selectedGoals.includes(goalId)) {
      onChange(selectedGoals.filter(id => id !== goalId));
    } else {
      onChange([...selectedGoals, goalId]);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">What are your goals?</h3>
      <p className="text-gray-600 mb-6">
        Select at least one goal you're looking to achieve on this platform. This helps us customize your experience.
      </p>
      
      <div className="space-y-3">
        {goalOptions.map(goal => (
          <div
            key={goal.id}
            className={`
              px-4 py-3 border rounded-lg cursor-pointer transition-all
              ${selectedGoals.includes(goal.id)
                ? 'bg-indigo-50 border-indigo-500'
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
            onClick={() => toggleGoal(goal.id)}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={selectedGoals.includes(goal.id)}
                onChange={() => {}} // Handled by div click
                onClick={(e) => e.stopPropagation()}
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-900">{goal.label}</span>
                <p className="text-xs text-gray-500">{goal.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedGoals.length > 0 && (
        <p className="mt-4 text-sm text-gray-500">
          Selected: {selectedGoals.length} {selectedGoals.length === 1 ? 'goal' : 'goals'}
        </p>
      )}
    </div>
  );
};

export default GoalsSelection;