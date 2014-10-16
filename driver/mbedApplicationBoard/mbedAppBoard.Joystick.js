(function(){
var MI=MiMicJS;

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
CLASS.Down=1;
CLASS.Left=2;
CLASS.Center=4;
CLASS.Up=8;
CLASS.Right=16;

CLASS.prototype=
{
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	_busin:null,
	/**
	 * Generatorモードのときに使用する関数です。
	 * Generatorモードの時は、yieldと併用してnew  Joystick()の完了を待ちます。
	 * @name mbedJS. Joystick#waitForNew
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
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.Joystick#getState
	 * @function
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
