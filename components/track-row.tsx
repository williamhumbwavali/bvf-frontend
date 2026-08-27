'use client'

import {
  Check,
  Heart,
  ListMusic,
  MoreHorizontal,
  Play,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatTime } from './music-player'

import {
  Track,
} from '@/services/tracks.service'

import {
  playlistsService,
  type Playlist,
} from '@/services/playlists.service'

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
      src={src || '/images/default-cover.jpg'}
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

  const { liked, toggleLike } =
    usePlayerStore()

  const [menuOpen, setMenuOpen] =
    useState(false)

  const [playlistOpen, setPlaylistOpen] =
    useState(false)

  const [playlists, setPlaylists] =
    useState<Playlist[]>([])

  const [loadingPlaylists, setLoadingPlaylists] =
    useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  const isLiked = liked.includes(track.id)

  const handleOpenTrack = () => {
    router.push(`/music/${track.id}`)
  }

  const handleOpenArtist = () => {
    if (!track.artist?.handle) {
      return
    }

    router.push(
      `/artist/${track.artist.handle}`,
    )

    setMenuOpen(false)
  }

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/music/${track.id}`

      await navigator.clipboard.writeText(url)

      toast.success('Link da música copiado.')

      setMenuOpen(false)
    } catch {
      toast.error(
        'Não foi possível copiar o link.',
      )
    }
  }

  const loadPlaylists = async () => {
    if (playlists.length > 0) {
      setPlaylistOpen(true)
      return
    }

    setLoadingPlaylists(true)

    try {
      const response =
        await playlistsService.list()

      setPlaylists(response.data)

      setPlaylistOpen(true)
    } catch (error) {
      console.error(
        'Erro ao carregar playlists:',
        error,
      )

      toast.error(
        'Não foi possível carregar suas playlists.',
      )
    } finally {
      setLoadingPlaylists(false)
    }
  }

  const handleAddToPlaylist = async (
    playlist: Playlist,
  ) => {
    /*
     * Ainda não estamos enviando para a API.
     *
     * Aqui futuramente vamos chamar algo como:
     *
     * await playlistsService.addTrack(
     *   playlist.id,
     *   track.id,
     * )
     */

    toast.success(
      `"${track.title}" adicionada à playlist "${playlist.title}".`,
    )

    setPlaylistOpen(false)
    setMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setMenuOpen(false)
        setPlaylistOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener(
        'mousedown',
        handleClickOutside,
      )
    }

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [menuOpen])

  return (
    <div className="group flex items-center gap-3 border-b border-white/7 py-3.5">
      {/* Número */}
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

      {/* Informações */}
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
            className="transition-colors hover:text-[#d8ff3e] hover:underline"
          >
            {track.artist?.name}
          </button>

          <span className="px-1">
            ·
          </span>

          {track.genre?.name}
        </p>
      </div>

      {/* Reproduções */}
      <span className="hidden text-xs text-white/35 sm:block">
        {track.playCount ?? 0}
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
        onClick={() =>
          toggleLike(track.id)
        }
        className={`rounded-full p-2 transition-colors ${
          isLiked
            ? 'text-[#d8ff3e]'
            : 'text-white/25 hover:text-white'
        }`}
      >
        <Heart
          className={`size-4 ${
            isLiked
              ? 'fill-current'
              : ''
          }`}
        />
      </button>

      {/* Duração */}
      <span className="w-10 text-right font-mono text-xs text-white/35">
        {formatTime(track.durationSec)}
      </span>

      {/* Mais opções */}
      <div
        ref={menuRef}
        className="relative hidden sm:block z-60"
      >
        <button
          type="button"
          aria-label="Mais opções"
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuOpen((value) => !value)
            setPlaylistOpen(false)
          }}
          className="rounded-full p-2 text-white/25 transition-colors hover:bg-white/5 hover:text-white"
        >
          <MoreHorizontal className="size-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#171917] p-1.5 shadow-2xl shadow-black/40">

            {!playlistOpen ? (
              <>
                {/* Adicionar à playlist */}
                <button
                  type="button"
                  onClick={loadPlaylists}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <ListMusic className="size-4 text-white/45" />

                  <span className="flex-1">
                    Adicionar à playlist
                  </span>

                  <span className="text-white/25">
                    →
                  </span>
                </button>

                {/* Ir para artista */}
                <button
                  type="button"
                  onClick={handleOpenArtist}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <span className="flex size-4 items-center justify-center text-[11px] font-bold text-white/45">
                    A
                  </span>

                  Ir para o artista
                </button>

                {/* Copiar link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <span className="flex size-4 items-center justify-center text-white/45">
                    ↗
                  </span>

                  Copiar link
                </button>
              </>
            ) : (
              <>
                {/* Cabeçalho playlists */}
                <div className="flex items-center gap-2 border-b border-white/8 px-2 py-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPlaylistOpen(false)
                    }
                    className="text-white/40 hover:text-white"
                    aria-label="Voltar"
                  >
                    ←
                  </button>

                  <span className="text-xs font-medium text-white">
                    Adicionar à playlist
                  </span>
                </div>

                {/* Loading */}
                {loadingPlaylists && (
                  <div className="flex items-center justify-center px-3 py-8">
                    <span className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-[#d8ff3e]" />
                  </div>
                )}

                {/* Sem playlists */}
                {!loadingPlaylists &&
                  playlists.length === 0 && (
                    <div className="px-4 py-7 text-center">
                      <ListMusic className="mx-auto size-5 text-white/20" />

                      <p className="mt-3 text-xs font-medium text-white/70">
                        Nenhuma playlist
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            '/playlists/create',
                          )
                        }
                        className="mt-3 text-[11px] text-[#d8ff3e] hover:underline"
                      >
                        Criar playlist
                      </button>
                    </div>
                  )}

                {/* Playlists */}
                {!loadingPlaylists &&
                  playlists.length > 0 && (
                    <div className="max-h-64 overflow-y-auto py-1">
                      {playlists.map(
                        (playlist) => (
                          <button
                            key={playlist.id}
                            type="button"
                            onClick={() =>
                              handleAddToPlaylist(
                                playlist,
                              )
                            }
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                          >
                            {/* Capa */}
                            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/5">
                              {playlist.coverUrl ? (
                                <img
                                  src={
                                    playlist.coverUrl
                                  }
                                  alt=""
                                  className="size-full object-cover"
                                />
                              ) : (
                                <ListMusic className="size-4 text-white/20" />
                              )}
                            </div>

                            {/* Nome */}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-white/80">
                                {playlist.title}
                              </p>

                              <p className="mt-0.5 text-[10px] text-white/30">
                                {playlist.tracks
                                  ?.length ?? 0}{' '}
                                músicas
                              </p>
                            </div>

                            <Check className="size-3.5 text-transparent" />
                          </button>
                        ),
                      )}
                    </div>
                  )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}