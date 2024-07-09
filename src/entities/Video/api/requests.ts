import { buildApi } from "@/shared/api/lib/useApi";
import { VideoMedia } from '../model/types/video';

export const useGetAllVideoMediaApi = buildApi<VideoMedia[], void>('getAllMediaVideo', {
    url: '/media/video/all',
    method: 'GET',
    withCredentials: true
})