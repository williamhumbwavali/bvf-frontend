'use client'

import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Music,
  Upload,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'

import MusicSidebar from '@/components/music-sidebar'
import MusicHeader from '@/components/music-header'
import {
  tracksService,
  Track,
} from '@/services/tracks.service'
import {
  Genre,
  genresService,
} from '@/services/genre.service'

export default function EditMusicPage() {
  const router = useRouter()
  const params = useParams()

  const trackId = params.id as string

  const [active, setActive] = useState('Minhas músicas')

  const [track, setTrack] = useState<Track | null>(null)
  const [genres, setGenres] = useState<Genre[]>([])

  const [title, setTitle] = useState('')
  const [genreId, setGenreId] = useState('')

  const [audioFile, setAudioFile] =
    useState<File | null>(null)

  const [coverFile, setCoverFile] =
    useState<File | null>(null)

  const [coverPreview, setCoverPreview] =
    useState<string | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [isSaving, setIsSaving] =
    useState(false)

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true)

        const [trackResponse, genresResponse] =
          await Promise.all([
            tracksService.getById(trackId),
            genresService.list(),
          ])

        const currentTrack = trackResponse.data

        setTrack(currentTrack)
        setGenres(genresResponse.data)

        setTitle(currentTrack.title)

        /*
         * Dependendo da resposta do backend,
         * o gênero pode vir como objeto.
         */
        if (
          typeof currentTrack.genre === 'object' &&
          currentTrack.genre?.id
        ) {
          setGenreId(currentTrack.genre.id)
        }

        if (currentTrack.coverUrl) {
          setCoverPreview(
            currentTrack.coverUrl,
          )
        }
      } catch (error) {
        console.error(error)

        toast.error(
          'Não foi possível carregar a música.',
        )

        router.push('/my-music')
      } finally {
        setIsLoading(false)
      }
    }

    if (trackId) {
      load()
    }
  }, [trackId, router])

  const handleAudioChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('audio/')) {
      toast.error(
        'Selecione um arquivo de áudio válido.',
      )
      return
    }

    setAudioFile(file)
  }

  const getAudioDuration = (
    file: File,
  ): Promise<number> => {
    return new Promise(
      (resolve, reject) => {
        const audio =
          document.createElement('audio')

        const url =
          URL.createObjectURL(file)

        audio.preload = 'metadata'
        audio.src = url

        audio.onloadedmetadata = () => {
          const duration =
            Math.round(audio.duration)

          URL.revokeObjectURL(url)

          resolve(duration)
        }

        audio.onerror = () => {
          URL.revokeObjectURL(url)

          reject(
            new Error(
              'Não foi possível obter a duração do áudio.',
            ),
          )
        }
      },
    )
  }

  const handleCoverChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(
        'Selecione uma imagem válida.',
      )
      return
    }

    setCoverFile(file)

    const preview =
      URL.createObjectURL(file)

    setCoverPreview(preview)
  }

  const removeCover = () => {
    setCoverFile(null)
    setCoverPreview(null)
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!track) return

    if (!title.trim()) {
      toast.error(
        'Digite o título da música.',
      )
      return
    }

    if (!genreId) {
      toast.error(
        'Selecione um gênero.',
      )
      return
    }

    setIsSaving(true)

    try {
      let audioUrl =
        track.audioUrl

      let durationSec =
        track.durationSec

      /*
       * Só faz upload de áudio se o
       * usuário escolher um novo arquivo.
       */
      if (audioFile) {
        durationSec =
          await getAudioDuration(
            audioFile,
          )

        const audioUpload =
          await tracksService.upload(
            audioFile,
            'audio',
          )

        const audioResponse =
          await fetch(
            audioUpload.uploadUrl,
            {
              method: 'PUT',
              headers: {
                'Content-Type':
                  audioFile.type,
              },
              body: audioFile,
            },
          )

        if (!audioResponse.ok) {
          throw new Error(
            `Falha no upload do áudio: ${audioResponse.status}`,
          )
        }

        audioUrl =
          audioUpload.publicUrl
      }

      /*
       * Só faz upload da capa se o
       * usuário escolher uma nova.
       */
      let coverUrl =
        track.coverUrl

      if (coverFile) {
        const coverUpload =
          await tracksService.upload(
            coverFile,
            'cover',
          )

        const coverResponse =
          await fetch(
            coverUpload.uploadUrl,
            {
              method: 'PUT',
              headers: {
                'Content-Type':
                  coverFile.type,
              },
              body: coverFile,
            },
          )

        if (!coverResponse.ok) {
          throw new Error(
            `Falha no upload da capa: ${coverResponse.status}`,
          )
        }

        coverUrl =
          coverUpload.publicUrl
      }

      await tracksService.update(
        track.id,
        {
          title: title.trim(),
          genreId,
          durationSec,
          audioUrl,
          coverUrl,
        },
      )

      toast.success(
        'Música atualizada com sucesso.',
      )

      router.push('/my-music')
    } catch (error) {
      console.error(error)

      toast.error(
        'Não foi possível atualizar a música.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0d0c] text-white">
        <div className="flex flex-col items-center gap-4">
          <span className="size-7 animate-spin rounded-full border-2 border-white/10 border-t-[#d8ff3e]" />

          <p className="text-sm text-white/40">
            Carregando música...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
      <MusicSidebar
        active={active}
        onSelect={setActive}
      />

      <div className="lg:pl-60">
        <main className="min-h-screen pb-24">
          <MusicHeader
            query=""
            setQuery={() => {}}
          />

          <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-9 md:py-10">

            <div className="mb-10">
              <button
                type="button"
                onClick={() =>
                  router.back()
                }
                className="mb-6 flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
              >
                <ArrowLeft className="size-4" />
                Voltar
              </button>

              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8ff3e]">
                Estúdio
              </p>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                Editar música
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
                Atualize as informações ou
                substitua os arquivos da sua
                música.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-6 lg:grid-cols-[320px_1fr]"
            >

              {/* Capa */}

              <div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Capa
                </p>

                <label
                  htmlFor="cover"
                  className="group relative block aspect-square cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/15 bg-[#131513] transition-colors hover:border-[#d8ff3e]/50"
                >
                  {coverPreview ? (
                    <>
                      <img
                        src={coverPreview}
                        alt="Pré-visualização da capa"
                        className="size-full object-cover"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur-sm">
                          <ImagePlus className="size-4" />
                          Alterar capa
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center px-6 text-center">
                      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#1c201c] text-[#d8ff3e]">
                        <ImagePlus className="size-5" />
                      </div>

                      <p className="text-sm font-medium">
                        Adicione uma capa
                      </p>

                      <p className="mt-2 text-xs leading-5 text-white/35">
                        JPG, PNG ou WEBP
                        <br />
                        Recomendado: 1000 × 1000
                      </p>
                    </div>
                  )}

                  <input
                    id="cover"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleCoverChange
                    }
                    className="hidden"
                  />
                </label>

                {coverFile && (
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-[#131513] px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <ImagePlus className="size-4 shrink-0 text-[#d8ff3e]" />

                      <span className="truncate text-xs text-white/60">
                        {coverFile.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={removeCover}
                      className="text-white/35 hover:text-white"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Informações */}

              <div className="rounded-2xl border border-white/10 bg-[#131513] p-5 md:p-7">

                <div className="mb-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Informações da faixa
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Edite sua música
                  </h2>
                </div>

                <div className="space-y-5">

                  {/* Título */}

                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-xs font-medium text-white/60"
                    >
                      Título da música
                    </label>

                    <input
                      id="title"
                      value={title}
                      onChange={(event) =>
                        setTitle(
                          event.target.value,
                        )
                      }
                      className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#d8ff3e]/60"
                    />
                  </div>

                  {/* Gênero */}

                  <div>
                    <label
                      htmlFor="genre"
                      className="mb-2 block text-xs font-medium text-white/60"
                    >
                      Gênero
                    </label>

                    <select
                      id="genre"
                      value={genreId}
                      onChange={(event) =>
                        setGenreId(
                          event.target.value,
                        )
                      }
                      className="h-11 w-full rounded-lg border border-white/10 bg-[#171917] px-3 text-sm text-white outline-none focus:border-[#d8ff3e]/60"
                    >
                      <option value="">
                        Selecionar gênero
                      </option>

                      {genres.map(
                        (genre) => (
                          <option
                            key={genre.id}
                            value={genre.id}
                          >
                            {genre.name}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {/* Áudio */}

                  <div>
                    <label className="mb-2 block text-xs font-medium text-white/60">
                      Arquivo de áudio
                    </label>

                    <label
                      htmlFor="audio"
                      className="group flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.025] p-4 transition-colors hover:border-[#d8ff3e]/50 hover:bg-white/[0.04]"
                    >
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#1c201c] text-[#d8ff3e]">
                        <Music className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        {audioFile ? (
                          <>
                            <p className="truncate text-sm font-medium">
                              {audioFile.name}
                            </p>

                            <p className="mt-1 text-xs text-white/35">
                              {(
                                audioFile.size /
                                1024 /
                                1024
                              ).toFixed(
                                2,
                              )}{' '}
                              MB
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium">
                              {track?.audioUrl
                                ? 'Manter áudio atual'
                                : 'Escolha sua música'}
                            </p>

                            <p className="mt-1 text-xs text-white/35">
                              Clique para substituir o áudio
                            </p>
                          </>
                        )}
                      </div>

                      <span className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-white/45 transition-colors group-hover:bg-[#d8ff3e] group-hover:text-[#101110]">
                        <Upload className="size-4" />
                      </span>

                      <input
                        id="audio"
                        type="file"
                        accept="audio/mpeg,audio/wav,audio/flac,audio/x-flac"
                        onChange={
                          handleAudioChange
                        }
                        className="hidden"
                      />
                    </label>
                  </div>

                </div>

                {/* Rodapé */}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-xs leading-5 text-white/30">
                    Apenas os campos alterados
                    serão atualizados.
                  </p>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#d8ff3e] px-6 text-xs font-bold text-[#101110] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <span className="size-4 animate-spin rounded-full border-2 border-[#101110]/30 border-t-[#101110]" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Check className="size-4" />
                        Salvar alterações
                      </>
                    )}
                  </button>

                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}