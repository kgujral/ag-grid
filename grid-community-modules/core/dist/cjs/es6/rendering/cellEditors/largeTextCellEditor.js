"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LargeTextCellEditor = void 0;
const popupComponent_1 = require("../../widgets/popupComponent");
const componentAnnotations_1 = require("../../widgets/componentAnnotations");
const generic_1 = require("../../utils/generic");
const keyCode_1 = require("../../constants/keyCode");
class LargeTextCellEditor extends popupComponent_1.PopupComponent {
    constructor() {
        super(LargeTextCellEditor.TEMPLATE);
    }
    init(params) {
        this.params = params;
        this.focusAfterAttached = params.cellStartedEdit;
        this.eTextArea
            .setMaxLength(params.maxLength || 200)
            .setCols(params.cols || 60)
            .setRows(params.rows || 10);
        if (generic_1.exists(params.value, true)) {
            this.eTextArea.setValue(params.value.toString(), true);
        }
        this.addGuiEventListener('keydown', this.onKeyDown.bind(this));
        this.activateTabIndex();
    }
    onKeyDown(event) {
        const key = event.key;
        if (key === keyCode_1.KeyCode.LEFT ||
            key === keyCode_1.KeyCode.UP ||
            key === keyCode_1.KeyCode.RIGHT ||
            key === keyCode_1.KeyCode.DOWN ||
            (event.shiftKey && key === keyCode_1.KeyCode.ENTER)) { // shift+enter allows for newlines
            event.stopPropagation();
        }
    }
    afterGuiAttached() {
        const translate = this.localeService.getLocaleTextFunc();
        this.eTextArea.setInputAriaLabel(translate('ariaInputEditor', 'Input Editor'));
        if (this.focusAfterAttached) {
            this.eTextArea.getFocusableElement().focus();
        }
    }
    getValue() {
        const value = this.eTextArea.getValue();
        if (!generic_1.exists(value) && !generic_1.exists(this.params.value)) {
            return this.params.value;
        }
        return this.params.parseValue(value);
    }
}
LargeTextCellEditor.TEMPLATE = `<div class="ag-large-text">
            <ag-input-text-area ref="eTextArea" class="ag-large-text-input"></ag-input-text-area>
        </div>`;
__decorate([
    componentAnnotations_1.RefSelector("eTextArea")
], LargeTextCellEditor.prototype, "eTextArea", void 0);
exports.LargeTextCellEditor = LargeTextCellEditor;
