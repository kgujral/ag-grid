var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { MiniChartWithAxes } from "../miniChartWithAxes";
import { _Scene } from "ag-charts-community";
var MiniStackedBar = /** @class */ (function (_super) {
    __extends(MiniStackedBar, _super);
    function MiniStackedBar(container, fills, strokes, data, xScaleDomain, tooltipName) {
        if (data === void 0) { data = MiniStackedBar.data; }
        if (xScaleDomain === void 0) { xScaleDomain = [0, 16]; }
        if (tooltipName === void 0) { tooltipName = "stackedBarTooltip"; }
        var _this = _super.call(this, container, tooltipName) || this;
        var size = _this.size;
        var padding = _this.padding;
        var yScale = new _Scene.BandScale();
        yScale.domain = [0, 1, 2];
        yScale.range = [padding, size - padding];
        yScale.paddingInner = 0.3;
        yScale.paddingOuter = 0.3;
        var xScale = new _Scene.LinearScale();
        xScale.domain = xScaleDomain;
        xScale.range = [size - padding, padding];
        var bottom = xScale.convert(0);
        var height = yScale.bandwidth;
        _this.bars = data.map(function (series) {
            return series.map(function (datum, i) {
                var rect = new _Scene.Rect();
                rect.x = padding;
                rect.y = yScale.convert(i);
                rect.width = bottom - xScale.convert(datum);
                rect.height = height;
                rect.strokeWidth = 1;
                rect.crisp = true;
                return rect;
            });
        });
        _this.updateColors(fills, strokes);
        _this.root.append([].concat.apply([], _this.bars));
        return _this;
    }
    MiniStackedBar.prototype.updateColors = function (fills, strokes) {
        this.bars.forEach(function (series, i) {
            return series.forEach(function (bar) {
                bar.fill = fills[i];
                bar.stroke = strokes[i];
            });
        });
    };
    MiniStackedBar.chartType = 'stackedBar';
    MiniStackedBar.data = [
        [8, 12, 16],
        [6, 9, 12],
        [2, 3, 4]
    ];
    return MiniStackedBar;
}(MiniChartWithAxes));
export { MiniStackedBar };
