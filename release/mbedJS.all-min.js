var MiMicJS={};(function(){var w=MiMicJS;w.VERSION="MiMicJsAPI/2.0.3";w.assertInt=function l(y){if(!w.isArray(y)){if(!w.isInt(y)){throw new w.MiMicException()}}for(var z=0;z<y.length;z++){if(w.isInt(y[z])){continue}throw new w.MiMicException('"'+y[z]+'" is not integer.')}};w.assertNumber=function g(y){if(!w.isArray(y)){if(!w.isNumber(y)){throw new w.MiMicException()}}else{for(var z=0;z<y.length;z++){if(w.isNumber(y[z])){continue}throw new w.MiMicException('"'+y[z]+'" is not number.')}}};w.isUndefined=function(y,z){if(arguments.length==1){return y===void 0}return(y===void 0)?z:y};w.isNumber=function n(y){return(typeof y=="number")};w.isInt=function f(y){return(typeof y=="number")&&(y-Math.round(y)==0)};w.isGenerator=function h(y){if(!y){return false}return y.toString().indexOf("Generator")!=-1};w.isFunction=function a(y){return(typeof y=="function")};w.getNow=function o(){return(new Date()).getTime()};w.isArray=function j(y){return y instanceof Array};w.isHashArray=function t(y){return(!(y instanceof Array))&&(typeof y=="object")};w.cloneAssoc=function r(y){var A={};for(var z in y){A[z]=y[z]}return A};w.hexout=function s(z,A){var C=["","0","00","000","0000","00000","000000","0000000"];var B=(z>>>0).toString(16).toLowerCase();if(B.length>A){throw new w.MiMicException(EE.NG)}var y=A-B.length;return C[y]+B};w.assocToStr=function e(y){var z="";for(k in y){z+=k+":"+y[k]+","}return z};w.bswap32=function i(y){return((y<<24)&4278190080)|((y<<8)&16711680)|((y>>8)&65280)|((y>>24)&255)};w.bstr2byteArray=function v(y){var A=new Array();if(y.length%2!=0){throw new w.MiMicException()}for(var z=0;z<y.length;z+=2){A.push(parseInt(y.substr(z,2),16))}return A};w.bstr2uintArray=function u(y){var A=new Array();if(y.length%8!=0){throw new w.MiMicException()}for(var z=0;z<y.length;z+=8){A.push(w.bswap32(parseInt(y.substr(z,8),16)))}return A};w.byteArray2bstr=function d(y){var A=w.isArray(y)?y:[y];var B="";for(var z=0;z<A.length;z++){B+=w.hexout(A[z],2,16)}return B};w.uintArray2bstr=function m(y){var A=w.isArray(y)?y:[y];var B="";for(var z=0;z<A.length;z++){B+=w.hexout(w.bswap32(A[z]),8,16)}return B};w.using=function q(y){for(var z in y){window[z]=y[z]}};w._getCb=function b(z,y){if(z.length==0){return y}return w.isFunction(z[z.length-1])?z[z.length-1]:y};w._getBaseArgsLen=function c(y){if(y.length==0||(!w.isFunction(y[y.length-1]))){return y.length}return y.length==1?0:y.length-1};w._assertYield=function x(){if(this._gen&&this._lc){throw new w.MiMicException(w.Error.NG_YIELD_NOT_COMPLETED)}};w._initHandler=function p(y){if(w.isGenerator(y)){this._gen=y}else{if(w.isFunction(y)){return y}else{if(y){this._event=y;return y.onNew}}}return null}}());(function(){var a=MiMicJS;a.Error={OK:[0,"OK"],NG:[1073741824,"NG"],NG_YIELD_NOT_COMPLETED:[1073745921,"The previous function has not been completed."],NG_ILLEGAL_CALL:[1073745922,"Illegal procedure call."],NG_INVALID_ARG:[1073745923,"Invalid arguments."],isOK:function(b){return(1073741824&b)==0}}}());(function(){var b=MiMicJS;b.MiMicException=function a(){var f;if(typeof arguments.callee.caller=="function"){if(arguments.callee.caller.name.toString().length>0){f="function '"+arguments.callee.caller.name+"."}else{var d=arguments.callee.caller.toString();f="closure '"+d.substring(0,d.indexOf("{"))+"...'"}}else{f="root document"}var e="";switch(arguments.length){case 0:this.code=b.Error.NG[0];this.message=f+" code(0x"+this.code.toString(16)+")"+b.Error.NG[1];return;case 1:var c=arguments[0];if(c instanceof b.MiMicException){this.code=c.code;e="  \nfrom "+c.message}else{if(typeof c=="object"&&c.length==2){this.code=c[0];e=c[1]}else{this.code=b.Error.NG[0];e=b.Error.NG[1]+" "+(((typeof c)!="undefined")?c.toString():"v==undefined")}}this.message=f+" code(0x"+this.code.toString(16)+")"+e;return;default:break}throw new b.MiMicException("Invalid MiMicException argument.")};b.MiMicException.prototype={code:null,message:"",alert:function(){alert(this.message)},toString:function(){return"MiMicException:"+this.message}}}());(function(){var NS=MiMicJS;NS.Rpc=function Rpc(i_event){this._event=(i_event)?i_event:null};NS.Rpc.prototype={_event:null,_ws:null,rtt:0,_method_id:0,open:function open(i_url){var _t=this;if(this._ws){throw new MiMicException()}var q=new Array();var ev=this._event;var ws=new WebSocket(i_url);ws.onopen=function(){if(ev.onOpen){ev.onOpen()}};ws.onclose=function(){if(ev.onClose){ev.onClose()}};ws.error=function(){_t.shutdown();if(ev.onClose){ev.onError()}};var rx="";var rxst=0;var _t=this;ws.onmessage=function(e){for(var i=0;i<e.data.length;i++){var t=e.data[i];switch(rxst){case 2:if(t!='"'){rxst=1}break;case 0:if(t!="{"){continue}rx="({";rxst=1;continue;case 1:switch(t){case'"':rxst=2;break;case"}":rx+="})";rxst=0;var j=eval(rx);for(var i2=q.length-1;i2>=0;i2--){if(q[i2][0]==j.id){var qi=q[i2];q.splice(i2,1);if(qi[1]){qi[1](j)}break}}continue}}rx+=t}};this._method_id=0;this._q=q;this._ws=ws},close:function close(){if(this._ws&&this._ws.readyState==1){this._ws.close();this._ws=null}},shutdown:function shutdown(){var _t=this;if(_t._ws){_t._ws.onopen=function(){_t._ws.close()};_t._ws.onmessage=function(){_t._ws.close()};_t._ws.onclose=function(){_t._ws=null};_t._ws.onerror=function(){_t._ws=null}}},sendMethod:function callJsonRpc(i_method,i_params,i_callback){var v='{"jsonrpc":"2.0","method":"'+i_method+'","params":['+i_params+'],"id":'+this._method_id+"}";this._ws.send(v);this._q.push([this._method_id,i_callback]);this._method_id=(this._method_id+1)&268435455;return this._method_id}}}());var mbedJS={};(function(){var a=mbedJS;a.PinName=function(){var e;var d={};e=65536;for(var b=0;b<=5;b++){for(var c=0;c<=31;c++){d["P"+b+"_"+c]=e+b*32+c}}e=131072;for(var b=5;b<=40;b++){d["p"+b]=e+b}e=196608|0;d.LED1=e+0;d.LED2=e+1;d.LED3=e+2;d.LED4=e+3;e=196608|256;d.USBTX=e+0;d.USBRX=e+1;e=262144;for(var b=0;b<=15;b++){d["D"+b]=e+b}for(var b=0;b<=5;b++){d["A"+b]=e+b+256}d.I2C_SCL=e+512+0;d.I2C_SDA=e+512+1;d.NC=2147483647;return d}();a.PinMode={PullUp:65536,PullDown:65537,PullNone:65538,OpenDrain:65539,PullDefault:65540};a.PortName={Port0:65536,Port1:65537,Port2:65538,Port3:65539,Port4:65540,Port4:65541}}());(function(){var e=mbedJS;var c=MiMicJS;var f=function h(j,o,n){try{var l=this;l._mcu=j;l._lc=f;var i=c._initHandler.call(l,n);c.assertInt(o);l._mcu.rpc(l.RPC_NS+":_new1",o,function(p){l._oid=p.result[0];if(i){i()}if(l._gen){l._gen.next(l)}l._lc=null})}catch(m){throw new c.MiMicException(m)}};f.prototype={RPC_NS:"mbedJS:AnalogIn",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function d(){try{if(this._lc!=f){throw new c.MiMicException(c.Error.NG_ILLEGAL_CALL)}this._lc=f.waitForNew}catch(i){throw new c.MiMicException(i)}},read:function b(){try{var j=this;var i=c._getCb(arguments,j._event.onRead);c._assertYield.call(j);j._lc=f.read;return j._mcu.rpc(j.RPC_NS+":read_fx",j._oid,function(n){var m=n.result[0]/10000;if(i){i(m)}if(j._gen){j._gen.next(m)}j._lc=null})}catch(l){throw new c.MiMicException(l)}},read_u16:function g(){try{var j=this;var i=c._getCb(arguments,j._event.onRead_u16);c._assertYield.call(j);j._lc=f.read_u16;return j._mcu.rpc(j.RPC_NS+":read_u16",j._oid,function(n){var m=n.result[0];if(i){i(m)}if(j._gen){j._gen.next(m)}j._lc=null})}catch(l){throw new c.MiMicException(l)}},dispose:function a(){return this._mcu._dispose.apply(this,arguments)}};e.AnalogIn=f}());(function(){var d=mbedJS;var a=MiMicJS;var i=function b(l,p,o){try{var m=this;m._mcu=l;m._lc=i;var j=a._initHandler.call(m,o);a.assertInt(p);m._mcu.rpc(m.RPC_NS+":_new1",p,function(q){m._oid=q.result[0];if(j){j()}if(m._gen){m._gen.next(m)}m._lc=null})}catch(n){throw new a.MiMicException(n)}};i.prototype={RPC_NS:"mbedJS:AnalogOut",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function h(){try{if(this._lc!=i){throw new a.MiMicException(a.Error.NG_ILLEGAL_CALL)}this._lc=i.waitForNew}catch(j){throw new a.MiMicException(j)}},write:function f(l){try{var m=this;var j=a._getCb(arguments,m._event.onWrite);a._assertYield.call(m);m._lc=i.write;a.assertNumber(l);return m._mcu.rpc(m.RPC_NS+":write_fx",m._oid+","+Math.round(l*10000),function(o){if(j){j()}if(m._gen){m._gen.next()}m._lc=null})}catch(n){throw new a.MiMicException(n)}},write_u16:function g(l){try{var m=this;var j=a._getCb(arguments,m._event.onWrite_u16);a._assertYield.call(m);m._lc=i.write;a.assertInt(l);return m._mcu.rpc(m.RPC_NS+":write_u16",m._oid+","+l,function(o){if(j){j()}if(m._gen){m._gen.next()}m._lc=null})}catch(n){throw new a.MiMicException(n)}},read:function c(){try{var l=this;var j=a._getCb(arguments,l._event.onRead);a._assertYield.call(l);l._lc=i.read;return l._mcu.rpc(l.RPC_NS+":read_fx",l._oid,function(o){var n=o.result[0]/10000;if(j){j(n)}if(l._gen){l._gen.next(n)}l._lc=null})}catch(m){throw new a.MiMicException(m)}},dispose:function e(){return this._mcu._dispose.apply(this,arguments)}};d.AnalogOut=i}());(function(){var f=mbedJS;var d=MiMicJS;var g=function e(l,j,o){try{var s=this;s._mcu=l;s._lc=g;var m=d._initHandler.call(s,o);var p=j;if(p.length<1||p.length>16){throw new d.MiMicException(d.NG_INVALID_ARG)}d.assertInt(p);var n=p[0];var q=1;for(;q<j.length;q++){n+=","+p[q]}for(;q<16;q++){n+=","+f.PinName.NC}s._mcu.rpc(s.RPC_NS+":_new1",n,function(i){s._oid=i.result[0];if(m){m()}if(s._gen){s._gen.next(s)}s._lc=null})}catch(r){throw new d.MiMicException(r)}};g.prototype={RPC_NS:"mbedJS:BusIn",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function h(){try{if(this._lc!=g){throw new d.MiMicException(d.Error.NG_ILLEGAL_CALL)}this._lc=g.waitForNew}catch(i){throw new d.MiMicException(i)}},read:function b(){try{var j=this;var i=d._getCb(arguments,j._event.onRead);d._assertYield.call(j);j._lc=g.read;return j._mcu.rpc(j.RPC_NS+":read",j._oid,function(n){var m=n.result[0];if(i){i(m)}if(j._gen){j._gen.next(m)}j._lc=null})}catch(l){throw new d.MiMicException(l)}},mode:function c(j){try{var l=this;var i=d._getCb(arguments,l._event.onMode);d._assertYield.call(l);d.assertInt(j);return l._mcu.rpc(l.RPC_NS+":mode",l._oid+","+j,function(o){var n=o.result[0];if(i){i(n)}if(l._gen){l._gen.next(n)}l._lc=null})}catch(m){throw new d.MiMicException(m)}},dispose:function a(){return this._mcu._dispose.apply(this,arguments)}};f.BusIn=g}());(function(){var c=mbedJS;var a=MiMicJS;var j=function e(n,m,q){try{var u=this;u._mcu=n;u._lc=j;var o=a._initHandler.call(u,q);var r=m;a.assertInt(r);if(r.length<1||r.length>16){throw new a.MiMicException(a.NG_INVALID_ARG)}var p=r[0];var s=1;for(;s<m.length;s++){p+=","+r[s]}for(;s<16;s++){p+=","+c.PinName.NC}u._mcu.rpc(u.RPC_NS+":_new1",p,function(v){u._oid=v.result[0];if(o){o()}if(u._gen){u._gen.next(u)}u._lc=null})}catch(t){throw new a.MiMicException(t)}};j.prototype={RPC_NS:"mbedJS:BusInOut",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function d(){try{if(this._lc!=j){throw new a.MiMicException(a.Error.NG_ILLEGAL_CALL)}this._lc=j.waitForNew}catch(m){throw new a.MiMicException(m)}},write:function f(n){try{var o=this;var m=a._getCb(arguments,o._event.onWrite);a._assertYield.call(o);o._lc=j.write;a.assertInt(n);return o._mcu.rpc(o.RPC_NS+":write",o._oid+","+n,function(q){if(m){m()}if(o._gen){o._gen.next()}o._lc=null})}catch(p){throw new a.MiMicException(p)}},read:function l(){try{var n=this;var m=a._getCb(arguments,n._event.onRead);a._assertYield.call(n);n._lc=j.read;return n._mcu.rpc(n.RPC_NS+":read",n._oid,function(q){var p=q.result[0];if(m){m(p)}if(n._gen){n._gen.next(p)}n._lc=null})}catch(o){throw new a.MiMicException(o)}},mode:function g(n){try{var o=this;var m=a._getCb(arguments,o._event.onMode);a._assertYield.call(o);o._lc=j.mode;a.assertInt(n);return o._mcu.rpc(o.RPC_NS+":mode",o._oid+","+n,function(r){var q=r.result[0];if(m){m(q)}if(o._gen){o._gen.next(q)}o._lc=null})}catch(p){throw new a.MiMicException(p)}},input:function b(){try{var n=this;var m=a._getCb(arguments,n._event.onInput);a._assertYield.call(n);n._lc=j.input;return n._mcu.rpc(n.RPC_NS+":input",n._oid,function(p){if(m){m()}if(n._gen){n._gen.next()}n._lc=null})}catch(o){throw new a.MiMicException(o)}},output:function i(){try{var n=this;var m=a._getCb(arguments,n._event.onOutput);a._assertYield.call(n);n._lc=j.mode;return n._mcu.rpc(n.RPC_NS+":output",n._oid,function(p){if(m){m()}if(n._gen){n._gen.next()}n._lc=null})}catch(o){throw new a.MiMicException(o)}},dispose:function h(){return this._mcu._dispose.apply(this,arguments)}};c.BusInOut=j}());(function(){var f=mbedJS;var c=MiMicJS;var h=function d(l,j,o){try{var s=this;s._mcu=l;s._lc=h;var m=c._initHandler.call(s,o);var p=j;if(p.length<1||p.length>16){throw new c.MiMicException(c.NG_INVALID_ARG)}c.assertInt(p);var n=p[0];var q=1;for(;q<j.length;q++){n+=","+p[q]}for(;q<16;q++){n+=","+f.PinName.NC}s._mcu.rpc(s.RPC_NS+":_new1",n,function(i){s._oid=i.result[0];if(m){m()}if(s._gen){s._gen.next(s)}s._lc=null})}catch(r){throw new c.MiMicException(r)}};h.prototype={RPC_NS:"mbedJS:BusOut",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function b(){try{if(this._lc!=h){throw new c.MiMicException(c.Error.NG_ILLEGAL_CALL)}this._lc=h.waitForNew}catch(i){throw new c.MiMicException(i)}},write:function e(j){try{var l=this;var i=c._getCb(arguments,l._event.onWrite);c._assertYield.call(l);l._lc=h.write;c.assertInt(j);return l._mcu.rpc(l.RPC_NS+":write",l._oid+","+j,function(n){if(i){i()}if(l._gen){l._gen.next()}l._lc=null})}catch(m){throw new c.MiMicException(m)}},read:function a(){try{var j=this;var i=c._getCb(arguments,j._event.onRead);c._assertYield.call(j);j._lc=h.read;return j._mcu.rpc(j.RPC_NS+":read",j._oid,function(n){var m=n.result[0];if(i){i(m)}if(j._gen){j._gen.next(m)}j._lc=null})}catch(l){throw new c.MiMicException(l)}},dispose:function g(){return this._mcu._dispose.apply(this,arguments)}};f.BusOut=h}());(function(){var f=mbedJS;var e=MiMicJS;var g=function h(j,o,n){try{var l=this;l._mcu=j;l._lc=g;var i=e._initHandler.call(l,n);e.assertInt(o);l._mcu.rpc(l.RPC_NS+":_new1",o,function(p){l._oid=p.result[0];if(i){i()}if(l._gen){l._gen.next(l)}l._lc=null})}catch(m){throw new e.MiMicException(m)}};g.prototype={RPC_NS:"mbedJS:DigitalIn",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function d(){try{if(this._lc!=g){throw new e.MiMicException(e.Error.NG_ILLEGAL_CALL)}this._lc=g.waitForNew}catch(i){throw new e.MiMicException(i)}},read:function b(){try{var j=this;var i=e._getCb(arguments,j._event.onRead);e._assertYield.call(j);j._lc=g.read;return j._mcu.rpc(j.RPC_NS+":read",j._oid,function(n){var m=n.result[0];if(i){i(m)}if(j._gen){j._gen.next(m)}j._lc=null})}catch(l){throw new e.MiMicException(l)}},mode:function c(j){try{var l=this;var i=e._getCb(arguments,l._event.onMode);e._assertYield.call(l);l._lc=g.mode;e.assertInt(j);return l._mcu.rpc(l.RPC_NS+":mode",l._oid+","+j,function(o){var n=o.result[0];if(i){i(n)}if(l._gen){l._gen.next(n)}l._lc=null})}catch(m){throw new e.MiMicException(m)}},dispose:function a(){return this._mcu._dispose.apply(this,arguments)}};f.DigitalIn=g}());(function(){var c=mbedJS;var b=MiMicJS;var f=function h(j,p,o){try{var m=this;m._mcu=j;m._lc=f;var i=b._initHandler.call(m,o);function l(r){m._oid=r.result[0];if(i){i()}if(m._gen){m._gen.next(m)}m._lc=null}var q;if(b.isHashArray(p)){q=[p.pin,p.value]}else{if(b.isArray(p)){q=[p[0],null]}else{q=[p,null]}}b.assertInt(q[0]);if(q[1]){b.assertInt(q[1]);m._mcu.rpc(m.RPC_NS+":_new2",q[0]+","+q[1],l)}else{m._mcu.rpc(m.RPC_NS+":_new1",q[0],l)}}catch(n){throw new b.MiMicException(n)}};f.prototype={RPC_NS:"mbedJS:DigitalOut",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function g(){try{if(this._lc!=f){throw new b.MiMicException(b.Error.NG_ILLEGAL_CALL)}this._lc=f.waitForNew}catch(i){throw new b.MiMicException(i)}},write:function a(j){try{var l=this;var i=b._getCb(arguments,l._event.onWrite);b._assertYield.call(l);l._lc=f.write;b.assertInt(j);return l._mcu.rpc(l.RPC_NS+":write",l._oid+","+j,function(n){if(i){i()}if(l._gen){l._gen.next()}l._lc=null})}catch(m){throw new b.MiMicException(m)}},read:function e(){try{var j=this;var i=b._getCb(arguments,j._event.onRead);b._assertYield.call(j);j._lc=f.read;return j._mcu.rpc(j.RPC_NS+":read",j._oid,function(n){var m=n.result[0];if(i){i(m)}if(j._gen){j._gen.next(m)}j._lc=null})}catch(l){throw new b.MiMicException(l)}},dispose:function d(){return this._mcu._dispose.apply(this,arguments)}};c.DigitalOut=f}());(function(){var f=mbedJS;var d=MiMicJS;var g=function c(l,n){var j=this;j._lc=g;j._has_error=false;if(d.isGenerator(n)){j._gen=n}else{if(n){j._event=n}}j._rpc=new d.Rpc({onOpen:function m(){if(j._event.onNew){j._event.onNew()}if(j._gen){j._gen.next(j)}j.lc=null},onClose:function o(){if(j._lc==g.close){if(j._event.onClose){j._event.onClose()}}else{if(j._event.onError){j._event.onError()}}if(j._gen){j._gen.next(j)}j.lc=null},onError:function i(){j._has_error=true;if(j._event.onError){j._event.onError()}if(j._gen&&j._lc){j._gen.throw(new d.MiMicException())}}});this._rpc.open("ws://"+l+"/rpc/")};g.prototype={RPC_NS:"mbedJS:Mcu",_lc:null,_rpc:null,_gen:null,_event:{},_has_error:false,hasError:function(){return _t._has_error},waitForNew:function e(){if(this._lc!=g){throw new d.MiMicException(d.Error.NG_ILLEGAL_CALL)}this._lc=g.waitForNew},close:function b(){d._assertYield.call(this);this._lc=g.close;this._rpc.close()},shutdown:function a(){this._rpc.shutdown()},rpc:function h(i,j,l){if(this._has_error){throw new d.MiMicException()}return this._rpc.sendMethod(i,j,l)},addItem:function(i){this._items.push(i)},getInfo:function(){try{var j=this;d._assertYield.call(j);var i=d._getCb(arguments,j._event.onGetInfo);j._lc=g.getInfo;return j.rpc(j.RPC_NS+":getInfo","",function(n){var o=n.result;var m={version:o[0],platform:o[1],mcu:{name:o[3],eth:o[2]},memory:{free:o[4]}};if(i){i(m)}if(j._gen){j._gen.next(m)}j._lc=null})}catch(l){throw new d.MiMicException(l)}},disposeObject:function(m){try{var j=this;d._assertYield.call(j);var i=d._getCb(arguments,j._event.onDisposeObject);j._lc=g.disposeObject;return j.rpc(j.RPC_NS+":disposeObject",m,function(o){var n=o.result[0]?true:false;if(i){i(n)}if(j._gen){j._gen.next(n)}j._lc=null})}catch(l){throw new d.MiMicException(l)}},_dispose:function(){try{var j=this;d._assertYield.call(j);var i=d._getCb(arguments,j._event.onDispose);j._lc=j.dispose;return j._mcu.rpc(j._mcu.RPC_NS+":disposeObject",j._oid,function(n){var m=n.result[0]?true:false;if(i){i(m)}if(j._gen){j._gen.next(m)}j._lc=null})}catch(l){throw new d.MiMicException(l)}}};f.Mcu=g}());(function(){var e=mbedJS;var b=MiMicJS;var f=function d(i,n,m){try{var j=this;j._mcu=i;j._lc=f;var h=b._initHandler.call(j,m);var o;if(b.isHashArray(n)){o=[n.port,n.mask]}else{if(b.isArray(n)){o=n}}b.assertInt(o);j._mcu.rpc(j.RPC_NS+":_new1",o[0]+","+o[1],function(p){j._oid=p.result[0];if(h){h()}if(j._gen){j._gen.next(j)}j._lc=null})}catch(l){throw new b.MiMicException(l)}};f.prototype={RPC_NS:"mbedJS:PortIn",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function a(){try{if(this._lc!=f){throw new b.MiMicException(b.Error.NG_ILLEGAL_CALL)}this._lc=f.waitForNew}catch(h){throw new b.MiMicException(h)}},read:function g(){try{var i=this;var h=b._getCb(arguments,i._event.onRead);b._assertYield.call(i);i._lc=f.read;return i._mcu.rpc(i.RPC_NS+":read",i._oid,function(m){var l=m.result[0];if(h){h(l)}if(i._gen){i._gen.next(l)}i._lc=null})}catch(j){throw new b.MiMicException(j)}},dispose:function c(){return this._mcu._dispose.apply(this,arguments)}};e.PortIn=f}());(function(){var f=mbedJS;var d=MiMicJS;var g=function b(j,o,n){try{var l=this;l._mcu=j;l._lc=g;var i=d._initHandler.call(l,n);var p;if(d.isHashArray(o)){p=[o.port,o.mask]}else{if(d.isArray(o)){p=o}}d.assertInt(p);l._mcu.rpc(l.RPC_NS+":_new1",p[0]+","+p[1],function(q){l._oid=q.result[0];if(i){i()}if(l._gen){l._gen.next(l)}l._lc=null})}catch(m){throw new d.MiMicException(m)}};g.prototype={RPC_NS:"mbedJS:PortOut",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function h(){try{if(this._lc!=g){throw new d.MiMicException(d.Error.NG_ILLEGAL_CALL)}this._lc=g.waitForNew}catch(i){throw new d.MiMicException(i)}},write:function e(j){try{var l=this;var i=d._getCb(arguments,l._event.onWrite);d._assertYield.call(l);l._lc=g.write;d.assertInt(j);return l._mcu.rpc(l.RPC_NS+":write",l._oid+","+j,function(n){if(i){i()}if(l._gen){l._gen.next()}l._lc=null})}catch(m){throw new d.MiMicException(m)}},read:function c(){try{var j=this;var i=d._getCb(arguments,j._event.onRead);d._assertYield.call(j);j._lc=g.read;return j._mcu.rpc(j.RPC_NS+":read",j._oid,function(n){var m=n.result[0];if(i){i(m)}if(j._gen){j._gen.next(m)}j._lc=null})}catch(l){throw new d.MiMicException(l)}},dispose:function a(){return this._mcu._dispose.apply(this,arguments)}};f.PortOut=g}());(function(){var h=mbedJS;var c=MiMicJS;var o=function i(q,u,t){try{var r=this;r._mcu=q;r._lc=o;var p=c._initHandler.call(r,t);c.assertInt(u);r._mcu.rpc(r.RPC_NS+":_new1",u,function(v){r._oid=v.result[0];if(p){p()}if(r._gen){r._gen.next(r)}r._lc=null})}catch(s){throw new c.MiMicException(s)}};o.prototype={RPC_NS:"mbedJS:PwmOut",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function b(){try{if(this._lc!=o){throw new c.MiMicException(c.Error.NG_ILLEGAL_CALL)}this._lc=o.waitForNew}catch(p){throw new c.MiMicException(p)}},write:function l(q){try{var r=this;var p=c._getCb(arguments,r._event.onWrite);c._assertYield.call(r);r._lc=o.write;c.assertNumber(q);return r._mcu.rpc(r.RPC_NS+":write_fx",r._oid+","+Math.round(q*10000),function(t){if(p){p()}if(r._gen){r._gen.next()}r._lc=null})}catch(s){throw new c.MiMicException(s)}},read:function n(){try{var q=this;var p=c._getCb(arguments,q._event.onRead);c._assertYield.call(q);q._lc=o.read;return q._mcu.rpc(q.RPC_NS+":read_fx",q._oid,function(t){var s=t.result[0]/10000;if(p){p(s)}if(q._gen){q._gen.next(s)}q._lc=null})}catch(r){throw new c.MiMicException(r)}},period:function m(q){try{var r=this;var p=c._getCb(arguments,r._event.onPeriod);c._assertYield.call(r);r._lc=o.period;c.assertInt(q);return r._mcu.rpc(r.RPC_NS+":period_fx",r._oid+","+Math.round(q*10000),function(t){if(p){p()}if(r._gen){r._gen.next()}r._lc=null})}catch(s){throw new c.MiMicException(s)}},period_ms:function e(q){try{var r=this;var p=c._getCb(arguments,r._event.onPeriod_ms);c._assertYield.call(r);r._lc=o.period_ms;c.assertInt(q);return r._mcu.rpc(r.RPC_NS+":period_ms",r._oid+","+q,function(t){if(p){p()}if(r._gen){r._gen.next()}r._lc=null})}catch(s){throw new c.MiMicException(s)}},period_us:function j(q){try{var r=this;var p=c._getCb(arguments,r._event.onPeriod_us);c._assertYield.call(r);r._lc=o.period_us;c.assertInt(q);return r._mcu.rpc(r.RPC_NS+":period_us",r._oid+","+q,function(t){if(p){p()}if(r._gen){r._gen.next()}r._lc=null})}catch(s){throw new c.MiMicException(s)}},pulsewidth:function d(q){try{var r=this;var p=c._getCb(arguments,r._event.onPulsewidth);c._assertYield.call(r);r._lc=o.pulsewidth;c.assertInt(q);return r._mcu.rpc(r.RPC_NS+":pulsewidth_fx",r._oid+","+Math.round(q*10000),function(t){if(p){p()}if(r._gen){r._gen.next()}r._lc=null})}catch(s){throw new c.MiMicException(s)}},pulsewidth_ms:function a(q){try{var r=this;var p=c._getCb(arguments,r._event.onPulsewidth_ms);c._assertYield.call(r);r._lc=o.pulsewidth_ms;c.assertInt(q);return r._mcu.rpc(r.RPC_NS+":pulsewidth_ms",r._oid+","+q,function(t){if(p){p()}if(r._gen){r._gen.next()}r._lc=null})}catch(s){throw new c.MiMicException(s)}},pulsewidth_us:function g(q){try{var r=this;var p=c._getCb(arguments,r._event.onPulsewidth_us);c._assertYield.call(r);r._lc=o.pulsewidth_us;c.assertInt(q);return r._mcu.rpc(r.RPC_NS+":pulsewidth_us",r._oid+","+q,function(t){if(p){p()}if(r._gen){r._gen.next()}r._lc=null})}catch(s){throw new c.MiMicException(s)}},dispose:function f(){return this._mcu._dispose.apply(this,arguments)}};h.PwmOut=o}());(function(){var e=mbedJS;var b=MiMicJS;var i=function a(l,p,o){try{var m=this;m._mcu=l;m._lc=i;var j=b._initHandler.call(m,o);b.assertInt(p);m._mcu.rpc(m.RPC_NS+":_new1",p[0]+","+p[1]+","+p[2]+","+e.PinName.NC,function(q){m._oid=q.result[0];if(j){j()}if(m._gen){m._gen.next(m)}m._lc=null})}catch(n){throw new b.MiMicException(n)}};i.prototype={RPC_NS:"mbedJS:SPI",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function g(){try{if(this._lc!=i){throw new b.MiMicException(b.Error.NG_ILLEGAL_CALL)}this._lc=i.waitForNew}catch(j){throw new b.MiMicException(j)}},write:function c(l){try{var m=this;b._assertYield.call(m);var j=b._getCb(arguments,m._event.onWrite);m._lc=i.write;b.assertInt(l);return m._mcu.rpc(m.RPC_NS+":write",m._oid+","+l,function(p){var o=p.result[0];if(j){j(o)}if(m._gen){m._gen.next(o)}m._lc=null})}catch(n){throw new b.MiMicException(n)}},frequency:function d(l){try{var m=this;b._assertYield.call(m);var j=b._getCb(arguments,m._event.onFrequency);m._lc=i.frequency;b.assertInt(l);return m._mcu.rpc(m.RPC_NS+":frequency",m._oid+","+l,function(o){if(j){j()}if(m._gen){m._gen.next()}m._lc=null})}catch(n){throw new b.MiMicException(n)}},format:function h(l,m){try{var n=this;b._assertYield.call(n);var j=b._getCb(arguments,n._event.onFormat);n._lc=i.format;var p=m?m:0;b.assertInt([l,p]);return n._mcu.rpc(n.RPC_NS+":format",n._oid+","+l+","+p,function(q){if(j){j()}if(n._gen){n._gen.next()}n._lc=null})}catch(o){throw new b.MiMicException(o)}},dispose:function f(){return this._mcu._dispose.apply(this,arguments)}};e.SPI=i}());(function(){var d=mbedJS;var a=MiMicJS;var l=function c(n,r,q){try{var o=this;o._mcu=n;o._lc=l;var m=a._initHandler.call(o,q);a.assertInt(r);o._mcu.rpc(o.RPC_NS+":_new1",r[0]+","+r[1]+","+r[2]+","+r[3],function(s){o._oid=s.result[0];if(m){m()}if(o._gen){o._gen.next(o)}o._lc=null})}catch(p){throw new a.MiMicException(p)}};l.prototype={RPC_NS:"mbedJS:SPISlave",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function b(){try{if(this._lc!=l){throw new a.MiMicException(a.Error.NG_ILLEGAL_CALL)}this._lc=l.waitForNew}catch(m){throw new a.MiMicException(m)}},frequency:function j(n){try{var o=this;a._assertYield.call(o);var m=a._getCb(arguments,o._event.onFrequency);o._lc=l.frequency;a.assertInt(n);return o._mcu.rpc(o.RPC_NS+":frequency",o._oid+","+n,function(q){if(m){m()}if(o._gen){o._gen.next()}o._lc=null})}catch(p){throw new a.MiMicException(p)}},format:function h(n,o){try{var p=this;a._assertYield.call(p);var m=a._getCb(arguments,p._event.onFormat);p._lc=l.format;var r=o?o:0;a.assertInt([n,r]);return p._mcu.rpc(p.RPC_NS+":format",p._oid+","+n+","+r,function(s){if(m){m()}if(p._gen){p._gen.next()}p._lc=null})}catch(q){throw new a.MiMicException(q)}},read:function g(){try{var n=this;a._assertYield.call(n);var m=a._getCb(arguments,n._event.onRead);n._lc=l.read;return n._mcu.rpc(n.RPC_NS+":read",n._oid,function(q){var p=q.result[0];if(m){m(p)}if(n._gen){n._gen.next(p)}n._lc=null})}catch(o){throw new a.MiMicException(o)}},receive:function e(){try{var n=this;a._assertYield.call(n);var m=a._getCb(arguments,n._event.onReceive);n._lc=l.receive;return n._mcu.rpc(n.RPC_NS+":receive",n._oid,function(q){var p=q.result[0];if(m){m(p)}if(n._gen){n._gen.next(p)}n._lc=null})}catch(o){throw new a.MiMicException(o)}},reply:function f(n){try{var o=this;a._assertYield.call(o);var m=a._getCb(arguments,o._event.onReply);o._lc=l.reply;a.assertInt(n);return o._mcu.rpc(o.RPC_NS+":reply",o._oid+","+n,function(q){if(m){m()}if(o._gen){o._gen.next()}o._lc=null})}catch(p){throw new a.MiMicException(p)}},dispose:function i(){return this._mcu._dispose.apply(this,arguments)}};d.SPISlave=l}());(function(){var c=mbedJS;var b=MiMicJS;var i=function g(l,o){try{var m=this;m._mcu=l;m._lc=i;var j=b._initHandler.call(m,o);m._mcu.rpc(m.RPC_NS+":init","",function(p){if(j){j()}if(m._gen){m._gen.next(m)}m._lc=null})}catch(n){throw new b.MiMicException(n)}};i.prototype={RPC_NS:"MiMic:Memory",_lc:null,_gen:null,_event:{},waitForNew:function e(){try{if(this._lc!=i){throw new b.MiMicException(b.Error.NG_ILLEGAL_CALL)}this._lc=i.waitForNew}catch(j){throw new b.MiMicException(j)}},read:function d(m,p){try{var n=this;var j=b._getCb(arguments,n._event.onRead);b._assertYield.call(n);n._lc=i.read;var l=[m,(b._getBaseArgsLen(arguments)==1)?p:1];b.assertInt(l);return n._mcu.rpc(n.RPC_NS+":read",l[0]+","+l[1],function(r){var q=b.bstr2byteArray(r.result[0]);if(j){j(q)}if(n._gen){n._gen.next(q)}n._lc=null})}catch(o){throw new b.MiMicException(o)}},write:function h(m,l){try{var n=this;var j=b._getCb(arguments,n._event.onWrite);b._assertYield.call(n);n._lc=i.write;b.assertInt(m);b.assertInt(l);return n._mcu.rpc(n.RPC_NS+":write",m+',"'+b.byteArray2bstr(l)+'"',function(p){if(j){j()}if(n._gen){n._gen.next()}n._lc=null})}catch(o){throw new b.MiMicException(o)}},read32:function f(m,p){try{var n=this;var j=b._getCb(arguments,n._event.onRead32);b._assertYield.call(n);n._lc=i.read32;var l=[m,(b._getBaseArgsLen(arguments)==1)?4:p];if(l[1]%4!=0){throw new b.MiMicException(b.Error.NG_INVALID_ARG)}b.assertInt(l);return n._mcu.rpc(n.RPC_NS+":read",l[0]+","+l[1],function(r){var q=b.bstr2uintArray(r.result[0]);if(j){j(q)}if(n._gen){n._gen.next(q)}n._lc=null})}catch(o){throw new b.MiMicException(o)}},write32:function a(m,l){try{var n=this;var j=b._getCb(arguments,n._event.onWrite32);b._assertYield.call(n);n._lc=i.write32;b.assertInt(m);b.assertInt(l);return n._mcu.rpc(n.RPC_NS+":write",m+',"'+b.uintArray2bstr(l)+'"',function(p){if(j){j()}if(n._gen){n._gen.next()}n._lc=null})}catch(o){throw new b.MiMicException(o)}}};c.Memory=i}());(function(){var d=mbedJS;var a=MiMicJS;var l=function g(n,r,q){try{var o=this;o._mcu=n;o._lc=l;var m=a._initHandler.call(o,q);a.assertInt(r);o._mcu.rpc(o.RPC_NS+":_new1",r[0]+","+r[1],function(s){o._oid=s.result[0];if(m){m()}if(o._gen){o._gen.next(o)}o._lc=null})}catch(p){throw new a.MiMicException(p)}};l.prototype={RPC_NS:"mbedJS:I2C",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function i(){try{if(this._lc!=l){throw new a.MiMicException(a.Error.NG_ILLEGAL_CALL)}this._lc=l.waitForNew}catch(m){throw new a.MiMicException(m)}},frequency:function j(n){try{var o=this;var m=a._getCb(arguments,o._event.onFrequency);a._assertYield.call(o);o._lc=l.frequency;a.assertInt(n);return o._mcu.rpc(o.RPC_NS+":frequency",o._oid+","+n,function(q){if(m){m()}if(o._gen){o._gen.next()}o._lc=null})}catch(p){throw new a.MiMicException(p)}},read:function f(){try{var p=this;var m=a._getCb(arguments,p._event.onRead);a._assertYield.call(p);p._lc=l.read;function o(s){var r=s.result.length>1?{ret:s.result[0],data:a.bstr2byteArray(s.result[1])}:s.result[0];if(m){m(r)}if(p._gen){p._gen.next(r)}p._lc=null}if(a._getBaseArgsLen(arguments)==1){a.assertInt(arguments[0]);return p._mcu.rpc(p.RPC_NS+":read2",p._oid+","+arguments[0],o)}else{var n=arguments;a.assertInt([n[0],n[1]]);return p._mcu.rpc(p.RPC_NS+":read1",p._oid+","+n[0]+","+n[1]+","+(n[2]?1:0),o)}}catch(q){throw new a.MiMicException(q)}},write:function b(){try{var p=this;var m=a._getCb(arguments,p._event.onWrite);a._assertYield.call(p);p._lc=l.write;function o(s){var r=s.result[0];if(m){m(r)}if(p._gen){p._gen.next(r)}p._lc=null}if(a._getBaseArgsLen(arguments)==1){a.assertInt(arguments[0]);return p._mcu.rpc(p.RPC_NS+":write2",p._oid+","+arguments[0],o)}else{var n=arguments;a.assertInt(n[0]);return p._mcu.rpc(p.RPC_NS+":write1",p._oid+","+n[0]+',"'+a.byteArray2bstr(n[1])+'",'+(n[2]?1:0),o)}}catch(q){throw new a.MiMicException(q)}},start:function e(){try{var n=this;var m=a._getCb(arguments,n._event.onStart);a._assertYield.call(n);n._lc=l.start;return n._mcu.rpc(n.RPC_NS+":start",n._oid,function(p){if(m){m()}if(n._gen){n._gen.next()}n._lc=null})}catch(o){throw new a.MiMicException(o)}},stop:function h(){try{var n=this;var m=a._getCb(arguments,n._event.onStop);a._assertYield.call(n);n._lc=l.stop;return n._mcu.rpc(n.RPC_NS+":stop",n._oid,function(p){if(m){m()}if(n._gen){n._gen.next()}n._lc=null})}catch(o){throw new a.MiMicException(o)}},dispose:function c(){return this._mcu._dispose.apply(this,arguments)}};d.I2C=l}());(function(){var b=mbedJS;var a=MiMicJS;var m=function g(o,s,r){try{var p=this;p._mcu=o;p._lc=m;var n=a._initHandler.call(p,r);a.assertInt(s);p._mcu.rpc(p.RPC_NS+":_new1",s[0]+","+s[1],function(t){p._oid=t.result[0];if(n){n()}if(p._gen){p._gen.next(p)}p._lc=null})}catch(q){throw new a.MiMicException(q)}};m.RxStatus={NoData:0,ReadAddressed:1,WriteGeneral:2,WriteAddressed:3};m.prototype={RPC_NS:"mbedJS:I2CSlave",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function h(){try{if(this._lc!=m){throw new a.MiMicException(a.Error.NG_ILLEGAL_CALL)}this._lc=m.waitForNew}catch(n){throw new a.MiMicException(n)}},address:function l(o){try{var p=this;var n=a._getCb(arguments,p._event.onAddress);a._assertYield.call(p);p._lc=m.write;a.assertInt(o);return p._mcu.rpc(p.RPC_NS+":address",p._oid+","+o,function(r){if(n){n()}if(p._gen){p._gen.next()}p._lc=null})}catch(q){throw new a.MiMicException(q)}},frequency:function f(o){try{var p=this;var n=a._getCb(arguments,p._event.onFrequency);a._assertYield.call(p);p._lc=m.frequency;a.assertInt(o);return p._mcu.rpc(p.RPC_NS+":frequency",p._oid+","+o,function(r){if(n){n()}if(p._gen){p._gen.next()}p._lc=null})}catch(q){throw new a.MiMicException(q)}},read:function d(){try{var p=this;var n=a._getCb(arguments,p._event.onRead);a._assertYield.call(p);p._lc=m.read;function o(s){var r=s.result.length>1?{ret:s.result[0],data:a.bstr2byteArray(s.result[1])}:s.result[0];if(n){n(r)}if(p._gen){p._gen.next(r)}p._lc=null}if(a._getBaseArgsLen(arguments)==0){return p._mcu.rpc(p.RPC_NS+":read2",p._oid,o)}else{a.assertInt(arguments[0]);return p._mcu.rpc(p.RPC_NS+":read1",p._oid+","+arguments[0],o)}}catch(q){throw new a.MiMicException(q)}},receive:function e(){try{var o=this;var n=a._getCb(arguments,o._event.onReceive);a._assertYield.call(o);o._lc=m.start;return o._mcu.rpc(o.RPC_NS+":receive",o._oid,function(r){var q=r.result[0];if(n){n(q)}if(o._gen){o._gen.next(q)}o._lc=null})}catch(p){throw new a.MiMicException(p)}},write:function c(){try{var q=this;var n=a._getCb(arguments,q._event.onWrite);a._assertYield.call(q);q._lc=m.write;function p(t){var s=t.result[0];if(n){n(s)}if(q._gen){q._gen.next(s)}q._lc=null}if(!a.isArray(arguments[0])){a.assertInt(arguments[0]);return q._mcu.rpc(q.RPC_NS+":write2",q._oid+","+arguments[0],p)}else{var o=arguments;return q._mcu.rpc(q.RPC_NS+":write1",q._oid+',"'+a.byteArray2bstr(o[0])+'"',p)}}catch(r){throw new a.MiMicException(r)}},stop:function j(){try{var o=this;var n=a._getCb(arguments,o._event.onStop);a._assertYield.call(o);o._lc=m.stop;return o._mcu.rpc(o.RPC_NS+":stop",o._oid,function(q){if(n){n()}if(o._gen){o._gen.next()}o._lc=null})}catch(p){throw new a.MiMicException(p)}},dispose:function i(){return this._mcu._dispose.apply(this,arguments)}};b.I2CSlave=m}());(function(){var c=mbedJS;var a=MiMicJS;var o=function h(r,v,u){try{var s=this;var q;s._mcu=r;s._lc=o;var q=a._initHandler.call(s,u);a.assertInt(v);s._mcu.rpc(s.RPC_NS+":_new1",v[0]+","+v[1],function(w){s._oid=w.result[0];if(q){q()}if(s._gen){s._gen.next(s)}s._lc=null})}catch(t){throw new a.MiMicException(t)}};o.Parity={None:0,Odd:1,Even:2,Forced1:3,Forced0:4};o.prototype={RPC_NS:"mbedJS:Serial",_lc:null,_gen:null,_event:{},_oid:null,waitForNew:function l(){try{if(this._lc!=o){throw new a.MiMicException(a.Error.NG_ILLEGAL_CALL)}this._lc=o.waitForNew}catch(q){throw new a.MiMicException(q)}},format:function g(r,s,w){try{var t=this;a._assertYield.call(t);var q=a._getCb(arguments,t._event.onFormat);t._lc=o.format;var v=[a.isUndefined(r,8),a.isUndefined(s,o.Parity.None),a.isUndefined(w,1)];a.assertInt(v);return t._mcu.rpc(t.RPC_NS+":format",t._oid+","+v[0]+","+v[1]+","+v[2],function(x){if(q){q()}if(t._gen){t._gen.next()}t._lc=null})}catch(u){throw new a.MiMicException(u)}},readable:function e(){try{var r=this;a._assertYield.call(r);var q=a._getCb(arguments,r._event.onReadable);r._lc=o.readable;return r._mcu.rpc(r.RPC_NS+":readable",r._oid,function(u){var t=u.result[0];if(q){q(t)}if(r._gen){r._gen.next(t)}r._lc=null})}catch(s){throw new a.MiMicException(s)}},writeable:function p(){try{var r=this;a._assertYield.call(r);var q=a._getCb(arguments,r._event.onWriteable);r._lc=o.writeable;return r._mcu.rpc(r.RPC_NS+":writeable",r._oid,function(u){var t=u.result[0]?true:false;if(q){q(t)}if(r._gen){r._gen.next(t)}r._lc=null})}catch(s){throw new a.MiMicException(s)}},send_break:function n(){try{var r=this;a._assertYield.call(r);var q=a._getCb(arguments,r._event.onSend_break);r._lc=o.send_break;return r._mcu.rpc(r.RPC_NS+":send_break",r._oid,function(t){if(q){q()}if(r._gen){r._gen.next()}r._lc=null})}catch(s){throw new a.MiMicException(s)}},putc:function f(r){try{var s=this;a._assertYield.call(s);var q=a._getCb(arguments,s._event.onPutc);s._lc=o.putc;a.assertInt(r);return s._mcu.rpc(s.RPC_NS+":putc",s._oid+","+r,function(w){var u=w.result[0];if(q){q(u)}if(s._gen){s._gen.next(u)}s._lc=null})}catch(t){throw new a.MiMicException(t)}},puts:function m(r){try{var s=this;a._assertYield.call(s);var q=a._getCb(arguments,s._event.onPuts);s._lc=o.puts;return s._mcu.rpc(s.RPC_NS+":puts",s._oid+',"'+r+'"',function(w){var u=w.result[0];if(q){q(u)}if(s._gen){s._gen.next(u)}s._lc=null})}catch(t){throw new a.MiMicException(t)}},getc:function b(){try{var r=this;a._assertYield.call(r);var q=a._getCb(arguments,r._event.onGetc);r._lc=o.getc;return r._mcu.rpc(r.RPC_NS+":getc",r._oid,function(u){var t=u.result[0];if(q){q(t)}if(r._gen){r._gen.next(t)}r._lc=null})}catch(s){throw new a.MiMicException(s)}},gets:function j(r){try{var s=this;a._assertYield.call(s);var q=a._getCb(arguments,s._event.onGets);s._lc=o.gets;a.assertInt(r);return s._mcu.rpc(s.RPC_NS+":gets",s._oid+","+r,function(w){var u=w.result[0];if(q){q(u)}if(s._gen){s._gen.next(u)}s._lc=null})}catch(t){throw new a.MiMicException(t)}},baud:function d(r){try{var s=this;a._assertYield.call(s);var q=a._getCb(arguments,s._event.onBaud);s._lc=o.baud;a.assertInt(r);return s._mcu.rpc(s.RPC_NS+":baud",s._oid+","+r,function(u){if(q){q()}if(s._gen){s._gen.next()}s._lc=null})}catch(t){throw new a.MiMicException(t)}},dispose:function i(){return this._mcu._dispose.apply(this,arguments)}};c.Serial=o}());