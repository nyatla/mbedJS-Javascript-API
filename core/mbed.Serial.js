/**
 * @fileOverview AnalogInクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * Serialクラスです。
 * <a href="https://mbed.org/handbook/Serial">mbed::Serial</a>と同等の機能を持ちます。
 * @constructor
 * @name mbedJS.Serial
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {[PinName,PinName]} i_params
 * UARTを構成する２本のピンを指定します。tx,rxの順で設定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onFormat:function() -
 * format関数が完了したときに呼び出されます。
 * </li>
 * <li>onReadable:function(v) -
 * read関数が完了したときに呼び出されます。
 * 	<ul>
 * 		<li>v:boolean - 読出しが可能化の真偽値です。</li>
 * 	</ul>
 * </li>
 * <li>onWriteable:function(v) -
 * write関数が完了したときに呼び出されます。
 * 	<ul>
 * 		<li>v:boolean - 書き込みが可能化の真偽値です。</li>
 * 	</ul>
 * </li>
 * <li>onSend_break:function() -
 * send_break関数が完了したときに呼び出されます。
 * </li>
 * <li>onPutc:function(v) -
 * putc関数が完了したときに呼び出されます。
 * 	<ul>
 * 		<li>v:int - 謎の戻り値です。</li>
 * 	</ul>
 * </li>
 * <li>onPuts:function(v) -
 * puts関数が完了したときに呼び出されます。
 * 	<ul>
 * 		<li>v:int - 謎の戻り値です。</li>
 * 	</ul>
 * </li>
 * <li>onGetc:function(v) -
 * getc関数が完了したときに呼び出されます。
 * 	<ul>
 * 		<li>v:int - 読みだした1バイトの値です。</li>
 * 	</ul>
 * </li>
 * <li>onGets:function(v) -
 * gets関数が完了したときに呼び出されます。
 * 	<ul>
 * 		<li>v:string|byte[] - 読みだした文字列、又はbyte配列です。値はmodeパラメータで変わります。</li>
 * 	</ul>
 * </li>
 * <li>onBaud:function() -
 * baud関数が完了したときに呼び出されます。
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.Serial}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var uart=new mbedJS.Serial(mcu,[mbedJS.PinName.p9,mbedJS.PinName.p10],{
 *     onNew:function(){
 *       uart.baud(115200);
 *     },
 *     onBaud:function()
 *     {
 *       uart.send_break();
 *     },
 *     onSend_break:function(){
 *       uart.format(8,uart.Parity.None,1);
 *     },
 *     onFormat:function(){
 *       uart.readable();
 *     },
 *     onReadable:function(v){
 *       uart.writeable();
 *     },
 *     onWriteable:function(v){
 *       uart.putc(32);
 *     },
 *     onPutc:function(v){
 *       uart.getc();
 *     },
 *     onGetc:function(v){
 *       uart.puts("1234");
 *     },
 *     onPuts:function(v){
 *       uart.gets(5);
 *     },
 *     onGets:function(v){
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
 *   var v;
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var uart=new mbedJS.Serial(mcu,[mbedJS.PinName.p9,mbedJS.PinName.p10],g);
 *   yield uart.waitForNew();
 *   yield uart.baud(115200);
 *   yield uart.send_break();
 *   yield uart.format(8,uart.Parity.None,1);
 *   v=yield uart.readable();
 *   v=yield uart.writeable();
 *   v=yield uart.putc(32);
 *   v=yield uart.getc();
 *   v=yield uart.puts("1234");
 *   v=yield uart.gets(5);
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 *   alert(e);
 *   throw e;
 * }
 * }();
 * g.next();
 */
var CLASS=function Serial(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		var cb;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		//ハンドラの初期化
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
 * mbedJS.Serial#format関数に指定する値の種類です。
 * None,Odd,Even,Forced1,Forced0があります。
 * @name mbedJS.Serial#Parity
 * @field
 */
CLASS.Parity={
	None:0,Odd:1,Even:2,Forced1:3,Forced0:4
}
CLASS.prototype={
	/** @private */
	RPC_NS:"mbedJS:Serial",
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
	 * Generatorモードの時は、yieldと併用してnew AnalogIn()の完了を待ちます。
	 * @name mbedJS.Serial#waitForNew
	 * @function
	 */
	waitForNew:function Serial_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * フォーマットを設定します。
	 * 関数の完了時にonFormatイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Serial#format
	 * @function
	 * @param {int} i_bits
	 * ビット数です。省略時は8です。
	 * @param {int} i_parity
	 * パリティの値です。省略時はmbedJS.Serial#Parity.Noneです。
	 * @param {int} i_stop_bits
	 * ストップビットの値です。省略時は1です。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	format:function Serial_format(i_bits,i_parity,i_stop_bits)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onFormat);
			_t._lc=CLASS.format;
			var p=[MI.isUndefined(i_bits,8),MI.isUndefined(i_parity,CLASS.Parity.None),MI.isUndefined(i_stop_bits,1)];
			MI.assertInt(p);
			return _t._mcu.rpc(_t.RPC_NS+":format",_t._oid+","+p[0]+","+p[1]+","+p[2],
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
	 * 読出し可能かを返します。
	 * 関数の完了時にonReadableイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Serial#readable
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{boolean}
	 * Generatorモードの時は状態値の真偽値を返します。
	 */
	readable:function Serial_readable()
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onReadable);
			_t._lc=CLASS.readable;
			return _t._mcu.rpc(_t.RPC_NS+":readable",_t._oid,
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
	 * 書き込み可能かを返します。
	 * 関数の完了時にonWriteableイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Serial#writeable
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{boolean}
	 * Generatorモードの時は状態値の真偽値を返します。
	 */
	writeable:function Serial_writeable()
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onWriteable);
			_t._lc=CLASS.writeable;			
			return _t._mcu.rpc(_t.RPC_NS+":writeable",_t._oid,
				function (j)
				{
					var v=j.result[0]?true:false;
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
	 * ブレーク信号を送信します。
	 * 関数の完了時にonSend_breakイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Serial#send_break
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	send_break:function Serial_send_break()
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onSend_break);
			_t._lc=CLASS.send_break;
			return _t._mcu.rpc(_t.RPC_NS+":send_break",_t._oid,
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
	 * 1バイトの値を出力します。
	 * 関数の完了時にonPutcイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Serial#putc
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時は謎の値を返します。
	 */
	putc:function Serial_putc(i_c)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onPutc);
			_t._lc=CLASS.putc;
			MI.assertInt(i_c);
			return _t._mcu.rpc(_t.RPC_NS+":putc",_t._oid+","+i_c,
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
	 * 文字列を出力します。
	 * 関数の完了時にonPutsイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Serial#puts
	 * @function
	 * @param {string|byte[]}
	 * 文字列の時はstring,バイナリの時はバイト配列を指定します。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時は謎の値を返します。
	 */
	puts:function Serial_puts(i_s)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onPuts);
			_t._lc=CLASS.puts;
			//i_sの型チェック
			var s;
			var method;
			if(MI.isArray(i_s)){
				method=":puts_2";
				s=MI.byteArray2bstr(i_s);
			}else{
				method=":puts";
				s=i_s;
			}
			return _t._mcu.rpc(_t.RPC_NS+method,_t._oid+",\""+s+"\"",
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
	 * 1バイトを読み込みます。
	 * 関数の完了時にonGetcイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Serial#getc
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時は受信した数値を返します。
	 */
	getc:function Serial_getc()
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onGetc);
			_t._lc=CLASS.getc;
			return _t._mcu.rpc(_t.RPC_NS+":getc",_t._oid,
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
	 * 文字列を読み込みます。
	 * 関数の完了時にonGetsイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Serial#gets
	 * @function
	 * @param {int} i_len
	 * 受信メモリのサイズを指定します。256未満を指定してください。
	 * @param {int} i_mode
	 * 受信モードを指定します。'b'を指定した場合、バイナリで受信します。
	 * 省略が可能です。省略時はテキストで受信します。
	 * このパラメタは戻り値に影響します。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{string|byte[]}
	 * Generatorモードの時は受信した文字列、またはbyte配列を返します。
	 */
	gets:function Serial_gets(i_len,i_mode)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onGets);
			_t._lc=CLASS.gets;
			MI.assertInt(i_len);
			var m=0;//ascii
			if(MI._getBaseArgsLen(arguments)==2 && i_mode=='b'){
				m=1;//binary
			}
			return _t._mcu.rpc(_t.RPC_NS+(m==0?':gets':':gets_2'),_t._oid+","+i_len,
				function (j)
				{
					var v=j.result[0];
					if(m!=0){
						//バイナリの場合(1)の場合は変換
						v=MI.bstr2byteArray(v);
					}
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
	 * ボーレイトを設定します。
	 * 関数の完了時にonBaudイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Serial#baud
	 * @function
	 * @param {int} i_baudrate
	 * ボーレイトの値です。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	baud:function Serial_baud(i_baudrate)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onBaud);
			_t._lc=CLASS.baud;
			MI.assertInt(i_baudrate);			
			return _t._mcu.rpc(_t.RPC_NS+":baud",_t._oid+","+i_baudrate,
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
	 * @name mbedJS.Serial#dispose
	 * @function
	 */
	dispose:function Serial_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}
}
NS.Serial=CLASS;
}());