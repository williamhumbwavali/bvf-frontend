'use client'

import { useMemo, useState } from 'react'
import {
  Heart,
  Play,
  Shuffle,
  Trash2,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { tracks, type Track } from '@/types/music'
import { usePlayerStore } from '@/stores/player-store'
import MusicPlayer from './music-player'
import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'
import TrackRow from './track-row'

function LikedHeader({
  count,
  onPlayAll,
}: {
  count: number
  onPlayAll: () => void
}) {
  return (
    <div className="mb-8">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8ff3e]">
        Sua coleção
      </p>

      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110]">
            <Heart className="size-5 fill-current" />
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
            Músicas curtidas
          </h1>

          <p className="mt-2 text-sm text-white/45">
            Todas as músicas que você decidiu guardar.
          </p>

          <p className="mt-3 font-mono text-xs text-white/30">
            {count} {count === 1 ? 'música' : 'músicas'}
          </p>
        </div>

        {count > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={onPlayAll}
              className="flex items-center gap-2 rounded-lg bg-[#d8ff3e] px-4 py-2.5 text-xs font-bold text-[#101110] transition-transform hover:scale-[1.02]"
            >
              <Play className="size-4 fill-current" />
              Reproduzir tudo
            </button>

            <button
              onClick={() => toast.success('Reprodução aleatória iniciada')}
              className="flex size-10 items-center justify-center rounded-lg border border-white/10 text-white/55 transition-colors hover:border-white/20 hover:text-white"
              aria-label="Reprodução aleatória"
            >
              <Shuffle className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function LikedStats({ likedTracks }: { likedTracks: Track[] }) {
  const genres = new Set(likedTracks.map((track) => track.genre))

  return (
    <section className="mb-10 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-[#131513] p-5">
        <div className="mb-5 flex size-9 items-center justify-center rounded-full bg-[#d8ff3e]/10 text-[#d8ff3e]">
          <Heart className="size-4 fill-current" />
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          Curtidas
        </p>

        <p className="mt-1 text-2xl font-semibold">
          {likedTracks.length}
        </p>

        <p className="mt-1 text-xs text-white/35">
          músicas na sua coleção
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#131513] p-5">
        <div className="mb-5 flex size-9 items-center justify-center rounded-full bg-[#d8ff3e]/10 text-[#d8ff3e]">
          <Play className="size-4 fill-current" />
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          Reprodução
        </p>

        <p className="mt-1 text-2xl font-semibold">
          {likedTracks.reduce(
            (total, track) => total + Number(track.plays.replace(/\D/g, '')),
            0,
          ).toLocaleString('pt-PT')}
        </p>

        <p className="mt-1 text-xs text-white/35">
          reproduções somadas
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#131513] p-5">
        <div className="mb-5 flex size-9 items-center justify-center rounded-full bg-[#d8ff3e]/10 text-[#d8ff3e]">
          <Shuffle className="size-4" />
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          Descobertas
        </p>

        <p className="mt-1 text-2xl font-semibold">
          {genres.size}
        </p>

        <p className="mt-1 text-xs text-white/35">
          gêneros diferentes
        </p>
      </div>
    </section>
  )
}

function EmptyLiked() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#131513] py-24 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-white/5">
        <Heart className="size-6 text-white/25" />
      </div>

      <h2 className="mt-5 text-lg font-medium">
        Ainda não há músicas curtidas
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/40">
        Quando encontrar uma música que você gosta, toque no coração
        para adicioná-la à sua coleção.
      </p>
    </div>
  )
}

export default function MusicLiked() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('Músicas curtidas')

  const {
    liked,
    toggleLike,
    play,
  } = usePlayerStore()

  const likedTracks = useMemo(() => {
    return tracks.filter((track) => liked.includes(track.id))
  }, [liked])

  const filteredTracks = useMemo(() => {
    if (!query.trim()) {
      return likedTracks
    }

    return likedTracks.filter((track) =>
      `${track.title} ${track.artist} ${track.genre}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
  }, [likedTracks, query])

  const playTrack = (track: Track) => {
    play(track)
    toast.success(`Reproduzindo ${track.title}`)
  }

  const playAll = () => {
    if (!likedTracks.length) return

    play(likedTracks[0])
    toast.success('Sua coleção começou a tocar')
  }

  const clearLiked = () => {
    likedTracks.forEach((track) => {
      toggleLike(track.id)
    })

    toast.success('Músicas curtidas removidas')
  }

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
      <MusicSidebar
        active={active}
        onSelect={setActive}
      />

      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: '#1b1e1b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,.1)',
          },
        }}
      />

      <main className="min-h-screen pb-24 lg:pl-60">
        <MusicHeader
          query={query}
          setQuery={setQuery}
        />

        <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-9 md:py-10">
          <LikedHeader
            count={likedTracks.length}
            onPlayAll={playAll}
          />

          {likedTracks.length > 0 && (
            <LikedStats likedTracks={likedTracks} />
          )}

          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Coleção
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  Suas músicas
                </h2>
              </div>

              {likedTracks.length > 0 && (
                <button
                  onClick={clearLiked}
                  className="flex items-center gap-2 text-xs text-white/35 transition-colors hover:text-red-400"
                >
                  <Trash2 className="size-3.5" />
                  Limpar
                </button>
              )}
            </div>

            {likedTracks.length === 0 ? (
              <EmptyLiked />
            ) : filteredTracks.length > 0 ? (
              <div>
                {filteredTracks.map((track, index) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={index}
                    onPlay={playTrack}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg font-medium">
                  Nenhuma música encontrada
                </p>

                <p className="mt-2 text-sm text-white/40">
                  Tente pesquisar outro artista, música ou gênero.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}