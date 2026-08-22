'use client'

import { useMemo, useState } from 'react'
import {
  Download,
  Heart,
  ListMusic,
  Music2,
  Play,
  Plus,
  Upload,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'

import { tracks, type Track } from '@/types/music'
import { usePlayerStore } from '@/stores/player-store'

import MusicPlayer from './music-player'
import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'
import TrackRow from './track-row'

type LibraryTab = 'Curtidas' | 'Playlists' | 'Downloads' | 'Publicadas'

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
          Tudo o que você guardou, baixou e publicou em um só lugar.
        </p>
      </div>

      <Link
        href="/tracks/upload"
        className="flex w-fit items-center gap-2 rounded-lg bg-[#d8ff3e] px-4 py-2.5 text-xs font-bold text-[#101110] transition-transform hover:scale-[1.02]"
      >
        <Upload className="size-4" />
        Publicar música
      </Link>
    </div>
  )
}

function LibraryStats() {
  const { liked } = usePlayerStore()

  const stats = [
    {
      label: 'Curtidas',
      value: liked.length,
      icon: Heart,
    },
    {
      label: 'Playlists',
      value: 4,
      icon: ListMusic,
    },
    {
      label: 'Downloads',
      value: 6,
      icon: Download,
    },
    {
      label: 'Publicadas',
      value: 6,
      icon: Music2,
    },
  ]

  return (
    <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
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
    {
      label: 'Publicadas',
      icon: Music2,
    },
  ]

  return (
    <div className="mb-8 flex gap-1 overflow-x-auto rounded-xl bg-white/5 p-1">
      {tabs.map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={() => onChange(label)}
          className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs transition-colors ${
            active === label
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

function LikedTracks({
  tracks: libraryTracks,
  onPlay,
}: {
  tracks: Track[]
  onPlay: (track: Track) => void
}) {
  const { liked } = usePlayerStore()

  const likedTracks = libraryTracks.filter((track) =>
    liked.includes(track.id),
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
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Músicas curtidas
          </h2>

          <p className="mt-1 text-xs text-white/35">
            {likedTracks.length} músicas na sua coleção
          </p>
        </div>
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

function PlaylistGrid() {
  const playlists = [
    {
      id: 'night',
      title: 'Depois da meia-noite',
      description: 'Sons para ouvir quando tudo fica quieto.',
      tracks: 24,
      cover: tracks[0]?.cover,
    },
    {
      id: 'favorites',
      title: 'Meus favoritos',
      description: 'As músicas que sempre voltam.',
      tracks: 18,
      cover: tracks[1]?.cover,
    },
    {
      id: 'late',
      title: 'Late Night',
      description: 'Para atravessar a madrugada.',
      tracks: 31,
      cover: tracks[2]?.cover,
    },
    {
      id: 'emo',
      title: 'Emo Rap',
      description: 'Dor, nostalgia e batidas.',
      tracks: 16,
      cover: tracks[3]?.cover ?? tracks[0]?.cover,
    },
  ]

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

        <button
          onClick={() => toast.success('Nova playlist criada')}
          className="flex items-center gap-2 text-xs text-white/40 hover:text-[#d8ff3e]"
        >
          <Plus className="size-4" />
          Nova playlist
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() =>
              toast.info(`${playlist.title} será aberta em breve`)
            }
            className="group text-left"
          >
            <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-white/5">
              {playlist.cover ? (
                <Cover
                  src={playlist.cover}
                  alt={`Capa da playlist ${playlist.title}`}
                  className="size-full transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <ListMusic className="size-8 text-white/20" />
                </div>
              )}

              <span className="absolute bottom-3 right-3 flex size-10 translate-y-2 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110] opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <Play className="ml-0.5 size-4 fill-current" />
              </span>
            </div>

            <h3 className="text-sm font-medium">
              {playlist.title}
            </h3>

            <p className="mt-1 text-xs text-white/35">
              {playlist.tracks} músicas
            </p>

            <p className="mt-1 truncate text-xs text-white/25">
              {playlist.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}

function DownloadsSection({
  tracks: libraryTracks,
  onPlay,
}: {
  tracks: Track[]
  onPlay: (track: Track) => void
}) {
  const downloadedTracks = libraryTracks.slice(0, 4)

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

function PublishedSection({
  tracks: libraryTracks,
  onPlay,
}: {
  tracks: Track[]
  onPlay: (track: Track) => void
}) {
  const publishedTracks = libraryTracks.slice(0, 3)

  return (
    <section>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Suas músicas
          </h2>

          <p className="mt-1 text-xs text-white/35">
            Músicas que você publicou na plataforma.
          </p>
        </div>

        <Link
          href="/tracks/upload"
          className="flex w-fit items-center gap-2 text-xs text-[#d8ff3e] hover:underline"
        >
          <Plus className="size-4" />
          Publicar outra
        </Link>
      </div>

      {publishedTracks.length > 0 ? (
        <div>
          {publishedTracks.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              onPlay={onPlay}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Music2}
          title="Você ainda não publicou músicas"
          description="Publique sua primeira música e comece a construir seu catálogo."
        />
      )}
    </section>
  )
}

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

export default function LibraryPage() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] =
    useState<LibraryTab>('Curtidas')

  const { play } = usePlayerStore()

  const filteredTracks = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()

    if (!normalizedQuery) {
      return tracks
    }

    return tracks.filter((track) =>
      `${track.title} ${track.artist} ${track.genre}`
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [query])

  const playTrack = (track: Track) => {
    play(track)
    toast.success(`Reproduzindo ${track.title}`)
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
          <LibraryHeader />

          <LibraryStats />

          <LibraryTabs
            active={activeTab}
            onChange={setActiveTab}
          />

          {query ? (
            <section>
              <div className="mb-5">
                <h2 className="text-xl font-semibold">
                  Resultados na biblioteca
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  {filteredTracks.length} músicas encontradas
                </p>
              </div>

              {filteredTracks.length > 0 ? (
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
                <EmptyState
                  icon={Music2}
                  title="Nenhuma música encontrada"
                  description="Tente pesquisar por outro artista, música ou gênero."
                />
              )}
            </section>
          ) : (
            <>
              {activeTab === 'Curtidas' && (
                <LikedTracks
                  tracks={tracks}
                  onPlay={playTrack}
                />
              )}

              {activeTab === 'Playlists' && (
                <PlaylistGrid />
              )}

              {activeTab === 'Downloads' && (
                <DownloadsSection
                  tracks={tracks}
                  onPlay={playTrack}
                />
              )}

              {activeTab === 'Publicadas' && (
                <PublishedSection
                  tracks={tracks}
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