function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".chartisan-controller,\n.chartisan-body {\n    position: relative;\n    height: 100%;\n    width: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n.chartisan-modal {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    justify-content: center;\n    align-items: center;\n}\n.chartisan-help-block {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n}\n.chartisan-help-text {\n    margin-top: 1.5rem;\n    text-transform: uppercase;\n    letter-spacing: 0.2em;\n    font-size: 0.75rem;\n}\n.chartisan-help-text-error {\n    margin-top: 1.5rem;\n    text-transform: uppercase;\n    letter-spacing: 0.2em;\n    font-size: 0.6rem;\n    color: #f56565;\n}\n.chartisan-refresh-chart {\n    cursor: pointer;\n}\n";
styleInject(css);

/**
 * Determines if the given object satisfies ChartData.
 *
 * @export
 * @param {*} obj
 * @returns {obj is ChartData}
 */
function isChartData(obj) {
    return 'labels' in obj && 'extra' in obj;
}
/**
 * Determines if obj satisfies ChartData.
 *
 * @export
 * @param {*} obj
 * @returns {obj is DatasetData}
 */
function isDatasetData(obj) {
    return 'id' in obj && 'name' in obj && 'values' in obj && 'extra' in obj;
}
/**
 * Determine if the given  object satisfies ServerData.
 *
 * @export
 * @param {*} obj
 * @returns {obj is ServerData}
 */
function isServerData(obj) {
    return ('chart' in obj &&
        'datasets' in obj &&
        isChartData(obj.chart) &&
        obj.datasets.every(function (d) { return isDatasetData(d); }));
}

/**
 * Represents the hooks of the chart.
 *
 * @export
 * @class Hooks
 * @template D
 */
var Hooks = /** @class */ (function () {
    function Hooks() {
        /**
         * Stores the hooks.
         *
         * @type {Hook<D>[]}
         * @memberof Hooks
         */
        this.hooks = [];
    }
    /**
     * Appends a custom hook
     *
     * @param {Hook<D>} hook
     * @returns {this}
     * @memberof Hooks
     */
    Hooks.prototype.custom = function (hook) {
        this.hooks.push(hook);
        return this;
    };
    /**
     * Merges the given options to the chart.
     *
     * @param {D} options
     * @returns
     * @memberof Hooks
     */
    Hooks.prototype.options = function (options) {
        return this.custom(function (chart, merge) { return merge(chart, options); });
    };
    return Hooks;
}());

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return target.propertyIsEnumerable(symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

var cjs = deepmerge_1;

/**
 * Stores the default color palette.
 *
 * @export
 * @type {string[]}
 */
var colorPalette = [
    '#667EEA',
    '#F56565',
    '#48BB78',
    '#ED8936',
    '#9F7AEA',
    '#38B2AC',
    '#ECC94B',
    '#4299E1',
    '#ED64A6'
];
/**
 * Used to merge different nested options.
 *
 * @export
 * @type {typeof merge}
 */
var mergeOptions = cjs;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var general = (function (_a) {
    var size = _a.size, color = _a.color;
    return "\n    <svg\n        role=\"img\"\n        xmlns=\"http://www.w3.org/2000/svg\"\n        width=\"" + size[0] + "\"\n        height=\"" + size[1] + "\"\n        viewBox=\"0 0 24 24\"\n        aria-labelledby=\"refreshIconTitle\"\n        stroke=\"" + color + "\"\n        stroke-width=\"1\"\n        stroke-linecap=\"square\"\n        stroke-linejoin=\"miter\"\n        fill=\"none\"\n        color=\"" + color + "\"\n    >\n        <title id=\"refreshIconTitle\">Refresh</title>\n        <polyline points=\"22 12 19 15 16 12\"/>\n        <path d=\"M11,20 C6.581722,20 3,16.418278 3,12 C3,7.581722 6.581722,4 11,4 C15.418278,4 19,7.581722 19,12 L19,14\"/>\n    </svg>\n";
});

var errors = {
    general: general
};
var error = function (options, error) { return "\n    <div class=\"chartisan-help-block\">\n    <div class=\"chartisan-refresh-chart\">\n        " + errors[options.type](options) + "\n    </div>\n    " + (options.text != ''
    ? "\n                <div class=\"chartisan-help-text\" style=\"color: " + options.textColor + ";\">\n                    " + options.text + "\n                </div>\n            "
    : '') + "\n    " + (options.debug
    ? "<div class=\"chartisan-help-text-error\">\n        " + error.message + "\n    </div>"
    : '') + "\n    </div>\n"; };

/**
 * The bar loader.
 *
 * @export
 * @param {LoaderOptions} { size, color }
 */
var bar = (function (_a) {
    var size = _a.size, color = _a.color;
    return "\n    <svg width=\"" + size[0] + "\" height=\"" + size[1] + "\" viewBox=\"0 0 135 140\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"" + color + "\">\n        <rect y=\"10\" width=\"15\" height=\"120\" rx=\"6\">\n            <animate attributeName=\"height\"\n                begin=\"0.5s\" dur=\"1s\"\n                values=\"120;110;100;90;80;70;60;50;40;140;120\" calcMode=\"linear\"\n                repeatCount=\"indefinite\" />\n            <animate attributeName=\"y\"\n                begin=\"0.5s\" dur=\"1s\"\n                values=\"10;15;20;25;30;35;40;45;50;0;10\" calcMode=\"linear\"\n                repeatCount=\"indefinite\" />\n        </rect>\n        <rect x=\"30\" y=\"10\" width=\"15\" height=\"120\" rx=\"6\">\n            <animate attributeName=\"height\"\n                begin=\"0.25s\" dur=\"1s\"\n                values=\"120;110;100;90;80;70;60;50;40;140;120\" calcMode=\"linear\"\n                repeatCount=\"indefinite\" />\n            <animate attributeName=\"y\"\n                begin=\"0.25s\" dur=\"1s\"\n                values=\"10;15;20;25;30;35;40;45;50;0;10\" calcMode=\"linear\"\n                repeatCount=\"indefinite\" />\n        </rect>\n        <rect x=\"60\" width=\"15\" height=\"140\" rx=\"6\">\n            <animate attributeName=\"height\"\n                begin=\"0s\" dur=\"1s\"\n                values=\"120;110;100;90;80;70;60;50;40;140;120\" calcMode=\"linear\"\n                repeatCount=\"indefinite\" />\n            <animate attributeName=\"y\"\n                begin=\"0s\" dur=\"1s\"\n                values=\"10;15;20;25;30;35;40;45;50;0;10\" calcMode=\"linear\"\n                repeatCount=\"indefinite\" />\n        </rect>\n        <rect x=\"90\" y=\"10\" width=\"15\" height=\"120\" rx=\"6\">\n            <animate attributeName=\"height\"\n                begin=\"0.25s\" dur=\"1s\"\n                values=\"120;110;100;90;80;70;60;50;40;140;120\" calcMode=\"linear\"\n                repeatCount=\"indefinite\" />\n            <animate attributeName=\"y\"\n                begin=\"0.25s\" dur=\"1s\"\n                values=\"10;15;20;25;30;35;40;45;50;0;10\" calcMode=\"linear\"\n                repeatCount=\"indefinite\" />\n        </rect>\n        <rect x=\"120\" y=\"10\" width=\"15\" height=\"120\" rx=\"6\">\n            <animate attributeName=\"height\"\n                begin=\"0.5s\" dur=\"1s\"\n                values=\"120;110;100;90;80;70;60;50;40;140;120\" calcMode=\"linear\"\n                repeatCount=\"indefinite\" />\n            <animate attributeName=\"y\"\n                begin=\"0.5s\" dur=\"1s\"\n                values=\"10;15;20;25;30;35;40;45;50;0;10\" calcMode=\"linear\"\n                repeatCount=\"indefinite\" />\n        </rect>\n    </svg>\n";
});

/**
 * Determines the available loaders.
 *
 * @type {string}
 * @memberof LoaderOptions
 */
var loaders = {
    bar: bar
};
/**
 * Creates the loader given the options.
 *
 * @export
 * @param {LoaderOptions} { color, size, type, textColor }
 */
var loader = function (options) { return "\n    <div class=\"chartisan-help-block\">\n        " + loaders[options.type](options) + "\n        " + (options.text != ''
    ? "\n                    <div class=\"chartisan-help-text\" style=\"color: " + options.textColor + ";\">\n                        " + options.text + "\n                    </div>\n                "
    : '') + "\n    </div>\n"; };

/**
 * Represents the states of the chart.
 *
 * @export
 * @enum {number}
 */
var ChartState;
(function (ChartState) {
    ChartState["Initializing"] = "initializing";
    ChartState["Loading"] = "loading";
    ChartState["Error"] = "error";
    ChartState["Show"] = "show";
})(ChartState || (ChartState = {}));
/**
 * Chartisan class
 *
 * @export
 * @abstract
 * @class Chartisan
 * @template D
 */
var Chartisan = /** @class */ (function () {
    /**
     * Creates an instance of Chartisan.
     *
     * @param {ChartisanOptions} { identifier }
     * @memberof Chartisan
     */
    function Chartisan(options) {
        /**
         * Stores the chartisan options. The options
         * assigned here are the defaults and can be
         * overwritten given the constructor options.
         *
         * @protected
         * @type {ChartisanOptions}
         * @memberof Chartisan
         */
        this.options = {
            el: '.chart',
            url: undefined,
            options: undefined,
            data: undefined,
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
            },
            hooks: undefined
        };
        /**
         * State of the chart.
         *
         * @protected
         * @type {ChartState}
         * @memberof Chartisan
         */
        this.cstate = ChartState.Initializing;
        var el = (this.options = __assign(__assign({}, this.options), options)).el;
        var element = document.querySelector(el);
        if (!element)
            throw Error("[Chartisan] Unable to find an element to bind the chart to a DOM element with the selector = '" + el + "'");
        this.element = element;
        this.controller = document.createElement('div');
        this.body = document.createElement('div');
        this.modal = document.createElement('div');
        this.bootstrap();
    }
    /**
     * Set he modal settings.
     *
     * @private
     * @param {ModalOptions} {
     *         show = true,
     *         color = '#FFFFFF',
     *         content
     *     }
     * @memberof Chartisan
     */
    Chartisan.prototype.setModal = function (_a) {
        var _b = _a.show, show = _b === void 0 ? true : _b, _c = _a.color, color = _c === void 0 ? '#FFFFFF' : _c, content = _a.content;
        this.modal.style.backgroundColor = color;
        this.modal.style.display = show ? 'flex' : 'none';
        if (content)
            this.modal.innerHTML = content;
    };
    /**
     * Changes the status of the chart.
     *
     * @protected
     * @param {ChartState} state
     * @memberof Chartisan
     */
    Chartisan.prototype.changeTo = function (state, err) {
        switch (state) {
            case (ChartState.Initializing, ChartState.Loading): {
                // this.body.innerHTML = loader(this.options.loader!)
                this.setModal({
                    show: true,
                    content: loader(this.options.loader)
                });
                break;
            }
            case ChartState.Show: {
                // this.body.innerHTML = ''
                this.setModal({ show: false });
                break;
            }
            case ChartState.Error: {
                this.setModal({
                    show: true,
                    content: error(this.options.error, (err !== null && err !== void 0 ? err : new Error('Unknown Error')))
                });
                this.refreshEvent();
                break;
            }
        }
        this.cstate = state;
    };
    /**
     * Bootstraps the chart.
     *
     * @protected
     * @memberof Chartisan
     */
    Chartisan.prototype.bootstrap = function () {
        // Append the controller and the modal
        // to the element.
        this.element.appendChild(this.controller);
        this.controller.appendChild(this.body);
        this.controller.appendChild(this.modal);
        // Append the classes to them.
        this.controller.classList.add('chartisan-controller');
        this.body.classList.add('chartisan-body');
        this.modal.classList.add('chartisan-modal');
        this.update(this.options);
    };
    /**
     * Requests the data to the server.
     *
     * @protected
     * @template U
     * @param {UpdateOptions<U>} [options]
     * @memberof Chartisan
     */
    Chartisan.prototype.request = function (options) {
        var _this = this;
        if (!this.options.url)
            return this.onError(new Error('No URL provided to fetch the data.'));
        fetch(this.options.url, this.options.options)
            .then(function (res) { return res.json(); })
            .then(function (res) { return _this.onRawUpdate(res, options); })
            .catch(function (err) { return _this.onError(err); });
    };
    /**
     * Attaches the refresh event handler to the icon.
     *
     * @protected
     * @memberof Chartisan
     */
    Chartisan.prototype.refreshEvent = function () {
        var _this = this;
        var refresh = this.controller.getElementsByClassName('chartisan-refresh-chart')[0];
        refresh.addEventListener('click', function () { return _this.update(); }, { once: true });
    };
    /**
     * Refresh the chart with new information.
     *
     * @param {boolean} [setLoading=true]
     * @memberof Chartisan
     */
    Chartisan.prototype.update = function (options) {
        var _a, _b, _c, _d, _e, _f, _g;
        // Replace the configuration options.
        if ((_a = options) === null || _a === void 0 ? void 0 : _a.url)
            this.options.url = options.url;
        if ((_b = options) === null || _b === void 0 ? void 0 : _b.options)
            this.options.options = options.options;
        // Check to see if it's static data.
        if ((_c = options) === null || _c === void 0 ? void 0 : _c.data) {
            // There's no need to request
            // new data from the server.
            var serverData = void 0;
            if (!isServerData(options.data)) {
                if (!((_d = options) === null || _d === void 0 ? void 0 : _d.background))
                    this.changeTo(ChartState.Loading);
                serverData = options.data();
            }
            else {
                serverData = options.data;
            }
            var data = this.getDataFrom(serverData);
            this.changeTo(ChartState.Show);
            return options.background
                ? this.onBackgroundUpdate(data, (_e = options) === null || _e === void 0 ? void 0 : _e.additional)
                : this.onUpdate(data, (_f = options) === null || _f === void 0 ? void 0 : _f.additional);
        }
        if (!((_g = options) === null || _g === void 0 ? void 0 : _g.background))
            this.changeTo(ChartState.Loading);
        this.request(options);
    };
    /**
     * Gets the data from a given request, applying
     * the hooks of the chart.
     *
     * @protected
     * @param {ServerData} response
     * @returns
     * @memberof Chartisan
     */
    Chartisan.prototype.getDataFrom = function (response) {
        var data = this.formatData(response);
        if (this.options.hooks) {
            for (var _i = 0, _a = this.options.hooks.hooks; _i < _a.length; _i++) {
                var hook = _a[_i];
                data = hook(data, mergeOptions);
            }
        }
        return data;
    };
    /**
     * Called when the data is correctly recieved from
     * the server. This method calls onUpdate() internally.
     *
     * @protected
     * @template U
     * @param {JSON} response
     * @param {UpdateOptions<U>} [options]
     * @returns
     * @memberof Chartisan
     */
    Chartisan.prototype.onRawUpdate = function (response, options) {
        var _a, _b, _c;
        if (!isServerData(response))
            return this.onError(new Error('Invalid server data'));
        var data = this.getDataFrom(response);
        this.changeTo(ChartState.Show);
        ((_a = options) === null || _a === void 0 ? void 0 : _a.background) ? this.onBackgroundUpdate(data, (_b = options) === null || _b === void 0 ? void 0 : _b.additional)
            : this.onUpdate(data, (_c = options) === null || _c === void 0 ? void 0 : _c.additional);
    };
    /**
     * Handles an error when getting the data of the chart.
     *
     * @protected
     * @param {Error} error
     * @memberof Chartisan
     */
    Chartisan.prototype.onError = function (err) {
        this.changeTo(ChartState.Error, err);
    };
    /**
     * Returns the current chart state.
     *
     * @returns {ChartState}
     * @memberof Chartisan
     */
    Chartisan.prototype.state = function () {
        return this.cstate;
    };
    return Chartisan;
}());

export { ChartState, Chartisan, Hooks, colorPalette, error, isChartData, isDatasetData, isServerData, loader, mergeOptions };
