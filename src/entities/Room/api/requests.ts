import { buildApi } from "@/shared/api/lib/useApi";
import { Room } from "../model/types/room";

export const useGetAllRoomsApi = buildApi<Room[], void>('getAllRooms', {
    url: '/room/all',
    method: 'GET',
    withCredentials: true,
});