// Configuración Bluetooth al iniciar
bluetooth.onBluetoothConnected(function () {
    // Muestra "sí" cuando está conectado
    basic.showIcon(IconNames.Yes)
})
bluetooth.onBluetoothDisconnected(function () {
    // Muestra "no" cuando está desconectado
    basic.showIcon(IconNames.No)
})
let TDS = 0
let jsonData = ""
// Habilita el servicio de UART
bluetooth.startUartService()
I2C_LCD1602.LcdInit(39)
I2C_LCD1602.ShowString("DETECTOR", 4, 0)
I2C_LCD1602.ShowString("INTELIGENTE", 2, 15)
basic.pause(5000)
basic.pause(5000)
I2C_LCD1602.clear()
basic.forever(function () {
    TDS = pins.analogReadPin(AnalogReadWritePin.P1)
    basic.pause(200)
    bluetooth.uartWriteString("" + TDS)
    // Envía cada 100ms
    basic.pause(1000)
    basic.pause(200)
    if (TDS != 0) {
        if (TDS >= 1 && TDS <= 120) {
            basic.showIcon(IconNames.Heart)
            basic.pause(200)
            I2C_LCD1602.ShowString("PPM:", 0, 0)
            I2C_LCD1602.ShowNumber(TDS, 6, 0)
            I2C_LCD1602.ShowString("ESTADO: OPTIMO", 0, 15)
            basic.pause(2000)
        } else if (TDS >= 121 && TDS <= 250) {
            basic.showIcon(IconNames.Yes)
            basic.pause(200)
            I2C_LCD1602.ShowString("PPM:", 0, 0)
            I2C_LCD1602.ShowNumber(TDS, 6, 0)
            I2C_LCD1602.ShowString("ESTADO: ACEPTABLE", 0, 15)
            basic.pause(2000)
        } else if (TDS >= 251 && TDS <= 350) {
            basic.showIcon(IconNames.No)
            basic.pause(200)
            I2C_LCD1602.ShowString("PPM:", 0, 0)
            I2C_LCD1602.ShowNumber(TDS, 6, 0)
            I2C_LCD1602.ShowString("ESTADO: MEDIO", 0, 15)
            basic.pause(2000)
        } else if (TDS >= 350) {
            basic.showIcon(IconNames.Sad)
            // strip.showColor(neopixel.colors(NeoPixelColors.Red))
            basic.pause(200)
            I2C_LCD1602.ShowString("PPM:", 0, 0)
            I2C_LCD1602.ShowNumber(TDS, 6, 0)
            I2C_LCD1602.ShowString("ESTADO: NEGATIVO", 0, 15)
            basic.pause(2000)
            for (let index = 0; index < 4; index++) {
                music.playTone(523, music.beat(BeatFraction.Half))
                music.playTone(659, music.beat(BeatFraction.Half))
            }
            basic.pause(100)
            for (let index = 0; index < 4; index++) {
                servos.P2.setAngle(0)
                basic.pause(200)
                servos.P2.setAngle(15)
                basic.pause(200)
            }
        }
        basic.pause(2000)
    }
    I2C_LCD1602.clear()
    basic.pause(200)
})
