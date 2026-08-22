'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  Heart,
  Pause,
  Play,
  Plus,
  Share2,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'

import { useAuth } from '@/contexts/auth-context'
import {
  tracksService,
  type Track,
} from '@/services/tracks.service'
import {
  playlistsService,
  type Playlist,
} from '@/services/playlists.service'

import { usePlayerStore } from '@/stores/player-store'

import MusicPlayer from './music-player'
import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'
import TrackRow from './track-row'

function Cover({
  src,
  alt,
  className = '',
}: {
  src?: string
  alt: string
  className?: string
}) {
  return (
    <img
      src={src || '/images/default-cover.jpg'}
      alt={alt}
      className={`object-cover ${className}`}
    />
  )
}

/*
|--------------------------------------------------------------------------
| Welcome
|--------------------------------------------------------------------------
*/

function WelcomeSection({
  userName,
}: {
  userName?: string
}) {
  const date = new Intl.DateTimeFormat('pt-PT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="mb-8 flex items-end justify-between">
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8ff3e]">
          {date}
        </p>

        <h1 className="text-balance text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
          Boa noite, {userName || 'ouvinte'}.
        </h1>

        <p className="mt-2 text-sm text-white/45">
          Veja o que está acontecendo no seu canto da internet.
        </p>
      </div>

      <Link
        href="/tracks/upload"
        className="hidden items-center gap-2 rounded-lg bg-[#d8ff3e] px-4 py-2.5 text-xs font-bold text-[#101110] transition-transform hover:scale-[1.02] sm:flex"
      >
        <Plus className="size-4" />
        Publicar
      </Link>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| Featured Track
|--------------------------------------------------------------------------
*/

function FeaturedTrack({
  track,
  onPlay,
}: {
  track?: Track
  onPlay: (track: Track) => void
}) {
  const {
    currentTrack,
    isPlaying,
    liked,
    toggleLike,
  } = usePlayerStore()

  if (!track) {
    return (
      <div className="flex min-h-[310px] items-center justify-center rounded-2xl border border-white/10 bg-[#181b18] md:min-h-[350px]">
        <div className="text-center">
          <p className="text-sm font-medium">
            Nenhuma música disponível
          </p>

          <p className="mt-2 text-xs text-white/40">
            Publique uma música para começar.
          </p>
        </div>
      </div>
    )
  }

  const isLiked = liked.includes(track.id)

  return (
    <div className="relative min-h-[310px] overflow-hidden rounded-2xl border border-white/10 bg-[#181b18] md:min-h-[350px]">
      <Cover
        src={track.coverUrl}
        alt={`Capa de ${track.title}`}
        className="absolute inset-0 size-full opacity-65"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d0c] via-[#0c0d0c]/65 to-transparent" />

      <div className="relative flex min-h-[310px] flex-col justify-end p-6 md:min-h-[350px] md:p-8">
        <span className="mb-auto w-fit rounded-full border border-[#d8ff3e]/40 bg-[#d8ff3e]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#d8ff3e]">
          Música em destaque
        </span>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
            {track.album?.title || 'Novo lançamento'}
          </p>

          <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            {track.title}
          </h2>

          <p className="mt-2 text-sm text-white/60">
            {track.artist?.name || 'Artista desconhecido'}

            {track.genre && (
              <>
                <span className="px-1">·</span>
                {track.genre.name}
              </>
            )}

            <span className="px-1">·</span>

            {track.playCount ?? 0} reproduções
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => onPlay(track)}
              className="flex size-11 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110] transition-transform hover:scale-105"
              aria-label={`Reproduzir ${track.title}`}
            >
              {isPlaying &&
                currentTrack?.id === track.id ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="ml-0.5 size-4 fill-current" />
              )}
            </button>

            <button
              onClick={() => toggleLike(track.id)}
              aria-label={`Curtir ${track.title}`}
              className={`flex size-11 items-center justify-center rounded-full border border-white/20 ${isLiked
                ? 'text-[#d8ff3e]'
                : 'text-white'
                }`}
            >
              <Heart
                className={`size-4 ${isLiked ? 'fill-current' : ''
                  }`}
              />
            </button>

            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    window.location.href,
                  )

                  toast.success('Link copiado')
                } catch {
                  toast.error(
                    'Não foi possível copiar o link.',
                  )
                }
              }}
              aria-label="Compartilhar"
              className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white"
            >
              <Share2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| Weekly Activity
|--------------------------------------------------------------------------
*/

function WeeklyActivity({
  tracks,
}: {
  tracks: Track[]
}) {
  const totalPlays = tracks.reduce(
    (total, track) =>
      total + (track.playCount ?? 0),
    0,
  )

  const values = tracks
    .slice(0, 7)
    .map((track) => track.playCount ?? 0)

  const max = Math.max(...values, 1)

  return (
    <div className="rounded-2xl border border-white/10 bg-[#131513] p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            Sua música
          </p>

          <h3 className="mt-1 text-lg font-semibold">
            Atividade de reprodução
          </h3>
        </div>

        <BarChart3 className="size-5 text-[#d8ff3e]" />
      </div>

      <div className="mt-8 flex h-40 items-end justify-between gap-2">
        {Array.from({ length: 7 }).map((_, index) => {
          const value = values[index] ?? 0

          const height =
            value > 0
              ? Math.max((value / max) * 100, 8)
              : 5

          return (
            <div
              key={index}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div
                className={`w-full max-w-8 rounded-sm ${index === 6
                  ? 'bg-[#d8ff3e]'
                  : 'bg-white/12'
                  }`}
                style={{
                  height: `${height}%`,
                }}
              />

              <span className="font-mono text-[10px] text-white/30">
                {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][index]}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
        <span className="text-xs text-white/40">
          Reproduções registradas
        </span>

        <span className="font-mono text-sm text-white">
          {totalPlays}
        </span>
      </div>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| For You
|--------------------------------------------------------------------------
*/

function ForYouSection({
  tracks,
  tab,
  setTab,
  onPlay,
}: {
  tracks: Track[]
  tab: string
  setTab: (value: string) => void
  onPlay: (track: Track) => void
}) {
  const {
    liked,
    toggleLike,
  } = usePlayerStore()

  const displayedTracks =
    tab === 'Novidades'
      ? [...tracks].sort((a, b) => {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        )
      })
      : [...tracks].sort(
        (a, b) =>
          (b.playCount ?? 0) -
          (a.playCount ?? 0),
      )

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <h2 className="text-xl font-semibold tracking-tight">
            Para você
          </h2>

          <div className="flex gap-1 rounded-lg bg-white/5 p-1">
            {['Em alta', 'Novidades'].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  className={`rounded-md px-3 py-1.5 text-xs transition-colors ${tab === item
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white'
                    }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {displayedTracks.length === 0 ? (
        <div className="rounded-xl border border-white/10 py-20 text-center">
          <p className="text-sm font-medium">
            Nenhuma música encontrada
          </p>

          <p className="mt-2 text-xs text-white/40">
            Ainda não existem músicas publicadas.
          </p>
        </div>
      ) : (
        <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayedTracks
            .slice(0, 8)
            .map((track) => {
              const isLiked = liked.includes(
                track.id,
              )

              return (
                <article
                  key={track.id}
                  className="group"
                >
                  <button
                    onClick={() => onPlay(track)}
                    className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-white/5"
                  >
                    <Cover
                      src={track.coverUrl}
                      alt={`Capa de ${track.title}`}
                      className="size-full transition-transform duration-500 group-hover:scale-105"
                    />

                    <span className="absolute bottom-3 right-3 flex size-10 translate-y-2 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110] opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100">
                      <Play className="ml-0.5 size-4 fill-current" />
                    </span>
                  </button>

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium">
                        {track.title}
                      </h3>

                      <p className="mt-1 truncate text-xs text-white/40">
                        {track.artist?.name ||
                          'Artista desconhecido'}
                      </p>
                    </div>

                    <button
                      aria-label={`Curtir ${track.title}`}
                      onClick={() =>
                        toggleLike(track.id)
                      }
                      className={`pt-0.5 ${isLiked
                        ? 'text-[#d8ff3e]'
                        : 'text-white/25 hover:text-white'
                        }`}
                    >
                      <Heart
                        className={`size-4 ${isLiked
                          ? 'fill-current'
                          : ''
                          }`}
                      />
                    </button>
                  </div>
                </article>
              )
            })}
        </div>
      )}
    </section>
  )
}

/*
|--------------------------------------------------------------------------
| Playlists
|--------------------------------------------------------------------------
*/

function NightPlaylists({
  playlists,
}: {
  playlists: Playlist[]
}) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          Suas playlists
        </h2>

        <Link
          href="/playlists"
          className="text-xs text-white/45 hover:text-[#d8ff3e]"
        >
          Ver tudo <span aria-hidden="true">→</span>
        </Link>
      </div>

      {playlists.length === 0 ? (
        <div className="rounded-xl border border-white/10 py-16 text-center">
          <p className="text-sm font-medium">
            Você ainda não tem playlists.
          </p>

          <Link
            href="/playlists/create"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#d8ff3e] px-4 py-2 text-xs font-bold text-[#101110]"
          >
            <Plus className="size-4" />
            Criar playlist
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {playlists.slice(0, 6).map(
            (playlist) => (
              <Link
                key={playlist.id}
                href={`/playlists/${playlist.id}`}
                className="group text-left"
              >
                <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-white/5">
                  <Cover
                    src={playlist.coverUrl}
                    alt={`Capa da playlist ${playlist.title}`}
                    className="size-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <p className="truncate text-sm font-medium">
                  {playlist.title}
                </p>

                <p className="mt-1 text-xs text-white/40">
                  {playlist.tracks?.length ?? 0}{' '}
                  músicas
                </p>
              </Link>
            ),
          )}
        </div>
      )}
    </section>
  )
}

/*
|--------------------------------------------------------------------------
| Recent Tracks
|--------------------------------------------------------------------------
*/

function RecentTracks({
  tracks,
  onPlay,
}: {
  tracks: Track[]
  onPlay: (track: Track) => void
}) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          Músicas recentes
        </h2>
      </div>

      {tracks.length === 0 ? (
        <p className="text-sm text-white/40">
          Nenhuma música disponível.
        </p>
      ) : (
        <div>
          {tracks.slice(0, 5).map(
            (track, index) => (
              <TrackRow
                key={track.id}
                track={track}
                index={index}
                onPlay={onPlay}
              />
            ),
          )}
        </div>
      )}
    </section>
  )
}

/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0c0d0c] text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-white/10 border-t-[#d8ff3e]" />

        <p className="text-sm text-white/40">
          Carregando seu espaço...
        </p>
      </div>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export default function MusicDashboard() {
  const {
    isLoading: authLoading,
    isAuthenticated,
    accessToken,
    user
  } = useAuth()

  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('Em alta')
  const [active, setActive] = useState('Início')

  const [tracks, setTracks] = useState<Track[]>([])
  const [playlists, setPlaylists] = useState<
    Playlist[]
  >([])

  const [loading, setLoading] = useState(true)

  const { play } = usePlayerStore()

  /*
  |--------------------------------------------------------------------------
  | Load dashboard data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)

        const [
          tracksResponse,
          playlistsResponse,
        ] = await Promise.all([
          tracksService.list(1, 50),
          playlistsService.list(),
        ])

        setTracks(tracksResponse.data.data)
        setPlaylists(playlistsResponse.data)
      } catch (error) {
        console.error(
          'Erro ao carregar dashboard:',
          error,
        )

        toast.error(
          'Não foi possível carregar os dados.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const results = useMemo(() => {
    if (!query.trim()) {
      return []
    }

    const search = query
      .trim()
      .toLowerCase()

    return tracks.filter((track) => {
      const text = `
        ${track.title}
        ${track.artist?.name ?? ''}
        ${track.genre?.name ?? ''}
        ${track.album?.title ?? ''}
      `.toLowerCase()

      return text.includes(search)
    })
  }, [tracks, query])

  /*
  |--------------------------------------------------------------------------
  | Play
  |--------------------------------------------------------------------------
  */

  const playTrack = async (track: Track) => {
    try {
      await tracksService.play(track.id)
    } catch (error) {
      console.error(
        'Erro ao registrar reprodução:',
        error,
      )

      // Não bloqueamos a reprodução
      // se o registro do play falhar.
    }

    play(track)

    toast.success(
      `Reproduzindo ${track.title}`,
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <DashboardLoading />
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  const featuredTrack = tracks[0]

  const recentTracks = [...tracks].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  )

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
          <WelcomeSection
            userName={user?.name}
          />

          {query ? (
            /*
            |--------------------------------------------------------------------------
            | Search results
            |--------------------------------------------------------------------------
            */

            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">
                  Resultados da pesquisa
                </h2>

                <span className="text-xs text-white/40">
                  {results.length} músicas
                </span>
              </div>

              <div>
                {results.length > 0 ? (
                  results.map(
                    (track, index) => (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={index}
                        onPlay={playTrack}
                      />
                    ),
                  )
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-lg font-medium">
                      Nenhuma música encontrada
                    </p>

                    <p className="mt-2 text-sm text-white/40">
                      Tente pesquisar outro
                      artista, música ou gênero.
                    </p>
                  </div>
                )}
              </div>
            </section>
          ) : (
            /*
            |--------------------------------------------------------------------------
            | Home
            |--------------------------------------------------------------------------
            */

            <>
              <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
                <FeaturedTrack
                  track={featuredTrack}
                  onPlay={playTrack}
                />

                <WeeklyActivity
                  tracks={tracks}
                />
              </section>

              <ForYouSection
                tracks={tracks}
                tab={tab}
                setTab={setTab}
                onPlay={playTrack}
              />

              <section className="mt-12 grid gap-10 xl:grid-cols-[1.15fr_0.85fr]">
                <NightPlaylists
                  playlists={playlists}
                />

                <RecentTracks
                  tracks={recentTracks}
                  onPlay={playTrack}
                />
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}