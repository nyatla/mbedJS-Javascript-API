/**
 * @fileOverview Memoryクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * Memoryクラスです。
 * <a href="https://mbed.org/handbook/Memory">mbed::Memory</a>と同等の機能を持ちます。
 * @name mbedJS.Memory
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onRead:function(v) -
 * read関数が完了した時に呼び出されます。
 * 	<ul>
 * 		<li>{byte[]} v - 読みだしたバイト値を格納した配列です。</li>
 * 	</ul>
 * </li>
 * <li>onRead32:function(v) -
 * read32関数が完了した時に呼び出されます。
 * 	<ul>
 * 		<li>v:int[] - 読みだしたuint32値を格納した配列です。</li>
 * 	</ul>
 * </li>
 * <li>onWrite:function() -
 * write関数が完了した時に呼び出されます。
 * </li>
 * <li>onWrite32:function() -
 * write32関数が完了した時に呼び出されます。
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.Memory}
 * @example //Callback
 * var s=0;
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var mem=new mbedJS.Memory(mcu,{
 *     onNew:function(){
 *       s=0;
 *       mem.write(0x20080000,1);
 *     },
 *     onWrite:function(){
 *       log("[PASS]onWrite:"+s);
 *       switch(s){
 *       case 0:
 *         mem.read(0x20080000,1);
 *         break;
 *       case 1:
 *         mem.read(0x20080001,1);
 *         break;
 *       case 2:
 *         mem.read(0x20080000,8);
 *         break;
 *       }
 *     },
 *     onRead:function(v){
 *       log("[PASS]onRead:"+s);
 *       switch(s){
 *       case 0:
 *         mem.write(0x20080001,[2]);
 *         break;
 *       case 1:
 *         mem.write(0x20080004,[10,20,30]);
 *         break;
 *       case 2:
 *         mem.write32(0x20080000,0xff);
 *         s=-1;
 *       }
 *       s++;
 *     },
 *     onWrite32:function(){
 *       log("[PASS]onWrite32:"+s);
 *       switch(s){
 *       case 0:
 *         mem.read32(0x20080000);
 *         break;
 *       case 1:
 *         mem.read32(0x20080004,4);
 *         break;
 *       case 2:
 *         mem.read32(0x20080000,16);
 *         break;
 *       }
 *     },
 *     onRead32:function(v){
 *       log("[PASS]onRead32:"+s);
 *       switch(s){
 *       case 0:
 *         mem.write32(0x20080004,[2]);
 *         break;
 *       case 1:
 *         mem.write32(0x20080004,[10,20,30]);
 *         break;
 *       case 2:
 *         mcu.close();
 *       }
 *       s++;
 *     }      
 *     });
 *   },
 *   onClose:function(){
 *     log("[PASS]onClose");
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
 * 	var mem=new mbedJS.Memory(mcu,g);
 * 	yield mem.waitForNew();
 * 	yield mem.write(0x20080000,1);
 * 	log("[PASS]onWrite:");
 * 	v=yield mem.read(0x20080000,1);
 * 	log("[PASS]onRead:"+v);
 * 	v=yield mem.read(0x20080001,1);
 * 	log("[PASS]onRead:"+v);
 * 	v=yield mem.read(0x20080000,8);
 * 	log("[PASS]onRead:"+v);
 * 	yield mem.write(0x20080001,[2]);
 * 	log("[PASS]onWrite:");
 * 	yield mem.write(0x20080004,[10,20,30]);
 * 	log("[PASS]onWrite:");
 * 	yield mem.write32(0x20080000,0xff);
 * 	log("[PASS]onWrite32:");
 * 	v=yield mem.read32(0x20080000);
 * 	log("[PASS]onRead32:"+v);
 * 	v=yield mem.read32(0x20080004,4);
 * 	log("[PASS]onRead32:"+v);
 * 	v=yield mem.read32(0x20080000,16);
 * 	log("[PASS]onRead32:"+v);
 * 	yield mem.write32(0x20080004,[2]);
 * 	log("[PASS]onWrite32:");
 * 	yield mem.write32(0x20080004,[10,20,30]);
 * 	log("[PASS]onWrite32:");
 * 	mcu.close();
 * 	}catch(e){
 * 	mcu.shutdown();
 * 	alert(e);
 * 	throw e;
 * }
 * }();
 * g.next();
 */
var CLASS=function Memory(i_mcu,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		_t._mcu.rpc(_t.RPC_NS+":init","",
			function(j)
			{
				if(cb){cb();}
				if(_t._gen){_t._gen.next(_t);}
				_t._lc=null;
			}
		);
	}catch(e){
		throw new MI.MiMicException(e);
	}
}
CLASS.prototype=
{
	/** @private */
	RPC_NS:"MiMic:Memory",
	/** @private 最後にコールしたAPIです。*/
	_lc:null,
	/** @private Generatorモードの場合にGeneratorオブジェクトを保持します。*/
	_gen:null,
	/** @private コールバック関数の連想配列です。要素はコンストラクタを参照してください。*/
	_event:{},
	/**
	 * Generatorモードのときに使用する関数です。
	 * Generatorモードの時は、yieldと併用してnew Memory()の完了を待ちます。
	 * @name mbedJS.Memory#waitForNew
	 * @function
	 */
	waitForNew:function Memory_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * 1バイト単位でメモリから読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Memory#read
	 * @function
	 * @param {int} i_addr
	 * メモリアドレス
	 * @param {int} i_size
	 * (Optional) 読出しサイズです。省略時は1です。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int[]}
	 * Generatorモードの時はメモリ値を格納した配列を返します。
	 */
	read:function Memory_read(i_addr,i_size)
	{
		//read(i_addr)
		//read(i_addr,i_len)
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			var a=[i_addr,(MI._getBaseArgsLen(arguments)==1)?i_size:1];
			MI.assertInt(a);
			return _t._mcu.rpc(_t.RPC_NS+":read",a[0]+","+a[1],
			function (j)
			{
				var v=MI.bstr2byteArray(j.result[0]);
				if(cb){cb(v);}
				if(_t._gen){_t._gen.next(v);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * 1バイトをメモリへ書き込みます。
	 * 関数の完了時にonWriteイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Memory#write
	 * @function
	 * @param {int} i_addr
	 * 書き込み先のメモリアドレスを指定します。
	 * @param {int|int[]} i_v
	 * 書き込むbyte配列、または数値を指定します。
	 * 数値の場合は1バイトを書き込みます。最大長さは200byteくらいです。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write:function Memory_write(i_addr,i_v)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onWrite);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write;
			MI.assertInt(i_addr);
			MI.assertInt(i_v);
			return _t._mcu.rpc(_t.RPC_NS+":write",i_addr+",\""+MI.byteArray2bstr(i_v)+"\"",
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
	 * 4バイト単位でメモリから読み込みます。
	 * 関数の完了時にonRead32イベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Memory#read32
	 * @function
	 * @param {int} i_addr
	 * メモリアドレス
	 * @param {int} i_size
	 * (Optional) 読出しサイズです。省略時は4です。4の倍数を指定してください。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int[]}
	 * Generatorモードの時はメモリ値を格納した配列を返します。
	 */
	read32:function Memory_read32(i_addr,i_size)
	{
		//read(i_addr)
		//read(i_addr,i_len)
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead32);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read32;
			
			var a=[i_addr,(MI._getBaseArgsLen(arguments)==1)?4:i_size];
			if(a[1]%4!=0){
				throw new MI.MiMicException(MI.Error.NG_INVALID_ARG);
			}
			MI.assertInt(a);
			return _t._mcu.rpc(_t.RPC_NS+":read",a[0]+","+a[1],
				function (j)
				{
					var v=MI.bstr2uintArray(j.result[0]);
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
	 * 32bit unsigned intをメモリへ書き込みます。
	 * 関数の完了時にonWrite32イベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Memory#write32
	 * @function
	 * @param {int} i_addr
	 * 書き込み先のメモリアドレスを指定します。
	 * @param {int|int[]} i_v
	 * 書き込むbyte配列、または数値を指定します。
	 * 数値の場合は1バイトを書き込みます。最大長さは200byteくらいです。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write32:function Memory_write32(i_addr,i_v)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onWrite32);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write32;
			MI.assertInt(i_addr);
			MI.assertInt(i_v);
			return _t._mcu.rpc(_t.RPC_NS+":write",i_addr+",\""+MI.uintArray2bstr(i_v)+"\"",
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
	}
}
NS.Memory=CLASS;
}());