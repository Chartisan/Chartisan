import { loader } from './loader/index';
import { error } from './error/index';
import { isServerData } from './data';
export var ChartState;
(function (ChartState) {
    ChartState["Initializing"] = "initializing";
    ChartState["Loading"] = "loading";
    ChartState["Error"] = "error";
    ChartState["Show"] = "show";
})(ChartState || (ChartState = {}));
export class Chartisan {
    constructor(options) {
        this.options = {
            el: '.chart',
            url: '',
            loader: {
                type: 'bar',
                size: [35, 35],
                color: '#000',
                text: 'Loading chart',
                textColor: '#a0aec0'
            },
            error: {
                type: 'general',
                size: [50, 50],
                color: '#f56565',
                text: 'There was an error',
                textColor: '#a0aec0',
                debug: true
            }
        };
        this.cstate = ChartState.Initializing;
        const { el } = (this.options = Object.assign(Object.assign({}, this.options), options));
        const element = document.querySelector(el);
        if (!element)
            throw Error(`[Chartisan] Unable to find an element to bind the chart to a DOM element with the selector = '${el}'`);
        this.element = element;
        this.controller = document.createElement('div');
        this.bootstrap();
    }
    changeTo(state, err) {
        switch (state) {
            case (ChartState.Initializing, ChartState.Loading): {
                this.controller.innerHTML = loader(this.options.loader);
                break;
            }
            case ChartState.Show: {
                this.controller.innerHTML = '';
                break;
            }
            case ChartState.Error: {
                this.controller.innerHTML = error(this.options.error, (err !== null && err !== void 0 ? err : new Error('Unknown Error')));
                this.refreshEvent();
                break;
            }
        }
        this.cstate = state;
    }
    bootstrap() {
        this.element.appendChild(this.controller);
        this.controller.classList.add('chartisan');
        this.request();
    }
    request() {
        this.changeTo(ChartState.Loading);
        fetch(this.options.url)
            .then(res => res.json())
            .then(res => this.onRawUpdate(res))
            .catch(err => this.onError(err));
    }
    refreshEvent() {
        const refresh = this.controller.getElementsByClassName('chartisan-refresh-chart')[0];
        refresh.addEventListener('click', () => this.refresh(), { once: true });
    }
    refresh() {
        this.request();
    }
    onRawUpdate(response) {
        if (!isServerData(response))
            return this.onError(new Error('Invalid server data'));
        this.changeTo(ChartState.Show);
        this.onUpdate(response);
    }
    onError(err) {
        this.changeTo(ChartState.Error, err);
    }
    state() {
        return this.cstate;
    }
}
