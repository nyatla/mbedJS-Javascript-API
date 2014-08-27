/**
 * @fileOverview Mcuクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * mbedJSを搭載したmbedに接続したインスタンスを生成します。
 * Mcuオブジェクトは、他のペリフェラルクラスをインスタンス化するときに必要です。
 * @name mbedJS.Mcu
 * @constructor
 * @param {string} i_url
 * 接続先のMiMicRPCサービスのアドレスを指定します。
 * @param {HashMap|Generator} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>{function()} onNew -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>{function()} onClose -
 * Close関数のコールバック関数です。
 * </li>
 * <li>{function()} onError -
 * 何らかの異常で通信を継続できないエラーが発生し、コネクションを維持できない時に発生します。
 * このイベントが発生するとコネクションは閉じられれます。
 * </li>
 * <li>{function(v)} onDisposeObject
 * disposeObject関数が完了したときに呼び出されます。
 * vは削除に成功したかの真偽値です。
 * </li>
 * <li>{function(v)} onGetInfo
 * onGetInfo関数が完了したときに呼び出されます。
 * vは戻り値を格納した複合連想配列です。
 * {version,platform,mcu:{name,eth},memory:{free}}
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の戻り値はyiledの戻り値として取得できます。
 * <p>
 * @return {mbedJS.Mcu}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     mcu.getInfo();
 *   },
 *   onGetInfo:function(v){
 *     log("[PASS]onGetInfo:"+v.version+","+v.platform+","+v.mcu.name+","+v.mcu.eth+","+v.memory.free);
 *     var pin=new mbedJS.DigitalIn(mcu,mbedJS.PinName.P0_22,{
 *       onNew:function(){
 *         mcu.disposeObject(pin._oid);
 *       }});
 *   },
 *   onDisposeObject:function(v){
 *     mcu.close();
 *   },
 *   onClose:function(){
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
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function Mcu(i_url,i_handler)
{
	var _t=this;
	_t._lc=CLASS;
	_t._has_error=false;
	if(MI.isGenerator(i_handler)){_t._gen=i_handler;}
	else if(i_handler){_t._event=i_handler}
	
	_t._rpc=new MI.Rpc({
		onOpen:function _Mcu_onOpen(){
			if(_t._event.onNew){_t._event.onNew();}
			if(_t._gen){_t._gen.next(_t);}
			_t.lc=null;
		},
		onClose:function _Mcu_onClose(){
			if(_t._lc==CLASS.close){
				if(_t._event.onClose){_t._event.onClose();}
			}else{
				if(_t._event.onError){_t._event.onError();}
			}
			if(_t._gen){
				_t._gen.next(_t);
			}			
			_t.lc=null;
		},
		onError:function _Mcu_onError()
		{
			_t._has_error=true;
			if(_t._event.onError){_t._event.onError();}
			if(_t._gen && _t._lc){
				_t._gen.throw(new MI.MiMicException());
			}
			//@todo MCUにぶら下がってる全てのyieldに対してもExceptionの発生要請？
		}
	});
	//MCUへ接続
	this._rpc.open('ws://'+i_url+'/rpc/');
}
CLASS.prototype=
{
	RPC_NS:"mbedJS:Mcu",
	_lc:null,
	_rpc:null,
	_gen:null,
	_event:{},
	_has_error:false,
	/**
	 * エラー状態であるかを返します。
	 * Generatorモードの場合に、定期実行してインスタンスの状態をチェックできます。
	 * falseの場合、下位のオブジェクトでyieldロックが発生している場合があります。
	 * @name mbedJS.Mcu#hasError
	 * @function
	 * @return {boolean}
	 * true - インスタンスはエラー状態で停止中です。使用できません。
	 * false - インスタンスは動作中です。使用可能です。
	 */
	hasError:function(){
		return this._has_error;
	},
	/**
	 * Generatorモードのときに使用する関数です。
	 * Generatorモードの時は、yieldと併用してnew Mcu()の完了を待ちます。
	 * @name mbedJS.Mcu#waitForNew
	 * @function
	 */
	waitForNew:function MCU_waitForNew(){
		if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
		this._lc=CLASS.waitForNew;
	},
	/**
	 * RPCを切断します。関数の完了時にonCloseイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Mcu#close
	 * @function
	 */
	close:function MCU_close(){
		MI._assertYield.call(this);
		this._lc=CLASS.close;
		this._rpc.close();
	},
	/**
	 * コールバック関数を全てキャンセルして、Mcuとの接続をシャットダウンします。
	 * この関数は即座に完了します。
	 * @name mbedJS.Mcu#shutdown
	 * @function
	 */
	shutdown:function MCU_shutdown(){
		this._rpc.shutdown();
	},
	/**
	 * RPCメソッドを実行します。
	 * @name mbedJS.Mcu#rpc
	 * @function
	 * @param {string} m
	 * メソッド名です。
	 * @param {string} p
	 * パラメータ部の文字列です。JSONオブジェクトの配列を記述します。
	 * 配列の要素はプリミティブ型である必要があります。
	 * @param {function(json)} c
	 * RPCが完了したときに呼び出すコールバック関数です。
	 * <ul>
	 * <li>json - 戻り値をJSON文字列としてパースしたObjectです。</li>
	 * </ul>
	 * @return {int}
	 * メソッドのid値を返します。
	 */
	rpc:function Mcu_rpc(m,p,c){
		if(this._has_error){
			throw new MI.MiMicException();
		}
		return this._rpc.sendMethod(m,p,c);
	},
	/** @private */
	addItem:function(o){
		this._items.push(o);
	},
	/**
	 * Mcuの情報を返します。
	 * @name mbedJS.Mcu#getInfo
	 * @function
	 * @return {HashMap}
	 * 情報を格納した連想配列です。
	 */
	getInfo:function(){
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onGetInfo);
			_t._lc=CLASS.getInfo;
			return _t.rpc(_t.RPC_NS+":getInfo","",
				function (j)
				{
					var r=j.result;
					var v={version:r[0],platform:r[1],mcu:{name:r[3],eth:r[2]},memory:{free:r[4]}};
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
	 * 指定idのオブジェクトをMCUのメモリから削除します。
	 * @name mbedJS.Mcu#disposeObject
	 * @function
	 * @param {int} i_oid
	 * オブジェクトID。
	 * mbedJSオブジェクトが所有するリモートオブジェクトのIDを指定します。
	 * @return {boolean}
	 * 結果を返します。
	 */
	disposeObject:function(i_oid){
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onDisposeObject);
			_t._lc=CLASS.disposeObject;
			return _t.rpc(_t.RPC_NS+":disposeObject",i_oid,
				function (j)
				{
					var v=j.result[0]?true:false;
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
	 * 内部関数です.
	 * ペリフェラルクラスから_dispose.apply(this,arguments)でコールしてください。
	 * @private
	 */
	_dispose:function(){
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onDispose);
			_t._lc=_t.dispose;//CLASS.disposeが使えないんでIDに関数そのものを使う
			return _t._mcu.rpc(_t._mcu.RPC_NS+":disposeObject",_t._oid,
				function (j)
				{
					var v=j.result[0]?true:false;
					if(cb){cb(v);}
					if(_t._gen){_t._gen.next(v);}
					 _t._lc=null;
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}		
	}	
	
}
NS.Mcu=CLASS;
}());