"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigatorHandle = void 0;
var NavigatorHandle = /** @class */ (function () {
    function NavigatorHandle(rangeHandle) {
        this.rh = rangeHandle;
    }
    Object.defineProperty(NavigatorHandle.prototype, "fill", {
        get: function () {
            return this.rh.fill;
        },
        set: function (value) {
            this.rh.fill = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "stroke", {
        get: function () {
            return this.rh.stroke;
        },
        set: function (value) {
            this.rh.stroke = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "strokeWidth", {
        get: function () {
            return this.rh.strokeWidth;
        },
        set: function (value) {
            this.rh.strokeWidth = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "width", {
        get: function () {
            return this.rh.width;
        },
        set: function (value) {
            this.rh.width = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "height", {
        get: function () {
            return this.rh.height;
        },
        set: function (value) {
            this.rh.height = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "gripLineGap", {
        get: function () {
            return this.rh.gripLineGap;
        },
        set: function (value) {
            this.rh.gripLineGap = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "gripLineLength", {
        get: function () {
            return this.rh.gripLineLength;
        },
        set: function (value) {
            this.rh.gripLineLength = value;
        },
        enumerable: false,
        configurable: true
    });
    return NavigatorHandle;
}());
exports.NavigatorHandle = NavigatorHandle;
