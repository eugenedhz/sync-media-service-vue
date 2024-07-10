import { buildApi } from "@/shared/api/lib/useApi";
import { Genre } from "../model/types/genre";

export const useGetAllGenreApi = buildApi<Genre[], void>('getAllGenres', {
    url: '/genre/all',
    method: 'GET',
    withCredentials: true,
});