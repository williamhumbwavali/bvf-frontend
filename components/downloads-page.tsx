'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  Download,
  HardDriveDownload,
  MoreHorizontal,
  Play,
  Trash2,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'

import { Track } from '@/services/tracks.service'
import { usePlayerStore } from '@/stores/player-store'
import { usersService } from '@/services/users.service'

import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'

export default function DownloadsPage() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('Downloads')
  const [downloads, setDownloads] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  const { play } = usePlayerStore()

  useEffect(() => {
    const loadDownloads = async () => {
      try {
        setLoading(true)

        const response = await usersService.getDownloads()

        // Aqui você precisa ter uma fonte real das tracks.
        // Caso seu endpoint de downloads passe a retornar
        // os dados completos da música, basta usar diretamente.
        console.log(response.data)

      } catch (error) {
        console.error('Erro ao carregar downloads:', error)
        toast.error('Não foi possível carregar os downloads')
      } finally {
        setLoading(false)
      }
    }

    loadDownloads()
  }, [])

  const filteredDownloads = useMemo(() => {
    return downloads.filter((track) =>
      `${track.title} ${track.artist} ${track.genre}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
  }, [downloads, query])

  const removeDownload = (id: string) => {
    setDownloads((current) =>
      current.filter((track) => track.id !== id),
    )

    toast.success('Música removida dos downloads')
  }

  const clearDownloads = () => {
    setDownloads([])
    toast.success('Downloads limpos')
  }

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
                Downloads
              </h1>

              <p className="mt-2 text-sm text-white/45">
                Suas músicas disponíveis para ouvir offline.
              </p>
            </div>

            {downloads.length > 0 && (
              <button
                onClick={clearDownloads}
                className="hidden items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs text-white/50 transition-colors hover:border-red-400/30 hover:text-red-400 sm:flex"
              >
                <Trash2 className="size-4" />
                Limpar downloads
              </button>
            )}
          </div>

          <div className="mb-6 flex items-center justify-between rounded-xl border border-white/10 bg-[#131513] px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#d8ff3e]/10 text-[#d8ff3e]">
                <HardDriveDownload className="size-5" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Modo offline
                </p>

                <p className="mt-0.5 text-xs text-white/40">
                  {downloads.length} músicas disponíveis offline
                </p>
              </div>
            </div>

            <CheckCircle2 className="size-5 text-[#d8ff3e]" />
          </div>

          {loading ? (
            <div className="py-24 text-center text-sm text-white/40">
              Carregando downloads...
            </div>
          ) : filteredDownloads.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#131513] py-24 text-center">
              <Download className="mx-auto size-10 text-white/20" />

              <h2 className="mt-5 text-lg font-medium">
                Nenhum download
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm text-white/40">
                As músicas que você baixar aparecerão aqui para
                serem reproduzidas mesmo quando estiver offline.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111311]">
              <div className="border-b border-white/8 px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Músicas baixadas
                </p>
              </div>

              <div className="px-5">
                {filteredDownloads.map((track, index) => (
                  <div
                    key={track.id}
                    className="group flex items-center gap-3 border-b border-white/7 py-3.5 last:border-0"
                  >
                    <span className="w-6 text-center font-mono text-xs text-white/25">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <button
                      onClick={() => playTrack(track)}
                      className="relative size-11 shrink-0 overflow-hidden rounded-md"
                    >
                      <img
                        src={track.coverUrl}
                        alt={`Capa de ${track.title}`}
                        className="size-full object-cover"
                      />

                      <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Play className="size-4 fill-white" />
                      </span>
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {track.title}
                      </p>

                      <p className="truncate text-xs text-white/40">
                        {track.artist?.name}
                        <span className="px-1">·</span>
                        {track.genre?.name}
                      </p>
                    </div>

                    <div className="hidden items-center gap-2 sm:flex">
                      <CheckCircle2 className="size-4 text-[#d8ff3e]" />

                      <span className="text-xs text-white/35">
                        Offline
                      </span>
                    </div>

                    <span className="hidden w-12 text-right font-mono text-xs text-white/30 sm:block">
                      {track.durationSec}
                    </span>

                    <button
                      onClick={() => removeDownload(track.id)}
                      aria-label={`Remover ${track.title} dos downloads`}
                      className="rounded-full p-2 text-white/25 transition-colors hover:text-red-400"
                    >
                      <Trash2 className="size-4" />
                    </button>

                    <button
                      onClick={() =>
                        toast.info(`Opções de ${track.title}`)
                      }
                      className="hidden rounded-full p-2 text-white/25 hover:text-white sm:block"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}