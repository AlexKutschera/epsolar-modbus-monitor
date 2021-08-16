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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatteryVoltageMode = exports.LoadControllingMode = exports.BatteryType = void 0;
var events_1 = require("events");
var serialport_1 = __importDefault(require("serialport"));
var jsmodbus_1 = require("jsmodbus");
var BatteryType;
(function (BatteryType) {
    BatteryType[BatteryType["Sealed"] = 1] = "Sealed";
    BatteryType[BatteryType["GEL"] = 2] = "GEL";
    BatteryType[BatteryType["Flooded"] = 3] = "Flooded";
    BatteryType[BatteryType["UserDefined"] = 0] = "UserDefined";
})(BatteryType = exports.BatteryType || (exports.BatteryType = {}));
var LoadControllingMode;
(function (LoadControllingMode) {
    LoadControllingMode[LoadControllingMode["ManualControl"] = 0] = "ManualControl";
    LoadControllingMode[LoadControllingMode["LightOnOff"] = 1] = "LightOnOff";
    LoadControllingMode[LoadControllingMode["LightOnTimer"] = 2] = "LightOnTimer";
    LoadControllingMode[LoadControllingMode["TimeControl"] = 3] = "TimeControl";
})(LoadControllingMode = exports.LoadControllingMode || (exports.LoadControllingMode = {}));
var BatteryVoltageMode;
(function (BatteryVoltageMode) {
    BatteryVoltageMode[BatteryVoltageMode["Auto"] = 0] = "Auto";
    BatteryVoltageMode[BatteryVoltageMode["_12V"] = 1] = "_12V";
    BatteryVoltageMode[BatteryVoltageMode["_24V"] = 2] = "_24V";
})(BatteryVoltageMode = exports.BatteryVoltageMode || (exports.BatteryVoltageMode = {}));
var SolarChargeController = /** @class */ (function (_super) {
    __extends(SolarChargeController, _super);
    function SolarChargeController(path, address, debug) {
        if (address === void 0) { address = 0x01; }
        if (debug === void 0) { debug = false; }
        var _this = _super.call(this) || this;
        _this.ratedData = {
            /**
             * PV array rated voltage (V)
             */
            ratedInputVoltage: function () { return _this.readInputRegisterUInt16(0x3000, 100); },
            /**
             * PV array rated current (A)
             */
            ratedInputCurrent: function () { return _this.readInputRegisterUInt16(0x3001, 100); },
            /**
             * PV array rated power (W)
             */
            ratedInputPower: function () { return _this.readInputRegisterUInt32(0x3002, 100); },
            /**
             * Battery's voltage (V)
             */
            ratedOutputVoltage: function () { return _this.readInputRegisterUInt16(0x3004, 100); },
            /**
             * Rated charging current to battery (A)
             */
            ratedOutputCurrent: function () { return _this.readInputRegisterUInt16(0x3005, 100); },
            /**
             * Rated charging power to battery (W)
             */
            ratedOutputPower: function () { return _this.readInputRegisterUInt32(0x3006, 100); },
            chargingMode: function () { return __awaiter(_this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.readInputRegisterUInt16(0x3008)];
                        case 1: return [2 /*return*/, (_a.sent()) == 0x0001 ? "PWM" : "unknown"];
                        case 2:
                            e_1 = _a.sent();
                            throw e_1;
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
            /**
             * (A)
             */
            ratedLoadOutputCurrent: function () { return _this.readInputRegisterUInt16(0x300E, 100); }
        };
        _this.realTimeData = {
            /**
             * Solar charge controller--PV array voltage (V)
             */
            inputVoltage: function () { return _this.readInputRegisterUInt16(0x3100, 100); },
            /**
             * Solar charge controller--PV array current (A)
             */
            inputCurrent: function () { return _this.readInputRegisterUInt16(0x3101, 100); },
            /**
             * Solar charge controller--PV array power (W)
             */
            inputPower: function () { return _this.readInputRegisterUInt32(0x3102, 100); },
            /**
             * Battery voltage (V)
             */
            outputVoltage: function () { return _this.readInputRegisterUInt16(0x3104, 100); },
            /**
             * Battery charging current (A)
             */
            outputCurrent: function () { return _this.readInputRegisterUInt16(0x3105, 100); },
            /**
             * Battery charging power (W)
             */
            outputPower: function () { return _this.readInputRegisterUInt32(0x3106, 100); },
            /**
             * Load voltage (V)
             */
            loadVoltage: function () { return _this.readInputRegisterUInt16(0x310C, 100); },
            /**
             * Load current (A)
             */
            loadCurrent: function () { return _this.readInputRegisterUInt16(0x310D, 100); },
            /**
             * Load power (W)
             */
            loadPower: function () { return _this.readInputRegisterUInt32(0x310E, 100); },
            /**
             * Battery Temperature (°C)
             */
            batteryTemperature: function () { return _this.readInputRegisterInt16(0x3110, 100); },
            /**
             * Temperature inside case (°C)
             */
            caseTemperature: function () { return _this.readInputRegisterInt16(0x3111, 100); },
            /**
             * Heat sink surface temperature of equipments' power components (°C)
             */
            powerComponentsTemperature: function () { return _this.readInputRegisterInt16(0x3112, 100); },
            /**
             * The percentage of battery's remaining capacity (%)
             */
            batterySOC: function () { return _this.readInputRegisterUInt16(0x311A, 100); },
            /**
             * The battery tempeture measured by remote temperature sensor (°C)
             */
            remoteBatteryTemperature: function () { return _this.readInputRegisterInt16(0x311B, 100); },
            /**
             * Current system rated voltage (V)
             */
            batteryRealRatedPower: function () { return _this.readInputRegisterUInt16(0x311D, 100); }
        };
        _this.realTimeStatus = {
            /**
             * D3-D0: 01H Overvolt , 00H Normal , 02H Under Volt, 03H Low Volt Disconnect, 04H Fault.
             * D7-D4: 00H Normal, 01H Over Temp.(Higher than the warning settings), 02H Low Temp.(Lower than the warning settings).
             * D8: Battery inerternal resistance abnormal 1, normal 0.
             * D15: 1-Wrong identification for rated voltage.
             */
            batteryStatus: function () { return __awaiter(_this, void 0, void 0, function () {
                var e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.readInputRegisterUInt16(0x3200)];
                        case 1: return [2 /*return*/, ((_a.sent()) >> 0).toString(2)];
                        case 2:
                            e_2 = _a.sent();
                            throw e_2;
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
            /**
             * D15-D14: Input volt status. 00 normal, 01 no power connected, 02H Higher volt input, 03H Input volt error.
             * D13: Charging MOSFET is short.
             * D12: Charging or Anti-reverse MOSFET is short.
             * D11: Anti-reverse MOSFET is short.
             * D10: Input is over current.
             * D9: The load is Over current.
             * D8: The load is short.
             * D7: Load MOSFET is short.
             * D4: PV Input is short.
             * D3-2: Charging status. 00 No charging,01 Float,02 Boost,03 Equlization.
             * D1: 0 Normal, 1 Fault.
             * D0: 1 Running, 0 Standby.
             */
            chargingEquipmentStatus: function () { return __awaiter(_this, void 0, void 0, function () {
                var e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.readInputRegisterUInt16(0x3201)];
                        case 1: return [2 /*return*/, ((_a.sent()) >> 0).toString(2)];
                        case 2:
                            e_3 = _a.sent();
                            throw e_3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); }
        };
        _this.statisticalParameter = {
            /**
             * Maximum input volt (PV) today (V). 00: 00 Refresh every day.
             */
            maximumInputToday: function () { return _this.readInputRegisterUInt16(0x3300, 100); },
            /**
             * Minimum input volt (PV) today (V). 00: 00 Refresh every day.
             */
            minimumInputToday: function () { return _this.readInputRegisterUInt16(0x3301, 100); },
            /**
             * Maximum battery volt today (V). 00: 00 Refresh every day.
             */
            maximumBatteryVoltToday: function () { return _this.readInputRegisterUInt16(0x3302, 100); },
            /**
             * Minimum battery volt today (V). 00: 00 Refresh every day.
             */
            minimumBatteryVoltToday: function () { return _this.readInputRegisterUInt16(0x3303, 100); },
            /**
             * Consumed energy today (KWH). 00: 00 Refresh every day.
             */
            consumptionToday: function () { return _this.readInputRegisterUInt32(0x3304, 100); },
            /**
             * Consumed energy this month (KWH). 00: 00 Clear on the first day of month.
             */
            consumptionThisMonth: function () { return _this.readInputRegisterUInt32(0x3306, 100); },
            /**
             * Consumed energy this year (KWH). 00: 00 Clear on 1, Jan.
             */
            consumptionThisYear: function () { return _this.readInputRegisterUInt32(0x3308, 100); },
            /**
             * Total consumed energy (KWH)
             */
            consumptionTotal: function () { return _this.readInputRegisterUInt32(0x330A, 100); },
            /**
             * Generated energy today (KWH). 00: 00 Clear every day.
             */
            generationToday: function () { return _this.readInputRegisterUInt32(0x330C, 100); },
            /**
             * Generated energy this month (KWH). 00: 00 Clear on the first day of month.
             */
            generationThisMonth: function () { return _this.readInputRegisterUInt32(0x330E, 100); },
            /**
             * Generated energy this year (KWH). 00: 00 Clear on 1, Jan.
             */
            generationThisYear: function () { return _this.readInputRegisterUInt32(0x3310, 100); },
            /**
             * Total generated energy (KWH)
             */
            generationTotal: function () { return _this.readInputRegisterUInt32(0x3312, 100); },
            /**
             * Saving 1 Kilowatt =Reduction 0.997KG "Carbon dioxide" =Reduction 0.272KG "Carton" (Ton)
             */
            carbonDioxideReduction: function () { return _this.readInputRegisterUInt32(0x3314, 100); },
            /**
             * The net battery current,charging current minus the discharging one. The positive value represents charging and negative, discharging. (A)
             */
            batteryCurrent: function () { return _this.readInputRegisterInt32(0x331B, 100); },
            /**
             * Battery Temp. (°C)
             */
            batteryTemperature: function () { return _this.readInputRegisterInt16(0x331D, 100); },
            /**
             * Ambient Temp. (°C)
             */
            ambientTemperature: function () { return _this.readInputRegisterInt16(0x331E, 100); }
        };
        _this.settingParameter = {
            batteryType: function () { return __awaiter(_this, void 0, void 0, function () {
                var response, _a, e_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.client.readHoldingRegisters(0x9000, 1)];
                        case 1:
                            response = (_b.sent()).response;
                            if (this.debug)
                                console.log(response.body.valuesAsBuffer);
                            _a = BatteryType;
                            return [4 /*yield*/, this.readHoldingRegisterInt16(0x9000)];
                        case 2: return [2 /*return*/, _a[_b.sent()]];
                        case 3:
                            e_4 = _b.sent();
                            throw e_4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
            setBatteryType: function (type) { return _this.writeSingleRegister(0x9000, type); },
            /**
             * Rated capacity of the battery (AH)
             */
            batteryCapacity: function () { return _this.readHoldingRegisterInt16(0x9001); },
            /**
             * Rated capacity of the battery (AH)
             */
            setBatteryCapacity: function (capacity) { return _this.writeSingleRegister(0x9001, capacity); },
            /**
             * Temperature compensation coefficient Range 0-9 (mV/°C/2V)
             */
            temperatureCompensationCoefficient: function () { return _this.readHoldingRegisterInt16(0x9002, 100); },
            /**
             * Temperature compensation coefficient Range 0-9 (mV/°C/2V)
             */
            setTemperatureCompensationCoefficient: function (temperatureCompensationCoefficient) { return _this.writeSingleRegister(0x9002, temperatureCompensationCoefficient * 100); },
            /**
             * High Volt. disconnect (V)
             */
            highVoltageDisconnect: function () { return _this.readHoldingRegisterInt16(0x9003, 100); },
            /**
             * High Volt. disconnect (V)
             */
            setHighVoltageDisconnect: function (highVoltageDisconnect) { return _this.writeSingleRegister(0x9003, highVoltageDisconnect * 100); },
            /**
             * Charging limit voltage (V)
             */
            chargingLimitVoltage: function () { return _this.readHoldingRegisterInt16(0x9004, 100); },
            /**
             * Charging limit voltage (V)
             */
            setChargingLimitVoltage: function (chargingLimitVoltage) { return _this.writeSingleRegister(0x9004, chargingLimitVoltage * 100); },
            /**
             * Over voltage reconnect (V)
             */
            overVoltageReconnect: function () { return _this.readHoldingRegisterInt16(0x9005, 100); },
            /**
             * Over voltage reconnect (V)
             */
            setOverVoltageReconnect: function (overVoltageReconnect) { return _this.writeSingleRegister(0x9005, overVoltageReconnect * 100); },
            /**
             * Equalization voltage (V)
             */
            equalizationVoltage: function () { return _this.readHoldingRegisterInt16(0x9006, 100); },
            /**
             * Equalization voltage (V)
             */
            setEqualizationVoltage: function (equalizationVoltage) { return _this.writeSingleRegister(0x9006, equalizationVoltage * 100); },
            /**
             * Boost voltage (V)
             */
            boostVoltage: function () { return _this.readHoldingRegisterInt16(0x9007, 100); },
            /**
             * Boost voltage (V)
             */
            setBoostVoltage: function (boostVoltage) { return _this.writeSingleRegister(0x9007, boostVoltage * 100); },
            /**
             * Float voltage (V)
             */
            floatVoltage: function () { return _this.readHoldingRegisterInt16(0x9008, 100); },
            /**
             * Float voltage (V)
             */
            setFloatVoltage: function (floatVoltage) { return _this.writeSingleRegister(0x9008, floatVoltage * 100); },
            /**
             * Boost reconnect voltage (V)
             */
            boostReconnectVoltage: function () { return _this.readHoldingRegisterInt16(0x9009, 100); },
            /**
             * Boost reconnect voltage (V)
             */
            setBoostReconnectVoltage: function (boostReconnectVoltage) { return _this.writeSingleRegister(0x9009, boostReconnectVoltage * 100); },
            /**
             * Low voltage reconnect (V)
             */
            lowVoltageReconnect: function () { return _this.readHoldingRegisterInt16(0x900A, 100); },
            /**
             * Low voltage reconnect (V)
             */
            setLowVoltageReconnect: function (lowVoltageReconnect) { return _this.writeSingleRegister(0x900A, lowVoltageReconnect * 100); },
            /**
             * Under voltage recover (V)
             */
            underVoltageReconnect: function () { return _this.readHoldingRegisterInt16(0x900B, 100); },
            /**
             * Under voltage recover (V)
             */
            setUnderVoltageReconnect: function (underVoltageReconnect) { return _this.writeSingleRegister(0x900B, underVoltageReconnect * 100); },
            /**
             * Under voltage warning (V)
             */
            underVoltageWarning: function () { return _this.readHoldingRegisterInt16(0x900C, 100); },
            /**
             * Under voltage warning (V)
             */
            setUnderVoltageWarning: function (underVoltageWarning) { return _this.writeSingleRegister(0x900C, underVoltageWarning * 100); },
            /**
             * Low voltage disconnect (V)
             */
            lowVoltageDisconnect: function () { return _this.readHoldingRegisterInt16(0x900D, 100); },
            /**
             * Low voltage disconnect (V)
             */
            setLowVoltageDisconnect: function (lowVoltageDisconnect) { return _this.writeSingleRegister(0x900D, lowVoltageDisconnect * 100); },
            /**
             * Discharging limit voltage (V)
             */
            dischargingLimitVoltage: function () { return _this.readHoldingRegisterInt16(0x900E, 100); },
            /**
             * Discharging limit voltage (V)
             */
            setDischargingLimitVoltage: function (dischargingLimitVoltage) { return _this.writeSingleRegister(0x900E, dischargingLimitVoltage * 100); },
            /**
             * Real time clock
             */
            rtc: function () { return __awaiter(_this, void 0, void 0, function () {
                var response, date, e_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.client.readHoldingRegisters(0x9013, 3)];
                        case 1:
                            response = (_a.sent()).response;
                            if (this.debug)
                                console.log(response.body.valuesAsBuffer);
                            date = new Date();
                            date.setSeconds(response.body.valuesAsBuffer.readInt8(1));
                            date.setMinutes(response.body.valuesAsBuffer.readInt8(0));
                            date.setHours(response.body.valuesAsBuffer.readInt8(3));
                            date.setDate(response.body.valuesAsBuffer.readInt8(2));
                            date.setMonth(response.body.valuesAsBuffer.readInt8(5) - 1);
                            date.setFullYear(Number("20" + response.body.valuesAsBuffer.readInt8(4)));
                            return [2 /*return*/, date];
                        case 2:
                            e_5 = _a.sent();
                            throw e_5;
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
            /**
             * Real time clock
             */
            setRTC: function (date) {
                if (date === void 0) { date = new Date(); }
                return __awaiter(_this, void 0, void 0, function () {
                    var buffer, e_6;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                buffer = Buffer.alloc(6);
                                buffer.writeInt8(date.getSeconds(), 1);
                                buffer.writeInt8(date.getMinutes(), 0);
                                buffer.writeInt8(date.getHours(), 3);
                                buffer.writeInt8(date.getDate(), 2);
                                buffer.writeInt8(date.getMonth() + 1, 5);
                                buffer.writeInt8(parseInt(date.getFullYear().toString().substr(2)), 4);
                                return [4 /*yield*/, this.client.writeMultipleRegisters(0x9013, buffer)];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                e_6 = _a.sent();
                                throw e_6;
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            },
            /**
             * Interval days of auto equalization charging in cycle (Day)
             */
            equalizationChargingCycle: function () { return _this.readHoldingRegisterInt16(0x9016); },
            /**
             * Interval days of auto equalization charging in cycle (Day)
             */
            setEqualizationChargingCycle: function (equalizationChargingCycle) { return _this.writeSingleRegister(0x9016, equalizationChargingCycle); },
            /**
             * Battery temperature warning upper limit (°C)
             */
            batteryTemperatureUpperLimit: function () { return _this.readHoldingRegisterInt16(0x9017, 100); },
            /**
             * Battery temperature warning upper limit (°C)
             */
            setBatteryTemperatureUpperLimit: function (batteryTemperatureUpperLimit) { return _this.writeSingleRegister(0x9017, batteryTemperatureUpperLimit * 100); },
            /**
             * Battery temperature warning lower limit (°C)
             */
            batteryTemperatureLowerLimit: function () { return _this.readHoldingRegisterInt16(0x9018, 100); },
            /**
             * Battery temperature warning lower limit (°C)
             */
            setBatteryTemperatureLowerLimit: function (batteryTemperatureLowerLimit) { return _this.writeSingleRegister(0x9018, batteryTemperatureLowerLimit * 100); },
            /**
             * Controller inner temperature upper limit (°C)
             */
            controllerTemperatureUpperLimit: function () { return _this.readHoldingRegisterInt16(0x9019, 100); },
            /**
             * Controller inner temperature upper limit (°C)
             */
            setControllerTemperatureUpperLimit: function (controllerTemperatureUpperLimit) { return _this.writeSingleRegister(0x9019, controllerTemperatureUpperLimit * 100); },
            /**
             * After Over Temperature, system recover once it drop to lower than this value (°C)
             */
            controllerTemperatureUpperRecoveryLimit: function () { return _this.readHoldingRegisterInt16(0x901A, 100); },
            /**
             * After Over Temperature, system recover once it drop to lower than this value (°C)
             */
            setControllerTemperatureUpperRecoveryLimit: function (controllerTemperatureUpperRecoveryLimit) { return _this.writeSingleRegister(0x901A, controllerTemperatureUpperRecoveryLimit * 100); },
            /**
             * Warning when surface temperature of power components higher than this value, and charging and discharging stop (°C)
             */
            powerComponentTemperatureUpperLimit: function () { return _this.readHoldingRegisterInt16(0x901B, 100); },
            /**
             * Warning when surface temperature of power components higher than this value, and charging and discharging stop (°C)
             */
            setPowerComponentTemperatureUpperLimit: function (powerComponentTemperatureUpperLimit) { return _this.writeSingleRegister(0x901B, powerComponentTemperatureUpperLimit * 100); },
            /**
             * Recover once power components temperature lower than this value (°C)
             */
            powerComponentTemperatureUpperRecoveryLimit: function () { return _this.readHoldingRegisterInt16(0x901C, 100); },
            /**
             * Recover once power components temperature lower than this value (°C)
             */
            setPowerComponentTemperatureUpperRecoveryLimit: function (powerComponentTemperatureUpperRecoveryLimit) { return _this.writeSingleRegister(0x901C, powerComponentTemperatureUpperRecoveryLimit * 100); },
            /**
             * The resistance of the connected wires (milliohm)
             */
            lineImpedance: function () { return _this.readHoldingRegisterInt16(0x901D, 100); },
            /**
             * The resistance of the connected wires (milliohm)
             */
            setLineImpedance: function (lineImpedance) { return _this.writeSingleRegister(0x901D, lineImpedance * 100); },
            /**
             * Night TimeThreshold Volt. PV lower lower than this value, controller would detect it as sundown (V)
             */
            nttv: function () { return _this.readHoldingRegisterInt16(0x901E, 100); },
            /**
             * Night TimeThreshold Volt. PV lower lower than this value, controller would detect it as sundown (V)
             */
            setNttv: function (nttv) { return _this.writeSingleRegister(0x901E, nttv * 100); },
            /**
             * Light signal startup (night) delay time. PV voltage lower than NTTV, and duration exceeds the Light signal startup (night) delay time, controller would detect it as night time. (Min)
             */
            nttvDelay: function () { return _this.readHoldingRegisterInt16(0x901F); },
            /**
             * Light signal startup (night) delay time. PV voltage lower than NTTV, and duration exceeds the Light signal startup (night) delay time, controller would detect it as night time. (Min)
             */
            setNttvDelay: function (nttvDelay) { return _this.writeSingleRegister(0x901F, nttvDelay); },
            /**
             * Day Time Threshold Volt. PV voltage higher than this value, controller would detect it as sunrise (V)
             */
            dttv: function () { return _this.readHoldingRegisterInt16(0x9020, 100); },
            /**
             * Day Time Threshold Volt. PV voltage higher than this value, controller would detect it as sunrise (V)
             */
            setDttv: function (dttv) { return _this.writeSingleRegister(0x9020, dttv * 100); },
            /**
             * Light signal turn off(day) delay time. PV voltage higher than DTTV, and duration exceeds Light signal turn off(day) delay time delay time, controller would detect it as daytime. (Min)
             */
            dttvDelay: function () { return _this.readHoldingRegisterInt16(0x9021); },
            /**
             * Light signal turn off(day) delay time. PV voltage higher than DTTV, and duration exceeds Light signal turn off(day) delay time delay time, controller would detect it as daytime. (Min)
             */
            setDttvDelay: function (dttvDelay) { return _this.writeSingleRegister(0x9021, dttvDelay); },
            /**
             * Load controlling mode
             */
            loadControllingMode: function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, e_7;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            _a = LoadControllingMode;
                            return [4 /*yield*/, this.readHoldingRegisterInt16(0x903D)];
                        case 1: return [2 /*return*/, _a[_b.sent()]];
                        case 2:
                            e_7 = _b.sent();
                            throw e_7;
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
            /**
             * Load controlling mode
             */
            setLoadControllingMode: function (loadControllingMode) { return _this.writeSingleRegister(0x903D, loadControllingMode); },
            /**
             * The length of load output timer1
             */
            workingTime1: function () { return __awaiter(_this, void 0, void 0, function () {
                var response, e_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.client.readHoldingRegisters(0x903E, 3)];
                        case 1:
                            response = (_a.sent()).response;
                            return [2 /*return*/, {
                                    minutes: response.body.valuesAsBuffer.readInt8(0),
                                    hours: response.body.valuesAsBuffer.readInt8(1)
                                }];
                        case 2:
                            e_8 = _a.sent();
                            throw e_8;
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
            /**
             * The length of load output timer1
             */
            setWorkingTime1: function (minutes, hours) { return _this.writeSingleRegister(0x903E, Buffer.from([minutes, hours]).readInt16BE()); },
            /**
             * The length of load output timer2
             */
            workingTime2: function () { return __awaiter(_this, void 0, void 0, function () {
                var response, e_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.client.readHoldingRegisters(0x903F, 3)];
                        case 1:
                            response = (_a.sent()).response;
                            return [2 /*return*/, {
                                    minutes: response.body.valuesAsBuffer.readInt8(0),
                                    hours: response.body.valuesAsBuffer.readInt8(1)
                                }];
                        case 2:
                            e_9 = _a.sent();
                            throw e_9;
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
            /**
             * The length of load output timer2
             */
            setWorkingTime2: function (minutes, hours) { return _this.writeSingleRegister(0x903F, Buffer.from([minutes, hours]).readInt16BE()); },
            /**
             * Turn on timing 1
             */
            turnOnTiming1: function (seconds, minutes, hours) { return __awaiter(_this, void 0, void 0, function () {
                var e_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.writeSingleRegister(0x9042, seconds)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.writeSingleRegister(0x9043, minutes)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.writeSingleRegister(0x9044, hours)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_10 = _a.sent();
                            throw e_10;
                        case 5: return [2 /*return*/];
                    }
                });
            }); },
            /**
             * Turn off timing 1
             */
            turnOffTiming1: function (seconds, minutes, hours) { return __awaiter(_this, void 0, void 0, function () {
                var e_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.writeSingleRegister(0x9045, seconds)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.writeSingleRegister(0x9046, minutes)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.writeSingleRegister(0x9047, hours)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_11 = _a.sent();
                            throw e_11;
                        case 5: return [2 /*return*/];
                    }
                });
            }); },
            /**
             * Turn on timing 2
             */
            turnOnTiming2: function (seconds, minutes, hours) { return __awaiter(_this, void 0, void 0, function () {
                var e_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.writeSingleRegister(0x9048, seconds)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.writeSingleRegister(0x9049, minutes)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.writeSingleRegister(0x904A, hours)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_12 = _a.sent();
                            throw e_12;
                        case 5: return [2 /*return*/];
                    }
                });
            }); },
            /**
             * Turn off timing 2
             */
            turnOffTiming2: function (seconds, minutes, hours) { return __awaiter(_this, void 0, void 0, function () {
                var e_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.writeSingleRegister(0x904B, seconds)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.writeSingleRegister(0x904C, minutes)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.writeSingleRegister(0x904D, hours)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_13 = _a.sent();
                            throw e_13;
                        case 5: return [2 /*return*/];
                    }
                });
            }); },
            /**
             * Length of night
             */
            lengthOfNight: function () { return __awaiter(_this, void 0, void 0, function () {
                var response, e_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.client.readHoldingRegisters(0x9065, 3)];
                        case 1:
                            response = (_a.sent()).response;
                            return [2 /*return*/, {
                                    minutes: response.body.valuesAsBuffer.readInt8(0),
                                    hours: response.body.valuesAsBuffer.readInt8(1)
                                }];
                        case 2:
                            e_14 = _a.sent();
                            throw e_14;
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
            /**
             * Length of night
             */
            setLengthOfNight: function (minutes, hours) { return _this.writeSingleRegister(0x9065, Buffer.from([minutes, hours]).readInt16BE()); },
            /**
             * Battery rated voltage Mode
             */
            batteryVoltageMode: function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, e_15;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            _a = BatteryVoltageMode;
                            return [4 /*yield*/, this.readHoldingRegisterInt16(0x9067)];
                        case 1: return [2 /*return*/, _a[_b.sent()]];
                        case 2:
                            e_15 = _b.sent();
                            throw e_15;
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
            /**
             * Battery rated voltage Mode
             */
            setBatteryVoltageMode: function (batteryVoltageMode) { return _this.writeSingleRegister(0x9067, batteryVoltageMode); },
            /**
             * Selected timing period of the load.0, using one timer, 1-using two timer, likewise.
             */
            loadTimingControl: function () { return _this.readHoldingRegisterInt16(0x9069); },
            /**
             * Selected timing period of the load.0, using one timer, 1-using two timer, likewise.
             */
            setLoadTimingControl: function (loadTimingControl) { return _this.writeSingleRegister(0x9069, loadTimingControl); },
            // TODO Default Load On/Off in manual mode
            /**
             * Equalize duration, Usually 60-120 minutes (minute)
             */
            equalizeDuration: function () { return _this.readHoldingRegisterInt16(0x906B); },
            /**
             * Equalize duration, Usually 60-120 minutes (minute)
             */
            setEqualizeDuration: function (equalizeDuration) { return _this.writeSingleRegister(0x906B, equalizeDuration); },
            /**
             * Equalize duration, Usually 60-120 minutes (minute)
             */
            boostDuration: function () { return _this.readHoldingRegisterInt16(0x906C); },
            /**
             * Equalize duration, Usually 60-120 minutes (minute)
             */
            setBoostDuration: function (boostDuration) { return _this.writeSingleRegister(0x906C, boostDuration); },
            /**
             * Discharging percentage, Usually 20%-80%. The percentage of battery's remaining capacity when stop charging (%)
             */
            dischargingPercentage: function () { return _this.readHoldingRegisterInt16(0x906D, 100); },
            /**
             * Discharging percentage, Usually 20%-80%. The percentage of battery's remaining capacity when stop charging (%)
             */
            setDischargingPercentage: function (dischargingPercentage) { return _this.writeSingleRegister(0x906D, dischargingPercentage * 100); },
            /**
             * Depth of charge, 20%-100%. (%)
             */
            chargingPercentage: function () { return _this.readHoldingRegisterInt16(0x906E, 100); },
            /**
             * Depth of charge, 20%-100%. (%)
             */
            setChargingPercentage: function (chargingPercentage) { return _this.writeSingleRegister(0x906D, chargingPercentage * 100); },
            // TODO Management modes of battery charging and discharging
        };
        _this.coils = {
            /**
             * When the load is manual mode，1-manual on 0 -manual off
             */
            manualLoad: function () { return _this.readCoil(0x2); },
            /**
             * When the load is manual mode，1-manual on 0 -manual off
             */
            setManualLoad: function (manualLoad) { return _this.client.writeSingleCoil(0x2, manualLoad); },
            /**
             * Enable load test mode. 1 Enable 0 Disable(normal)
             */
            loadTestMode: function () { return _this.readCoil(0x5); },
            /**
             * Enable load test mode. 1 Enable 0 Disable(normal)
             */
            setLoadTestMode: function (loadTestMode) { return _this.writeCoil(0x5, loadTestMode); },
            /**
             * Force the load on/off. 1 Turn on, 0 Turn off (used for temporary test of the load）
             */
            forceLoad: function () { return _this.readCoil(0x6); },
            /**
             * Force the load on/off. 1 Turn on, 0 Turn off (used for temporary test of the load）
             */
            setForceLoad: function (forceLoad) { return _this.writeCoil(0x6, forceLoad); }
        };
        _this.discreteInput = {
            /**
             * Over temperature inside the device. 1 The temperature inside the controller is higher than the over-temperature protection point. 0 Normal
             */
            overTemperature: function () { return _this.readDiscreteInput(0x2000); },
            /**
             * Day/Night. 1-Night, 0-Day
             */
            night: function () { return _this.readDiscreteInput(0x200C); }
        };
        if (SolarChargeController.sockets.find(function (e) { return e.path == path; })) {
            _this.socket = SolarChargeController.sockets.find(function (e) { return e.path == path; }).socket;
        }
        else {
            _this.socket = new serialport_1.default(path, {
                baudRate: 115200,
                dataBits: 8,
                stopBits: 1,
                parity: "none"
            });
            SolarChargeController.sockets.push({ path: path, socket: _this.socket });
        }
        _this.debug = debug;
        _this.client = new jsmodbus_1.ModbusRTUClient(_this.socket, address);
        _this.socket.on("open", function () { return _this.emit("ready"); });
        _this.socket.on("error", function (e) { return _this.emit("error", e); });
        return _this;
    }
    SolarChargeController.prototype.close = function () {
        this.socket.close();
    };
    SolarChargeController.prototype.readInputRegisterInt16 = function (start, multiple) {
        if (multiple === void 0) { multiple = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var response, e_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.readInputRegisters(start, 1)];
                    case 1:
                        response = (_a.sent()).response;
                        if (this.debug)
                            console.log(response.body.valuesAsBuffer, response.body.valuesAsArray);
                        return [2 /*return*/, response.body.valuesAsBuffer.readInt16BE() / multiple];
                    case 2:
                        e_16 = _a.sent();
                        throw e_16;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SolarChargeController.prototype.readInputRegisterInt32 = function (start, multiple) {
        if (multiple === void 0) { multiple = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var response, e_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.readInputRegisters(start, 2)];
                    case 1:
                        response = (_a.sent()).response;
                        if (this.debug)
                            console.log(response.body.valuesAsBuffer, response.body.valuesAsArray);
                        return [2 /*return*/, Buffer.from([response.body.valuesAsBuffer.readInt16BE(1), response.body.valuesAsBuffer.readInt16BE(0)]).readInt32BE() / multiple];
                    case 2:
                        e_17 = _a.sent();
                        throw e_17;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SolarChargeController.prototype.readInputRegisterUInt16 = function (start, multiple) {
        if (multiple === void 0) { multiple = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var response, e_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.readInputRegisters(start, 1)];
                    case 1:
                        response = (_a.sent()).response;
                        if (this.debug)
                            console.log(response.body.valuesAsBuffer, response.body.valuesAsArray);
                        return [2 /*return*/, response.body.valuesAsBuffer.readUInt16BE() / multiple];
                    case 2:
                        e_18 = _a.sent();
                        throw e_18;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SolarChargeController.prototype.readInputRegisterUInt32 = function (start, multiple) {
        if (multiple === void 0) { multiple = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var response, e_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.readInputRegisters(start, 2)];
                    case 1:
                        response = (_a.sent()).response;
                        if (this.debug)
                            console.log(response.body.valuesAsBuffer, response.body.valuesAsArray);
                        return [2 /*return*/, Buffer.from([
                                response.body.valuesAsBuffer.readInt8(2),
                                response.body.valuesAsBuffer.readInt8(3),
                                response.body.valuesAsBuffer.readInt8(0),
                                response.body.valuesAsBuffer.readInt8(1),
                            ]).readUInt32BE() / multiple];
                    case 2:
                        e_19 = _a.sent();
                        throw e_19;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SolarChargeController.prototype.readHoldingRegisterInt16 = function (start, multiple) {
        if (multiple === void 0) { multiple = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var response, e_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.readHoldingRegisters(start, 1)];
                    case 1:
                        response = (_a.sent()).response;
                        if (this.debug)
                            console.log(response.body.valuesAsBuffer, response.body.valuesAsArray);
                        return [2 /*return*/, response.body.valuesAsBuffer.readInt16BE() / multiple];
                    case 2:
                        e_20 = _a.sent();
                        throw e_20;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SolarChargeController.prototype.readHoldingRegisterInt32 = function (start, multiple) {
        if (multiple === void 0) { multiple = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var response, e_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.readHoldingRegisters(start, 2)];
                    case 1:
                        response = (_a.sent()).response;
                        if (this.debug)
                            console.log(response.body.valuesAsBuffer, response.body.valuesAsArray);
                        return [2 /*return*/, Buffer.from([response.body.valuesAsBuffer.readInt16BE(1), response.body.valuesAsBuffer.readInt16BE(0)]).readInt32BE() / multiple];
                    case 2:
                        e_21 = _a.sent();
                        throw e_21;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SolarChargeController.prototype.readHoldingRegisterUInt16 = function (start, multiple) {
        if (multiple === void 0) { multiple = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var response, e_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.readHoldingRegisters(start, 1)];
                    case 1:
                        response = (_a.sent()).response;
                        if (this.debug)
                            console.log(response.body.valuesAsBuffer, response.body.valuesAsArray);
                        return [2 /*return*/, response.body.valuesAsBuffer.readUInt16BE() / multiple];
                    case 2:
                        e_22 = _a.sent();
                        throw e_22;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SolarChargeController.prototype.readHoldingRegisterUInt32 = function (start, multiple) {
        if (multiple === void 0) { multiple = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var response, e_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.readHoldingRegisters(start, 2)];
                    case 1:
                        response = (_a.sent()).response;
                        if (this.debug)
                            console.log(response.body.valuesAsBuffer, response.body.valuesAsArray);
                        return [2 /*return*/, Buffer.from([
                                response.body.valuesAsBuffer.readInt8(2),
                                response.body.valuesAsBuffer.readInt8(3),
                                response.body.valuesAsBuffer.readInt8(0),
                                response.body.valuesAsBuffer.readInt8(1),
                            ]).readUInt32BE() / multiple];
                    case 2:
                        e_23 = _a.sent();
                        throw e_23;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SolarChargeController.prototype.writeSingleRegister = function (start, value) {
        return __awaiter(this, void 0, void 0, function () {
            var e_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.writeSingleRegister(start, value)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_24 = _a.sent();
                        throw e_24;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SolarChargeController.prototype.readCoil = function (start) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.readCoils(start, 1)];
                    case 1:
                        response = (_a.sent()).response;
                        if (this.debug)
                            console.log(response.body.valuesAsBuffer, response.body.valuesAsArray);
                        return [2 /*return*/, !!response.body.valuesAsBuffer.readInt8()];
                    case 2:
                        e_25 = _a.sent();
                        throw e_25;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SolarChargeController.prototype.writeCoil = function (start, value) {
        return __awaiter(this, void 0, void 0, function () {
            var e_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.writeSingleCoil(start, value)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_26 = _a.sent();
                        throw e_26;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SolarChargeController.prototype.readDiscreteInput = function (start) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.readDiscreteInputs(start, 1)];
                    case 1:
                        response = (_a.sent()).response;
                        if (this.debug)
                            console.log(response.body.valuesAsBuffer, response.body.valuesAsArray);
                        return [2 /*return*/, !!response.body.valuesAsBuffer.readInt8()];
                    case 2:
                        e_27 = _a.sent();
                        throw e_27;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SolarChargeController.listDevices = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, serialport_1.default.list()];
            });
        });
    };
    SolarChargeController.sockets = [];
    return SolarChargeController;
}(events_1.EventEmitter));
exports.default = SolarChargeController;
//# sourceMappingURL=SolarChargeController.js.map