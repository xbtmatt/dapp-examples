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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.defaultInitMintMachine = void 0;
var aptos_1 = require("aptos");
var mint_machine_1 = require("./mint-machine");
var string_utils_1 = require("../string-utils");
var add_tokens_1 = require("./add-tokens");
var fs_1 = require("fs");
var tokens_json_1 = require("./json/tokens.json");
var tokens_added_json_1 = require("./json/tokens-added.json");
var path_1 = require("path");
var mint_machine_2 = require("./mint-machine");
var config_1 = require("./config");
var utils_1 = require("../utils");
var DIRNAME = __dirname;
var TOKENS_ADDED_FILE_PATH = path_1.join(DIRNAME, 'json/tokens-added.json');
var CONFIG_YAML_PATH = path_1.join(DIRNAME, './.config.yaml');
// cast to a dictionary (Record) and delete the default value that typescript sometimes imports
var TOKENS_TO_ADD = tokens_json_1["default"];
if ('default' in TOKENS_TO_ADD) {
    delete TOKENS_TO_ADD['default'];
}
var TOKENS_ADDED_PER_ADMIN = tokens_added_json_1["default"];
if ('default' in TOKENS_ADDED_PER_ADMIN) {
    delete TOKENS_ADDED_PER_ADMIN['default'];
}
exports.defaultInitMintMachine = function (provider, admin) { return __awaiter(void 0, void 0, Promise, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mint_machine_1.initializeMintMachine(provider, admin, {
                    description: mint_machine_2.DEFAULT_COLLECTION_DESCRIPTION,
                    maxSupply: mint_machine_2.DEFAULT_MAX_SUPPLY,
                    name: mint_machine_2.DEFAULT_COLLECTION_NAME,
                    uri: mint_machine_2.DEFAULT_COLLECTION_URI,
                    mutableDescription: mint_machine_2.DEFAULT_MUTABLE_COLLECTION_DESCRIPTION,
                    mutableRoyalty: mint_machine_2.DEFAULT_MUTABLE_ROYALTY,
                    mutableUri: mint_machine_2.DEFAULT_MUTABLE_URI,
                    mutableTokenDescription: mint_machine_2.DEFAULT_MUTABLE_TOKEN_DESCRIPTION,
                    mutableTokenName: mint_machine_2.DEFAULT_MUTABLE_TOKEN_NAME,
                    mutableTokenProperties: mint_machine_2.DEFAULT_MUTABLE_TOKEN_PROPERTIES,
                    mutableTokenUri: mint_machine_2.DEFAULT_MUTABLE_TOKEN_URI,
                    tokensBurnableByCreator: mint_machine_2.DEFAULT_TOKENS_BURNABLE_BY_CREATOR,
                    tokensFreezableByCreator: mint_machine_2.DEFAULT_TOKENS_FREEZABLE_BY_CREATOR,
                    royaltyNumerator: mint_machine_2.DEFAULT_ROYALTY_NUMERATOR,
                    royaltyDenominator: mint_machine_2.DEFAULT_ROYALTY_DENOMINATOR,
                    tokenBaseName: mint_machine_2.DEFAULT_TOKEN_BASE_NAME
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mintMachineProps, tierProps, input, account, address, provider, faucetClient, creatorObject, tokensAddedPerAdmin, tokenUris, tokenMetadata, _i, tierProps_1, tier, _b, viewAllowlistTierInfoData, viewEligibleTiers, _c, _d, _e, events, response, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = config_1.getConfig(CONFIG_YAML_PATH), mintMachineProps = _a[0], tierProps = _a[1];
                string_utils_1.prettyView(mintMachineProps);
                string_utils_1.prettyView(tierProps);
                string_utils_1.prettyView({ currentTime: string_utils_1.formatDateToLocalString(new Date(Date.now())) });
                return [4 /*yield*/, utils_1.getInput("Do these configuration options look okay to you? [y/n]\n")];
            case 1:
                input = _g.sent();
                if (!utils_1.YES.includes(input.toLowerCase())) {
                    return [2 /*return*/];
                }
                account = new aptos_1.AptosAccount();
                address = account.address();
                provider = new aptos_1.Provider(aptos_1.Network.DEVNET);
                faucetClient = new aptos_1.FaucetClient(provider.aptosClient.nodeUrl, "https://faucet." + aptos_1.Network.DEVNET + ".aptoslabs.com");
                return [4 /*yield*/, faucetClient.fundAccount(address, 100000000)];
            case 2:
                _g.sent();
                // await defaultInitMintMachine(provider, account);
                return [4 /*yield*/, mint_machine_1.initializeMintMachine(provider, account, mintMachineProps)];
            case 3:
                // await defaultInitMintMachine(provider, account);
                _g.sent();
                return [4 /*yield*/, mint_machine_1.viewCreatorObject(provider, address)];
            case 4:
                creatorObject = _g.sent();
                string_utils_1.prettyView({
                    AccountAddress: address.hex(),
                    PrivateKey: aptos_1.HexString.fromUint8Array(account.signingKey.secretKey).toString().slice(0, 64),
                    CreatorObject: creatorObject.toString(),
                    ResourceAddress: mint_machine_1.RESOURCE_ACCOUNT_ADDRESS
                });
                return [4 /*yield*/, add_tokens_1.addTokensInChunks(provider, account, 127, false, false, false, TOKENS_TO_ADD, TOKENS_ADDED_PER_ADMIN)];
            case 5:
                tokensAddedPerAdmin = _g.sent();
                fs_1["default"].writeFileSync(TOKENS_ADDED_FILE_PATH, JSON.stringify(tokensAddedPerAdmin, null, 3));
                return [4 /*yield*/, mint_machine_1.viewTokenUris(provider, account.address())];
            case 6:
                tokenUris = _g.sent();
                string_utils_1.prettyView(tokenUris);
                return [4 /*yield*/, mint_machine_1.viewTokenMetadata(provider, account.address(), tokenUris.slice(0, 10))];
            case 7:
                tokenMetadata = _g.sent();
                _i = 0, tierProps_1 = tierProps;
                _g.label = 8;
            case 8:
                if (!(_i < tierProps_1.length)) return [3 /*break*/, 11];
                tier = tierProps_1[_i];
                console.log(tier);
                console.log(tier.startTimestamp);
                console.log(tier.endTimestamp);
                return [4 /*yield*/, mint_machine_1.upsertTier(provider, account, tier)];
            case 9:
                _g.sent();
                _g.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 8];
            case 11:
                _b = string_utils_1.prettyView;
                return [4 /*yield*/, mint_machine_1.viewReadyForLaunch(provider, account.address())];
            case 12:
                _b.apply(void 0, [_g.sent()]);
                return [4 /*yield*/, Promise.all(tierProps.map(function (tier) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        tier: tier.tierName
                                    };
                                    return [4 /*yield*/, mint_machine_1.viewAllowlistTierInfo(provider, creatorObject, tier.tierName)];
                                case 1: return [2 /*return*/, (_a.info = _b.sent(),
                                        _a)];
                            }
                        });
                    }); }))];
            case 13:
                viewAllowlistTierInfoData = _g.sent();
                string_utils_1.prettyView(viewAllowlistTierInfoData);
                return [4 /*yield*/, Promise.all(tierProps.map(function (tier) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        tier: tier.tierName
                                    };
                                    return [4 /*yield*/, mint_machine_1.addressEligibleForTier(provider, creatorObject, account.address(), tier.tierName)];
                                case 1: return [2 /*return*/, (_a.info = _b.sent(),
                                        _a)];
                            }
                        });
                    }); }))];
            case 14:
                viewEligibleTiers = _g.sent();
                string_utils_1.prettyView(viewEligibleTiers);
                _c = string_utils_1.prettyPrint;
                return [4 /*yield*/, mint_machine_1.enableMinting(provider, account)];
            case 15:
                _c.apply(void 0, [_g.sent()]);
                _d = string_utils_1.prettyView;
                return [4 /*yield*/, mint_machine_1.viewMintConfiguration(provider, creatorObject)];
            case 16:
                _d.apply(void 0, [_g.sent()]);
                string_utils_1.prettyView(viewAllowlistTierInfoData);
                console.log('ok4');
                //mintAndViewTokens(provider, account, 250);
                return [2 /*return*/];
            case 17:
                _e = (_g.sent()), events = _e.events, response = __rest(_e, ["events"]);
                string_utils_1.prettyPrint(__assign({ events: [] }, response));
                return [4 /*yield*/, mint_machine_1.viewTokenUris(provider, account.address())];
            case 18:
                tokenUris = _g.sent();
                string_utils_1.prettyView(tokenUris);
                _f = string_utils_1.prettyView;
                return [4 /*yield*/, mint_machine_1.viewTokenMetadata(provider, account.address(), tokenUris.slice(0, 10))];
            case 19:
                _f.apply(void 0, [_g.sent()]);
                return [2 /*return*/];
        }
    });
}); })();
