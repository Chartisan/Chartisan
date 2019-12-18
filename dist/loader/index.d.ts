export declare type LoaderType = 'bar';
export interface LoaderOptions {
    color: string;
    size: [number, number];
    type: LoaderType;
    textColor: string;
    text: string;
}
export declare const loader: (options: LoaderOptions) => string;
