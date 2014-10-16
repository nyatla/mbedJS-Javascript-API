/**
 * @fileOverview MMA7660クラスを定義します。
 * Port from https://mbed.org/components/MMA7660/
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

function int6toint32(v)
{
	if((v&0x00000020)==0){
		return (v&0x0000001f);
	}else{
		return 0xffffffe0|v;
	}
}
/**
 * MMA7660を制御するクラスです。
 * <a href="https://mbed.org/users/emilmont/code/MMA8451Q/">mbed::MMA7660</a>と同等の機能を持ちます。
 * @constructor
 * @name mbedJS.MMA7660
 * @param {mbedJS.I2C|mbedJS.MCU} i_parent
 * インスタンスをバインドするオブジェクトです。MCUの場合はI2Cバスを占有します。
 * @param {[addr:int]|[addr:int,sda:PinName,scl:PinName]} i_params
 * mbedJS.I2Cの場合はI2Cアドレスを指定します。mbedJS.MCUの場合はI2C address,sda,sclの順番で指定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数retは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
 * <li>onSetSampleRate() - setSampleRateの完了時に呼び出されます。</li>
 * <li>onGetSide(ret) -getSideの完了時に呼び出されます。</li>
 * <li>onGetOrientation(ret) -getOrientationの完了時に呼び出されます。</li>
 * <li>onReadData(ret) -readDataの完了時に呼び出されます。</li>
 * <li>onReadData_int(ret) -readData_intの完了時に呼び出されます。</li>
 * </ul>
 * <p>
 * {function} コールバック関数を指定した場合、RPCが完了したときにonNew相当のコールバック関数が呼び出されます。
 * メンバ関数のイベントハンドラは個別に設定してください。
 * </p>
 * @return {mbedJS.MMA7660}
 * @example //Callback
 * @example //Generator
 * @example //Callback hell
 */
var CLASS=function MMA7660(i_parent,i_params,i_handler)
{
	try{
		var _t=this;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		MI.assertInt(i_params);		
		//パラメータ退避
		_t._i2c_addr=i_params[0];
		//i2cが準備できたら実行する関数
		function _onNew()
		{
			_t._setActive(true,function(){
				//control command
				_t._i2c.write(_t._i2c_addr,[0x2a,0x01],false,
				function(){
					if(cb){cb();}
					else if(_t._gen){_t._gen.next(_t);}
				});
			});
		}
		//MCUかI2Cか調べる
		if(i_parent.RPC_NS!=NS.I2C.prototype.RPC_NS){
			_t._i2c_attached=true;
			_t._i2c=new NS.I2C(i_parent,[i_params[1],i_params[2]],function(){
				_t._i2c.frequency(100000,function(){
					_onNew();
				});
			});
		}else{
			//I2Cならそのまんま使う
			_t._i2c=i_parent;
			_onNew();
		}
	}catch(e){
		throw new MI.MiMicException(e);
	}	
}
var MMA7660_SENSITIVITY=21.33;
var MMA7660_XOUT_R =0x00;
var MMA7660_YOUT_R =0x01;
var MMA7660_ZOUT_R =0x02;
var MMA7660_TILT_R =0x03;
var MMA7660_INT_R =0x06;
var MMA7660_MODE_R =0x07;
var MMA7660_SR_R =0x08;
CLASS.Unknown	=0;
CLASS.Left		=1;
CLASS.Right		=2;
CLASS.Left		=3;
CLASS.prototype=
{
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	_i2c:null,
	_i2c_addr:0,
	_i2c_attached:false,
	_active:false,
	/**
	 * Generatorモードのときに使用する関数です。
	 * Generatorモードの時は、yieldと併用してnew MMA7660()の完了を待ちます。
	 * @name mbedJS.MMA7660#waitForNew
	 * @function
	 */
	waitForNew:function MMA7660_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * @private
	 */	
	_write:function MMA7660__write(i_addr,i_data,i_cb)
	{
		try{
			var _t=this;			
			_t._i2c.write(_t._i2c_addr,[i_addr,i_data],false,function(){
				i_cb();
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * @private
	 */	
	_read:function MMA7660__read(i_addr,i_length,i_cb)
	{
		try{
			var _t=this;			
			_t._i2c.write(_t._i2c_addr,[i_addr],false,function(){
				_t._i2c.read(_t._i2c_addr, i_length, false,function(ret){
					i_cb(ret.data);
				});
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * @private
	 */	
	_setActive:function MMA7660__setActive(i_state,i_cb)
	{
		try{
			var _t=this;			
			_t._active = i_state;
			_t._read(MMA7660_MODE_R,1,function(r){
				var modereg=r;
				modereg &=~(1<<0);
				modereg &=~(1<<2);
				_t._write(MMA7660_MODE_R,modereg,function(){
					modereg +=i_state?1:0;
					_t._write(MMA7660_MODE_R,modereg,function(){
						setTimeout(i_cb,10);
					});
				});
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * @private
	 */
	_readData_int:function MMA7660__readData_int(i_cb)
	{
		try{
			var _t=this;
			if(!_t._active){
				throw new MI.MiMicException("device not active");
			}
			function f(){
				_t._read(MMA7660_XOUT_R,3,function(r){
					if(((r[0]|r[1]|r[2])&0x040)!=0){
						setTimeout(f,10);
						return;
					}
					//int6->int32
					retval=[int6toint32(r[0]),int6toint32(r[1]),int6toint32(r[2])];
					i_cb(retval);
				});
			}
			f();
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * setSampleRate相当の関数です。
	 * 関数の完了時にonSetSampleRate,又はコールバック関数でイベントを通知します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA7660#setSampleRate
	 * @function
	 * @param {int} i_samplerate
	 */	
	setSampleRate:function MMA7660_setSampleRate(i_samplerate)
	{
		try{
			var _t=this;
			if(_t._active){
				throw new MI.MiMicException("device active");
			}
			var cb=MI._getCb(arguments,_t._event.onSetSampleRate);
			MI._assertYield.call(_t);
			_t._lc=CLASS.setSampleRate;
			var rates=[120 , 64 , 32 , 16 , 8 , 4, 2, 1];
			var sampleLoc = 0;
			var sampleError = 10000;
			var temp;
			for(var i=0 ; i<8 ; i++){
				temp =Math.abs(rates[i] - i_samplerate);
				if(temp<sampleError){
					sampleLoc = i;
					sampleError = temp;
				}
			}
			_t._read(MMA7660_SR_R,1,function(r){
				temp =r[0] & (~0x07);
				temp |= sampleLoc;
				_t._write(MMA7660_SR_R,temp,function(){
					_t._samplerate = rates[sampleLoc];
					if(cb){cb();}
					if(_t._gen){_t._gen.next();}
					 _t._lc=null;
				});
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * setActive相当の関数です。
	 * 関数の完了時にonSetActive,又はコールバック関数でイベントを通知します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA7660#setActive
	 * @function
	 * @param {bool} is_active
	 */
	setActive:function MMA7660_setActive(is_active)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onSetActive);
			MI._assertYield.call(_t);
			_t._lc=CLASS.setActive;
			_t._setActive(is_active,function(){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;			
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	
	/**
	 * getSide相当の関数です。
	 * 関数の完了時にonGetSide,又はコールバック関数でイベントを通知します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA7660#getSide
	 * @function
	 * @return　{int}
	 * mbedJS.MMA7660#Left,Right,Unknownの何れかを返します。
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */
	getSide:function MMA7660_getSide()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onGetSide);
			MI._assertYield.call(_t);
			_t._lc=CLASS.getSide;
			_t._read(MMA7660_TILT_R,1,function(r){
				var tiltreg=r[0]&0x03;
				var ret=CLASS.Unknown;
				switch(tiltreg){
				case 0x01:ret=CLASS.Left;break;
				case 0x02:ret=CLASS.Right;break;
				}
				if(cb){cb(ret);}
				if(_t._gen){_t._gen.next(ret);}
				 _t._lc=null;			
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * getOrientation相当の関数です。
	 * 関数の完了時にonGetOrientation,又はコールバック関数でイベントを通知します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA7660#getOrientation
	 * @function
	 * @return　{int}
	 * mbedJS.MMA7660#Left,Right,Top,Bottom,Unknownの何れかを返します。
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */		
	getOrientation:function MMA7660_getOrientation()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onGetOrientation);
			MI._assertYield.call(_t);
			_t._lc=CLASS.getOrientation;
			_t._read(MMA7660_TILT_R,1,function(r){
				var tiltreg=r[0]&(0x07<<2);
				var ret=CLASS.Unknown;
				switch(tiltreg){
				case 0x01:ret=CLASS.Left;
				case 0x02:ret=CLASS.Right;
				case 0x05:ret=CLASS.Down;
				case 0x06:ret=CLASS.Up;
				}
				if(cb){cb(ret);}
				if(_t._gen){_t._gen.next(ret);}
				 _t._lc=null;			
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * readData_int相当の関数です。
	 * 関数の完了時にonReadData_int,又はコールバック関数でイベントを通知します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA7660#onReadData_int
	 * @function
	 * @return　{int[]}
	 * センサの出力値を要素数3の配列で返します。
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */		
	readData_int:function MMA7660_readData_int()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onReadData_int);
			MI._assertYield.call(_t);
			_t._lc=CLASS.readData_int;
			_t._readData_int(function(r){
				if(cb){cb(r);}
				if(_t._gen){_t._gen.next(r);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}		
	},
	/**
	 * readData相当の関数です。
	 * 関数の完了時にonReadData,又はコールバック関数でイベントを通知します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA7660#readData
	 * @function
	 * @return　{float[]}
	 * センサの出力値を要素数3の配列で返します。
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	readData:function MMA7660_readData()
	{			
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onReadData);
			MI._assertYield.call(_t);
			_t._lc=CLASS.readData;
			_t._readData_int(function(r){
				var ret=[int6toint32(r[0])/MMA7660_SENSITIVITY,int6toint32(r[1])/MMA7660_SENSITIVITY,int6toint32(r[2])/MMA7660_SENSITIVITY];
				if(cb){cb(ret);}
				if(_t._gen){_t._gen.next(ret);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}		
	},	
	/**
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.MMA7660#dispose
	 * @function
	 */
	dispose:function MMA7660_dispose()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onDispose);
			MI._assertYield.call(_t);
			//自己生成したI2Cの場合のみ削除
			if(_t._i2c_attached){
				_t._i2c.dispose(function(v){
					if(cb){cb(v);}
					else if(_t._gen){_t._gen.next(v);}
				});
			}
		}catch(e){
			throw new MI.MiMicException(e);
		}
	}
}
NS.MMA7660=CLASS;
}());
