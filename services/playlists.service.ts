import { api } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { Track } from './tracks.service'

export interface Playlist {
  id: string
  title: string
  description?: string | null
  coverUrl?: string | null
  ownerId: string
  tracks?: Track[]
  createdAt?: string
  updatedAt?: string
}

export interface PlaylistsResponse {
  data: Playlist[]
}

export interface PlaylistResponse {
  data: Playlist
}

export interface CreatePlaylistData {
  title: string
  description?: string
  coverUrl?: string
}

export const playlistsService = {
  list() {
    return api.get<PlaylistsResponse>(
      API_ENDPOINTS.PLAYLISTS.LIST,
      {
        auth: true,
      },
    )
  },

  getById(id: string) {
    return api.get<PlaylistResponse>(
      API_ENDPOINTS.PLAYLISTS.BY_ID(id),
      {
        auth: true,
      },
    )
  },

  create(data: CreatePlaylistData) {
    return api.post<Playlist>(
      API_ENDPOINTS.PLAYLISTS.CREATE,
      data,
      {
        auth: true,
      },
    )
  },

  update(
    id: string,
    data: Partial<CreatePlaylistData>,
  ) {
    return api.patch<Playlist>(
      API_ENDPOINTS.PLAYLISTS.UPDATE(id),
      data,
      {
        auth: true,
      },
    )
  },

  delete(id: string) {
    return api.delete(
      API_ENDPOINTS.PLAYLISTS.DELETE(id),
      {
        auth: true,
      },
    )
  },
}