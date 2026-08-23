'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Clock3,
  History,
  Trash2,
  TrendingUp,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'

import { usePlayerStore } from '@/stores/player-store'

import { tracksService, type Track } from '@/services/tracks.service'
import {
  usersService,
  type PlaybackHistory,
} from '@/services/users.service'

import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'
import TrackRow from './track-row'

function HistoryHeader({
  onClear,
  clearing,
}: {
  onClear: () => void
  clearing: boolean
}) {
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
          onClick={onClear}
          disabled={clearing}
          className="flex w-fit items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs text-white/55 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="size-4" />

          {clearing ? 'Limpando...' : 'Limpar histórico'}
        </button>
      </div>
    </div>
  )
}

function HistoryStats({
  history,
  tracks,
}: {
  history: PlaybackHistory[]
  tracks: Track[]
}) {
  const mostPlayed = useMemo(() => {
    if (history.length === 0) {
      return null
    }

    const counts = new Map<string, number>()

    for (const item of history) {
      counts.set(
        item.trackId,
        (counts.get(item.trackId) ?? 0) + 1,
      )
    }

    let mostPlayedTrackId: string | null = null
    let highestCount = 0

    for (const [trackId, count] of counts.entries()) {
      if (count > highestCount) {
        highestCount = count
        mostPlayedTrackId = trackId
      }
    }

    if (!mostPlayedTrackId) {
      return null
    }

    const track = tracks.find(
      (item) => item.id === mostPlayedTrackId,
    )

    if (!track) {
      return null
    }

    return {
      track,
      count: highestCount,
    }
  }, [history, tracks])

  const totalListeningSeconds = useMemo(() => {
    return history.reduce((total, item) => {
      const track = tracks.find(
        (track) => track.id === item.trackId,
      )

      return total + (track?.durationSec ?? 0)
    }, 0)
  }, [history, tracks])

  const formatListeningTime = (seconds: number) => {
    const totalMinutes = Math.floor(seconds / 60)

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }

    return `${minutes}min`
  }

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
          {history.length}
        </p>

        <p className="mt-1 text-xs text-white/35">
          registros no histórico
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
          {formatListeningTime(totalListeningSeconds)}
        </p>

        <p className="mt-1 text-xs text-white/35">
          estimativa baseada nas faixas
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
          {mostPlayed?.track.title ?? '—'}
        </p>

        <p className="mt-1 truncate text-xs text-white/35">
          {mostPlayed
            ? `${mostPlayed.track.artist?.name ?? 'Artista'} · ${mostPlayed.count} reproduções`
            : '—'}
        </p>
      </div>
    </section>
  )
}

function formatPlayedAt(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()

  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) {
    return 'Agora'
  }

  if (diffMinutes < 60) {
    return `Há ${diffMinutes}min`
  }

  const diffHours = Math.floor(diffMinutes / 60)

  if (diffHours < 24) {
    return `Há ${diffHours}h`
  }

  const diffDays = Math.floor(diffHours / 24)

  if (diffDays === 1) {
    return 'Ontem'
  }

  if (diffDays < 7) {
    return `Há ${diffDays} dias`
  }

  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
  })
}

function HistoryList({
  items,
  onPlay,
}: {
  items: {
    history: PlaybackHistory
    track: Track
  }[]
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
          {items.length} reproduções
        </span>
      </div>

      <div>
        {items.length > 0 ? (
          items.map(({ history, track }, index) => (
            <div
              key={history.id}
              className="group"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <TrackRow
                    track={track}
                    index={index}
                    onPlay={onPlay}
                  />
                </div>

                <span className="hidden shrink-0 text-xs text-white/25 md:block">
                  {formatPlayedAt(history.playedAt)}
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

function MostPlayed({
  items,
}: {
  items: {
    history: PlaybackHistory
    track: Track
  }[]
}) {
  const mostPlayed = useMemo(() => {
    const map = new Map<
      string,
      {
        track: Track
        count: number
        lastPlayedAt: string
      }
    >()

    for (const item of items) {
      const existing = map.get(item.track.id)

      if (existing) {
        existing.count += 1

        if (
          new Date(item.history.playedAt).getTime() >
          new Date(existing.lastPlayedAt).getTime()
        ) {
          existing.lastPlayedAt = item.history.playedAt
        }
      } else {
        map.set(item.track.id, {
          track: item.track,
          count: 1,
          lastPlayedAt: item.history.playedAt,
        })
      }
    }

    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
  }, [items])

  if (mostPlayed.length === 0) {
    return null
  }

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
        {mostPlayed.map((item, index) => (
          <div
            key={item.track.id}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#131513] p-3"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/5 font-mono text-[10px] text-white/40">
              0{index + 1}
            </div>

            <img
              src={item.track.coverUrl || '/user.jpg'}
              alt={`Capa de ${item.track.title}`}
              className="size-11 shrink-0 rounded-md object-cover"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {item.track.title}
              </p>

              <p className="mt-1 truncate text-xs text-white/40">
                {item.track.artist?.name ?? 'Artista desconhecido'}
              </p>

              <p className="mt-1 text-[10px] text-white/25">
                {item.count}{' '}
                {item.count === 1
                  ? 'reprodução'
                  : 'reproduções'}
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

  const [history, setHistory] = useState<PlaybackHistory[]>([])
  const [tracks, setTracks] = useState<Track[]>([])

  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)

  const { play } = usePlayerStore()

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true)

        const [historyResponse, tracksResponse] =
          await Promise.all([
            usersService.getHistory(),
            tracksService.list(1, 100),
          ])

        setHistory(historyResponse.data)
        setTracks(tracksResponse.data.data)
      } catch (error) {
        console.error(
          'Erro ao carregar histórico:',
          error,
        )

        toast.error(
          'Não foi possível carregar o histórico.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  const historyItems = useMemo(() => {
    const trackMap = new Map(
      tracks.map((track) => [track.id, track]),
    )

    return history
      .map((historyItem) => {
        const track = trackMap.get(historyItem.trackId)

        if (!track) {
          return null
        }

        return {
          history: historyItem,
          track,
        }
      })
      .filter(
        (
          item,
        ): item is {
          history: PlaybackHistory
          track: Track
        } => item !== null,
      )
  }, [history, tracks])

  const results = useMemo(() => {
    const normalizedQuery = query
      .toLowerCase()
      .trim()

    if (!normalizedQuery) {
      return historyItems
    }

    return historyItems.filter(
      ({ track }) => {
        const searchableText = `
          ${track.title}
          ${track.artist?.name ?? ''}
          ${track.genre?.name ?? ''}
        `.toLowerCase()

        return searchableText.includes(
          normalizedQuery,
        )
      },
    )
  }, [historyItems, query])

  const playTrack = (track: Track) => {
    play(track)

    toast.success(
      `Reproduzindo ${track.title}`,
    )
  }

  const handleClearHistory = async () => {
    if (history.length === 0) {
      toast.info('Seu histórico já está vazio.')
      return
    }

    try {
      setClearing(true)

      await usersService.clearHistory()

      setHistory([])

      toast.success('Histórico limpo.')
    } catch (error) {
      console.error(
        'Erro ao limpar histórico:',
        error,
      )

      toast.error(
        'Não foi possível limpar o histórico.',
      )
    } finally {
      setClearing(false)
    }
  }

  const handleSidebarSelect = (label: string) => {
    const routes: Record<string, string> = {
      Início: '/',
      Descobrir: '/discover',
      Biblioteca: '/library',
      Histórico: '/history',
    }

    if (routes[label]) {
      window.location.href = routes[label]
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
      <MusicSidebar
        active={active}
        onSelect={(label) => {
          setActive(label)
          handleSidebarSelect(label)
        }}
      />

      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: '#1b1e1b',
            color: '#fff',
            border:
              '1px solid rgba(255,255,255,.1)',
          },
        }}
      />

      <main className="min-h-screen pb-24 lg:pl-60">
        <MusicHeader
          query={query}
          setQuery={setQuery}
        />

        <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-9 md:py-10">
          <HistoryHeader
            onClear={handleClearHistory}
            clearing={clearing}
          />

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-sm text-white/40">
                Carregando seu histórico...
              </div>
            </div>
          ) : (
            <>
              <HistoryStats
                history={history}
                tracks={tracks}
              />

              {query ? (
                <section>
                  <div className="mb-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                      Pesquisa
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      Resultados no histórico
                    </h2>

                    <p className="mt-1 text-xs text-white/35">
                      {results.length}{' '}
                      {results.length === 1
                        ? 'reprodução encontrada'
                        : 'reproduções encontradas'}
                    </p>
                  </div>

                  {results.length > 0 ? (
                    <HistoryList
                      items={results}
                      onPlay={playTrack}
                    />
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-[#131513] py-20 text-center">
                      <History className="mx-auto size-8 text-white/20" />

                      <p className="mt-4 text-lg font-medium">
                        Nenhuma reprodução encontrada
                      </p>

                      <p className="mt-2 text-sm text-white/40">
                        Tente pesquisar por outra música ou artista.
                      </p>
                    </div>
                  )}
                </section>
              ) : (
                <>
                  <HistoryList
                    items={results}
                    onPlay={playTrack}
                  />

                  <MostPlayed
                    items={historyItems}
                  />
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}