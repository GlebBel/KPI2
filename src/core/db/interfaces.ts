export interface SearchOptions<T> {
    pageable?: Pageable;
    ordering?: Ordering<T>;
}
export interface Pageable {
    page: number;
    size: number;
}

export type Ordering<T> = {[key in keyof T]?: 'ASC' | 'DESC' };
