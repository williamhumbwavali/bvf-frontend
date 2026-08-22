'use client'

import {
  ArrowLeft,
  BarChart3,
  Download,
  Heart,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { tracks } from '@/types/music'
import { usePlayerStore } from '@/stores/player-store'

type Status = 'all' | 'published' | 'draft'

export default function MyMusicPage() {
  const router = useRouter()
  const { play } = usePlayerStore()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<Status>('all')

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchesSearch =
        track.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        track.artist
          .toLowerCase()
          .includes(search.toLowerCase())

      // Por enquanto todas as músicas mockadas estão publicadas.
      // Quando o backend tiver status real, substitui esta parte.
      const matchesStatus =
        status === 'all' || status === 'published'

      return matchesSearch && matchesStatus
    })
  }, [search, status])

  const handleDelete = (id: string) => {
    toast.error(`Música ${id} marcada para exclusão.`)
  }

  return (
    <main className="min-h-screen bg-[#101110] pb-32 text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-12">

        {/* Header */}
        <div className="flex flex-col gap-6">

          {/* Voltar */}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-fit items-center gap-2 text-sm text-white/45 transition hover:text-white"
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.025]">
              <ArrowLeft className="size-4" />
            </span>

            <span>Voltar</span>
          </button>

          {/* Título */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                Biblioteca do autor
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Minhas músicas
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                Gerencie suas músicas publicadas, acompanhe o desempenho
                e edite seu catálogo.
              </p>
            </div>

            <Link
              href="/tracks/upload"
              className="flex h-11 w-fit items-center gap-2 rounded-full bg-[#d8ff3e] px-5 text-sm font-semibold text-[#101110] transition hover:scale-[1.02]"
            >
              <Plus className="size-4" />
              Publicar música
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Play className="size-4" />}
            label="Reproduções"
            value="12,4 mil"
          />

          <StatCard
            icon={<Heart className="size-4" />}
            label="Curtidas"
            value="842"
          />

          <StatCard
            icon={<Download className="size-4" />}
            label="Downloads"
            value="318"
          />

          <StatCard
            icon={<BarChart3 className="size-4" />}
            label="Músicas"
            value={String(tracks.length)}
          />
        </div>

        {/* Toolbar */}
        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar nas minhas músicas..."
              className="h-11 w-full rounded-lg border border-white/8 bg-white/[0.025] pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/15"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-white/8 bg-white/[0.025] p-1">
            <FilterButton
              active={status === 'all'}
              onClick={() => setStatus('all')}
            >
              Todas
            </FilterButton>

            <FilterButton
              active={status === 'published'}
              onClick={() => setStatus('published')}
            >
              Publicadas
            </FilterButton>

            <FilterButton
              active={status === 'draft'}
              onClick={() => setStatus('draft')}
            >
              Rascunhos
            </FilterButton>
          </div>
        </div>

        {/* Desktop */}
        <div className="mt-6 hidden overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] md:block">
          <div className="grid grid-cols-[minmax(280px,1fr)_140px_120px_120px_70px] border-b border-white/8 px-5 py-3 text-[11px] uppercase tracking-wider text-white/25">
            <span>Música</span>
            <span>Gênero</span>
            <span>Reproduções</span>
            <span>Status</span>
            <span />
          </div>

          {filteredTracks.map((track) => (
            <MusicRow
              key={track.id}
              track={track}
              onPlay={() => play(track)}
              onDelete={() => handleDelete(track.id)}
            />
          ))}

          {filteredTracks.length === 0 && <EmptyState />}
        </div>

        {/* Mobile */}
        <div className="mt-6 space-y-2 md:hidden">
          {filteredTracks.map((track) => (
            <MobileMusicCard
              key={track.id}
              track={track}
              onPlay={() => play(track)}
              onDelete={() => handleDelete(track.id)}
            />
          ))}

          {filteredTracks.length === 0 && <EmptyState />}
        </div>
      </div>
    </main>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] p-5">
      <div className="flex size-8 items-center justify-center rounded-lg bg-white/5 text-white/40">
        {icon}
      </div>

      <p className="mt-4 text-xs text-white/30">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold">
        {value}
      </p>
    </div>
  )
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-2 text-xs transition ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/35 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function MusicRow({
  track,
  onPlay,
  onDelete,
}: {
  track: (typeof tracks)[number]
  onPlay: () => void
  onDelete: () => void
}) {
  return (
    <div className="group grid grid-cols-[minmax(280px,1fr)_140px_120px_120px_70px] items-center border-b border-white/5 px-5 py-3 last:border-0 hover:bg-white/[0.025]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
          <img
            src={track.cover}
            alt=""
            className="h-full w-full object-cover"
          />

          <button
            type="button"
            onClick={onPlay}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
          >
            <Play className="size-4 fill-white" />
          </button>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {track.title}
          </p>

          <p className="mt-1 truncate text-xs text-white/35">
            {track.artist}
          </p>
        </div>
      </div>

      <span className="text-xs text-white/40">
        {track.genre}
      </span>

      <span className="text-xs text-white/40">
        {formatNumber(track.playCount ?? 0)}
      </span>

      <span>
        <span className="rounded-full bg-[#d8ff3e]/10 px-2.5 py-1 text-[10px] font-medium text-[#d8ff3e]">
          Publicada
        </span>
      </span>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md p-2 text-white/25 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  )
}

function MobileMusicCard({
  track,
  onPlay,
  onDelete,
}: {
  track: (typeof tracks)[number]
  onPlay: () => void
  onDelete: () => void
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
      <div className="flex items-center gap-3">
        <img
          src={track.cover}
          alt=""
          className="size-14 rounded-lg object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {track.title}
          </p>

          <p className="mt-1 truncate text-xs text-white/35">
            {track.artist}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] text-white/30">
              {track.genre}
            </span>

            <span className="text-[10px] text-white/20">
              •
            </span>

            <span className="text-[10px] text-white/30">
              {formatNumber(track.playCount ?? 0)} plays
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onPlay}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10"
        >
          <Play className="size-4 fill-white" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="text-white/25"
        >
          <MoreHorizontal className="size-5" />
        </button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-white/5">
        <Play className="size-5 text-white/25" />
      </div>

      <h3 className="mt-4 text-sm font-medium">
        Nenhuma música encontrada
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-white/35">
        Publique sua primeira música ou tente pesquisar por outro
        termo.
      </p>
    </div>
  )
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}