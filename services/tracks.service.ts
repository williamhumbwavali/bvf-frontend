import { api, ApiResponse } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { Artist } from '@/types/music';
import { Genre } from './genre.service';

export interface Album {
  title: string
}

export interface Track {
  id: string;
  title: string;
  genre?: Genre;
  durationSec?: number;
  playCount?: number;
  downloadCount?: number;
  accent?: string;
  audioUrl?: string;
  coverUrl?: string | undefined;
  artistId: string;
  albumId?: string;
  artist?: Artist;
  album?: Album;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTrackData {
  title: string;
  genre?: string;
  durationSec?: number;
  audioUrl?: string;
  coverUrl?: string;
}

export interface TrackListResponse {
  data: {
    data: Track[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface TrackTrendingResponse {
  data: Track[];
}

export const tracksService = {
  list(
    page = 1,
    limit = 20,
    search?: string,
  ) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search) {
      params.set('search', search);
    }

    return api.get<TrackListResponse>(
      `${API_ENDPOINTS.TRACKS.LIST}?${params.toString()}`,
    );
  },

  getById(id: string) {
    return api.get<ApiResponse<Track>>(
      API_ENDPOINTS.TRACKS.BY_ID(id),
    );
  },

  create(data: any) {
    return api.post<Track>(
      API_ENDPOINTS.TRACKS.CREATE,
      data,
      {
        auth: true,
      },
    );
  },

  async upload(
    file: {
      name: string
      type: string
    },
    type: 'audio' | 'cover',
  ) {
    const response = await api.post<{
      success: boolean
      data: {
        uploadUrl: string
        publicUrl: string
        key: string
      }
      message: string
    }>(
      API_ENDPOINTS.TRACKS.UPLOAD_URL,
      {
        type,
        filename: file.name,
        contentType: file.type,
      },
      {
        auth: true,
      },
    )

    console.log('SERVICE RESPONSE:', response)
    console.log('SERVICE DATA:', response.data)

    return response.data
  },

  like(id: string) {
    return api.post(
      API_ENDPOINTS.TRACKS.LIKE(id),
      undefined,
      {
        auth: true,
      },
    );
  },

  unlike(id: string) {
    return api.delete(
      API_ENDPOINTS.TRACKS.UNLIKE(id),
      {
        auth: true,
      },
    );
  },

  likesCount(id: string) {
    return api.get<number>(
      API_ENDPOINTS.TRACKS.LIKES_COUNT(id),
    );
  },
  play(id: string) {
    return api.post(
      API_ENDPOINTS.TRACKS.PLAY(id),
      undefined,
      {
        auth: true,
      },
    )
  },
  trending(limit = 10) {
    const params = new URLSearchParams({
      limit: String(limit),
    });

    return api.get<TrackTrendingResponse>(
      `${API_ENDPOINTS.TRACKS.TRENDING}?${params.toString()}`,
    );
  },

};