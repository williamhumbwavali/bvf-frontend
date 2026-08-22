'use client'

import { useMemo, useState } from 'react'
import {
  Clock3,
  History,
  Play,
  Trash2,
  TrendingUp,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { tracks, type Track } from '@/types/music'
import { usePlayerStore } from '@/stores/player-store'
import MusicPlayer from './music-player'
import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'
import TrackRow from './track-row'

const historyTracks = [
  tracks[0],
  tracks[2],
  tracks[4],
  tracks[1],
  tracks[5],
  tracks[3],
].filter(Boolean)

function HistoryHeader() {
  return (
    <div className="mb-8">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8ff3e]">
        Seu histórico
      </p>

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
            O que você ouviu
          </h1>

          <p className="mt-2 text-sm text-white/45">
            Volte para as músicas que fizeram parte das suas últimas sessões.
          </p>
        </div>

        <button
          onClick={() => toast.info('Histórico limpo.')}
          className="flex w-fit items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs text-white/55 transition-colors hover:border-white/20 hover:text-white"
        >
          <Trash2 className="size-4" />
          Limpar histórico
        </button>
      </div>
    </div>
  )
}

function HistoryStats() {
  return (
    <section className="mb-10 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-[#131513] p-5">
        <div className="mb-5 flex size-9 items-center justify-center rounded-full bg-[#d8ff3e]/10 text-[#d8ff3e]">
          <History className="size-4" />
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          Reproduções
        </p>

        <p className="mt-1 text-2xl font-semibold">
          128
        </p>

        <p className="mt-1 text-xs text-white/35">
          nos últimos 30 dias
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#131513] p-5">
        <div className="mb-5 flex size-9 items-center justify-center rounded-full bg-[#d8ff3e]/10 text-[#d8ff3e]">
          <Clock3 className="size-4" />
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          Tempo ouvido
        </p>

        <p className="mt-1 text-2xl font-semibold">
          18h 42min
        </p>

        <p className="mt-1 text-xs text-white/35">
          tempo total de reprodução
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#131513] p-5">
        <div className="mb-5 flex size-9 items-center justify-center rounded-full bg-[#d8ff3e]/10 text-[#d8ff3e]">
          <TrendingUp className="size-4" />
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          Mais ouvido
        </p>

        <p className="mt-1 truncate text-2xl font-semibold">
          {historyTracks[0]?.title ?? '—'}
        </p>

        <p className="mt-1 truncate text-xs text-white/35">
          {historyTracks[0]?.artist ?? '—'}
        </p>
      </div>
    </section>
  )
}

function HistoryList({
  tracks,
  onPlay,
}: {
  tracks: Track[]
  onPlay: (track: Track) => void
}) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            Histórico de reprodução
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Recentemente ouvidas
          </h2>
        </div>

        <span className="text-xs text-white/35">
          {tracks.length} músicas
        </span>
      </div>

      <div>
        {tracks.length > 0 ? (
          tracks.map((track, index) => (
            <div key={`${track.id}-${index}`} className="group">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <TrackRow
                    track={track}
                    index={index}
                    onPlay={onPlay}
                  />
                </div>

                <span className="hidden shrink-0 text-xs text-white/25 md:block">
                  {index === 0
                    ? 'Agora'
                    : index === 1
                      ? 'Há 2h'
                      : index === 2
                        ? 'Ontem'
                        : `${index} dias`}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#131513] py-20 text-center">
            <History className="mx-auto size-8 text-white/20" />

            <p className="mt-4 text-lg font-medium">
              Seu histórico está vazio
            </p>

            <p className="mt-2 text-sm text-white/40">
              As músicas que você ouvir aparecerão aqui.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function MostPlayed() {
  return (
    <section className="mt-12">
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          Seus favoritos recentes
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight">
          Você voltou bastante para estas
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {historyTracks.slice(0, 4).map((track, index) => (
          <div
            key={track.id}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#131513] p-3"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/5 font-mono text-[10px] text-white/40">
              0{index + 1}
            </div>

            <img
              src={track.cover}
              alt={`Capa de ${track.title}`}
              className="size-11 shrink-0 rounded-md object-cover"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {track.title}
              </p>

              <p className="mt-1 truncate text-xs text-white/40">
                {track.artist}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function MusicHistory() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('Histórico')

  const { play } = usePlayerStore()

  const results = useMemo(() => {
    if (!query.trim()) return historyTracks

    return historyTracks.filter((track) =>
      `${track.title} ${track.artist} ${track.genre}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
  }, [query])

  const playTrack = (track: Track) => {
    play(track)
    toast.success(`Reproduzindo ${track.title}`)
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
          <HistoryHeader />

          <HistoryStats />

          <HistoryList
            tracks={results}
            onPlay={playTrack}
          />

          {!query && <MostPlayed />}
        </div>
      </main>
    </div>
  )
}