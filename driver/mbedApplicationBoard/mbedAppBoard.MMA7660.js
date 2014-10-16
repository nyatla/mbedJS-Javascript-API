(function(){
var MI=MiMicJS;




/**
 * MbedApplicationBoardのMMA7660を制御するクラスです。
 * @constructor
 * @name mbedAppBoard.MMA7660
 * @param {mbedJS.MCU} i_parent
 * インスタンスをバインドするオブジェクトです。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数retは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
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
var CLASS=function MMA7660(i_mcu,i_handler)
{
	try{
		var _t=this;
		MbedAppBoard._getI2C(i_mcu,function(i2c){
			_t._mcu=i_mcu;
			_t._lc=CLASS;
			var cb=MI._initHandler.call(_t,i_handler);
			_t._dev=new mbedJS.MMA7660(i2c,[0x98],function(){
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
	_mcu:null,
	_dev:null,
	/**
	 * Generatorモードのときに使用する関数です。
	 * Generatorモードの時は、yieldと併用してnew  LM75B()の完了を待ちます。
	 * @name mbedAppBoard.Port#waitForNew
	 * @function
	 */
	waitForNew:function MMA7660_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * 加速度センサから値を取得します。
	 * 関数の完了時にonRead,又はコールバック関数でイベントを通知します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.MMA7660#read
	 * @function
	 * @return {float[]}
	 * 取得値
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	read:function MMA7660_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			_t._dev.readData(function(j){
				if(cb){cb(j);}
				if(_t._gen){_t._gen.next(j);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * 加速度センサから値を取得します。
	 * 関数の完了時にonRead,又はコールバック関数でイベントを通知します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedAppBoard.MMA7660#read_u16
	 * @function
	 * @return {int[]}
	 * 取得値
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	read_u16:function MMA7660_read_u16()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead_u16);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read_u16;
			_t._dev.readData_int(function(j){
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
			MbedAppBoard._releaseI2C(_t._mcu,function(){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	}	
	
}
mbedAppBoard.MMA7660=CLASS;
}());
