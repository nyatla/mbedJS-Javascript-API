/**
 * @fileOverview I2CSlaveクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * I2CSlaveクラスです。
 * <a href="https://mbed.org/handbook/I2CSlave">mbed::I2CSlave</a>と同等の機能を持ちます。
 * @constructor
 * @name mbedJS.I2CSlave
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {[PinName,PinName]} i_params
 * i2Cバスを構成するピンIDを指定します。sda,sclの順番です。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onFrequency:function() -
 * frequency関数が完了したときに呼び出されます。
 * </li>
 * <li>onRead:function(ret,data) -
 * read関数が完了したときに呼び出されます。
 * <ul>
 * <li>ret:int - 成功/失敗フラグを返します。read.1とread.2の場合で意味が異なります。
 * read.1の場合、 0:ACK(成功),1:NACK(失敗)です。read.2の場合、読みだした値です。</li>
 * <li>data:byte[] - 読みだしたデータの配列です。read.1の場合のみ有効です。</li>
 * </ul> 
 * </li>
 * <li>onWrite:function(ret) -
 * write関数が完了したときに呼び出されます。
 * <ul>
 * <li>ret:int - 成功/失敗フラグを返します。write.1とwrite.2の場合で意味が異なります。
 * write.1の場合、ACK:0(成功),NACK:それ以外です。write.2の場合、ACKを受信すると1を返します。</li>
 * </ul> 
 * </li>
 * <li>onReceive:function(v) -
 * receive関数が完了したときに呼び出されます。
 * <li>v:int - 受信ステータス値を返します。mbedJS.I2CSlave#RxStatusの値です。</li>
 * </ul> 
 * </li>
 * <li>onStop:function() -
 * stop関数が完了したときに呼び出されます。
 * </li>
 * <li>onAddress:function() -
 * address関数が完了したときに呼び出されます。
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.I2CSlave}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var i2c=new mbedJS.I2CSlave(mcu,[mbedJS.PinName.p28,mbedJS.PinName.p27],{
 *     onNew:function(){
 *       i2c.frequency(100000);
 *     },
 *     onFrequency:function()
 *     {
 *       i2c.address(1);
 *     },
 *     onAddress:function()
 *     {
 *       i2c.receive();
 *     },
 *     onReceive:function(){
 *       st=0;
 *       i2c.write(1);
 *     },
 *     onWrite:function(v){
 *       if(st==0){
 *         i2c.write([1,2,3]);
 *         st++;
 *       }else{
 *         i2c.read();
 *         st=0;
 *       }
 *     },
 *     onRead:function(v){
 *       if(st==0){
 *         i2c.read(2,false);
 *         st++;
 *       }else{
 *         log("[PASS]onRead:"+v.ret+":"+v.data);
 *         i2c.stop();
 *       }
 *       },
 *     onStop:function(){
 *       mcu.close();
 *     }
 *     });
 *   },
 *   onClose:function(){
 *   },
 *   onError:function(){
 *     alert("Error");
 *   }
 * });
 * @example //Generator
 * var g=function*(){
 * try{
 * 	var v;
 * 	var mcu=new mbedJS.Mcu("192.168.128.39",g);
 * 	yield mcu.waitForNew();
 * 	var i2c=new mbedJS.I2CSlave(mcu,[mbedJS.PinName.p28,mbedJS.PinName.p27],g);
 * 	yield i2c.waitForNew();
 * 	yield i2c.frequency(100000);
 * 	yield i2c.address(1);
 * 	v=yield i2c.receive();
 * 	v=yield i2c.write(1);
 * 	v=yield i2c.write([1,2,3]);
 * 	v=yield i2c.read();
 * 	v=yield i2c.read(2,false);
 * 	log("[PASS]onRead:"+v.ret+":"+v.data);
 * 	yield i2c.stop();
 * 	yield mcu.close();
 * }catch(e){
 * 	mcu.shutdown();
 * 	alert(e);
 * 	throw e;
 * }
 * }();
 * g.next();
 * return;
 */
var CLASS=function I2CSlave(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		MI.assertInt(i_params);
		_t._mcu.rpc(_t.RPC_NS+":_new1",i_params[0]+","+i_params[1],
			function(j)
			{
				_t._oid=j.result[0];
				if(cb){cb();}
				if(_t._gen){_t._gen.next(_t);}
				_t._lc=null;
			}
		);
	}catch(e){
		throw new MI.MiMicException(e);
	}	
}
/**
 * mbedJS.Serial#receiveの戻り値の種類です。
 * NoData,ReadAddressed,WriteGeneral,WriteAddressedがあります。
 * @name mbedJS.I2CSlave#RxStatus
 */
CLASS.RxStatus={
	NoData:0,ReadAddressed:1,WriteGeneral:2,WriteAddressed:3
}
CLASS.prototype={
	/** @private */
	RPC_NS:"mbedJS:I2CSlave",
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	/** @private リモートインスタンスのオブジェクトIDです。*/
	_oid:null,
	/**
	 * Generatorモードのときに使用する関数です。
	 * Generatorモードの時は、yieldと併用してnew I2CSlave()の完了を待ちます。
	 * @name mbedJS.I2CSlave#waitForNew
	 * @function
	 */
	waitForNew:function I2CSlave_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * I2CSlaveのアドレスを設定します。
	 * 関数の完了時にonAddressイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.I2CSlave#address
	 * @function
	 * @param {int} i_value
	 * 8ビットのアドレス値です。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	address:function I2CSlave_address(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onAddress);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":address",_t._oid+","+i_value,
				function(j){
					if(cb){cb();}
					if(_t._gen){_t._gen.next();}
					 _t._lc=null;
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},	
	/**
	 * Hz単位でバスの速度を指定します。
	 * 関数の完了時にonFrequencyイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.I2CSlave#frequency
	 * @function
	 * @param {int} i_hz
	 * Hz単位のバス速度です。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	frequency:function I2CSlave_frequency(i_hz)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onFrequency);
			MI._assertYield.call(_t);
			_t._lc=CLASS.frequency;
			MI.assertInt(i_hz);
			return _t._mcu.rpc(_t.RPC_NS+":frequency",_t._oid+","+i_hz,
				function (j)
				{
					if(cb){cb();}
					if(_t._gen){_t._gen.next();}
					 _t._lc=null;
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * 引数が2個の場合
	 * @name mbedJS.I2CSlave#read:1
	 * @function
	 * @param {int} length
	 * 読み出すデータの長さです。256未満の値を指定してください。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return {HashMap}
	 * {ret:int,data:[byte]}
	 * Generatorの場合は戻り値オブジェクトを返します。
	 * <ul>
	 * <li>ret:int - 成功フラグ 0:ACK(成功),1:NACK(失敗)</li>
	 * <li>data:byte[] - 読みだしたデータ</li>
	 * </ul>
	 */
	/**
	 * 引数が0個の場合
	 * @name mbedJS.I2CSlave#read:2
	 * @function
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return {int}
	 * Generatorモードの時は読みだした値を返します。
	 */
	/**
	 * バスから値を読み出します。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.I2CSlave#read
	 * @function
	 * @param ...
	 * 詳細はmbedJS.I2CSlave#read:Nを参照してください。
	 */	
	read:function I2CSlave_read(/*...*/)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			function rcb(j){
				var v=j.result.length>1?{ret:j.result[0],data:MI.bstr2byteArray(j.result[1])}:j.result[0];
				if(cb){cb(v);}
				if(_t._gen){_t._gen.next(v);}
				 _t._lc=null;
			}
			if(MI._getBaseArgsLen(arguments)==0){
				return _t._mcu.rpc(_t.RPC_NS+":read2",_t._oid,rcb);
			}else{
				MI.assertInt(arguments[0]);
				return _t._mcu.rpc(_t.RPC_NS+":read1",_t._oid+","+arguments[0],rcb);
			}
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * I2CSlaveバスを開始状態にします。
	 * 関数の完了時にonReceiveイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.I2CSlave#receive
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時は受信ステータス値を返します。mbedJS.I2CSlave#RxStatusの値です。
	 */
	receive:function I2CSlave_receive()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onReceive);
			MI._assertYield.call(_t);
			_t._lc=CLASS.start;			
			return _t._mcu.rpc(_t.RPC_NS+":receive",_t._oid,
				function (j)
				{
					var v=j.result[0];
					if(cb){cb(v);}
					if(_t._gen){_t._gen.next(v);}
					 _t._lc=null;
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * 引数が1個(byte array)の場合
	 * @name mbedJS.I2CSlave#write:1
	 * @function
	 * @param {byte[]} data
	 * 送信するデータを格納したバイト配列です。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return {int}
	 * Generatorモードの時は成功/失敗フラグを返します。ACK:0(成功),NACK:それ以外です。
	 */
	/**
	 * 引数が1個(int)の場合
	 * @name mbedJS.I2CSlave#write:2
	 * @function
	 * @param {int} data
	 * 送信データを指定します。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return {int}
	 * Generatorモードの時は成功/失敗フラグを返します。ACKを受信すると1を返します。
	 */	
	/**
	 * バスに値を書き込みます。
	 * 関数の完了時にonWriteイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.I2CSlave#write
	 * @function
	 * @param ...
	 * 詳細はmbedJS.I2CSlave#write:Nを参照してください。
	 */	
	write:function I2CSlave_write(/*...*/)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onWrite);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write;
			function rcb(j){
				var v=j.result[0];
				if(cb){cb(v);}
				if(_t._gen){_t._gen.next(v);}
				 _t._lc=null;
			}
			if(!MI.isArray(arguments[0])){
				MI.assertInt(arguments[0]);
				return _t._mcu.rpc(_t.RPC_NS+":write2",_t._oid+","+arguments[0],rcb);
			}else{
				var a=arguments;
				return _t._mcu.rpc(_t.RPC_NS+":write1",_t._oid+",\""+MI.byteArray2bstr(a[0])+"\"",rcb);
			}
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * I2CSlaveを受信状態に戻します。
	 * 関数の完了時にonStopイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.I2CSlave#stop
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	stop:function I2CSlave_stop()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onStop);
			MI._assertYield.call(_t);
			_t._lc=CLASS.stop;			
			return _t._mcu.rpc(_t.RPC_NS+":stop",_t._oid,
				function (j)
				{
					if(cb){cb();}
					if(_t._gen){_t._gen.next();}
					 _t._lc=null;
				}
			);
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.I2CSlave#dispose
	 * @function
	 */
	dispose:function IC2Slave_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}
	
}
NS.I2CSlave=CLASS;
}());