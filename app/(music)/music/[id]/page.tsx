'use client'

import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Download,
  Heart,
  ListPlus,
  MoreHorizontal,
  Pause,
  Play,
  Share2,
  Shuffle,
  UserPlus,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { tracksService, type Track } from '@/services/tracks.service'
import { usePlayerStore } from '@/stores/player-store'
import Link from 'next/link'

export default function MusicPage() {
  const params = useParams()
  const router = useRouter()

  const {
    currentTrack,
    isPlaying,
    play,
    liked,
    toggleLike,
  } = usePlayerStore()

  const [track, setTrack] = useState<Track | null>(null)
  const [relatedTracks, setRelatedTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  const trackId = Array.isArray(params.id)
    ? params.id[0]
    : params.id

  useEffect(() => {
    if (!trackId) return

    const loadTrack = async () => {
      try {
        setLoading(true)

        const response = await tracksService.getById(trackId)

        setTrack(response.data)

        // Busca músicas reais da API para a seção "Mais músicas"
        const relatedResponse = await tracksService.list(1, 6)

        const related = relatedResponse.data.data
          .filter((item) => item.id !== trackId)
          .slice(0, 5)

        setRelatedTracks(related)
      } catch (error) {
        console.error(
          'Erro ao carregar música:',
          error,
        )

        toast.error(
          'Não foi possível carregar a música.',
        )

        setTrack(null)
      } finally {
        setLoading(false)
      }
    }

    loadTrack()
  }, [trackId])

  if (loading) {
    return <MusicSkeleton />
  }

  if (!track) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#101110] text-white">
        <p className="text-lg font-medium">
          Música não encontrada
        </p>

        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          Voltar
        </button>
      </main>
    )
  }

  const isLiked = liked.includes(track.id)
  const isCurrentTrack = currentTrack?.id === track.id

  const handlePlay = () => {
    if (isCurrentTrack && isPlaying) {
      usePlayerStore.setState({
        isPlaying: false,
      })

      return
    }

    play(track)
  }

  const handleLike = async () => {
    try {
      await toggleLike(track.id)

      toast.success(
        isLiked
          ? 'Removida das músicas curtidas'
          : 'Adicionada às músicas curtidas',
      )
    } catch (error) {
      console.error(
        'Erro ao alterar curtida:',
        error,
      )

      toast.error(
        'Não foi possível alterar a curtida.',
      )
    }
  }

  const handleDownload = () => {
    if (!track.audioUrl) {
      toast.error(
        'Esta música não possui arquivo disponível para download.',
      )

      return
    }

    const link = document.createElement('a')

    link.href = track.audioUrl
    link.download = `${track.title}.mp3`
    link.target = '_blank'

    document.body.appendChild(link)
    link.click()
    link.remove()

    toast.success('Download iniciado')
  }

  const handlePlaylist = () => {
    toast.info('Adicionar à playlist')
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href,
      )

      toast.success('Link copiado')
    } catch {
      toast.error(
        'Não foi possível copiar o link',
      )
    }
  }

  return (
    <main className="min-h-screen bg-[#101110] pb-32 text-white">
      {/* Header */}

      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-5 py-5 md:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="size-5" />
          </button>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">
              Música
            </p>

            <h1 className="mt-1 text-sm font-medium">
              Detalhes da música
            </h1>
          </div>
        </div>
      </header>

      {/* Hero */}

      <section className="border-b border-white/5">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-8 md:grid-cols-[320px_1fr] md:px-8 md:py-12 lg:grid-cols-[380px_1fr]">

          {/* Cover */}

          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
            <img
              src={track.coverUrl}
              alt={`Capa de ${track.title}`}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Information */}

          <div className="flex flex-col justify-end">
            <div className="mb-5">
              <span className="inline-flex rounded-full border border-[#d8ff3e]/20 bg-[#d8ff3e]/10 px-3 py-1 text-xs font-medium text-[#d8ff3e]">
                {track.genre?.name ?? 'Sem gênero'}
              </span>
            </div>

            <h2 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              {track.title}
            </h2>

            <button
              type="button"
              className="mt-4 flex w-fit items-center gap-2 text-white/55 transition hover:text-white"
            >
              <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-white/10">
                {track.artist?.image ? (
                  <img
                    src={track.artist.image}
                    alt={track.artist.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold">
                    {track.artist?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <Link className="text-sm font-medium" href={`/artist/${track.artist?.handle}`}>
                {track.artist?.name ?? 'Artista desconhecido'}
              </Link>
            </button>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-white/45">
              Uma música publicada pelo artista na plataforma.
              Descubra, ouça, curta e adicione às suas playlists.
            </p>

            {/* Actions */}

            <div className="mt-8 flex flex-wrap items-center gap-3">

              {/* Play */}

              <button
                type="button"
                onClick={handlePlay}
                className="flex h-11 items-center gap-2 rounded-full bg-[#d8ff3e] px-6 text-sm font-semibold text-[#101110] transition hover:scale-[1.02]"
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="size-4 fill-current" />
                ) : (
                  <Play className="size-4 fill-current" />
                )}

                {isCurrentTrack && isPlaying
                  ? 'Pausar'
                  : 'Reproduzir'}
              </button>

              {/* Like */}

              <button
                type="button"
                onClick={handleLike}
                aria-label={
                  isLiked
                    ? 'Remover dos favoritos'
                    : 'Curtir música'
                }
                aria-pressed={isLiked}
                className={`flex size-11 items-center justify-center rounded-full border transition ${isLiked
                    ? 'border-[#d8ff3e]/30 bg-[#d8ff3e]/10 text-[#d8ff3e]'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Heart
                  className={`size-5 ${isLiked ? 'fill-current' : ''
                    }`}
                />
              </button>

              {/* Playlist */}

              <button
                type="button"
                onClick={handlePlaylist}
                className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <ListPlus className="size-4" />

                <span className="hidden sm:inline">
                  Adicionar à playlist
                </span>
              </button>

              {/* Download */}

              <button
                type="button"
                onClick={handleDownload}
                className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Baixar música"
              >
                <Download className="size-5" />
              </button>

              {/* Share */}

              <button
                type="button"
                onClick={handleShare}
                className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Compartilhar"
              >
                <Share2 className="size-5" />
              </button>

              {/* More */}

              <button
                type="button"
                onClick={() =>
                  toast.info('Opções da música')
                }
                className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Mais opções"
              >
                <MoreHorizontal className="size-5" />
              </button>
            </div>

            {/* Stats */}

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-xs text-white/35">
              <div>
                <span className="font-medium text-white/70">
                  {formatNumber(track.playCount ?? 0)}
                </span>{' '}
                reproduções
              </div>

              <div>
                <span className="font-medium text-white/70">
                  {track.genre?.name ?? '—'}
                </span>{' '}
                gênero
              </div>

              <div>
                <span className="font-medium text-white/70">
                  MP3
                </span>{' '}
                áudio
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}

      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-10 md:px-8 lg:grid-cols-[1fr_380px]">

        {/* Left */}

        <div>
          <section>
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                Informações
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                Sobre esta música
              </h3>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.025] p-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <InfoItem
                  label="Título"
                  value={track.title}
                />

                <InfoItem
                  label="Artista"
                  value={
                    track.artist?.name ??
                    'Artista desconhecido'
                  }
                />

                <InfoItem
                  label="Gênero"
                  value={
                    track.genre?.name ??
                    'Sem gênero'
                  }
                />

                <InfoItem
                  label="Duração"
                  value={formatDuration(
                    track.durationSec,
                  )}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right */}

        <aside>
          <div className="sticky top-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                  Descubra
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  Mais músicas
                </h3>
              </div>

              <Shuffle className="size-4 text-white/25" />
            </div>

            <div className="space-y-1">
              {relatedTracks.map((item) => {
                const isRelatedCurrent =
                  currentTrack?.id === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/music/${item.id}`,
                      )
                    }
                    className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/5"
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={item.coverUrl}
                        alt={`Capa de ${item.title}`}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
                        {isRelatedCurrent &&
                          isPlaying ? (
                          <Pause className="size-4 fill-white text-white opacity-100" />
                        ) : (
                          <Play className="size-4 scale-75 fill-white text-white opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-medium ${isRelatedCurrent
                            ? 'text-[#d8ff3e]'
                            : 'text-white'
                          }`}
                      >
                        {item.title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-white/35">
                        {item.artist?.name ??
                          'Artista desconhecido'}
                      </p>
                    </div>

                    <span className="text-xs text-white/25">
                      {formatDuration(
                        item.durationSec,
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

function InfoItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs text-white/30">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-white/80">
        {value}
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

function formatDuration(value?: number) {
  if (
    value === undefined ||
    value === null ||
    !Number.isFinite(value)
  ) {
    return '0:00'
  }

  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)

  return `${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`
}

function MusicSkeleton() {
  return (
    <main className="min-h-screen bg-[#101110] pb-32 text-white">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-5 py-5 md:px-8">
          <div className="size-10 animate-pulse rounded-full bg-white/5" />

          <div className="space-y-2">
            <div className="h-2.5 w-16 animate-pulse rounded bg-white/5" />
            <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-white/5">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-8 md:grid-cols-[320px_1fr] md:px-8 md:py-12 lg:grid-cols-[380px_1fr]">

          {/* Cover */}
          <div className="aspect-square animate-pulse rounded-2xl bg-white/5" />

          {/* Information */}
          <div className="flex flex-col justify-end">
            <div className="mb-5">
              <div className="h-6 w-24 animate-pulse rounded-full bg-white/5" />
            </div>

            <div className="h-12 w-3/4 animate-pulse rounded-lg bg-white/5 md:h-16" />

            <div className="mt-4 flex items-center gap-2">
              <div className="size-8 animate-pulse rounded-full bg-white/5" />
              <div className="h-4 w-28 animate-pulse rounded bg-white/5" />
            </div>

            <div className="mt-5 max-w-2xl space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-white/5" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-white/5" />
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <div className="h-11 w-32 animate-pulse rounded-full bg-white/5" />
              <div className="size-11 animate-pulse rounded-full bg-white/5" />
              <div className="h-11 w-40 animate-pulse rounded-full bg-white/5" />
              <div className="size-11 animate-pulse rounded-full bg-white/5" />
              <div className="size-11 animate-pulse rounded-full bg-white/5" />
              <div className="size-11 animate-pulse rounded-full bg-white/5" />
            </div>

            {/* Stats */}
            <div className="mt-8 flex gap-8">
              <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
              <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
              <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-10 md:px-8 lg:grid-cols-[1fr_380px]">

        {/* Left */}
        <div>
          <div className="mb-5 space-y-2">
            <div className="h-2.5 w-20 animate-pulse rounded bg-white/5" />
            <div className="h-6 w-40 animate-pulse rounded bg-white/5" />
          </div>

          <div className="rounded-xl border border-white/8 bg-white/[0.025] p-5">
            <div className="grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
                  <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <aside>
          <div className="mb-5 space-y-2">
            <div className="h-2.5 w-16 animate-pulse rounded bg-white/5" />
            <div className="h-6 w-32 animate-pulse rounded bg-white/5" />
          </div>

          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl p-2"
              >
                <div className="size-12 shrink-0 animate-pulse rounded-lg bg-white/5" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3.5 w-3/4 animate-pulse rounded bg-white/5" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
                </div>

                <div className="h-3 w-8 animate-pulse rounded bg-white/5" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}