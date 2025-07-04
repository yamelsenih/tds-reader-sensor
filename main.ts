// Pausa inicial para que el mensaje de bienvenida sea visible
// basic.pause(5000)
// Configuración Bluetooth al iniciar
bluetooth.onBluetoothConnected(function () {
    // Muestra "sí" cuando está conectado
    basic.showIcon(IconNames.Yes)
})
// bluetoothEnabled = false
// bluetooth.onBluetoothDisconnected(function () {
// // Muestra "no" cuando está desconectado
// basic.showIcon(IconNames.No)
// })
// El valor de jsonData no se usa en el código original, lo mantengo pero si no lo necesitas, puedes borrarlo.
let jsonData = ""
let TDS = 11
// Inicialización del LCD (solo una vez al inicio)
I2C_LCD1602.LcdInit(39)
I2C_LCD1602.ShowString("DETECTOR", 4, 0)
I2C_LCD1602.ShowString("INTELIGENTE", 2, 2)
I2C_LCD1602.clear()
// Habilita el servicio de UART
bluetooth.startUartService()
basic.forever(function () {
    // bluetooth.uartWriteString("" + TDS)
    I2C_LCD1602.clear()
    // 1. Lectura del sensor TDS
    TDS = pins.analogReadPin(AnalogReadWritePin.P1)
    // Pequeña pausa para estabilizar la lectura analógica
    basic.pause(200)
    // 2. Envío de datos por Bluetooth (solo una vez por ciclo, después de la lectura)
    // Esto es crucial para no saturar el búfer UART.
    bluetooth.uartWriteString("" + TDS)
    // 3. Evaluación de datos y actualización del LCD/periféricos
    // Solo procesa si la lectura no es cero (asumiendo que 0 es un valor inválido)
    if (TDS >= 1 && TDS <= 120) {
        basic.showIcon(IconNames.Heart)
        I2C_LCD1602.ShowString("PPM:", 0, 0)
        I2C_LCD1602.ShowNumber(TDS, 6, 0)
        I2C_LCD1602.ShowString("ESTADO:OPTIMO", 0, 1)
    } else if (TDS >= 121 && TDS <= 250) {
        basic.showIcon(IconNames.Yes)
        I2C_LCD1602.ShowString("PPM:", 0, 0)
        I2C_LCD1602.ShowNumber(TDS, 6, 0)
        I2C_LCD1602.ShowString("ESTADO:ACEPTABLE", 0, 1)
    } else if (TDS >= 251 && TDS <= 350) {
        basic.showIcon(IconNames.No)
        I2C_LCD1602.ShowString("PPM:", 0, 0)
        I2C_LCD1602.ShowNumber(TDS, 6, 0)
        I2C_LCD1602.ShowString("ESTADO:MEDIO", 0, 1)
    } else if (TDS >= 351) {
        // Ajuste el límite a 351 para evitar solapamiento con el anterior
        basic.showIcon(IconNames.Sad)
        I2C_LCD1602.ShowString("PPM:", 0, 0)
        I2C_LCD1602.ShowNumber(TDS, 6, 0)
        I2C_LCD1602.ShowString("ESTADO:NEGATIVO", 0, 1)
        // Sonido de alerta
        for (let index = 0; index < 4; index++) {
            music.playTone(523, music.beat(BeatFraction.Half))
            music.playTone(659, music.beat(BeatFraction.Half))
        }
        // Pequeña pausa entre acciones de sonido y servo
        basic.pause(100)
        // Movimiento del servo
        for (let index = 0; index < 4; index++) {
            servos.P2.setAngle(0)
            basic.pause(200)
            servos.P2.setAngle(15)
            basic.pause(200)
        }
    }
    bluetooth.uartWriteString("" + TDS)
    // Pausa principal antes de la siguiente lectura para dar tiempo al sistema
    basic.pause(4000)
    bluetooth.uartWriteString("" + TDS)
    // 4. Limpieza del LCD y pausa para el siguiente ciclo
    I2C_LCD1602.clear()
    I2C_LCD1602.ShowString("LEYENDO", 0, 0)
    basic.pause(100)
    I2C_LCD1602.ShowString(".", 8, 0)
    basic.pause(100)
    I2C_LCD1602.ShowString(".", 9, 0)
    basic.pause(100)
    I2C_LCD1602.ShowString(".", 10, 0)
    basic.pause(100)
    I2C_LCD1602.ShowString(".", 11, 0)
    basic.pause(100)
    I2C_LCD1602.ShowString(".", 12, 0)
    basic.pause(100)
    I2C_LCD1602.ShowString(".", 13, 0)
    basic.pause(100)
    I2C_LCD1602.ShowString(".", 14, 0)
    basic.pause(100)
    I2C_LCD1602.ShowString(".", 15, 0)
    I2C_LCD1602.clear()
    basic.pause(100)
})
