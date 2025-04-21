import Button from './Button';

// Success Modal Component
const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-bold text-gray-900">You're All Set!</h3>
          <p className="mt-1 text-gray-600">
            Ready to unlock new possibilities?
          </p>
          <div className="mt-4">
            <Button onClick={onClose} fullWidth>
              Let's Go!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SuccessModal;