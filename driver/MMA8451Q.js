/**
 * @fileOverview AnalogInクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

function toInt14(i_v){
    var t = (i_v[0] << 6) | (i_v[1] >> 2);
    if (t > 16383/2){
    	t -= 16383;
    }
    return t;
}
/**
 * MMA8451Qを制御するクラスです。
 * <a href="https://mbed.org/users/emilmont/code/MMA8451Q/">mbed::MMA8451Q</a>と同等の機能を持ちます。
 * @constructor
 * @name mbedJS.MMA8451Q
 * @param {mbedJS.I2C|mbedJS.MCU} i_parent
 * インスタンスをバインドするオブジェクトです。MCUの場合はI2Cバスを占有します。
 * @param {addr:int]|[addr:int,sda:PinName,scl:PinName]} i_params
 * mbedJS.I2Cの場合はI2Cアドレスを指定します。mbedJS.MCUの場合はI2C address,sda,sclの順番で指定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onGetWhoAmI:function(v) -
 * getWhoAmI関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 戻り値です。</li>
 * 	</ul>
 * </li>
 * <li>onGetAccX:function(v) -
 * getAccX関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:float</li>
 * 	</ul>
 * </li>
 * <li>onGetAccY:function(v) -
 * getAccY関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:float</li>
 * 	</ul>
 * </li>
 * <li>onGetAccZ:function(v) -
 * getAccZ関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:float</li>
 * 	</ul>
 * </li>
 * <li>getAccAllAxis:function(x,y,z) -
 * getAccAllAxis関数のコールバック関数です。
 * 	<ul>
 * 		<li>x:int</li>
 * 		<li>y:int</li>
 * 		<li>z:int</li>
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
 * @return {mbedJS.MMA8451Q}
 * @example //Callback
 * @example //Generator
 * @example //Callback hell
 */
var CLASS=function MMA8451Q(i_parent,i_params,i_handler)
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
			_t._i2c.write(_t._i2c_addr,[0x2a,0x01],1,false,
			function(){
				if(cb){cb();}
				else if(_t._gen){_t._gen.next(_t);}
			});
		}
		//MCUかI2Cか調べる
		if(i_parent.RPC_NS!=NS.I2C.RPC_NS){
			_t._i2c=new NS.I2C(i_parent,[i_params[1],i_params[2]],function(){
				_t._i2c.frequency(100000,function(){
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
	/** @private */
	RPC_NS:"mbedJS:MMA8451Q",
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	_i2c:null,
	_i2c_addr:0,
	/**
	 * Generatorモードのときに使用する関数です。
	 * Generatorモードの時は、yieldと併用してnew MMA8451Q()の完了を待ちます。
	 * @name mbedJS.MMA8451Q#waitForNew
	 * @function
	 */
	waitForNew:function MMA8451Q_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * getWhoAmI相当の関数です。
	 * 関数の完了時にonGetWhoAmIイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA8451Q#getWhoAmI
	 * @function
	 * @return　{int}
	 * Generatorモードの時はonGetWhoAmIコールバック引数の値を返します。
	 */	
	getWhoAmI:function MMA8451Q_getWhoAmI()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onGetWhoAmI);
			MI._assertYield.call(_t);
			_t._lc=CLASS.getWhoAmI;			
			_t._i2c.write(_t._i2c_addr,[0x0d],1,function(v){
				if(cb){cb(v);}
				else if(_t._gen){_t._gen.next(v);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * @private
	 */	
	_getXX:function MMA8451Q__getXX(i_reg,i_lc,i_cb)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			_t._lc=i_lc;
			_t._i2c.write(_t._i2c_addr,[i_reg],1,true,function(){
				_t._i2c.read(_t._i2c_addr,2,false,function(v){
					var ax=toInt14(v);
					if(i_cb){i_cb(ax);}
					else if(_t._gen){_t._gen.next(ax);}
					 _t._lc=null;
				})
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}		
	},
	/**
	 * getAccX相当の関数です。
	 * 関数の完了時にonGetAccXイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA8451Q#getAccX
	 * @function
	 * @return　{float}
	 * Generatorモードの時はonGetAccXコールバック引数の値を返します。
	 */	
	getAccX:function MMA8451Q_getAccX()
	{	
		this._getXX(0x01,CLASS.getAccX,MI._getCb(arguments,this._event.onGetAccX));
	},
	/**
	 * getAccY相当の関数です。
	 * 関数の完了時にonGetAccYイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA8451Q#getAccY
	 * @function
	 * @return　{float}
	 * Generatorモードの時はonGetAccYコールバック引数の値を返します。
	 */
	getAccY:function MMA8451Q_getAccY()
	{
		this._getXX(0x03,CLASS.getAccX,MI._getCb(arguments,this._event.onGetAccY));
	},
	/**
	 * getAccZ相当の関数です。
	 * 関数の完了時にonGetAccZイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA8451Q#getAccZ
	 * @function
	 * @return　{float}
	 * Generatorモードの時はonGetAccZコールバック引数の値を返します。
	 */
	getAccZ:function MMA8451Q_getAccZ()
	{
		this._getXX(0x05,CLASS.getAccX,MI._getCb(arguments,this._event.onGetAccZ));
	},
	/**
	 * getAccAllAxis相当の関数です。
	 * 関数の完了時にonGetAccAllAxisイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.MMA8451Q#getAccAllAxis
	 * @function
	 * @return　{HashMap}
	 * Generatorモードの時はonGetAccAllAxisコールバックの引数の値を返します。
	 */
	getAccAllAxis:function MMA8451Q_getAccAllAxis()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onGetAccAllAxis);
			MI._assertYield.call(_t);
			_t._getXX(0x01,CLASS.getAccAllAxis,function(vax){
				_t._getXX(0x03,CLASS.getAccAllAxis,function(vay){
					_t._getXX(0x05,CLASS.getAccAllAxis,function(vaz){
						var ret={x:vax,y:vay,z:vaz};
						if(cb){cb(ret);}
						else if(_t._gen){_t._gen.next(ret);}
					});
				});
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}

	},
	/**
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.MMA8451Q#dispose
	 * @function
	 */
	dispose:function MMA8451Q_dispose()
	{
		var _t=this;
		//自己生成したI2Cの場合のみ削除
		alert("NotImplement!");	
	}
}
NS.MMA8451Q=CLASS;
}());
