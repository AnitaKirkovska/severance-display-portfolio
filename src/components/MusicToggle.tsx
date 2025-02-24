
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Using a reliable public domain audio file for testing
const MUSIC_URL = 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav';

const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audio = new Audio();
    
    const handleCanPlay = () => {
      setIsLoading(false);
      console.log("Audio loaded successfully and ready to play");
    };

    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      console.error("Audio loading error:", {
        error: target.error,
        networkState: target.networkState,
        readyState: target.readyState,
        src: target.src
      });
      
      toast({
        title: "Error",
        description: "Unable to load music. Please check your internet connection and try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      console.log("Audio started loading");
      setIsLoading(true);
    };

    const handlePlay = () => {
      console.log("Audio playback started successfully");
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log("Audio playback paused");
      setIsPlaying(false);
    };

    // Configure audio
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.5;

    // Add all event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Set source after adding event listeners
    audio.src = MUSIC_URL;
    audioRef.current = audio;

    // Clean up function
    return () => {
      if (audio) {
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.pause();
        audio.src = '';
      }
      audioRef.current = null;
    };
  }, [toast]);

  const toggleMusic = async () => {
    if (!audioRef.current || isLoading) return;
    
    try {
      if (isPlaying) {
        console.log("Attempting to pause music...");
        audioRef.current.pause();
      } else {
        console.log("Attempting to play music...");
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          console.log("Play promise resolved successfully");
        }
      }
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
      className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-cyber-blue/10 hover:bg-cyber-blue/20 transition-colors border border-cyber-blue disabled:opacity-50 cursor-pointer"
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

