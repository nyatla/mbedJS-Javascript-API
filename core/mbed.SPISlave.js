/**
 * @fileOverview SPISlaveクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * SPISlaveクラスです。
 * <a href="https://mbed.org/handbook/SPISlave">mbed::SPISlave</a>と同等の機能を持ちます。
 * @name mbedJS.SPISlave
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {[PinName,PinName,PinName]} i_params
 * SPIを構成する4つのPinNameを格納する配列です。
 * mosi, miso, sclkの順番で設定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントハンドラの連想配列、Generator、コールバック関数の何れかを指定します。
 * <p>
 * 非同期イベントハンドラの場合、関数はイベントハンドラで結果を通知します。
 * <ul>
 * <li>{function()} onNew -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>{function(v)} onFrequency  -
 * frequency関数のコールバック関数です。
 * </li>
 * <li>{function(v)} onFormat  -
 * format関数のコールバック関数です。
 * </li>
 * <li>{function(v)} onReceive  -
 * receive関数のコールバック関数です。
 * </li>
 * <li>{function(v)} onRead  -
 * read関数のコールバック関数です。
 * <ul>
 * 		<li>{int} v - 受信した8BIT値です。</li>
 * </ul>
 * </li>
 * <li>{function()} onReply  -
 * reply関数のコールバック関数です。
 * </li>
 * </ul>
 * <p>
 * Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.SPI}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.SPISlave(mcu,[mbedJS.PinName.p5,mbedJS.PinName.p6,mbedJS.PinName.p7,mbedJS.PinName.p8],{
 *     onNew:function(){
 *       pin.frequency(1000000);
 *     },
 *     onFrequency:function()
 *     {
 *       pin.format(8,3);
 *     },
 *     onFormat:function()
 *     {
 *       pin.read();
 *     },
 *     onRead:function(v){
 *       pin.receive();
 *     },
 *     onReceive:function(v)
 *     {
 *       pin.reply(1);
 *     },
 *     onReply:function(){
 *         mcu.close();
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
 *   var pin=new mbedJS.SPISlave(mcu,[mbedJS.PinName.p5,mbedJS.PinName.p6,mbedJS.PinName.p7,mbedJS.PinName.p8],g);
 *   yield pin.waitForNew();
 *   yield pin.frequency(1000000);
 *   yield pin.format(8,3);
 *   var v=yield pin.read();
 *   v=yield pin.receive();
 *   yield pin.reply(1);
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function SPISlave(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		MI.assertInt(i_params);
		_t._mcu.rpc(_t.RPC_NS+":_new1",i_params[0]+","+i_params[1]+","+i_params[2]+","+i_params[3],
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
	RPC_NS:"mbedJS:SPISlave",
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
	 * Generatorモードの時は、yieldと併用してnew SPISlave()の完了を待ちます。
	 * @name mbedJS.SPISlave#waitForNew
	 * @function
	 */
	waitForNew:function SPISlave_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},	

	/**
	 * frequencyに値を設定します。
	 * 関数の完了時にonFrequencyイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPISlave#frequency
	 * @function
	 * @param {int} i_value
	 * 
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	frequency:function SPISlave_frequency(i_value)
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
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},	
	/**
	 * formatに値を設定します。
	 * 関数の完了時にonFormatイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPISlave#format
	 * @function
	 * @param {int} i_bits
	 * @param {int} i_mode
	 * 省略可能です。省略時は0になります。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	format:function SPISlave_format(i_bits,i_mode)
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
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * 転送メモリから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPISlave#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function SPISlave_read()
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onRead);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read",_t._oid,
			function (j)
			{
				var v=j.result[0];
				if(cb){cb(v);}
				if(_t._gen){_t._gen.next(v);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * データが到着しているかを返します。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPISlave#receive
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	receive:function SPISlave_receive()
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onReceive);
			_t._lc=CLASS.receive;
			return _t._mcu.rpc(_t.RPC_NS+":receive",_t._oid,
			function (j)
			{
				var v=j.result[0];
				if(cb){cb(v);}
				if(_t._gen){_t._gen.next(v);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * 転送バッファに次に送信するメッセージをセットします。
	 * 関数の完了時にonReplyイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPISlave#reply
	 * @function
	 * @param {int} i_value
	 * 次に送る8bitの値です。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	reply:function SPISlave_reply(i_value)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onReply);
			_t._lc=CLASS.reply;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":reply",_t._oid+","+i_value,
			function (j)
			{
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.SPISlave#dispose
	 * @function
	 */
	dispose:function SPISlave_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}	
}
NS.SPISlave=CLASS;
}());