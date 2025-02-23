
import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Initialize Web Audio API context
    audioContextRef.current = new AudioContext();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    gainNodeRef.current.gain.value = 0.1; // Set volume to 10%

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    if (isPlaying) {
      oscillatorRef.current?.stop();
      oscillatorRef.current = null;
    } else {
      // Create and configure oscillator
      const osc = audioContextRef.current.createOscillator();
      osc.type = 'sawtooth'; // Cyberpunk-style waveform
      osc.frequency.setValueAtTime(150, audioContextRef.current.currentTime); // Base frequency
      
      // Create LFO for cyberpunk effect
      const lfo = audioContextRef.current.createOscillator();
      const lfoGain = audioContextRef.current.createGain();
      lfoGain.gain.value = 50; // Modulation amount
      lfo.frequency.value = 2; // LFO speed
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      // Connect and start the main oscillator
      osc.connect(gainNodeRef.current);
      osc.start();
      oscillatorRef.current = osc;
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleMusic}
      className="fixed top-4 right-4 md:top-6 md:right-6 z-50 p-2 rounded-full bg-cyber-blue/10 hover:bg-cyber-blue/20 transition-colors border border-cyber-blue"
      aria-label={isPlaying ? 'Mute sound' : 'Play sound'}
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-cyber-blue" />
      ) : (
        <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-cyber-blue" />
      )}
    </button>
  );
};

export default MusicToggle;
