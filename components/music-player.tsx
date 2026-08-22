'use client'

import { useEffect, useRef, useState } from 'react'
import {
    ListMusic,
    MoreHorizontal,
    Pause,
    Play,
    Repeat,
    Shuffle,
    SkipBack,
    SkipForward,
    Volume2,
} from 'lucide-react'
import { toast } from 'sonner'

import { tracks } from '@/types/music'
import { usePlayerStore } from '@/stores/player-store'

export default function MusicPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const currentTrackRef = useRef(
        usePlayerStore.getState().currentTrack
    )

    const shuffleRef = useRef(
        usePlayerStore.getState().shuffle
    )

    const repeatModeRef = useRef(
        usePlayerStore.getState().repeatMode
    )

    const {
        currentTrack,
        isPlaying,
        play,
        volume,
        setVolume,
        queueOpen,
        toggleQueue,
        shuffle,
        repeatMode,
        toggleShuffle,
        cycleRepeat,
    } = usePlayerStore()

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    /*
     * Mantém os refs sincronizados com o Zustand.
     */
    useEffect(() => {
        currentTrackRef.current = currentTrack
    }, [currentTrack])

    useEffect(() => {
        shuffleRef.current = shuffle
    }, [shuffle])

    useEffect(() => {
        repeatModeRef.current = repeatMode
    }, [repeatMode])

    /*
     * Play / Pause manual
     */
    const togglePlay = () => {
        if (!currentTrack?.audioUrl) {
            toast.error(
                'Esta música não possui um arquivo de áudio.'
            )

            return
        }

        if (isPlaying) {
            audioRef.current?.pause()

            usePlayerStore.setState({
                isPlaying: false,
            })

            return
        }

        play(currentTrack)
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code !== 'Space') {
                return
            }

            const target = event.target as HTMLElement | null

            // Não interferir em campos de texto
            if (
                target?.tagName === 'INPUT' ||
                target?.tagName === 'TEXTAREA' ||
                target?.tagName === 'SELECT' ||
                target?.isContentEditable
            ) {
                return
            }

            event.preventDefault()

            togglePlay()
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [togglePlay])

    /*
     * CRIA O AUDIO APENAS UMA VEZ.
     *
     * IMPORTANTE:
     * Não coloque "volume", "currentTrack" ou qualquer
     * outro estado nessa lista de dependências.
     */
    useEffect(() => {
        const audio = new Audio()

        audio.preload = 'metadata'
        audio.volume = usePlayerStore.getState().volume / 100

        audioRef.current = audio

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
        }

        const handleLoadedMetadata = () => {
            setDuration(
                Number.isFinite(audio.duration)
                    ? audio.duration
                    : 0
            )
        }

        const handleEnded = () => {
            const track = currentTrackRef.current

            if (!track) {
                return
            }

            /*
             * 🔂 REPETIR UMA
             */
            if (repeatModeRef.current === 'one') {
                audio.currentTime = 0

                audio.play().catch(() => {
                    usePlayerStore.setState({
                        isPlaying: false,
                    })
                })

                return
            }

            /*
             * 🔀 SHUFFLE
             */
            if (shuffleRef.current) {
                const availableTracks = tracks.filter(
                    (item) => item.id !== track.id
                )

                if (availableTracks.length === 0) {
                    usePlayerStore.setState({
                        isPlaying: false,
                    })

                    return
                }

                const randomIndex = Math.floor(
                    Math.random() * availableTracks.length
                )

                const nextTrack = availableTracks[randomIndex]

                if (nextTrack) {
                    play(nextTrack)
                }

                return
            }

            /*
             * ▶️ PRÓXIMA MÚSICA
             */
            const currentIndex = tracks.findIndex(
                (item) => item.id === track.id
            )

            if (currentIndex === -1) {
                usePlayerStore.setState({
                    isPlaying: false,
                })

                return
            }

            const nextIndex = currentIndex + 1

            /*
             * Chegou ao final da lista.
             */
            if (nextIndex >= tracks.length) {
                /*
                 * 🔁 REPETIR FILA
                 */
                if (repeatModeRef.current === 'all') {
                    const firstTrack = tracks[0]

                    if (firstTrack) {
                        play(firstTrack)
                    }

                    return
                }

                /*
                 * Sem repeat.
                 */
                usePlayerStore.setState({
                    isPlaying: false,
                })

                return
            }

            const nextTrack = tracks[nextIndex]

            if (nextTrack) {
                play(nextTrack)
            }
        }

        audio.addEventListener(
            'timeupdate',
            handleTimeUpdate
        )

        audio.addEventListener(
            'loadedmetadata',
            handleLoadedMetadata
        )

        audio.addEventListener(
            'ended',
            handleEnded
        )

        /*
         * Cleanup somente quando o componente
         * realmente for desmontado.
         */
        return () => {
            audio.pause()
            audio.removeAttribute('src')
            audio.load()

            audio.removeEventListener(
                'timeupdate',
                handleTimeUpdate
            )

            audio.removeEventListener(
                'loadedmetadata',
                handleLoadedMetadata
            )

            audio.removeEventListener(
                'ended',
                handleEnded
            )

            audioRef.current = null
        }
    }, [play])

    /*
     * 🔊 VOLUME
     *
     * Apenas altera o volume do mesmo elemento Audio.
     * Não recria o Audio.
     */
    useEffect(() => {
        const audio = audioRef.current

        if (!audio) {
            return
        }

        audio.volume = Math.max(
            0,
            Math.min(volume, 100)
        ) / 100
    }, [volume])

    /*
     * 🎵 TROCA DE MÚSICA
     */
    useEffect(() => {
        const audio = audioRef.current

        if (!audio || !currentTrack?.audioUrl) {
            return
        }

        /*
         * Guarda o volume atual antes de trocar
         * o source.
         */
        const currentVolume = audio.volume

        audio.src = currentTrack.audioUrl

        /*
         * Garante que trocar de música não altera
         * o volume.
         */
        audio.volume = currentVolume

        audio.load()

        setCurrentTime(0)
        setDuration(0)

        if (isPlaying) {
            audio.play().catch(() => {
                toast.error(
                    'Não foi possível reproduzir esta música.'
                )

                usePlayerStore.setState({
                    isPlaying: false,
                })
            })
        }
    }, [currentTrack?.id])

    /*
     * ▶️ / ⏸️ PLAY / PAUSE
     */
    useEffect(() => {
        const audio = audioRef.current

        if (!audio || !currentTrack?.audioUrl) {
            return
        }

        if (isPlaying) {
            audio.play().catch(() => {
                toast.error(
                    'Não foi possível reproduzir esta música.'
                )

                usePlayerStore.setState({
                    isPlaying: false,
                })
            })
        } else {
            audio.pause()
        }
    }, [isPlaying])



    /*
     * ⏮️ MÚSICA ANTERIOR
     */
    const previousTrack = () => {
        const track = currentTrackRef.current

        if (!track) {
            return
        }

        const audio = audioRef.current

        /*
         * Se já passou de 3 segundos,
         * volta para o início.
         */
        if (audio && audio.currentTime > 3) {
            audio.currentTime = 0
            setCurrentTime(0)

            return
        }

        /*
         * Shuffle
         */
        if (shuffleRef.current) {
            const availableTracks = tracks.filter(
                (item) => item.id !== track.id
            )

            if (availableTracks.length === 0) {
                return
            }

            const randomIndex = Math.floor(
                Math.random() * availableTracks.length
            )

            const previous =
                availableTracks[randomIndex]

            if (previous) {
                play(previous)
            }

            return
        }

        const currentIndex = tracks.findIndex(
            (item) => item.id === track.id
        )

        if (currentIndex <= 0) {
            /*
             * Repeat all permite voltar para a última.
             */
            if (repeatModeRef.current === 'all') {
                const lastTrack =
                    tracks[tracks.length - 1]

                if (lastTrack) {
                    play(lastTrack)
                }

                return
            }

            toast.info(
                'Você já está no início da fila.'
            )

            return
        }

        const previous =
            tracks[currentIndex - 1]

        if (previous) {
            play(previous)
        }
    }

    /*
     * ⏭️ PRÓXIMA MÚSICA
     */
    const nextTrack = () => {
        const track = currentTrackRef.current

        if (!track) {
            return
        }

        /*
         * Shuffle
         */
        if (shuffleRef.current) {
            const availableTracks = tracks.filter(
                (item) => item.id !== track.id
            )

            if (availableTracks.length === 0) {
                return
            }

            const randomIndex = Math.floor(
                Math.random() * availableTracks.length
            )

            const next =
                availableTracks[randomIndex]

            if (next) {
                play(next)
            }

            return
        }

        const currentIndex = tracks.findIndex(
            (item) => item.id === track.id
        )

        if (currentIndex === -1) {
            return
        }

        const nextIndex = currentIndex + 1

        /*
         * Chegou ao fim.
         */
        if (nextIndex >= tracks.length) {
            /*
             * Repeat all
             */
            if (repeatModeRef.current === 'all') {
                const firstTrack = tracks[0]

                if (firstTrack) {
                    play(firstTrack)
                }

                return
            }

            usePlayerStore.setState({
                isPlaying: false,
            })

            toast.info(
                'Você chegou ao fim da fila.'
            )

            return
        }

        const next = tracks[nextIndex]

        if (next) {
            play(next)
        }
    }

    /*
     * ⏱️ SEEK
     */
    const handleSeek = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const time = Number(event.target.value)

        const audio = audioRef.current

        if (!audio) {
            return
        }

        audio.currentTime = time
        setCurrentTime(time)
    }

    /*
     * Formatar tempo.
     */
    const formatTime = (seconds: number) => {
        if (!Number.isFinite(seconds)) {
            return '0:00'
        }

        const minutes = Math.floor(seconds / 60)

        const remainingSeconds = Math.floor(
            seconds % 60
        )

        return `${minutes}:${remainingSeconds
            .toString()
            .padStart(2, '0')}`
    }

    if (!currentTrack) {
        return null
    }

    return (
        <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#151715]/98 px-4 py-3 backdrop-blur-md md:px-6">

            {/* Barra de progresso */}
            <div className="absolute left-0 right-0 top-0 h-[3px] bg-white/10">

                <div
                    className="pointer-events-none absolute left-0 top-0 h-full bg-[#d8ff3e]"
                    style={{
                        width:
                            duration > 0
                                ? `${Math.min(
                                    (currentTime / duration) * 100,
                                    100
                                )}%`
                                : '0%',
                    }}
                />

                <input
                    aria-label="Progresso da música"
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
                />
            </div>

            <div className="mx-auto flex max-w-[1500px] items-center gap-3">

                {/* Música atual */}
                <div className="flex min-w-0 items-center gap-3">
                    <img
                        src={currentTrack.coverUrl}
                        alt={`Capa de ${currentTrack.title}`}
                        className="size-11 shrink-0 rounded-md object-cover"
                    />

                    <div className="hidden w-48 min-w-0 sm:block">
                        <p className="truncate text-sm font-medium">
                            {currentTrack.title}
                        </p>

                        <p className="truncate text-xs text-white/40">
                            {currentTrack.artist.name}
                        </p>
                    </div>
                </div>

                {/* Controles */}
                <div className="flex flex-1 flex-col items-center justify-center">

                    <div className="flex items-center gap-3 sm:gap-4">

                        {/* Shuffle */}
                        <button
                            type="button"
                            aria-label={
                                shuffle
                                    ? 'Desativar reprodução aleatória'
                                    : 'Ativar reprodução aleatória'
                            }
                            aria-pressed={shuffle}
                            onClick={toggleShuffle}
                            className={`hidden transition-colors sm:block ${shuffle
                                ? 'text-[#d8ff3e]'
                                : 'text-white/40 hover:text-white'
                                }`}
                        >
                            <Shuffle className="size-4" />
                        </button>

                        {/* Anterior */}
                        <button
                            type="button"
                            aria-label="Música anterior"
                            onClick={previousTrack}
                            className="text-white/45 transition-colors hover:text-white"
                        >
                            <SkipBack className="size-4 fill-current" />
                        </button>

                        {/* Play / Pause */}
                        <button
                            type="button"
                            aria-label={
                                isPlaying
                                    ? 'Pausar'
                                    : 'Reproduzir'
                            }
                            onClick={togglePlay}
                            className="flex size-9 items-center justify-center rounded-full bg-white text-[#101110] transition-transform hover:scale-105"
                        >
                            {isPlaying ? (
                                <Pause className="size-4 fill-current" />
                            ) : (
                                <Play className="ml-0.5 size-4 fill-current" />
                            )}
                        </button>

                        {/* Próxima */}
                        <button
                            type="button"
                            aria-label="Próxima música"
                            onClick={nextTrack}
                            className="text-white/45 transition-colors hover:text-white"
                        >
                            <SkipForward className="size-4 fill-current" />
                        </button>

                        {/* Repeat */}
                        <button
                            type="button"
                            aria-label={
                                repeatMode === 'off'
                                    ? 'Ativar repetição'
                                    : repeatMode === 'all'
                                        ? 'Repetir fila'
                                        : 'Repetir música'
                            }
                            aria-pressed={repeatMode !== 'off'}
                            onClick={cycleRepeat}
                            className={`relative hidden transition-colors sm:block ${repeatMode !== 'off'
                                ? 'text-[#d8ff3e]'
                                : 'text-white/40 hover:text-white'
                                }`}
                        >
                            <Repeat className="size-4" />

                            {repeatMode === 'one' && (
                                <span className="absolute -right-1 -top-1 text-[8px] font-bold text-[#d8ff3e]">
                                    1
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Tempo */}
                    <div className="mt-1 hidden items-center gap-2 font-mono text-[10px] text-white/30 sm:flex">
                        <span>
                            {formatTime(currentTime)}
                        </span>

                        <span>/</span>

                        <span>
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* Volume / fila */}
                <div className="hidden items-center gap-3 md:flex">

                    <Volume2 className="size-4 text-white/45" />

                    <input
                        aria-label="Volume"
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(event) =>
                            setVolume(
                                Number(event.target.value)
                            )
                        }
                        className="h-1 w-20 accent-[#d8ff3e]"
                    />

                    <button
                        type="button"
                        aria-label="Fila de reprodução"
                        aria-pressed={queueOpen}
                        onClick={toggleQueue}
                        className={`rounded p-1.5 transition-colors ${queueOpen
                            ? 'text-[#d8ff3e]'
                            : 'text-white/40 hover:text-white'
                            }`}
                    >
                        <ListMusic className="size-4" />
                    </button>
                </div>

                {/* Mais opções */}
                <button
                    type="button"
                    aria-label="Mais opções do player"
                    onClick={() =>
                        toast.info('Opções do player')
                    }
                    className="text-white/40 transition-colors hover:text-white"
                >
                    <MoreHorizontal className="size-5" />
                </button>
            </div>
        </footer>
    )
}