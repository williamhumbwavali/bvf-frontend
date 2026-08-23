import { api, ApiResponse } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { Track } from './tracks.service'
import { User } from './auth.service'

export interface ArtistListResponse {
  data: Artist[]
}

export interface Artist {
  id: string
  name: string
  handle: string
  followers: number
  bio: string
  tracks?: Track[]
  image: string
  user: User
  userId: string
  genre?: string
  verified: boolean
}
export interface ArtistResponse {
  data: Artist
}

export const ArtistsService = {
  /**
   * Lista artistas
   */
  list(limit: number = 20) {
    return api.get<ArtistListResponse>(
      `${API_ENDPOINTS.ARTISTS.LIST}?limit=${limit}`,
      {
        auth: true,
      },
    )
  },

  /**
   * Busca um artista pelo ID
   */
  getById(id: string) {
    return api.get<ApiResponse<Artist>>(
      API_ENDPOINTS.ARTISTS.BY_ID(id),
      {
        auth: true,
      },
    )
  },

  /**
   * Busca o artista associado ao usuário autenticado
   */
  getMe() {
    return api.get<ArtistResponse>(
      API_ENDPOINTS.ARTISTS.ME,
      {
        auth: true,
      },
    )
  },

  /**
   * Busca um artista pelo username
   */
  getByUsername(username: string) {
    return api.get<ArtistResponse>(
      API_ENDPOINTS.ARTISTS.BY_USERNAME(username),
      {
        auth: true,
      },
    )
  },
}