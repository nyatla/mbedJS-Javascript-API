/**
 * @fileOverview mbedApplicationBoardの温度センサLM75Bドライバです。
 */
(function(){
var MI=MiMicJS;




/**
 * MbedApplicationBoardのLM75Bを制御するクラスです。
 * @constructor
 * @name mbedAppBoard.LM75B
 * @param {mbedJS.MCU} i_mcu
 * インスタンスをバインドするオブジェクトです。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数returnは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
 * <li>onRead(return) -readの完了時に呼び出されます。</li>
 * </ul>
 * </p>
 * <p>
 * {function} 関数の完了を受け取るコールバック関数です。onNew相当のコールバック関数が呼び出されます。
 * </p>
 * <p>
 * {Generator} yieldコールを行う場合にGeneratorを指定します。
 * </p>
 * @example //Callback
 * @example //Generator
 * @example //Callback hell
 */
var CLASS=function LM75B(i_mcu,i_handler)
{
	try{
		var _t=this;
		mbedAppBoard._getI2C(i_mcu,function(i2c){
			_t._lc=CLASS;
			var cb=MI._initHandler.call(_t,i_handler);
			_t._dev=new mbedJS.LM75B(i2c,[0x90],function(){
				if(cb){cb();}
				else if(_t._gen){_t._gen.next(_t);}
				 _t._lc=null;
			});
		});
		return;
	}catch(e){
		throw new MI.MiMicException(e);
	}	
}
CLASS.prototype=
{
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	/** @private*/
	_dev:null,
	/**
	 * コンストラクタでi_handlerにGeneratorを指定した場合のみ使用できます。
	 * yieldと併用してコンストラクタの完了を待ちます。
	 * @name mbedAppBoard.LM75B#waitForNew
	 * @function
	 */
	waitForNew:function LM75B_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * センサから摂氏温度値を取得します。
	 * 関数の完了時にonRead,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.LM75B#read
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 * @return {float}
	 * センサから取得した摂氏温度値です。
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	read:function LM75B_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			_t._dev.read(function(j){
				if(cb){cb(j);}
				if(_t._gen){_t._gen.next(j);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * インスタンスの確保しているオブジェクトを破棄します。
	 * 関数の完了時にonDispose,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.LM75B#dispose
	 * @function
	 * @param {function()} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時は、コンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */	
	dispose:function()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onDispose);
			MI._assertYield.call(_t);
			_t._lc=CLASS.dispose;
			mbedAppBoard._releaseI2C(function(){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	}	
	
}
mbedAppBoard.LM75B=CLASS;
}());
