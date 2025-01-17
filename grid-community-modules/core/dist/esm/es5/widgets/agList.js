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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "./component";
import { PostConstruct } from "../context/context";
import { escapeString } from "../utils/string";
import { KeyCode } from '../constants/keyCode';
import { setAriaPosInSet, setAriaRole, setAriaSelected, setAriaSetSize } from '../utils/aria';
import { Events } from "../eventKeys";
var AgList = /** @class */ (function (_super) {
    __extends(AgList, _super);
    function AgList(cssIdentifier) {
        if (cssIdentifier === void 0) { cssIdentifier = 'default'; }
        var _this = _super.call(this, /* html */ "<div class=\"ag-list ag-" + cssIdentifier + "-list\" role=\"listbox\"></div>") || this;
        _this.cssIdentifier = cssIdentifier;
        _this.options = [];
        _this.itemEls = [];
        return _this;
    }
    AgList.prototype.init = function () {
        this.addManagedListener(this.getGui(), 'keydown', this.handleKeyDown.bind(this));
    };
    AgList.prototype.handleKeyDown = function (e) {
        var key = e.key;
        switch (key) {
            case KeyCode.ENTER:
                if (!this.highlightedEl) {
                    this.setValue(this.getValue());
                }
                else {
                    var pos = this.itemEls.indexOf(this.highlightedEl);
                    this.setValueByIndex(pos);
                }
                break;
            case KeyCode.DOWN:
            case KeyCode.UP:
                var isDown = key === KeyCode.DOWN;
                var itemToHighlight = void 0;
                e.preventDefault();
                if (!this.highlightedEl) {
                    itemToHighlight = this.itemEls[isDown ? 0 : this.itemEls.length - 1];
                }
                else {
                    var currentIdx = this.itemEls.indexOf(this.highlightedEl);
                    var nextPos = currentIdx + (isDown ? 1 : -1);
                    nextPos = Math.min(Math.max(nextPos, 0), this.itemEls.length - 1);
                    itemToHighlight = this.itemEls[nextPos];
                }
                this.highlightItem(itemToHighlight);
                break;
        }
    };
    AgList.prototype.addOptions = function (listOptions) {
        var _this = this;
        listOptions.forEach(function (listOption) { return _this.addOption(listOption); });
        return this;
    };
    AgList.prototype.addOption = function (listOption) {
        var value = listOption.value, text = listOption.text;
        var sanitisedText = escapeString(text || value);
        this.options.push({ value: value, text: sanitisedText });
        this.renderOption(value, sanitisedText);
        this.updateIndices();
        return this;
    };
    AgList.prototype.updateIndices = function () {
        var options = this.getGui().querySelectorAll('.ag-list-item');
        options.forEach(function (option, idx) {
            setAriaPosInSet(option, idx + 1);
            setAriaSetSize(option, options.length);
        });
    };
    AgList.prototype.renderOption = function (value, text) {
        var _this = this;
        var itemEl = document.createElement('div');
        setAriaRole(itemEl, 'option');
        itemEl.classList.add('ag-list-item', "ag-" + this.cssIdentifier + "-list-item");
        itemEl.innerHTML = "<span>" + text + "</span>";
        itemEl.tabIndex = -1;
        this.itemEls.push(itemEl);
        this.addManagedListener(itemEl, 'mouseover', function () { return _this.highlightItem(itemEl); });
        this.addManagedListener(itemEl, 'mouseleave', function () { return _this.clearHighlighted(); });
        this.addManagedListener(itemEl, 'click', function () { return _this.setValue(value); });
        this.getGui().appendChild(itemEl);
    };
    AgList.prototype.setValue = function (value, silent) {
        if (this.value === value) {
            this.fireItemSelected();
            return this;
        }
        if (value == null) {
            this.reset();
            return this;
        }
        var idx = this.options.findIndex(function (option) { return option.value === value; });
        if (idx !== -1) {
            var option = this.options[idx];
            this.value = option.value;
            this.displayValue = option.text != null ? option.text : option.value;
            this.highlightItem(this.itemEls[idx]);
            if (!silent) {
                this.fireChangeEvent();
            }
        }
        return this;
    };
    AgList.prototype.setValueByIndex = function (idx) {
        return this.setValue(this.options[idx].value);
    };
    AgList.prototype.getValue = function () {
        return this.value;
    };
    AgList.prototype.getDisplayValue = function () {
        return this.displayValue;
    };
    AgList.prototype.refreshHighlighted = function () {
        var _this = this;
        this.clearHighlighted();
        var idx = this.options.findIndex(function (option) { return option.value === _this.value; });
        if (idx !== -1) {
            this.highlightItem(this.itemEls[idx]);
        }
    };
    AgList.prototype.reset = function () {
        this.value = null;
        this.displayValue = null;
        this.clearHighlighted();
        this.fireChangeEvent();
    };
    AgList.prototype.highlightItem = function (el) {
        if (!el.offsetParent) {
            return;
        }
        this.clearHighlighted();
        this.highlightedEl = el;
        this.highlightedEl.classList.add(AgList.ACTIVE_CLASS);
        setAriaSelected(this.highlightedEl, true);
        this.highlightedEl.focus();
    };
    AgList.prototype.clearHighlighted = function () {
        if (!this.highlightedEl || !this.highlightedEl.offsetParent) {
            return;
        }
        this.highlightedEl.classList.remove(AgList.ACTIVE_CLASS);
        setAriaSelected(this.highlightedEl, false);
        this.highlightedEl = null;
    };
    AgList.prototype.fireChangeEvent = function () {
        this.dispatchEvent({ type: Events.EVENT_FIELD_VALUE_CHANGED });
        this.fireItemSelected();
    };
    AgList.prototype.fireItemSelected = function () {
        this.dispatchEvent({ type: AgList.EVENT_ITEM_SELECTED });
    };
    AgList.EVENT_ITEM_SELECTED = 'selectedItem';
    AgList.ACTIVE_CLASS = 'ag-active-item';
    __decorate([
        PostConstruct
    ], AgList.prototype, "init", null);
    return AgList;
}(Component));
export { AgList };
