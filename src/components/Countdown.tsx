import { useEffect, useRef, useState } from 'react';
import { getCountdownParts, type CountdownParts } from '../domain/countdown';
import { DOOMSDAY_DATE } from '../domain/progress';

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

function pad(value: number) { return String(value).padStart(2, '0'); }

function playTick(context: AudioContext) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(0.045, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.08);
}

export default function Countdown() {
  const [countdown, setCountdown] = useState<CountdownParts>(() => getCountdownParts(DOOMSDAY_DATE));
  const [muted, setMuted] = useState(true);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdownParts(DOOMSDAY_DATE)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (muted || typeof window === 'undefined' || !window.AudioContext) return;
    const timer = window.setInterval(() => {
      if (audioContext.current?.state === 'running') playTick(audioContext.current);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [muted]);

  useEffect(() => () => {
    if (audioContext.current) void audioContext.current.close();
  }, []);

  const toggleSound = async () => {
    if (!muted) {
      setMuted(true);
      return;
    }

    const AudioContextConstructor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
    if (!AudioContextConstructor) return;

    const context = audioContext.current ?? new AudioContextConstructor();
    audioContext.current = context;

    try {
      await context.resume();
      playTick(context);
      setMuted(false);
    } catch {
      setMuted(true);
    }
  };

  if (!countdown.totalMilliseconds) return <p className="countdown-label">¡Es hoy!</p>;

  return <div className="countdown-wrap">
    <div className="countdown" role="timer" aria-label="Tiempo restante hasta el 18 de diciembre de 2026">
      <span className="countdown-unit"><b>{countdown.days}</b><small>días</small></span><span className="countdown-separator" aria-hidden="true">:</span>
      <span className="countdown-unit"><b>{pad(countdown.hours)}</b><small>hrs</small></span><span className="countdown-separator" aria-hidden="true">:</span>
      <span className="countdown-unit"><b>{pad(countdown.minutes)}</b><small>min</small></span><span className="countdown-separator" aria-hidden="true">:</span>
      <span className="countdown-unit"><b>{pad(countdown.seconds)}</b><small>seg</small></span>
    </div>
    <button className="countdown-sound" type="button" onClick={toggleSound} aria-pressed={!muted} aria-label={muted ? 'Activar tic de reloj' : 'Silenciar tic de reloj'}><span aria-hidden="true">{muted ? '🔇' : '🔊'}</span> {muted ? 'Sonido apagado' : 'Sonido activo'}</button>
  </div>;
}
