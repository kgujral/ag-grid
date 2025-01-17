import { Marker } from './marker.mjs';
export class Circle extends Marker {
    updatePath() {
        const { x, y, path, size } = this;
        const r = size / 2;
        path.clear();
        path.arc(x, y, r, 0, Math.PI * 2);
        path.closePath();
    }
}
Circle.className = 'Circle';
