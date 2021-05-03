/// <reference types="node" />
import { EventEmitter } from "events";
import SerialPort from "serialport";
export declare enum BatteryType {
    Sealed = 1,
    GEL = 2,
    Flooded = 3,
    UserDefined = 0
}
export declare enum LoadControllingMode {
    ManualControl = 0,
    LightOnOff = 1,
    LightOnTimer = 2,
    TimeControl = 3
}
export declare enum BatteryVoltageMode {
    Auto = 0,
    _12V = 1,
    _24V = 2
}
export default class SolarChargeController extends EventEmitter {
    private readonly socket;
    private client;
    private debug;
    constructor(path: string, address?: number, debug?: boolean);
    close(): void;
    private readInputRegisterInt16;
    private readInputRegisterInt32;
    private readInputRegisterUInt16;
    private readInputRegisterUInt32;
    private readHoldingRegisterInt16;
    private readHoldingRegisterInt32;
    private readHoldingRegisterUInt16;
    private readHoldingRegisterUInt32;
    private writeSingleRegister;
    private readCoil;
    private writeCoil;
    private readDiscreteInput;
    ratedData: {
        /**
         * PV array rated voltage (V)
         */
        ratedInputVoltage: () => Promise<number>;
        /**
         * PV array rated current (A)
         */
        ratedInputCurrent: () => Promise<number>;
        /**
         * PV array rated power (W)
         */
        ratedInputPower: () => Promise<number>;
        /**
         * Battery's voltage (V)
         */
        ratedOutputVoltage: () => Promise<number>;
        /**
         * Rated charging current to battery (A)
         */
        ratedOutputCurrent: () => Promise<number>;
        /**
         * Rated charging power to battery (W)
         */
        ratedOutputPower: () => Promise<number>;
        chargingMode: () => Promise<"unknown" | "PWM">;
        /**
         * (A)
         */
        ratedLoadOutputCurrent: () => Promise<number>;
    };
    realTimeData: {
        /**
         * Solar charge controller--PV array voltage (V)
         */
        inputVoltage: () => Promise<number>;
        /**
         * Solar charge controller--PV array current (A)
         */
        inputCurrent: () => Promise<number>;
        /**
         * Solar charge controller--PV array power (W)
         */
        inputPower: () => Promise<number>;
        /**
         * Battery voltage (V)
         */
        outputVoltage: () => Promise<number>;
        /**
         * Battery charging current (A)
         */
        outputCurrent: () => Promise<number>;
        /**
         * Battery charging power (W)
         */
        outputPower: () => Promise<number>;
        /**
         * Load voltage (V)
         */
        loadVoltage: () => Promise<number>;
        /**
         * Load current (A)
         */
        loadCurrent: () => Promise<number>;
        /**
         * Load power (W)
         */
        loadPower: () => Promise<number>;
        /**
         * Battery Temperature (°C)
         */
        batteryTemperature: () => Promise<number>;
        /**
         * Temperature inside case (°C)
         */
        caseTemperature: () => Promise<number>;
        /**
         * Heat sink surface temperature of equipments' power components (°C)
         */
        powerComponentsTemperature: () => Promise<number>;
        /**
         * The percentage of battery's remaining capacity (%)
         */
        batterySOC: () => Promise<number>;
        /**
         * The battery tempeture measured by remote temperature sensor (°C)
         */
        remoteBatteryTemperature: () => Promise<number>;
        /**
         * Current system rated voltage (V)
         */
        batteryRealRatedPower: () => Promise<number>;
    };
    realTimeStatus: {
        /**
         * D3-D0: 01H Overvolt , 00H Normal , 02H Under Volt, 03H Low Volt Disconnect, 04H Fault.
         * D7-D4: 00H Normal, 01H Over Temp.(Higher than the warning settings), 02H Low Temp.(Lower than the warning settings).
         * D8: Battery inerternal resistance abnormal 1, normal 0.
         * D15: 1-Wrong identification for rated voltage.
         */
        batteryStatus: () => Promise<string>;
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
        chargingEquipmentStatus: () => Promise<string>;
    };
    statisticalParameter: {
        /**
         * Maximum input volt (PV) today (V). 00: 00 Refresh every day.
         */
        maximumInputToday: () => Promise<number>;
        /**
         * Minimum input volt (PV) today (V). 00: 00 Refresh every day.
         */
        minimumInputToday: () => Promise<number>;
        /**
         * Maximum battery volt today (V). 00: 00 Refresh every day.
         */
        maximumBatteryVoltToday: () => Promise<number>;
        /**
         * Minimum battery volt today (V). 00: 00 Refresh every day.
         */
        minimumBatteryVoltToday: () => Promise<number>;
        /**
         * Consumed energy today (KWH). 00: 00 Refresh every day.
         */
        consumptionToday: () => Promise<number>;
        /**
         * Consumed energy this month (KWH). 00: 00 Clear on the first day of month.
         */
        consumptionThisMonth: () => Promise<number>;
        /**
         * Consumed energy this year (KWH). 00: 00 Clear on 1, Jan.
         */
        consumptionThisYear: () => Promise<number>;
        /**
         * Total consumed energy (KWH)
         */
        consumptionTotal: () => Promise<number>;
        /**
         * Generated energy today (KWH). 00: 00 Clear every day.
         */
        generationToday: () => Promise<number>;
        /**
         * Generated energy this month (KWH). 00: 00 Clear on the first day of month.
         */
        generationThisMonth: () => Promise<number>;
        /**
         * Generated energy this year (KWH). 00: 00 Clear on 1, Jan.
         */
        generationThisYear: () => Promise<number>;
        /**
         * Total generated energy (KWH)
         */
        generationTotal: () => Promise<number>;
        /**
         * Saving 1 Kilowatt =Reduction 0.997KG "Carbon dioxide" =Reduction 0.272KG "Carton" (Ton)
         */
        carbonDioxideReduction: () => Promise<number>;
        /**
         * The net battery current,charging current minus the discharging one. The positive value represents charging and negative, discharging. (A)
         */
        batteryCurrent: () => Promise<number>;
        /**
         * Battery Temp. (°C)
         */
        batteryTemperature: () => Promise<number>;
        /**
         * Ambient Temp. (°C)
         */
        ambientTemperature: () => Promise<number>;
    };
    settingParameter: {
        batteryType: () => Promise<string>;
        setBatteryType: (type: BatteryType) => Promise<void>;
        /**
         * Rated capacity of the battery (AH)
         */
        batteryCapacity: () => Promise<number>;
        /**
         * Rated capacity of the battery (AH)
         */
        setBatteryCapacity: (capacity: number) => Promise<void>;
        /**
         * Temperature compensation coefficient Range 0-9 (mV/°C/2V)
         */
        temperatureCompensationCoefficient: () => Promise<number>;
        /**
         * Temperature compensation coefficient Range 0-9 (mV/°C/2V)
         */
        setTemperatureCompensationCoefficient: (temperatureCompensationCoefficient: number) => Promise<void>;
        /**
         * High Volt. disconnect (V)
         */
        highVoltageDisconnect: () => Promise<number>;
        /**
         * High Volt. disconnect (V)
         */
        setHighVoltageDisconnect: (highVoltageDisconnect: number) => Promise<void>;
        /**
         * Charging limit voltage (V)
         */
        chargingLimitVoltage: () => Promise<number>;
        /**
         * Charging limit voltage (V)
         */
        setChargingLimitVoltage: (chargingLimitVoltage: number) => Promise<void>;
        /**
         * Over voltage reconnect (V)
         */
        overVoltageReconnect: () => Promise<number>;
        /**
         * Over voltage reconnect (V)
         */
        setOverVoltageReconnect: (overVoltageReconnect: number) => Promise<void>;
        /**
         * Equalization voltage (V)
         */
        equalizationVoltage: () => Promise<number>;
        /**
         * Equalization voltage (V)
         */
        setEqualizationVoltage: (equalizationVoltage: number) => Promise<void>;
        /**
         * Boost voltage (V)
         */
        boostVoltage: () => Promise<number>;
        /**
         * Boost voltage (V)
         */
        setBoostVoltage: (boostVoltage: number) => Promise<void>;
        /**
         * Float voltage (V)
         */
        floatVoltage: () => Promise<number>;
        /**
         * Float voltage (V)
         */
        setFloatVoltage: (floatVoltage: number) => Promise<void>;
        /**
         * Boost reconnect voltage (V)
         */
        boostReconnectVoltage: () => Promise<number>;
        /**
         * Boost reconnect voltage (V)
         */
        setBoostReconnectVoltage: (boostReconnectVoltage: number) => Promise<void>;
        /**
         * Low voltage reconnect (V)
         */
        lowVoltageReconnect: () => Promise<number>;
        /**
         * Low voltage reconnect (V)
         */
        setLowVoltageReconnect: (lowVoltageReconnect: number) => Promise<void>;
        /**
         * Under voltage recover (V)
         */
        underVoltageReconnect: () => Promise<number>;
        /**
         * Under voltage recover (V)
         */
        setUnderVoltageReconnect: (underVoltageReconnect: number) => Promise<void>;
        /**
         * Under voltage warning (V)
         */
        underVoltageWarning: () => Promise<number>;
        /**
         * Under voltage warning (V)
         */
        setUnderVoltageWarning: (underVoltageWarning: number) => Promise<void>;
        /**
         * Low voltage disconnect (V)
         */
        lowVoltageDisconnect: () => Promise<number>;
        /**
         * Low voltage disconnect (V)
         */
        setLowVoltageDisconnect: (lowVoltageDisconnect: number) => Promise<void>;
        /**
         * Discharging limit voltage (V)
         */
        dischargingLimitVoltage: () => Promise<number>;
        /**
         * Discharging limit voltage (V)
         */
        setDischargingLimitVoltage: (dischargingLimitVoltage: number) => Promise<void>;
        /**
         * Real time clock
         */
        rtc: () => Promise<Date>;
        /**
         * Real time clock
         */
        setRTC: (date?: Date) => Promise<void>;
        /**
         * Interval days of auto equalization charging in cycle (Day)
         */
        equalizationChargingCycle: () => Promise<number>;
        /**
         * Interval days of auto equalization charging in cycle (Day)
         */
        setEqualizationChargingCycle: (equalizationChargingCycle: number) => Promise<void>;
        /**
         * Battery temperature warning upper limit (°C)
         */
        batteryTemperatureUpperLimit: () => Promise<number>;
        /**
         * Battery temperature warning upper limit (°C)
         */
        setBatteryTemperatureUpperLimit: (batteryTemperatureUpperLimit: number) => Promise<void>;
        /**
         * Battery temperature warning lower limit (°C)
         */
        batteryTemperatureLowerLimit: () => Promise<number>;
        /**
         * Battery temperature warning lower limit (°C)
         */
        setBatteryTemperatureLowerLimit: (batteryTemperatureLowerLimit: number) => Promise<void>;
        /**
         * Controller inner temperature upper limit (°C)
         */
        controllerTemperatureUpperLimit: () => Promise<number>;
        /**
         * Controller inner temperature upper limit (°C)
         */
        setControllerTemperatureUpperLimit: (controllerTemperatureUpperLimit: any) => Promise<void>;
        /**
         * After Over Temperature, system recover once it drop to lower than this value (°C)
         */
        controllerTemperatureUpperRecoveryLimit: () => Promise<number>;
        /**
         * After Over Temperature, system recover once it drop to lower than this value (°C)
         */
        setControllerTemperatureUpperRecoveryLimit: (controllerTemperatureUpperRecoveryLimit: any) => Promise<void>;
        /**
         * Warning when surface temperature of power components higher than this value, and charging and discharging stop (°C)
         */
        powerComponentTemperatureUpperLimit: () => Promise<number>;
        /**
         * Warning when surface temperature of power components higher than this value, and charging and discharging stop (°C)
         */
        setPowerComponentTemperatureUpperLimit: (powerComponentTemperatureUpperLimit: any) => Promise<void>;
        /**
         * Recover once power components temperature lower than this value (°C)
         */
        powerComponentTemperatureUpperRecoveryLimit: () => Promise<number>;
        /**
         * Recover once power components temperature lower than this value (°C)
         */
        setPowerComponentTemperatureUpperRecoveryLimit: (powerComponentTemperatureUpperRecoveryLimit: any) => Promise<void>;
        /**
         * The resistance of the connected wires (milliohm)
         */
        lineImpedance: () => Promise<number>;
        /**
         * The resistance of the connected wires (milliohm)
         */
        setLineImpedance: (lineImpedance: number) => Promise<void>;
        /**
         * Night TimeThreshold Volt. PV lower lower than this value, controller would detect it as sundown (V)
         */
        nttv: () => Promise<number>;
        /**
         * Night TimeThreshold Volt. PV lower lower than this value, controller would detect it as sundown (V)
         */
        setNttv: (nttv: number) => Promise<void>;
        /**
         * Light signal startup (night) delay time. PV voltage lower than NTTV, and duration exceeds the Light signal startup (night) delay time, controller would detect it as night time. (Min)
         */
        nttvDelay: () => Promise<number>;
        /**
         * Light signal startup (night) delay time. PV voltage lower than NTTV, and duration exceeds the Light signal startup (night) delay time, controller would detect it as night time. (Min)
         */
        setNttvDelay: (nttvDelay: number) => Promise<void>;
        /**
         * Day Time Threshold Volt. PV voltage higher than this value, controller would detect it as sunrise (V)
         */
        dttv: () => Promise<number>;
        /**
         * Day Time Threshold Volt. PV voltage higher than this value, controller would detect it as sunrise (V)
         */
        setDttv: (dttv: number) => Promise<void>;
        /**
         * Light signal turn off(day) delay time. PV voltage higher than DTTV, and duration exceeds Light signal turn off(day) delay time delay time, controller would detect it as daytime. (Min)
         */
        dttvDelay: () => Promise<number>;
        /**
         * Light signal turn off(day) delay time. PV voltage higher than DTTV, and duration exceeds Light signal turn off(day) delay time delay time, controller would detect it as daytime. (Min)
         */
        setDttvDelay: (dttvDelay: number) => Promise<void>;
        /**
         * Load controlling mode
         */
        loadControllingMode: () => Promise<string>;
        /**
         * Load controlling mode
         */
        setLoadControllingMode: (loadControllingMode: LoadControllingMode) => Promise<void>;
        /**
         * The length of load output timer1
         */
        workingTime1: () => Promise<{
            minutes: any;
            hours: any;
        }>;
        /**
         * The length of load output timer1
         */
        setWorkingTime1: (minutes: number, hours: number) => Promise<void>;
        /**
         * The length of load output timer2
         */
        workingTime2: () => Promise<{
            minutes: any;
            hours: any;
        }>;
        /**
         * The length of load output timer2
         */
        setWorkingTime2: (minutes: number, hours: number) => Promise<void>;
        /**
         * Turn on timing 1
         */
        turnOnTiming1: (seconds: any, minutes: any, hours: any) => Promise<void>;
        /**
         * Turn off timing 1
         */
        turnOffTiming1: (seconds: any, minutes: any, hours: any) => Promise<void>;
        /**
         * Turn on timing 2
         */
        turnOnTiming2: (seconds: any, minutes: any, hours: any) => Promise<void>;
        /**
         * Turn off timing 2
         */
        turnOffTiming2: (seconds: any, minutes: any, hours: any) => Promise<void>;
        /**
         * Length of night
         */
        lengthOfNight: () => Promise<{
            minutes: any;
            hours: any;
        }>;
        /**
         * Length of night
         */
        setLengthOfNight: (minutes: number, hours: number) => Promise<void>;
        /**
         * Battery rated voltage Mode
         */
        batteryVoltageMode: () => Promise<string>;
        /**
         * Battery rated voltage Mode
         */
        setBatteryVoltageMode: (batteryVoltageMode: BatteryVoltageMode) => Promise<void>;
        /**
         * Selected timing period of the load.0, using one timer, 1-using two timer, likewise.
         */
        loadTimingControl: () => Promise<number>;
        /**
         * Selected timing period of the load.0, using one timer, 1-using two timer, likewise.
         */
        setLoadTimingControl: (loadTimingControl: number) => Promise<void>;
        /**
         * Equalize duration, Usually 60-120 minutes (minute)
         */
        equalizeDuration: () => Promise<number>;
        /**
         * Equalize duration, Usually 60-120 minutes (minute)
         */
        setEqualizeDuration: (equalizeDuration: number) => Promise<void>;
        /**
         * Equalize duration, Usually 60-120 minutes (minute)
         */
        boostDuration: () => Promise<number>;
        /**
         * Equalize duration, Usually 60-120 minutes (minute)
         */
        setBoostDuration: (boostDuration: number) => Promise<void>;
        /**
         * Discharging percentage, Usually 20%-80%. The percentage of battery's remaining capacity when stop charging (%)
         */
        dischargingPercentage: () => Promise<number>;
        /**
         * Discharging percentage, Usually 20%-80%. The percentage of battery's remaining capacity when stop charging (%)
         */
        setDischargingPercentage: (dischargingPercentage: number) => Promise<void>;
        /**
         * Depth of charge, 20%-100%. (%)
         */
        chargingPercentage: () => Promise<number>;
        /**
         * Depth of charge, 20%-100%. (%)
         */
        setChargingPercentage: (chargingPercentage: number) => Promise<void>;
    };
    coils: {
        /**
         * When the load is manual mode，1-manual on 0 -manual off
         */
        manualLoad: () => Promise<boolean>;
        /**
         * When the load is manual mode，1-manual on 0 -manual off
         */
        setManualLoad: (manualLoad: boolean) => any;
        /**
         * Enable load test mode. 1 Enable 0 Disable(normal)
         */
        loadTestMode: () => Promise<boolean>;
        /**
         * Enable load test mode. 1 Enable 0 Disable(normal)
         */
        setLoadTestMode: (loadTestMode: boolean) => Promise<void>;
        /**
         * Force the load on/off. 1 Turn on, 0 Turn off (used for temporary test of the load）
         */
        forceLoad: () => Promise<boolean>;
        /**
         * Force the load on/off. 1 Turn on, 0 Turn off (used for temporary test of the load）
         */
        setForceLoad: (forceLoad: boolean) => Promise<void>;
    };
    discreteInput: {
        /**
         * Over temperature inside the device. 1 The temperature inside the controller is higher than the over-temperature protection point. 0 Normal
         */
        overTemperature: () => Promise<boolean>;
        /**
         * Day/Night. 1-Night, 0-Day
         */
        night: () => Promise<boolean>;
    };
    static listDevices(): Promise<SerialPort.PortInfo[]>;
}
