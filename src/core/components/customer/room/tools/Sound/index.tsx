'use client';
import { useEffect, useState } from 'react';
import SoundItem from './SoundItem';
import { musicService } from '@src/core/services/room/music-service';
import type { Music } from '@src/core/services/room/music-service';

type Sound = {
  id: string;
  name: string;
  volume: number;
  muted: boolean;
  audio: HTMLAudioElement;
};

type VolumeSettingsProps = {
  minimized: boolean;
};

export default function VolumeSettings({ minimized }: VolumeSettingsProps) {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
  
    const fetchSounds = async () => {
      try {
        setLoading(true);
        const musicTracks = await musicService.getAllMusic();
  
        const initialSounds: Sound[] = musicTracks.map((track: Music) => ({
          id: track.id.toString(),
          name: track.title,
          volume: 0.5,
          muted: false,
          audio: new Audio(track.path),
        }));
  
        initialSounds.forEach(sound => {
          sound.audio.loop = true;
          sound.audio.volume = sound.volume;
        });
  
        if (mounted) {
          setSounds(initialSounds);
        }
      } catch (err) {
        if (mounted) {
          setError((err as Error).message || 'Failed to load sounds');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
  
    fetchSounds();
  
    const playSoundsOnClick = () => {
      sounds.forEach(sound => {
        sound.audio.play().catch(() => {});
      });
    };
  
    document.addEventListener('click', playSoundsOnClick, { once: true });
  
    return () => {
      mounted = false;
      sounds.forEach(sound => {
        sound.audio.pause();
        sound.audio.currentTime = 0;
      });
  
      document.removeEventListener('click', playSoundsOnClick);
    };
  }, [musicService]);
  

  const handleToggleMute = (soundId: string) => {
    setSounds(prevSounds =>
      prevSounds.map(sound => {
        if (sound.id === soundId) {
          const newMuted = !sound.muted;
          sound.audio.muted = newMuted;
          if (newMuted) {
            sound.audio.pause();
          } else {
            sound.audio.play().catch(err => console.error(`Failed to play ${sound.name}:`, err));
          }
          return { ...sound, muted: newMuted };
        }
        return sound;
      })
    );
  };

  const handleVolumeChange = (soundId: string, newVolume: number) => {
    setSounds(prevSounds =>
      prevSounds.map(sound => {
        if (sound.id === soundId) {
          sound.audio.volume = newVolume;
          const newMuted = newVolume === 0;
          sound.audio.muted = newMuted;
          if (newMuted) {
            sound.audio.pause();
          } else {
            sound.audio.play().catch(err => console.error(`Failed to play ${sound.name}:`, err));
          }
          return { ...sound, volume: newVolume, muted: newMuted };
        }
        return sound;
      })
    );
  };

  if (minimized) return null;
  if (loading) return <div className="text-white">Loading sounds...</div>;
  if (error) return <div className="text-white">Error: {error}</div>;

  return (
    <div className="space-y-4 px-5 overflow-y-auto h-[30vh]">
      <h2 className="text-xl my-3 text-white">🌧 Sound Settings 🌳</h2>
      {sounds.map(sound => (
        <SoundItem key={sound.id} sound={sound} handleVolumeChange={handleVolumeChange} handleToggleMute={handleToggleMute} />
      ))}
    </div>
  );
}
