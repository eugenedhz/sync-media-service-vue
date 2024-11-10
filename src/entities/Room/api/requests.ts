import { buildApi } from "@/shared/api/lib/useApi";
import { Room } from "../model/types/room";

export const useGetAllRoomsApi = buildApi<Room[], void>('getAllRooms', {
    url: '/room/all',
    method: 'GET',
    withCredentials: true,
});

export interface CreateRoomArgs {
    title: string;
}

export const useCreateRoomApi = buildApi<Room, CreateRoomArgs>('createRoom', {
    url: '/room',
    method: 'POST',
    withCredentials: true
});

export const useGetRoomApi = buildApi<Room, void>('getRoom', {
    url: '/room',
    method: 'GET'
});