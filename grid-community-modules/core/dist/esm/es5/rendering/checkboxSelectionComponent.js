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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { PostConstruct } from '../context/context';
import { Component } from '../widgets/component';
import { Events } from '../events';
import { RefSelector } from '../widgets/componentAnnotations';
import { RowNode } from '../entities/rowNode';
import { stopPropagationForAgGrid } from '../utils/event';
import { getAriaCheckboxStateName, setAriaLive } from '../utils/aria';
var CheckboxSelectionComponent = /** @class */ (function (_super) {
    __extends(CheckboxSelectionComponent, _super);
    function CheckboxSelectionComponent() {
        return _super.call(this, /* html*/ "\n            <div class=\"ag-selection-checkbox\" role=\"presentation\">\n                <ag-checkbox role=\"presentation\" ref=\"eCheckbox\"></ag-checkbox>\n            </div>") || this;
    }
    CheckboxSelectionComponent.prototype.postConstruct = function () {
        this.eCheckbox.setPassive(true);
        setAriaLive(this.eCheckbox.getInputElement(), 'polite');
    };
    CheckboxSelectionComponent.prototype.getCheckboxId = function () {
        return this.eCheckbox.getInputElement().id;
    };
    CheckboxSelectionComponent.prototype.onDataChanged = function () {
        // when rows are loaded for the second time, this can impact the selection, as a row
        // could be loaded as already selected (if user scrolls down, and then up again).
        this.onSelectionChanged();
    };
    CheckboxSelectionComponent.prototype.onSelectableChanged = function () {
        this.showOrHideSelect();
    };
    CheckboxSelectionComponent.prototype.onSelectionChanged = function () {
        var translate = this.localeService.getLocaleTextFunc();
        var state = this.rowNode.isSelected();
        var stateName = getAriaCheckboxStateName(translate, state);
        var ariaLabel = translate('ariaRowToggleSelection', 'Press Space to toggle row selection');
        this.eCheckbox.setValue(state, true);
        this.eCheckbox.setInputAriaLabel(ariaLabel + " (" + stateName + ")");
    };
    CheckboxSelectionComponent.prototype.onClicked = function (newValue, groupSelectsFiltered, event) {
        return this.rowNode.setSelectedParams({ newValue: newValue, rangeSelect: event.shiftKey, groupSelectsFiltered: groupSelectsFiltered, event: event, source: 'checkboxSelected' });
    };
    CheckboxSelectionComponent.prototype.init = function (params) {
        var _this = this;
        this.rowNode = params.rowNode;
        this.column = params.column;
        this.overrides = params.overrides;
        this.onSelectionChanged();
        // we don't want double click on this icon to open a group
        this.addManagedListener(this.eCheckbox.getInputElement(), 'dblclick', function (event) {
            stopPropagationForAgGrid(event);
        });
        this.addManagedListener(this.eCheckbox.getInputElement(), 'click', function (event) {
            // we don't want the row clicked event to fire when selecting the checkbox, otherwise the row
            // would possibly get selected twice
            stopPropagationForAgGrid(event);
            var groupSelectsFiltered = _this.gridOptionsService.is('groupSelectsFiltered');
            var isSelected = _this.eCheckbox.getValue();
            if (_this.shouldHandleIndeterminateState(isSelected, groupSelectsFiltered)) {
                // try toggling children to determine action.
                var result = _this.onClicked(true, groupSelectsFiltered, event || {});
                if (result === 0) {
                    _this.onClicked(false, groupSelectsFiltered, event);
                }
            }
            else if (isSelected) {
                _this.onClicked(false, groupSelectsFiltered, event);
            }
            else {
                _this.onClicked(true, groupSelectsFiltered, event || {});
            }
        });
        this.addManagedListener(this.rowNode, RowNode.EVENT_ROW_SELECTED, this.onSelectionChanged.bind(this));
        this.addManagedListener(this.rowNode, RowNode.EVENT_DATA_CHANGED, this.onDataChanged.bind(this));
        this.addManagedListener(this.rowNode, RowNode.EVENT_SELECTABLE_CHANGED, this.onSelectableChanged.bind(this));
        var isRowSelectableFunc = this.gridOptionsService.get('isRowSelectable');
        var checkboxVisibleIsDynamic = isRowSelectableFunc || typeof this.getIsVisible() === 'function';
        if (checkboxVisibleIsDynamic) {
            var showOrHideSelectListener = this.showOrHideSelect.bind(this);
            this.addManagedListener(this.eventService, Events.EVENT_DISPLAYED_COLUMNS_CHANGED, showOrHideSelectListener);
            this.addManagedListener(this.rowNode, RowNode.EVENT_DATA_CHANGED, showOrHideSelectListener);
            this.addManagedListener(this.rowNode, RowNode.EVENT_CELL_CHANGED, showOrHideSelectListener);
            this.showOrHideSelect();
        }
        this.eCheckbox.getInputElement().setAttribute('tabindex', '-1');
    };
    CheckboxSelectionComponent.prototype.shouldHandleIndeterminateState = function (isSelected, groupSelectsFiltered) {
        // for CSRM groupSelectsFiltered, we can get an indeterminate state where all filtered children are selected,
        // and we would expect clicking to deselect all rather than select all
        return groupSelectsFiltered &&
            (this.eCheckbox.getPreviousValue() === undefined || isSelected === undefined) &&
            this.gridOptionsService.isRowModelType('clientSide');
    };
    CheckboxSelectionComponent.prototype.showOrHideSelect = function () {
        var _a, _b, _c, _d;
        // if the isRowSelectable() is not provided the row node is selectable by default
        var selectable = this.rowNode.selectable;
        // checkboxSelection callback is deemed a legacy solution however we will still consider it's result.
        // If selectable, then also check the colDef callback. if not selectable, this it short circuits - no need
        // to call the colDef callback.
        var isVisible = this.getIsVisible();
        if (selectable) {
            if (typeof isVisible === 'function') {
                var extraParams = (_a = this.overrides) === null || _a === void 0 ? void 0 : _a.callbackParams;
                var params = (_b = this.column) === null || _b === void 0 ? void 0 : _b.createColumnFunctionCallbackParams(this.rowNode);
                selectable = params ? isVisible(__assign(__assign({}, extraParams), params)) : false;
            }
            else {
                selectable = isVisible !== null && isVisible !== void 0 ? isVisible : false;
            }
        }
        var disableInsteadOfHide = (_c = this.column) === null || _c === void 0 ? void 0 : _c.getColDef().showDisabledCheckboxes;
        if (disableInsteadOfHide) {
            this.eCheckbox.setDisabled(!selectable);
            this.setVisible(true);
            this.setDisplayed(true);
            return;
        }
        if ((_d = this.overrides) === null || _d === void 0 ? void 0 : _d.removeHidden) {
            this.setDisplayed(selectable);
            return;
        }
        this.setVisible(selectable);
    };
    CheckboxSelectionComponent.prototype.getIsVisible = function () {
        var _a, _b;
        if (this.overrides) {
            return this.overrides.isVisible;
        }
        // column will be missing if groupDisplayType = 'groupRows'
        return (_b = (_a = this.column) === null || _a === void 0 ? void 0 : _a.getColDef()) === null || _b === void 0 ? void 0 : _b.checkboxSelection;
    };
    __decorate([
        RefSelector('eCheckbox')
    ], CheckboxSelectionComponent.prototype, "eCheckbox", void 0);
    __decorate([
        PostConstruct
    ], CheckboxSelectionComponent.prototype, "postConstruct", null);
    return CheckboxSelectionComponent;
}(Component));
export { CheckboxSelectionComponent };
