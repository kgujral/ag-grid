import { Events } from "../events.mjs";
import { AgAbstractInputField } from './agAbstractInputField.mjs';
export class AgCheckbox extends AgAbstractInputField {
    constructor(config, className = 'ag-checkbox', inputType = 'checkbox') {
        super(config, className, inputType);
        this.labelAlignment = 'right';
        this.selected = false;
        this.readOnly = false;
        this.passive = false;
    }
    addInputListeners() {
        this.addManagedListener(this.eInput, 'click', this.onCheckboxClick.bind(this));
        this.addManagedListener(this.eLabel, 'click', this.toggle.bind(this));
    }
    getNextValue() {
        return this.selected === undefined ? true : !this.selected;
    }
    setPassive(passive) {
        this.passive = passive;
    }
    isReadOnly() {
        return this.readOnly;
    }
    setReadOnly(readOnly) {
        this.eWrapper.classList.toggle('ag-disabled', readOnly);
        this.eInput.disabled = readOnly;
        this.readOnly = readOnly;
    }
    setDisabled(disabled) {
        this.eWrapper.classList.toggle('ag-disabled', disabled);
        return super.setDisabled(disabled);
    }
    toggle() {
        if (this.eInput.disabled) {
            return;
        }
        const previousValue = this.isSelected();
        const nextValue = this.getNextValue();
        if (this.passive) {
            this.dispatchChange(nextValue, previousValue);
        }
        else {
            this.setValue(nextValue);
        }
    }
    getValue() {
        return this.isSelected();
    }
    setValue(value, silent) {
        this.refreshSelectedClass(value);
        this.setSelected(value, silent);
        return this;
    }
    setName(name) {
        const input = this.getInputElement();
        input.name = name;
        return this;
    }
    isSelected() {
        return this.selected;
    }
    setSelected(selected, silent) {
        if (this.isSelected() === selected) {
            return;
        }
        this.previousValue = this.isSelected();
        selected = this.selected = typeof selected === 'boolean' ? selected : undefined;
        this.eInput.checked = selected;
        this.eInput.indeterminate = selected === undefined;
        if (!silent) {
            this.dispatchChange(this.selected, this.previousValue);
        }
    }
    dispatchChange(selected, previousValue, event) {
        this.dispatchEvent({ type: Events.EVENT_FIELD_VALUE_CHANGED, selected, previousValue, event });
        const input = this.getInputElement();
        const checkboxChangedEvent = {
            type: Events.EVENT_CHECKBOX_CHANGED,
            id: input.id,
            name: input.name,
            selected,
            previousValue
        };
        this.eventService.dispatchEvent(checkboxChangedEvent);
    }
    onCheckboxClick(e) {
        if (this.passive || this.eInput.disabled) {
            return;
        }
        const previousValue = this.isSelected();
        const selected = this.selected = e.target.checked;
        this.refreshSelectedClass(selected);
        this.dispatchChange(selected, previousValue, e);
    }
    refreshSelectedClass(value) {
        this.eWrapper.classList.toggle('ag-checked', value === true);
        this.eWrapper.classList.toggle('ag-indeterminate', value == null);
    }
}
