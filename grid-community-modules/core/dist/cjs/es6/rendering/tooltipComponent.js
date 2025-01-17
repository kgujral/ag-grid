"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooltipComponent = void 0;
const popupComponent_1 = require("../widgets/popupComponent");
const string_1 = require("../utils/string");
class TooltipComponent extends popupComponent_1.PopupComponent {
    constructor() {
        super(/* html */ `<div class="ag-tooltip"></div>`);
    }
    // will need to type params
    init(params) {
        const { value } = params;
        this.getGui().innerHTML = string_1.escapeString(value);
    }
}
exports.TooltipComponent = TooltipComponent;
