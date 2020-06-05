"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var latest_version_1 = require("latest-version");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var whatsapp_1 = require("../api/whatsapp");
var create_config_1 = require("../config/create-config");
var semver_1 = require("../utils/semver");
var auth_1 = require("./auth");
var browser_1 = require("./browser");
var chalk = require("chalk");
var boxen = require("boxen");
var Spinnies = require("spinnies");
var version = require('../../package.json').version;
// Global
var updatesChecked = false;
/**
 * Should be called to initialize whatsapp client
 */
function create(session, catchQR, options) {
    if (session === void 0) { session = 'session'; }
    return __awaiter(this, void 0, void 0, function () {
        var spinnies, mergedOptions, waPage, authenticated, _a, data, asciiQR, debugURL;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    spinnies = new Spinnies();
                    // Check for updates if needed
                    if (!updatesChecked) {
                        spinnies.add('sulla-version-spinner', { text: 'Checking for updates...' });
                        checkSullaVersion(spinnies);
                        updatesChecked = true;
                    }
                    // Initialize whatsapp
                    spinnies.add(session + "-auth", { text: 'Creating whatsapp instace...' });
                    mergedOptions = __assign(__assign({}, create_config_1.defaultOptions), options);
                    return [4 /*yield*/, browser_1.initWhatsapp(session, mergedOptions)];
                case 1:
                    waPage = _b.sent();
                    spinnies.update(session + "-auth", { text: 'Authenticating...' });
                    return [4 /*yield*/, auth_1.isAuthenticated(waPage)];
                case 2:
                    authenticated = _b.sent();
                    if (!authenticated) return [3 /*break*/, 4];
                    // Wait til inside chat
                    return [4 /*yield*/, auth_1.isInsideChat(waPage).toPromise()];
                case 3:
                    // Wait til inside chat
                    _b.sent();
                    spinnies.succeed(session + "-auth", { text: 'Authenticated' });
                    return [3 /*break*/, 9];
                case 4:
                    spinnies.update(session + "-auth", {
                        text: "Authenticate to continue",
                    });
                    if (!(mergedOptions.refreshQR <= 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, auth_1.retrieveQR(waPage)];
                case 5:
                    _a = _b.sent(), data = _a.data, asciiQR = _a.asciiQR;
                    if (catchQR) {
                        catchQR(data, asciiQR);
                    }
                    if (mergedOptions.logQR) {
                        console.log("Scan QR for: " + session + "                ");
                        console.log(asciiQR);
                    }
                    return [3 /*break*/, 7];
                case 6:
                    grabQRUntilInside(waPage, mergedOptions, session, catchQR);
                    _b.label = 7;
                case 7: 
                // Wait til inside chat
                return [4 /*yield*/, auth_1.isInsideChat(waPage).toPromise()];
                case 8:
                    // Wait til inside chat
                    _b.sent();
                    spinnies.succeed(session + "-auth", { text: 'Authenticated' });
                    _b.label = 9;
                case 9:
                    spinnies.add(session + "-inject", { text: 'Injecting api...' });
                    return [4 /*yield*/, browser_1.injectApi(waPage)];
                case 10:
                    waPage = _b.sent();
                    spinnies.succeed(session + "-inject", { text: 'Injecting api' });
                    if (mergedOptions.debug) {
                        debugURL = "http://localhost:" + fs_1.readFileSync("./" + session + "/DevToolsActivePort").slice(0, -54);
                        console.log("\nDebug: \u001B[34m" + debugURL + "\u001B[0m");
                    }
                    return [2 /*return*/, new whatsapp_1.Whatsapp(waPage)];
            }
        });
    });
}
exports.create = create;
function grabQRUntilInside(waPage, options, session, catchQR) {
    var isInside = auth_1.isInsideChat(waPage);
    rxjs_1.timer(0, options.refreshQR)
        .pipe(operators_1.takeUntil(isInside), operators_1.switchMap(function () { return auth_1.retrieveQR(waPage); }))
        .subscribe(function (_a) {
        var data = _a.data, asciiQR = _a.asciiQR;
        if (catchQR) {
            catchQR(data, asciiQR);
        }
        if (options.logQR) {
            console.clear();
            console.log("Scan QR for: " + session + "                ");
            console.log(asciiQR);
        }
    });
}
/**
 * Checs for a new versoin of sulla and logs
 */
function checkSullaVersion(spinnies) {
    latest_version_1.default('sulla').then(function (latest) {
        if (!semver_1.upToDate(version, latest)) {
            logUpdateAvailable(version, latest);
        }
        spinnies.succeed('sulla-version-spinner', { text: 'Checking for updates' });
    });
}
/**
 * Logs a boxen of instructions to update
 * @param current
 * @param latest
 */
function logUpdateAvailable(current, latest) {
    // prettier-ignore
    var newVersionLog = "There is a new version of " + chalk.bold("sulla") + " " + chalk.gray(current) + " \u279C  " + chalk.bold.green(latest) + "\n" +
        "Update your package by running:\n\n" +
        (chalk.bold('\>') + " " + chalk.blueBright('npm update sulla'));
    console.log(boxen(newVersionLog, { padding: 1 }));
    console.log("For more info visit: " + chalk.underline('https://github.com/danielcardeenas/sulla/blob/master/UPDATES.md') + "\n");
}
