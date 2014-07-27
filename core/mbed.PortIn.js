/**
 * @fileOverview PortInクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * PortInクラスです。
 * <a href="https://mbed.org/handbook/PortIn">mbed::PortIn</a>と同等の機能を持ちます。
 * @name mbedJS.PortIn
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {HashMap|Array} i_params
 * <p>
 * HashNapの場合は以下のメンバを指定できます。
 * <ul>
 * <li>{PortName} port -
 * ポート名を指定します。</li>
 * <li>{uint32} mask -
 * ポートマスクを指定します。</li>
 * </ul>
 * </p>
 * <p>配列の場合は次の順番でパラメータを指定します。
 * <pre>{port,mask}</pre>
 * </p>
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントハンドラの連想配列、Generator、コールバック関数の何れかを指定します。
 * <p>
 * 非同期イベントハンドラの場合、関数はイベントハンドラで結果を通知します。
 * <ul>
 * <li>{function()} onNew -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>{function(v)} onRead -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>{int} v - 現在のポートの値です。</li>
 * 	</ul>
 * </li>
 * </ul>
 * <p>
 * Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.PortIn}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.PortIn(mcu,[mbedJS.PortName.Port0,0xffffffff],{
 *     onNew:function(){
 *       log("[PASS]onNew");
 *       pin.read();
 *     },
 *     onRead:function(v)
 *     {
 *       log("[PASS]read:"+v);
 *       mcu.close();
 *     }});
 *   },
 *   onClose:function(){
 *     log("[PASS]onClose");
 *   },
 *   onError:function(){
 *     alert("Error");
 *   }
 * });
 * @example //Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var port=new mbedJS.PortIn(mcu,[mbedJS.PortName.Port0,0xffffffff],g);
 *   yield port.waitForNew();
 *   var v=yield port.read();
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function PortIn(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		//引数の正規化
		var pr;
		if(MI.isHashArray(i_params)){
			pr=[i_params.port,i_params.mask];
		}else if(MI.isArray(i_params)){
			pr=i_params;
		}
		MI.assertInt(pr);
		_t._mcu.rpc(_t.RPC_NS+":_new1",pr[0]+","+pr[1],
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
	RPC_NS:"mbedJS:PortIn",
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
	 * Generatorモードの時は、yieldと併用してnew PortIn()の完了を待ちます。
	 * @name mbedJS.PortIn#waitForNew
	 * @function
	 */
	waitForNew:function PortIn_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * ピンから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PortIn#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はポートの値を返します。
	 */
	read:function PortIn_read()
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
	 * @name mbedJS.PortIn#dispose
	 * @function
	 */
	dispose:function PortIn_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}
}
NS.PortIn=CLASS;
}());