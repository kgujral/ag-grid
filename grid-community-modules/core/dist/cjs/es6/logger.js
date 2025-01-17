"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LoggerFactory = void 0;
const context_1 = require("./context/context");
const context_2 = require("./context/context");
const beanStub_1 = require("./context/beanStub");
let LoggerFactory = class LoggerFactory extends beanStub_1.BeanStub {
    setBeans(gridOptionsService) {
        this.logging = gridOptionsService.is('debug');
    }
    create(name) {
        return new Logger(name, this.isLogging.bind(this));
    }
    isLogging() {
        return this.logging;
    }
};
__decorate([
    __param(0, context_2.Qualifier('gridOptionsService'))
], LoggerFactory.prototype, "setBeans", null);
LoggerFactory = __decorate([
    context_1.Bean('loggerFactory')
], LoggerFactory);
exports.LoggerFactory = LoggerFactory;
class Logger {
    constructor(name, isLoggingFunc) {
        this.name = name;
        this.isLoggingFunc = isLoggingFunc;
    }
    isLogging() {
        return this.isLoggingFunc();
    }
    log(message) {
        if (this.isLoggingFunc()) {
            // tslint:disable-next-line
            console.log('AG Grid.' + this.name + ': ' + message);
        }
    }
}
exports.Logger = Logger;
