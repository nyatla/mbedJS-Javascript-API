/**
 * @fileOverview mbedAppBoardの定数を定義します。
 */
(function(){
	/**
	 * mbed Application Boardネームスペース
	 * @namespace
	 */
	mbedAppBoard={};
	/**
	 * @private
	 * p28,p27で構成される共通I2cバスを取得します。
	 */
	mbedAppBoard._getI2C=function mbedAppBoard__getI2C(i_parent,i_cb)
	{
		if(!i_parent.__mbedappboard_i2c){
			i_parent.__mbedappboard_i2c_ref=1;
			i_parent.__mbedappboard_i2c=new mbedJS.I2C(i_parent,[mbedJS.PinName.p28,mbedJS.PinName.p27],function(){
				i_parent.__mbedappboard_i2c.frequency(100000,function(){
					i_cb(i_parent.__mbedappboard_i2c);
				});
			});
		}else{
			i_parent.__mbedappboard_i2c_ref++;
			setTimeout(function(){i_cb(i_parent.__mbedappboard_i2c)},0);
		}
	}
	/**
	 * @private
	 * p28,p27で構成される共通I2cバスを解放します。
	 */
	mbedAppBoard._releaseI2C=function mbedAppBoard__releaseI2C(i_parent,i_cb)
	{
		i_parent.__mbedappboard_i2c_ref--;
		if(i_parent.__mbedappboard_i2c_ref<1){
			alert("delete");
			i_parent.__mbedappboard_i2c.dispose(i_cb);
		}else{
			setTimeout(function(){i_cb();},0);
		}
	}	
}());/**
 * @fileOverview LM75Bクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * LM75Bを制御するクラスです。
 * <a href="https://github.com/hara41/test_LM75B/tree/master/test_LM75B">test_LM75B</a>と同等の機能を持ちます。
 * @constructor
 * @name mbedJS.LM75B
 * @param {mbedJS.I2C|mbedJS.MCU} i_parent
 * インスタンスをバインドするオブジェクトです。MCUの場合はI2Cバスを占有します。
 * @param {[addr:int]|[addr:int,sda:PinName,scl:PinName]} i_params
 * i_parentがmbedJS.I2Cの場合はI2Cアドレスを指定します。mbedJS.MCUの場合はI2C address,sda,sclの順番で指定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数returnは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
 * <li>onRead(return) - readの完了時に呼び出されます。</li>
 * </ul>
 * </p>
 * <p>
 * {function} 関数の完了を受け取るコールバック関数です。onNew相当のコールバック関数が呼び出されます。
 * </p>
 * <p>
 * {Generator} yieldコールを行う場合にGeneratorを指定します。
 * </p>
 * @return {mbedJS.LM75B}
 * 生成したインスタンスを返します。
 * @example //Callback
 * @example //Generator
 * @example //Callback hell
 */
var CLASS=function LM75B(i_parent,i_params,i_handler)
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
			//control command
			_t._i2c.write(_t._i2c_addr,[0x01,0x00],false,
			function(){
				if(cb){cb();}
				else if(_t._gen){_t._gen.next(_t);}
			});
		}
		//MCUかI2Cか調べる
		if(i_parent.RPC_NS!=NS.I2C.prototype.RPC_NS){
			_t._i2c_attached=true;
			_t._i2c=new NS.I2C(i_parent,[i_params[1],i_params[2]],function(){
				_t._i2c.frequency(10000,function(){
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
CLASS.prototype=
{
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	/** @private*/
	_i2c:null,
	/** @private*/
	_i2c_addr:0,
	/** @private*/
	_i2c_attached:false,
	/**
	 * コンストラクタでi_handlerにGeneratorを指定した場合のみ使用できます。
	 * yieldと併用してコンストラクタの完了を待ちます。
	 * @name mbedJS.LM75B#waitForNew
	 * @function
	 */
	waitForNew:function LM75B_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * センサから摂氏温度値を取得します。
	 * 関数の完了時にonRead,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedJS.LM75B#read
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 * @return {float}
	 * センサから取得した値です。
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	read:function LM75B_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;			
			_t._i2c.write(_t._i2c_addr,[0x00],true,function(){
				_t._i2c.read(_t._i2c_addr,2,false,function(v){
					var ret = ((v.data[0]<<8)|v.data[1])/256.0;
					if(cb){cb(ret);}
					else if(_t._gen){_t._gen.next(ret);}
					 _t._lc=null;
				});
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * インスタンスの確保しているオブジェクトを破棄します。
	 * 関数の完了時にonDispose,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedJS.LM75B#dispose
	 * @function
	 * @param {function()} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時は、コンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */	
	dispose:function LM75B_dispose()
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
NS.LM75B=CLASS;
}());
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
 * <a href="https://mbed.org/components/MMA7660/">mbed::MMA7660</a>と同等の機能を持ちます。
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

/**
 * 関数の返す定数値です。
 * @name mbedJS.MMA7660#Up
 * @field
 */
CLASS.Up	=0;
/**
 * 関数の返す定数値です。
 * @name mbedJS.MMA7660#Down
 * @field
 */
CLASS.Down		=1;
/**
 * 関数の返す定数値です。
 * @name mbedJS.MMA7660#Right
 * @field
 */
CLASS.Right		=2;
/**
 * 関数の返す定数値です。
 * @name mbedJS.MMA7660#Left
 * @field
 */
CLASS.Left		=3;
/**
 * 関数の返す定数値です。
 * @name mbedJS.MMA7660#Back
 * @field
 */
CLASS.Back		=4;
/**
 * 関数の返す定数値です。
 * @name mbedJS.MMA7660#Front
 * @field
 */
CLASS.Front		=5;
/**
 * 関数の返す定数値です。
 * @name mbedJS.MMA7660#Unknown
 * @field
 */
CLASS.Unknown	=6;

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
	 * コンストラクタでi_handlerにGeneratorを指定した場合のみ使用できます。
	 * yieldと併用してコンストラクタの完了を待ちます。
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
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA7660#setSampleRate
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 * @param {int} i_samplerate
	 * サンプルレート(hz)を指定します。120,64,32,16,8,4,2,1の何れかの値が有効です。
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
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA7660#setActive
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 * @param {bool} is_active
	 * センサの状態を設定します。
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
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA7660#getSide
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 * @return　{int}
	 * mbedJS.MMA7660#Front,Back,Unknownの何れかを返します。
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
				case 0x01:ret=CLASS.Front;break;
				case 0x02:ret=CLASS.Back;break;
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
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA7660#getOrientation
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
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
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA7660#onReadData_int
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
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
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA7660#readData
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
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
	 * インスタンスの確保しているオブジェクトを破棄します。
	 * 関数の完了時にonDispose,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA7660#dispose
	 * @function
	 * @param {function()} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時は、コンストラクタに指定した共通イベントハンドラが呼び出されます。
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
/**
 * @fileOverview mbedApplicationBoardのJoystickドライバです。
 */
(function(){
var MI=MiMicJS;

/**
 * mbedApplicationBoardのJoystickを制御するクラスです。
 * @constructor
 * @name mbedAppBoard.Joystick
 * @param {mbedJS.MCU} i_mcu
 * インスタンスをバインドするオブジェクトです。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数returnは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
 * <li>onGetState(return) - getStateの完了時に呼び出されます。</li>
 * </ul>
 * </p>
 * <p>
 * {function} 関数の完了を受け取るコールバック関数です。onNew相当のコールバック関数が呼び出されます。
 * </p>
 * <p>
 * {Generator} yieldコールを行う場合にGeneratorを指定します。
 * </p>
 * @return {mbedAppBoard.Joystick}
 * 生成したインスタンスを返します。
 * @example //Callback
 * @example //Generator
 * @example //Callback hell
 */
var CLASS=function Joystick(i_mcu,i_handler)
{
	try{
		var _t=this;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		_t._busin=new mbedJS.BusIn(
			i_mcu,
			[mbedJS.PinName.p12,mbedJS.PinName.p13,mbedJS.PinName.p14,mbedJS.PinName.p15,mbedJS.PinName.p16],
			function(){
				if(cb){cb();}
				else if(_t._gen){_t._gen.next(_t);}
				 _t._lc=null;
		});
		return;
	}catch(e){
		throw new MI.MiMicException(e);
	}	
}
/**
 * getState関数が返すビットマスク定数値です。
 * @name mbedAppBoard.Joystick#Down
 * @field
 */
CLASS.Down=1;
/**
 * getState関数が返すビットマスク定数値です。
 * @name mbedAppBoard.Joystick#Left
 * @field
 */
CLASS.Left=2;
/**
 * getState関数が返すビットマスク定数値です。
 * @name mbedAppBoard.Joystick#Center
 * @field
 */
CLASS.Center=4;
/**
 * getState関数が返すビットマスク定数値です。
 * @name mbedAppBoard.Joystick#Up
 * @field
 */
CLASS.Up=8;
/**
 * getState関数が返すビットマスク定数値です。
 * @name mbedAppBoard.Joystick#Right
 * @field
 */
CLASS.Right=16;

CLASS.prototype=
{
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	/** @private*/
	_busin:null,
	/**
	 * コンストラクタでi_handlerにGeneratorを指定した場合のみ使用できます。
	 * yieldと併用してコンストラクタの完了を待ちます。
	 * @name mbedAppBoard.Joystick#waitForNew
	 * @function
	 */
	waitForNew:function Joystick_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * Joystickの状態をビットパターンで返します。
	 * 関数の完了時にonGetSide,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.Joystick#getState
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 * @return　{int}
	 * ジョイスティックの状態をビットパターンで返します。
	 * bit0=Down/bit1=Left/bit2=Up/bit3=Center/bit4=Right
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	getState:function Joystick_getState()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onGetState);
			MI._assertYield.call(_t);
			_t._lc=CLASS.getState;
			_t._busin.read(
				function(j){
					if(cb){cb(j);}
					if(_t._gen){_t._gen.next(j);}
					 _t._lc=null;
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * インスタンスの確保しているオブジェクトを破棄します。
	 * 関数の完了時にonDispose,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.Joystick#dispose
	 * @function
	 * @param {function()} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時は、コンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */	
	dispose:function()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onDispose);
			MI._assertYield.call(_t);
			_t._lc=CLASS.dispose;
			_t._busin.dispose(
				function(){
					if(cb){cb();}
					if(_t._gen){_t._gen.next();}
					 _t._lc=null;
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}
	}
}
mbedAppBoard.Joystick=CLASS;
}());
/**
 * @fileOverview mbedApplicationBoardの温度センサLM75Bドライバです。
 */
(function(){
var MI=MiMicJS;




/**
 * MbedApplicationBoardのLM75Bを制御するクラスです。
 * @constructor
 * @name mbedAppBoard.LM75B
 * @param {mbedJS.MCU} i_mcu
 * インスタンスをバインドするオブジェクトです。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数returnは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
 * <li>onRead(return) -readの完了時に呼び出されます。</li>
 * </ul>
 * </p>
 * <p>
 * {function} 関数の完了を受け取るコールバック関数です。onNew相当のコールバック関数が呼び出されます。
 * </p>
 * <p>
 * {Generator} yieldコールを行う場合にGeneratorを指定します。
 * </p>
 * @example //Callback
 * @example //Generator
 * @example //Callback hell
 */
var CLASS=function LM75B(i_mcu,i_handler)
{
	try{
		var _t=this;
		mbedAppBoard._getI2C(i_mcu,function(i2c){
			_t._lc=CLASS;
			var cb=MI._initHandler.call(_t,i_handler);
			_t._dev=new mbedJS.LM75B(i2c,[0x90],function(){
				if(cb){cb();}
				else if(_t._gen){_t._gen.next(_t);}
				 _t._lc=null;
			});
		});
		return;
	}catch(e){
		throw new MI.MiMicException(e);
	}	
}
CLASS.prototype=
{
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	/** @private*/
	_dev:null,
	/**
	 * コンストラクタでi_handlerにGeneratorを指定した場合のみ使用できます。
	 * yieldと併用してコンストラクタの完了を待ちます。
	 * @name mbedAppBoard.LM75B#waitForNew
	 * @function
	 */
	waitForNew:function LM75B_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * センサから摂氏温度値を取得します。
	 * 関数の完了時にonRead,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.LM75B#read
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 * @return {float}
	 * センサから取得した摂氏温度値です。
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	read:function LM75B_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			_t._dev.read(function(j){
				if(cb){cb(j);}
				if(_t._gen){_t._gen.next(j);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * インスタンスの確保しているオブジェクトを破棄します。
	 * 関数の完了時にonDispose,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.LM75B#dispose
	 * @function
	 * @param {function()} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時は、コンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */	
	dispose:function()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onDispose);
			MI._assertYield.call(_t);
			_t._lc=CLASS.dispose;
			mbedAppBoard._releaseI2C(function(){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	}	
	
}
mbedAppBoard.LM75B=CLASS;
}());
/**
 * @fileOverview mbedApplicationBoardの加速度センサMMA7660ドライバです。
 */
(function(){
var MI=MiMicJS;



/**
 * MbedApplicationBoardのMMA7660を制御するクラスです。
 * @constructor
 * @name mbedAppBoard.MMA7660
 * @param {mbedJS.MCU} i_mcu
 * インスタンスをバインドするオブジェクトです。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数returnは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
 * <li>onRead(return) -readの完了時に呼び出されます。</li>
 * <li>onRead_u16(return) -read_u16の完了時に呼び出されます。</li>
 * </ul>
 * </p>
 * <p>
 * {function} 関数の完了を受け取るコールバック関数です。onNew相当のコールバック関数が呼び出されます。
 * </p>
 * <p>
 * {Generator} yieldコールを行う場合にGeneratorを指定します。
 * </p>
 * @example //Callback
 * @example //Generator
 * @example //Callback hell
 */
var CLASS=function MMA7660(i_mcu,i_handler)
{
	try{
		var _t=this;
		mbedAppBoard._getI2C(i_mcu,function(i2c){
			_t._mcu=i_mcu;
			_t._lc=CLASS;
			var cb=MI._initHandler.call(_t,i_handler);
			_t._dev=new mbedJS.MMA7660(i2c,[0x98],function(){
				if(cb){cb();}
				else if(_t._gen){_t._gen.next(_t);}
				 _t._lc=null;
			});
		});
		return;
	}catch(e){
		throw new MI.MiMicException(e);
	}	
}
CLASS.prototype=
{
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	/** @private*/
	_mcu:null,
	/** @private*/
	_dev:null,
	/**
	 * コンストラクタでi_handlerにGeneratorを指定した場合のみ使用できます。
	 * yieldと併用してコンストラクタの完了を待ちます。
	 * @name mbedAppBoard.MMA7660#waitForNew
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
	 * 加速度センサから値を取得します。
	 * 関数の完了時にonRead,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.MMA7660#read
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 * @return {float[3]}
	 * センサから取得した値の配列です。-1<=n<=1の値です。
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	read:function MMA7660_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			_t._dev.readData(function(j){
				if(cb){cb(j);}
				if(_t._gen){_t._gen.next(j);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * 加速度センサから値を取得します。
	 * 関数の完了時にonRead_u16,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.MMA7660#read_u16
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 * @return {int[3]}
	 * センサから取得した値の配列です。6bit int値です。
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */
	read_u16:function MMA7660_read_u16()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead_u16);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read_u16;
			_t._dev.readData_int(function(j){
				if(cb){cb(j);}
				if(_t._gen){_t._gen.next(j);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},	
	/**
	 * インスタンスの確保しているオブジェクトを破棄します。
	 * 関数の完了時にonDispose,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.MMA7660#dispose
	 * @function
	 * @param {function()} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時は、コンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */		
	dispose:function()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onDispose);
			MI._assertYield.call(_t);
			_t._lc=CLASS.dispose;
			mbedAppBoard._releaseI2C(_t._mcu,function(){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	}	
	
}
mbedAppBoard.MMA7660=CLASS;
}());
/**
 * @fileOverview mbedApplicationBoardのPotentioMeterドライバです。
 */
(function(){
var MI=MiMicJS;

/**
 * MbedApplicationBoardのPotentioMeterを制御するクラスです。
 * @constructor
 * @name mbedAppBoard.PotentioMeter
 * @param {mbedJS.MCU} i_mcu
 * インスタンスをバインドするオブジェクトです。
 * @param {int} i_ch
 * Portのチャンネルを指定します。1,2を指定できます。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数returnは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
 * <li>onRead(return) -readの完了時に呼び出されます。</li>
 * <li>onRead_u16(return) -read_u16の完了時に呼び出されます。</li>
 * </ul>
 * </p>
 * <p>
 * {function} 関数の完了を受け取るコールバック関数です。onNew相当のコールバック関数が呼び出されます。
 * </p>
 * <p>
 * {Generator} yieldコールを行う場合にGeneratorを指定します。
 * </p>
 * @example //Callback
 * @example //Generator
 * @example //Callback hell
 */
var CLASS=function PotentioMeter(i_mcu,i_ch,i_handler)
{
	try{
		var _t=this;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		var pin;
		switch(i_ch)
		{
		case 1:pin=mbedJS.PinName.p19;break;
		case 2:pin=mbedJS.PinName.p20;break;
		default:throw new MI.MiMicException(e);
		}
		_t._ain=new mbedJS.AnalogIn(i_mcu,pin,function(){
			if(cb){cb();}
			else if(_t._gen){_t._gen.next(_t);}
			 _t._lc=null;
		});
		return;
	}catch(e){
		throw new MI.MiMicException(e);
	}	
}
CLASS.prototype=
{
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	/** @private*/
	_ain:null,
	/**
	 * コンストラクタでi_handlerにGeneratorを指定した場合のみ使用できます。
	 * yieldと併用してコンストラクタの完了を待ちます。
	 * @name mbedAppBoard.PotentioMeter#waitForNew
	 * @function
	 */
	waitForNew:function PotentioMeter_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * 加速度センサから値を取得します。
	 * 関数の完了時にonRead_u16,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.PotentioMeter#read_u16
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 * @return {int}
	 * センサから取得した値の配列です。16bit unsigned int値です。
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	read_u16:function PotentioMeter_read_u16()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead_u16);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read_u16;
			_t._ain.read_u16(function(j){
				if(cb){cb(j);}
				if(_t._gen){_t._gen.next(j);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * 加速度センサから値を取得します。
	 * 関数の完了時にonRead,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.PotentioMeter#read
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 * @return {float}
	 * センサから取得した値の配列です。0<=n<=1の値です。
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	read:function PotentioMeter_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			_t._ain.read(function(j){
				if(cb){cb(j);}
				if(_t._gen){_t._gen.next(j);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * インスタンスの確保しているオブジェクトを破棄します。
	 * 関数の完了時にonDispose,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.PotentioMeter#dispose
	 * @function
	 * @param {function()} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時は、コンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */		
	dispose:function PotentioMeter_dispose()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onDispose);
			MI._assertYield.call(_t);
			_t._lc=CLASS.dispose;
			_t._ain.dispose(function(){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	}	
	
}
mbedAppBoard.PotentioMeter=CLASS;
}());
/**
 * @fileOverview mbedApplicationBoardのRgbLEDドライバです。
 */
(function(){
var MI=MiMicJS;
/**
 * MbedApplicationBoardのRgbLEDを制御するクラスです。
 * @constructor
 * @name mbedAppBoard.RgbLed
 * @param {mbedJS.MCU} i_mcu
 * インスタンスをバインドするオブジェクトです。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数returnは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
 * <li>onSetColor() - setColorの完了時に呼び出されます。</li>
 * <li>onSetRgb() - setRgbの完了時に呼び出されます。</li>
 * </ul>
 * </p>
 * <p>
 * {function} 関数の完了を受け取るコールバック関数です。onNew相当のコールバック関数が呼び出されます。
 * </p>
 * <p>
 * {Generator} yieldコールを行う場合にGeneratorを指定します。
 * </p>
 * @example //Callback
 * @example //Generator
 * @example //Callback hell
 */
var CLASS=function RgbLed(i_mcu,i_handler)
{
	try{
		var _t=this;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		
		var p=0;
		function _done(inst)
		{
			inst.period_us(1000,function(){
				p++;
				if(p==3){
					if(cb){cb();}
					else if(_t._gen){_t._gen.next(_t);}
					 _t._lc=null;
				}
			});
		}
		_t._pwm_r=new mbedJS.PwmOut(i_mcu,mbedJS.PinName.p23,function(){_done(_t._pwm_r);});
		_t._pwm_g=new mbedJS.PwmOut(i_mcu,mbedJS.PinName.p24,function(){_done(_t._pwm_g);});
		_t._pwm_b=new mbedJS.PwmOut(i_mcu,mbedJS.PinName.p25,function(){_done(_t._pwm_b);});
	}catch(e){
		throw new MI.MiMicException(e);
	}	
}
CLASS.prototype=
{
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	/** @private */
	_pwm_r:null,
	/** @private */
	_pwm_g:null,
	/** @private */
	_pwm_b:null,
	/**
	 * コンストラクタでi_handlerにGeneratorを指定した場合のみ使用できます。
	 * yieldと併用してコンストラクタの完了を待ちます。
	 * @name mbedAppBoard.RgbLed#waitForNew
	 * @function
	 */
	waitForNew:function RgbLed_waitForNew()
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
	_setRgb:function _setRgb(i_r,i_g,i_b,i_lc,i_cb)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			_t._lc=i_lc;			
			_t._pwm_r.pulsewidth_us(parseInt((256-i_r)*1000/256),function(){
				_t._pwm_g.pulsewidth_us(parseInt((256-i_g)*1000/256),function(){
					_t._pwm_b.pulsewidth_us(parseInt((256-i_b)*1000/256),function(){
						if(i_cb){i_cb();}
						else if(_t._gen){_t._gen.next();}
						 _t._lc=null;
					});
				});
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * RgbLedの輝度をセットします。
	 * 関数の完了時にonSetColor,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.RgbLed#setColor
	 * @function
	 * @param {float} i_r
	 * 0<=n<=1.0の値
	 * @param {float} i_g
	 * 0<=n<=1.0の値
	 * @param {float} i_b
	 * 0<=n<=1.0の値
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */	
	setColor:function RgbLed_setColor(i_r,i_g,i_b)
	{
		return this._setRgb(i_r*256,i_g*256,i_b*256,CLASS.setColor,MI._getCb(arguments,this._event.onSetColor));
	},
	/**
	 * RgbLedの輝度をセットします。
	 * 関数の完了時にonSetRgb,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.RgbLed#setRgb
	 * @function
	 * @param {int} i_r
	 * 0<=n<=255の値
	 * @param {int} i_g
	 * 0<=n<=255の値
	 * @param {int} i_b
	 * 0<=n<=255の値
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */
	setRgb:function RgbLed_setRgb(i_r,i_g,i_b)
	{
		return this._setRgb(i_r,i_g,i_b,CLASS.setRgb,MI._getCb(arguments,this._event.onSetRgb));
	},
	/**
	 * インスタンスの確保しているオブジェクトを破棄します。
	 * 関数の完了時にonDispose,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.RgbLed#dispose
	 * @function
	 * @param {function()} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時は、コンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */	
	dispose:function()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onDispose);
			MI._assertYield.call(_t);
			_t._lc=CLASS.dispose;
			_t._pwm_r.dispose(function(){
				_t._pwm_g.dispose(function(){
					_t._pwm_b.dispose(function(){
						if(cb){cb();}
						if(_t._gen){_t._gen.next();}
						 _t._lc=null;
					});
				});
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	}
	
}


mbedAppBoard.RgbLed=CLASS;
}());
/**
 * @fileOverview mbedApplicationBoardのSpeakerドライバです。
 */
(function(){
var MI=MiMicJS;
/**
 * MbedApplicationBoardのSpeakerを制御するクラスです。
 * @constructor
 * @name mbedAppBoard.Speaker
 * @param {mbedJS.MCU} i_mcu
 * インスタンスをバインドするオブジェクトです。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数returnは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
 * <li>onSound() - soundの完了時に呼び出されます。</li>
 * </ul>
 * </p>
 * <p>
 * {function} 関数の完了を受け取るコールバック関数です。onNew相当のコールバック関数が呼び出されます。
 * </p>
 * <p>
 * {Generator} yieldコールを行う場合にGeneratorを指定します。
 * </p>
 * @example //Callback
 * @example //Generator
 * @example //Callback hell
 */
var CLASS=function Speaker(i_mcu,i_handler)
{
	try{
		var _t=this;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		_t._pwm=new mbedJS.PwmOut(i_mcu,mbedJS.PinName.p26,function(){
			_t._pwm.period_us(0,function(){
				_t._pwm.pulsewidth_us(0,function(){
					if(cb){cb();}
					else if(_t._gen){_t._gen.next(_t);}
					 _t._lc=null;
				});
			});
		});
		return;
	}catch(e){
		throw new MI.MiMicException(e);
	}	
}
CLASS.prototype=
{
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	/** @private*/
	_pwm:null,
	/**
	 * コンストラクタでi_handlerにGeneratorを指定した場合のみ使用できます。
	 * yieldと併用してコンストラクタの完了を待ちます。
	 * @name mbedAppBoard.Speaker#waitForNew
	 * @function
	 */
	waitForNew:function Speaker_waitForNew()
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
	_sound:function Speaker__sound(i_hz,i_lc,i_cb)
	{
		try{
			var _t=this;
			_t._lc=i_lc;
			var f=i_hz==0?0:Math.round(1/i_hz*1000*1000);
			_t._pwm.period_us(f,function(){
				_t._pwm.pulsewidth_us(Math.round(f/2),function(){
					if(i_cb){i_cb();}
					if(_t._gen){_t._gen.next();}
					 _t._lc=null;
				});
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * Spekerから指定周波数の音を出力します。
	 * 関数の完了時にonSound,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.Speaker#sound
	 * @function
	 * @param {int} i_hz
	 * 出力する周波数です。
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */	
	sound:function Speaker_sound(i_hz)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onSound);
			MI._assertYield.call(_t);
			return _t._sound(i_hz,CLASS.sound,cb);
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * インスタンスの確保しているオブジェクトを破棄します。
	 * 関数の完了時にonDispose,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.Speaker#dispose
	 * @function
	 * @param {function()} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時は、コンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */
	dispose:function()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onDispose);
			MI._assertYield.call(_t);
			_t._lc=CLASS.dispose;
			_t._pwm.dispose(
				function(){
					if(cb){cb();}
					if(_t._gen){_t._gen.next();}
					 _t._lc=null;
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}
	}	
}
mbedAppBoard.Speaker=CLASS;
}());