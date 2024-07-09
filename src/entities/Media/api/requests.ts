import { api } from "@/shared/api";
import { buildApi } from "@/shared/api/lib/useApi";
import { PlaylistMedia } from "../model/types/playlistMedia";

export const getAllMediaNamespace = 'getAllMedia';
export const getAllPlaylistMediaNamespace = 'getAllPlaylistMedia';
export const getMediaNamespace = 'getMedia';

export interface Genre {
    id: number;
    name: string;
    slug: string;
}

export interface Media {
    id: number;
    name: string;
    description: string;
    preview: string;
    thumbnail: string;
    trailer: string;
}

export type MediaWithGenres = Media & { genres: Genre[] }

export const useGetAllMediaApi = buildApi<MediaWithGenres[], void>(getAllMediaNamespace, {
    url: '/media/all',
    method: 'GET',
    withCredentials: true,
    params: {
        expand: 'genres'
    }
});

export const useGetAllPlaylistMediaApi = buildApi<PlaylistMedia[], void>(getAllPlaylistMediaNamespace, {
    url: '/playlist_media/all',
    method: 'GET',
    withCredentials: true,
});

export const fetchAllMedias = (params: { limit: number, offset: number }) => api.get('/media/all', {
    params: {
        expand: 'genres',
        ...params
    }
});