import { api, type ApiResponse } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { Track } from './tracks.service'

export interface Album {
  id: string
  title: string
  year?: number | null
  coverUrl?: string | null
  artistId: string
  artist?: {
    id: string
    name: string
    handle?: string
  }
  tracks: Track[]
}

export interface CreateAlbumData {
  title: string
  year?: number
  coverUrl?: string
  trackIds?: string[]
}

export const albumsService = {
  list() {
    return api.get<ApiResponse<Album[]>>(
      API_ENDPOINTS.ALBUMS.LIST,
    )
  },

  getById(id: string) {
    return api.get<ApiResponse<Album>>(
      API_ENDPOINTS.ALBUMS.BY_ID(id),
    )
  },

  create(data: CreateAlbumData) {
    return api.post<ApiResponse<Album>>(
      API_ENDPOINTS.ALBUMS.CREATE,
      data,
      { auth: true },
    )
  },

}
