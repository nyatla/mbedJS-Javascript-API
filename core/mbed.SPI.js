/**
 * @fileOverview SPIクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * SPIクラスです。
 * <a href="https://mbed.org/handbook/SPI">mbed::SPI</a>と同等の機能を持ちます。
 * @name mbedJS.SPI
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {[PinName,PinName,PinName]} i_params
 * SPIを構成する3つのPinNameを格納する配列です。mosi,miso,sclkの順番です。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントハンドラの連想配列、Generator、コールバック関数の何れかを指定します。
 * <p>
 * 非同期イベントハンドラの場合、関数はイベントハンドラで結果を通知します。
 * <ul>
 * <li>{function()} onNew -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>{function(v)} onWrite -
 * write関数のコールバック関数です。
 * 	<ul>
 * 		<li>{int} v - 受信した8BIT値です。</li>
 * 	</ul>
 * </li>
 * <li>{function(v)} onFrequency  -
 * frequency関数のコールバック関数です。
 * </li>
 * <li>{function(v)} onFormat  -
 * format関数のコールバック関数です。
 * </li>
 * </ul>
 * <p>
 * Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.SPI}
 * @example　//Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.SPI(mcu,[mbedJS.PinName.p5,mbedJS.PinName.p6,mbedJS.PinName.p7],{
 *     onNew:function(){
 *       pin.frequency(1000000);
 *     },
 *     onFrequency:function()
 *     {
 *       pin.format(8,3);
 *     },
 *     onFormat:function()
 *     {
 *       pin.write(39);
 *     },
 *     onWrite:function(v){
 *       mcu.close();
 *     }});
 *   },
 *   onClose:function(){
 *   },
 *   onError:function(){
 *   }
 * });
 * @example　//Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var pin=new mbedJS.SPI(mcu,[mbedJS.PinName.p5,mbedJS.PinName.p6,mbedJS.PinName.p7],g);
 *   yield pin.waitForNew();
 *   yield pin.frequency(1000000);
 *   yield pin.format(8,3);
 *   v=yield pin.write(39);
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function SPI(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		MI.assertInt(i_params);
		_t._mcu.rpc(_t.RPC_NS+":_new1",i_params[0]+","+i_params[1]+","+i_params[2]+","+NS.PinName.NC,
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
	RPC_NS:"mbedJS:SPI",
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
	 * Generatorモードの時は、yieldと併用してnew SPI()の完了を待ちます。
	 * @name mbedJS.SPI#waitForNew
	 * @function
	 */
	waitForNew:function SPI_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},	
	/**
	 * SPI Slaveに値を書き込み、戻り値を返します。
	 * 関数の完了時にonWriteイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPI#write
	 * @function
	 * @param {int} i_value
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write:function SPI_write(i_value)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onWrite);
			_t._lc=CLASS.write;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":write",_t._oid+","+i_value,
				function(j){
					var v=j.result[0];
					if(cb){cb(v);}
					if(_t._gen){_t._gen.next(v);}
					 _t._lc=null;
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * frequencyに値を設定します。
	 * 関数の完了時にonFrequencyイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPI#frequency
	 * @function
	 * @param {int} i_value
	 * frequencyに設定する値です。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	frequency:function SPI_frequency(i_value)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onFrequency);
			_t._lc=CLASS.frequency;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":frequency",_t._oid+","+i_value,
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
	 * formatに値を設定します。
	 * 関数の完了時にonFormatイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPI#format
	 * @function
	 * @param {int} i_bits
	 * @param {int} i_mode
	 * 省略可能です。省略時は0になります。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	format:function SPI_format(i_bits,i_mode)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onFormat);
			_t._lc=CLASS.format;
			var mode=i_mode?i_mode:0;
			MI.assertInt([i_bits,mode]);
			return _t._mcu.rpc(_t.RPC_NS+":format",_t._oid+","+i_bits+","+mode,
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
	 * @name mbedJS.SPI#dispose
	 * @function
	 */
	dispose:function SPI_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}
}
NS.SPI=CLASS;
}());