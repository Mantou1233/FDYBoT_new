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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
require("reflect-metadata");
var info = Symbol("PluginInfo");
//function reg<T extends { new (...args: any[]): {} }>(constructor: T, K) {}
function RegisterPlugin(a) {
    if (typeof a == "string") {
        a = {
            name: a
        };
    }
    return function (constructor) {
        var _a, _b;
        return _b = /** @class */ (function (_super) {
                __extends(Plugin, _super);
                function Plugin() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this[_a] = __assign({
                        info: {},
                        commands: [],
                        events: []
                    }, { info: a });
                    return _this;
                }
                return Plugin;
            }(constructor)),
            _a = info,
            _b;
    };
}
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
        RegisterPlugin("test")
    ], BasicPlugin);
    return BasicPlugin;
}());
var ins = new BasicPlugin();
console.log(ins);
