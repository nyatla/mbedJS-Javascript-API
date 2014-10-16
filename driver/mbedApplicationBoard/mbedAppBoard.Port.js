(function(){
var MI=MiMicJS;
/**
 * MbedApplicationBoardのPortを制御するクラスです。
 * @constructor
 * @name mbedAppBoard.Port
 * @param {mbedJS.MCU} i_mcu
 * インスタンスをバインドするオブジェクトです。
 * @param {i_ch:int} i_params
 * Portのチャンネルを指定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数retは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
 * <li>onRead_u16() - read_u16の完了時に呼び出されます。</li>
 * <li>onRead(ret) -readの完了時に呼び出されます。</li>
 * </ul>
 * <p>
 * {function} コールバック関数を指定した場合、RPCが完了したときにonNew相当のコールバック関数が呼び出されます。
 * メンバ関数のイベントハンドラは個別に設定してください。
 * </p>
 * @example //Callback
 * @example //Generator
 * @example //Callback hell
 */
var CLASS=function Port(i_mcu,i_ch,i_handler)
{
	try{
		var _t=this;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		var pin;
		switch(i_ch)
		{
		case 1:pin=mbedJS.PinName.p19;break;
		case 2:pin=mbedJS.PinName.p20;break;
		default:throw new MI.MiMicException(e);
		}
		_t._ain=new mbedJS.AnalogIn(i_mcu,pin,function(){
			if(cb){cb();}
			else if(_t._gen){_t._gen.next(_t);}
			 _t._lc=null;
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
	_ain:null,
	/**
	 * Generatorモードのときに使用する関数です。
	 * Generatorモードの時は、yieldと併用してnew  Joystick()の完了を待ちます。
	 * @name mbedAppBoard.Port#waitForNew
	 * @function
	 */
	waitForNew:function Port_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * 指定chのポートの値を返します。
	 * 関数の完了時にonRead,又はコールバック関数でイベントを通知します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.Port#read_u16
	 * @function
	 * @param　{int} i_ch
	 * 1又は2を指定します。
	 * @return
	 * ポートのint値
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	read_u16:function Port_read_u16()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead_u16);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read_u16;
			_t._ain.read_u16(function(j){
				if(cb){cb(j);}
				if(_t._gen){_t._gen.next(j);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * 指定chのポートの値を返します。
	 * 関数の完了時にonRead,又はコールバック関数でイベントを通知します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.Port#read
	 * @function
	 * @param　{int} i_ch
	 * 1又は2を指定します。
	 * @return
	 * ポートのint値
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	read:function Port_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			_t._ain.read(function(j){
				if(cb){cb(j);}
				if(_t._gen){_t._gen.next(j);}
				 _t._lc=null;
			});
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
			_t._ain.dispose(function(){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	}	
	
}
mbedAppBoard.Port=CLASS;
}());
