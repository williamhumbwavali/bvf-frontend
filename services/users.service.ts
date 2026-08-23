import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { Track } from './tracks.service';

export interface PlaybackHistory {
  id: string;
  userId: string;
  trackId: string;
  progressSec?: number;
  playedAt: string;
}

export interface Like {
  id: string;
  userId: string;
  trackId: string;
  createdAt: string;
  track: Track;
}

export interface DownloadHistoryResponse {
  data: DownloadHistory[];
}

export interface DownloadHistory {
  id: string;
  userId: string;
  trackId: string;
  downloadedAt: string;
}

export interface ArtistFollower {
  id: string;
  userId: string;
  artistId: string;
  createdAt: string;
}

export interface LikedResponse {
  data: Like[];
}

export interface PlaybackHistoryResponse {
  data: PlaybackHistory[];
}

/**
 * Dados que podem ser atualizados pelo usuário.
 *
 * username -> User.username
 * handle   -> Artist.handle
 * name     -> User.name + Artist.name
 * bio      -> User.bio + Artist.bio
 * genre    -> User.genre + Artist.genre
 * avatarUrl -> User.avatarUrl + Artist.image
 */
export interface UpdateProfileData {
  name?: string;
  username?: string;
  bio?: string;
  genre?: string;
  avatarUrl?: string;
}

/**
 * Resposta da atualização do perfil.
 */
export interface UpdateProfileResponse {
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      avatarUrl: string | null;
      bio: string | null;
      genre: string | null;
      role: string;
    };

    artist?: {
      id: string;
      name: string;
      handle: string;
      genre: string | null;
      image: string | null;
      verified: boolean;
      followers: number;
      bio: string | null;
      userId: string;
    };
  };
}

export const usersService = {
  getHistory() {
    return api.get<PlaybackHistoryResponse>(
      API_ENDPOINTS.USERS.HISTORY,
      {
        auth: true,
      },
    );
  },

  clearHistory() {
    return api.delete(
      API_ENDPOINTS.USERS.CLEAR_HISTORY,
      {
        auth: true,
      },
    );
  },

  getLikedTracks() {
    return api.get<LikedResponse>(
      API_ENDPOINTS.USERS.LIKED_TRACKS,
      {
        auth: true,
      },
    );
  },

  getDownloads() {
    return api.get<DownloadHistoryResponse>(
      API_ENDPOINTS.USERS.DOWNLOADS,
      {
        auth: true,
      },
    );
  },

  getFollowing() {
    return api.get<ArtistFollower[]>(
      API_ENDPOINTS.USERS.FOLLOWING,
      {
        auth: true,
      },
    );
  },
  updateProfile(data: UpdateProfileData) {
    return api.patch<UpdateProfileResponse>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      data,
      {
        auth: true,
      },
    );
  },
};