/**
 * @fileOverview mbedSDKの定数を定義します。
 */

/**
 * mbedJSネームスペース
 * @namespace
 */
var mbedJS={};
(function(){
var NS=mbedJS;
/**
 * mbedSDKのピン識別子です。ライブラリのピン名と一致します。次のピン名を使用できます。
 * <ul>
 * <li> LPC Pin Names(P0_0 - P4_31)
 * <li> mbed DIP Pin Names(p5-p40)
 * <li> Other mbed Pin Names(LED1-LED4,USBRX,USBTX)
 * <li> Arch Pro Pin Names(D0-D15,A0-A5,I2C_SCL,I2C_SDA)
 * <li> NC
 * <li> FRDM Pin(PT(A-E)[00-31],LED_[RED|GREEN|BLUE])
 * </ul>
 * @name mbedJS.PinName
 */
NS.PinName=function(){
	var B;
	var D={};
	// LPC Pin Names P0_0からP5_31
	B=0x00010000;
	for(var i=0;i<=5;i++){
		for(var i2=0;i2<=31;i2++){
			D['P'+i+'_'+i2]=B+i*32+i2;
		}
	}
	// mbed DIP Pin Names p5 - p40
	B=0x00020000;
	for(var i=5;i<=40;i++){
		D['p'+i]=B+i;
	}
	// Other mbed Pin Names
	B=0x00030000|0x0000;
	D.LED1 = B+0;
	D.LED2 = B+1;
	D.LED3 = B+2;
	D.LED4 = B+3;
	B=0x00030000|0x0100;
	D.USBTX = B+0;
	D.USBRX = B+1;
	
	// Arch Pro Pin Names
	//
	B=0x00040000;
	//D0-D15
	for(var i=0;i<=15;i++){
		D['D'+i]=B+i;
	}
	//A0-A5
	for(var i=0;i<=5;i++){
		D['A'+i]=B+i+0x0100;
	}
	D.I2C_SCL = B+0x0200+0;
	D.I2C_SDA = B+0x0200+1;
	
	// Not connected
	D.NC=0x7FFFFFFF;
	
	//FRDM
	B=0x00050000;
	var FRDM_PFX='ABCDE';
	for(var i=0;i<5;i++){
		for(var i2=0;i2<=31;i2++){
			D['PT'+FRDM_PFX[i]+i2]=B+i*32+i2;
		}
	}
	B=0x00060000;
	D.LED_RED	=B+0;
	D.LED_GREEN	=B+1;
	D.LED_BLUE	=B+2;
    //Push buttons
	B=0x00060000|0x0100;
	D.SW2=B+2;
	D.SW3=B+3;

	// メンバの追加
	return D;
}();
/**
 * ピンモード値です。
 * mbedSDKのピンモード値と同一です。<br/>
 * (PullUp|PullDown|PullNone|OpenDrain|PullDefault)
 * @name mbedJS.PinMode
 */
NS.PinMode={
	PullUp:		0x00010000,
	PullDown:	0x00010001,
	PullNone:	0x00010002,
	OpenDrain:	0x00010003,
	PullDefault:0x00010004
};
/**
 * ポート識別子です。
 * mbedSDKのポート名と同一です。<br/>
 * (Port0 - Port5)
 * @name mbedJS.PortName
 */
NS.PortName={
	Port0:	0x00010000,
	Port1:	0x00010001,
	Port2:	0x00010002,
	Port3:	0x00010003,
	Port4:	0x00010004,
	Port4:	0x00010005
};


}());