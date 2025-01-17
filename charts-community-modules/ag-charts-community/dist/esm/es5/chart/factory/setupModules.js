var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { REGISTERED_MODULES } from '../../util/module';
import { registerAxis, registerAxisThemeTemplate } from './axisTypes';
import { JSON_APPLY_PLUGINS } from '../chartOptions';
import { registerChartDefaults } from './chartTypes';
import { registerLegend } from './legendTypes';
import { registerSeries } from './seriesTypes';
export function setupModules() {
    var e_1, _a, e_2, _b, e_3, _c;
    try {
        for (var REGISTERED_MODULES_1 = __values(REGISTERED_MODULES), REGISTERED_MODULES_1_1 = REGISTERED_MODULES_1.next(); !REGISTERED_MODULES_1_1.done; REGISTERED_MODULES_1_1 = REGISTERED_MODULES_1.next()) {
            var m = REGISTERED_MODULES_1_1.value;
            if (JSON_APPLY_PLUGINS.constructors != null && m.optionConstructors != null) {
                Object.assign(JSON_APPLY_PLUGINS.constructors, m.optionConstructors);
            }
            if (m.type === 'root') {
                if (m.themeTemplate) {
                    try {
                        for (var _d = (e_2 = void 0, __values(m.chartTypes)), _e = _d.next(); !_e.done; _e = _d.next()) {
                            var chartType = _e.value;
                            registerChartDefaults(chartType, m.themeTemplate);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            if (m.type === 'series') {
                if (m.chartTypes.length > 1)
                    throw new Error('AG Charts - Module definition error: ' + m.identifier);
                registerSeries(m.identifier, m.chartTypes[0], m.instanceConstructor, m.seriesDefaults, m.themeTemplate, m.paletteFactory);
            }
            if (m.type === 'axis-option') {
                if (m.themeTemplate) {
                    try {
                        for (var _f = (e_3 = void 0, __values(m.axisTypes)), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var axisType = _g.value;
                            registerAxisThemeTemplate(axisType, m.themeTemplate);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
            if (m.type === 'axis') {
                registerAxis(m.identifier, m.instanceConstructor);
                if (m.themeTemplate) {
                    registerAxisThemeTemplate(m.identifier, m.themeTemplate);
                }
            }
            if (m.type === 'legend') {
                registerLegend(m.identifier, m.instanceConstructor);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (REGISTERED_MODULES_1_1 && !REGISTERED_MODULES_1_1.done && (_a = REGISTERED_MODULES_1.return)) _a.call(REGISTERED_MODULES_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
