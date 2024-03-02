export const EmitEvent = {
    PLAY: 'play'
} as const;
export type ListenEventType = ValueOf<typeof EmitEvent>;

export type ListenEventAction<T extends any> = (argument: T) => void;

export interface SocketListener extends Record<ListenEventType, ListenEventAction<any>> {
    [EmitEvent.PLAY]: (e: string) => void,
}
