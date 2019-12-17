interface Converter<F, T> {
    to(to: T): F;

    from(from: F): T;
}
