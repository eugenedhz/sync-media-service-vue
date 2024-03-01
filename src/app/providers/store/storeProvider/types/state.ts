import { ExampleModuleStateSchema, exampleNamespace } from '@/pages/HomePage';

export interface StateSchema {
    [exampleNamespace]?: ExampleModuleStateSchema;
}

export type StateSchemaKey = keyof StateSchema;