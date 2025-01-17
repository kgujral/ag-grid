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
import { RefSelector } from '../widgets/componentAnnotations';
import { ManagedFocusFeature } from '../widgets/managedFocusFeature';
import { clearElement } from '../utils/dom';
import { setAriaLabel, setAriaRole } from '../utils/aria';
import { callIfPresent } from '../utils/function';
import { KeyCode } from '../constants/keyCode';
import { Component } from '../widgets/component';
import { PostConstruct, Autowired } from '../context/context';
var TabbedLayout = /** @class */ (function (_super) {
    __extends(TabbedLayout, _super);
    function TabbedLayout(params) {
        var _this = _super.call(this, TabbedLayout.getTemplate(params.cssClass)) || this;
        _this.items = [];
        _this.tabbedItemScrollMap = new Map();
        _this.params = params;
        if (params.items) {
            params.items.forEach(function (item) { return _this.addItem(item); });
        }
        return _this;
    }
    TabbedLayout.prototype.postConstruct = function () {
        var _this = this;
        this.createManagedBean(new ManagedFocusFeature(this.getFocusableElement(), {
            onTabKeyDown: this.onTabKeyDown.bind(this),
            handleKeyDown: this.handleKeyDown.bind(this)
        }));
        this.addDestroyFunc(function () { var _a, _b, _c; return (_c = (_b = (_a = _this.activeItem) === null || _a === void 0 ? void 0 : _a.tabbedItem) === null || _b === void 0 ? void 0 : _b.afterDetachedCallback) === null || _c === void 0 ? void 0 : _c.call(_b); });
    };
    TabbedLayout.getTemplate = function (cssClass) {
        return /* html */ "<div class=\"ag-tabs " + cssClass + "\">\n            <div ref=\"eHeader\" role=\"tablist\" class=\"ag-tabs-header " + (cssClass ? cssClass + "-header" : '') + "\"></div>\n            <div ref=\"eBody\" role=\"presentation\" class=\"ag-tabs-body " + (cssClass ? cssClass + "-body" : '') + "\"></div>\n        </div>";
    };
    TabbedLayout.prototype.handleKeyDown = function (e) {
        var eDocument = this.gridOptionsService.getDocument();
        switch (e.key) {
            case KeyCode.RIGHT:
            case KeyCode.LEFT:
                if (!this.eHeader.contains(eDocument.activeElement)) {
                    return;
                }
                var isRightKey = e.key === KeyCode.RIGHT;
                var isRtl = this.gridOptionsService.is('enableRtl');
                var currentPosition = this.items.indexOf(this.activeItem);
                var nextPosition = isRightKey !== isRtl ? Math.min(currentPosition + 1, this.items.length - 1) : Math.max(currentPosition - 1, 0);
                if (currentPosition === nextPosition) {
                    return;
                }
                e.preventDefault();
                var nextItem = this.items[nextPosition];
                this.showItemWrapper(nextItem);
                nextItem.eHeaderButton.focus();
                break;
            case KeyCode.UP:
            case KeyCode.DOWN:
                e.stopPropagation();
                break;
        }
    };
    TabbedLayout.prototype.onTabKeyDown = function (e) {
        if (e.defaultPrevented) {
            return;
        }
        var _a = this, focusService = _a.focusService, eHeader = _a.eHeader, eBody = _a.eBody, activeItem = _a.activeItem;
        var eDocument = this.gridOptionsService.getDocument();
        var activeElement = eDocument.activeElement;
        var target = e.target;
        e.preventDefault();
        if (eHeader.contains(activeElement)) {
            // focus is in header, move into body of popup
            focusService.focusInto(eBody, e.shiftKey);
            return;
        }
        var nextEl = null;
        if (focusService.isTargetUnderManagedComponent(eBody, target)) {
            if (e.shiftKey) {
                nextEl = this.focusService.findFocusableElementBeforeTabGuard(eBody, target);
            }
            if (!nextEl) {
                nextEl = activeItem.eHeaderButton;
            }
        }
        if (!nextEl && eBody.contains(activeElement)) {
            nextEl = focusService.findNextFocusableElement(eBody, false, e.shiftKey);
            if (!nextEl) {
                nextEl = activeItem.eHeaderButton;
            }
        }
        if (nextEl) {
            nextEl.focus();
        }
    };
    TabbedLayout.prototype.setAfterAttachedParams = function (params) {
        this.afterAttachedParams = params;
    };
    TabbedLayout.prototype.showFirstItem = function () {
        if (this.items.length > 0) {
            this.showItemWrapper(this.items[0]);
        }
    };
    TabbedLayout.prototype.addItem = function (item) {
        var eHeaderButton = document.createElement('span');
        setAriaRole(eHeaderButton, 'tab');
        eHeaderButton.setAttribute('tabindex', '-1');
        eHeaderButton.appendChild(item.title);
        eHeaderButton.classList.add('ag-tab');
        this.eHeader.appendChild(eHeaderButton);
        setAriaLabel(eHeaderButton, item.titleLabel);
        var wrapper = {
            tabbedItem: item,
            eHeaderButton: eHeaderButton
        };
        this.items.push(wrapper);
        eHeaderButton.addEventListener('click', this.showItemWrapper.bind(this, wrapper));
    };
    TabbedLayout.prototype.showItem = function (tabbedItem) {
        var itemWrapper = this.items.find(function (wrapper) { return wrapper.tabbedItem === tabbedItem; });
        if (itemWrapper) {
            this.showItemWrapper(itemWrapper);
        }
    };
    TabbedLayout.prototype.showItemWrapper = function (wrapper) {
        var _this = this;
        var _a, _b;
        var tabbedItem = wrapper.tabbedItem, eHeaderButton = wrapper.eHeaderButton;
        if (this.params.onItemClicked) {
            this.params.onItemClicked({ item: tabbedItem });
        }
        if (this.activeItem === wrapper) {
            callIfPresent(this.params.onActiveItemClicked);
            return;
        }
        if (this.lastScrollListener) {
            this.lastScrollListener = this.lastScrollListener();
        }
        clearElement(this.eBody);
        tabbedItem.bodyPromise.then(function (body) {
            _this.eBody.appendChild(body);
            var onlyUnmanaged = !_this.focusService.isKeyboardMode();
            _this.focusService.focusInto(_this.eBody, false, onlyUnmanaged);
            if (tabbedItem.afterAttachedCallback) {
                tabbedItem.afterAttachedCallback(_this.afterAttachedParams);
            }
            if (_this.params.keepScrollPosition) {
                var scrollableContainer_1 = (tabbedItem.getScrollableContainer && tabbedItem.getScrollableContainer()) || body;
                _this.lastScrollListener = _this.addManagedListener(scrollableContainer_1, 'scroll', function () {
                    _this.tabbedItemScrollMap.set(tabbedItem.name, scrollableContainer_1.scrollTop);
                });
                var scrollPosition_1 = _this.tabbedItemScrollMap.get(tabbedItem.name);
                if (scrollPosition_1 !== undefined) {
                    // Safari needs a small timeout or it will fire a scroll event to position 0
                    setTimeout(function () {
                        scrollableContainer_1.scrollTop = scrollPosition_1;
                    }, 0);
                }
            }
        });
        if (this.activeItem) {
            this.activeItem.eHeaderButton.classList.remove('ag-tab-selected');
            (_b = (_a = this.activeItem.tabbedItem).afterDetachedCallback) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
        eHeaderButton.classList.add('ag-tab-selected');
        this.activeItem = wrapper;
    };
    __decorate([
        Autowired('focusService')
    ], TabbedLayout.prototype, "focusService", void 0);
    __decorate([
        RefSelector('eHeader')
    ], TabbedLayout.prototype, "eHeader", void 0);
    __decorate([
        RefSelector('eBody')
    ], TabbedLayout.prototype, "eBody", void 0);
    __decorate([
        PostConstruct
    ], TabbedLayout.prototype, "postConstruct", null);
    return TabbedLayout;
}(Component));
export { TabbedLayout };
