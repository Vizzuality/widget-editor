"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@widget-editor/core");
const config_1 = __importDefault(require("./helpers/config"));
function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < array.length; index++) {
            yield callback(array[index], index, array);
        }
    });
}
class RwAdapter {
    constructor() {
        this.endpoint = "https://api.resourcewatch.org/v1";
        this.dataEndpoint = "https://api.resourcewatch.org/v1/query";
        this.config = null;
        this.datasetService = null;
        this.widgetService = null;
        this.datasetId = null;
        this.tableName = null;
        this.AUTH_TOKEN = null;
        this.applications = ["rw"];
        this.env = "production";
        this.locale = "en";
        this.widget_params = [
            "chartType",
            "visualizationType",
            "limit",
            "value",
            "category",
            "color",
            "size",
            "orderBy",
            "aggregateFunction",
            "filters",
            "areaIntersection",
            "band",
            "layer"
        ];
        const asConfig = {
            applications: this.applications,
            env: this.env,
            locale: this.locale
        };
        this.config = config_1.default(asConfig);
        this.datasetService = new core_1.DatasetService(this.config);
        this.widgetService = new core_1.WidgetService(this.config);
    }
    payload() {
        return {
            applications: this.applications,
            env: this.env
        };
    }
    saveWidgetRW() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.endpoint}/dataset/${this.datasetId}/widget`;
            if (this.AUTH_TOKEN) {
                try {
                    const response = yield fetch(url, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${this.AUTH_TOKEN}`
                        }
                    });
                    return yield response.json();
                }
                catch (error) {
                    console.error("Cant save widget", error);
                }
            }
            else {
                console.error("Missing auth token for saveWidget (RW)");
            }
        });
    }
    hasAuthToken() {
        return !!this.AUTH_TOKEN;
    }
    setDatasetId(datasetId) {
        if (!datasetId) {
            console.error("Error: datasetId is required");
        }
        this.datasetId = datasetId;
    }
    setTableName(tableName) {
        if (!tableName) {
            console.error("Error: datasetId is required");
        }
        this.tableName = tableName;
    }
    getDataset() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { applications, env, locale } = this.config.getConfig();
            const includes = "metadata,vocabulary,widget,layer";
            const url = `${this.endpoint}/dataset/${this.datasetId}?${applications.join(",")}&env=${env}&language=${locale}&includes=${includes}&page[size]=999`;
            const { data: dataset } = yield this.datasetService.fetchData(url);
            this.tableName = ((_b = (_a = dataset) === null || _a === void 0 ? void 0 : _a.attributes) === null || _b === void 0 ? void 0 : _b.tableName) || null;
            return dataset;
        });
    }
    getFields() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.endpoint}/fields/${this.datasetId}`;
            const { fields } = yield this.datasetService.fetchData(url);
            return fields;
        });
    }
    getWidget(dataset, widgetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { applications, env, locale } = this.config.getConfig();
            const includes = "metadata";
            const resolveWidgetId = !widgetId
                ? this.widgetService.fromDataset(dataset).id
                : widgetId;
            const url = `${this.endpoint}/widget/${resolveWidgetId}?${applications.join(",")}&env=${env}&language=${locale}&includes=${includes}&page[size]=999`;
            const { data: widget } = yield this.widgetService.fetchWidget(url);
            return widget;
        });
    }
    getWidgetData(dataset, widget) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = this.widgetService.getDataSqlQuery(dataset, widget);
            const url = `${this.endpoint}/query/${this.datasetId}?sql=${sql}`;
            const { data } = yield this.widgetService.fetchWidgetData(url);
            return data;
        });
    }
    getLayers() {
        return __awaiter(this, void 0, void 0, function* () {
            const { applications, env, locale } = this.config.getConfig();
            const url = `${this.endpoint}/dataset/${this.datasetId}/layer?app=${applications.join(",")}&env=${env}&page[size]=9999`;
            const { data } = yield this.datasetService.fetchData(url);
            return data;
        });
    }
    handleSave(consumerOnSave, dataService, application = "rw", editorState) {
        const { configuration, widget, filters: { list: editorFilters } } = editorState;
        const { dataset: { id, attributes: { tableName } } } = dataService;
        this.setDatasetId(id);
        this.setTableName(tableName);
        let widgetParams = {};
        this.widget_params.forEach(param => {
            if (param in configuration) {
                widgetParams = Object.assign(Object.assign({}, widgetParams), { [param]: configuration[param] });
            }
        });
        let widgetConfig = widget;
        delete widgetConfig.data;
        widgetConfig.filters = this.filterSerializer(editorFilters);
        const out = {
            name: configuration.title || null,
            description: configuration.description || null,
            application,
            widgetConfig
        };
        consumerOnSave(out);
    }
    filterSerializer(filters) {
        const serialize = filters.map(filter => ({
            value: filter.indicator === "FILTER_ON_VALUES"
                ? filter.filter.values.map(v => v.value)
                : filter.filter.values,
            type: filter.dataType,
            name: filter.column,
            datasetID: this.datasetId,
            tableName: this.tableName,
            alias: filter.column
        }));
        const REQUIRED_PROPS = ["value", "type", "datasetID", "tableName"];
        const validateProperty = prop => {
            if (Array.isArray(prop) && prop.length === 0) {
                return false;
            }
            if (typeof prop === "string" && prop.length === 0) {
                return false;
            }
            return prop === null ? false : true;
        };
        return serialize.filter(f => [...REQUIRED_PROPS].filter(prop => validateProperty(f[prop])).length ===
            REQUIRED_PROPS.length);
    }
    requestData(sql, dataset) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`https://api.resourcewatch.org/v1/query/${dataset.id}?sql=${sql}`);
            const data = yield response.json();
            return data;
        });
    }
    filterUpdate(filters, fields, widget, dataset) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!filters || !Array.isArray(filters) || filters.length === 0) {
                return [];
            }
            const { attributes: { name, description, widgetConfig } } = widget;
            const configuration = Object.assign(Object.assign({}, widgetConfig.paramsConfig), { title: name, caption: description });
            const out = yield core_1.FiltersService.handleFilters(filters, {
                column: "name",
                values: "value",
                type: "type"
            }, { configuration, dataset, fields, widget });
            return out;
        });
    }
}
exports.default = RwAdapter;
//# sourceMappingURL=index.js.map