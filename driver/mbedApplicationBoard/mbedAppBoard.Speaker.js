(function(){
var MI=MiMicJS;

var CLASS=function Speker(i_mcu,i_handler)
{
	try{
		var _t=this;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		_t._pwm=new mbedJS.PwmOut(i_mcu,mbedJS.PinName.p26,function(){
			_t._pwm.period_us(0,function(){
				_t._pwm.pulsewidth_us(0,function(){
					if(cb){cb();}
					else if(_t._gen){_t._gen.next(_t);}
					 _t._lc=null;
				});
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
	_pwm:null,
	/**
	 * Generatorモードのときに使用する関数です。
	 * Generatorモードの時は、yieldと併用してnew  Joystick()の完了を待ちます。
	 * @name mbedJS. Joystick#waitForNew
	 * @function
	 */
	waitForNew:function Speker_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * @private
	 */
	_sound:function Speker__sound(i_hz,i_lc,i_cb)
	{
		try{
			var _t=this;
			_t._lc=i_lc;
			var f=i_hz==0?0:Math.round(1/i_hz*1000*1000);
			_t._pwm.period_us(f,function(){
				_t._pwm.pulsewidth_us(Math.round(f/2),function(){
					if(i_cb){i_cb();}
					if(_t._gen){_t._gen.next();}
					 _t._lc=null;
				});
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * Spekerから指定周波数の音を出力します。
	 * 関数の完了時にonSoundイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.Speker#sound
	 * @function
	 * @param　{int} i_hz
	 * 周波数を指定します。
	 */
	sound:function Speker_sound(i_hz)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onSound);
			MI._assertYield.call(_t);
			return _t._sound(i_hz,CLASS.sound,cb);
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
			_t._pwm.dispose(
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
mbedAppBoard.Speker=CLASS;
}());