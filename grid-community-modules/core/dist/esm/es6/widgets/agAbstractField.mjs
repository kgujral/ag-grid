import { AgAbstractLabel } from './agAbstractLabel.mjs';
import { setFixedWidth } from '../utils/dom.mjs';
import { Events } from '../eventKeys.mjs';
export class AgAbstractField extends AgAbstractLabel {
    constructor(config, template, className) {
        super(config, template);
        this.className = className;
    }
    postConstruct() {
        super.postConstruct();
        if (this.className) {
            this.addCssClass(this.className);
        }
    }
    onValueChange(callbackFn) {
        this.addManagedListener(this, Events.EVENT_FIELD_VALUE_CHANGED, () => callbackFn(this.getValue()));
        return this;
    }
    getWidth() {
        return this.getGui().clientWidth;
    }
    setWidth(width) {
        setFixedWidth(this.getGui(), width);
        return this;
    }
    getPreviousValue() {
        return this.previousValue;
    }
    getValue() {
        return this.value;
    }
    setValue(value, silent) {
        if (this.value === value) {
            return this;
        }
        this.previousValue = this.value;
        this.value = value;
        if (!silent) {
            this.dispatchEvent({ type: Events.EVENT_FIELD_VALUE_CHANGED });
        }
        return this;
    }
}
