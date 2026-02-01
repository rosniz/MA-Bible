import { useState, useEffect, useRef, useCallback } from 'react';
import { Verse } from '../services/types/bible.types';
import { useReaderStore } from '../store/readerStore';

interface UseAudioReturn {
  isPlaying: boolean;
  currentVerseIndex: number;
  rate: number;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;

  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  setRate: (rate: number) => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  stop: () => void;
}

export const useAudio = (verses: Verse[]): UseAudioReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const rate = useReaderStore((s) => s.audioRate);
  const setAudioRate = useReaderStore((s) => s.setAudioRate);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef(false);
  const indexRef = useRef(0);

  // ── Load voices ───────────────────────────────────────────────────────────
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer French voices for a French Bible app
      const frenchVoices = voices.filter((v) => v.lang.startsWith('fr'));
      const sorted = frenchVoices.length > 0 ? frenchVoices : voices;
      setAvailableVoices(sorted);
      if (sorted.length > 0 && !selectedVoice) {
        setSelectedVoice(sorted[0]);
      }
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      isPlayingRef.current = false;
      setIsPlaying(false);
    };
  }, []);

  // ── Sync index ref ────────────────────────────────────────────────────────
  useEffect(() => {
    indexRef.current = currentVerseIndex;
  }, [currentVerseIndex]);

  // ── Core: speak a single verse, then chain to next ───────────────────────
  const speakVerse = useCallback(
    (index: number) => {
      if (!verses[index] || !isPlayingRef.current) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(verses[index].text);
      utterance.rate = rate;
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.lang = 'fr-FR';

      utterance.onend = () => {
        if (!isPlayingRef.current) return;
        const next = index + 1;
        if (next < verses.length) {
          setCurrentVerseIndex(next);
          speakVerse(next);
        } else {
          // End of chapter
          isPlayingRef.current = false;
          setIsPlaying(false);
        }
      };

      utterance.onerror = () => {
        isPlayingRef.current = false;
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [verses, rate, selectedVoice]
  );

  // ── Controls ──────────────────────────────────────────────────────────────
  const play = useCallback(() => {
    if (verses.length === 0) return;
    isPlayingRef.current = true;
    setIsPlaying(true);
    speakVerse(indexRef.current);
  }, [verses, speakVerse]);

  const pause = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    window.speechSynthesis.cancel();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    const wasPlaying = isPlayingRef.current;
    window.speechSynthesis.cancel();
    const nextIndex = Math.min(currentVerseIndex + 1, verses.length - 1);
    setCurrentVerseIndex(nextIndex);
    if (wasPlaying) {
      isPlayingRef.current = true;
      setTimeout(() => speakVerse(nextIndex), 100);
    }
  }, [currentVerseIndex, verses.length, speakVerse]);

  const prev = useCallback(() => {
    const wasPlaying = isPlayingRef.current;
    window.speechSynthesis.cancel();
    const prevIndex = Math.max(currentVerseIndex - 1, 0);
    setCurrentVerseIndex(prevIndex);
    if (wasPlaying) {
      isPlayingRef.current = true;
      setTimeout(() => speakVerse(prevIndex), 100);
    }
  }, [currentVerseIndex, speakVerse]);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentVerseIndex(0);
    window.speechSynthesis.cancel();
  }, []);

  const setRate = useCallback((newRate: number) => {
    setAudioRate(newRate);
    // If currently speaking, restart current verse with new rate
    if (isPlayingRef.current) {
      window.speechSynthesis.cancel();
      setTimeout(() => speakVerse(indexRef.current), 100);
    }
  }, [setAudioRate, speakVerse]);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  return {
    isPlaying,
    currentVerseIndex,
    rate,
    availableVoices,
    selectedVoice,
    play,
    pause,
    togglePlay,
    next,
    prev,
    setRate,
    setVoice,
    stop,
  };
};