'use client'

import {
  ArrowLeft,
  BarChart3,
  Edit3,
  Heart,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
  Track,
  tracksService,
} from '@/services/tracks.service'
import { ArtistsService } from '@/services/artists.service'
import { usePlayerStore } from '@/stores/player-store'
import PublishButton from '@/components/ui/publish-button'

type Status = 'all' | 'published' | 'draft'

export default function MyMusicPage() {
  const router = useRouter()
  const { play } = usePlayerStore()

  const [tracks, setTracks] = useState<Track[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] =
    useState<Status>('all')
  const [loading, setLoading] =
    useState(true)

  const [deletingId, setDeletingId] =
    useState<string | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false)

  const [trackToDelete, setTrackToDelete] =
    useState<Track | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadArtist() {
      try {
        setLoading(true)

        const response =
          await ArtistsService.getMe()

        if (!mounted) {
          return
        }

        const artist = response?.data

        setTracks(
          artist?.tracks ?? [],
        )
      } catch (error: any) {
        console.error(
          'Erro ao carregar artista:',
          error,
        )

        if (mounted) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            'Não foi possível carregar suas músicas.'

          if (Array.isArray(message)) {
            toast.error(
              message.join(', '),
            )
          } else {
            toast.error(message)
          }
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadArtist()

    return () => {
      mounted = false
    }
  }, [])

  const filteredTracks = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase()

    return tracks.filter((track) => {
      const title =
        track.title
          ?.toLowerCase() ?? ''

      const artist =
        track.artist?.name
          ?.toLowerCase() ?? ''

      const genre =
        typeof track.genre === 'string'
          ? track.genre
          : track.genre?.name?.toLowerCase() ?? ''

      const matchesSearch =
        !normalizedSearch ||
        title.includes(
          normalizedSearch,
        ) ||
        artist.includes(
          normalizedSearch,
        ) ||
        genre.includes(
          normalizedSearch,
        )

      /*
       * Atualmente o Track não possui
       * um campo `status`.
       *
       * Por isso, até existir esse campo
       * no backend, todas as músicas retornadas
       * são consideradas publicadas.
       */
      const matchesStatus =
        status === 'all' ||
        status === 'published'

      return (
        matchesSearch &&
        matchesStatus
      )
    })
  }, [
    tracks,
    search,
    status,
  ])

  const totalPlays = useMemo(() => {
    return tracks.reduce(
      (total, track) =>
        total +
        (track.playCount ?? 0),
      0,
    )
  }, [tracks])

  const handleDeleteClick = (
    id: string,
  ) => {
    const track =
      tracks.find(
        (item) => item.id === id,
      )

    if (!track) {
      return
    }

    setTrackToDelete(track)
    setDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    if (deletingId) {
      return
    }

    setDeleteModalOpen(false)
    setTrackToDelete(null)
  }

  const handleDelete = async () => {
    if (
      !trackToDelete ||
      deletingId
    ) {
      return
    }

    try {
      setDeletingId(
        trackToDelete.id,
      )

      await tracksService.delete(
        trackToDelete.id,
      )

      setTracks((current) =>
        current.filter(
          (item) =>
            item.id !==
            trackToDelete.id,
        ),
      )

      toast.success(
        'Música apagada com sucesso.',
      )

      setDeleteModalOpen(false)
      setTrackToDelete(null)
    } catch (error: any) {
      console.error(
        'Erro ao apagar música:',
        error,
      )

      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Não foi possível apagar a música.'

      if (Array.isArray(message)) {
        toast.error(
          message.join(', '),
        )
      } else {
        toast.error(message)
      }
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (
    id: string,
  ) => {
    router.push(
      `/tracks/${id}/edit`,
    )
  }

  return (
    <main className="min-h-screen bg-[#101110] pb-32 text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col gap-6">
          {/* Voltar */}
          <button
            type="button"
            onClick={() => router.push('/settings')}
            className="flex w-fit items-center gap-2 text-sm text-white/45 transition hover:text-white"
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.025]">
              <ArrowLeft className="size-4" />
            </span>

            <span>
              Voltar
            </span>
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
                Gerencie suas músicas publicadas,
                acompanhe o desempenho e edite seu
                catálogo.
              </p>
            </div>

           <PublishButton />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-2 sm:grid-cols-1 lg:grid-cols-2">
          <StatCard
            icon={
              <Play className="size-4" />
            }
            label="Reproduções"
            value={formatNumber(
              totalPlays,
            )}
          />

          <StatCard
            icon={
              <BarChart3 className="size-4" />
            }
            label="Músicas"
            value={String(
              tracks.length,
            )}
          />
        </div>

        {/* Toolbar */}
        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Pesquisar nas minhas músicas..."
              className="h-11 w-full rounded-lg border border-white/8 bg-white/[0.025] pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/15"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-white/8 bg-white/[0.025] p-1">
            <FilterButton
              active={
                status === 'all'
              }
              onClick={() =>
                setStatus('all')
              }
            >
              Todas
            </FilterButton>

            <FilterButton
              active={
                status === 'published'
              }
              onClick={() =>
                setStatus('published')
              }
            >
              Publicadas
            </FilterButton>

            <FilterButton
              active={
                status === 'draft'
              }
              onClick={() =>
                setStatus('draft')
              }
            >
              Rascunhos
            </FilterButton>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <LoadingState />
        )}

        {/* Desktop */}
        {!loading && (
          <div className="mt-6 hidden overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] md:block">
            <div className="grid grid-cols-[minmax(280px,1fr)_140px_120px_120px_100px] border-b border-white/8 px-5 py-3 text-[11px] uppercase tracking-wider text-white/25">
              <span>
                Música
              </span>

              <span>
                Gênero
              </span>

              <span>
                Reproduções
              </span>

              <span>
                Status
              </span>

              <span />
            </div>

            {filteredTracks.map(
              (track) => (
                <MusicRow
                  key={track.id}
                  track={track}
                  deleting={
                    deletingId ===
                    track.id
                  }
                  onPlay={() =>
                    play(
                      track as any,
                    )
                  }
                  onEdit={() =>
                    handleEdit(
                      track.id,
                    )
                  }
                  onDelete={() =>
                    handleDeleteClick(
                      track.id,
                    )
                  }
                />
              ),
            )}

            {filteredTracks.length ===
              0 && (
              <EmptyState />
            )}
          </div>
        )}

        {/* Mobile */}
        {!loading && (
          <div className="mt-6 space-y-2 md:hidden">
            {filteredTracks.map(
              (track) => (
                <MobileMusicCard
                  key={track.id}
                  track={track}
                  deleting={
                    deletingId ===
                    track.id
                  }
                  onPlay={() =>
                    play(
                      track as any,
                    )
                  }
                  onEdit={() =>
                    handleEdit(
                      track.id,
                    )
                  }
                  onDelete={() =>
                    handleDeleteClick(
                      track.id,
                    )
                  }
                />
              ),
            )}

            {filteredTracks.length ===
              0 && (
              <EmptyState />
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModalOpen &&
        trackToDelete && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (
                event.target ===
                  event.currentTarget &&
                !deletingId
              ) {
                handleCloseDeleteModal()
              }
            }}
          >
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#171917] shadow-2xl shadow-black/50">
              {/* Modal content */}
              <div className="p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-red-500/10">
                  <Trash2 className="size-5 text-red-400" />
                </div>

                <h2 className="mt-5 text-lg font-semibold text-white">
                  Apagar música?
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Você está prestes a apagar{' '}
                  <span className="font-medium text-white/80">
                    "{trackToDelete.title}"
                  </span>
                  .
                </p>

                <p className="mt-1 text-sm leading-6 text-white/30">
                  Esta ação não pode ser
                  desfeita.
                </p>
              </div>

              {/* Modal actions */}
              <div className="flex items-center justify-end gap-2 border-t border-white/8 bg-white/[0.015] px-5 py-4">
                <button
                  type="button"
                  onClick={
                    handleCloseDeleteModal
                  }
                  disabled={
                    Boolean(
                      deletingId,
                    )
                  }
                  className="rounded-lg px-4 py-2.5 text-sm text-white/45 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={
                    Boolean(
                      deletingId,
                    )
                  }
                  className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/15 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deletingId ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-red-400/20 border-t-red-400" />
                      Apagando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-4" />
                      Apagar música
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
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
  deleting,
  onPlay,
  onEdit,
  onDelete,
}: {
  track: Track
  deleting: boolean
  onPlay: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const genre =
    typeof track.genre === 'string'
      ? track.genre
      : track.genre?.name ?? '—'

  return (
    <div className="group grid grid-cols-[minmax(280px,1fr)_140px_120px_120px_100px] items-center border-b border-white/5 px-5 py-3 last:border-0 hover:bg-white/[0.025]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/20">
              <Play className="size-4" />
            </div>
          )}

          <button
            type="button"
            onClick={onPlay}
            disabled={deleting}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100 disabled:cursor-not-allowed"
          >
            <Play className="size-4 fill-white" />
          </button>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {track.title}
          </p>

          <p className="mt-1 truncate text-xs text-white/35">
            {track.artist?.name ??
              'Artista'}
          </p>
        </div>
      </div>

      <span className="truncate text-xs text-white/40">
        {genre}
      </span>

      <span className="text-xs text-white/40">
        {formatNumber(
          track.playCount ?? 0,
        )}
      </span>

      <span>
        <span className="rounded-full bg-[#d8ff3e]/10 px-2.5 py-1 text-[10px] font-medium text-[#d8ff3e]">
          Publicada
        </span>
      </span>

      <div className="flex justify-end gap-1">
        <button
          type="button"
          onClick={onEdit}
          disabled={deleting}
          title="Editar música"
          className="rounded-md p-2 text-white/25 transition hover:bg-white/5 hover:text-white disabled:opacity-30"
        >
          <Edit3 className="size-4" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          title="Apagar música"
          className="rounded-md p-2 text-white/25 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
        >
          {deleting ? (
            <span className="block size-4 animate-spin rounded-full border-2 border-white/10 border-t-red-400" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </button>
      </div>
    </div>
  )
}

function MobileMusicCard({
  track,
  deleting,
  onPlay,
  onEdit,
  onDelete,
}: {
  track: Track
  deleting: boolean
  onPlay: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const genre =
    typeof track.genre === 'string'
      ? track.genre
      : track.genre?.name ?? '—'

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
      <div className="flex items-center gap-3">
        {track.coverUrl ? (
          <img
            src={track.coverUrl}
            alt=""
            className="size-14 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/20">
            <Play className="size-4" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {track.title}
          </p>

          <p className="mt-1 truncate text-xs text-white/35">
            {track.artist?.name ??
              'Artista'}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="truncate text-[10px] text-white/30">
              {genre}
            </span>

            <span className="text-[10px] text-white/20">
              •
            </span>

            <span className="text-[10px] text-white/30">
              {formatNumber(
                track.playCount ?? 0,
              )}{' '}
              plays
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onPlay}
          disabled={deleting}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 disabled:opacity-30"
        >
          <Play className="size-4 fill-white" />
        </button>

        <button
          type="button"
          onClick={onEdit}
          disabled={deleting}
          title="Editar"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/35 hover:bg-white/5 hover:text-white disabled:opacity-30"
        >
          <Edit3 className="size-4" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          title="Apagar"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/25 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
        >
          {deleting ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white/10 border-t-red-400" />
          ) : (
            <MoreHorizontal className="size-5" />
          )}
        </button>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-[#d8ff3e]" />

        <p className="mt-4 text-sm text-white/40">
          Carregando suas músicas...
        </p>
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
        Publique sua primeira música ou
        tente pesquisar por outro termo.
      </p>
    </div>
  )
}

function formatNumber(
  value: number,
) {
  return new Intl.NumberFormat(
    'pt-BR',
    {
      notation: 'compact',
      maximumFractionDigits: 1,
    },
  ).format(value)
}