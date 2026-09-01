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

import { tracksService, Track } from '@/services/tracks.service'
import { usePlayerStore } from '@/stores/player-store'

export default function MusicPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const currentTrackRef = useRef<Track | null>(
        usePlayerStore.getState().currentTrack,
    )

    const shuffleRef = useRef(
        usePlayerStore.getState().shuffle,
    )

    const repeatModeRef = useRef(
        usePlayerStore.getState().repeatMode,
    )

    const queueRef = useRef<Track[]>([])

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

    const [queue, setQueue] = useState<Track[]>([])
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isLoadingQueue, setIsLoadingQueue] = useState(false)

    /*
     * Mantém os refs sincronizados
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
     * Carrega as músicas reais da API.
     */
    useEffect(() => {
        let mounted = true

        const loadTracks = async () => {
            try {
                setIsLoadingQueue(true)

                const response = await tracksService.list(1, 100)

                const apiTracks = response.data?.data ?? []

                if (!mounted) {
                    return
                }

                setQueue(apiTracks)
                queueRef.current = apiTracks
            } catch (error) {
                console.error(
                    'Erro ao carregar músicas:',
                    error,
                )

                if (mounted) {
                    toast.error(
                        'Não foi possível carregar as músicas.',
                    )
                }
            } finally {
                if (mounted) {
                    setIsLoadingQueue(false)
                }
            }
        }

        loadTracks()

        return () => {
            mounted = false
        }
    }, [])

    /*
     * Se a música atual veio de /artists/me e não possui
     * artist, encontramos a versão completa na lista da API.
     */
    useEffect(() => {
        if (!currentTrack || queue.length === 0) {
            return
        }

        const apiTrack = queue.find(
            (track) => track.id === currentTrack.id,
        )

        if (!apiTrack) {
            return
        }

        /*
         * Se a versão da API possui informações adicionais,
         * usamos ela no player.
         */
        if (
            apiTrack.artist ||
            apiTrack.genre ||
            apiTrack.album
        ) {
            usePlayerStore.setState({
                currentTrack: {
                    ...currentTrack,
                    ...apiTrack,
                },
            })
        }
    }, [queue, currentTrack?.id])

    /*
     * Play / Pause manual
     */
    const togglePlay = () => {
        if (!currentTrack?.audioUrl) {
            toast.error(
                'Esta música não possui um arquivo de áudio.',
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

    /*
     * Atalho de teclado
     */
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code !== 'Space') {
                return
            }

            const target = event.target as HTMLElement | null

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

        window.addEventListener(
            'keydown',
            handleKeyDown,
        )

        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown,
            )
        }
    }, [currentTrack?.id, isPlaying])

    /*
     * Cria o elemento Audio apenas uma vez.
     */
    useEffect(() => {
        const audio = new Audio()

        audio.preload = 'metadata'
        audio.volume =
            usePlayerStore.getState().volume / 100

        audioRef.current = audio

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
        }

        const handleLoadedMetadata = () => {
            setDuration(
                Number.isFinite(audio.duration)
                    ? audio.duration
                    : 0,
            )
        }

        const handleEnded = () => {
            const track = currentTrackRef.current

            if (!track) {
                return
            }

            /*
             * Repetir uma música
             */
            if (
                repeatModeRef.current === 'one'
            ) {
                audio.currentTime = 0

                audio.play().catch(() => {
                    usePlayerStore.setState({
                        isPlaying: false,
                    })
                })

                return
            }

            const currentQueue = queueRef.current

            if (currentQueue.length === 0) {
                usePlayerStore.setState({
                    isPlaying: false,
                })

                return
            }

            /*
             * Shuffle
             */
            if (shuffleRef.current) {
                const availableTracks =
                    currentQueue.filter(
                        (item) => item.id !== track.id,
                    )

                if (availableTracks.length === 0) {
                    usePlayerStore.setState({
                        isPlaying: false,
                    })

                    return
                }

                const randomIndex = Math.floor(
                    Math.random() *
                    availableTracks.length,
                )

                const nextTrack =
                    availableTracks[randomIndex]

                if (nextTrack) {
                    play(nextTrack)
                }

                return
            }

            /*
             * Próxima música
             */
            const currentIndex =
                currentQueue.findIndex(
                    (item) => item.id === track.id,
                )

            if (currentIndex === -1) {
                usePlayerStore.setState({
                    isPlaying: false,
                })

                return
            }

            const nextIndex = currentIndex + 1

            /*
             * Chegou ao final da fila
             */
            if (
                nextIndex >=
                currentQueue.length
            ) {
                /*
                 * Repetir fila
                 */
                if (
                    repeatModeRef.current === 'all'
                ) {
                    const firstTrack =
                        currentQueue[0]

                    if (firstTrack) {
                        play(firstTrack)
                    }

                    return
                }

                /*
                 * Sem repeat
                 */
                usePlayerStore.setState({
                    isPlaying: false,
                })

                return
            }

            const nextTrack =
                currentQueue[nextIndex]

            if (nextTrack) {
                play(nextTrack)
            }
        }

        audio.addEventListener(
            'timeupdate',
            handleTimeUpdate,
        )

        audio.addEventListener(
            'loadedmetadata',
            handleLoadedMetadata,
        )

        audio.addEventListener(
            'ended',
            handleEnded,
        )

        return () => {
            audio.pause()
            audio.removeAttribute('src')
            audio.load()

            audio.removeEventListener(
                'timeupdate',
                handleTimeUpdate,
            )

            audio.removeEventListener(
                'loadedmetadata',
                handleLoadedMetadata,
            )

            audio.removeEventListener(
                'ended',
                handleEnded,
            )

            audioRef.current = null
        }
    }, [play])

    /*
     * Volume
     */
    useEffect(() => {
        const audio = audioRef.current

        if (!audio) {
            return
        }

        audio.volume =
            Math.max(
                0,
                Math.min(volume, 100),
            ) / 100
    }, [volume])

    /*
     * Troca de música
     */
    useEffect(() => {
        const audio = audioRef.current

        if (
            !audio ||
            !currentTrack?.audioUrl
        ) {
            return
        }

        const currentVolume = audio.volume

        audio.src = currentTrack.audioUrl

        audio.volume = currentVolume

        audio.load()

        setCurrentTime(0)
        setDuration(0)

        if (isPlaying) {
            audio.play().catch(() => {
                toast.error(
                    'Não foi possível reproduzir esta música.',
                )

                usePlayerStore.setState({
                    isPlaying: false,
                })
            })
        }
    }, [currentTrack?.id])

    /*
     * Play / Pause
     */
    useEffect(() => {
        const audio = audioRef.current

        if (
            !audio ||
            !currentTrack?.audioUrl
        ) {
            return
        }

        if (isPlaying) {
            audio.play().catch(() => {
                toast.error(
                    'Não foi possível reproduzir esta música.',
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
     * Música anterior
     */
    const previousTrack = () => {
        const track = currentTrackRef.current

        if (!track) {
            return
        }

        const currentQueue = queueRef.current
        const audio = audioRef.current

        /*
         * Se já passou de 3 segundos,
         * volta para o início.
         */
        if (
            audio &&
            audio.currentTime > 3
        ) {
            audio.currentTime = 0
            setCurrentTime(0)

            return
        }

        /*
         * Shuffle
         */
        if (shuffleRef.current) {
            const availableTracks =
                currentQueue.filter(
                    (item) => item.id !== track.id,
                )

            if (availableTracks.length === 0) {
                return
            }

            const randomIndex = Math.floor(
                Math.random() *
                availableTracks.length,
            )

            const previous =
                availableTracks[randomIndex]

            if (previous) {
                play(previous)
            }

            return
        }

        const currentIndex =
            currentQueue.findIndex(
                (item) => item.id === track.id,
            )

        if (currentIndex <= 0) {
            /*
             * Repeat all
             */
            if (
                repeatModeRef.current === 'all'
            ) {
                const lastTrack =
                    currentQueue[
                    currentQueue.length - 1
                    ]

                if (lastTrack) {
                    play(lastTrack)
                }

                return
            }

            toast.info(
                'Você já está no início da fila.',
            )

            return
        }

        const previous =
            currentQueue[currentIndex - 1]

        if (previous) {
            play(previous)
        }
    }

    /*
     * Próxima música
     */
    const nextTrack = () => {
        const track = currentTrackRef.current

        if (!track) {
            return
        }

        const currentQueue = queueRef.current

        /*
         * Shuffle
         */
        if (shuffleRef.current) {
            const availableTracks =
                currentQueue.filter(
                    (item) => item.id !== track.id,
                )

            if (availableTracks.length === 0) {
                return
            }

            const randomIndex = Math.floor(
                Math.random() *
                availableTracks.length,
            )

            const next =
                availableTracks[randomIndex]

            if (next) {
                play(next)
            }

            return
        }

        const currentIndex =
            currentQueue.findIndex(
                (item) => item.id === track.id,
            )

        if (currentIndex === -1) {
            return
        }

        const nextIndex = currentIndex + 1

        /*
         * Chegou ao fim
         */
        if (
            nextIndex >=
            currentQueue.length
        ) {
            /*
             * Repeat all
             */
            if (
                repeatModeRef.current === 'all'
            ) {
                const firstTrack =
                    currentQueue[0]

                if (firstTrack) {
                    play(firstTrack)
                }

                return
            }

            usePlayerStore.setState({
                isPlaying: false,
            })

            toast.info(
                'Você chegou ao fim da fila.',
            )

            return
        }

        const next =
            currentQueue[nextIndex]

        if (next) {
            play(next)
        }
    }

    /*
     * Seek
     */
    const handleSeek = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const time = Number(
            event.target.value,
        )

        const audio = audioRef.current

        if (!audio) {
            return
        }

        audio.currentTime = time
        setCurrentTime(time)
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
                                    (currentTime /
                                        duration) *
                                    100,
                                    100,
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
                    {currentTrack.coverUrl ? (
                        <img
                            src={currentTrack.coverUrl}
                            alt={`Capa de ${currentTrack.title}`}
                            className="size-11 shrink-0 rounded-md object-cover"
                        />
                    ) : (
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-white/10 text-xs text-white/40">
                            ♪
                        </div>
                    )}

                    <div className="hidden w-48 min-w-0 sm:block">
                        <p className="truncate text-sm font-medium">
                            {currentTrack.title}
                        </p>

                        <p className="truncate text-xs text-white/40">
                            {currentTrack.artist?.name ??
                                currentTrack.artistId}
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
                            disabled={
                                isLoadingQueue ||
                                queue.length === 0
                            }
                            className="text-white/45 transition-colors hover:text-white disabled:opacity-30"
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
                            disabled={
                                isLoadingQueue ||
                                queue.length === 0
                            }
                            className="text-white/45 transition-colors hover:text-white disabled:opacity-30"
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
                            aria-pressed={
                                repeatMode !== 'off'
                            }
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
                                Number(
                                    event.target.value,
                                ),
                            )
                        }
                        className="h-1 w-40 accent-[#d8ff3e]"
                    />
                </div>

                {/* Mais opções */}
                <button
                    type="button"
                    aria-label="Mais opções do player"
                    onClick={() =>
                        toast.info(
                            'Opções do player',
                        )
                    }
                    className="text-white/40 transition-colors hover:text-white"
                >
                </button>
            </div>
        </footer>
    )
}

export function formatTime (
    seconds: number | undefined,
): any {
    if (!Number.isFinite(seconds)) {
        return '0:00'
    }

    const minutes = Math.floor(
        seconds / 60,
    )

    const remainingSeconds =
        Math.floor(seconds % 60)

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, '0')}`
}