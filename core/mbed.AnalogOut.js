/**
 * @fileOverview AnalogOutクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * AnalogOutクラスです。
 * <a href="https://mbed.org/handbook/AnalogOut">mbed::AnalogOut</a>と同等の機能を持ちます。
 * @name mbedJS.AnalogOut
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {PinName} i_params
 * ピンIDを指定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントハンドラの連想配列、Generator、コールバック関数の何れかを指定します。
 * <p>
 * 非同期イベントハンドラの場合、関数はイベントハンドラで結果を通知します。
 * <ul>
 * <li>{function()} onNew -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>{function()} onWrite -
 * write関数のコールバック関数です。
 * </li>
 * <li>{function()} onWrite_u16 -
 * write関数のコールバック関数です。
 * </li>
 * <li>{function(v)} onRead  -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>{int} v - 現在のピンの値です。</li>
 * 	</ul>
 * </li>
 * </ul>
 * <p>
 * Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.AnalogOut}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.AnalogOut(mcu,mbedJS.PinName.p18,{
 *     onNew:function(){
 *       pin.write(0.5);
 *     },
 *     onWrite:function()
 *     {
 *       pin.read();
 *     },
 *     onRead:function(v)
 *     {
 *       pin.write_u16(0);
 *     },
 *     onWrite_u16:function()
 *     {
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
 *   var pin=new mbedJS.AnalogOut(mcu,mbedJS.PinName.p18,g);
 *   yield pin.waitForNew();
 *   v=yield pin.write(0.3);
 *   var v=yield pin.read();
 *   v=yield pin.write_u16(1000);
 *   var v=yield pin.read();
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }}();
 * g.next();
 */
var CLASS=function AnalogOut(i_mcu,i_params,i_handler)
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
	RPC_NS:"mbedJS:AnalogOut",
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
	 * Generatorモードの時は、yieldと併用してnew AnalogOut()の完了を待ちます。
	 * @name mbedJS.AnalogOut#waitForNew
	 * @function
	 */
	waitForNew:function AnalogOut_waitForNew()
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
	 * @name mbedJS.AnalogOut#write
	 * @function
	 * @param {float} i_value
	 * [0,1]の範囲で値を指定します。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write:function AnalogOut_write(i_value)
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
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * ピンに値を出力します。
	 * 関数の完了時にonWrite_u16イベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.AnalogOut#write_u16
	 * @function
	 * @param {int} i_value
	 * [0,0xffff]の範囲の整数を指定します。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write_u16:function AnalogOut_write_u16(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onWrite_u16);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":write_u16",_t._oid+","+i_value,
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
	 * ピンから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.AnalogOut#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{float}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function AnalogOut_read()
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
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.AnalogOut#dispose
	 * @function
	 */
	dispose:function AnalogOut_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}

}
NS.AnalogOut=CLASS;
}());