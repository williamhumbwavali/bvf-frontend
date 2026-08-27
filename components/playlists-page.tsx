'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ListMusic,
  MoreHorizontal,
  Play,
  Plus,
  Trash2,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'

import { usePlayerStore } from '@/stores/player-store'
import { playlistsService, type Playlist } from '@/services/playlists.service'

import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'

export default function PlaylistsPage() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('Playlists')

  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)

  const { play } = usePlayerStore()

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        setLoading(true)

        const response = await playlistsService.list()

        setPlaylists(response.data)
      } catch (error) {
        console.error('Erro ao carregar playlists:', error)

        toast.error('Não foi possível carregar suas playlists')
      } finally {
        setLoading(false)
      }
    }

    loadPlaylists()
  }, [])

  const filteredPlaylists = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()

    if (!normalizedQuery) {
      return playlists
    }

    return playlists.filter((playlist) =>
      `${playlist.title} ${playlist.description ?? ''}`
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [playlists, query])

  const deletePlaylist = async (id: string) => {
    try {
      await playlistsService.delete(id)

      setPlaylists((current) =>
        current.filter((playlist) => playlist.id !== id),
      )

      toast.success('Playlist removida')
    } catch (error) {
      console.error('Erro ao remover playlist:', error)

      toast.error('Não foi possível remover a playlist')
    }
  }

  const playPlaylist = async (playlist: Playlist) => {
    if (!playlist.tracks || playlist.tracks.length === 0) {
      toast.info('Esta playlist ainda não possui músicas')
      return
    }

    const firstTrack = playlist.tracks[0]

    if (!firstTrack) {
      toast.info('Esta playlist ainda não possui músicas')
      return
    }

    play(firstTrack as any)

    toast.success(`${playlist.title} começou a tocar`)
  }

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
      <MusicSidebar
        active={active}
        onSelect={setActive}
      />

      <main className="min-h-screen pb-32 lg:pl-60">
        <MusicHeader
          query={query}
          setQuery={setQuery}
        />

        <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-9 md:py-10">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8ff3e]">
                Sua música
              </p>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                Playlists
              </h1>

              <p className="mt-2 text-sm text-white/45">
                Organize suas músicas do seu jeito.
              </p>
            </div>

            <Link
              href="/playlists/create"
              className="hidden items-center gap-2 rounded-lg bg-[#d8ff3e] px-4 py-2.5 text-xs font-bold text-[#101110] transition-transform hover:scale-[1.02] sm:flex"
            >
              <Plus className="size-4" />
              Nova playlist
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse"
                >
                  <div className="mb-4 aspect-square rounded-2xl bg-white/5" />

                  <div className="h-4 w-2/3 rounded bg-white/5" />

                  <div className="mt-2 h-3 w-1/2 rounded bg-white/5" />
                </div>
              ))}
            </div>
          ) : filteredPlaylists.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#131513] py-24 text-center">
              <ListMusic className="mx-auto size-10 text-white/20" />

              <h2 className="mt-5 text-lg font-medium">
                {query
                  ? 'Nenhuma playlist encontrada'
                  : 'Você ainda não tem playlists'}
              </h2>

              <p className="mt-2 text-sm text-white/40">
                {query
                  ? 'Tente pesquisar por outro nome.'
                  : 'Crie sua primeira playlist para organizar suas músicas.'}
              </p>

              {!query && (
                <Link
                  href="/playlists/create"
                  className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-lg bg-[#d8ff3e] px-4 py-2.5 text-xs font-bold text-[#101110]"
                >
                  <Plus className="size-4" />
                  Criar playlist
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredPlaylists.map((playlist) => {
                const trackCount = playlist.tracks?.length ?? 0

                return (
                  <article
                    key={playlist.id}
                    className="group"
                  >
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-white/5">
                      {playlist.coverUrl ? (
                        <img
                          src={playlist.coverUrl}
                          alt={`Capa da playlist ${playlist.title}`}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-[#151815]">
                          <ListMusic className="size-12 text-white/15" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                      <button
                        onClick={() => playPlaylist(playlist)}
                        className="absolute bottom-4 right-4 flex size-11 translate-y-2 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110] opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100"
                        aria-label={`Reproduzir ${playlist.title}`}
                      >
                        <Play className="ml-0.5 size-4 fill-current" />
                      </button>

                      <button
                        onClick={() => deletePlaylist(playlist.id)}
                        className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/60 text-white/60 opacity-0 backdrop-blur-sm transition-opacity hover:text-red-400 group-hover:opacity-100"
                        aria-label={`Excluir ${playlist.title}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-medium">
                          {playlist.title}
                        </h2>

                        <p className="mt-1 text-xs text-white/40">
                          {trackCount}{' '}
                          {trackCount === 1 ? 'música' : 'músicas'}
                        </p>

                        {playlist.description && (
                          <p className="mt-1 truncate text-xs text-white/25">
                            {playlist.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          toast.info(
                            `Opções da playlist "${playlist.title}"`,
                          )
                        }
                        className="shrink-0 text-white/25 hover:text-white"
                        aria-label={`Opções de ${playlist.title}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}