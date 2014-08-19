/**
 * @fileOverview 低レベルAPIを定義する。低レベルAPIは、MiMicRemoteMcuをインストールしたMCUとの通信クラスを提供する。
 */

/**
 * MiMicネームスペース
 * @namespace
 */
var MiMicJS={};
(function(){
	var NS=MiMicJS;
	/**
	 * MiMicJsAPIのバージョン文字列。
	 * @name MiMicJS#VERSION
	 */
	NS.VERSION="MiMicJsAPI/2.0.4";
	/**
	 * 配列要素、又は値がすべてInt値でない場合に例外を起こします。
	 * @name MiMicJS.assertInt
	 * @function
	 * @param {[array]} v
	 * テストする配列
	 */
	NS.assertInt=function assertInt(v){
		if(!NS.isArray(v)){
			if(!NS.isInt(v)){throw new NS.MiMicException();}
		}
		for(var i=0;i<v.length;i++){
			if(NS.isInt(v[i])){
				continue;
			}
			throw new NS.MiMicException('"'+v[i]+'" is not integer.');
		}
	}
	/**
	 * 配列要素、、又は値がすべて数値でない場合に例外を起こします。
	 * @name MiMicJS.assertNumber
	 * @function
	 * @param {[array]} v
	 * テストする配列
	 */
	NS.assertNumber=function assertNumber(v){
		if(!NS.isArray(v)){
			if(!NS.isNumber(v)){	throw new NS.MiMicException();}
		}else{
			for(var i=0;i<v.length;i++){
				if(NS.isNumber(v[i])){
					continue;
				}
				throw new NS.MiMicException('"'+v[i]+'" is not number.');
			}
		}
	};
	/**
	 * @private
	 */
	NS.isUndefined=function(v,def){
		if(arguments.length==1){return v === void 0;}
		return (v === void 0)?def:v;
	};
	/**
	 * 数値であるかを確認します。
	 * @private
	 */
	NS.isNumber=function isNumber(o)
	{
		return (typeof o=='number');
	};
	/**
	 * 整数であるかを確認します。
	 * @private
	 */
	NS.isInt=function isInt(o)
	{
		return (typeof o=='number') && (o-Math.round(o)==0);
	};

	/**
	 * オブジェクトがジェネレータクラスであるかを返します。
	 * @private
	 */
	NS.isGenerator=function isGenerator(o)
	{
		if(!o){return false;}
		return o.toString().indexOf('Generator')!=-1;
	};
	/**
	 * オブジェクトが関数であるかを返します。
	 * @private
	 */
	NS.isFunction=function isFunction(o){
		return (typeof o == 'function');
	}
	/**
	 * @private
	 * 現在の時刻を返します。
	 */
	NS.getNow=function getNow(){
		return (new Date()).getTime();
	};
	/**
	 * @private
	 * aが配列であるかを返します。
	 */
	NS.isArray=function isArray(a){
		return a instanceof Array;
	};
	/**
	 * @private
	 * aが配列であるかを返します。
	 */
	NS.isHashArray=function isHashArray(a){
		return (!(a instanceof Array)) && (typeof a == "object");
	};	
	/**
	 * 連想配列をシャローコピーして複製します。
	 * @private
	 */	
	NS.cloneAssoc=function cloneAssoc(a)
	{
		var r={};
		for(var i in a){
			r[i]=a[i];
		}
		return r;
	};
	/**
	 * @private
	 * 桁数を指定して、int値を16進数に変換します。
	 * @param {int} i_val
	 * 変換する値
	 * @param {int} i_digit
	 * 桁数
	 * @return {string}
	 * 文字列形式の値
	 */
	NS.hexout=function hexout(i_val,i_digit)
	{
		var dt=["","0","00","000","0000","00000","000000","0000000"];
		var s=(i_val>>>0).toString(16).toLowerCase();
		if(s.length>i_digit){
			//マイナスだともれなくエラー
			throw new NS.MiMicException(EE.NG);
		}
		var l=i_digit-s.length;
		return dt[l]+s;
	};
	/**
	 * @private
	 * 連想配列を文字列にして返します。
	 */
	NS.assocToStr=function assocToStr(a)
	{
		var s="";
		for(k in a){s+=k+":"+a[k]+",";}
		return s;
	};
	/**
	 * @private
	 * 32bit値のエンディアンを交換します。
	 * @param v
	 * 交換する値
	 * @return
	 * 交換後の値
	 */
	NS.bswap32=function bswap32(v)
	{
		return ((v<<24)&0xff000000)|((v<<8)&0xff0000)|((v>>8)&0xff00)|((v>>24)&0xff);
	};
	/**
	 * @private
	 * バイナリ文字列をバイト値として配列に変換します。
	 * @param v
	 * 数値配列
	 */
	NS.bstr2byteArray=function bstr2byteArray(v)
	{
		var r=new Array();
		if(v.length%2!=0){
			throw new NS.MiMicException();			
		}
		for(var i=0;i<v.length;i+=2){
			r.push(parseInt(v.substr(i,2),16));
		}
		return r;
	};
	/**
	 * @private
	 * バイナリ文字列を32bitUInt数値配列に変換します。
	 * Uint値はLittleEndianとして解釈します。
	 * @param {int[]} v
	 * 数値配列
	 */
	NS.bstr2uintArray=function bstr2uintArray(v)
	{
		var r=new Array();
		if(v.length%8!=0){
			throw new NS.MiMicException();			
		}
		for(var i=0;i<v.length;i+=8){
			r.push(NS.bswap32(parseInt(v.substr(i,8),16)));
		}
		return r;
	};
	/**
	 * ByteArrayをBinarayStringに変換します。
	 * @name MiMicJS.byteArray2bstr
	 * @function
	 * @param v
	 * @return {String}
	 */
	NS.byteArray2bstr=function byteArray2bstr(v)
	{
		var s=NS.isArray(v)?v:[v];
		var r="";
		for(var i=0;i<s.length;i++){
			r+=NS.hexout(s[i],2,16);
		}
		return r;
	};
	/**
	 * UInt32ArrayをBinarayStringに変換します。
	 * 出力はLittleEndianの配列です。
	 * @name MiMicJS.uintArray2bstr
	 * @function
	 * @param v
	 * UInt32の配列
	 * @return {String}
	 */	
	NS.uintArray2bstr=function uintArray2bstr(v)
	{
		var s=NS.isArray(v)?v:[v];
		var r="";
		for(var i=0;i<s.length;i++){
			r+=NS.hexout(NS.bswap32(s[i]),8,16);
		}
		return r;
	};
	
	/**
	 * 連想配列の内容をルートオブジェクト直下に展開します。
	 * この関数は名前空間を汚染します。十分に注意して使用してください。
	 * @name MiMicJS.using
	 * @function
	 * @param {HashMap} v
	 * 展開する連想配列
	 * @example
	 * MiMicJS.using(mbedJS);
	 * MiMicJS.using(mbedJS.PinName);
	 */
	NS.using=function using(v)
	{
		for (var key in v) {
			window[key]=v[key];
		}
	}
	/**
	 * MiMicSDK向けの内部関数です。
	 * 末尾引数が関数の場合にはその関数を、異なる場合はi_cbを返却します。
	 * @private
	 * @param i_arg
	 * 引数配列を指定します。
	 * @param i_default_cb
	 * 引数配列に関数がなかった場合に返す値を指定します。
	 */
	NS._getCb=function _getCb(i_arg,i_default_cb)
	{
		if(i_arg.length==0){
			return i_default_cb;
		}
		return NS.isFunction(i_arg[i_arg.length-1])?i_arg[i_arg.length-1]:i_default_cb;
	}
	/**
	 * MiMicSDK向けの関数です。
	 * 末尾の拡張変数を取り除いたarguments引数の数を返します。
	 * @private
	 */
	NS._getBaseArgsLen=function _getBaseArgsLen(i_arg)
	{
		if(i_arg.length==0 || (!NS.isFunction(i_arg[i_arg.length-1]))){
			return i_arg.length;
		}
		return i_arg.length==1?0:i_arg.length-1;
	}
	
	/**
	 * MiMicSDK向けの関数です。
	 * インスタンスがyieldコール可能かをチェックし、可能ならコール関数を記録します。
	 * 関数は、インスタンスの_gen,_lcをチェックして、yieldが不可能な場合に例外を発生します。
	 * _assertYield.call(this)でコールして下さい。
	 * @private
	 */
	NS._assertYield=function _assertYield()
	{
		if(this._gen && this._lc){
			throw new NS.MiMicException(NS.Error.NG_YIELD_NOT_COMPLETED);
		}
	}
	/**
	 * MiMicSDK向けの関数です。コンストラクタでイベントハンドラをセットアップする定型処理です。
	 * i_handlerにセットされたオブジェクトに従って_gen,_eventメンバをセットします。
	 * _initHandler.call(this,i_handler)でコールして下さい。
	 * @private
	 */
	NS._initHandler=function _initHandler(i_handler)
	{
		if(NS.isGenerator(i_handler)){
			this._gen=i_handler;
		}else if(NS.isFunction(i_handler)){
			return i_handler;
		}else if(i_handler){
			this._event=i_handler;
			return i_handler.onNew;
		}
		return null;
	}
	
	
}());
	
(function(){
	var NS=MiMicJS;
	
	/**
	 * MiMicExceptionが使用するエラーコードと、その判定関数を定義する。
	 * エラーコードは、以下の形式の配列オブジェクトで表現する。
	 * <pre>
	 * [code:int,message:string]
	 * </pre>
	 * 
	 * codeは31ビットのエラーコードである。ビットフィールドの意味は以下の通りである。
	 * <table>
	 * <tr><th>bit</th><th>name</th><th>discription</th></tr>
	 * <tr><td>30</td><td>ErrorBit</td><td>Error:1,OK:0</td></tr>
	 * <tr><td>29-24</td><td>Reserved</td><td>-</td></tr>
	 * <tr><td>23-16</td><td>ModuleID</td><td>0x00:unknown<br/>0x39:MiMic<br/>0xF0-0xFF: user define<br/>Other:Reserved<br/></td></tr>
	 * <tr><td>15-8</td><td>ClassID</td><td>0x00:unknown</td></tr>
	 * <tr><td>7-0</td><td>ErrorID</td><td></td></tr>
	 * </table>
	 * @namespace
	 * @name MiMicJS.Error
	 * @example
	 * throw new MiMicException(MiMicError.NG);
	 */
	NS.Error=
	{
		/** 成功を示します。
		 * @constant
		 * @name MiMicJS.Error.OK
		 */
		OK:[0x00000000,"OK"],
		/** 詳細情報の無いエラーです。
		 * @constant
		 * @name MiMicJS.Error.NG
		 */	
		NG:[0x40000000,"NG"],
		/** Generatorを用いたコードで、前回のyieldが終了していないことを示します。
		 * @constant
		 * @name MiMicJS.Error.NG_YIELD_NOT_COMPLETED
		 */
		NG_YIELD_NOT_COMPLETED:[0x40001001,"The previous function has not been completed."],
		/** 関数の呼び出し順序が正しくないことを示します。
		 * @constant
		 * @name MiMicJS.Error.NG_ILLEGAL_CALL
		 */
		NG_ILLEGAL_CALL:[0x40001002,"Illegal procedure call."],
		/** 引数型の不一致を検出したことを示します。
		 * @constant
		 * @name MiMicJS.Error.NG_INVALID_ARG
		 */
		NG_INVALID_ARG:[0x40001003,"Invalid arguments."],
		/**
		 * エラーコードがOKか調べる。
		 * @function
		 * @name MiMicJS.Error.isOK
		 * @param {Object as [MiMicErrorCode]} v
		 * 評価するオブジェクト
		 * @return {Boolean}
		 * エラーコードでなければ、trueを返す。
		 * @example
		 * MiMicError.isOK(MiMicError.OK);//true
		 */
		isOK:function(v){
			return (0x40000000 & v)==0x00000000;
		}
	};
	
}());

(function(){
	var NS=MiMicJS;	
	/**
	 * 引数が1個のパターン。
	 * @name MiMicJS.MiMicException:2
	 * @function
	 * @param {object} e
	 * eのクラスにより、動作が異なる。
	 * <ul>
	 * <li>{string} - MiMicException(Error.NG,e)と等価である。</li>
	 * <li>{object as [MiMicErrorCode]} - エラーコードを指定して例外を生成する。エラーコードについては、MiMicJs.Errorを参照</li>
	 * <li>{object} - MiMicException(MiMicError.NG,e.toString())と等価である。objectを文字列化して例外を生成する。</li>
	 * <li>{MiMicException} - codeとmessageを継承して例外を生成する。コールスタックを生成するときは、このパターンを使うこと。</li>
	 * </ul>
	 * @example
	 * throw new MiMicException(MiMicError.NG);
	 * throw new MiMicException("Error");
	 * try{
	 * 	 throw new MiMicException("Error");
	 * }catch(e){
	 * 	 throw new MiMicException(e);
	 * }
	 */
	/**
	 * MiMic javascript APIが生成する例外クラスのコンストラクタである。関数ごとにMiMicExceptionを使ったtry-catchを導入することにより、例外発生時にスタックトレースメッセージを得ることが出来る。
	 * スタックトレースは改行で連結された文字列である。messageプロパティに格納される。alert関数で表示することで、効率的なデバックが可能である。
	 * 引数の違いにより、数種類の呼び出し方がある。
	 * @constructor
	 * @name MiMicJS.MiMicException
	 * @param ...
	 * 詳細は、MiMicException:nを参照。
	 */
	NS.MiMicException=function MiMicException(/*...*/)
	{
		var pfx;
		if(typeof arguments.callee.caller=="function"){
			 if(arguments.callee.caller.name.toString().length>0){
				pfx="function '"+arguments.callee.caller.name+'.';
			 }else{
			 	var s=arguments.callee.caller.toString();
				pfx="closure '"+s.substring(0,s.indexOf("{"))+"...'";
			 }
		}else{
			pfx="root document";
		}
		var sfx="";
		switch(arguments.length){
		case 0:
			//とりあえずexceptiion
			this.code=NS.Error.NG[0];
			this.message=pfx+" code(0x"+this.code.toString(16)+")"+NS.Error.NG[1];
			return;
		case 1:
			var v=arguments[0];
			if(v instanceof NS.MiMicException){
				//exception継承
				this.code=v.code;
				sfx="  \nfrom "+v.message;
			}else if(typeof v=="object" && v.length==2){
				//Errorコードテーブル
				this.code=v[0];
				sfx=v[1];
			}else{
				//文字列やオブジェクト
				this.code=NS.Error.NG[0];
				sfx=NS.Error.NG[1]+" "+(((typeof v)!='undefined')?v.toString():"v==undefined");
			}
			this.message=pfx+" code(0x"+this.code.toString(16)+")"+sfx;
			return;
		default:
			break;
		}
		throw new NS.MiMicException("Invalid MiMicException argument.");
	}

	NS.MiMicException.prototype=
	{
		
		/**
		 * MiMicErrorCode形式のエラーコードを保持する。
		 * @field {object as MiMicErrorCode}
		 * @name MiMicJS.MiMicException#code
		 */
		code:null,
		/**
		 * エラーメッセージを保持する。この値は、改行区切りのコールスタックである。
		 * @field {string}
		 * @name MiMicJS.MiMicException#message
		 */
		message:"",
		/**
		 * messageフィールドをalertで表示する。
		 * @name MiMicJS.MiMicException#alert
		 * @function
		 * @example
		 * try{
		 * 	throw new MiMicException();
		 * }catch(e){
		 * 	e.alert();
		 * }	 
		 */
		alert:function(){
			alert(this.message);
		},
		/**
		 * toStringを上書きする。オブジェクトを文字列化する。
		 * 文字列は例外のコールスタックであり、デバックで役立つ。
		 * @function
		 * @name MiMicJS.MiMicException#toString
		 * @return {string}
		 * 現在のオブジェクトの状態（例外のコールスタック）
		 * @example
		 * try{
		 * 	throw new MiMicException();
		 * }catch(e){
		 * 	alert(e.toString());
		 * }	 
		 */
		toString:function()
		{
			return "MiMicException:"+this.message;
		}	
	}
}());

(function(){
	/**@private */
	var NS=MiMicJS;
	/**
	 * MiMicRPCのクライアントクラスです。
	 * 通信APIを提供します。
	 * @name MiMicJS.Rpc
	 * @constructor
	 * @param {HashMap} i_event
	 * 非同期イベントハンドラの連想配列です。登録できるメンバは以下の通りです。
	 * <ul>
	 * <li>onOpen:function() -
	 * open関数のコールバック関数です。
	 * <li>onClose:function() -
	 * close関数のコールバック関数です。
	 * <li>onError:function() -
	 * 何らかの異常で通信を継続できないエラーが発生し、コネクションを維持できない時に発生します。
	 * このイベントが発生するとコネクションは閉じられます。
	 * </ul>
	 */
	NS.Rpc=function Rpc(i_event)
	{
		this._event=(i_event)?i_event:null;
	}
	NS.Rpc.prototype=
	{
		_event:null,
		/**
		 * @private 
		 * Websocketインスタンスです。
		 */
		_ws:null,
		/**
		 * @private
		 * [READ ONLY]
		 * RPCの平均RTT[ms]です。
		 * @name MiMicJs.Rpc#RTT
		 */
		rtt:0,
		/** メソッドIDカウンタ。sendJsonを実行する毎にインクリメントされます。*/
		_method_id:0,
		/**
		 * RPCコネクションを開きます。
		 * 関数が終了するとonOpenイベントをコールバックします。
		 * @name MiMicJS.Rpc#open
		 * @function
		 * @param i_url
		 * ws://から始まるWebsocketサービスURLを指定します。
		 */
		open:function open(i_url)
		{
			var _t=this;
			if(this._ws){
				throw new MiMicException();
			}
			
			var q=new Array();
			var ev=this._event;
			var ws=new WebSocket(i_url);
			ws.onopen = function(){
				if(ev.onOpen){ev.onOpen();}
			}
			ws.onclose = function(){
				if(ev.onClose){ev.onClose();}
			};
			ws.error = function(){
				_t.shutdown();
				if(ev.onClose){ev.onError();}
			};
			var rx="";
			var rxst=0;
			var _t=this;
			ws.onmessage = function (e)
			{
				//ストリームからJSONを抽出。"のエスケープには対応しない。
				for(var i=0;i<e.data.length;i++){
					var t=e.data[i];
					switch(rxst){
					case 2:
						if(t!='"'){
							rxst=1;
						}
						break;
					case 0:
						if(t!='{'){
							continue;
						}
						rx='({';
						rxst=1;
						continue;
					case 1:
						switch(t){
						case '"':
							rxst=2;
							break;
						case '}':
							rx+='})';
							rxst=0;
							{
//								log(rx);//Debug
								//JSONがたぶん確定
								var j=eval(rx);
								for(var i2=q.length-1;i2>=0;i2--){
									if(q[i2][0]==j.id){
										//id一致→コールバック
										var qi=q[i2];
										q.splice(i2, 1);
										//コールバック必要？
										if(qi[1]){qi[1](j);}
										break;
									}
								}
							}
							continue;
						}
					}
					rx+=t;
				}
			}
			this._method_id=0;
			this._q=q;
			this._ws=ws;
		},
		/**
		 * 接続中のRPCコネクションを閉じます。
		 * 関数が終了するとonCloseイベントをコールバックします。
		 * @name MiMicJS.Rpc#close
		 * @function
		 */
		close:function close()
		{
			if(this._ws && this._ws.readyState==1){
				this._ws.close();
				this._ws=null;
			}
		},
		/**
		 * RPC回線を確実に閉じます。
		 * この関数を実行すると、すべてのコールバックイベントはキャンセルされます。
		 * @name MiMicJS.Rpc#shutdown
		 * @function
		 */
		shutdown:function shutdown()
		{
			var _t=this;
			if(_t._ws){
				_t._ws.onopen=function(){_t._ws.close();};
				_t._ws.onmessage=function(){_t._ws.close();};
				_t._ws.onclose=function(){_t._ws=null;};
				_t._ws.onerror=function(){_t._ws=null;};
			}
		},
		/**
		 * 非同期でJSON RPCメソッドを送信します。
		 * @name MiMicJS.Rpc#sendMethod
		 * @function
		 * @param {string} i_method
		 * RPCメソッドの名前です。
		 * @param {string} i_params
		 * カンマ区切りのJSONスタイルの文字列です。この文字列は[....]に埋め込まれます。エスケープ文字列は使用できません。
		 * @param {function(json)}i_callback
		 * Resultを受け取るコールバック関数です。jsonにはResult JSONをパースしたオブジェクトが入ります。
		 * @return {int}
		 * メソッドIDを返します。
		 */
		sendMethod:function callJsonRpc(i_method,i_params,i_callback)
		{
			var v="{\"jsonrpc\":\"2.0\",\"method\":\""+i_method+"\",\"params\":["+i_params+"],\"id\":"+this._method_id+"}";
//			log(v);//Debug
			this._ws.send(v);
			this._q.push([this._method_id,i_callback]);//キューに記録
			this._method_id=(this._method_id+1)&0x0fffffff;//IDインクリメント
			return this._method_id;
		}
	}

}());/**
 * @fileOverview mbedSDKの定数を定義します。
 */

/**
 * mbedJSネームスペース
 * @namespace
 */
var mbedJS={};
(function(){
var NS=mbedJS;
/**
 * mbedSDKのピン識別子です。ライブラリのピン名と一致します。次のピン名を使用できます。
 * <ul>
 * <li> LPC Pin Names(P0_0 - P4_31)
 * <li> mbed DIP Pin Names(p5-p40)
 * <li> Other mbed Pin Names(LED1-LED4,USBRX,USBTX)
 * <li> Arch Pro Pin Names(D0-D15,A0-A5,I2C_SCL,I2C_SDA)
 * <li> NC
 * </ul>
 * @name mbedJS.PinName
 */
NS.PinName=function(){
	var B;
	var D={};
	// LPC Pin Names P0_0からP5_31
	B=0x00010000;
	for(var i=0;i<=5;i++){
		for(var i2=0;i2<=31;i2++){
			D['P'+i+'_'+i2]=B+i*32+i2;
		}
	}
	// mbed DIP Pin Names p5 - p40
	B=0x00020000;
	for(var i=5;i<=40;i++){
		D['p'+i]=B+i;
	}
	// Other mbed Pin Names
	B=0x00030000|0x0000;
	D.LED1 = B+0;
	D.LED2 = B+1;
	D.LED3 = B+2;
	D.LED4 = B+3;
	B=0x00030000|0x0100;
	D.USBTX = B+0;
	D.USBRX = B+1;
	
	// Arch Pro Pin Names
	//
	B=0x00040000;
	//D0-D15
	for(var i=0;i<=15;i++){
		D['D'+i]=B+i;
	}
	//A0-A5
	for(var i=0;i<=5;i++){
		D['A'+i]=B+i+0x0100;
	}
	D.I2C_SCL = B+0x0200+0;
	D.I2C_SDA = B+0x0200+1;
	
	// Not connected
	D.NC=0x7FFFFFFF;
	// メンバの追加
	return D;
}();
/**
 * ピンモード値です。
 * mbedSDKのピンモード値と同一です。<br/>
 * (PullUp|PullDown|PullNone|OpenDrain|PullDefault)
 * @name mbedJS.PinMode
 */
NS.PinMode={
	PullUp:		0x00010000,
	PullDown:	0x00010001,
	PullNone:	0x00010002,
	OpenDrain:	0x00010003,
	PullDefault:0x00010004
};
/**
 * ポート識別子です。
 * mbedSDKのポート名と同一です。<br/>
 * (Port0 - Port5)
 * @name mbedJS.PortName
 */
NS.PortName={
	Port0:	0x00010000,
	Port1:	0x00010001,
	Port2:	0x00010002,
	Port3:	0x00010003,
	Port4:	0x00010004,
	Port4:	0x00010005
};


}());/**
 * @fileOverview AnalogInクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * AnalogInクラスです。
 * <a href="https://mbed.org/handbook/AnalogIn">mbed::AnalogIn</a>と同等の機能を持ちます。
 * @constructor
 * @name mbedJS.AnalogIn
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {PinName} i_params
 * ピンIDを指定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onRead:function(v) -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 現在のピンの値です。</li>
 * 	</ul>
 * </li>
 * <li>onRead_u16:function(v) -
 * read_u16関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 現在のピンの値です。</li>
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
 * @return {mbedJS.AnalogIn}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.AnalogIn(mcu,mbedJS.PinName.A0,{
 *     onNew:function(){
 *       pin.read();
 *     },
 *     onRead:function(v)
 *     {
 *       pin.read_u16();
 *     },
 *     onRead_u16:function(v){
 *       mcu.close();
 *     }});
 *   },
 *   onClose:function(){},
 *   onError:function(){}
 * });
 * @example //Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var pin=new mbedJS.AnalogIn(mcu,mbedJS.PinName.A0,g);
 *   yield pin.waitForNew();
 *   var v=yield pin.read();
 *   v=yield pin.read_u16();
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }}();
 * g.next();
 */
var CLASS=function AnalogIn(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		MI.assertInt(i_params);		
		_t._mcu.rpc(_t.RPC_NS+":_new1",i_params,
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
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:AnalogIn",
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
	 * @name mbedJS.AnalogIn#waitForNew
	 * @function
	 */
	waitForNew:function AnalogIn_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * ピンから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.AnalogIn#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{float}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function AnalogIn_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read_fx",_t._oid,
				function (j)
				{
					var v=j.result[0]/10000;
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
	 * ピンから値を読み込みます。
	 * 関数の完了時にonRead_u16イベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.AnalogIn#read_u16
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	read_u16:function AnalogIn_read_u16()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead_u16);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read_u16;
			return _t._mcu.rpc(_t.RPC_NS+":read_u16",_t._oid,
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
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.AnalogIn#dispose
	 * @function
	 */
	dispose:function AnalogIn_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}

}
NS.AnalogIn=CLASS;
}());/**
 * @fileOverview AnalogOutクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * AnalogOutクラスです。
 * <a href="https://mbed.org/handbook/AnalogOut">mbed::AnalogOut</a>と同等の機能を持ちます。
 * @name mbedJS.AnalogOut
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {PinName} i_params
 * ピンIDを指定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onWrite:function() -
 * write関数のコールバック関数です。
 * </li>
 * <li>onWrite_u16:function() -
 * write関数のコールバック関数です。
 * </li>
 * <li>onRead:function(v) -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 現在のピンの値です。</li>
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
 * @return {mbedJS.AnalogOut}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.AnalogOut(mcu,mbedJS.PinName.p18,{
 *     onNew:function(){
 *       pin.write(0.5);
 *     },
 *     onWrite:function()
 *     {
 *       pin.read();
 *     },
 *     onRead:function(v)
 *     {
 *       pin.write_u16(0);
 *     },
 *     onWrite_u16:function()
 *     {
 *       mcu.close();
 *     }
 *     });
 *   },
 *   onClose:function(){
 *   },
 *   onError:function(){
 *   }
 * });
 * @example //Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var pin=new mbedJS.AnalogOut(mcu,mbedJS.PinName.p18,g);
 *   yield pin.waitForNew();
 *   v=yield pin.write(0.3);
 *   var v=yield pin.read();
 *   v=yield pin.write_u16(1000);
 *   var v=yield pin.read();
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }}();
 * g.next();
 */
var CLASS=function AnalogOut(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		MI.assertInt(i_params);
		_t._mcu.rpc(_t.RPC_NS+":_new1",i_params,
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
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:AnalogOut",
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
	 * Generatorモードの時は、yieldと併用してnew AnalogOut()の完了を待ちます。
	 * @name mbedJS.AnalogOut#waitForNew
	 * @function
	 */
	waitForNew:function AnalogOut_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},	
	/**
	 * ピンに値を出力します。
	 * 関数の完了時にonWriteイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.AnalogOut#write
	 * @function
	 * @param {float} i_value
	 * [0,1]の範囲で値を指定します。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write:function AnalogOut_write(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onWrite);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write;
			MI.assertNumber(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":write_fx",_t._oid+","+Math.round(i_value*10000),
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
	 * ピンに値を出力します。
	 * 関数の完了時にonWrite_u16イベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.AnalogOut#write_u16
	 * @function
	 * @param {int} i_value
	 * [0,0xffff]の範囲の整数を指定します。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write_u16:function AnalogOut_write_u16(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onWrite_u16);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":write_u16",_t._oid+","+i_value,
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
	 * ピンから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.AnalogOut#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{float}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function AnalogOut_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read_fx",_t._oid,
				function (j)
				{
					var v=j.result[0]/10000;
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
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.AnalogOut#dispose
	 * @function
	 */
	dispose:function AnalogOut_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}

}
NS.AnalogOut=CLASS;
}());/**
 * @fileOverview BusInクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * BusInクラスです。
 * <a href="https://mbed.org/handbook/BusIn">mbed::BusIn</a>と同等の機能を持ちます。
 * @name mbedJS.BusIn
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {[PinName...]} i_params
 * ピンIDの配列を指定します。要素数の最大値は16です。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>{function()} onNew -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onRead:function(v) -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 現在のピンの値です。</li>
 * 	</ul>
 * </li>
 * <li>onMode:function() -
 * mode関数のコールバック関数です。
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * {function} コールバック関数を指定した場合、RPCが完了したときにonNew相当のコールバック関数が呼び出されます。
 * メンバ関数のイベントハンドラは個別に設定してください。
 * </p>
 * @return {mbedJS.BusIn}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.BusIn(mcu,[mbedJS.PinName.P0_21,mbedJS.PinName.P0_22],{
 *     onNew:function(){
 *       pin.read();
 *     },
 *     onRead:function(v)
 *     {
 *       pin.mode(mbedJS.PinMode.PullDown);
 *     },
 *     onMode:function(v){
 *       mcu.close();
 *     }});
 *   },
 *   onClose:function(){
 *   },
 *   onError:function(){
 *   }
 * });
 * @example //Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var bus=new mbedJS.BusIn(mcu,[mbedJS.PinName.P0_21,mbedJS.PinName.P0_22],g);
 *   yield bus.waitForNew();
 *   var v=yield bus.read();
 *   v=yield bus.mode(mbedJS.PinMode.PullUp);
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }}();
 * g.next();
 */
var CLASS=function BusIn(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		//Pin配列の正規化
		var ap=i_params;
		if(ap.length<1 ||ap.length>16){
			throw new MI.MiMicException(MI.NG_INVALID_ARG);
		}
		//数値のみの配列かな？
		MI.assertInt(ap);
		var pins=ap[0];
		var i=1;
		for(;i<i_params.length;i++){
			pins+=","+ap[i];
		}
		for(;i<16;i++){
			pins+=","+NS.PinName.NC;
		}
		_t._mcu.rpc(_t.RPC_NS+":_new1",pins,
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
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:BusIn",
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
	 * Generatorモードの時は、yieldと併用してnew BusIn()の完了を待ちます。
	 * @name mbedJS.BusIn#waitForNew
	 * @function
	 */
	waitForNew:function BusIn_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * ピンから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.BusIn#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function BusIn_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read",_t._oid,
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
	 * ピンモードを設定します。
	 * 関数の完了時にonModeイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.BusIn#mode
	 * @function
	 * @param {PinMode} i_value
	 * PinModeの値です。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	mode:function BusIn_mode(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onMode);
			MI._assertYield.call(_t);
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":mode",_t._oid+","+i_value,
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
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.BusIn#dispose
	 * @function
	 */
	dispose:function BusIn_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}

}
NS.BusIn=CLASS;
}());/**
 * @fileOverview BusInOutクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * BusInOutクラスです。
 * <a href="https://mbed.org/handbook/BusInOut">mbed::BusInOut</a>と同等の機能を持ちます。
 * @name mbedJS.BusInOut
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {[PinName...]} i_params
 * ピンIDの配列を指定します。要素数の最大値は16です。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onRead:function(v) -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 現在のピンの値です。</li>
 * 	</ul>
 * </li>
 * <li>onWrite:function() -
 * write関数のコールバック関数です。
 * </li>
 * </ul>
 * <li>onOutput:function() -
 * output関数のコールバック関数です。
 * </li>
 * <li>onInput:function() -
 * input関数のコールバック関数です。
 * </li>
 * <li>onMode:function() -
 * mode関数のコールバック関数です。
 * </li>
 * 
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * {function} コールバック関数を指定した場合、RPCが完了したときにonNew相当のコールバック関数が呼び出されます。
 * メンバ関数のイベントハンドラは個別に設定してください。
 * </p>
 * @return {mbedJS.BusIn}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 * onNew:function(){
 *   var bus=new mbedJS.BusInOut(mcu,[mbedJS.PinName.P0_21,mbedJS.PinName.P0_22],{
 *   onNew:function(){
 *     bus.mode(mbedJS.PinMode.PullDown);
 *   },
 *   onMode:function()
 *   {
 *     bus.output();
 *   },
 *   onOutput:function()
 *   {
 *     bus.write(1);
 *   },
 *   onWrite:function()
 *   {
 *     bus.input();
 *   },
 *   onInput:function(){
 *     bus.read();
 *   },
 *   onRead:function(v)
 *   {
 *     mcu.close();
 *   }});
 * },
 * onClose:function(){
 * },
 * onError:function(){
 * }
 * });
 * 
 * @example //Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var bus=new mbedJS.BusInOut(mcu,[mbedJS.PinName.P0_21,mbedJS.PinName.P0_22],g);
 *   yield bus.waitForNew();
 *   yield bus.mode(mbedJS.PinMode.PullDown);
 *   yield bus.output();
 *   yield bus.write(1);
 *   yield bus.input();
 *   var v=yield bus.read();
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function BusInOut(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		//Pin配列の正規化
		var ap=i_params;
		//数値のみの配列かな？
		MI.assertInt(ap);	
		if(ap.length<1 ||ap.length>16){
			throw new MI.MiMicException(MI.NG_INVALID_ARG);
		}
		var pins=ap[0];
		var i=1;
		for(;i<i_params.length;i++){
			pins+=","+ap[i];
		}
		for(;i<16;i++){
			pins+=","+NS.PinName.NC;
		}
		_t._mcu.rpc(_t.RPC_NS+":_new1",pins,
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
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:BusInOut",
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
	 * Generatorモードの時は、yieldと併用してnew BusInOut()の完了を待ちます。
	 * @name mbedJS.BusInOut#waitForNew
	 * @function
	 */
	waitForNew:function BusInOut_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},	
	/**
	 * ピンに値を出力します。
	 * 関数の完了時にonWriteイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.BusInOut#write
	 * @function
	 * @param {int} i_value
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write:function BusInOut_write(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onWrite);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":write",_t._oid+","+i_value,
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
	 * ピンから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.BusInOut#read
	 * @function
	 * @return　{int}
	 *　Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function BusInOut_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read",_t._oid,
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
	 * ピンモードを設定します。
	 * 関数の完了時にonModeイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.BusInOut#mode
	 * @function
	 * @param {PinMode} i_value
	 * PinModeの値です。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	mode:function BusInOut_mode(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onMode);
			MI._assertYield.call(_t);
			_t._lc=CLASS.mode;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":mode",_t._oid+","+i_value,
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
	 * ピンモードを設定します。
	 * 関数の完了時にonInputイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.BusInOut#input
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	input:function BusInOut_input()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onInput);
			MI._assertYield.call(_t);
			_t._lc=CLASS.input;
			return _t._mcu.rpc(_t.RPC_NS+":input",_t._oid,
			function (j)
			{
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * ピンモードを設定します。
	 * 関数の完了時にonOutputイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.BusInOut#output
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	output:function BusInOut_output()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onOutput);
			MI._assertYield.call(_t);
			_t._lc=CLASS.mode;
			return _t._mcu.rpc(_t.RPC_NS+":output",_t._oid,
			function (j)
			{
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.BusInOut#dispose
	 * @function
	 */
	dispose:function BusInOut_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}

}
NS.BusInOut=CLASS;
}());/**
 * @fileOverview BusOutクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * BusOutクラスです。
 * <a href="https://mbed.org/handbook/BusOut">mbed::BusOut</a>と同等の機能を持ちます。
 * @name mbedJS.BusOut
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {[PinName...]} i_params
 * ピンIDの配列を指定します。要素数の最大値は16です。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onRead:function(v)  -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 現在のピンの値です。</li>
 * 	</ul>
 * </li>
 * <li>onWrite:function() -
 * write関数のコールバック関数です。
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * {function} コールバック関数を指定した場合、RPCが完了したときにonNew相当のコールバック関数が呼び出されます。
 * メンバ関数のイベントハンドラは個別に設定してください。
 * </p>
 * @return {mbedJS.BusOut}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var bus=new mbedJS.BusOut(mcu,[mbedJS.PinName.P0_21,mbedJS.PinName.P0_22],{
 *     onNew:function(){
 *       bus.write(2);
 *     },
 *     onWrite:function()
 *     {
 *       bus.read();
 *     },
 *     onRead:function(v){
 *       mcu.close();
 *     },
 *     });
 *   },
 *   onClose:function(){
 *   },
 *   onError:function(){
 *   }
 * });
 * @example //Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var bus=new mbedJS.BusOut(mcu,[mbedJS.PinName.P0_21,mbedJS.PinName.P0_22],g);
 *   yield bus.waitForNew();
 *   yield bus.write(1);
 *   var v=yield bus.read();
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function BusOut(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		//Pin配列の正規化
		var ap=i_params;
		if(ap.length<1 ||ap.length>16){
			throw new MI.MiMicException(MI.NG_INVALID_ARG);
		}
		//数値のみの配列かな？
		MI.assertInt(ap);	
		var pins=ap[0];
		var i=1;
		for(;i<i_params.length;i++){
			pins+=","+ap[i];
		}
		for(;i<16;i++){
			pins+=","+NS.PinName.NC;
		}
		_t._mcu.rpc(_t.RPC_NS+":_new1",pins,
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
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:BusOut",
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
	 * Generatorモードの時は、yieldと併用してnew BusOut()の完了を待ちます。
	 * @name mbedJS.BusOut#waitForNew
	 * @function
	 */
	waitForNew:function BusOut_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},	
	/**
	 * ピンに値を出力します。
	 * 関数の完了時にonWriteイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.BusOut#write
	 * @function
	 * @param {int} i_value
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write:function BusOut_write(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onWrite);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write;
			MI.assertInt(i_value);	
			return _t._mcu.rpc(_t.RPC_NS+":write",_t._oid+","+i_value,
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
	 * ピンから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.BusOut#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function BusOut_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read",_t._oid,
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
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.BusOut#dispose
	 * @function
	 */
	dispose:function BusOut_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}

}
NS.BusOut=CLASS;
}());/**
 * @fileOverview DigitalInクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * DigitalInクラスです。
 * <a href="https://mbed.org/handbook/DigitalIn">mbed::DigitalIn</a>と同等の機能を持ちます。
 * @name mbedJS.DigitalIn
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {PinName} i_params
 * ピンIDを指定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onRead:function(v) -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 現在のピンの値です。</li>
 * 	</ul>
 * </li>
 * <li>onMode:function() -
 * mode関数のコールバック関数です。
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * {function} コールバック関数を指定した場合、RPCが完了したときにonNew相当のコールバック関数が呼び出されます。
 * メンバ関数のイベントハンドラは個別に設定してください。
 * </p>
 * @return {mbedJS.DigitalIn}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.DigitalIn(mcu,mbedJS.PinName.P0_22,{
 *     onNew:function(){
 *       pin.mode(mbedJS.PinMode.PullUp);
 *     },
 *     onMode:function()
 *     {
 *       pin.read();
 *     },
 *     onRead:function(v){
 *       mcu.close();
 *     }});
 *   },
 *   onClose:function(){
 *   },
 *   onError:function(){
 *   }
 * });
 * @example //Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var pin=new mbedJS.DigitalIn(mcu,mbedJS.PinName.P0_22,g);
 *   yield pin.waitForNew();
 *   var v=yield pin.read();
 *   yield pin.mode(mbedJS.PinMode.PullDown);
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }}();
 * g.next();
 */
var CLASS=function DigitalIn(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		MI.assertInt(i_params);
		_t._mcu.rpc(_t.RPC_NS+":_new1",i_params,
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
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:DigitalIn",
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
	 * Generatorモードの時は、yieldと併用してnew DigitalIn()の完了を待ちます。
	 * @name mbedJS.DigitalIn#waitForNew
	 * @function
	 */
	waitForNew:function DigitalIn_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * ピンからアナログ値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.DigitalIn#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function DigitalIn_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read",_t._oid,
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
	 * ピンモードを設定します。
	 * 関数の完了時にonModeイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.DigitalIn#mode
	 * @function
	 * @param {PinMode} i_value
	 * PinModeの値です。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	mode:function DigitalIn_mode(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onMode);
			MI._assertYield.call(_t);
			_t._lc=CLASS.mode;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":mode",_t._oid+","+i_value,
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
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.DigitalIn#dispose
	 * @function
	 */
	dispose:function DigitalIn_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}
}
NS.DigitalIn=CLASS;
}());/**
 * @fileOverview DigitalOutクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * DigitalOutクラスです。
 * <a href="https://mbed.org/handbook/DigitalOut">mbed::DigitalOut</a>と同等の機能を持ちます。
 * @name mbedJS.DigitalOut
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {PinName|HashMap|Array} i_params
 * PinName又はコンストラクタの引数を格納した連想配列、配列です。
 * 複数のパラメータを指定する場合は連想配列を使用してください。
 * <p>PinNameの場合は制御するPinIDを指定します。</p>
 * <p>
 * HashMapの場合は以下のメンバを指定できます。
 * <ul>
 * <li>{PinName} pin -
 * ピンIDを指定します。</li>
 * <li>{int} value -
 * ピンの初期値を指定します。</li>
 * </ul>
 * </p>
 * <p>配列の場合は次の順番でパラメータを指定します。
 * <pre>[{PinName} pin,{int} value]</pre>
 * </p>
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onWrite:function() -
 * write関数のコールバック関数です。
 * </li>
 * <li>onRead:function(v) -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 現在のピンの値です。</li>
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
 * @return {mbedJS.DigitalOut}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.DigitalOut(mcu,mbedJS.PinName.P0_22,{
 *     onNew:function(){
 *       pin.read();
 *     },
 *     onWrite:function(){
 *       mcu.close();
 *     },
 *     onRead:function(v){
 *       pin.write((v+1)%2);
 *     }});
 *   },
 *   onClose:function(){
 *   },
 *   onError:function(){
 *   }
 * });
 * @example //Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var pin=new mbedJS.DigitalOut(mcu,{pin:mbedJS.PinName.P0_22,value:0},g);
 *   yield pin.waitForNew();
 *   var v=yield pin.read();
 *   yield pin.write((v+1)%2);
 *   v=yield pin.read();
 *   yield pin.write((v+1)%2);
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function DigitalOut(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		function rcb(j)
		{
			_t._oid=j.result[0];
			if(cb){cb();}
			if(_t._gen){_t._gen.next(_t);}
			_t._lc=null;
		}
		//パラメタ生成
		var pr;
		if(MI.isHashArray(i_params)){
			pr=[i_params.pin,i_params.value];
		}else if(MI.isArray(i_params)){
			pr=[i_params[0],null];
		}else{
			pr=[i_params,null];
		}
		MI.assertInt(pr[0]);
		if(pr[1]){
			MI.assertInt(pr[1]);
			_t._mcu.rpc(_t.RPC_NS+":_new2",pr[0]+","+pr[1],rcb);
		}else{
			_t._mcu.rpc(_t.RPC_NS+":_new1",pr[0],rcb);
		}
	}catch(e){
		throw new MI.MiMicException(e);
	}
}
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:DigitalOut",
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
	 * Generatorモードの時は、yieldと併用してnew DigitalOut()の完了を待ちます。
	 * @name mbedJS.DigitalOut#waitForNew
	 * @function
	 */
	waitForNew:function DigitalOut_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},	
	/**
	 * ピンに値を出力します。
	 * 関数の完了時にonWriteイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.DigitalOut#write
	 * @function
	 * @param {int} i_value
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write:function DigitalOut_write(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onWrite);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":write",_t._oid+","+i_value,
			function(j){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * ピンから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.DigitalOut#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function DigitalOut_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read",_t._oid,
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
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.DigitalOut#dispose
	 * @function
	 */
	dispose:function DigitalOut_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}

}
NS.DigitalOut=CLASS;
}());/**
 * @fileOverview Mcuクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * mbedJSを搭載したmbedに接続したインスタンスを生成します。
 * Mcuオブジェクトは、他のペリフェラルクラスをインスタンス化するときに必要です。
 * @name mbedJS.Mcu
 * @constructor
 * @param {string} i_url
 * 接続先のMiMicRPCサービスのアドレスを指定します。
 * @param {HashMap|Generator} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>{function()} onNew -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>{function()} onClose -
 * Close関数のコールバック関数です。
 * </li>
 * <li>{function()} onError -
 * 何らかの異常で通信を継続できないエラーが発生し、コネクションを維持できない時に発生します。
 * このイベントが発生するとコネクションは閉じられれます。
 * </li>
 * <li>{function(v)} onDisposeObject
 * disposeObject関数が完了したときに呼び出されます。
 * vは削除に成功したかの真偽値です。
 * </li>
 * <li>{function(v)} onGetInfo
 * onGetInfo関数が完了したときに呼び出されます。
 * vは戻り値を格納した複合連想配列です。
 * {version,platform,mcu:{name,eth},memory:{free}}
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の戻り値はyiledの戻り値として取得できます。
 * <p>
 * @return {mbedJS.Mcu}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     mcu.getInfo();
 *   },
 *   onGetInfo:function(v){
 *     log("[PASS]onGetInfo:"+v.version+","+v.platform+","+v.mcu.name+","+v.mcu.eth+","+v.memory.free);
 *     var pin=new mbedJS.DigitalIn(mcu,mbedJS.PinName.P0_22,{
 *       onNew:function(){
 *         mcu.disposeObject(pin._oid);
 *       }});
 *   },
 *   onDisposeObject:function(v){
 *     mcu.close();
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
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function Mcu(i_url,i_handler)
{
	var _t=this;
	_t._lc=CLASS;
	_t._has_error=false;
	if(MI.isGenerator(i_handler)){_t._gen=i_handler;}
	else if(i_handler){_t._event=i_handler}
	
	_t._rpc=new MI.Rpc({
		onOpen:function _Mcu_onOpen(){
			if(_t._event.onNew){_t._event.onNew();}
			if(_t._gen){_t._gen.next(_t);}
			_t.lc=null;
		},
		onClose:function _Mcu_onClose(){
			if(_t._lc==CLASS.close){
				if(_t._event.onClose){_t._event.onClose();}
			}else{
				if(_t._event.onError){_t._event.onError();}
			}
			if(_t._gen){
				_t._gen.next(_t);
			}			
			_t.lc=null;
		},
		onError:function _Mcu_onError()
		{
			_t._has_error=true;
			if(_t._event.onError){_t._event.onError();}
			if(_t._gen && _t._lc){
				_t._gen.throw(new MI.MiMicException());
			}
			//@todo MCUにぶら下がってる全てのyieldに対してもExceptionの発生要請？
		}
	});
	//MCUへ接続
	this._rpc.open('ws://'+i_url+'/rpc/');
}
CLASS.prototype=
{
	RPC_NS:"mbedJS:Mcu",
	_lc:null,
	_rpc:null,
	_gen:null,
	_event:{},
	_has_error:false,
	/**
	 * エラー状態であるかを返します。
	 * Generatorモードの場合に、定期実行してインスタンスの状態をチェックできます。
	 * falseの場合、下位のオブジェクトでyieldロックが発生している場合があります。
	 * @name mbedJS.Mcu#hasError
	 * @function
	 * @return {boolean}
	 * true - インスタンスはエラー状態で停止中です。使用できません。
	 * false - インスタンスは動作中です。使用可能です。
	 */
	hasError:function(){
		return _t._has_error;
	},
	/**
	 * Generatorモードのときに使用する関数です。
	 * Generatorモードの時は、yieldと併用してnew Mcu()の完了を待ちます。
	 * @name mbedJS.Mcu#waitForNew
	 * @function
	 */
	waitForNew:function MCU_waitForNew(){
		if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
		this._lc=CLASS.waitForNew;
	},
	/**
	 * RPCを切断します。関数の完了時にonCloseイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.Mcu#close
	 * @function
	 */
	close:function MCU_close(){
		MI._assertYield.call(this);
		this._lc=CLASS.close;
		this._rpc.close();
	},
	/**
	 * コールバック関数を全てキャンセルして、Mcuとの接続をシャットダウンします。
	 * この関数は即座に完了します。
	 * @name mbedJS.Mcu#shutdown
	 * @function
	 */
	shutdown:function MCU_shutdown(){
		this._rpc.shutdown();
	},
	/**
	 * RPCメソッドを実行します。
	 * @name mbedJS.Mcu#rpc
	 * @function
	 * @param {string} m
	 * メソッド名です。
	 * @param {string} p
	 * パラメータ部の文字列です。JSONオブジェクトの配列を記述します。
	 * 配列の要素はプリミティブ型である必要があります。
	 * @param {function(json)} c
	 * RPCが完了したときに呼び出すコールバック関数です。
	 * <ul>
	 * <li>json - 戻り値をJSON文字列としてパースしたObjectです。</li>
	 * </ul>
	 * @return {int}
	 * メソッドのid値を返します。
	 */
	rpc:function Mcu_rpc(m,p,c){
		if(this._has_error){
			throw new MI.MiMicException();
		}
		return this._rpc.sendMethod(m,p,c);
	},
	/** @private */
	addItem:function(o){
		this._items.push(o);
	},
	/**
	 * Mcuの情報を返します。
	 * @name mbedJS.Mcu#getInfo
	 * @function
	 * @return {HashMap}
	 * 情報を格納した連想配列です。
	 */
	getInfo:function(){
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onGetInfo);
			_t._lc=CLASS.getInfo;
			return _t.rpc(_t.RPC_NS+":getInfo","",
				function (j)
				{
					var r=j.result;
					var v={version:r[0],platform:r[1],mcu:{name:r[3],eth:r[2]},memory:{free:r[4]}};
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
	 * 指定idのオブジェクトをMCUのメモリから削除します。
	 * @name mbedJS.Mcu#disposeObject
	 * @function
	 * @param {int} i_oid
	 * オブジェクトID。
	 * mbedJSオブジェクトが所有するリモートオブジェクトのIDを指定します。
	 * @return {boolean}
	 * 結果を返します。
	 */
	disposeObject:function(i_oid){
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onDisposeObject);
			_t._lc=CLASS.disposeObject;
			return _t.rpc(_t.RPC_NS+":disposeObject",i_oid,
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
	 * 内部関数です.
	 * ペリフェラルクラスから_dispose.apply(this,arguments)でコールしてください。
	 * @private
	 */
	_dispose:function(){
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onDispose);
			_t._lc=_t.dispose;//CLASS.disposeが使えないんでIDに関数そのものを使う
			return _t._mcu.rpc(_t._mcu.RPC_NS+":disposeObject",_t._oid,
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
	}	
	
}
NS.Mcu=CLASS;
}());/**
 * @fileOverview PortInクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * PortInクラスです。
 * <a href="https://mbed.org/handbook/PortIn">mbed::PortIn</a>と同等の機能を持ちます。
 * @name mbedJS.PortIn
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {HashMap|Array} i_params
 * <p>
 * HashNapの場合は以下のメンバを指定できます。
 * <ul>
 * <li>{PortName} port -
 * ポート名を指定します。</li>
 * <li>{uint32} mask -
 * ポートマスクを指定します。</li>
 * </ul>
 * </p>
 * <p>配列の場合は次の順番でパラメータを指定します。
 * <pre>{port,mask}</pre>
 * </p>
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onRead:function(v) -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 現在のポートの値です。</li>
 * 	</ul>
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.PortIn}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.PortIn(mcu,[mbedJS.PortName.Port0,0xffffffff],{
 *     onNew:function(){
 *       log("[PASS]onNew");
 *       pin.read();
 *     },
 *     onRead:function(v)
 *     {
 *       log("[PASS]read:"+v);
 *       mcu.close();
 *     }});
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
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var port=new mbedJS.PortIn(mcu,[mbedJS.PortName.Port0,0xffffffff],g);
 *   yield port.waitForNew();
 *   var v=yield port.read();
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function PortIn(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		//引数の正規化
		var pr;
		if(MI.isHashArray(i_params)){
			pr=[i_params.port,i_params.mask];
		}else if(MI.isArray(i_params)){
			pr=i_params;
		}
		MI.assertInt(pr);
		_t._mcu.rpc(_t.RPC_NS+":_new1",pr[0]+","+pr[1],
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
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:PortIn",
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
	 * Generatorモードの時は、yieldと併用してnew PortIn()の完了を待ちます。
	 * @name mbedJS.PortIn#waitForNew
	 * @function
	 */
	waitForNew:function PortIn_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * ピンから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PortIn#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はポートの値を返します。
	 */
	read:function PortIn_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read",_t._oid,
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
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.PortIn#dispose
	 * @function
	 */
	dispose:function PortIn_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}
}
NS.PortIn=CLASS;
}());/**
 * @fileOverview PortOutクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * PortOutクラスです。
 * <a href="https://mbed.org/handbook/PortOut">mbed::PortOut</a>と同等の機能を持ちます。
 * @name mbedJS.PortOut
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {HashMap|Array} i_params
 * <p>
 * HashNapの場合は以下のメンバを指定できます。
 * <ul>
 * <li>{PortName} port -
 * ポート名を指定します。</li>
 * <li>{uint32} mask -
 * ポートマスクを指定します。</li>
 * </ul>
 * </p>
 * <p>配列の場合は次の順番でパラメータを指定します。
 * <pre>{port,mask}</pre>
 * </p>
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onWrite:function() -
 * write関数のコールバック関数です。
 * </li>
 * <li>onRead:function(v)  -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 現在のピンの値です。</li>
 * 	</ul>
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.PortOut}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.PortOut(mcu,[mbedJS.PortName.Port0,0xffffffff],{
 *     onNew:function(){
 *       pin.write(1234);
 *     },
 *     onWrite:function()
 *     {
 *       pin.read();
 *     },      
 *     onRead:function(v)
 *     {
 *       mcu.close();
 *     }});
 *   },
 *   onClose:function(){
 *   },
 *   onError:function(){
 *   }
 * });
 * @example //Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var port=new mbedJS.PortOut(mcu,{port:mbedJS.PortName.Port0,mask:0xffffffff},g);
 *   yield port.waitForNew();
 *   yield port.write(5678);
 *   var v=yield port.read();
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function PortOut(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		//引数の正規化
		var pr;
		if(MI.isHashArray(i_params)){
			pr=[i_params.port,i_params.mask];
		}else if(MI.isArray(i_params)){
			pr=i_params;
		}
		MI.assertInt(pr);
		_t._mcu.rpc(_t.RPC_NS+":_new1",pr[0]+","+pr[1],
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
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:PortOut",
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
	 * Generatorモードの時は、yieldと併用してnew PortOut()の完了を待ちます。
	 * @name mbedJS.PortOut#waitForNew
	 * @function
	 */
	waitForNew:function DigitalOut_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * ポートへ値を出力します。
	 * 関数の完了時にonWriteイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PortOut#write
	 * @function
	 * @param {int} i_value
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write:function PortOut_write(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onWrite);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":write",_t._oid+","+i_value,
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
	 * ポートから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PortOut#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はポートの値を返します。
	 */
	read:function PortOut_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read",_t._oid,
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
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.PortOut#dispose
	 * @function
	 */
	dispose:function PortOut_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}
}
NS.PortOut=CLASS;
}());/**
 * @fileOverview PwmOutクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * PwmOutクラスです。
 * <a href="https://mbed.org/handbook/PwmOut">mbed::PwmOut</a>と同等の機能を持ちます。
 * @name mbedJS.PwmOut
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {PinName} i_params
 * ピンIDを指定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onWrite:function() -
 * write関数のコールバック関数です。
 * </li>
 * <li>onRead:function(v)  -
 * read関数のコールバック関数です。
 * 	<ul>
 * 		<li>{int} v - 現在のピンの値です。</li>
 * 	</ul>
 * </li>
 * <li>onPeriod:function() -
 * period関数のコールバック関数です。
 * </li>
 * <li>onPeriod_ms:function() -
 * period_ms関数のコールバック関数です。
 * </li>
 * <li>onPeriod_us:function() -
 * period_ns関数のコールバック関数です。
 * </li>
 * <li>onPulsewidth:function() -
 * pulswidth関数のコールバック関数です。
 * </li>
 * <li>onPulsewidth_ms:function() -
 * pulswidth_ms関数のコールバック関数です。
 * </li>
 * <li>onPulsewidth_us:function() -
 * pulswidth_us関数のコールバック関数です。
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.PwmOut}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.PwmOut(mcu,mbedJS.PinName.p21,{
 *     onNew:function(){
 *       pin.write(0.33);
 *     },
 *     onWrite:function()
 *     {
 *       pin.read();
 *     },
 *     onRead:function(v)
 *     {
 *       pin.period(1.0);
 *     },
 *     onPeriod:function(){
 *       pin.period_ms(1);
 *     },
 *     onPeriod_ms:function(){
 *       pin.period_us(10);
 *     },
 *     onPeriod_us:function(){
 *       pin.pulsewidth(3);
 *     },
 *     onPulsewidth:function(){
 *       pin.pulsewidth_ms(30);
 *     },
 *     onPulsewidth_ms:function(){
 *       pin.pulsewidth_us(40);
 *     },
 *     onPulsewidth_us:function(){
 *       mcu.close();
 *     }
 *     });
 *   },
 *   onClose:function(){
 *   },
 *   onError:function(){
 *   }
 * });
 * @example //Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var pin=new mbedJS.PwmOut(mcu,mbedJS.PinName.p21,g);
 *   yield pin.waitForNew();
 *   yield pin.write(0.33);
 *   var v=yield pin.read();
 *   yield pin.period(1.0);
 *   yield pin.period_ms(1);
 *   yield pin.period_us(10);
 *   yield pin.pulsewidth(3);
 *   yield pin.pulsewidth_ms(30);
 *   yield pin.pulsewidth_us(40);
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }}();
 * g.next();
 */
var CLASS=function PwmOut(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		MI.assertInt(i_params);
		_t._mcu.rpc(_t.RPC_NS+":_new1",i_params,
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
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:PwmOut",
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
	 * Generatorモードの時は、yieldと併用してnew PwmOut()の完了を待ちます。
	 * @name mbedJS.PwmOut#waitForNew
	 * @function
	 */
	waitForNew:function PwmOut_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * ピンに値を出力します。
	 * 関数の完了時にonWriteイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#write
	 * @function
	 * @param {float} i_value
	 * [0,1]の値を指定します。
	 * @return {int|none}
	 * <p>Callbackモードの時はRPCメソッドのインデクスを返します。</p>
	 * <p>Generatorモードの時は戻り値はありません。</p>
	 */
	write:function PwmOut_write(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onWrite);
			MI._assertYield.call(_t);
			_t._lc=CLASS.write;
			MI.assertNumber(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":write_fx",_t._oid+","+Math.round(i_value*10000),
			function(j){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * ピンから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#read
	 * @function
	 * @return　{int|float}
	 * <p>Callbackモードの時はRPCメソッドのインデクスを返します。</p>
	 * <p>Generatorモードの時はピンの値を返します。</p>
	 */
	read:function PwmOut_read()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onRead);
			MI._assertYield.call(_t);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read_fx",_t._oid,
			function (j)
			{
				var v=j.result[0]/10000;
				if(cb){cb(v);}
				if(_t._gen){_t._gen.next(v);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * PWMの周期を設定します。
	 * 関数の完了時にonPeriodイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#period
	 * @function
	 * @param {float} i_value
	 * 秒単位の周期を設定します。
	 * @return {int|none}
	 * <p>Callbackモードの時はRPCメソッドのインデクスを返します。</p>
	 * <p>Generatorモードの時は戻り値はありません。</p>
	 */
	period:function PwmOut_period(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onPeriod);
			MI._assertYield.call(_t);
			_t._lc=CLASS.period;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":period_fx",_t._oid+","+Math.round(i_value*10000),
			function(j){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * PWMの周期を設定します。
	 * 関数の完了時にonPeriod_msイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#period_ms
	 * @function
	 * @param {int} i_value
	 * ms単位の周期を設定します。
	 * @return {int|none}
	 * <p>Callbackモードの時はRPCメソッドのインデクスを返します。</p>
	 * <p>Generatorモードの時は戻り値はありません。</p>
	 */
	period_ms:function PwmOut_period_ms(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onPeriod_ms);
			MI._assertYield.call(_t);
			_t._lc=CLASS.period_ms;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":period_ms",_t._oid+","+i_value,
			function(j){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * PWMの周期を設定します。
	 * 関数の完了時にonPeriod_usイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#period_us
	 * @function
	 * @param {int} i_value
	 * 整数値を指定します。
	 * @return {int|none}
	 * <p>Callbackモードの時はRPCメソッドのインデクスを返します。</p>
	 * <p>Generatorモードの時は戻り値はありません。</p>
	 */
	period_us:function PwmOut_period_us(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onPeriod_us);
			MI._assertYield.call(_t);
			_t._lc=CLASS.period_us;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":period_us",_t._oid+","+i_value,
			function(j){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * PWMの周期を設定します。
	 * 関数の完了時にonPeriodイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#pulsewidth
	 * @function
	 * @param {float} i_value
	 * 秒単位の周期を設定します。
	 * @return {int|none}
	 * <p>Callbackモードの時はRPCメソッドのインデクスを返します。</p>
	 * <p>Generatorモードの時は戻り値はありません。</p>
	 */
 	pulsewidth:function PwmOut_pulsewidth(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onPulsewidth);
			MI._assertYield.call(_t);
			_t._lc=CLASS.pulsewidth;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":pulsewidth_fx",_t._oid+","+Math.round(i_value*10000),
			function(j){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * PWMの周期を設定します。
	 * 関数の完了時にonPulsewidth_msイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#pulsewidth_ms
	 * @function
	 * @param {int} i_value
	 * ms単位の周期を設定します。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	pulsewidth_ms:function PwmOut_pulsewidth_ms(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onPulsewidth_ms);
			MI._assertYield.call(_t);
			_t._lc=CLASS.pulsewidth_ms;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":pulsewidth_ms",_t._oid+","+i_value,
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
	 * PWMの周期を設定します。
	 * 関数の完了時にonPulsewidth_usイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.PwmOut#pulsewidth_us
	 * @function
	 * @param {int} i_value
	 * 整数値を指定します。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	pulsewidth_us:function PwmOut_pulsewidth_us(i_value)
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onPulsewidth_us);
			MI._assertYield.call(_t);
			_t._lc=CLASS.pulsewidth_us;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":pulsewidth_us",_t._oid+","+i_value,
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
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.PwmOut#dispose
	 * @function
	 */
	dispose:function PwmOut_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}
}
NS.PwmOut=CLASS;
}());/**
 * @fileOverview SPIクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * SPIクラスです。
 * <a href="https://mbed.org/handbook/SPI">mbed::SPI</a>と同等の機能を持ちます。
 * @name mbedJS.SPI
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {[PinName,PinName,PinName]} i_params
 * SPIを構成する3つのPinNameを格納する配列です。mosi,miso,sclkの順番です。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onWrite:function(v) -
 * write関数のコールバック関数です。
 * 	<ul>
 * 		<li>v:int - 受信した8BIT値です。</li>
 * 	</ul>
 * </li>
 * <li>onFrequency:function(v) -
 * frequency関数のコールバック関数です。
 * </li>
 * <li>onFormat:function(v) -
 * format関数のコールバック関数です。
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.SPI}
 * @example　//Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.SPI(mcu,[mbedJS.PinName.p5,mbedJS.PinName.p6,mbedJS.PinName.p7],{
 *     onNew:function(){
 *       pin.frequency(1000000);
 *     },
 *     onFrequency:function()
 *     {
 *       pin.format(8,3);
 *     },
 *     onFormat:function()
 *     {
 *       pin.write(39);
 *     },
 *     onWrite:function(v){
 *       mcu.close();
 *     }});
 *   },
 *   onClose:function(){
 *   },
 *   onError:function(){
 *   }
 * });
 * @example　//Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var pin=new mbedJS.SPI(mcu,[mbedJS.PinName.p5,mbedJS.PinName.p6,mbedJS.PinName.p7],g);
 *   yield pin.waitForNew();
 *   yield pin.frequency(1000000);
 *   yield pin.format(8,3);
 *   v=yield pin.write(39);
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function SPI(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		MI.assertInt(i_params);
		_t._mcu.rpc(_t.RPC_NS+":_new1",i_params[0]+","+i_params[1]+","+i_params[2]+","+NS.PinName.NC,
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
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:SPI",
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
	 * Generatorモードの時は、yieldと併用してnew SPI()の完了を待ちます。
	 * @name mbedJS.SPI#waitForNew
	 * @function
	 */
	waitForNew:function SPI_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},	
	/**
	 * SPI Slaveに値を書き込み、戻り値を返します。
	 * 関数の完了時にonWriteイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPI#write
	 * @function
	 * @param {int} i_value
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	write:function SPI_write(i_value)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onWrite);
			_t._lc=CLASS.write;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":write",_t._oid+","+i_value,
				function(j){
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
	 * frequencyに値を設定します。
	 * 関数の完了時にonFrequencyイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPI#frequency
	 * @function
	 * @param {int} i_value
	 * frequencyに設定する値です。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	frequency:function SPI_frequency(i_value)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onFrequency);
			_t._lc=CLASS.frequency;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":frequency",_t._oid+","+i_value,
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
	 * formatに値を設定します。
	 * 関数の完了時にonFormatイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPI#format
	 * @function
	 * @param {int} i_bits
	 * @param {int} i_mode
	 * 省略可能です。省略時は0になります。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	format:function SPI_format(i_bits,i_mode)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onFormat);
			_t._lc=CLASS.format;
			var mode=i_mode?i_mode:0;
			MI.assertInt([i_bits,mode]);
			return _t._mcu.rpc(_t.RPC_NS+":format",_t._oid+","+i_bits+","+mode,
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
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.SPI#dispose
	 * @function
	 */
	dispose:function SPI_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}
}
NS.SPI=CLASS;
}());/**
 * @fileOverview SPISlaveクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * SPISlaveクラスです。
 * <a href="https://mbed.org/handbook/SPISlave">mbed::SPISlave</a>と同等の機能を持ちます。
 * @name mbedJS.SPISlave
 * @constructor
 * @param {mbedJS.Mcu} i_mcu
 * インスタンスをバインドするMCUオブジェクトです。
 * @param {[PinName,PinName,PinName]} i_params
 * SPIを構成する4つのPinNameを格納する配列です。
 * mosi, miso, sclkの順番で設定します。
 * @param {HashMap|Generator|function} i_handler
 * 非同期イベントの共通ハンドラの連想配列,Generator,個別コールバック関数の何れかを指定します。
 * <p>
 * {HashMap} 非同期イベントの共通イベントハンドラです。
 * <ul>
 * <li>onNew:function() -
 * インスタンスが使用可能になった時に呼び出されます。
 * </li>
 * <li>onFrequency:function(v) -
 * frequency関数のコールバック関数です。
 * </li>
 * <li>onFormat:function(v) -
 * format関数のコールバック関数です。
 * </li>
 * <li>onReceive:function(v) -
 * receive関数のコールバック関数です。
 * </li>
 * <li>onRead:function(v) -
 * read関数のコールバック関数です。
 * <ul>
 * 		<li>v:int - 受信した8BIT値です。</li>
 * </ul>
 * </li>
 * <li>onReply:function() -
 * reply関数のコールバック関数です。
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * コールバック関数を指定した場合、RPCが完了したときに呼び出されます。メンバ関数のイベントハンドラは個別に設定する必要があります。
 * </p>
 * @return {mbedJS.SPI}
 * @example //Callback
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var pin=new mbedJS.SPISlave(mcu,[mbedJS.PinName.p5,mbedJS.PinName.p6,mbedJS.PinName.p7,mbedJS.PinName.p8],{
 *     onNew:function(){
 *       pin.frequency(1000000);
 *     },
 *     onFrequency:function()
 *     {
 *       pin.format(8,3);
 *     },
 *     onFormat:function()
 *     {
 *       pin.read();
 *     },
 *     onRead:function(v){
 *       pin.receive();
 *     },
 *     onReceive:function(v)
 *     {
 *       pin.reply(1);
 *     },
 *     onReply:function(){
 *         mcu.close();
 *     }
 *     });
 *   },
 *   onClose:function(){
 *   },
 *   onError:function(){
 *   }
 * });
 * @example //Generator
 * var g=function*(){
 * try{
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var pin=new mbedJS.SPISlave(mcu,[mbedJS.PinName.p5,mbedJS.PinName.p6,mbedJS.PinName.p7,mbedJS.PinName.p8],g);
 *   yield pin.waitForNew();
 *   yield pin.frequency(1000000);
 *   yield pin.format(8,3);
 *   var v=yield pin.read();
 *   v=yield pin.receive();
 *   yield pin.reply(1);
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 * }
 * }();
 * g.next();
 */
var CLASS=function SPISlave(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		MI.assertInt(i_params);
		_t._mcu.rpc(_t.RPC_NS+":_new1",i_params[0]+","+i_params[1]+","+i_params[2]+","+i_params[3],
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
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:SPISlave",
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
	 * Generatorモードの時は、yieldと併用してnew SPISlave()の完了を待ちます。
	 * @name mbedJS.SPISlave#waitForNew
	 * @function
	 */
	waitForNew:function SPISlave_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},	

	/**
	 * frequencyに値を設定します。
	 * 関数の完了時にonFrequencyイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPISlave#frequency
	 * @function
	 * @param {int} i_value
	 * 
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	frequency:function SPISlave_frequency(i_value)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onFrequency);
			_t._lc=CLASS.frequency;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":frequency",_t._oid+","+i_value,
			function(j){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},	
	/**
	 * formatに値を設定します。
	 * 関数の完了時にonFormatイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPISlave#format
	 * @function
	 * @param {int} i_bits
	 * @param {int} i_mode
	 * 省略可能です。省略時は0になります。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	format:function SPISlave_format(i_bits,i_mode)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onFormat);
			_t._lc=CLASS.format;
			var mode=i_mode?i_mode:0;
			MI.assertInt([i_bits,mode]);
			return _t._mcu.rpc(_t.RPC_NS+":format",_t._oid+","+i_bits+","+mode,
			function(j){
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * 転送メモリから値を読み込みます。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPISlave#read
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	read:function SPISlave_read()
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onRead);
			_t._lc=CLASS.read;
			return _t._mcu.rpc(_t.RPC_NS+":read",_t._oid,
			function (j)
			{
				var v=j.result[0];
				if(cb){cb(v);}
				if(_t._gen){_t._gen.next(v);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * データが到着しているかを返します。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPISlave#receive
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return　{int}
	 * Generatorモードの時はピンの値を返します。
	 */
	receive:function SPISlave_receive()
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onReceive);
			_t._lc=CLASS.receive;
			return _t._mcu.rpc(_t.RPC_NS+":receive",_t._oid,
			function (j)
			{
				var v=j.result[0];
				if(cb){cb(v);}
				if(_t._gen){_t._gen.next(v);}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * 転送バッファに次に送信するメッセージをセットします。
	 * 関数の完了時にonReplyイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.SPISlave#reply
	 * @function
	 * @param {int} i_value
	 * 次に送る8bitの値です。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	reply:function SPISlave_reply(i_value)
	{
		try{
			var _t=this;
			MI._assertYield.call(_t);
			var cb=MI._getCb(arguments,_t._event.onReply);
			_t._lc=CLASS.reply;
			MI.assertInt(i_value);
			return _t._mcu.rpc(_t.RPC_NS+":reply",_t._oid+","+i_value,
			function (j)
			{
				if(cb){cb();}
				if(_t._gen){_t._gen.next();}
				 _t._lc=null;
			});
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * MCUに生成されているオブジェクトを破棄します。
	 * @name mbedJS.SPISlave#dispose
	 * @function
	 */
	dispose:function SPISlave_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}	
}
NS.SPISlave=CLASS;
}());/**
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
}());/**
 * @fileOverview I2Cクラスを定義します。
 */
(function(){
var NS=mbedJS;
var MI=MiMicJS;

/**
 * I2Cクラスです。
 * <a href="https://mbed.org/handbook/I2C">mbed::I2C</a>と同等の機能を持ちます。
 * @constructor
 * @name mbedJS.I2C
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
 * <li>onWrite:function(ret)-
 * write関数が完了したときに呼び出されます。
 * <ul>
 * <li>ret:int - 成功/失敗フラグを返します。write.1とwrite.2の場合で意味が異なります。
 * write.1の場合、ACK:0(成功),NACK:それ以外です。write.2の場合、ACKを受信すると1を返します。</li>
 * </ul> 
 * </li>
 * <li>onStart:function() -
 * start関数が完了したときに呼び出されます。
 * </li>
 * <li>onStop:function() -
 * stop関数が完了したときに呼び出されます。
 * </li>
 * </ul>
 * <p>
 * {Generator} Generatorを指定した場合、コールバック関数の引数はyiledの戻り値として取得できます。
 * </p>
 * <p>
 * {function} コールバック関数を指定した場合、RPCが完了したときにonNew相当のコールバック関数が呼び出されます。
 * メンバ関数のイベントハンドラは個別に設定してください。
 * </p>
 * @return {mbedJS.I2C}
 * @example //Callback
 * var st=0;
 * var mcu=new mbedJS.Mcu("192.168.128.39",
 * {
 *   onNew:function(){
 *     var i2c=new mbedJS.I2C(mcu,[mbedJS.PinName.p28,mbedJS.PinName.p27],{
 *     onNew:function(){
 *       i2c.frequency(100000);
 *     },
 *     onFrequency:function()
 *     {
 *       i2c.start();
 *     },
 *     onStart:function(){
 *       st=0;
 *       i2c.write(1);
 *     },
 *     onWrite:function(v){
 *       if(st==0){
 *         i2c.write(0,[1,2,3],false);
 *         st++;
 *       }else{
 *         i2c.read(1);
 *         st=0;
 *       }
 *     },
 *     onRead:function(v){
 *       if(st==0){
 *         i2c.read(1,2,false);
 *         st++;
 *       }else{
 *         i2c.stop();
 *         }
 *     },
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
 *   var v;
 *   var mcu=new mbedJS.Mcu("192.168.128.39",g);
 *   yield mcu.waitForNew();
 *   var i2c=new mbedJS.I2C(mcu,[mbedJS.PinName.p28,mbedJS.PinName.p27],g);
 *   yield i2c.waitForNew();
 *   yield i2c.frequency(100000);
 *   yield i2c.start();
 *   yield i2c.write(1);
 *   yield i2c.write(0,[1,2,3],false);
 *   yield i2c.read(1);
 *   yield i2c.read(1,2,false);
 *   yield i2c.stop();
 *   yield mcu.close();
 * }catch(e){
 *   mcu.shutdown();
 *   alert(e);
 *   throw e;
 * }
 * }();
 * g.next();
 */
var CLASS=function I2C(i_mcu,i_params,i_handler)
{
	try{
		var _t=this;
		_t._mcu=i_mcu;
		_t._lc=CLASS;
		var cb=MI._initHandler.call(_t,i_handler);
		MI.assertInt(i_params);		
		_t._mcu.rpc(_t.RPC_NS+":_new1",i_params[0]+","+i_params[1],
			function (j)
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
CLASS.prototype=
{
	/** @private */
	RPC_NS:"mbedJS:I2C",
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
	 * Generatorモードの時は、yieldと併用してnew I2C()の完了を待ちます。
	 * @name mbedJS.I2C#waitForNew
	 * @function
	 */
	waitForNew:function I2C_waitForNew()
	{
		try{
			if(this._lc!=CLASS){throw new MI.MiMicException(MI.Error.NG_ILLEGAL_CALL);}
			this._lc=CLASS.waitForNew;
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * Hz単位でバスの速度を指定します。
	 * 関数の完了時にonFrequencyイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.I2C#frequency
	 * @function
	 * @param {int} i_hz
	 * Hz単位のバス速度です。
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	frequency:function I2C_frequency(i_hz)
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
	 * 引数が3個の場合
	 * @name mbedJS.I2C#read:1
	 * @function
	 * @param {int} address
	 * 8ビットのI2CSlaveアドレスです。
	 * @param {int} length
	 * 読み出すデータの長さです。256未満の値を指定してください。
	 * @param {boolean} repeated
	 * Repeated start, true - do not send stop at end
	 * Optionalです。省略時はfalseです。
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
	 * 引数が1個の場合
	 * @name mbedJS.I2C#read:2
	 * @function
	 * @param {int} ack
	 * indicates if the byte is to be acknowledged (1 = acknowledge)
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return {int}
	 * Generatorモードの時は読みだした値を返します。
	 */
	/**
	 * バスから値を読み出します。
	 * 関数の完了時にonReadイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.I2C#read
	 * @function
	 * @param ...
	 * 詳細はmbedJS.I2C#read:Nを参照してください。
	 */	
	read:function I2C_read(/*...*/)
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
			//ベース引数の数で処理の切り替え
			if(MI._getBaseArgsLen(arguments)==1){
				MI.assertInt(arguments[0]);
				return _t._mcu.rpc(_t.RPC_NS+":read2",_t._oid+","+arguments[0],rcb);
			}else{
				var a=arguments;
				MI.assertInt([a[0],a[1]]);
				return _t._mcu.rpc(_t.RPC_NS+":read1",_t._oid+","+a[0]+","+a[1]+","+(a[2]?1:0),rcb);
			}
		}catch(e){
			throw new MI.MiMicException(e);
		}
	},
	/**
	 * 引数が3個の場合
	 * @name mbedJS.I2C#write:1
	 * @function
	 * @param {int} address
	 * 8ビットのI2CSlaveアドレスです。
	 * @param {byte[]} data
	 * 送信するデータを格納したバイト配列です。
	 * @param {boolean} repeated
	 * Repeated start, true - do not send stop at end
	 * Optionalです。省略時はfalseです。
	 * @return {int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 * @return {int}
	 * Generatorモードの時は成功/失敗フラグを返します。ACK:0(成功),NACK:それ以外です。
	 */
	/**
	 * 引数が1個の場合
	 * @name mbedJS.I2C#write:2
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
	 * @name mbedJS.I2C#write
	 * @function
	 * @param ...
	 * 詳細はmbedJS.I2C#write:Nを参照してください。
	 */	
	write:function I2C_write(/*...*/)
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
			if(MI._getBaseArgsLen(arguments)==1){
				MI.assertInt(arguments[0]);
				return _t._mcu.rpc(_t.RPC_NS+":write2",_t._oid+","+arguments[0],rcb);
			}else{
				var a=arguments;
				MI.assertInt(a[0]);
				return _t._mcu.rpc(_t.RPC_NS+":write1",_t._oid+","+a[0]+",\""+MI.byteArray2bstr(a[1])+"\","+(a[2]?1:0),rcb);
			}
		}catch(e){
			throw new MI.MiMicException(e);
		}			
	},
	/**
	 * I2Cバスを開始状態にします。
	 * 関数の完了時にonStartイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.I2C#start
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	start:function I2C_start()
	{
		try{
			var _t=this;
			var cb=MI._getCb(arguments,_t._event.onStart);
			MI._assertYield.call(_t);
			_t._lc=CLASS.start;			
			return _t._mcu.rpc(_t.RPC_NS+":start",_t._oid,
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
	 * I2Cバスを停止状態にします。
	 * 関数の完了時にonStopイベントが発生します。
	 * Generatorモードの時は、yieldと併用して完了を待機できます。
	 * @name mbedJS.I2C#stop
	 * @function
	 * @return　{int}
	 * Callbackモードの時はRPCメソッドのインデクスを返します。
	 */
	stop:function I2C_stop()
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
	 * @name mbedJS.I2C#dispose
	 * @function
	 */
	dispose:function I2C_dispose()
	{
		return this._mcu._dispose.apply(this,arguments);
	}

}
NS.I2C=CLASS;
}());/**
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
}());/**
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