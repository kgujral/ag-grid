"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderRowContainerComp = void 0;
const context_1 = require("../../context/context");
const dom_1 = require("../../utils/dom");
const object_1 = require("../../utils/object");
const component_1 = require("../../widgets/component");
const componentAnnotations_1 = require("../../widgets/componentAnnotations");
const headerRowComp_1 = require("../row/headerRowComp");
const headerRowContainerCtrl_1 = require("./headerRowContainerCtrl");
class HeaderRowContainerComp extends component_1.Component {
    constructor(pinned) {
        super();
        this.headerRowComps = {};
        this.rowCompsList = [];
        this.pinned = pinned;
    }
    init() {
        this.selectAndSetTemplate();
        const compProxy = {
            setDisplayed: displayed => this.setDisplayed(displayed),
            setCtrls: ctrls => this.setCtrls(ctrls),
            // only gets called for center section
            setCenterWidth: width => this.eCenterContainer.style.width = width,
            setViewportScrollLeft: left => this.getGui().scrollLeft = left,
            // only gets called for pinned sections
            setPinnedContainerWidth: width => {
                const eGui = this.getGui();
                eGui.style.width = width;
                eGui.style.maxWidth = width;
                eGui.style.minWidth = width;
            }
        };
        const ctrl = this.createManagedBean(new headerRowContainerCtrl_1.HeaderRowContainerCtrl(this.pinned));
        ctrl.setComp(compProxy, this.getGui());
    }
    selectAndSetTemplate() {
        const pinnedLeft = this.pinned == 'left';
        const pinnedRight = this.pinned == 'right';
        const template = pinnedLeft ? HeaderRowContainerComp.PINNED_LEFT_TEMPLATE :
            pinnedRight ? HeaderRowContainerComp.PINNED_RIGHT_TEMPLATE : HeaderRowContainerComp.CENTER_TEMPLATE;
        this.setTemplate(template);
        // for left and right, we add rows directly to the root element,
        // but for center container we add elements to the child container.
        this.eRowContainer = this.eCenterContainer ? this.eCenterContainer : this.getGui();
    }
    destroyRowComps() {
        this.setCtrls([]);
    }
    destroyRowComp(rowComp) {
        this.destroyBean(rowComp);
        this.eRowContainer.removeChild(rowComp.getGui());
    }
    setCtrls(ctrls) {
        const oldRowComps = this.headerRowComps;
        this.headerRowComps = {};
        this.rowCompsList = [];
        let prevGui;
        const appendEnsuringDomOrder = (rowComp) => {
            const eGui = rowComp.getGui();
            const notAlreadyIn = eGui.parentElement != this.eRowContainer;
            if (notAlreadyIn) {
                this.eRowContainer.appendChild(eGui);
            }
            if (prevGui) {
                dom_1.ensureDomOrder(this.eRowContainer, eGui, prevGui);
            }
            prevGui = eGui;
        };
        ctrls.forEach(ctrl => {
            const ctrlId = ctrl.getInstanceId();
            const existingComp = oldRowComps[ctrlId];
            delete oldRowComps[ctrlId];
            const rowComp = existingComp ? existingComp : this.createBean(new headerRowComp_1.HeaderRowComp(ctrl));
            this.headerRowComps[ctrlId] = rowComp;
            this.rowCompsList.push(rowComp);
            appendEnsuringDomOrder(rowComp);
        });
        object_1.getAllValuesInObject(oldRowComps).forEach(c => this.destroyRowComp(c));
    }
}
HeaderRowContainerComp.PINNED_LEFT_TEMPLATE = `<div class="ag-pinned-left-header" role="presentation"></div>`;
HeaderRowContainerComp.PINNED_RIGHT_TEMPLATE = `<div class="ag-pinned-right-header" role="presentation"></div>`;
HeaderRowContainerComp.CENTER_TEMPLATE = `<div class="ag-header-viewport" role="presentation">
            <div class="ag-header-container" ref="eCenterContainer" role="rowgroup"></div>
        </div>`;
__decorate([
    componentAnnotations_1.RefSelector('eCenterContainer')
], HeaderRowContainerComp.prototype, "eCenterContainer", void 0);
__decorate([
    context_1.PostConstruct
], HeaderRowContainerComp.prototype, "init", null);
__decorate([
    context_1.PreDestroy
], HeaderRowContainerComp.prototype, "destroyRowComps", null);
exports.HeaderRowContainerComp = HeaderRowContainerComp;
