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
import { Gradient } from './gradient';
import { toRadians, normalizeAngle360 } from '../../util/angle';
var LinearGradient = /** @class */ (function (_super) {
    __extends(LinearGradient, _super);
    function LinearGradient() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.angle = 0;
        return _this;
    }
    LinearGradient.prototype.createGradient = function (ctx, bbox) {
        // Gradient 0° angle starts at top according to CSS spec
        var angleOffset = 90;
        var _a = this, stops = _a.stops, angle = _a.angle;
        var radians = normalizeAngle360(toRadians(angle + angleOffset));
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var w = bbox.width;
        var h = bbox.height;
        var cx = bbox.x + w * 0.5;
        var cy = bbox.y + h * 0.5;
        if (w > 0 && h > 0) {
            var diagonal = Math.sqrt(h * h + w * w) / 2;
            var diagonalAngle = Math.atan2(h, w);
            var quarteredAngle = void 0;
            if (radians < Math.PI / 2) {
                quarteredAngle = radians;
            }
            else if (radians < Math.PI) {
                quarteredAngle = Math.PI - radians;
            }
            else if (radians < (3 * Math.PI) / 2) {
                quarteredAngle = radians - Math.PI;
            }
            else {
                quarteredAngle = 2 * Math.PI - radians;
            }
            var l = diagonal * Math.abs(Math.cos(quarteredAngle - diagonalAngle));
            var gradient_1 = ctx.createLinearGradient(cx + cos * l, cy + sin * l, cx - cos * l, cy - sin * l);
            stops.forEach(function (stop) {
                gradient_1.addColorStop(stop.offset, stop.color);
            });
            return gradient_1;
        }
        return 'black';
    };
    return LinearGradient;
}(Gradient));
export { LinearGradient };
