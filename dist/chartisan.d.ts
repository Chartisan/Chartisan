import { LoaderOptions } from './loader/index';
import { ErrorOptions } from './error/index';
export declare enum ChartState {
    Initializing = "initializing",
    Loading = "loading",
    Error = "error",
    Show = "show"
}
export interface ChartisanOptions {
    el?: string;
    url: string;
    loader?: LoaderOptions;
    error?: ErrorOptions;
}
export interface isChartisan {
    new (options: ChartisanOptions): Chartisan;
}
export declare abstract class Chartisan {
    protected options: ChartisanOptions;
    protected element: Element;
    protected controller: HTMLDivElement;
    protected cstate: ChartState;
    constructor(options: ChartisanOptions);
    protected changeTo(state: ChartState, err?: Error): void;
    protected bootstrap(): void;
    protected request(): void;
    protected refreshEvent(): void;
    refresh(): void;
    protected onRawUpdate(response: JSON): void;
    protected abstract onUpdate(response: JSON): void;
    protected onError(err: Error): void;
    state(): ChartState;
}
