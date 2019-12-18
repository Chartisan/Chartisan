export interface LoaderOptions {
    color: string;
    size: [number, number];
    textColor: string;
}
export declare const loader: ({ color, size, textColor }: LoaderOptions) => string;
