type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type OptionalRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

type ValueOf<T> = T[keyof T];
