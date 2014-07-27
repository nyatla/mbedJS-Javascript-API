/**
 * @fileOverview BusInOutクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * BusInOutクラスです。
 * <a href="https://mbed.org/handbook/BusInOut">mbed::BusInOut</a>と同等の機能を持ちます。
 * @name mbedJS.BusInOut
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {[PinName...]} i_params
 * ピンIDの配列を指定します。要素数の最大値は16です。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントハンドラの連想配列、Generator、コールバック関数の何れかを指定します。
 * <p>
 * 非同期イベントハンドラの場合、関数はイベントハンドラで結果を通知します。
 * <ul>
 * <li>{function()} onNew -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>{function(v)} onRead  -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>{int} v - 現在のピンの値です。</li>
 * 	</ul>
 * </li>
 * <li>{function()} onWrite -
 * write関数のコールバック関数です。
 * </li>
 * </ul>
 * <li>{function()} onOutput -
 * output関数のコールバック関数です。
 * </li>
 * <li>{function()} onInput -
 * input関数のコールバック関数です。
 * </li>
 * <li>{function()} onMode -
 * mode関数のコールバック関数です。
 * </li>
 * 
 * <p>
 * Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.BusIn}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 * onNew:function(){
 *   var bus=new mbedJS.BusInOut(mcu,[mbedJS.PinName.P0_21,mbedJS.PinName.P0_22],{
 *   onNew:function(){
 *     bus.mode(mbedJS.PinMode.PullDown);
 *   },
 *   onMode:function()
 *   {
 *     bus.output();
 *   },
 *   onOutput:function()
 *   {
 *     bus.write(1);
 *   },
 *   onWrite:function()
 *   {
 *     bus.input();
 *   },
 *   onInput:function(){
 *     bus.read();
 *   },
 *   onRead:function(v)
 *   {
 *     mcu.close();
 *   }});
 * },
 * onClose:function(){
 * },
 * onError:function(){
 * }
 * });
 * 
 * @example //Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var bus=new mbedJS.BusInOut(mcu,[mbedJS.PinName.P0_21,mbedJS.PinName.P0_22],g);
 *   yield bus.waitForNew();
 *   yield bus.mode(mbedJS.PinMode.PullDown);
 *   yield bus.output();
 *   yield bus.write(1);
 *   yield bus.input();
 *   var v=yield bus.read();
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function BusInOut(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		//Pin配列の正規化
		var ap=i_params;
		//数値のみの配列かな？
		MI.assertInt(ap);	
		if(ap.length<1 ||ap.length>16){
			throw new MI.MiMicException(MI.NG_INVALID_ARG);
		}
		var pins=ap[0];
		var i=1;
		for(;i<i_params.length;i++){
			pins+=","+ap[i];
		}
		for(;i<16;i++){
			pins+=","+NS.PinName.NC;
		}
		_t._mcu.rpc(_t.RPC_NS+":_new1",pins,
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
	RPC_NS:"mbedJS:BusInOut",
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
	 * Generatorモードの時は、yieldと併用してnew BusInOut()の完了を待ちます。
	 * @name mbedJS.BusInOut#waitForNew
	 * @function
	 */
	waitForNew:function BusInOut_waitForNew()
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
	 * @name mbedJS.BusInOut#write
	 * @function
	 * @param {int} i_value
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write:function BusInOut_write(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onWrite);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":write",_t._oid+","+i_value,
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
	 * @name mbedJS.BusInOut#read
	 * @function
	 * @return　{int}
	 *　Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function BusInOut_read()
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
	 * @name mbedJS.BusInOut#mode
	 * @function
	 * @param {PinMode} i_value
	 * PinModeの値です。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	mode:function BusInOut_mode(i_value)
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
	 * ピンモードを設定します。
	 * 関数の完了時にonInputイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.BusInOut#input
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	input:function BusInOut_input()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onInput);
			MI._assertYield.call(_t);
			_t._lc=CLASS.input;
			return _t._mcu.rpc(_t.RPC_NS+":input",_t._oid,
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
	 * ピンモードを設定します。
	 * 関数の完了時にonOutputイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.BusInOut#output
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	output:function BusInOut_output()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onOutput);
			MI._assertYield.call(_t);
			_t._lc=CLASS.mode;
			return _t._mcu.rpc(_t.RPC_NS+":output",_t._oid,
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
	 * @name mbedJS.BusInOut#dispose
	 * @function
	 */
	dispose:function BusInOut_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}

}
NS.BusInOut=CLASS;
}());