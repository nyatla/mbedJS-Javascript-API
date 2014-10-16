(function(){
var MI=MiMicJS;

var CLASS=function RgbLed(i_mcu,i_handler)
{
	try{
		var _t=this;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		
		var p=0;
		function _done(inst)
		{
			inst.period_us(1000,function(){
				p++;
				if(p==3){
					if(cb){cb();}
					else if(_t._gen){_t._gen.next(_t);}
					 _t._lc=null;
				}
			});
		}
		_t._pwm_r=new mbedJS.PwmOut(i_mcu,mbedJS.PinName.p23,function(){_done(_t._pwm_r);});
		_t._pwm_g=new mbedJS.PwmOut(i_mcu,mbedJS.PinName.p24,function(){_done(_t._pwm_g);});
		_t._pwm_b=new mbedJS.PwmOut(i_mcu,mbedJS.PinName.p25,function(){_done(_t._pwm_b);});
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
	_pwm_r:null,
	_pwm_g:null,
	_pwm_b:null,
	/**
	 * Generatorモードのときに使用する関数です。
	 * Generatorモードの時は、yieldと併用してnew RgbLed()の完了を待ちます。
	 * @name mbedJS.RgbLed#waitForNew
	 * @function
	 */
	waitForNew:function RgbLed_waitForNew()
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
	_setRgb:function _setRgb(i_r,i_g,i_b,i_lc,i_cb)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			_t._lc=i_lc;			
			_t._pwm_r.pulsewidth_us(parseInt((256-i_r)*1000/256),function(){
				_t._pwm_g.pulsewidth_us(parseInt((256-i_g)*1000/256),function(){
					_t._pwm_b.pulsewidth_us(parseInt((256-i_b)*1000/256),function(){
						if(i_cb){i_cb();}
						else if(_t._gen){_t._gen.next();}
						 _t._lc=null;
					});
				});
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},	
	/**
	 * RgbLedの輝度をセットします。
	 * 関数の完了時にonRgb,又はコールバック関数でイベントを通知します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.RgbLed#setColor
	 * @function
	 * @param {float} i_r
	 * 0<=n<=1.0の値
	 * @param {float} i_g
	 * 0<=n<=1.0の値
	 * @param {float} i_b
	 * 0<=n<=1.0の値
	 */	
	setColor:function RgbLed_setColor(i_r,i_g,i_b)
	{
		return this._setRgb(i_r*256,i_g*256,i_b*256,CLASS.setColor,MI._getCb(arguments,this._event.onSetColor));
	},
	/**
	 * RgbLedの輝度をセットします。
	 * 関数の完了時にonRgb,又はコールバック関数でイベントを通知します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.RgbLed#setRgb
	 * @function
	 * @param {int} i_r
	 * 0<=n<=255の値
	 * @param {int} i_g
	 * 0<=n<=255の値
	 * @param {int} i_b
	 * 0<=n<=255の値
	 */		
	setRgb:function RgbLed_setRgb(i_r,i_g,i_b)
	{
		return this._setRgb(i_r,i_g,i_b,CLASS.setRgb,MI._getCb(arguments,this._event.onSetRgb));
	},
	dispose:function()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onDispose);
			MI._assertYield.call(_t);
			_t._lc=CLASS.dispose;
			_t._pwm_r.dispose(function(){
				_t._pwm_g.dispose(function(){
					_t._pwm_b.dispose(function(){
						if(cb){cb();}
						if(_t._gen){_t._gen.next();}
						 _t._lc=null;
					});
				});
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	}
	
}


mbedAppBoard.RgbLed=CLASS;
}());
