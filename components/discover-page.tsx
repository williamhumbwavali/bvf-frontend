'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Compass,
  Flame,
  Heart,
  Play,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'

import { tracks, type Track } from '@/types/music'
import { usePlayerStore } from '@/stores/player-store'

import MusicPlayer from './music-player'
import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'
import TrackRow from './track-row'

const genres = [
  'Todos',
  'Emo Rap',
  'Hip Hop',
  'R&B',
  'Trap',
  'Lo-fi',
  'Indie',
]

function Cover({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
    />
  )
}

function DiscoverHero({
  track,
  onPlay,
}: {
  track: Track
  onPlay: (track: Track) => void
}) {
  const { currentTrack, isPlaying } = usePlayerStore()

  const playing =
    isPlaying && currentTrack?.id === track.id

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#151815]">
      <Cover
        src={track.cover}
        alt={`Capa de ${track.title}`}
        className="absolute inset-0 size-full opacity-45"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d0c] via-[#0c0d0c]/80 to-[#0c0d0c]/20" />

      <div className="relative flex min-h-[360px] flex-col justify-end p-6 md:p-9">
        <div className="mb-auto flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110]">
            <Sparkles className="size-4" />
          </span>

          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d8ff3e]">
            Descoberta da noite
          </span>
        </div>

        <div className="max-w-xl">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Talvez você goste
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            {track.title}
          </h1>

          <p className="mt-2 text-sm text-white/55">
            {track.artist}
            <span className="px-1">·</span>
            {track.genre}
            <span className="px-1">·</span>
            {track.plays} reproduções
          </p>

          <button
            onClick={() => onPlay(track)}
            className="mt-6 flex items-center gap-2 rounded-lg bg-[#d8ff3e] px-5 py-3 text-xs font-bold text-[#101110] transition-transform hover:scale-[1.02]"
          >
            {playing ? (
              <>
                <span className="flex gap-0.5">
                  <span className="h-3 w-0.5 bg-[#101110]" />
                  <span className="h-3 w-0.5 bg-[#101110]" />
                </span>
                Tocando agora
              </>
            ) : (
              <>
                <Play className="size-4 fill-current" />
                Ouvir agora
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}

function GenreNavigation({
  active,
  onChange,
}: {
  active: string
  onChange: (genre: string) => void
}) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <Compass className="size-4 text-[#d8ff3e]" />

        <h2 className="text-sm font-semibold">
          Explore por gênero
        </h2>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onChange(genre)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs transition-colors ${
              active === genre
                ? 'border-[#d8ff3e]/40 bg-[#d8ff3e] text-[#101110]'
                : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </section>
  )
}

function TrendingSection({
  tracks: discoverTracks,
  onPlay,
}: {
  tracks: Track[]
  onPlay: (track: Track) => void
}) {
  const { liked, toggleLike } = usePlayerStore()

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="size-5 text-[#d8ff3e]" />

            <h2 className="text-xl font-semibold tracking-tight">
              Em alta agora
            </h2>
          </div>

          <p className="mt-1 text-xs text-white/35">
            As músicas que estão chamando atenção.
          </p>
        </div>

        <button
          onClick={() => toast.info('Mais músicas em alta em breve')}
          className="hidden items-center gap-1 text-xs text-white/40 hover:text-[#d8ff3e] sm:flex"
        >
          Ver tudo
          <ArrowRight className="size-3" />
        </button>
      </div>

      <div>
        {discoverTracks.slice(0, 6).map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            index={index}
            onPlay={onPlay}
          />
        ))}
      </div>
    </section>
  )
}

function NewReleases({
  tracks: discoverTracks,
  onPlay,
}: {
  tracks: Track[]
  onPlay: (track: Track) => void
}) {
  const { liked, toggleLike } = usePlayerStore()

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-[#d8ff3e]" />

            <h2 className="text-xl font-semibold tracking-tight">
              Novos lançamentos
            </h2>
          </div>

          <p className="mt-1 text-xs text-white/35">
            Descubra músicas recém-publicadas por artistas.
          </p>
        </div>

        <button
          onClick={() => toast.info('Todos os lançamentos em breve')}
          className="hidden text-xs text-white/40 hover:text-[#d8ff3e] sm:block"
        >
          Ver tudo →
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {discoverTracks.slice(0, 4).map((track) => {
          const isLiked = liked.includes(track.id)

          return (
            <article
              key={track.id}
              className="group min-w-0"
            >
              <button
                onClick={() => onPlay(track)}
                className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-white/5"
              >
                <Cover
                  src={track.cover}
                  alt={`Capa de ${track.title}`}
                  className="size-full transition-transform duration-500 group-hover:scale-105"
                />

                <span className="absolute bottom-3 right-3 flex size-10 translate-y-2 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110] opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <Play className="ml-0.5 size-4 fill-current" />
                </span>
              </button>

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium">
                    {track.title}
                  </h3>

                  <p className="mt-1 truncate text-xs text-white/40">
                    {track.artist}
                  </p>

                  <p className="mt-1 text-[10px] text-white/25">
                    {track.genre}
                  </p>
                </div>

                <button
                  aria-label={`Curtir ${track.title}`}
                  onClick={() => toggleLike(track.id)}
                  className={
                    isLiked
                      ? 'pt-0.5 text-[#d8ff3e]'
                      : 'pt-0.5 text-white/25 hover:text-white'
                  }
                >
                  <Heart
                    className={`size-4 ${
                      isLiked ? 'fill-current' : ''
                    }`}
                  />
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function PopularArtists() {
  const artists = [
    {
      id: 'nox',
      name: 'Lil Peep',
      genre: 'Emo Rap',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFyqfW4o7xIlmSz2edGWH7V1Vu5VjWs0RFIV2kdat9ig&s',
    },
    {
      id: 'xxx',
      name: 'XXXTentacion',
      genre: 'hip-hop/rap',
      image:
        'https://i.scdn.co/image/ab6761610000e5ebf0c20db5ef6c6fbe5135d2e4',
    },
    {
      id: 'artist-3',
      name: 'The Weeknd',
      genre: 'R&B',
      image:
        'https://i.scdn.co/image/ab6761610000e5ebc1719ac9e6a75c1c25835018',
    },
    {
      id: 'artist-4',
      name: 'Kizua Trindade',
      genre: 'hip-hop com a cultura africana',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8bJq6bn4tF5t2IGqiJlDEHksFic6UvDjb3OBEBV0QoiNba6If1_o4tKo&s=10',
    },
  ]

  return (
    <section className="mt-12">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-5 text-[#d8ff3e]" />

          <h2 className="text-xl font-semibold tracking-tight">
            Artistas para descobrir
          </h2>
        </div>

        <p className="mt-1 text-xs text-white/35">
          Novas vozes para adicionar à sua biblioteca.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {artists.map((artist) => (
          <button
            key={artist.id}
            onClick={() =>
              toast.info(`Perfil de ${artist.name} em breve`)
            }
            className="group flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.025] p-4 text-left transition-colors hover:border-white/15 hover:bg-white/[0.05]"
          >
            <div className="size-14 shrink-0 overflow-hidden rounded-full">
              <Cover
                src={artist.image}
                alt={artist.name}
                className="size-full transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium">
                {artist.name}
              </h3>

              <p className="mt-1 text-xs text-white/35">
                {artist.genre}
              </p>
            </div>

            <ArrowRight className="ml-auto size-4 shrink-0 text-white/20 transition-colors group-hover:text-[#d8ff3e]" />
          </button>
        ))}
      </div>
    </section>
  )
}

function MoodSection({
  onPlay,
}: {
  onPlay: (track: Track) => void
}) {
  const moods = [
    {
      title: 'Depois da meia-noite',
      description: 'Sons para quando ninguém está acordado.',
      genre: 'Emo Rap',
    },
    {
      title: 'Dias cinzentos',
      description: 'Para aqueles dias em que tudo parece distante.',
      genre: 'Lo-fi',
    },
    {
      title: 'Sem dormir',
      description: 'Batidas para atravessar a madrugada.',
      genre: 'Trap',
    },
  ]

  return (
    <section className="mt-12">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">
          Encontre pelo momento
        </h2>

        <p className="mt-1 text-xs text-white/35">
          Música para cada estado de espírito.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {moods.map((mood, index) => {
          const track = tracks[index % tracks.length]

          return (
            <button
              key={mood.title}
              onClick={() => onPlay(track)}
              className="group relative min-h-[180px] overflow-hidden rounded-2xl border border-white/8 bg-[#151715] p-6 text-left"
            >
              <Cover
                src={track.cover}
                alt=""
                className="absolute inset-0 size-full opacity-20 transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d0c] via-[#0c0d0c]/70 to-transparent" />

              <div className="relative flex h-full min-h-[130px] flex-col justify-end">
                <span className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#d8ff3e]">
                  {mood.genre}
                </span>

                <h3 className="text-lg font-semibold">
                  {mood.title}
                </h3>

                <p className="mt-1 max-w-xs text-xs leading-5 text-white/40">
                  {mood.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default function DiscoverPage() {
  const [query, setQuery] = useState('')
  const [activeGenre, setActiveGenre] = useState('Todos')

  const { play } = usePlayerStore()

  const filteredTracks = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()

    return tracks.filter((track) => {
      const matchesQuery =
        !normalizedQuery ||
        `${track.title} ${track.artist} ${track.genre}`
          .toLowerCase()
          .includes(normalizedQuery)

      const matchesGenre =
        activeGenre === 'Todos' ||
        track.genre === activeGenre

      return matchesQuery && matchesGenre
    })
  }, [query, activeGenre])

  const featuredTrack =
    filteredTracks[0] ?? tracks[0]

  const playTrack = (track: Track) => {
    play(track)
    toast.success(`Reproduzindo ${track.title}`)
  }

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
      <MusicSidebar
        active="Descobrir"
        onSelect={(label) => {
          if (label === 'Início') {
            window.location.href = '/'
          }

          if (label === 'Descobrir') {
            window.location.href = '/discover'
          }

          if (label === 'Biblioteca') {
            window.location.href = '/library'
          }

          if (label === 'Histórico') {
            window.location.href = '/history'
          }
        }}
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

      <main className="min-h-screen pb-24 lg:pl-60">
        <MusicHeader
          query={query}
          setQuery={setQuery}
        />

        <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-9 md:py-10">
          {/* Cabeçalho */}
          <div className="mb-8">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8ff3e]">
              Explore
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Descobrir
            </h1>

            <p className="mt-2 max-w-xl text-sm text-white/45">
              Encontre novos sons, artistas independentes e músicas
              para ouvir quando a noite começar.
            </p>
          </div>

          {/* Gêneros */}
          <GenreNavigation
            active={activeGenre}
            onChange={setActiveGenre}
          />

          {/* Pesquisa */}
          {query ? (
            <section className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Resultados
                  </h2>

                  <p className="mt-1 text-xs text-white/35">
                    Encontramos {filteredTracks.length} músicas.
                  </p>
                </div>
              </div>

              {filteredTracks.length > 0 ? (
                <div>
                  {filteredTracks.map((track, index) => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={index}
                      onPlay={playTrack}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/8 py-20 text-center">
                  <p className="text-lg font-medium">
                    Nenhuma música encontrada
                  </p>

                  <p className="mt-2 text-sm text-white/40">
                    Tente outro artista, música ou gênero.
                  </p>
                </div>
              )}
            </section>
          ) : (
            <>
              {/* Destaque */}
              <DiscoverHero
                track={featuredTrack}
                onPlay={playTrack}
              />

              {/* Tendências */}
              <TrendingSection
                tracks={filteredTracks}
                onPlay={playTrack}
              />

              {/* Lançamentos */}
              <NewReleases
                tracks={filteredTracks}
                onPlay={playTrack}
              />

              {/* Artistas */}
              <PopularArtists />

              {/* Por estado de espírito */}
              <MoodSection
                onPlay={playTrack}
              />

              {/* CTA */}
              <section className="mt-12 overflow-hidden rounded-2xl border border-[#d8ff3e]/10 bg-[#151815] p-6 md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles className="size-4 text-[#d8ff3e]" />

                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d8ff3e]">
                        Você também cria?
                      </span>
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight">
                      Publique sua música.
                    </h2>

                    <p className="mt-2 max-w-lg text-sm text-white/40">
                      Dê espaço para sua música. Publique suas faixas
                      e deixe outras pessoas descobrirem seu som.
                    </p>
                  </div>

                  <Link
                    href="/tracks/upload"
                    className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#d8ff3e] px-5 py-3 text-xs font-bold text-[#101110] transition-transform hover:scale-[1.02]"
                  >
                    Publicar música
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}