
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Using a reliable direct MP3 URL for testing
const MUSIC_URL = 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav';

const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.preload = 'auto'; // Ensure audio preloading

    const handleCanPlay = () => {
      setIsLoading(false);
      console.log("Audio is ready to play");
    };

    const handleError = (e: Event) => {
      console.error("Audio loading error:", e);
      toast({
        title: "Error",
        description: "Unable to load music. Please try uploading the file directly to the project.",
        variant: "destructive",
      });
      setIsLoading(false);
    };

    audioRef.current.addEventListener('canplay', handleCanPlay);
    audioRef.current.addEventListener('error', handleError);
    
    // Start loading the audio
    audioRef.current.load();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplay', handleCanPlay);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [toast]);

  const toggleMusic = async () => {
    if (!audioRef.current || isLoading) return;
    
    try {
      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Playback error:", error);
      toast({
        title: "Error",
        description: "Failed to play music. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={toggleMusic}
      disabled={isLoading}
      className="fixed top-4 right-4 md:top-6 md:right-6 z-50 p-2 rounded-full bg-cyber-blue/10 hover:bg-cyber-blue/20 transition-colors border border-cyber-blue disabled:opacity-50"
      aria-label={isPlaying ? 'Mute music' : 'Play music'}
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

