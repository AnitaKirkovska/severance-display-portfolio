
import React from 'react';
import { X } from 'lucide-react';

interface CompletionPopupProps {
  onClose: () => void;
}

const CompletionPopup = ({ onClose }: CompletionPopupProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-cyber-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-2xl w-full bg-cyber-black border border-cyber-blue p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyber-blue hover:text-cyber-blue/80 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="space-y-6 text-cyber-blue">
          <h2 className="text-2xl md:text-3xl font-bold tracking-wider">TASK COMPLETE</h2>
          
          <p className="text-sm md:text-base">
            You've explored the workspace of Anita Kirkovska. The data is refined. The anomalies are acknowledged.
          </p>
          
          <p className="text-sm md:text-base">
            As a token of recognition, please accept this finger trap.
          </p>

          <div className="flex justify-center py-4">
            <img 
              src="/lovable-uploads/3a77b4c1-9133-4c62-b7ad-a88403e76d8a.png"
              alt="Finger Trap"
              className="max-w-full h-auto max-h-48 object-contain"
            />
          </div>
          
          <p className="text-sm md:text-base">
            Should you return, the system will be ready.
          </p>
          
          <div className="pt-4 space-y-1">
            <p className="text-sm md:text-base">In trust,</p>
            <p className="text-sm md:text-base font-bold">Management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionPopup;
