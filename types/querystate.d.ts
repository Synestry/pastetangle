interface QueryStateOptions {
    castsToArray?: boolean,
    autoApply?: boolean
}

interface QueryState {
    all(): {}
    get(key: string, defaultValue?: string): string | undefined
    set(key: string, value: string): string
    remove(key: string): string
    toQueryString(): string
}

declare function QueryStateConstructor(params: QueryStateOptions): QueryState;

declare module "querystate" {
    export = QueryStateConstructor;
}