import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Track } from "@/types/music";

export interface GenreListResponse {
    data: Genre[]
}

export interface Genre {
    id: string
    name: string;
    slug: string;
    tracks: Track[]
}

export const genresService = {
    list() {
        return api.get<GenreListResponse>(
            API_ENDPOINTS.Genres.LIST,
            {
                auth: true
            }
        )
    }
}