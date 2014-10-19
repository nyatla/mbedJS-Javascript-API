/**
 * @fileOverview mbedApplicationBoardのRgbLEDドライバです。
 */
(function(){
var MI=MiMicJS;
/**
 * MbedApplicationBoardのRgbLEDを制御するクラスです。
 * @constructor
 * @name mbedAppBoard.RgbLed
 * @param {mbedJS.MCU} i_mcu
 * インスタンスをバインドするオブジェクトです。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数returnは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
 * <li>onSetColor() - setColorの完了時に呼び出されます。</li>
 * <li>onSetRgb() - setRgbの完了時に呼び出されます。</li>
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
	/** @private */
	_pwm_r:null,
	/** @private */
	_pwm_g:null,
	/** @private */
	_pwm_b:null,
	/**
	 * コンストラクタでi_handlerにGeneratorを指定した場合のみ使用できます。
	 * yieldと併用してコンストラクタの完了を待ちます。
	 * @name mbedAppBoard.RgbLed#waitForNew
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
	 * 関数の完了時にonSetColor,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.RgbLed#setColor
	 * @function
	 * @param {float} i_r
	 * 0<=n<=1.0の値
	 * @param {float} i_g
	 * 0<=n<=1.0の値
	 * @param {float} i_b
	 * 0<=n<=1.0の値
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */	
	setColor:function RgbLed_setColor(i_r,i_g,i_b)
	{
		return this._setRgb(i_r*256,i_g*256,i_b*256,CLASS.setColor,MI._getCb(arguments,this._event.onSetColor));
	},
	/**
	 * RgbLedの輝度をセットします。
	 * 関数の完了時にonSetRgb,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.RgbLed#setRgb
	 * @function
	 * @param {int} i_r
	 * 0<=n<=255の値
	 * @param {int} i_g
	 * 0<=n<=255の値
	 * @param {int} i_b
	 * 0<=n<=255の値
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */
	setRgb:function RgbLed_setRgb(i_r,i_g,i_b)
	{
		return this._setRgb(i_r,i_g,i_b,CLASS.setRgb,MI._getCb(arguments,this._event.onSetRgb));
	},
	/**
	 * インスタンスの確保しているオブジェクトを破棄します。
	 * 関数の完了時にonDispose,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.RgbLed#dispose
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
