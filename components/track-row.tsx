'use client'

import { Heart, MoreHorizontal, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
  src: string | undefined
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
  const router = useRouter()
  const { liked, toggleLike } = usePlayerStore()

  const isLiked = liked.includes(track.id)

  const handleOpenTrack = () => {
    router.push(`/music/${track.id}`)
  }

  const handleOpenArtist = () => {
    router.push(`/artist/${track.artist?.handle}`)
  }

  return (
    <div className="group flex items-center gap-3 border-b border-white/7 py-3.5">
      <span className="w-5 text-center font-mono text-xs text-white/30 group-hover:text-[#d8ff3e]">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Reproduzir */}
      <button
        type="button"
        onClick={() => onPlay(track)}
        className="relative size-11 shrink-0 overflow-hidden rounded-md"
        aria-label={`Reproduzir ${track.title}`}
      >
        <Cover
          src={track.coverUrl}
          alt={`${track.title} capa`}
          className="size-full"
        />

        <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="size-4 fill-white" />
        </span>
      </button>

      {/* Informações da música */}
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={handleOpenTrack}
          className="block max-w-full truncate text-left text-sm font-medium text-white transition-colors hover:text-[#d8ff3e] hover:underline"
        >
          {track.title}
        </button>

        <p className="truncate text-xs text-white/40">
          <button
            type="button"
            onClick={handleOpenArtist}
            className='transition-colors hover:text-[#d8ff3e] hover:underline'
          >
            {track.artist?.name}
          </button>
          <span className="px-1">·</span>
          {track.genre?.name}
        </p>
      </div>

      {/* Reproduções */}
      <span className="hidden text-xs text-white/35 sm:block">
        {track.playCount}
      </span>

      {/* Like */}
      <button
        type="button"
        aria-label={
          isLiked
            ? 'Remover curtida'
            : 'Curtir música'
        }
        aria-pressed={isLiked}
        onClick={() => toggleLike(track.id)}
        className={`rounded-full p-2 transition-colors ${isLiked
            ? 'text-[#d8ff3e]'
            : 'text-white/25 hover:text-white'
          }`}
      >
        <Heart
          className={`size-4 ${isLiked ? 'fill-current' : ''
            }`}
        />
      </button>

      {/* Duração */}
      <span className="w-10 text-right font-mono text-xs text-white/35">
        {track.durationSec}
      </span>

      {/* Mais opções */}
      <button
        type="button"
        aria-label="Mais opções"
        onClick={() =>
          toast.info(
            `${track.title} adicionada às suas opções.`,
          )
        }
        className="hidden rounded-full p-2 text-white/25 hover:text-white sm:block"
      >
        <MoreHorizontal className="size-4" />
      </button>
    </div>
  )
}