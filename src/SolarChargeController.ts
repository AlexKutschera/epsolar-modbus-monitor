import {EventEmitter} from "events";
import SerialPort from "serialport";
import {ModbusRTUClient} from "jsmodbus";

export enum BatteryType {
    Sealed = 0x0001,
    GEL = 0x0002,
    Flooded = 0x0003,
    UserDefined = 0x0000
}

export enum LoadControllingMode {
    ManualControl = 0x0000,
    LightOnOff = 0x0001,
    LightOnTimer = 0x0002,
    TimeControl = 0x0003
}

export enum BatteryVoltageMode {
    Auto,
    _12V,
    _24V
}

export default class SolarChargeController extends EventEmitter {

    private readonly socket;
    private client;
    private debug;

    constructor(path: string, address: number = 0x01, debug: boolean = false) {
        super()
        this.socket = new SerialPort(path, {
            baudRate: 115200,
            dataBits: 8,
            stopBits: 1,
            parity: "none"
        })
        this.debug = debug;
        this.client = new ModbusRTUClient(this.socket, address)
        this.socket.on("open", () => this.emit("ready"))
        this.socket.on("error", (e) => this.emit("error", e))
    }

    close() {
        this.socket.close()
    }

    private async readInputRegisterInt16(start: number, multiple: number = 1) {
        try {
            const {response} = await this.client.readInputRegisters(start, 1)
            if (this.debug) console.log(response.body.valuesAsBuffer, response.body.valuesAsArray)
            return response.body.valuesAsBuffer.readInt16BE() / multiple
        } catch (e) {
            throw e
        }
    }

    private async readInputRegisterInt32(start: number, multiple: number = 1) {
        try {
            const {response} = await this.client.readInputRegisters(start, 2)
            if (this.debug) console.log(response.body.valuesAsBuffer, response.body.valuesAsArray)
            return Buffer.from([response.body.valuesAsBuffer.readInt16BE(1), response.body.valuesAsBuffer.readInt16BE(0)]).readInt32BE() / multiple
        } catch (e) {
            throw e
        }
    }

    private async readInputRegisterUInt16(start: number, multiple: number = 1) {
        try {
            const {response} = await this.client.readInputRegisters(start, 1)
            if (this.debug) console.log(response.body.valuesAsBuffer, response.body.valuesAsArray)
            return response.body.valuesAsBuffer.readUInt16BE() / multiple
        } catch (e) {
            throw e
        }
    }

    private async readInputRegisterUInt32(start: number, multiple: number = 1) {
        try {
            const {response} = await this.client.readInputRegisters(start, 2)
            if (this.debug) console.log(response.body.valuesAsBuffer, response.body.valuesAsArray)
            return Buffer.from([
                response.body.valuesAsBuffer.readInt8(2),
                response.body.valuesAsBuffer.readInt8(3),
                response.body.valuesAsBuffer.readInt8(0),
                response.body.valuesAsBuffer.readInt8(1),
            ]).readUInt32BE() / multiple
        } catch (e) {
            throw e
        }
    }

    private async readHoldingRegisterInt16(start: number, multiple: number = 1) {
        try {
            const {response} = await this.client.readHoldingRegisters(start, 1)
            if (this.debug) console.log(response.body.valuesAsBuffer, response.body.valuesAsArray)
            return response.body.valuesAsBuffer.readInt16BE() / multiple
        } catch (e) {
            throw e
        }
    }

    private async readHoldingRegisterInt32(start: number, multiple: number = 1) {
        try {
            const {response} = await this.client.readHoldingRegisters(start, 2)
            if (this.debug) console.log(response.body.valuesAsBuffer, response.body.valuesAsArray)
            return Buffer.from([response.body.valuesAsBuffer.readInt16BE(1), response.body.valuesAsBuffer.readInt16BE(0)]).readInt32BE() / multiple
        } catch (e) {
            throw e
        }
    }

    private async readHoldingRegisterUInt16(start: number, multiple: number = 1) {
        try {
            const {response} = await this.client.readHoldingRegisters(start, 1)
            if (this.debug) console.log(response.body.valuesAsBuffer, response.body.valuesAsArray)
            return response.body.valuesAsBuffer.readUInt16BE() / multiple
        } catch (e) {
            throw e
        }
    }

    private async readHoldingRegisterUInt32(start: number, multiple: number = 1) {
        try {
            const {response} = await this.client.readHoldingRegisters(start, 2)
            if (this.debug) console.log(response.body.valuesAsBuffer, response.body.valuesAsArray)
            return Buffer.from([
                response.body.valuesAsBuffer.readInt8(2),
                response.body.valuesAsBuffer.readInt8(3),
                response.body.valuesAsBuffer.readInt8(0),
                response.body.valuesAsBuffer.readInt8(1),
            ]).readUInt32BE() / multiple
        } catch (e) {
            throw e
        }
    }

    private async writeSingleRegister(start: number, value: number) {
        try {
            await this.client.writeSingleRegister(start, value)
        } catch (e) {
            throw e
        }
    }

    private async readCoil(start: number) {
        try {
            const {response} = await this.client.readCoils(start, 1)
            if (this.debug) console.log(response.body.valuesAsBuffer, response.body.valuesAsArray)
            return !!response.body.valuesAsBuffer.readInt8()
        } catch (e) {
            throw e
        }
    }

    private async writeCoil(start: number, value: boolean) {
        try {
            await this.client.writeSingleCoil(start, value)
        } catch (e) {
            throw e
        }
    }

    private async readDiscreteInput(start: number) {
        try {
            const {response} = await this.client.readDiscreteInputs(start, 1)
            if (this.debug) console.log(response.body.valuesAsBuffer, response.body.valuesAsArray)
            return !!response.body.valuesAsBuffer.readInt8()
        } catch (e) {
            throw e
        }
    }

    ratedData = {
        /**
         * PV array rated voltage (V)
         */
        ratedInputVoltage: () => this.readInputRegisterUInt16(0x3000, 100),
        /**
         * PV array rated current (A)
         */
        ratedInputCurrent: () => this.readInputRegisterUInt16(0x3001, 100),
        /**
         * PV array rated power (W)
         */
        ratedInputPower: () => this.readInputRegisterUInt32(0x3002, 100),
        /**
         * Battery's voltage (V)
         */
        ratedOutputVoltage: () => this.readInputRegisterUInt16(0x3004, 100),
        /**
         * Rated charging current to battery (A)
         */
        ratedOutputCurrent: () => this.readInputRegisterUInt16(0x3005, 100),
        /**
         * Rated charging power to battery (W)
         */
        ratedOutputPower: () => this.readInputRegisterUInt32(0x3006, 100),
        chargingMode: async () => {
            try {
                return await this.readInputRegisterUInt16(0x3008) == 0x0001 ? "PWM" : "unknown"
            } catch (e) {
                throw e
            }
        },
        /**
         * (A)
         */
        ratedLoadOutputCurrent: () => this.readInputRegisterUInt16(0x300E, 100)
    }

    realTimeData = {
        /**
         * Solar charge controller--PV array voltage (V)
         */
        inputVoltage: () => this.readInputRegisterUInt16(0x3100, 100),
        /**
         * Solar charge controller--PV array current (A)
         */
        inputCurrent: () => this.readInputRegisterUInt16(0x3101, 100),
        /**
         * Solar charge controller--PV array power (W)
         */
        inputPower: () => this.readInputRegisterUInt32(0x3102, 100),
        /**
         * Battery voltage (V)
         */
        outputVoltage: () => this.readInputRegisterUInt16(0x3104, 100),
        /**
         * Battery charging current (A)
         */
        outputCurrent: () => this.readInputRegisterUInt16(0x3105, 100),
        /**
         * Battery charging power (W)
         */
        outputPower: () => this.readInputRegisterUInt32(0x3106, 100),
        /**
         * Load voltage (V)
         */
        loadVoltage: () => this.readInputRegisterUInt16(0x310C, 100),
        /**
         * Load current (A)
         */
        loadCurrent: () => this.readInputRegisterUInt16(0x310D, 100),
        /**
         * Load power (W)
         */
        loadPower: () => this.readInputRegisterUInt32(0x310E, 100),
        /**
         * Battery Temperature (°C)
         */
        batteryTemperature: () => this.readInputRegisterInt16(0x3110, 100),
        /**
         * Temperature inside case (°C)
         */
        caseTemperature: () => this.readInputRegisterInt16(0x3111, 100),
        /**
         * Heat sink surface temperature of equipments' power components (°C)
         */
        powerComponentsTemperature: () => this.readInputRegisterInt16(0x3112, 100),
        /**
         * The percentage of battery's remaining capacity (%)
         */
        batterySOC: () => this.readInputRegisterUInt16(0x311A, 100),
        /**
         * The battery tempeture measured by remote temperature sensor (°C)
         */
        remoteBatteryTemperature: () => this.readInputRegisterInt16(0x311B, 100),
        /**
         * Current system rated voltage (V)
         */
        batteryRealRatedPower: () => this.readInputRegisterUInt16(0x311D, 100)
    }

    realTimeStatus = {
        /**
         * D3-D0: 01H Overvolt , 00H Normal , 02H Under Volt, 03H Low Volt Disconnect, 04H Fault.
         * D7-D4: 00H Normal, 01H Over Temp.(Higher than the warning settings), 02H Low Temp.(Lower than the warning settings).
         * D8: Battery inerternal resistance abnormal 1, normal 0.
         * D15: 1-Wrong identification for rated voltage.
         */
        batteryStatus: async () => {
            try {
                return (await this.readInputRegisterUInt16(0x3200) >> 0).toString(2)
            } catch (e) {
                throw e
            }
        },
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
        chargingEquipmentStatus: async () => {
            try {
                return (await this.readInputRegisterUInt16(0x3201) >> 0).toString(2)
            } catch (e) {
                throw e
            }
        }
    }

    statisticalParameter = {
        /**
         * Maximum input volt (PV) today (V). 00: 00 Refresh every day.
         */
        maximumInputToday: () => this.readInputRegisterUInt16(0x3300, 100),
        /**
         * Minimum input volt (PV) today (V). 00: 00 Refresh every day.
         */
        minimumInputToday: () => this.readInputRegisterUInt16(0x3301, 100),
        /**
         * Maximum battery volt today (V). 00: 00 Refresh every day.
         */
        maximumBatteryVoltToday: () => this.readInputRegisterUInt16(0x3302, 100),
        /**
         * Minimum battery volt today (V). 00: 00 Refresh every day.
         */
        minimumBatteryVoltToday: () => this.readInputRegisterUInt16(0x3303, 100),
        /**
         * Consumed energy today (KWH). 00: 00 Refresh every day.
         */
        consumptionToday: () => this.readInputRegisterUInt32(0x3304, 100),
        /**
         * Consumed energy this month (KWH). 00: 00 Clear on the first day of month.
         */
        consumptionThisMonth: () => this.readInputRegisterUInt32(0x3306, 100),
        /**
         * Consumed energy this year (KWH). 00: 00 Clear on 1, Jan.
         */
        consumptionThisYear: () => this.readInputRegisterUInt32(0x3308, 100),
        /**
         * Total consumed energy (KWH)
         */
        consumptionTotal: () => this.readInputRegisterUInt32(0x330A, 100),
        /**
         * Generated energy today (KWH). 00: 00 Clear every day.
         */
        generationToday: () => this.readInputRegisterUInt32(0x330C, 100),
        /**
         * Generated energy this month (KWH). 00: 00 Clear on the first day of month.
         */
        generationThisMonth: () => this.readInputRegisterUInt32(0x330E, 100),
        /**
         * Generated energy this year (KWH). 00: 00 Clear on 1, Jan.
         */
        generationThisYear: () => this.readInputRegisterUInt32(0x3310, 100),
        /**
         * Total generated energy (KWH)
         */
        generationTotal: () => this.readInputRegisterUInt32(0x3312, 100),
        /**
         * Saving 1 Kilowatt =Reduction 0.997KG "Carbon dioxide" =Reduction 0.272KG "Carton" (Ton)
         */
        carbonDioxideReduction: () => this.readInputRegisterUInt32(0x3314, 100),
        /**
         * The net battery current,charging current minus the discharging one. The positive value represents charging and negative, discharging. (A)
         */
        batteryCurrent: () => this.readInputRegisterInt32(0x331B, 100),
        /**
         * Battery Temp. (°C)
         */
        batteryTemperature: () => this.readInputRegisterInt16(0x331D, 100),
        /**
         * Ambient Temp. (°C)
         */
        ambientTemperature: () => this.readInputRegisterInt16(0x331E, 100)
    }

    settingParameter = {
        batteryType: async () => {
            try {
                const {response} = await this.client.readHoldingRegisters(0x9000, 1)
                if (this.debug) console.log(response.body.valuesAsBuffer)
                return BatteryType[await this.readHoldingRegisterInt16(0x9000)]
            } catch (e) {
                throw e
            }
        },
        setBatteryType: (type: BatteryType) => this.writeSingleRegister(0x9000, type),
        /**
         * Rated capacity of the battery (AH)
         */
        batteryCapacity: () => this.readHoldingRegisterInt16(0x9001),
        /**
         * Rated capacity of the battery (AH)
         */
        setBatteryCapacity: (capacity: number) => this.writeSingleRegister(0x9001, capacity),
        /**
         * Temperature compensation coefficient Range 0-9 (mV/°C/2V)
         */
        temperatureCompensationCoefficient: () => this.readHoldingRegisterInt16(0x9002, 100),
        /**
         * Temperature compensation coefficient Range 0-9 (mV/°C/2V)
         */
        setTemperatureCompensationCoefficient: (temperatureCompensationCoefficient: number) => this.writeSingleRegister(0x9002, temperatureCompensationCoefficient * 100),
        /**
         * High Volt. disconnect (V)
         */
        highVoltageDisconnect: () => this.readHoldingRegisterInt16(0x9003, 100),
        /**
         * High Volt. disconnect (V)
         */
        setHighVoltageDisconnect: (highVoltageDisconnect: number) => this.writeSingleRegister(0x9003, highVoltageDisconnect * 100),
        /**
         * Charging limit voltage (V)
         */
        chargingLimitVoltage: () => this.readHoldingRegisterInt16(0x9004, 100),
        /**
         * Charging limit voltage (V)
         */
        setChargingLimitVoltage: (chargingLimitVoltage: number) => this.writeSingleRegister(0x9004, chargingLimitVoltage * 100),
        /**
         * Over voltage reconnect (V)
         */
        overVoltageReconnect: () => this.readHoldingRegisterInt16(0x9005, 100),
        /**
         * Over voltage reconnect (V)
         */
        setOverVoltageReconnect: (overVoltageReconnect: number) => this.writeSingleRegister(0x9005, overVoltageReconnect * 100),
        /**
         * Equalization voltage (V)
         */
        equalizationVoltage: () => this.readHoldingRegisterInt16(0x9006, 100),
        /**
         * Equalization voltage (V)
         */
        setEqualizationVoltage: (equalizationVoltage: number) => this.writeSingleRegister(0x9006, equalizationVoltage * 100),
        /**
         * Boost voltage (V)
         */
        boostVoltage: () => this.readHoldingRegisterInt16(0x9007, 100),
        /**
         * Boost voltage (V)
         */
        setBoostVoltage: (boostVoltage: number) => this.writeSingleRegister(0x9007, boostVoltage * 100),
        /**
         * Float voltage (V)
         */
        floatVoltage: () => this.readHoldingRegisterInt16(0x9008, 100),
        /**
         * Float voltage (V)
         */
        setFloatVoltage: (floatVoltage: number) => this.writeSingleRegister(0x9008, floatVoltage * 100),
        /**
         * Boost reconnect voltage (V)
         */
        boostReconnectVoltage: () => this.readHoldingRegisterInt16(0x9009, 100),
        /**
         * Boost reconnect voltage (V)
         */
        setBoostReconnectVoltage: (boostReconnectVoltage: number) => this.writeSingleRegister(0x9009, boostReconnectVoltage * 100),
        /**
         * Low voltage reconnect (V)
         */
        lowVoltageReconnect: () => this.readHoldingRegisterInt16(0x900A, 100),
        /**
         * Low voltage reconnect (V)
         */
        setLowVoltageReconnect: (lowVoltageReconnect: number) => this.writeSingleRegister(0x900A, lowVoltageReconnect * 100),
        /**
         * Under voltage recover (V)
         */
        underVoltageReconnect: () => this.readHoldingRegisterInt16(0x900B, 100),
        /**
         * Under voltage recover (V)
         */
        setUnderVoltageReconnect: (underVoltageReconnect: number) => this.writeSingleRegister(0x900B, underVoltageReconnect * 100),
        /**
         * Under voltage warning (V)
         */
        underVoltageWarning: () => this.readHoldingRegisterInt16(0x900C, 100),
        /**
         * Under voltage warning (V)
         */
        setUnderVoltageWarning: (underVoltageWarning: number) => this.writeSingleRegister(0x900C, underVoltageWarning * 100),
        /**
         * Low voltage disconnect (V)
         */
        lowVoltageDisconnect: () => this.readHoldingRegisterInt16(0x900D, 100),
        /**
         * Low voltage disconnect (V)
         */
        setLowVoltageDisconnect: (lowVoltageDisconnect: number) => this.writeSingleRegister(0x900D, lowVoltageDisconnect * 100),
        /**
         * Discharging limit voltage (V)
         */
        dischargingLimitVoltage: () => this.readHoldingRegisterInt16(0x900E, 100),
        /**
         * Discharging limit voltage (V)
         */
        setDischargingLimitVoltage: (dischargingLimitVoltage: number) => this.writeSingleRegister(0x900E, dischargingLimitVoltage * 100),
        /**
         * Real time clock
         */
        rtc: async () => {
            try {
                const {response} = await this.client.readHoldingRegisters(0x9013, 3)
                if (this.debug) console.log(response.body.valuesAsBuffer)
                let date = new Date()
                date.setSeconds(response.body.valuesAsBuffer.readInt8(1))
                date.setMinutes(response.body.valuesAsBuffer.readInt8(0))
                date.setHours(response.body.valuesAsBuffer.readInt8(3))
                date.setDate(response.body.valuesAsBuffer.readInt8(2))
                date.setMonth(response.body.valuesAsBuffer.readInt8(5) - 1)
                date.setFullYear(Number("20" + response.body.valuesAsBuffer.readInt8(4)))
                return date
            } catch (e) {
                throw e
            }
        },
        /**
         * Real time clock
         */
        setRTC: async (date: Date = new Date()) => {
            try {
                let buffer = Buffer.alloc(6)
                buffer.writeInt8(date.getSeconds(), 1)
                buffer.writeInt8(date.getMinutes(), 0)
                buffer.writeInt8(date.getHours(), 3)
                buffer.writeInt8(date.getDate(), 2)
                buffer.writeInt8(date.getMonth() + 1, 5)
                buffer.writeInt8(parseInt(date.getFullYear().toString().substr(2)), 4)
                await this.client.writeMultipleRegisters(0x9013, buffer)
            } catch (e) {
                throw e
            }
        },
        /**
         * Interval days of auto equalization charging in cycle (Day)
         */
        equalizationChargingCycle: () => this.readHoldingRegisterInt16(0x9016),
        /**
         * Interval days of auto equalization charging in cycle (Day)
         */
        setEqualizationChargingCycle: (equalizationChargingCycle: number) => this.writeSingleRegister(0x9016, equalizationChargingCycle),
        /**
         * Battery temperature warning upper limit (°C)
         */
        batteryTemperatureUpperLimit: () => this.readHoldingRegisterInt16(0x9017, 100),
        /**
         * Battery temperature warning upper limit (°C)
         */
        setBatteryTemperatureUpperLimit: (batteryTemperatureUpperLimit: number) => this.writeSingleRegister(0x9017, batteryTemperatureUpperLimit * 100),
        /**
         * Battery temperature warning lower limit (°C)
         */
        batteryTemperatureLowerLimit: () => this.readHoldingRegisterInt16(0x9018, 100),
        /**
         * Battery temperature warning lower limit (°C)
         */
        setBatteryTemperatureLowerLimit: (batteryTemperatureLowerLimit: number) => this.writeSingleRegister(0x9018, batteryTemperatureLowerLimit * 100),
        /**
         * Controller inner temperature upper limit (°C)
         */
        controllerTemperatureUpperLimit: () => this.readHoldingRegisterInt16(0x9019, 100),
        /**
         * Controller inner temperature upper limit (°C)
         */
        setControllerTemperatureUpperLimit: (controllerTemperatureUpperLimit) => this.writeSingleRegister(0x9019, controllerTemperatureUpperLimit * 100),
        /**
         * After Over Temperature, system recover once it drop to lower than this value (°C)
         */
        controllerTemperatureUpperRecoveryLimit: () => this.readHoldingRegisterInt16(0x901A, 100),
        /**
         * After Over Temperature, system recover once it drop to lower than this value (°C)
         */
        setControllerTemperatureUpperRecoveryLimit: (controllerTemperatureUpperRecoveryLimit) => this.writeSingleRegister(0x901A, controllerTemperatureUpperRecoveryLimit * 100),
        /**
         * Warning when surface temperature of power components higher than this value, and charging and discharging stop (°C)
         */
        powerComponentTemperatureUpperLimit: () => this.readHoldingRegisterInt16(0x901B, 100),
        /**
         * Warning when surface temperature of power components higher than this value, and charging and discharging stop (°C)
         */
        setPowerComponentTemperatureUpperLimit: (powerComponentTemperatureUpperLimit) => this.writeSingleRegister(0x901B, powerComponentTemperatureUpperLimit * 100),
        /**
         * Recover once power components temperature lower than this value (°C)
         */
        powerComponentTemperatureUpperRecoveryLimit: () => this.readHoldingRegisterInt16(0x901C, 100),
        /**
         * Recover once power components temperature lower than this value (°C)
         */
        setPowerComponentTemperatureUpperRecoveryLimit: (powerComponentTemperatureUpperRecoveryLimit) => this.writeSingleRegister(0x901C, powerComponentTemperatureUpperRecoveryLimit * 100),
        /**
         * The resistance of the connected wires (milliohm)
         */
        lineImpedance: () => this.readHoldingRegisterInt16(0x901D, 100),
        /**
         * The resistance of the connected wires (milliohm)
         */
        setLineImpedance: (lineImpedance: number) => this.writeSingleRegister(0x901D, lineImpedance * 100),
        /**
         * Night TimeThreshold Volt. PV lower lower than this value, controller would detect it as sundown (V)
         */
        nttv: () => this.readHoldingRegisterInt16(0x901E, 100),
        /**
         * Night TimeThreshold Volt. PV lower lower than this value, controller would detect it as sundown (V)
         */
        setNttv: (nttv: number) => this.writeSingleRegister(0x901E, nttv * 100),
        /**
         * Light signal startup (night) delay time. PV voltage lower than NTTV, and duration exceeds the Light signal startup (night) delay time, controller would detect it as night time. (Min)
         */
        nttvDelay: () => this.readHoldingRegisterInt16(0x901F),
        /**
         * Light signal startup (night) delay time. PV voltage lower than NTTV, and duration exceeds the Light signal startup (night) delay time, controller would detect it as night time. (Min)
         */
        setNttvDelay: (nttvDelay: number) => this.writeSingleRegister(0x901F, nttvDelay),
        /**
         * Day Time Threshold Volt. PV voltage higher than this value, controller would detect it as sunrise (V)
         */
        dttv: () => this.readHoldingRegisterInt16(0x9020, 100),
        /**
         * Day Time Threshold Volt. PV voltage higher than this value, controller would detect it as sunrise (V)
         */
        setDttv: (dttv: number) => this.writeSingleRegister(0x9020, dttv * 100),
        /**
         * Light signal turn off(day) delay time. PV voltage higher than DTTV, and duration exceeds Light signal turn off(day) delay time delay time, controller would detect it as daytime. (Min)
         */
        dttvDelay: () => this.readHoldingRegisterInt16(0x9021),
        /**
         * Light signal turn off(day) delay time. PV voltage higher than DTTV, and duration exceeds Light signal turn off(day) delay time delay time, controller would detect it as daytime. (Min)
         */
        setDttvDelay: (dttvDelay: number) => this.writeSingleRegister(0x9021, dttvDelay),
        /**
         * Load controlling mode
         */
        loadControllingMode: async () => {
            try {
                return LoadControllingMode[await this.readHoldingRegisterInt16(0x903D)]
            } catch (e) {
                throw e
            }
        },
        /**
         * Load controlling mode
         */
        setLoadControllingMode: (loadControllingMode: LoadControllingMode) => this.writeSingleRegister(0x903D, loadControllingMode),
        /**
         * The length of load output timer1
         */
        workingTime1: async () => {
            try {
                const {response} = await this.client.readHoldingRegisters(0x903E, 3)
                return {
                    minutes: response.body.valuesAsBuffer.readInt8(0),
                    hours: response.body.valuesAsBuffer.readInt8(1)
                }
            } catch (e) {
                throw e
            }
        },
        /**
         * The length of load output timer1
         */
        setWorkingTime1: (minutes: number, hours: number) => this.writeSingleRegister(0x903E, Buffer.from([minutes, hours]).readInt16BE()),
        /**
         * The length of load output timer2
         */
        workingTime2: async () => {
            try {
                const {response} = await this.client.readHoldingRegisters(0x903F, 3)
                return {
                    minutes: response.body.valuesAsBuffer.readInt8(0),
                    hours: response.body.valuesAsBuffer.readInt8(1)
                }
            } catch (e) {
                throw e
            }
        },
        /**
         * The length of load output timer2
         */
        setWorkingTime2: (minutes: number, hours: number) => this.writeSingleRegister(0x903F, Buffer.from([minutes, hours]).readInt16BE()),
        /**
         * Turn on timing 1
         */
        turnOnTiming1: async (seconds, minutes, hours) => {
            try {
                await this.writeSingleRegister(0x9042, seconds)
                await this.writeSingleRegister(0x9043, minutes)
                await this.writeSingleRegister(0x9044, hours)
            } catch (e) {
                throw e
            }
        },
        /**
         * Turn off timing 1
         */
        turnOffTiming1: async (seconds, minutes, hours) => {
            try {
                await this.writeSingleRegister(0x9045, seconds)
                await this.writeSingleRegister(0x9046, minutes)
                await this.writeSingleRegister(0x9047, hours)
            } catch (e) {
                throw e
            }
        },
        /**
         * Turn on timing 2
         */
        turnOnTiming2: async (seconds, minutes, hours) => {
            try {
                await this.writeSingleRegister(0x9048, seconds)
                await this.writeSingleRegister(0x9049, minutes)
                await this.writeSingleRegister(0x904A, hours)
            } catch (e) {
                throw e
            }
        },
        /**
         * Turn off timing 2
         */
        turnOffTiming2: async (seconds, minutes, hours) => {
            try {
                await this.writeSingleRegister(0x904B, seconds)
                await this.writeSingleRegister(0x904C, minutes)
                await this.writeSingleRegister(0x904D, hours)
            } catch (e) {
                throw e
            }
        },
        /**
         * Length of night
         */
        lengthOfNight: async () => {
            try {
                const {response} = await this.client.readHoldingRegisters(0x9065, 3)
                return {
                    minutes: response.body.valuesAsBuffer.readInt8(0),
                    hours: response.body.valuesAsBuffer.readInt8(1)
                }
            } catch (e) {
                throw e
            }
        },
        /**
         * Length of night
         */
        setLengthOfNight: (minutes: number, hours: number) => this.writeSingleRegister(0x9065, Buffer.from([minutes, hours]).readInt16BE()),
        /**
         * Battery rated voltage Mode
         */
        batteryVoltageMode: async () => {
            try {
                return BatteryVoltageMode[await this.readHoldingRegisterInt16(0x9067)]
            } catch (e) {
                throw e
            }
        },
        /**
         * Battery rated voltage Mode
         */
        setBatteryVoltageMode: (batteryVoltageMode: BatteryVoltageMode) => this.writeSingleRegister(0x9067, batteryVoltageMode),
        /**
         * Selected timing period of the load.0, using one timer, 1-using two timer, likewise.
         */
        loadTimingControl: () => this.readHoldingRegisterInt16(0x9069),
        /**
         * Selected timing period of the load.0, using one timer, 1-using two timer, likewise.
         */
        setLoadTimingControl: (loadTimingControl: number) => this.writeSingleRegister(0x9069, loadTimingControl),
        // TODO Default Load On/Off in manual mode
        /**
         * Equalize duration, Usually 60-120 minutes (minute)
         */
        equalizeDuration: () => this.readHoldingRegisterInt16(0x906B),
        /**
         * Equalize duration, Usually 60-120 minutes (minute)
         */
        setEqualizeDuration: (equalizeDuration: number) => this.writeSingleRegister(0x906B, equalizeDuration),
        /**
         * Equalize duration, Usually 60-120 minutes (minute)
         */
        boostDuration: () => this.readHoldingRegisterInt16(0x906C),
        /**
         * Equalize duration, Usually 60-120 minutes (minute)
         */
        setBoostDuration: (boostDuration: number) => this.writeSingleRegister(0x906C, boostDuration),
        /**
         * Discharging percentage, Usually 20%-80%. The percentage of battery's remaining capacity when stop charging (%)
         */
        dischargingPercentage: () => this.readHoldingRegisterInt16(0x906D, 100),
        /**
         * Discharging percentage, Usually 20%-80%. The percentage of battery's remaining capacity when stop charging (%)
         */
        setDischargingPercentage: (dischargingPercentage: number) => this.writeSingleRegister(0x906D, dischargingPercentage * 100),
        /**
         * Depth of charge, 20%-100%. (%)
         */
        chargingPercentage: () => this.readHoldingRegisterInt16(0x906E, 100),
        /**
         * Depth of charge, 20%-100%. (%)
         */
        setChargingPercentage: (chargingPercentage: number) => this.writeSingleRegister(0x906D, chargingPercentage * 100),
        // TODO Management modes of battery charging and discharging
    }

    coils = {
        /**
         * When the load is manual mode，1-manual on 0 -manual off
         */
        manualLoad: () => this.readCoil(0x2),
        /**
         * When the load is manual mode，1-manual on 0 -manual off
         */
        setManualLoad: (manualLoad: boolean) => this.client.writeSingleCoil(0x2, manualLoad),
        /**
         * Enable load test mode. 1 Enable 0 Disable(normal)
         */
        loadTestMode: () => this.readCoil(0x5),
        /**
         * Enable load test mode. 1 Enable 0 Disable(normal)
         */
        setLoadTestMode: (loadTestMode: boolean) => this.writeCoil(0x5, loadTestMode),
        /**
         * Force the load on/off. 1 Turn on, 0 Turn off (used for temporary test of the load）
         */
        forceLoad: () => this.readCoil(0x6),
        /**
         * Force the load on/off. 1 Turn on, 0 Turn off (used for temporary test of the load）
         */
        setForceLoad: (forceLoad: boolean) => this.writeCoil(0x6, forceLoad)
    }

    discreteInput = {
        /**
         * Over temperature inside the device. 1 The temperature inside the controller is higher than the over-temperature protection point. 0 Normal
         */
        overTemperature: () => this.readDiscreteInput(0x2000),
        /**
         * Day/Night. 1-Night, 0-Day
         */
        night: () => this.readDiscreteInput(0x200C)
    }

    static async listDevices(): Promise<SerialPort.PortInfo[]> {
        return SerialPort.list()
    }

}