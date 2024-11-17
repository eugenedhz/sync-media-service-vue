import { buildApi } from "@/shared/api/lib/useApi";
import { Room } from "../model/types/room";
import { Participant } from "@/entities/Participant";

export type RoomWithParticipants = Room & { participants: Participant[] }

export const useGetAllRoomsApi = buildApi<RoomWithParticipants[], void>('getAllRooms', {
    url: '/room/all',
    method: 'GET'
});

export interface CreateRoomArgs {
    title: string;
}

export const useCreateRoomApi = buildApi<Room, CreateRoomArgs>('createRoom', {
    url: '/room',
    method: 'POST',
    withCredentials: true
});

export const useGetRoomApi = buildApi<RoomWithParticipants, void>('getRoom', {
    url: '/room',
    method: 'GET'
});

export const useDeleteRoomApi = buildApi<Room, void>('deleteRoom', {
    url: '/room',
    method: 'DELETE',
    withCredentials: true
});


export const useGetRoomWithPartsApi = buildApi<RoomWithParticipants, void>('getAllRooms', {
    url: '/room',
    method: 'GET'
});