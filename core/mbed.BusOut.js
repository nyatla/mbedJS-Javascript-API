/**
 * @fileOverview BusOutクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * BusOutクラスです。
 * <a href="https://mbed.org/handbook/BusOut">mbed::BusOut</a>と同等の機能を持ちます。
 * @name mbedJS.BusOut
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {[PinName...]} i_params
 * ピンIDの配列を指定します。要素数の最大値は16です。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onRead:function(v)  -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 現在のピンの値です。</li>
 * 	</ul>
 * </li>
 * <li>onWrite:function() -
 * write関数のコールバック関数です。
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * {function} コールバック関数を指定した場合、RPCが完了したときにonNew相当のコールバック関数が呼び出されます。
 * メンバ関数のイベントハンドラは個別に設定してください。
 * </p>
 * @return {mbedJS.BusOut}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var bus=new mbedJS.BusOut(mcu,[mbedJS.PinName.P0_21,mbedJS.PinName.P0_22],{
 *     onNew:function(){
 *       bus.write(2);
 *     },
 *     onWrite:function()
 *     {
 *       bus.read();
 *     },
 *     onRead:function(v){
 *       mcu.close();
 *     },
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
 *   var bus=new mbedJS.BusOut(mcu,[mbedJS.PinName.P0_21,mbedJS.PinName.P0_22],g);
 *   yield bus.waitForNew();
 *   yield bus.write(1);
 *   var v=yield bus.read();
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function BusOut(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		//Pin配列の正規化
		var ap=i_params;
		if(ap.length<1 ||ap.length>16){
			throw new MI.MiMicException(MI.NG_INVALID_ARG);
		}
		//数値のみの配列かな？
		MI.assertInt(ap);	
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
	RPC_NS:"mbedJS:BusOut",
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
	 * Generatorモードの時は、yieldと併用してnew BusOut()の完了を待ちます。
	 * @name mbedJS.BusOut#waitForNew
	 * @function
	 */
	waitForNew:function BusOut_waitForNew()
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
	 * @name mbedJS.BusOut#write
	 * @function
	 * @param {int} i_value
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write:function BusOut_write(i_value)
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
	 * @name mbedJS.BusOut#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function BusOut_read()
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
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.BusOut#dispose
	 * @function
	 */
	dispose:function BusOut_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}

}
NS.BusOut=CLASS;
}());