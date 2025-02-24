
import React from 'react';
import { X } from 'lucide-react';

interface WelcomeProps {
  onClose: () => void;
}

const Welcome = ({ onClose }: WelcomeProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-cyber-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-2xl w-full bg-cyber-black border border-cyber-blue p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyber-blue hover:text-cyber-blue/80 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="space-y-6">
          <img 
            src="/lovable-uploads/2eaab830-e639-4270-ba5f-4c23f9102f0d.png"
            alt="LUMON Logo"
            className="h-16 md:h-20 w-auto mx-auto mb-6 animate-glow"
          />
          
          <div className="space-y-4 text-cyber-blue">
            <h2 className="text-xl md:text-2xl font-bold tracking-wider">HELLO REFINER,</h2>
            
            <p className="text-sm md:text-base">
              Welcome to the portfolio of Anita Kirkovska.
            </p>
            
            <p className="text-sm md:text-base">
              Explore the grid. Find anomalies. Click to uncover what must be known.
            </p>
            
            <p className="text-sm md:text-base">
              Inside are projects, experiments, and thoughts—yours to classify.
            </p>
            
            <p className="text-sm md:text-base">
              Your compliance ensures access.
            </p>
            
            <div className="pt-4 space-y-1">
              <p className="text-sm md:text-base">In trust,</p>
              <p className="text-sm md:text-base font-bold">Anita Kirkovska</p>
            </div>

            <div className="pt-6 flex justify-center">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-cyber-blue text-cyber-black font-bold tracking-wider hover:bg-cyber-blue/90 transition-colors uppercase"
              >
                Begin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

