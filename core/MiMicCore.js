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
	NS.VERSION="MiMicJsAPI/2.0.8";
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
		_createSocket:function(i_path){
			return new WebSocket(i_path);
		},
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
			var ws=this._createSocket(i_url);
			ws.onopen = function(){
				if(ev.onOpen){ev.onOpen();}
			}
			ws.onclose = function(){
				if(ev.onClose){ev.onClose();}
			};
			ws.onerror = function(){
				_t.shutdown();
				if(ev.onError){ev.onError();}
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
						if(t=='"'){
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

}());