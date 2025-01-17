var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BBox } from '../scene/bbox.mjs';
import { Chart } from './chart.mjs';
export class HierarchyChart extends Chart {
    constructor(document = window.document, overrideDevicePixelRatio, resources) {
        super(document, overrideDevicePixelRatio, resources);
        this._data = {};
    }
    performLayout() {
        const _super = Object.create(null, {
            performLayout: { get: () => super.performLayout }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const shrinkRect = yield _super.performLayout.call(this);
            const { seriesAreaPadding } = this;
            const fullSeriesRect = shrinkRect.clone();
            shrinkRect.shrink(seriesAreaPadding.left, 'left');
            shrinkRect.shrink(seriesAreaPadding.top, 'top');
            shrinkRect.shrink(seriesAreaPadding.right, 'right');
            shrinkRect.shrink(seriesAreaPadding.bottom, 'bottom');
            this.seriesRect = shrinkRect;
            const hoverRectPadding = 20;
            const hoverRect = shrinkRect.clone().grow(hoverRectPadding);
            this.hoverRect = hoverRect;
            this.seriesRoot.translationX = Math.floor(shrinkRect.x);
            this.seriesRoot.translationY = Math.floor(shrinkRect.y);
            yield Promise.all(this.series.map((series) => __awaiter(this, void 0, void 0, function* () {
                yield series.update({ seriesRect: shrinkRect }); // this has to happen after the `updateAxes` call
            })));
            const { seriesRoot } = this;
            seriesRoot.setClipRectInGroupCoordinateSpace(new BBox(shrinkRect.x, shrinkRect.y, shrinkRect.width, shrinkRect.height));
            this.layoutService.dispatchLayoutComplete({
                type: 'layout-complete',
                chart: { width: this.scene.width, height: this.scene.height },
                series: { rect: fullSeriesRect, paddedRect: shrinkRect, hoverRect, visible: true },
                axes: [],
            });
            return shrinkRect;
        });
    }
}
HierarchyChart.className = 'HierarchyChart';
HierarchyChart.type = 'hierarchy';
