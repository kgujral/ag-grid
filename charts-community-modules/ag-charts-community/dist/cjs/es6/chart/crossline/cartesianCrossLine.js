"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartesianCrossLine = void 0;
const node_1 = require("../../scene/node");
const group_1 = require("../../scene/group");
const text_1 = require("../../scene/shape/text");
const continuousScale_1 = require("../../scale/continuousScale");
const id_1 = require("../../util/id");
const chartAxisDirection_1 = require("../chartAxisDirection");
const crossLineLabelPosition_1 = require("./crossLineLabelPosition");
const value_1 = require("../../util/value");
const layers_1 = require("../layers");
const range_1 = require("../../scene/shape/range");
const validation_1 = require("../../util/validation");
const label_1 = require("../label");
const CROSSLINE_LABEL_POSITIONS = [
    'top',
    'left',
    'right',
    'bottom',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
    'inside',
    'insideLeft',
    'insideRight',
    'insideTop',
    'insideBottom',
    'insideTopLeft',
    'insideBottomLeft',
    'insideTopRight',
    'insideBottomRight',
];
const OPT_CROSSLINE_LABEL_POSITION = validation_1.predicateWithMessage((v, ctx) => validation_1.OPTIONAL(v, ctx, (v) => CROSSLINE_LABEL_POSITIONS.includes(v)), `expecting an optional crossLine label position keyword such as 'topLeft', 'topRight' or 'inside'`);
const OPT_CROSSLINE_TYPE = validation_1.predicateWithMessage((v, ctx) => validation_1.OPTIONAL(v, ctx, (v) => v === 'range' || v === 'line'), `expecting a crossLine type keyword such as 'range' or 'line'`);
class CartesianCrossLineLabel {
    constructor() {
        this.enabled = undefined;
        this.text = undefined;
        this.fontStyle = undefined;
        this.fontWeight = undefined;
        this.fontSize = 14;
        this.fontFamily = 'Verdana, sans-serif';
        /**
         * The padding between the label and the line.
         */
        this.padding = 5;
        /**
         * The color of the labels.
         */
        this.color = 'rgba(87, 87, 87, 1)';
        this.position = undefined;
        this.rotation = undefined;
        this.parallel = undefined;
    }
}
__decorate([
    validation_1.Validate(validation_1.OPT_BOOLEAN)
], CartesianCrossLineLabel.prototype, "enabled", void 0);
__decorate([
    validation_1.Validate(validation_1.OPT_STRING)
], CartesianCrossLineLabel.prototype, "text", void 0);
__decorate([
    validation_1.Validate(validation_1.OPT_FONT_STYLE)
], CartesianCrossLineLabel.prototype, "fontStyle", void 0);
__decorate([
    validation_1.Validate(validation_1.OPT_FONT_WEIGHT)
], CartesianCrossLineLabel.prototype, "fontWeight", void 0);
__decorate([
    validation_1.Validate(validation_1.NUMBER(0))
], CartesianCrossLineLabel.prototype, "fontSize", void 0);
__decorate([
    validation_1.Validate(validation_1.STRING)
], CartesianCrossLineLabel.prototype, "fontFamily", void 0);
__decorate([
    validation_1.Validate(validation_1.NUMBER(0))
], CartesianCrossLineLabel.prototype, "padding", void 0);
__decorate([
    validation_1.Validate(validation_1.OPT_COLOR_STRING)
], CartesianCrossLineLabel.prototype, "color", void 0);
__decorate([
    validation_1.Validate(OPT_CROSSLINE_LABEL_POSITION)
], CartesianCrossLineLabel.prototype, "position", void 0);
__decorate([
    validation_1.Validate(validation_1.OPT_NUMBER(-360, 360))
], CartesianCrossLineLabel.prototype, "rotation", void 0);
__decorate([
    validation_1.Validate(validation_1.OPT_BOOLEAN)
], CartesianCrossLineLabel.prototype, "parallel", void 0);
class CartesianCrossLine {
    constructor() {
        this.id = id_1.createId(this);
        this.enabled = undefined;
        this.type = undefined;
        this.range = undefined;
        this.value = undefined;
        this.fill = undefined;
        this.fillOpacity = undefined;
        this.stroke = undefined;
        this.strokeWidth = undefined;
        this.strokeOpacity = undefined;
        this.lineDash = undefined;
        this.label = new CartesianCrossLineLabel();
        this.scale = undefined;
        this.clippedRange = [-Infinity, Infinity];
        this.gridLength = 0;
        this.sideFlag = -1;
        this.parallelFlipRotation = 0;
        this.regularFlipRotation = 0;
        this.direction = chartAxisDirection_1.ChartAxisDirection.X;
        this.group = new group_1.Group({ name: `${this.id}`, layer: true, zIndex: CartesianCrossLine.LINE_LAYER_ZINDEX });
        this.crossLineRange = new range_1.Range();
        this.crossLineLabel = new text_1.Text();
        this.labelPoint = undefined;
        this.data = [];
        this.startLine = false;
        this.endLine = false;
        this.isRange = false;
        const { group, crossLineRange, crossLineLabel } = this;
        group.append([crossLineRange, crossLineLabel]);
        crossLineRange.pointerEvents = node_1.PointerEvents.None;
    }
    update(visible) {
        if (!this.enabled) {
            return;
        }
        this.group.visible = visible;
        if (!visible) {
            return;
        }
        const dataCreated = this.createNodeData();
        if (!dataCreated) {
            this.group.visible = false;
            return;
        }
        this.updateNodes();
        this.group.zIndex = this.getZIndex(this.isRange);
    }
    updateNodes() {
        this.updateRangeNode();
        if (this.label.enabled) {
            this.updateLabel();
            this.positionLabel();
        }
    }
    createNodeData() {
        var _a, _b;
        const { scale, gridLength, sideFlag, direction, label: { position = 'top' }, clippedRange, strokeWidth = 0, } = this;
        if (!scale) {
            return false;
        }
        const bandwidth = (_a = scale.bandwidth) !== null && _a !== void 0 ? _a : 0;
        const clippedRangeClamper = (x) => Math.max(Math.min(...clippedRange), Math.min(Math.max(...clippedRange), x));
        const [xStart, xEnd] = [0, sideFlag * gridLength];
        let [yStart, yEnd] = this.getRange();
        let [clampedYStart, clampedYEnd] = [
            Number(scale.convert(yStart, { strict: false })),
            scale.convert(yEnd, { strict: false }) + bandwidth,
        ];
        clampedYStart = clippedRangeClamper(clampedYStart);
        clampedYEnd = clippedRangeClamper(clampedYEnd);
        [yStart, yEnd] = [Number(scale.convert(yStart)), scale.convert(yEnd) + bandwidth];
        const validRange = !isNaN(clampedYStart) &&
            !isNaN(clampedYEnd) &&
            (yStart === clampedYStart || yEnd === clampedYEnd || clampedYStart !== clampedYEnd) &&
            Math.abs(clampedYEnd - clampedYStart) > 0;
        if (validRange) {
            const reverse = clampedYStart !== Math.min(clampedYStart, clampedYEnd);
            if (reverse) {
                [clampedYStart, clampedYEnd] = [
                    Math.min(clampedYStart, clampedYEnd),
                    Math.max(clampedYStart, clampedYEnd),
                ];
                [yStart, yEnd] = [yEnd, yStart];
            }
        }
        this.isRange = validRange;
        this.startLine = !isNaN(yStart) && strokeWidth > 0 && yStart === clampedYStart;
        this.endLine = !isNaN(yEnd) && strokeWidth > 0 && yEnd === clampedYEnd;
        if (!validRange && !this.startLine && !this.endLine) {
            return false;
        }
        this.data = [clampedYStart, clampedYEnd];
        if (this.label.enabled) {
            const yDirection = direction === chartAxisDirection_1.ChartAxisDirection.Y;
            const { c = crossLineLabelPosition_1.POSITION_TOP_COORDINATES } = (_b = crossLineLabelPosition_1.labeldDirectionHandling[position]) !== null && _b !== void 0 ? _b : {};
            const { x: labelX, y: labelY } = c({ yDirection, xStart, xEnd, yStart: clampedYStart, yEnd: clampedYEnd });
            this.labelPoint = {
                x: labelX,
                y: labelY,
            };
        }
        return true;
    }
    updateRangeNode() {
        var _a;
        const { crossLineRange, sideFlag, gridLength, data, startLine, endLine, isRange, fill, fillOpacity, stroke, strokeWidth, lineDash, } = this;
        crossLineRange.x1 = 0;
        crossLineRange.x2 = sideFlag * gridLength;
        crossLineRange.y1 = data[0];
        crossLineRange.y2 = data[1];
        crossLineRange.startLine = startLine;
        crossLineRange.endLine = endLine;
        crossLineRange.isRange = isRange;
        crossLineRange.fill = fill;
        crossLineRange.fillOpacity = fillOpacity !== null && fillOpacity !== void 0 ? fillOpacity : 1;
        crossLineRange.stroke = stroke;
        crossLineRange.strokeWidth = strokeWidth !== null && strokeWidth !== void 0 ? strokeWidth : 1;
        crossLineRange.strokeOpacity = (_a = this.strokeOpacity) !== null && _a !== void 0 ? _a : 1;
        crossLineRange.lineDash = lineDash;
    }
    updateLabel() {
        const { crossLineLabel, label } = this;
        if (!label.text) {
            return;
        }
        crossLineLabel.fontStyle = label.fontStyle;
        crossLineLabel.fontWeight = label.fontWeight;
        crossLineLabel.fontSize = label.fontSize;
        crossLineLabel.fontFamily = label.fontFamily;
        crossLineLabel.fill = label.color;
        crossLineLabel.text = label.text;
    }
    positionLabel() {
        const { crossLineLabel, labelPoint: { x = undefined, y = undefined } = {}, label: { parallel, rotation, position = 'top', padding = 0 }, direction, parallelFlipRotation, regularFlipRotation, } = this;
        if (x === undefined || y === undefined) {
            return;
        }
        const { defaultRotation, configuredRotation } = label_1.calculateLabelRotation({
            rotation,
            parallel,
            regularFlipRotation,
            parallelFlipRotation,
        });
        crossLineLabel.rotation = defaultRotation + configuredRotation;
        crossLineLabel.textBaseline = 'middle';
        crossLineLabel.textAlign = 'center';
        const bbox = this.computeLabelBBox();
        if (!bbox) {
            return;
        }
        const yDirection = direction === chartAxisDirection_1.ChartAxisDirection.Y;
        const { xTranslation, yTranslation } = crossLineLabelPosition_1.calculateLabelTranslation({ yDirection, padding, position, bbox });
        crossLineLabel.translationX = x + xTranslation;
        crossLineLabel.translationY = y + yTranslation;
    }
    getZIndex(isRange = false) {
        if (isRange) {
            return CartesianCrossLine.RANGE_LAYER_ZINDEX;
        }
        return CartesianCrossLine.LINE_LAYER_ZINDEX;
    }
    getRange() {
        const { value, range, scale } = this;
        const isContinuous = scale instanceof continuousScale_1.ContinuousScale;
        let [start, end] = range !== null && range !== void 0 ? range : [value, undefined];
        if (!isContinuous && end === undefined) {
            end = start;
        }
        start = value_1.checkDatum(start, isContinuous) != null ? start : undefined;
        end = value_1.checkDatum(end, isContinuous) != null ? end : undefined;
        if (isContinuous && start === end) {
            end = undefined;
        }
        if (start === undefined && end !== undefined) {
            start = end;
            end = undefined;
        }
        return [start, end];
    }
    computeLabelBBox() {
        return this.crossLineLabel.computeTransformedBBox();
    }
    calculatePadding(padding) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const { isRange, startLine, endLine, direction, label: { padding: labelPadding = 0, position = 'top' }, } = this;
        if (!isRange && !startLine && !endLine) {
            return;
        }
        const crossLineLabelBBox = this.computeLabelBBox();
        const labelX = crossLineLabelBBox === null || crossLineLabelBBox === void 0 ? void 0 : crossLineLabelBBox.x;
        const labelY = crossLineLabelBBox === null || crossLineLabelBBox === void 0 ? void 0 : crossLineLabelBBox.y;
        if (!crossLineLabelBBox || labelX == undefined || labelY == undefined) {
            return;
        }
        const chartPadding = crossLineLabelPosition_1.calculateLabelChartPadding({
            yDirection: direction === chartAxisDirection_1.ChartAxisDirection.Y,
            padding: labelPadding,
            position,
            bbox: crossLineLabelBBox,
        });
        padding.left = Math.max((_a = padding.left) !== null && _a !== void 0 ? _a : 0, (_b = chartPadding.left) !== null && _b !== void 0 ? _b : 0);
        padding.right = Math.max((_c = padding.right) !== null && _c !== void 0 ? _c : 0, (_d = chartPadding.right) !== null && _d !== void 0 ? _d : 0);
        padding.top = Math.max((_e = padding.top) !== null && _e !== void 0 ? _e : 0, (_f = chartPadding.top) !== null && _f !== void 0 ? _f : 0);
        padding.bottom = Math.max((_g = padding.bottom) !== null && _g !== void 0 ? _g : 0, (_h = chartPadding.bottom) !== null && _h !== void 0 ? _h : 0);
    }
}
CartesianCrossLine.LINE_LAYER_ZINDEX = layers_1.Layers.SERIES_CROSSLINE_LINE_ZINDEX;
CartesianCrossLine.RANGE_LAYER_ZINDEX = layers_1.Layers.SERIES_CROSSLINE_RANGE_ZINDEX;
CartesianCrossLine.className = 'CrossLine';
__decorate([
    validation_1.Validate(validation_1.OPT_BOOLEAN)
], CartesianCrossLine.prototype, "enabled", void 0);
__decorate([
    validation_1.Validate(OPT_CROSSLINE_TYPE)
], CartesianCrossLine.prototype, "type", void 0);
__decorate([
    validation_1.Validate(validation_1.OPT_ARRAY(2))
], CartesianCrossLine.prototype, "range", void 0);
__decorate([
    validation_1.Validate(validation_1.OPT_COLOR_STRING)
], CartesianCrossLine.prototype, "fill", void 0);
__decorate([
    validation_1.Validate(validation_1.OPT_NUMBER(0, 1))
], CartesianCrossLine.prototype, "fillOpacity", void 0);
__decorate([
    validation_1.Validate(validation_1.OPT_COLOR_STRING)
], CartesianCrossLine.prototype, "stroke", void 0);
__decorate([
    validation_1.Validate(validation_1.OPT_NUMBER())
], CartesianCrossLine.prototype, "strokeWidth", void 0);
__decorate([
    validation_1.Validate(validation_1.OPT_NUMBER(0, 1))
], CartesianCrossLine.prototype, "strokeOpacity", void 0);
__decorate([
    validation_1.Validate(validation_1.OPT_LINE_DASH)
], CartesianCrossLine.prototype, "lineDash", void 0);
exports.CartesianCrossLine = CartesianCrossLine;
