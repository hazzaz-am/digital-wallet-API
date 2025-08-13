"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IWalletStatus = exports.IWalletType = void 0;
var IWalletType;
(function (IWalletType) {
    IWalletType["USER"] = "USER";
    IWalletType["AGENT"] = "AGENT";
    IWalletType["SYSTEM"] = "SYSTEM";
})(IWalletType || (exports.IWalletType = IWalletType = {}));
var IWalletStatus;
(function (IWalletStatus) {
    IWalletStatus["ACTIVE"] = "ACTIVE";
    IWalletStatus["BLOCKED"] = "BLOCKED";
})(IWalletStatus || (exports.IWalletStatus = IWalletStatus = {}));
