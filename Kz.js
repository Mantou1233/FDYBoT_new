"use strict";
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
exports.__esModule = true;
exports.DefinePlugin = void 0;
require("reflect-metadata");
var info = Symbol("PluginInfo");
//function reg<T extends { new (...args: any[]): {} }>(constructor: T, K) {}
function DefinePlugin() {
    return function (constructor) {
        return /** @class */ (function (_super) {
            __extends(Plugin, _super);
            function Plugin() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Plugin;
        }(constructor));
    };
}
exports.DefinePlugin = DefinePlugin;
function Inject(target, propKey) {
    if (!propKey[info]) {
        target[info] = {
            info: {},
            commands: [],
            events: []
        };
    }
    if (propKey == "client") {
        target.client = 1;
    }
}
function Command(a) {
    return function (target, propKey, descriptor) {
        target[info].commands.push(propKey);
    };
}
var BasicPlugin = /** @class */ (function () {
    function BasicPlugin() {
    }
    BasicPlugin.prototype.echo = function (msg) {
        msg.reply("test");
    };
    __decorate([
        Inject
    ], BasicPlugin.prototype, "client");
    __decorate([
        Command({ override: {
                name: "shz"
            } })
    ], BasicPlugin.prototype, "echo");
    BasicPlugin = __decorate([
        DefinePlugin()
    ], BasicPlugin);
    return BasicPlugin;
}());
var ins = new BasicPlugin();
console.log(ins);
