export const EmitEvent = {
    PLAY: 'play'
} as const;
export type EmitEventType = ValueOf<typeof EmitEvent>;

export type EmitEventAction<T extends any> = (argument: T) => void;

export interface SocketEmitter extends Record<EmitEventType, EmitEventAction<any>> {
    [EmitEvent.PLAY]: (e: number) => void,
}
