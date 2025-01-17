var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Column } from "./column";
import { EventService } from "../eventService";
import { Autowired } from "../context/context";
import { last } from "../utils/array";
var ColumnGroup = /** @class */ (function () {
    function ColumnGroup(providedColumnGroup, groupId, partId, pinned) {
        // depends on the open/closed state of the group, only displaying columns are stored here
        this.displayedChildren = [];
        this.localEventService = new EventService();
        this.groupId = groupId;
        this.partId = partId;
        this.providedColumnGroup = providedColumnGroup;
        this.pinned = pinned;
    }
    // this is static, a it is used outside of this class
    ColumnGroup.createUniqueId = function (groupId, instanceId) {
        return groupId + '_' + instanceId;
    };
    // as the user is adding and removing columns, the groups are recalculated.
    // this reset clears out all children, ready for children to be added again
    ColumnGroup.prototype.reset = function () {
        this.parent = null;
        this.children = null;
        this.displayedChildren = null;
    };
    ColumnGroup.prototype.getParent = function () {
        return this.parent;
    };
    ColumnGroup.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    ColumnGroup.prototype.getUniqueId = function () {
        return ColumnGroup.createUniqueId(this.groupId, this.partId);
    };
    ColumnGroup.prototype.isEmptyGroup = function () {
        return this.displayedChildren.length === 0;
    };
    ColumnGroup.prototype.isMoving = function () {
        var allLeafColumns = this.getProvidedColumnGroup().getLeafColumns();
        if (!allLeafColumns || allLeafColumns.length === 0) {
            return false;
        }
        return allLeafColumns.every(function (col) { return col.isMoving(); });
    };
    ColumnGroup.prototype.checkLeft = function () {
        // first get all children to setLeft, as it impacts our decision below
        this.displayedChildren.forEach(function (child) {
            if (child instanceof ColumnGroup) {
                child.checkLeft();
            }
        });
        // set our left based on first displayed column
        if (this.displayedChildren.length > 0) {
            if (this.gridOptionsService.is('enableRtl')) {
                var lastChild = last(this.displayedChildren);
                var lastChildLeft = lastChild.getLeft();
                this.setLeft(lastChildLeft);
            }
            else {
                var firstChildLeft = this.displayedChildren[0].getLeft();
                this.setLeft(firstChildLeft);
            }
        }
        else {
            // this should never happen, as if we have no displayed columns, then
            // this groups should not even exist.
            this.setLeft(null);
        }
    };
    ColumnGroup.prototype.getLeft = function () {
        return this.left;
    };
    ColumnGroup.prototype.getOldLeft = function () {
        return this.oldLeft;
    };
    ColumnGroup.prototype.setLeft = function (left) {
        this.oldLeft = left;
        if (this.left !== left) {
            this.left = left;
            this.localEventService.dispatchEvent(this.createAgEvent(ColumnGroup.EVENT_LEFT_CHANGED));
        }
    };
    ColumnGroup.prototype.getPinned = function () {
        return this.pinned;
    };
    ColumnGroup.prototype.createAgEvent = function (type) {
        return { type: type };
    };
    ColumnGroup.prototype.addEventListener = function (eventType, listener) {
        this.localEventService.addEventListener(eventType, listener);
    };
    ColumnGroup.prototype.removeEventListener = function (eventType, listener) {
        this.localEventService.removeEventListener(eventType, listener);
    };
    ColumnGroup.prototype.getGroupId = function () {
        return this.groupId;
    };
    ColumnGroup.prototype.getPartId = function () {
        return this.partId;
    };
    ColumnGroup.prototype.isChildInThisGroupDeepSearch = function (wantedChild) {
        var result = false;
        this.children.forEach(function (foundChild) {
            if (wantedChild === foundChild) {
                result = true;
            }
            if (foundChild instanceof ColumnGroup) {
                if (foundChild.isChildInThisGroupDeepSearch(wantedChild)) {
                    result = true;
                }
            }
        });
        return result;
    };
    ColumnGroup.prototype.getActualWidth = function () {
        var groupActualWidth = 0;
        if (this.displayedChildren) {
            this.displayedChildren.forEach(function (child) {
                groupActualWidth += child.getActualWidth();
            });
        }
        return groupActualWidth;
    };
    ColumnGroup.prototype.isResizable = function () {
        if (!this.displayedChildren) {
            return false;
        }
        // if at least one child is resizable, then the group is resizable
        var result = false;
        this.displayedChildren.forEach(function (child) {
            if (child.isResizable()) {
                result = true;
            }
        });
        return result;
    };
    ColumnGroup.prototype.getMinWidth = function () {
        var result = 0;
        this.displayedChildren.forEach(function (groupChild) {
            result += groupChild.getMinWidth() || 0;
        });
        return result;
    };
    ColumnGroup.prototype.addChild = function (child) {
        if (!this.children) {
            this.children = [];
        }
        this.children.push(child);
    };
    ColumnGroup.prototype.getDisplayedChildren = function () {
        return this.displayedChildren;
    };
    ColumnGroup.prototype.getLeafColumns = function () {
        var result = [];
        this.addLeafColumns(result);
        return result;
    };
    ColumnGroup.prototype.getDisplayedLeafColumns = function () {
        var result = [];
        this.addDisplayedLeafColumns(result);
        return result;
    };
    ColumnGroup.prototype.getDefinition = function () {
        return this.providedColumnGroup.getColGroupDef();
    };
    ColumnGroup.prototype.getColGroupDef = function () {
        return this.providedColumnGroup.getColGroupDef();
    };
    ColumnGroup.prototype.isPadding = function () {
        return this.providedColumnGroup.isPadding();
    };
    ColumnGroup.prototype.isExpandable = function () {
        return this.providedColumnGroup.isExpandable();
    };
    ColumnGroup.prototype.isExpanded = function () {
        return this.providedColumnGroup.isExpanded();
    };
    ColumnGroup.prototype.setExpanded = function (expanded) {
        this.providedColumnGroup.setExpanded(expanded);
    };
    ColumnGroup.prototype.addDisplayedLeafColumns = function (leafColumns) {
        this.displayedChildren.forEach(function (child) {
            if (child instanceof Column) {
                leafColumns.push(child);
            }
            else if (child instanceof ColumnGroup) {
                child.addDisplayedLeafColumns(leafColumns);
            }
        });
    };
    ColumnGroup.prototype.addLeafColumns = function (leafColumns) {
        this.children.forEach(function (child) {
            if (child instanceof Column) {
                leafColumns.push(child);
            }
            else if (child instanceof ColumnGroup) {
                child.addLeafColumns(leafColumns);
            }
        });
    };
    ColumnGroup.prototype.getChildren = function () {
        return this.children;
    };
    ColumnGroup.prototype.getColumnGroupShow = function () {
        return this.providedColumnGroup.getColumnGroupShow();
    };
    ColumnGroup.prototype.getProvidedColumnGroup = function () {
        return this.providedColumnGroup;
    };
    ColumnGroup.prototype.getPaddingLevel = function () {
        var parent = this.getParent();
        if (!this.isPadding() || !parent || !parent.isPadding()) {
            return 0;
        }
        return 1 + parent.getPaddingLevel();
    };
    ColumnGroup.prototype.calculateDisplayedColumns = function () {
        var _this = this;
        // clear out last time we calculated
        this.displayedChildren = [];
        // find the column group that is controlling expandable. this is relevant when we have padding (empty)
        // groups, where the expandable is actually the first parent that is not a padding group.
        var parentWithExpansion = this;
        while (parentWithExpansion != null && parentWithExpansion.isPadding()) {
            parentWithExpansion = parentWithExpansion.getParent();
        }
        var isExpandable = parentWithExpansion ? parentWithExpansion.providedColumnGroup.isExpandable() : false;
        // it not expandable, everything is visible
        if (!isExpandable) {
            this.displayedChildren = this.children;
            this.localEventService.dispatchEvent(this.createAgEvent(ColumnGroup.EVENT_DISPLAYED_CHILDREN_CHANGED));
            return;
        }
        // Add cols based on columnGroupShow
        // Note - the below also adds padding groups, these are always added because they never have
        // colDef.columnGroupShow set.
        this.children.forEach(function (child) {
            // never add empty groups
            var emptyGroup = child instanceof ColumnGroup && (!child.displayedChildren || !child.displayedChildren.length);
            if (emptyGroup) {
                return;
            }
            var headerGroupShow = child.getColumnGroupShow();
            switch (headerGroupShow) {
                case 'open':
                    // when set to open, only show col if group is open
                    if (parentWithExpansion.providedColumnGroup.isExpanded()) {
                        _this.displayedChildren.push(child);
                    }
                    break;
                case 'closed':
                    // when set to open, only show col if group is open
                    if (!parentWithExpansion.providedColumnGroup.isExpanded()) {
                        _this.displayedChildren.push(child);
                    }
                    break;
                default:
                    _this.displayedChildren.push(child);
                    break;
            }
        });
        this.localEventService.dispatchEvent(this.createAgEvent(ColumnGroup.EVENT_DISPLAYED_CHILDREN_CHANGED));
    };
    ColumnGroup.EVENT_LEFT_CHANGED = 'leftChanged';
    ColumnGroup.EVENT_DISPLAYED_CHILDREN_CHANGED = 'displayedChildrenChanged';
    __decorate([
        Autowired('gridOptionsService')
    ], ColumnGroup.prototype, "gridOptionsService", void 0);
    return ColumnGroup;
}());
export { ColumnGroup };
