import { PlaylistMedia } from "@/entities/Media";
import { Participant } from "@/entities/Participant";
import { Room } from "@/entities/Room";

export const EmitEvent = {
    ERROR: 'error',
    JOINED: 'joined',
    LEFT: 'left',
    ROOM_UPDATED: 'roomUpdated',
    ROOM_DELETED: 'roomDeleted',
    MESSAGE_SENT: 'messageSent',
    PLAYLIST_MEDIA_ADDED: 'playlistMediaAdded',
    PLAYLIST_MEDIA_DELETED: 'playlistMediaDeleted',
    PLAYLIST_MEDIA_UPDATED: 'playlistMediaUpdated',
    PLAYLIST_MEDIA_SETTED_TO_PLAYER: 'playlistMediaSettedToPlayer',
    SYNC_PLAYER_STATE: 'syncPlayerState',
    SEND_PLAYER_STATE_FROM_CLIENT: 'sendPlayerStateFromClient',
} as const;
export type ListenEventType = ValueOf<typeof EmitEvent>;

export type ListenEventAction<T extends any> = (argument: T) => void;


export interface SocketListener extends Record<ListenEventType, ListenEventAction<any>> {
    [EmitEvent.ERROR]: (e: { message: string }) => void,
    [EmitEvent.JOINED]: (e: Participant) => void,
    [EmitEvent.LEFT]: (e: Participant) => void,
    [EmitEvent.ROOM_UPDATED]: (e: Room) => void,
    [EmitEvent.ROOM_DELETED]: (e: Room) => void,
    [EmitEvent.MESSAGE_SENT]: (e: { message: string, participant: Participant, timeSent: number }) => void,
    [EmitEvent.PLAYLIST_MEDIA_ADDED]: (e: PlaylistMedia) => void,
    [EmitEvent.PLAYLIST_MEDIA_DELETED]: (e: PlaylistMedia) => void,
    [EmitEvent.PLAYLIST_MEDIA_UPDATED]: (e: PlaylistMedia) => void,
    [EmitEvent.PLAYLIST_MEDIA_SETTED_TO_PLAYER]: (e: PlaylistMedia) => void,
    [EmitEvent.SYNC_PLAYER_STATE]: (e: { currentTime: number, isPaused: boolean }) => void,
    [EmitEvent.SEND_PLAYER_STATE_FROM_CLIENT]: (e: { userSID: string }) => void,
}
