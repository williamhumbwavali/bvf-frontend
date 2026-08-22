'use client'

import { create } from 'zustand'
import type { Track } from '@/services/tracks.service'

type RepeatMode = 'off' | 'one' | 'all'

interface PlayerStore {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  liked: string[]
  volume: number
  queueOpen: boolean
  shuffle: boolean
  repeat: RepeatMode

  play: (track?: Track, queue?: Track[]) => void
  setQueue: (tracks: Track[]) => void
  pause: () => void
  resume: () => void

  toggleLike: (id: string) => void
  setVolume: (value: number) => void
  toggleQueue: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void

  next: () => void
  previous: () => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,

  liked: [],

  volume: 74,

  queueOpen: false,

  shuffle: false,

  repeat: 'off',

  /**
   * Toca uma música.
   *
   * Se uma queue for passada, ela passa a ser
   * a fila atual do player.
   */
  play: (track, queue) => {
    const state = get()

    const nextQueue =
      queue && queue.length > 0
        ? queue
        : state.queue

    const nextTrack =
      track ??
      state.currentTrack ??
      nextQueue[0] ??
      null

    if (!nextTrack) {
      return
    }

    set({
      currentTrack: nextTrack,
      queue:
        nextQueue.length > 0
          ? nextQueue
          : [nextTrack],
      isPlaying: true,
    })
  },

  /**
   * Define a fila sem necessariamente começar a tocar.
   */
  setQueue: (tracks) => {
    set({
      queue: tracks,
    })
  },

  pause: () => {
    set({
      isPlaying: false,
    })
  },

  resume: () => {
    const { currentTrack } = get()

    if (!currentTrack) {
      return
    }

    set({
      isPlaying: true,
    })
  },

  toggleLike: (id) =>
    set((state) => ({
      liked: state.liked.includes(id)
        ? state.liked.filter((x) => x !== id)
        : [...state.liked, id],
    })),

  setVolume: (volume) => {
    set({
      volume,
    })
  },

  toggleQueue: () => {
    set((state) => ({
      queueOpen: !state.queueOpen,
    }))
  },

  toggleShuffle: () => {
    set((state) => ({
      shuffle: !state.shuffle,
    }))
  },

  toggleRepeat: () => {
    set((state) => {
      const nextMode: RepeatMode =
        state.repeat === 'off'
          ? 'all'
          : state.repeat === 'all'
            ? 'one'
            : 'off'

      return {
        repeat: nextMode,
      }
    })
  },

  /**
   * Próxima música.
   */
  next: () => {
    const {
      currentTrack,
      queue,
      shuffle,
      repeat,
    } = get()

    if (!currentTrack || queue.length === 0) {
      return
    }

    /**
     * Repetir a mesma música.
     */
    if (repeat === 'one') {
      set({
        isPlaying: true,
      })

      return
    }

    /**
     * Shuffle.
     */
    if (shuffle) {
      if (queue.length <= 1) {
        set({
          isPlaying: true,
        })

        return
      }

      const availableTracks = queue.filter(
        (track) => track.id !== currentTrack.id,
      )

      const randomIndex = Math.floor(
        Math.random() * availableTracks.length,
      )

      set({
        currentTrack:
          availableTracks[randomIndex],
        isPlaying: true,
      })

      return
    }

    /**
     * Reprodução normal.
     */
    const currentIndex = queue.findIndex(
      (track) => track.id === currentTrack.id,
    )

    /**
     * Caso a música atual não esteja na fila.
     */
    if (currentIndex === -1) {
      set({
        currentTrack: queue[0],
        isPlaying: true,
      })

      return
    }

    const nextIndex = currentIndex + 1

    /**
     * Chegou ao fim da fila.
     */
    if (nextIndex >= queue.length) {
      if (repeat === 'all') {
        set({
          currentTrack: queue[0],
          isPlaying: true,
        })
      } else {
        set({
          isPlaying: false,
        })
      }

      return
    }

    set({
      currentTrack: queue[nextIndex],
      isPlaying: true,
    })
  },

  /**
   * Música anterior.
   */
  previous: () => {
    const {
      currentTrack,
      queue,
      shuffle,
    } = get()

    if (!currentTrack || queue.length === 0) {
      return
    }

    /**
     * Shuffle.
     */
    if (shuffle) {
      if (queue.length <= 1) {
        return
      }

      const availableTracks = queue.filter(
        (track) => track.id !== currentTrack.id,
      )

      const randomIndex = Math.floor(
        Math.random() * availableTracks.length,
      )

      set({
        currentTrack:
          availableTracks[randomIndex],
        isPlaying: true,
      })

      return
    }

    const currentIndex = queue.findIndex(
      (track) => track.id === currentTrack.id,
    )

    if (currentIndex === -1) {
      set({
        currentTrack: queue[0],
        isPlaying: true,
      })

      return
    }

    /**
     * Volta para a última música quando
     * estamos no início da fila.
     */
    if (currentIndex <= 0) {
      set({
        currentTrack: queue[queue.length - 1],
        isPlaying: true,
      })

      return
    }

    set({
      currentTrack: queue[currentIndex - 1],
      isPlaying: true,
    })
  },
}))