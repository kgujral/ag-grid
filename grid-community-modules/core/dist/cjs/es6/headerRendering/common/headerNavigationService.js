"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderNavigationService = exports.HeaderNavigationDirection = void 0;
const beanStub_1 = require("../../context/beanStub");
const context_1 = require("../../context/context");
const columnGroup_1 = require("../../entities/columnGroup");
const array_1 = require("../../utils/array");
var HeaderNavigationDirection;
(function (HeaderNavigationDirection) {
    HeaderNavigationDirection[HeaderNavigationDirection["UP"] = 0] = "UP";
    HeaderNavigationDirection[HeaderNavigationDirection["DOWN"] = 1] = "DOWN";
    HeaderNavigationDirection[HeaderNavigationDirection["LEFT"] = 2] = "LEFT";
    HeaderNavigationDirection[HeaderNavigationDirection["RIGHT"] = 3] = "RIGHT";
})(HeaderNavigationDirection = exports.HeaderNavigationDirection || (exports.HeaderNavigationDirection = {}));
let HeaderNavigationService = class HeaderNavigationService extends beanStub_1.BeanStub {
    postConstruct() {
        this.ctrlsService.whenReady(p => {
            this.gridBodyCon = p.gridBodyCtrl;
        });
    }
    getHeaderRowCount() {
        const centerHeaderContainer = this.ctrlsService.getHeaderRowContainerCtrl();
        return centerHeaderContainer ? centerHeaderContainer.getRowCount() : 0;
    }
    /*
     * This method navigates grid header vertically
     * @return {boolean} true to preventDefault on the event that caused this navigation.
     */
    navigateVertically(direction, fromHeader, event) {
        if (!fromHeader) {
            fromHeader = this.focusService.getFocusedHeader();
        }
        if (!fromHeader) {
            return false;
        }
        const { headerRowIndex, column } = fromHeader;
        const rowLen = this.getHeaderRowCount();
        const isUp = direction === HeaderNavigationDirection.UP;
        let { nextRow, nextFocusColumn } = isUp
            ? this.headerPositionUtils.getColumnVisibleParent(column, headerRowIndex)
            : this.headerPositionUtils.getColumnVisibleChild(column, headerRowIndex);
        let skipColumn = false;
        if (nextRow < 0) {
            nextRow = 0;
            nextFocusColumn = column;
            skipColumn = true;
        }
        if (nextRow >= rowLen) {
            nextRow = -1; // -1 indicates the focus should move to grid rows.
        }
        if (!skipColumn && !nextFocusColumn) {
            return false;
        }
        return this.focusService.focusHeaderPosition({
            headerPosition: { headerRowIndex: nextRow, column: nextFocusColumn },
            allowUserOverride: true,
            event
        });
    }
    /*
     * This method navigates grid header horizontally
     * @return {boolean} true to preventDefault on the event that caused this navigation.
     */
    navigateHorizontally(direction, fromTab = false, event) {
        const focusedHeader = this.focusService.getFocusedHeader();
        const isLeft = direction === HeaderNavigationDirection.LEFT;
        const isRtl = this.gridOptionsService.is('enableRtl');
        let nextHeader;
        let normalisedDirection;
        // either navigating to the left or isRtl (cannot be both)
        if (isLeft !== isRtl) {
            normalisedDirection = 'Before';
            nextHeader = this.headerPositionUtils.findHeader(focusedHeader, normalisedDirection);
        }
        else {
            normalisedDirection = 'After';
            nextHeader = this.headerPositionUtils.findHeader(focusedHeader, normalisedDirection);
        }
        if (nextHeader || !fromTab) {
            return this.focusService.focusHeaderPosition({
                headerPosition: nextHeader,
                direction: normalisedDirection,
                fromTab,
                allowUserOverride: true,
                event
            });
        }
        return this.focusNextHeaderRow(focusedHeader, normalisedDirection, event);
    }
    focusNextHeaderRow(focusedHeader, direction, event) {
        const currentIndex = focusedHeader.headerRowIndex;
        let nextPosition = null;
        let nextRowIndex;
        if (direction === 'Before') {
            if (currentIndex > 0) {
                nextRowIndex = currentIndex - 1;
                nextPosition = this.headerPositionUtils.findColAtEdgeForHeaderRow(nextRowIndex, 'end');
            }
        }
        else {
            nextRowIndex = currentIndex + 1;
            nextPosition = this.headerPositionUtils.findColAtEdgeForHeaderRow(nextRowIndex, 'start');
        }
        return this.focusService.focusHeaderPosition({
            headerPosition: nextPosition,
            direction,
            fromTab: true,
            allowUserOverride: true,
            event
        });
    }
    scrollToColumn(column, direction = 'After') {
        if (column.getPinned()) {
            return;
        }
        let columnToScrollTo;
        if (column instanceof columnGroup_1.ColumnGroup) {
            const columns = column.getDisplayedLeafColumns();
            columnToScrollTo = direction === 'Before' ? array_1.last(columns) : columns[0];
        }
        else {
            columnToScrollTo = column;
        }
        this.gridBodyCon.getScrollFeature().ensureColumnVisible(columnToScrollTo);
    }
};
__decorate([
    context_1.Autowired('focusService')
], HeaderNavigationService.prototype, "focusService", void 0);
__decorate([
    context_1.Autowired('headerPositionUtils')
], HeaderNavigationService.prototype, "headerPositionUtils", void 0);
__decorate([
    context_1.Autowired('ctrlsService')
], HeaderNavigationService.prototype, "ctrlsService", void 0);
__decorate([
    context_1.PostConstruct
], HeaderNavigationService.prototype, "postConstruct", null);
HeaderNavigationService = __decorate([
    context_1.Bean('headerNavigationService')
], HeaderNavigationService);
exports.HeaderNavigationService = HeaderNavigationService;
