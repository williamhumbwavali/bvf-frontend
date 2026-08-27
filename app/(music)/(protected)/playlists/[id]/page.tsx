'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ListMusic,
  Play,
  Share2,
} from 'lucide-react'
import { toast } from 'sonner'

import {
  tracksService,
  type Track,
} from '@/services/tracks.service'

import {
  playlistsService,
  type Playlist,
} from '@/services/playlists.service'

import { usePlayerStore } from '@/stores/player-store'

import TrackRow from '@/components/track-row'
import MusicPlayer from '@/components/music-player'
import MusicSidebar from '@/components/music-sidebar'
import MusicHeader from '@/components/music-header'

function Cover({
  src,
  alt,
  className = '',
}: {
  src?: string | null
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

function PlaylistHeroSkeleton() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#151815]">
      <div className="absolute inset-0">
        <div className="size-full bg-white/[0.02]" />
      </div>

      <div className="relative flex flex-col gap-7 p-6 md:flex-row md:items-end md:p-8">
        <div className="mx-auto aspect-square w-52 shrink-0 animate-pulse rounded-xl bg-white/10 md:mx-0 md:w-64" />

        <div className="min-w-0 flex-1">
          <div className="h-3 w-20 animate-pulse rounded bg-white/10" />

          <div className="mt-3 h-12 w-2/3 animate-pulse rounded bg-white/10 md:h-16" />

          <div className="mt-5 h-4 w-1/3 animate-pulse rounded bg-white/10" />

          <div className="mt-7 flex items-center gap-3">
            <div className="size-11 animate-pulse rounded-full bg-white/10" />

            <div className="size-11 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  )
}

function PlaylistTracksSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="flex h-16 items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4"
        >
          <div className="size-4 animate-pulse rounded bg-white/10" />

          <div className="size-10 shrink-0 animate-pulse rounded-lg bg-white/10" />

          <div className="min-w-0 flex-1">
            <div className="h-3 w-1/3 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-2.5 w-1/5 animate-pulse rounded bg-white/5" />
          </div>

          <div className="h-3 w-10 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  )
}

function PlaylistHero({
  playlist,
  onPlay,
}: {
  playlist: Playlist
  onPlay: () => void
}) {
  const [isCopied, setIsCopied] = useState(false)

  const trackCount = playlist.tracks?.length ?? 0

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href,
      )

      setIsCopied(true)

      toast.success(
        'Link da playlist copiado',
      )

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch {
      toast.error(
        'Não foi possível copiar o link.',
      )
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#151815]">
      <div className="absolute inset-0">
        <Cover
          src={playlist.coverUrl}
          alt=""
          className="size-full scale-110 opacity-20 blur-3xl"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d0c] via-[#0c0d0c]/90 to-[#0c0d0c]/70" />
      </div>

      <div className="relative flex flex-col gap-7 p-6 md:flex-row md:items-end md:p-8">
        <div className="mx-auto aspect-square w-52 shrink-0 overflow-hidden rounded-xl bg-white/5 shadow-2xl md:mx-0 md:w-64">
          {playlist.coverUrl ? (
            <Cover
              src={playlist.coverUrl}
              alt={`Capa da playlist ${playlist.title}`}
              className="size-full"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-[#151815]">
              <ListMusic className="size-20 text-white/15" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d8ff3e]">
            Playlist
          </span>

          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            {playlist.title}
          </h1>

          {playlist.description && (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50">
              {playlist.description}
            </p>
          )}

          <div className="mt-5 flex items-center gap-2 text-xs text-white/40">
            <span>
              {trackCount}{' '}
              {trackCount === 1
                ? 'música'
                : 'músicas'}
            </span>
          </div>

          <div className="mt-7 flex items-center gap-3">
            <button
              type="button"
              onClick={onPlay}
              disabled={trackCount === 0}
              className="flex size-11 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Reproduzir playlist"
            >
              <Play className="ml-0.5 size-4 fill-current" />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex size-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-white/30 hover:bg-white/5"
              aria-label="Compartilhar playlist"
            >
              <Share2 className="size-4" />
            </button>

            {isCopied && (
              <span className="text-xs text-white/40">
                Link copiado
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function PlaylistTracks({
  tracks,
  onPlay,
}: {
  tracks: Track[]
  onPlay: (track: Track) => void
}) {
  if (tracks.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 py-20 text-center">
        <ListMusic className="mx-auto size-10 text-white/10" />

        <p className="mt-4 text-sm font-medium">
          Esta playlist está vazia
        </p>

        <p className="mt-2 text-xs text-white/40">
          Adicione músicas para começar a ouvir.
        </p>
      </div>
    )
  }

  return (
    <div>
      {tracks.map((track, index) => (
        <TrackRow
          key={track.id}
          track={track}
          index={index}
          onPlay={onPlay}
        />
      ))}
    </div>
  )
}

export default function PlaylistPage() {
  const params = useParams()
  const router = useRouter()

  const playlistId = params.id as string

  const [playlist, setPlaylist] =
    useState<Playlist | null>(null)

  const [loading, setLoading] = useState(true)

  const { play } = usePlayerStore()

  useEffect(() => {
    async function loadPlaylist() {
      try {
        setLoading(true)

        const response =
          await playlistsService.getById(
            playlistId,
          )

        setPlaylist(response.data)
      } catch (error) {
        console.error(
          'Erro ao carregar playlist:',
          error,
        )

        toast.error(
          'Não foi possível carregar a playlist.',
        )

        router.push('/playlists')
      } finally {
        setLoading(false)
      }
    }

    if (playlistId) {
      loadPlaylist()
    }
  }, [playlistId, router])

  const playTrack = async (track: Track) => {
    try {
      await tracksService.play(track.id)
    } catch (error) {
      console.error(
        'Erro ao registrar reprodução:',
        error,
      )
    }

    play(track)

    toast.success(
      `Reproduzindo ${track.title}`,
    )
  }

  const playPlaylist = () => {
    const tracks = playlist?.tracks

    if (!tracks?.length) {
      return
    }

    playTrack(tracks[0] as Track)
  }

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
      <MusicSidebar
        active="Playlists"
        onSelect={() => {}}
      />

      <main className="min-h-screen pb-24 lg:pl-60">
        <MusicHeader
          query=""
          setQuery={() => {}}
        />

        <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-9 md:py-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-xs text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />

            Voltar
          </button>

          {loading ? (
            <PlaylistHeroSkeleton />
          ) : playlist ? (
            <PlaylistHero
              playlist={playlist}
              onPlay={playPlaylist}
            />
          ) : null}

          <section className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Faixas
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  Músicas
                </h2>
              </div>

              {loading ? (
                <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
              ) : (
                <span className="text-xs text-white/30">
                  {playlist?.tracks?.length ?? 0}{' '}
                  músicas
                </span>
              )}
            </div>

            {loading ? (
              <PlaylistTracksSkeleton />
            ) : (
              <PlaylistTracks
                tracks={
                  (playlist?.tracks ??
                    []) as Track[]
                }
                onPlay={playTrack}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  )
}