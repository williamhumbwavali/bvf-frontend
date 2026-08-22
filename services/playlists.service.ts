import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  ownerId: string;
  tracks?: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlaylistData {
  title: string;
  description?: string;
  coverUrl?: string;
}

export const playlistsService = {
  list() {
    return api.get<Playlist[]>(
      API_ENDPOINTS.PLAYLISTS.LIST,
      {
        auth: true,
      },
    );
  },

  getById(id: string) {
    return api.get<Playlist>(
      API_ENDPOINTS.PLAYLISTS.BY_ID(id),
      {
        auth: true,
      },
    );
  },

  create(data: CreatePlaylistData) {
    return api.post<Playlist>(
      API_ENDPOINTS.PLAYLISTS.CREATE,
      data,
      {
        auth: true,
      },
    );
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
    );
  },

  delete(id: string) {
    return api.delete(
      API_ENDPOINTS.PLAYLISTS.DELETE(id),
      {
        auth: true,
      },
    );
  },
};