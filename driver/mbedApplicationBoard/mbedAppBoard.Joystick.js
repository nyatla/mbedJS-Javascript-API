/**
 * @fileOverview mbedApplicationBoardのJoystickドライバです。
 */
(function(){
var MI=MiMicJS;

/**
 * mbedApplicationBoardのJoystickを制御するクラスです。
 * @constructor
 * @name mbedAppBoard.Joystick
 * @param {mbedJS.MCU} i_mcu
 * インスタンスをバインドするオブジェクトです。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数returnは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
 * <li>onGetState(return) - getStateの完了時に呼び出されます。</li>
 * </ul>
 * </p>
 * <p>
 * {function} 関数の完了を受け取るコールバック関数です。onNew相当のコールバック関数が呼び出されます。
 * </p>
 * <p>
 * {Generator} yieldコールを行う場合にGeneratorを指定します。
 * </p>
 * @return {mbedAppBoard.Joystick}
 * 生成したインスタンスを返します。
 * @example //Callback
 * @example //Generator
 * @example //Callback hell
 */
var CLASS=function Joystick(i_mcu,i_handler)
{
	try{
		var _t=this;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		_t._busin=new mbedJS.BusIn(
			i_mcu,
			[mbedJS.PinName.p12,mbedJS.PinName.p13,mbedJS.PinName.p14,mbedJS.PinName.p15,mbedJS.PinName.p16],
			function(){
				if(cb){cb();}
				else if(_t._gen){_t._gen.next(_t);}
				 _t._lc=null;
		});
		return;
	}catch(e){
		throw new MI.MiMicException(e);
	}	
}
/**
 * getState関数が返すビットマスク定数値です。
 * @name mbedAppBoard.Joystick#Down
 * @field
 */
CLASS.Down=1;
/**
 * getState関数が返すビットマスク定数値です。
 * @name mbedAppBoard.Joystick#Left
 * @field
 */
CLASS.Left=2;
/**
 * getState関数が返すビットマスク定数値です。
 * @name mbedAppBoard.Joystick#Center
 * @field
 */
CLASS.Center=4;
/**
 * getState関数が返すビットマスク定数値です。
 * @name mbedAppBoard.Joystick#Up
 * @field
 */
CLASS.Up=8;
/**
 * getState関数が返すビットマスク定数値です。
 * @name mbedAppBoard.Joystick#Right
 * @field
 */
CLASS.Right=16;

CLASS.prototype=
{
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	/** @private*/
	_busin:null,
	/**
	 * コンストラクタでi_handlerにGeneratorを指定した場合のみ使用できます。
	 * yieldと併用してコンストラクタの完了を待ちます。
	 * @name mbedAppBoard.Joystick#waitForNew
	 * @function
	 */
	waitForNew:function Joystick_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * Joystickの状態をビットパターンで返します。
	 * 関数の完了時にonGetSide,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.Joystick#getState
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 * @return　{int}
	 * ジョイスティックの状態をビットパターンで返します。
	 * bit0=Down/bit1=Left/bit2=Up/bit3=Center/bit4=Right
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	getState:function Joystick_getState()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onGetState);
			MI._assertYield.call(_t);
			_t._lc=CLASS.getState;
			_t._busin.read(
				function(j){
					if(cb){cb(j);}
					if(_t._gen){_t._gen.next(j);}
					 _t._lc=null;
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * インスタンスの確保しているオブジェクトを破棄します。
	 * 関数の完了時にonDispose,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.Joystick#dispose
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
			_t._busin.dispose(
				function(){
					if(cb){cb();}
					if(_t._gen){_t._gen.next();}
					 _t._lc=null;
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}
	}
}
mbedAppBoard.Joystick=CLASS;
}());
