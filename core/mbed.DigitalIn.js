/**
 * @fileOverview DigitalInクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * DigitalInクラスです。
 * <a href="https://mbed.org/handbook/DigitalIn">mbed::DigitalIn</a>と同等の機能を持ちます。
 * @name mbedJS.DigitalIn
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
 * <li>onRead:function(v) -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 現在のピンの値です。</li>
 * 	</ul>
 * </li>
 * <li>onMode:function() -
 * mode関数のコールバック関数です。
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * {function} コールバック関数を指定した場合、RPCが完了したときにonNew相当のコールバック関数が呼び出されます。
 * メンバ関数のイベントハンドラは個別に設定してください。
 * </p>
 * @return {mbedJS.DigitalIn}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.DigitalIn(mcu,mbedJS.PinName.P0_22,{
 *     onNew:function(){
 *       pin.mode(mbedJS.PinMode.PullUp);
 *     },
 *     onMode:function()
 *     {
 *       pin.read();
 *     },
 *     onRead:function(v){
 *       mcu.close();
 *     }});
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
 *   var pin=new mbedJS.DigitalIn(mcu,mbedJS.PinName.P0_22,g);
 *   yield pin.waitForNew();
 *   var v=yield pin.read();
 *   yield pin.mode(mbedJS.PinMode.PullDown);
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }}();
 * g.next();
 */
var CLASS=function DigitalIn(i_mcu,i_params,i_handler)
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
	RPC_NS:"mbedJS:DigitalIn",
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
	 * Generatorモードの時は、yieldと併用してnew DigitalIn()の完了を待ちます。
	 * @name mbedJS.DigitalIn#waitForNew
	 * @function
	 */
	waitForNew:function DigitalIn_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * ピンからアナログ値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.DigitalIn#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function DigitalIn_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read",_t._oid,
			function (j)
			{
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
	 * ピンモードを設定します。
	 * 関数の完了時にonModeイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.DigitalIn#mode
	 * @function
	 * @param {PinMode} i_value
	 * PinModeの値です。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	mode:function DigitalIn_mode(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onMode);
			MI._assertYield.call(_t);
			_t._lc=CLASS.mode;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":mode",_t._oid+","+i_value,
			function (j)
			{
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
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.DigitalIn#dispose
	 * @function
	 */
	dispose:function DigitalIn_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}
}
NS.DigitalIn=CLASS;
}());