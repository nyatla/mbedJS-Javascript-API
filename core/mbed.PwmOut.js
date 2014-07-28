/**
 * @fileOverview PwmOutクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * PwmOutクラスです。
 * <a href="https://mbed.org/handbook/PwmOut">mbed::PwmOut</a>と同等の機能を持ちます。
 * @name mbedJS.PwmOut
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {PinName} i_params
 * ピンIDを指定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onWrite:function() -
 * write関数のコールバック関数です。
 * </li>
 * <li>onRead:function(v)  -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>{int} v - 現在のピンの値です。</li>
 * 	</ul>
 * </li>
 * <li>onPeriod:function() -
 * period関数のコールバック関数です。
 * </li>
 * <li>onPeriod_ms:function() -
 * period_ms関数のコールバック関数です。
 * </li>
 * <li>onPeriod_us:function() -
 * period_ns関数のコールバック関数です。
 * </li>
 * <li>onPulsewidth:function() -
 * pulswidth関数のコールバック関数です。
 * </li>
 * <li>onPulsewidth_ms:function() -
 * pulswidth_ms関数のコールバック関数です。
 * </li>
 * <li>onPulsewidth_us:function() -
 * pulswidth_us関数のコールバック関数です。
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.PwmOut}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.PwmOut(mcu,mbedJS.PinName.p21,{
 *     onNew:function(){
 *       pin.write(0.33);
 *     },
 *     onWrite:function()
 *     {
 *       pin.read();
 *     },
 *     onRead:function(v)
 *     {
 *       pin.period(1.0);
 *     },
 *     onPeriod:function(){
 *       pin.period_ms(1);
 *     },
 *     onPeriod_ms:function(){
 *       pin.period_us(10);
 *     },
 *     onPeriod_us:function(){
 *       pin.pulsewidth(3);
 *     },
 *     onPulsewidth:function(){
 *       pin.pulsewidth_ms(30);
 *     },
 *     onPulsewidth_ms:function(){
 *       pin.pulsewidth_us(40);
 *     },
 *     onPulsewidth_us:function(){
 *       mcu.close();
 *     }
 *     });
 *   },
 *   onClose:function(){
 *   },
 *   onError:function(){
 *   }
 * });
 * @example //Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var pin=new mbedJS.PwmOut(mcu,mbedJS.PinName.p21,g);
 *   yield pin.waitForNew();
 *   yield pin.write(0.33);
 *   var v=yield pin.read();
 *   yield pin.period(1.0);
 *   yield pin.period_ms(1);
 *   yield pin.period_us(10);
 *   yield pin.pulsewidth(3);
 *   yield pin.pulsewidth_ms(30);
 *   yield pin.pulsewidth_us(40);
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }}();
 * g.next();
 */
var CLASS=function PwmOut(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		MI.assertInt(i_params);
		_t._mcu.rpc(_t.RPC_NS+":_new1",i_params,
			function(j)
			{
				_t._oid=j.result[0];
				if(cb){cb();}
				if(_t._gen){_t._gen.next(_t);}
				_t._lc=null;
			}
		);
	}catch(e){
		throw new MI.MiMicException(e);
	}
}
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:PwmOut",
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	/** @private リモートインスタンスのオブジェクトIDです。*/
	_oid:null,
	/**
	 * Generatorモードのときに使用する関数です。
	 * Generatorモードの時は、yieldと併用してnew PwmOut()の完了を待ちます。
	 * @name mbedJS.PwmOut#waitForNew
	 * @function
	 */
	waitForNew:function PwmOut_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * ピンに値を出力します。
	 * 関数の完了時にonWriteイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#write
	 * @function
	 * @param {float} i_value
	 * [0,1]の値を指定します。
	 * @return {int|none}
	 * <p>Callbackモードの時はRPCメソッドのインデクスを返します。</p>
	 * <p>Generatorモードの時は戻り値はありません。</p>
	 */
	write:function PwmOut_write(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onWrite);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write;
			MI.assertNumber(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":write_fx",_t._oid+","+Math.round(i_value*10000),
			function(j){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * ピンから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#read
	 * @function
	 * @return　{int|float}
	 * <p>Callbackモードの時はRPCメソッドのインデクスを返します。</p>
	 * <p>Generatorモードの時はピンの値を返します。</p>
	 */
	read:function PwmOut_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read_fx",_t._oid,
			function (j)
			{
				var v=j.result[0]/10000;
				if(cb){cb(v);}
				if(_t._gen){_t._gen.next(v);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * PWMの周期を設定します。
	 * 関数の完了時にonPeriodイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#period
	 * @function
	 * @param {float} i_value
	 * 秒単位の周期を設定します。
	 * @return {int|none}
	 * <p>Callbackモードの時はRPCメソッドのインデクスを返します。</p>
	 * <p>Generatorモードの時は戻り値はありません。</p>
	 */
	period:function PwmOut_period(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onPeriod);
			MI._assertYield.call(_t);
			_t._lc=CLASS.period;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":period_fx",_t._oid+","+Math.round(i_value*10000),
			function(j){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * PWMの周期を設定します。
	 * 関数の完了時にonPeriod_msイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#period_ms
	 * @function
	 * @param {int} i_value
	 * ms単位の周期を設定します。
	 * @return {int|none}
	 * <p>Callbackモードの時はRPCメソッドのインデクスを返します。</p>
	 * <p>Generatorモードの時は戻り値はありません。</p>
	 */
	period_ms:function PwmOut_period_ms(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onPeriod_ms);
			MI._assertYield.call(_t);
			_t._lc=CLASS.period_ms;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":period_ms",_t._oid+","+i_value,
			function(j){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * PWMの周期を設定します。
	 * 関数の完了時にonPeriod_usイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#period_us
	 * @function
	 * @param {int} i_value
	 * 整数値を指定します。
	 * @return {int|none}
	 * <p>Callbackモードの時はRPCメソッドのインデクスを返します。</p>
	 * <p>Generatorモードの時は戻り値はありません。</p>
	 */
	period_us:function PwmOut_period_us(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onPeriod_us);
			MI._assertYield.call(_t);
			_t._lc=CLASS.period_us;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":period_us",_t._oid+","+i_value,
			function(j){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * PWMの周期を設定します。
	 * 関数の完了時にonPeriodイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#pulsewidth
	 * @function
	 * @param {float} i_value
	 * 秒単位の周期を設定します。
	 * @return {int|none}
	 * <p>Callbackモードの時はRPCメソッドのインデクスを返します。</p>
	 * <p>Generatorモードの時は戻り値はありません。</p>
	 */
 	pulsewidth:function PwmOut_pulsewidth(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onPulsewidth);
			MI._assertYield.call(_t);
			_t._lc=CLASS.pulsewidth;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":pulsewidth_fx",_t._oid+","+Math.round(i_value*10000),
			function(j){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * PWMの周期を設定します。
	 * 関数の完了時にonPulsewidth_msイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#pulsewidth_ms
	 * @function
	 * @param {int} i_value
	 * ms単位の周期を設定します。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	pulsewidth_ms:function PwmOut_pulsewidth_ms(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onPulsewidth_ms);
			MI._assertYield.call(_t);
			_t._lc=CLASS.pulsewidth_ms;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":pulsewidth_ms",_t._oid+","+i_value,
				function(j){
					if(cb){cb();}
					if(_t._gen){_t._gen.next();}
					 _t._lc=null;
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * PWMの周期を設定します。
	 * 関数の完了時にonPulsewidth_usイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#pulsewidth_us
	 * @function
	 * @param {int} i_value
	 * 整数値を指定します。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	pulsewidth_us:function PwmOut_pulsewidth_us(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onPulsewidth_us);
			MI._assertYield.call(_t);
			_t._lc=CLASS.pulsewidth_us;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":pulsewidth_us",_t._oid+","+i_value,
				function(j){
					if(cb){cb();}
					if(_t._gen){_t._gen.next();}
					 _t._lc=null;
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.PwmOut#dispose
	 * @function
	 */
	dispose:function PwmOut_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}
}
NS.PwmOut=CLASS;
}());