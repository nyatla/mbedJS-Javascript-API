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
 * mbedJS.I2Cの場合はI2Cアドレスを指定します。mbedJS.MCUの場合はI2C address,sda,sclの順番で指定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onRead:function(v) -
 * getRead関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:float - 戻り値です。</li>
 * 	</ul>
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * {function} コールバック関数を指定した場合、RPCが完了したときにonNew相当のコールバック関数が呼び出されます。
 * メンバ関数のイベントハンドラは個別に設定してください。
 * </p>
 * @return {mbedJS.LM75B}
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
	_i2c:null,
	_i2c_addr:0,
	_i2c_attached:false,
	/**
	 * Generatorモードのときに使用する関数です。
	 * Generatorモードの時は、yieldと併用してnew LM75B()の完了を待ちます。
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
	 * read相当の関数です。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.LM75B#read
	 * @function
	 * @return　{int}
	 * Generatorモードの時はonReadコールバック引数の値を返します。
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
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.LM75B#dispose
	 * @function
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
