'use client'

import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Check,
  Clock3,
  Heart,
  MoreHorizontal,
  Pause,
  Play,
  Share2,
  Shuffle,
  UserPlus,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { tracks } from '@/types/music'
import { usePlayerStore } from '@/stores/player-store'

export default function ArtistPage() {
  const params = useParams()
  const router = useRouter()

  const {
    currentTrack,
    isPlaying,
    play,
    liked,
    toggleLike,
  } = usePlayerStore()

  const [following, setFollowing] = useState(false)

  /*
   * Encontra o artista a partir das músicas disponíveis.
   * Quando o backend estiver pronto, essa informação deverá
   * vir diretamente da API de artistas.
   */
  const artistName = useMemo(() => {
    const artist = tracks.find(
      (track) => track.artist.toLowerCase() === String(params.id).toLowerCase()
    )

    return artist?.artist ?? 'Artista'
  }, [params.id])

  const artistTracks = useMemo(() => {
    return tracks.filter(
      (track) =>
        track.artist.toLowerCase() === artistName.toLowerCase()
    )
  }, [artistName])

  const popularTracks = useMemo(() => {
    return [...artistTracks]
      .sort(
        (a, b) =>
          (b.playCount ?? 0) - (a.playCount ?? 0)
      )
      .slice(0, 5)
  }, [artistTracks])

  const totalPlays = artistTracks.reduce(
    (total, track) => total + (track.playCount ?? 0),
    0
  )

  const handlePlayArtist = () => {
    const firstTrack = popularTracks[0] ?? artistTracks[0]

    if (!firstTrack) {
      toast.info('Este artista ainda não possui músicas.')
      return
    }

    play(firstTrack)
  }

  const handleShuffle = () => {
    if (artistTracks.length === 0) {
      toast.info('Este artista ainda não possui músicas.')
      return
    }

    const randomIndex = Math.floor(
      Math.random() * artistTracks.length
    )

    const randomTrack = artistTracks[randomIndex]

    if (randomTrack) {
      play(randomTrack)
    }
  }

  const handleFollow = () => {
    setFollowing((value) => !value)

    toast.success(
      following
        ? `Deixaste de seguir ${artistName}`
        : `Agora estás a seguir ${artistName}`
    )
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      )

      toast.success('Link do artista copiado')
    } catch {
      toast.error('Não foi possível copiar o link')
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
              Artista
            </p>

            <h1 className="mt-1 text-sm font-medium">
              Perfil do artista
            </h1>
          </div>
        </div>
      </header>

      {/* Artist Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#242824] via-[#171917] to-[#101110]" />

          <div className="absolute -right-20 -top-40 size-[500px] rounded-full bg-[#d8ff3e]/5 blur-[120px]" />
          <div className="absolute -left-40 bottom-0 size-[400px] rounded-full bg-white/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 py-10 md:px-8 md:py-16">
          <div className="flex flex-col gap-7 md:flex-row md:items-end">
            {/* Avatar */}
            <div className="relative size-36 shrink-0 overflow-hidden rounded-full border-4 border-white/10 bg-[#1b1d1b] shadow-2xl md:size-48">
              {artistTracks[0]?.cover ? (
                <img
                  src={artistTracks[0].cover}
                  alt={`Foto de ${artistName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-5xl font-semibold text-white/20">
                    {artistName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Information */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110]">
                  <Check className="size-3 stroke-[3]" />
                </span>

                <span className="text-xs font-medium text-[#d8ff3e]">
                  Artista
                </span>
              </div>

              <h2 className="mt-3 truncate text-4xl font-semibold tracking-tight md:text-6xl">
                {artistName}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">
                Descobre as músicas publicadas por {artistName},
                acompanha os lançamentos e adiciona as tuas
                favoritas às playlists.
              </p>

              {/* Stats */}
              <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-white/40">
                <span>
                  <strong className="text-white/80">
                    {formatNumber(totalPlays)}
                  </strong>{' '}
                  reproduções
                </span>

                <span>
                  <strong className="text-white/80">
                    {artistTracks.length}
                  </strong>{' '}
                  {artistTracks.length === 1
                    ? 'música'
                    : 'músicas'}
                </span>

                <span>
                  <strong className="text-white/80">
                    0
                  </strong>{' '}
                  seguidores
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePlayArtist}
              className="flex h-11 items-center gap-2 rounded-full bg-[#d8ff3e] px-6 text-sm font-semibold text-[#101110] transition hover:scale-[1.02]"
            >
              <Play className="size-4 fill-current" />
              Reproduzir
            </button>

            <button
              type="button"
              onClick={handleShuffle}
              className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Reprodução aleatória"
            >
              <Shuffle className="size-5" />
            </button>

            <button
              type="button"
              onClick={handleFollow}
              className={`flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition ${
                following
                  ? 'border-[#d8ff3e]/30 bg-[#d8ff3e]/10 text-[#d8ff3e]'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {following ? (
                <>
                  <Check className="size-4" />
                  A seguir
                </>
              ) : (
                <>
                  <UserPlus className="size-4" />
                  Seguir
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Compartilhar artista"
            >
              <Share2 className="size-5" />
            </button>

            <button
              type="button"
              onClick={() =>
                toast.info('Mais opções do artista')
              }
              className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Mais opções"
            >
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Main */}
          <div>
            {/* Popular */}
            <section>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Mais ouvidas
                  </p>

                  <h3 className="mt-1 text-xl font-semibold">
                    Músicas populares
                  </h3>
                </div>

                <span className="text-xs text-white/30">
                  {popularTracks.length} músicas
                </span>
              </div>

              {popularTracks.length === 0 ? (
                <EmptyArtistState />
              ) : (
                <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.025]">
                  {popularTracks.map((track, index) => (
                    <ArtistTrackRow
                      key={track.id}
                      track={track}
                      index={index}
                      isCurrent={
                        currentTrack?.id === track.id
                      }
                      isPlaying={isPlaying}
                      liked={liked.includes(track.id)}
                      onPlay={() => play(track)}
                      onLike={() => toggleLike(track.id)}
                      onOpen={() =>
                        router.push(`/music/${track.id}`)
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            {/* All tracks */}
            {artistTracks.length > popularTracks.length && (
              <section className="mt-12">
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Discografia
                  </p>

                  <h3 className="mt-1 text-xl font-semibold">
                    Todas as músicas
                  </h3>
                </div>

                <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.025]">
                  {artistTracks.map((track, index) => (
                    <ArtistTrackRow
                      key={track.id}
                      track={track}
                      index={index}
                      isCurrent={
                        currentTrack?.id === track.id
                      }
                      isPlaying={isPlaying}
                      liked={liked.includes(track.id)}
                      onPlay={() => play(track)}
                      onLike={() => toggleLike(track.id)}
                      onOpen={() =>
                        router.push(`/music/${track.id}`)
                      }
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-6">
              <section>
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Artista
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
                    Sobre
                  </h3>
                </div>

                <div className="rounded-xl border border-white/8 bg-white/[0.025] p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/5">
                      {artistTracks[0]?.cover ? (
                        <img
                          src={artistTracks[0].cover}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-white/30">
                          {artistName.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {artistName}
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        Artista na plataforma
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <StatCard
                      label="Músicas"
                      value={artistTracks.length}
                    />

                    <StatCard
                      label="Reproduções"
                      value={formatNumber(totalPlays)}
                    />
                  </div>
                </div>
              </section>

              {/* Recently published */}
              <section className="mt-10">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                      Recentes
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      Publicadas recentemente
                    </h3>
                  </div>

                  <Clock3 className="size-4 text-white/25" />
                </div>

                <div className="space-y-1">
                  {[...artistTracks]
                    .slice(-4)
                    .reverse()
                    .map((track) => (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() =>
                          router.push(`/music/${track.id}`)
                        }
                        className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/5"
                      >
                        <img
                          src={track.cover}
                          alt=""
                          className="size-11 shrink-0 rounded-lg object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {track.title}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-white/35">
                            {track.genre}
                          </p>
                        </div>

                        <Play className="size-4 text-white/20 transition group-hover:text-white" />
                      </button>
                    ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

/* -------------------------------------------------------------------------- */
/* Track Row                                                                  */
/* -------------------------------------------------------------------------- */

function ArtistTrackRow({
  track,
  index,
  isCurrent,
  isPlaying,
  liked,
  onPlay,
  onLike,
  onOpen,
}: {
  track: (typeof tracks)[number]
  index: number
  isCurrent: boolean
  isPlaying: boolean
  liked: boolean
  onPlay: () => void
  onLike: () => void
  onOpen: () => void
}) {
  return (
    <div className="group flex items-center gap-3 border-b border-white/5 px-4 py-3 last:border-0 hover:bg-white/[0.025]">
      {/* Index / Play */}
      <button
        type="button"
        onClick={onPlay}
        className="flex size-8 shrink-0 items-center justify-center text-xs text-white/30"
        aria-label={`Reproduzir ${track.title}`}
      >
        {isCurrent && isPlaying ? (
          <Pause className="size-4 fill-current text-[#d8ff3e]" />
        ) : (
          <>
            <span className="group-hover:hidden">
              {String(index + 1).padStart(2, '0')}
            </span>

            <Play className="hidden size-4 fill-current text-white group-hover:block" />
          </>
        )}
      </button>

      {/* Cover */}
      <button
        type="button"
        onClick={onOpen}
        className="size-11 shrink-0 overflow-hidden rounded-lg"
      >
        <img
          src={track.cover}
          alt={`Capa de ${track.title}`}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </button>

      {/* Info */}
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 text-left"
      >
        <p
          className={`truncate text-sm font-medium ${
            isCurrent
              ? 'text-[#d8ff3e]'
              : 'text-white'
          }`}
        >
          {track.title}
        </p>

        <p className="mt-0.5 truncate text-xs text-white/35">
          {track.genre}
        </p>
      </button>

      {/* Plays */}
      <span className="hidden text-xs text-white/25 sm:block">
        {formatNumber(track.playCount ?? 0)}
      </span>

      {/* Duration */}
      <span className="hidden text-xs text-white/25 sm:block">
        {formatDuration(track.duration)}
      </span>

      {/* Like */}
      <button
        type="button"
        onClick={onLike}
        aria-label={
          liked
            ? `Remover ${track.title} dos favoritos`
            : `Curtir ${track.title}`
        }
        className={`flex size-9 items-center justify-center rounded-full transition ${
          liked
            ? 'text-[#d8ff3e]'
            : 'text-white/25 hover:bg-white/5 hover:text-white'
        }`}
      >
        <Heart
          className={`size-4 ${
            liked ? 'fill-current' : ''
          }`}
        />
      </button>

      {/* More */}
      <button
        type="button"
        onClick={() =>
          toast.info(`Opções de ${track.title}`)
        }
        className="flex size-9 items-center justify-center rounded-full text-white/20 transition hover:bg-white/5 hover:text-white"
        aria-label={`Mais opções de ${track.title}`}
      >
        <MoreHorizontal className="size-4" />
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyArtistState() {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] px-6 py-16 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-white/5">
        <Play className="size-5 text-white/25" />
      </div>

      <h4 className="mt-4 text-sm font-medium">
        Nenhuma música publicada
      </h4>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/35">
        Este artista ainda não publicou nenhuma música
        na plataforma.
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.025] p-4">
      <p className="text-xs text-white/30">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold">
        {value}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

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