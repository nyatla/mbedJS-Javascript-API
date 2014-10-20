set DIR_RELEASE=release
set DIR_MBED=core
set DIR_DRIVER=driver
set PATH_YUI=D:\application.files\yuicompressor-2.4.6\build\yuicompressor-2.4.8.jar

REM ----------------------------------------
REM make a mbedJS.js
REM ----------------------------------------

copy /b ^
 "%DIR_MBED%\MiMicCore.js" ^
+"%DIR_MBED%\mbed.types.js" ^
+"%DIR_MBED%\mbed.AnalogIn.js" ^
+"%DIR_MBED%\mbed.AnalogOut.js" ^
+"%DIR_MBED%\mbed.BusIn.js" ^
+"%DIR_MBED%\mbed.BusInOut.js" ^
+"%DIR_MBED%\mbed.BusOut.js" ^
+"%DIR_MBED%\mbed.DigitalIn.js" ^
+"%DIR_MBED%\mbed.DigitalOut.js" ^
+"%DIR_MBED%\mbed.Mcu.js" ^
+"%DIR_MBED%\mbed.PortIn.js" ^
+"%DIR_MBED%\mbed.PortOut.js" ^
+"%DIR_MBED%\mbed.PwmOut.js" ^
+"%DIR_MBED%\mbed.SPI.js" ^
+"%DIR_MBED%\mbed.SPISlave.js" ^
+"%DIR_MBED%\mbed.Memory.js" ^
+"%DIR_MBED%\mbed.I2C.js" ^
+"%DIR_MBED%\mbed.I2CSlave.js" ^
+"%DIR_MBED%\mbed.Serial.js" ^

 "%DIR_RELEASE%\mbedJS.all.js"


REM make a x.All-mini.js
java -jar %PATH_YUI% -o %DIR_RELEASE%\mbedJS.all-min.js %DIR_RELEASE%\mbedJS.all.js

REM ----------------------------------------
REM make a mbedJS.js
REM ----------------------------------------

copy /b ^
 "%DIR_DRIVER%\mbedApplicationBoard\mbedAppBoard.types.js" ^
+"%DIR_DRIVER%\LM75B.js" ^
+"%DIR_DRIVER%\MMA7660.js" ^
+"%DIR_DRIVER%\mbedApplicationBoard\mbedAppBoard.Joystick.js" ^
+"%DIR_DRIVER%\mbedApplicationBoard\mbedAppBoard.LM75B.js" ^
+"%DIR_DRIVER%\mbedApplicationBoard\mbedAppBoard.MMA7660.js" ^
+"%DIR_DRIVER%\mbedApplicationBoard\mbedAppBoard.PotentioMeter.js" ^
+"%DIR_DRIVER%\mbedApplicationBoard\mbedAppBoard.RgbLed.js" ^
+"%DIR_DRIVER%\mbedApplicationBoard\mbedAppBoard.Speaker.js" ^

 "%DIR_RELEASE%\mbedAppBoard.all.js"
 
