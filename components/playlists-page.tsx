'use client'

import { useState } from 'react'
import {
  ListMusic,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { homeData } from '@/types/music'
import { usePlayerStore } from '@/stores/player-store'
import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'
import MusicPlayer from './music-player'
import Link from 'next/link'

export default function PlaylistsPage() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('Playlists')
  const [playlists, setPlaylists] = useState(homeData.playlists)

  const { play } = usePlayerStore()

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.title.toLowerCase().includes(query.toLowerCase()),
  )

  const createPlaylist = () => {
    toast.success('Nova playlist criada')
  }

  const deletePlaylist = (id: string) => {
    setPlaylists((current) =>
      current.filter((playlist) => playlist.id !== id),
    )

    toast.success('Playlist removida')
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

          {filteredPlaylists.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#131513] py-24 text-center">
              <ListMusic className="mx-auto size-10 text-white/20" />

              <h2 className="mt-5 text-lg font-medium">
                Nenhuma playlist encontrada
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Crie uma playlist ou tente outra pesquisa.
              </p>
            </div>
          ) : (
            <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredPlaylists.map((playlist) => (
                <article
                  key={playlist.id}
                  className="group"
                >
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-white/5">
                    <img
                      src={playlist.cover}
                      alt={`Capa da playlist ${playlist.title}`}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                    <button
                      onClick={() =>
                        toast.success(
                          `${playlist.title} adicionada à fila`,
                        )
                      }
                      className="absolute bottom-4 right-4 flex size-11 translate-y-2 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110] opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      <Play className="ml-0.5 size-4 fill-current" />
                    </button>

                    <button
                      onClick={() => deletePlaylist(playlist.id)}
                      className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/60 text-white/60 opacity-0 backdrop-blur-sm transition-opacity hover:text-red-400 group-hover:opacity-100"
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
                        {playlist.trackCount} músicas
                        <span className="px-1">·</span>
                        {playlist.curator}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        toast.info('Opções da playlist')
                      }
                      className="shrink-0 text-white/25 hover:text-white"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}