/**
 * @fileOverview LM75Bクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * LM75Bを制御するクラスです。
 * <a href="https://github.com/hara41/test_LM75B/tree/master/test_LM75B">test_LM75B</a>と同等の機能を持ちます。
 * @constructor
 * @name mbedJS.LM75B
 * @param {mbedJS.I2C|mbedJS.MCU} i_parent
 * インスタンスをバインドするオブジェクトです。MCUの場合はI2Cバスを占有します。
 * @param {[addr:int]|[addr:int,sda:PinName,scl:PinName]} i_params
 * i_parentがmbedJS.I2Cの場合はI2Cアドレスを指定します。mbedJS.MCUの場合はI2C address,sda,sclの順番で指定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。関数の引数returnは各関数の戻り値です。
 * <ul>
 * <li>onNew:function() - コンストラクタが完了し、インスタンスが使用可能になった時に呼び出されます。</li>
 * <li>onDispose:function() - disposeの完了時に呼び出されます。</li>
 * <li>onRead(return) - readの完了時に呼び出されます。</li>
 * </ul>
 * </p>
 * <p>
 * {function} 関数の完了を受け取るコールバック関数です。onNew相当のコールバック関数が呼び出されます。
 * </p>
 * <p>
 * {Generator} yieldコールを行う場合にGeneratorを指定します。
 * </p>
 * @return {mbedJS.LM75B}
 * 生成したインスタンスを返します。
 * @example //Callback
 * @example //Generator
 * @example //Callback hell
 */
var CLASS=function LM75B(i_parent,i_params,i_handler)
{
	try{
		var _t=this;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		MI.assertInt(i_params);		
		//パラメータ退避
		_t._i2c_addr=i_params[0];
		//i2cが準備できたら実行する関数
		function _onNew()
		{
			//control command
			_t._i2c.write(_t._i2c_addr,[0x01,0x00],false,
			function(){
				if(cb){cb();}
				else if(_t._gen){_t._gen.next(_t);}
			});
		}
		//MCUかI2Cか調べる
		if(i_parent.RPC_NS!=NS.I2C.prototype.RPC_NS){
			_t._i2c_attached=true;
			_t._i2c=new NS.I2C(i_parent,[i_params[1],i_params[2]],function(){
				_t._i2c.frequency(10000,function(){
					_onNew();
				});
			});
		}else{
			//I2Cならそのまんま使う
			_t._i2c=i_parent;
			_onNew();
		}
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
	_i2c:null,
	/** @private*/
	_i2c_addr:0,
	/** @private*/
	_i2c_attached:false,
	/**
	 * コンストラクタでi_handlerにGeneratorを指定した場合のみ使用できます。
	 * yieldと併用してコンストラクタの完了を待ちます。
	 * @name mbedJS.LM75B#waitForNew
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
	 * @name mbedJS.LM75B#read
	 * @function
	 * @param {function(return)} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時はコンストラクタに指定した共通イベントハンドラが呼び出されます。
	 * @return {float}
	 * センサから取得した値です。
	 * 戻り値は、コールバック関数、共通コールバック関数、又はyield　returnの何れかで返します。
	 */	
	read:function LM75B_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;			
			_t._i2c.write(_t._i2c_addr,[0x00],true,function(){
				_t._i2c.read(_t._i2c_addr,2,false,function(v){
					var ret = ((v.data[0]<<8)|v.data[1])/256.0;
					if(cb){cb(ret);}
					else if(_t._gen){_t._gen.next(ret);}
					 _t._lc=null;
				});
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * インスタンスの確保しているオブジェクトを破棄します。
	 * 関数の完了時にonDispose,又はコールバック関数でイベントを通知します。
	 * コンストラクタでGeneratorを指定した場合、yieldと併用して完了を待機できます。
	 * @name mbedJS.LM75B#dispose
	 * @function
	 * @param {function()} i_callback
	 * 省略可能です。関数の完了通知を受け取るコールバック関数を指定します。関数の引数には、return値が入ります。
	 * 省略時は、コンストラクタに指定した共通イベントハンドラが呼び出されます。
	 */	
	dispose:function LM75B_dispose()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onDispose);
			MI._assertYield.call(_t);
			//自己生成したI2Cの場合のみ削除
			if(_t._i2c_attached){
				_t._i2c.dispose(function(v){
					if(cb){cb(v);}
					else if(_t._gen){_t._gen.next(v);}
				});
			}
		}catch(e){
			throw new MI.MiMicException(e);
		}
	}
}
NS.LM75B=CLASS;
}());
