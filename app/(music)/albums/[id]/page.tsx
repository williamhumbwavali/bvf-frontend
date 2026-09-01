'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Disc3, Play } from 'lucide-react'
import { toast } from 'sonner'
import { albumsService, type Album } from '@/services/albums.service'
import { tracksService, type Track } from '@/services/tracks.service'
import { usePlayerStore } from '@/stores/player-store'
import MusicSidebar from '@/components/music-sidebar'
import MusicHeader from '@/components/music-header'
import TrackRow from '@/components/track-row'

export default function AlbumPage() {
  const params = useParams()
  const router = useRouter()
  const { play } = usePlayerStore()
  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAlbum() {
      try {
        const response = await albumsService.getById(params.id as string)
        setAlbum(response.data)
      } catch (error) {
        console.error('Erro ao carregar álbum:', error)
        toast.error('Não foi possível carregar o álbum.')
      } finally {
        setLoading(false)
      }
    }
    if (params.id) loadAlbum()
  }, [params.id])

  const playTrack = async (track: Track) => {
    try { await tracksService.play(track.id) } catch { /* reprodução local continua */ }
    play(track)
  }

  const tracks = album?.tracks ?? []

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
      <MusicSidebar active="Descobrir" onSelect={() => {}} />
      <main className="min-h-screen pb-24 lg:pl-60">
        <MusicHeader query="" setQuery={() => {}} />
        <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-9 md:py-10">
          <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-xs text-white/40 hover:text-white">
            <ArrowLeft className="size-4" /> Voltar
          </button>

          {loading ? (
            <div className="h-80 animate-pulse rounded-2xl bg-white/5" />
          ) : album ? (
            <>
              <section className="flex flex-col gap-7 rounded-2xl border border-white/10 bg-[#151815] p-6 md:flex-row md:items-end md:p-8">
                <div className="aspect-square w-52 shrink-0 overflow-hidden rounded-xl bg-white/5 shadow-2xl">
                  {album.coverUrl ? <img src={album.coverUrl} alt={`Capa do álbum ${album.title}`} className="size-full object-cover" /> : <div className="flex size-full items-center justify-center"><Disc3 className="size-16 text-white/15" /></div>}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d8ff3e]">Álbum</span>
                  <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">{album.title}</h1>
                  <p className="mt-4 text-sm text-white/50">{album.artist?.name ?? 'Artista'} {album.year ? `· ${album.year}` : ''} · {tracks.length} músicas</p>
                  <button disabled={!tracks.length} onClick={() => playTrack(tracks[0])} className="mt-7 flex size-11 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110] disabled:opacity-40" aria-label="Reproduzir álbum"><Play className="ml-0.5 size-4 fill-current" /></button>
                </div>
              </section>
              <section className="mt-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">Faixas</p>
                <h2 className="mt-1 text-xl font-semibold">Músicas</h2>
                <div className="mt-4">{tracks.map((track, index) => <TrackRow key={track.id} track={track} index={index} onPlay={playTrack} />)}</div>
              </section>
            </>
          ) : <p className="py-20 text-center text-white/40">Álbum não encontrado.</p>}
        </div>
      </main>
    </div>
  )
}
