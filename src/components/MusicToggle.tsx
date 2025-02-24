
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Using a reliable direct MP3 URL for testing
const MUSIC_URL = 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3';

const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';

    const handleCanPlay = () => {
      setIsLoading(false);
      console.log("Audio is ready to play");
    };

    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      console.error("Audio loading error:", {
        error: target.error,
        networkState: target.networkState,
        readyState: target.readyState
      });
      
      toast({
        title: "Error",
        description: "Unable to load music. Please check your internet connection and try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.src = MUSIC_URL;
    audioRef.current = audio;
    
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audioRef.current = null;
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
