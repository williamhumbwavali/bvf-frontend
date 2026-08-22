import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

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

export const usersService = {
  getHistory() {
    return api.get<PlaybackHistory[]>(
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
    return api.get<Like[]>(
      API_ENDPOINTS.USERS.LIKED_TRACKS,
      {
        auth: true,
      },
    );
  },

  getDownloads() {
    return api.get<DownloadHistory[]>(
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
};