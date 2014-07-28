/**
 * @fileOverview DigitalOutクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * DigitalOutクラスです。
 * <a href="https://mbed.org/handbook/DigitalOut">mbed::DigitalOut</a>と同等の機能を持ちます。
 * @name mbedJS.DigitalOut
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {PinName|HashMap|Array} i_params
 * PinName又はコンストラクタの引数を格納した連想配列、配列です。
 * 複数のパラメータを指定する場合は連想配列を使用してください。
 * <p>PinNameの場合は制御するPinIDを指定します。</p>
 * <p>
 * HashMapの場合は以下のメンバを指定できます。
 * <ul>
 * <li>{PinName} pin -
 * ピンIDを指定します。</li>
 * <li>{int} value -
 * ピンの初期値を指定します。</li>
 * </ul>
 * </p>
 * <p>配列の場合は次の順番でパラメータを指定します。
 * <pre>[{PinName} pin,{int} value]</pre>
 * </p>
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
 * <li>onRead:function(v) -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 現在のピンの値です。</li>
 * 	</ul>
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * {function} コールバック関数を指定した場合、RPCが完了したときにonNew相当のコールバック関数が呼び出されます。
 * メンバ関数のイベントハンドラは個別に設定してください。
 * </p>
 * @return {mbedJS.DigitalOut}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.DigitalOut(mcu,mbedJS.PinName.P0_22,{
 *     onNew:function(){
 *       pin.read();
 *     },
 *     onWrite:function(){
 *       mcu.close();
 *     },
 *     onRead:function(v){
 *       pin.write((v+1)%2);
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
 *   var pin=new mbedJS.DigitalOut(mcu,{pin:mbedJS.PinName.P0_22,value:0},g);
 *   yield pin.waitForNew();
 *   var v=yield pin.read();
 *   yield pin.write((v+1)%2);
 *   v=yield pin.read();
 *   yield pin.write((v+1)%2);
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function DigitalOut(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		function rcb(j)
		{
			_t._oid=j.result[0];
			if(cb){cb();}
			if(_t._gen){_t._gen.next(_t);}
			_t._lc=null;
		}
		//パラメタ生成
		var pr;
		if(MI.isHashArray(i_params)){
			pr=[i_params.pin,i_params.value];
		}else if(MI.isArray(i_params)){
			pr=[i_params[0],null];
		}else{
			pr=[i_params,null];
		}
		MI.assertInt(pr[0]);
		if(pr[1]){
			MI.assertInt(pr[1]);
			_t._mcu.rpc(_t.RPC_NS+":_new2",pr[0]+","+pr[1],rcb);
		}else{
			_t._mcu.rpc(_t.RPC_NS+":_new1",pr[0],rcb);
		}
	}catch(e){
		throw new MI.MiMicException(e);
	}
}
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:DigitalOut",
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
	 * Generatorモードの時は、yieldと併用してnew DigitalOut()の完了を待ちます。
	 * @name mbedJS.DigitalOut#waitForNew
	 * @function
	 */
	waitForNew:function DigitalOut_waitForNew()
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
	 * @name mbedJS.DigitalOut#write
	 * @function
	 * @param {int} i_value
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write:function DigitalOut_write(i_value)
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
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * ピンから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.DigitalOut#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function DigitalOut_read()
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
	 * @name mbedJS.DigitalOut#dispose
	 * @function
	 */
	dispose:function DigitalOut_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}

}
NS.DigitalOut=CLASS;
}());