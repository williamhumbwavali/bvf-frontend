'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Download,
  Heart,
  ListMusic,
  Music2,
  Play,
  Plus,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'

import { usePlayerStore } from '@/stores/player-store'

import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'
import TrackRow from './track-row'

import {
  Track,
  tracksService,
} from '@/services/tracks.service'

import {
  usersService,
  Like,
  DownloadHistory,
} from '@/services/users.service'
import { Playlist, playlistsService } from '@/services/playlists.service'

type LibraryTab = 'Curtidas' | 'Playlists' | 'Downloads'

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
      src={src || '/user.jpg'}
      alt={alt}
      className={`object-cover ${className}`}
    />
  )
}

/* =========================================================
   HEADER
========================================================= */

function LibraryHeader() {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8ff3e]">
          Sua coleção
        </p>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
          Biblioteca
        </h1>

        <p className="mt-2 max-w-xl text-sm text-white/45">
          Tudo o que você guardou e baixou em um só lugar.
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   STATS
========================================================= */

function LibraryStats({
  likedCount,
  downloadCount,
}: {
  likedCount: number
  downloadCount: number
}) {
  const stats = [
    {
      label: 'Curtidas',
      value: likedCount,
      icon: Heart,
    },
    {
      label: 'Playlists',
      value: 0,
      icon: ListMusic,
    },
    {
      label: 'Downloads',
      value: downloadCount,
      icon: Download,
    },
  ]

  return (
    <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="rounded-xl border border-white/8 bg-white/[0.025] p-4"
        >
          <div className="flex items-center justify-between">
            <Icon className="size-4 text-white/30" />

            <span className="font-mono text-lg text-[#d8ff3e]">
              {value}
            </span>
          </div>

          <p className="mt-4 text-xs text-white/40">
            {label}
          </p>
        </div>
      ))}
    </section>
  )
}

/* =========================================================
   TABS
========================================================= */

function LibraryTabs({
  active,
  onChange,
}: {
  active: LibraryTab
  onChange: (tab: LibraryTab) => void
}) {
  const tabs: {
    label: LibraryTab
    icon: typeof Heart
  }[] = [
      {
        label: 'Curtidas',
        icon: Heart,
      },
      {
        label: 'Playlists',
        icon: ListMusic,
      },
      {
        label: 'Downloads',
        icon: Download,
      },
    ]

  return (
    <div className="mb-8 flex gap-1 overflow-x-auto rounded-xl bg-white/5 p-1">
      {tabs.map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={() => onChange(label)}
          className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs transition-colors ${active === label
              ? 'bg-white/10 text-white'
              : 'text-white/40 hover:text-white'
            }`}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>
  )
}

/* =========================================================
   CURTIDAS
========================================================= */

function LikedTracks({
  tracks,
  likedIds,
  onPlay,
}: {
  tracks: Track[]
  likedIds: Set<string>
  onPlay: (track: Track) => void
}) {
  const likedTracks = tracks.filter((track) =>
    likedIds.has(track.id),
  )

  if (likedTracks.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Você ainda não curtiu nenhuma música"
        description="As músicas que você curtir aparecerão aqui."
      />
    )
  }

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">
          Músicas curtidas
        </h2>

        <p className="mt-1 text-xs text-white/35">
          {likedTracks.length} músicas na sua coleção
        </p>
      </div>

      <div>
        {likedTracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            index={index}
            onPlay={onPlay}
          />
        ))}
      </div>
    </section>
  )
}

/* =========================================================
   PLAYLISTS
========================================================= */

function PlaylistGrid({ playlists }: {playlists: Playlist[]}) {

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Suas playlists
          </h2>

          <p className="mt-1 text-xs text-white/35">
            Organize sua música do seu jeito.
          </p>
        </div>

        <Link
          href='/playlists/create'
          className="flex items-center gap-2 text-xs text-white/40 hover:text-[#d8ff3e]"
        >
          <Plus className="size-4" />
          Nova playlist
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() =>
              toast.info(
                `${playlist.title} será aberta em breve`,
              )
            }
            className="group text-left"
          >
            <div className="relative mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white/5">
              <ListMusic className="size-8 text-white/20" />

              <span className="absolute bottom-3 right-3 flex size-10 translate-y-2 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110] opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <Play className="ml-0.5 size-4 fill-current" />
              </span>
            </div>

            <h3 className="text-sm font-medium">
              {playlist.title}
            </h3>

            <p className="mt-1 truncate text-xs text-white/25">
              {playlist.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}

/* =========================================================
   DOWNLOADS
========================================================= */

function DownloadsSection({
  tracks,
  downloadIds,
  onPlay,
}: {
  tracks: Track[]
  downloadIds: Set<string>
  onPlay: (track: Track) => void
}) {
  const downloadedTracks = tracks.filter((track) =>
    downloadIds.has(track.id),
  )

  if (downloadedTracks.length === 0) {
    return (
      <EmptyState
        icon={Download}
        title="Nenhum download"
        description="As músicas que você baixar aparecerão aqui."
      />
    )
  }

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">
          Downloads
        </h2>

        <p className="mt-1 text-xs text-white/35">
          Músicas disponíveis para ouvir offline.
        </p>
      </div>

      <div>
        {downloadedTracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            index={index}
            onPlay={onPlay}
          />
        ))}
      </div>
    </section>
  )
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Heart
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-white/5">
        <Icon className="size-5 text-white/25" />
      </div>

      <h3 className="text-base font-medium">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-white/35">
        {description}
      </p>
    </div>
  )
}

/* =========================================================
   LIBRARY PAGE
========================================================= */

export default function LibraryPage() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] =
    useState<LibraryTab>('Curtidas')

  const [tracks, setTracks] = useState<Track[]>([])
  const [likedIds, setLikedIds] = useState<Set<string>>(
    new Set(),
  )
  const [downloadIds, setDownloadIds] =
    useState<Set<string>>(new Set())
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  const [loading, setLoading] = useState(true)

  const { play } = usePlayerStore()

  /* =======================================================
     CARREGAR DADOS
  ======================================================= */

  useEffect(() => {
    async function loadLibrary() {
      try {
        setLoading(true)

        const [
          tracksResponse,
          likedResponse,
          downloadsResponse,
          playlistsResponse
        ] = await Promise.all([
          tracksService.list(1, 100),
          usersService.getLikedTracks(),
          usersService.getDownloads(),
          playlistsService.list(),
        ])

        const playlists = playlistsResponse.data

        /*
         * tracksService.list()
         *
         * response:
         * {
         *   data: {
         *     data: Track[],
         *     meta: {...}
         *   }
         * }
         */

        setTracks(tracksResponse.data.data)

        /*
         * Curtidas:
         *
         * [
         *   {
         *     id,
         *     userId,
         *     trackId,
         *     createdAt
         *   }
         * ]
         */

        const likedSet = new Set(
          likedResponse.data.map(
            (like: Like) => like.trackId,
          ),
        )

        setLikedIds(likedSet)

        /*
         * Downloads:
         *
         * [
         *   {
         *     id,
         *     userId,
         *     trackId,
         *     downloadedAt
         *   }
         * ]
         */

        const downloadSet = new Set(
          downloadsResponse.data.map(
            (download: DownloadHistory) =>
              download.trackId,
          ),
        )

        setDownloadIds(downloadSet)
      } catch (error) {
        console.error(
          'Erro ao carregar biblioteca:',
          error,
        )

        toast.error(
          'Não foi possível carregar sua biblioteca.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadLibrary()
  }, [])

  /* =======================================================
     PESQUISA
  ======================================================= */

  const filteredTracks = useMemo(() => {
    const normalizedQuery = query
      .toLowerCase()
      .trim()

    if (!normalizedQuery) {
      return tracks
    }

    return tracks.filter((track) => {
      const searchableText = `
        ${track.title}
        ${track.artist?.name ?? ''}
        ${track.genre?.name ?? ''}
      `.toLowerCase()

      return searchableText.includes(normalizedQuery)
    })
  }, [tracks, query])

  /* =======================================================
     PLAY
  ======================================================= */

  const playTrack = (track: Track) => {
    play(track)

    toast.success(
      `Reproduzindo ${track.title}`,
    )
  }

  /* =======================================================
     SIDEBAR
  ======================================================= */

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

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0d0c] text-white">
        <MusicSidebar
          active="Biblioteca"
          onSelect={handleSidebarSelect}
        />

        <main className="min-h-screen pb-24 lg:pl-60">
          <MusicHeader
            query={query}
            setQuery={setQuery}
          />

          <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-9 md:py-10">
            <LibraryHeader />

            <div className="space-y-4">
              <div className="h-24 animate-pulse rounded-xl bg-white/5" />

              <div className="h-12 animate-pulse rounded-xl bg-white/5" />

              <div className="h-20 animate-pulse rounded-xl bg-white/5" />

              <div className="h-20 animate-pulse rounded-xl bg-white/5" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
      <MusicSidebar
        active="Biblioteca"
        onSelect={handleSidebarSelect}
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
          <LibraryHeader />

          <LibraryStats
            likedCount={likedIds.size}
            downloadCount={downloadIds.size}
          />

          <LibraryTabs
            active={activeTab}
            onChange={setActiveTab}
          />

          {/* =================================================
              PESQUISA
          ================================================= */}

          {query ? (
            <section>
              <div className="mb-5">
                <h2 className="text-xl font-semibold">
                  Resultados na biblioteca
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  {filteredTracks.length}{' '}
                  músicas encontradas
                </p>
              </div>

              {filteredTracks.length > 0 ? (
                <div>
                  {filteredTracks.map(
                    (track, index) => (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={index}
                        onPlay={playTrack}
                      />
                    ),
                  )}
                </div>
              ) : (
                <EmptyState
                  icon={Music2}
                  title="Nenhuma música encontrada"
                  description="Tente pesquisar por outro artista, música ou gênero."
                />
              )}
            </section>
          ) : (
            <>
              {/* =================================================
                  CURTIDAS
              ================================================= */}

              {activeTab === 'Curtidas' && (
                <LikedTracks
                  tracks={tracks}
                  likedIds={likedIds}
                  onPlay={playTrack}
                />
              )}

              {/* =================================================
                  PLAYLISTS
              ================================================= */}

              {activeTab === 'Playlists' && (
                <PlaylistGrid playlists={playlists} />
              )}

              {/* =================================================
                  DOWNLOADS
              ================================================= */}

              {activeTab === 'Downloads' && (
                <DownloadsSection
                  tracks={tracks}
                  downloadIds={downloadIds}
                  onPlay={playTrack}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}