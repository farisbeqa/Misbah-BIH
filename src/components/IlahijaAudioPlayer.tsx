'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Music } from 'lucide-react'

export default function IlahijaAudioPlayer({ audioUrl }: { audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => { setPlaying(false); setProgress(0) }
    const onTimeUpdate = () => setProgress(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)

    // Attempt autoplay
    audio.play().catch(() => {})

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [audioUrl])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) audio.pause()
    else audio.play().catch(() => {})
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = parseFloat(e.target.value)
    setProgress(audio.currentTime)
  }

  const fmt = (s: number) => {
    if (!isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm mb-8">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <button
        onClick={togglePlay}
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
        style={{ backgroundColor: '#8B1E3F' }}
        aria-label={playing ? 'Pauza' : 'Reproduciraj'}
      >
        {playing ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
      </button>

      <Music size={14} className="flex-shrink-0" style={{ color: '#978A81' }} />

      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-xs tabular-nums flex-shrink-0" style={{ color: '#978A81' }}>
          {fmt(progress)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={progress}
          onChange={handleSeek}
          className="flex-1 h-1.5 rounded-full accent-[#8B1E3F] cursor-pointer"
          style={{ background: `linear-gradient(to right, #8B1E3F ${duration ? (progress / duration) * 100 : 0}%, #e5e7eb ${duration ? (progress / duration) * 100 : 0}%)` }}
        />
        <span className="text-xs tabular-nums flex-shrink-0" style={{ color: '#978A81' }}>
          {fmt(duration)}
        </span>
      </div>
    </div>
  )
}
