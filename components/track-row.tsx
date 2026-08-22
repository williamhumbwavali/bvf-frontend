'use client'

import { Heart, MoreHorizontal, Play } from 'lucide-react'
import { toast } from 'sonner'

import { Track } from '@/services/tracks.service'
import { usePlayerStore } from '@/stores/player-store'

interface TrackRowProps {
  track: Track
  index: number
  onPlay: (track: Track) => void
}

function Cover({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
    />
  )
}

export default function TrackRow({
  track,
  index,
  onPlay,
}: TrackRowProps) {
  const { liked, toggleLike } = usePlayerStore()

  const isLiked = liked.includes(track.id)

  return (
    <div className="group flex items-center gap-3 border-b border-white/7 py-3.5">
      <span className="w-5 text-center font-mono text-xs text-white/30 group-hover:text-[#d8ff3e]">
        {String(index + 1).padStart(2, '0')}
      </span>

      <button
        onClick={() => onPlay(track)}
        className="relative size-11 shrink-0 overflow-hidden rounded-md"
      >
        <Cover
          src={track?.coverUrl}
          alt={`${track.title} capa`}
          className="size-full"
        />

        <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="size-4 fill-white" />
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">
          {track.title}
        </p>

        <p className="truncate text-xs text-white/40">
          {track.artist?.name}
          <span className="px-1">·</span>
          {track.genre?.name}
        </p>
      </div>

      <span className="hidden text-xs text-white/35 sm:block">
        {track.playCount}
      </span>

      <button
        aria-label={isLiked ? 'Remover curtida' : 'Curtir música'}
        onClick={() => toggleLike(track.id)}
        className={`rounded-full p-2 transition-colors ${
          isLiked
            ? 'text-[#d8ff3e]'
            : 'text-white/25 hover:text-white'
        }`}
      >
        <Heart
          className={`size-4 ${
            isLiked ? 'fill-current' : ''
          }`}
        />
      </button>

      <span className="w-10 text-right font-mono text-xs text-white/35">
        {track.durationSec}
      </span>

      <button
        aria-label="Mais opções"
        onClick={() =>
          toast.info(`${track.title} adicionada às suas opções.`)
        }
        className="hidden rounded-full p-2 text-white/25 hover:text-white sm:block"
      >
        <MoreHorizontal className="size-4" />
      </button>
    </div>
  )
}