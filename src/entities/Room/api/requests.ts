import { buildApi } from "@/shared/api/lib/useApi";
import { Room } from "../model/types/room";
import { Participant } from "@/entities/Participant";

export type RoomWithParticipants = Room & { participants: Participant[] }

export const useGetAllRoomsApi = buildApi<RoomWithParticipants[], void>('getAllRooms', {
    url: '/room/all',
    method: 'GET'
});

export const useCreateRoomApi = buildApi<Room, FormData>('createRoom', {
    url: '/room',
    method: 'POST',
    withCredentials: true,
    headers: {'Content-Type': 'multipart/form-data'}
});

export const useUpdateRoomApi = buildApi<Room, FormData>('updateRoom', {
    url: '/room',
    method: 'PATCH',
    withCredentials: true,
    headers: {'Content-Type': 'multipart/form-data'}
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