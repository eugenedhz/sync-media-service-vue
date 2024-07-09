export const EmitEvent = {
    ROOM_JOIN: 'join',
    LEAVE: 'leave',
    ADD_PLAYLIST_MEDIA: 'addPlaylistMedia',
    UPDATE_PLAYLIST_MEDIA: 'updatePlaylistMedia',
    DELETE_PLAYLIST_MEDIA: 'deletePlaylistMedia',
    SET_PLAYLIST_MEDIA_TO_PLAYER: 'setPlaylistMediaToPlayer',
    REQUEST_PLAYER_STATE: 'requestPlayerState',
    SEND_PLAYER_STATE_TO_EVERYONE: 'sendPlayerStateToEveryone',
    SEND_PLAYER_STATE_TO_USER: 'sendPlayerStateToUser',
    SEND_MESSAGE: 'sendMessage'
} as const;
export type EmitEventType = ValueOf<typeof EmitEvent>;

export type EmitEventAction<T extends any> = (argument: T) => void;

export interface SocketEmitter extends Record<EmitEventType, EmitEventAction<any>> {
    [EmitEvent.ROOM_JOIN]: (e: { roomId: number}) => void,
    [EmitEvent.LEAVE]: (e: { roomId: number}) => void,
    [EmitEvent.ADD_PLAYLIST_MEDIA]: (e: { roomId: number, mediaId: number }) => void,
    [EmitEvent.DELETE_PLAYLIST_MEDIA]: (e: { playlistMediaId: number }) => void,
    [EmitEvent.REQUEST_PLAYER_STATE]: (e: { roomId: number }) => void,
    [EmitEvent.SEND_PLAYER_STATE_TO_EVERYONE]: (e: { 
        currentTime: number, 
        isPaused: boolean, 
        roomId: number 
    }) => void,
    [EmitEvent.SEND_PLAYER_STATE_TO_USER]:(e: { 
        currentTime: number, 
        isPaused: boolean, 
        userSID: string
    }) => void,
    [EmitEvent.SET_PLAYLIST_MEDIA_TO_PLAYER]: (e: { playlistMediaId: number }) => void,
    [EmitEvent.SEND_MESSAGE]: (e: { message: string, roomId: number }) => void,
    [EmitEvent.UPDATE_PLAYLIST_MEDIA]: (e: { order: number, playlistMediaId: number }) => void,
}
