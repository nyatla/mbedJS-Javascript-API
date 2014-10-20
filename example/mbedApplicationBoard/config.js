var mbedJS_IP_ADDR="192.168.128.39";

function getRequest(){
    if(location.search.length > 1) {
        var get = new Object();
        var ret = location.search.substr(1).split('&');
        for(var i = 0; i < ret.length; i++) {
        var r = ret[i].split('=');
        get[r[0]] = r[1];
        }
        return get;
    } else {
        return {};
    }
}

var _REQUEST=getRequest();
var _MBEDJS_ADDR=_REQUEST.mbedjs?_REQUEST.mbedjs:mbedJS_IP_ADDR;

var CONTENT_TABLE=[
	["./index.html","Top"],
	["./rgbled.html","RgbLED"],
	["./pot.html","PotentioMeter"],
	["./speaker.html","Speaker"],
	["./joystick.html","JoyStick"],
	["./mma7660.html","MMA7660"],
	["./lm75b.html","LM75B"]
];
var CONTENT_TABLE2=[
	["./chart-pot.html","PotentioMeter"],
	["./chart-lm75b.html","Thermometer"]
];

function menuTag()
{
	var d=CONTENT_TABLE;
	var s='<li><a href="http://'+_MBEDJS_ADDR+'">mbedJS</a></li>';
	for(var i=0;i<d.length;i++){
		s+='<li><a href="'+CONTENT_TABLE[i][0]+"?mbedjs="+_MBEDJS_ADDR+'">'+d[i][1]+'</a></li>';
	}
	s+='<li class="dropdown">'
	+'<a href="#" class="dropdown-toggle" data-toggle="dropdown">Enhanced<span class="caret"></span></a>'
    +'<ul class="dropdown-menu" role="menu">';
	d=CONTENT_TABLE2;
	for(var i=0;i<d.length;i++){
		s+='<li><a href="'+CONTENT_TABLE2[i][0]+"?mbedjs="+_MBEDJS_ADDR+'">'+d[i][1]+'</a></li>';
	}
	s+="</ul></li>";
	
	return s;
}

function contentList()
{
	var d=CONTENT_TABLE;
	var s='';
	for(var i=1;i<d.length;i++){
		s+='<li><a href="'+CONTENT_TABLE[i][0]+"?mbedjs="+_MBEDJS_ADDR+'">'+d[i][1]+'</a></li>';
	}
	return s;
}