export interface Mapper<F, T> {
    map(from: F): T;
}
