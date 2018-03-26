
var Sky=function(elm){
	if(typeof(elm)=="string"){
		return document.getElementById(elm);
	}
	return elm;
};

Sky.isArray=function(a){
	return Array.isArray(a);
};
Sky.isDate=function(obj){
	return Object.prototype.toString.call(obj)==='[object Date]';
};
Sky.isRegExp=function(obj){
	return Object.prototype.toString.call(obj)==='[object RegExp]';
};
Sky.isString=function(obj){
	return Object.prototype.toString.call(obj)==='[object String]';
};
Sky.isFunction=function(obj){
	return Object.prototype.toString.call(obj)==='[object Function]';
};
Sky.isNumber=function(obj){
	return Object.prototype.toString.call(obj)==='[object Number]';
};
Sky.isObject=function(obj){
	var type=typeof obj;
	if(type!=="object"){
		return false;
	}
	type=Object.prototype.toString.call(obj);
	switch(type){
		case '[object String]':
		case '[object Number]':
		case '[object Function]':
		case '[object Boolean]':
			return false;
	}
	return true;
};
Sky.isDefined=function(obj){
	return obj!==undefined;
};
Sky.isPlainObject=function(obj){
	var key;
	if(typeof obj !=="object"){
		return false;
	}
	if(obj.toString()!=='[object Object]'){
		return false;
	}
	var hasOwn=Object.prototype.hasOwnProperty;
	try{
		if(obj.constructor && obj.constructor!=Object){
			return false;
		}
	}catch(e){
		return false;
	}
	for( key in obj ){
		if(!hasOwn.call(obj,key)){
			return false;
		}
	}
	return true;
};
Sky.isArrayLike=function(obj){
	var length=obj.length;
	if(typeof length !="number" || length<0 || isNaN(length) || Math.ceil(length)!=length){
		return false;
	}
	return true;
};
Sky.isNumeric=function(obj){
	var n=parseFloat(obj);
	return !isNaN(n);
};
if(this.HTMLElement){
	Sky.isElement=function(obj){
		return obj instanceof HTMLElement;
	};
}else{
	Sky.isElement=function(obj){
		return obj?obj.nodeType===1:false;
	};
}
Sky.isEmpty=function(obj){
	if(obj==null) return true;
	if(Sky.isNumber(obj.length)){
		return !obj.length;
	}
	if(Sky.isNumber(obj.size)){
		return !obj.size;
	}
	if(Sky.isFunction(obj.size)){
		return !obj.size();
	}
	if(Sky.isFunction(obj.toArray)){
		return !obj.toArray().length;
	}
	return false;
};

if(!{toString: null}.propertyIsEnumerable('toString')){
	Sky.dontEnums = ["toString", "toLocaleString", "valueOf","hasOwnProperty", "isPrototypeOf","propertyIsEnumerable","constructor"];
	Sky.forIn=function(obj,fn){
		for(var key in obj) {
			if(key.startsWith("__")!=0 || typeof obj!=="unknown"){
				if(fn.call(obj,obj[key],key)===false){
					return false;
				}
			}
		}
		var nonEnumIdx=Sky.dontEnums.length;
		var constructor=obj.constructor;
		var proto=Sky.isFunction(constructor) && constructor.prototype || Object.prototype;
		//遍历nonEnumerableProps数组
		while (nonEnumIdx--) {
			var prop = Sky.dontEnums[nonEnumIdx];
			if(prop in obj && obj[prop]!==proto[prop]){
				if(fn.call(obj,obj[prop],prop)===false){
					return false;
				}
			}
		}
		return true;
	};
}else{
	Sky.forIn=function(obj,fn){
		for(var key in obj) {
			if(fn.call(obj,obj[key],key)===false){
				return false;
			}
		}
		return true;
	};
}
Sky.forOwn=function(obj,fn){
	return Sky.forIn(obj,function(value,key){
		if(Sky.hasOwn(obj,key)){
			if(fn.call(obj,obj[key],key)===false){
				return false;
			}
		}
	});
};
Sky.hasOwn=function(obj,key){
	if(obj.hasOwnProperty){
		return obj.hasOwnProperty(key);
	}
	return Object.prototype.hasOwnProperty.call(obj,key);
};
//判断一个元素在数组中的位置
if(!Array.prototype.indexOf){
	Array.prototype.indexOf=function(e){
		for(var i=0,j; j=this[i]; i++){
			if(j==e){return i;}
		}
		return -1;
	};
}
//遍历数组
if(!Array.prototype.forEach ){
	Array.prototype.forEach =function(callback, thisArg){
		for(var i=0,j; j=this[i]; i++){
			callback.call(thisArg,j,i,this);
		}
	};
}
if (!Array.prototype.map) {
	Array.prototype.map = function (fn, context) {
		var arr = [];
		for (var k = 0, length = this.length; k < length; k++) {
			arr.push(fn.call(context, this[k], k, this));
		}
		return arr;
	};
}
if (!Array.prototype.filter) {
	Array.prototype.filter = function (fn, context) {
		var arr = [];
		for (var k = 0, length = this.length; k < length; k++) {
			fn.call(context, this[k], k, this) && arr.push(this[k]);
		}
		return arr;
	};
}
if (!Array.prototype.some) {
	Array.prototype.some = function (fn, context) {
		var passed = false;
		for (var k = 0, length = this.length; k < length; k++) {
			if (passed === true) break;
			passed = !!fn.call(context, this[k], k, this);
		}
		return passed;
	};
}
if (!Array.prototype.every) {
	Array.prototype.every = function (fn, context) {
		var passed = true;
		for (var k = 0, length = this.length; k < length; k++) {
			if (passed === false) break;
			passed = !!fn.call(context, this[k], k, this);
		}
		return passed;
	};
}
/** 时间对象的格式化; **/
/* eg:format="yyyy-MM-dd hh:mm:ss"; */
Date.prototype.format=function(format){
	var o={
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	};
	if(/(y+)/.test(format)){
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4- RegExp.$1.length));
	}
	for(var k in o){
		if(new RegExp("(" + k + ")").test(format)){
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};
/** 判断一个节点后代是否包含另一个节点 **/
if(window.Node && Node.prototype && !Node.prototype.contains){
	Node.prototype.contains=function(arg){
		return !!(this.compareDocumentPosition(arg) & 16);
	}
}
//删除左右两端的空格
if(!String.prototype.trim){
	String.prototype.trim=function() {
		return this.replace(/(^\s*)|(\s*$)/g,'');
	};
}
Sky.createIcon=function(icon){//根据站点图标库改变
	var image = document.createElement("img");
	image.className='s-icon';
	image.src =icon.indexOf("/")!=-1?icon:(Sky.base+"../icons/famfamfam/"+icon.replace(/\-/g,"_")+".png");
	return image;
};
if(typeof $=="undefined"){
	$=Sky;
}
//获取字符串占位长度
Sky.getWordLength=function(str){
	var len=0;
	for (var i = 0; i < str.length; i++){
		if (str.charCodeAt(i) > 127 || str.charCodeAt(i) < 0){
			len+=2;
		}else{
			len++;
		}
	}
	return len;
};
//截取字符串占位长度
Sky.cutWord=function(str,len,replaceStr){
	var relen=getWordLength(replaceStr);
	if(relen>len){
		for (var i = relen.length-1; i >= 0; i--){
			if (relen.charCodeAt(i) > 127 || relen.charCodeAt(i) < 0){
				len-=2;
			}else{
				len--;
			}
			if(len<0){
				i++;
				return replaceStr.substr(i,replaceStr.length-i);
			}
		}
	}else{
		len-=relen;
		for (var i = 0; i < str.length; i++){
			if (str.charCodeAt(i) > 127 || str.charCodeAt(i) < 0){
				len-=2;
			}else{
				len--;
			}
			if(len<0){
				i--;
				return str.substring(0,i)+replaceStr;
			}
		}
		return str;
	}
};
//清除HTML代码
Sky.escapeHtml=function(str) {
	return str.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;');
};
Sky.buildQuery=function(obj){
	var s='';
	if(obj instanceof Map){
		obj.forEach(fn);
	}else{
		Sky.forOwn(obj,fn);
	}
	function fn(value,key){
		if(value.toJSON) value=value.toJSON();
		if(value.forEach){
			value.forEach(function(value){
				s=s+key+'[]='+encodeURIComponent(value)+'&';
			});
		}else if(Sky.isObject(value)){
			Sky.forOwn(value,function(v,k){
				s=s+key+'['+k+']='+encodeURIComponent(v)+'&';
			});
		}else{
			s=s+key+'='+encodeURIComponent(value)+'&';
		}
	}
	return s.substring(0,s.length-1);
};
Sky.parseURL=function(url) {
	var r={},arr,pattern;
	r.source=url;
	pattern=/^[^#]*/;
	r.hash=url.replace(pattern,"");
	arr=url.match(pattern);
	url=arr[0];
	pattern=/^([^:]+):[\/]*([^\/]+)/;
	arr=url.match(pattern);
	r.prefix=arr[0];
	r.protocol=arr[1];
	r.host=arr[2];
	pattern=/^([^:]+):(\d*)$/;
	arr=r.host.match(pattern);
	if(arr){
		r.hostname=arr[1];
		r.port=parseInt(arr[2]);
	}else{
		r.hostname= r.host;
		r.port="";
	}
	url=url.replace(r.prefix,"");
	pattern=/^[^\?]*/;
	arr=url.match(pattern);
	r.pathname=arr[0];
	r.search=url.replace(pattern,"");
	r.folder=r.pathname.replace(/\/[^\/]*$/,"");
	return r;
};
(function(){
	var userAgent = navigator.userAgent.toLowerCase();
	Sky.browser={
		version:(userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
		webkit:/webkit/.test( userAgent ),
		opera:/opera/.test( userAgent ),
		msie:/msie/.test( userAgent ) && !/opera/.test( userAgent ),
		mozilla:/mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ),
		moblie:/moblie/.test( userAgent )
	};
	var ie="ActiveXObject" in window;
	Sky.browser.ie5=ie&&!window.compatMode;//ie5及以下
	Sky.browser.ie6=ie&&!!window.compatMode&&!window.XMLHttpRequest;
	Sky.browser.ie7=ie&&!!window.XMLHttpRequest&&!document.querySelector;
	Sky.browser.ie8=ie&&!!document.querySelector&&!document.addEventListener;
	Sky.browser.ie9=ie&&!!document.addEventListener&&!document.atob;
	Sky.browser.ie10=ie&&!!document.atob&&!!window.attachEvent;
	Sky.browser.ie11=ie&&!!document.atob&&!window.attachEvent;
})();

Sky.extend=function(){//扩展对象
	var args=arguments;
	if(args.length==0) return;
	if(args.length==1) return args[0];
	var temp=args[0]==true?args[1]:args[0]; //调用复制对象方法
	for (var n=args[0]==true?2:1; n<args.length; n++){
		for(var i in args[n]){
			if(args[n].hasOwnProperty(i)){
				if(args[n][i]!=null && args[0]==true && args[n][i].toString()=='[object Object]' && temp[i].toString()=='[object Object]'){
					temp[i]=Sky.extend(true,temp[i],args[n][i]);
					//temp[i] = args[n][i];
				}else{
					temp[i] = args[n][i];
				}
			}
		}
	}
	return temp;
};
Sky.inArray=function(arr,value,column){
	if(column){
		for(var i=0,j; j=arr[i]; i++){
			if(j[column]==value){return i;}
		}
		return -1;
	}else{
		return arr.indexOf(value);
	}
};

Sky.attachEvent=function(obj, evt, func) {
	if(obj.addEventListener) {
		obj.addEventListener(evt, func, false);
	} else if(obj.attachEvent) {
		obj.attachEvent('on' + evt, func);
	}
};
Sky.detachEvent=function(obj, evt, func, eventobj) {
	eventobj = !eventobj ? obj : eventobj;
	if(obj.removeEventListener) {
		obj.removeEventListener(evt, func, false);
	} else if(eventobj.detachEvent) {
		obj.detachEvent('on' + evt, func);
	}
};
Sky.fireEvent=function(e,eventName){
	if(e.dispatchEvent) {
		var ev = document.createEvent('Event');
		ev.initEvent(eventName, false, false);
		e.dispatchEvent(ev);
	}else{
		e.fireEvent("on"+eventName);
	}
};
Sky.hasClass=function(obj,cls){
	return obj.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
};
Sky.addClass=function(obj,cls){
	if(!this.hasClass(obj,cls)) obj.className+=" "+cls;
};
Sky.removeClass=function(obj,cls){
	if(this.hasClass(obj,cls)){
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		obj.className=obj.className.replace(reg,' ');
	}
};
Sky.base=(function(){
	var js = document.getElementsByTagName('script');
	var src = js[js.length - 1].src
	var base = src.substring(0, src.lastIndexOf("/") + 1);
	return base;
})();
Sky.ajax=function(options){
	var targetUrl=options.url;
	var success=options.success;
	var error=options.error;
	var dataType=options.dataType?options.dataType:'auto';
	var complete=options.complete;
	var xhr=Sky.ajax.createXMLHttpRequest();
	if(options.timeout) xhr.timeout=options.timeout;
	var currentPath;
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 ) {
			if(xhr.status == 200 || xhr.status==0){//本地访问为0
				var returnType=xhr.getResponseHeader("Content-Type");
				if(dataType=="auto" && returnType){
					if(returnType.match(/\/json/i)){
						dataType="JSON";
					}else if(returnType.match(/\/xml/i)){
						dataType="XML";
					}
				}
				if(dataType.toUpperCase() == 'XML') {
					if(!xhr.responseXML || !xhr.responseXML.lastChild || xhr.responseXML.lastChild.localName == 'parsererror') {
						if(error) error.call(xhr,xhr.responseText);
					} else {
						success.call(xhr,xhr.responseXML.lastChild);
					}
				}else if(dataType.toUpperCase() == 'JSON') {
					var data;
					try {
						data=JSON.parse(xhr.responseText);
					}catch(err) {
						if(error) error.call(xhr,xhr.responseText);
					}
					if(data) success.call(xhr,data);
				}else{
					success.call(xhr,xhr.responseText);
				}
			}else if(error){
				error.call(xhr,xhr.responseText);
			}
			if(complete) complete.call(xhr,xhr.responseText);
		}
	};
	if(options.type && options.type.toUpperCase()=="POST"){
		var contentType=options.contentType;
		var data=options.data;
		xhr.open('POST', targetUrl,options.async!==false);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		if(data){
			if(Sky.isPlainObject(data)){
				xhr.setRequestHeader('Content-Type',contentType || 'application/x-www-form-urlencoded');
				xhr.send(Sky.buildQuery(data));
			}else{//字符串 ， 二进制流 ， 文件等
				if(contentType){
					contentType && xhr.setRequestHeader('Content-Type',contentType);
				}else if(Sky.isString(data)){
					xhr.setRequestHeader('Content-Type','text/plain');
				}
				xhr.send(data);
			}
		}else{
			xhr.send(null);
		}
	}else{
		xhr.open('GET', targetUrl,options.async!==false);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.send(null);
	}
};
Sky.ajax.createXMLHttpRequest=function(){
	var request=false;
	if(window.XMLHttpRequest){
		request = new XMLHttpRequest();
	}else if(window.ActiveXObject){
		var versions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.7.0', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
		for(var i=0; i<versions.length; i++){
			try{
				request=new ActiveXObject(versions[i]);
				if(request){
					return request;
				}
			}catch(e){}
		}
	}
	return request;
};
Sky.get=Sky.ajax.get=function(targetUrl,success,datatype,error){
	Sky.ajax({
		'url' : targetUrl,
		'type' : "GET",
		'dataType' : datatype,
		'success' : success,
		'error' : error
	});
};
Sky.post=Sky.ajax.post=function(targetUrl,data,success,datatype,error){
	Sky.ajax({
		'url' : targetUrl,
		'type' : "POST",
		'data' : data,
		'dataType' : datatype,
		'success' : success,
		'error' : error
	});
};
Sky.getJSONP=function(url, callback){
	var cbname="cb"+(new Date()).getTime()+parseInt(Math.random()*1000000);
	if(url.indexOf("=?")!=-1){
		url=url.replace("=?","="+cbname);
	}else{
		url+=cbname;
	}
	var script=document.createElement("script");
	window[cbname]=function(response){
		try{
			callback(response);
		}finally{
			if(!-[1,]){//ie6-8
				window[cbname]=undefined;
			}else{
				delete window[cbname];
			}
			script.parentNode.removeChild(script);
		}
	};
	script.src=url;
	document.body.appendChild(script);
};
//这是个坑
Sky.getElementStyle=function(el, prop){
	if(el.currentStyle){//IE
		return el.currentStyle[prop] || el.style[prop];
	}else if(window.getComputedStyle){//非IE
		var propprop = prop.replace (/([A-Z])/g, "-$1");
		propprop = prop.toLowerCase();
		var style=window.getComputedStyle(el,null);
		return style[prop] || style.getPropertyValue(propprop) || el.style[prop];
	}
	return '';
};

//获取元素位置
Sky.getPageTop=function(e){
	var offset;
	if(e.getBoundingClientRect){
		offset=e.getBoundingClientRect().top;
		offset+=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
		if(Sky.browser.ie7){
		//ie7会比正常多两个像素，因为ie7有个边框，我不知道怎么去掉，其他ie浏览器可以使用html{border:0 none;},知道怎么处理的朋友和我说下吧
			offset-=2;
		}
	}else{
		offset=e.offsetTop;
		if(e.offsetParent!=null) offset+=Sky.getPageTop(e.offsetParent);
	}
	return offset;
}
Sky.getPageLeft=function(e){
	var offset;
	if(e.getBoundingClientRect){
		offset=e.getBoundingClientRect().left;
		offset+=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft);
		if(Sky.browser.ie7){
			offset-=2;
		}
	}else{
		offset=e.offsetLeft;
		if(e.offsetParent!=null) offset+=Sky.getPageLeft(e.offsetParent);
	}
	return offset;
}
Sky.clearSelect="getSelection" in window ? function(){
	window.getSelection().removeAllRanges();
} : function(){
	document.selection.empty();
};
/** 以废止，今后将要去除，不建议使用 **/
Sky.getChildByTag=function(node,tag){
	var n=node.childNodes;
	for(var i=0;i<n.length;i++){
		if(n[i].tagName==tag.toUpperCase()){
			return n[i];
		}
	}
};
/** 以废止，今后将要去除，不建议使用 **/
Sky.createDiv=function(className,parent){
	var div=document.createElement("div");
	div.className=className;
	if(parent){
		parent.appendChild(div);
	}
	return div;
};
Sky.render=function(wrap,jscallback,argArray){
	wrap.innerHTML="";
	var html=jscallback.apply(wrap,argArray);
	if(html!=null){
		if(typeof html=="object"){
			wrap.appendChild(html);
		}else{
			wrap.innerHTML=html;
		}
	}
};
Sky.each=function(obj,fn){
	if(Sky.isArray(obj)){
		for(var i=0;i<obj.length;i++){
			if(fn.call(obj,i,obj[i])===false){
				break;
			}
		}
	}else{
		for(var key in obj) {
			if(obj.hasOwnProperty(key)) {
				if(fn.call(obj,key,obj[key])===false){
					break;
				}
			}
		}
	}
};
var sky={};
sky.events={};
sky.events.EventDispatcher=function(){
	this._events=new Array();
	this.addListener=function(type,fn,before){
		before=before?true:false;
		this._events.push({'type':type,'fn':fn,'before':before});
	};
	this.on=function(type,fn,before){
		this.addListener(type,fn,true);
	};
	this.after=function(type,fn,before){
		this.addListener(type,fn,false);
	};
	this.removeListener=function(type,fn){
		for(var i=this._events.length-1;i>=0;i--){
			var e=this._events[i];
			if(e.type==type && e.fn==fn){
				this._events.splice(i, 1);
			}
		}
	};
	this.dispatchEvent=function(type,before,args){
		if(args==undefined){ args=[];}
		for(var i=0;i<this._events.length;i++){
			var e=this._events[i];
			if(e.type==type && e.before==before){
				if(e.fn.apply(this,args)==false){
					return false;
				}
			}
		}
		var when=before?'on':'after';
		var eventName=when+type;
		if(this[eventName]){
			if(this[eventName].apply(this,args)==false){
				return false;
			}else{
				return true;
			}
		}
		eventName=when+type.replace(/\b(\w)/g, function(m){
			return m.toUpperCase();
		});
		if(this[eventName]){
			if(this[eventName].apply(this,args)==false){
				return false;
			}else{
				return true;
			}
		}
		return true;
	};
	this.dispatchOnEvent=function(type,args){
		return this.dispatchEvent(type,true,args);
	};
	this.dispatchAfterEvent=function(type,args){
		return this.dispatchEvent(type,false,args);
	};
};
sky.Blur=function(e){
	var target=document.body;
	if(e && e.target){
		target=e.target;
	}else if(window.event && window.event.srcElement){
		target=window.event.srcElement;
	}
	if(sky.Blur.events){
		var events=sky.Blur.events;
		for(var i=events.length-1;i>=0;i--){
			var element=events[i].element;
			if(!element.contains(target) && element!=target){
				events[i].call(element,e);
			}
		}
	}
};
sky.Blur.attach=function(element,fn){
	if(!sky.Blur.events){
		sky.Blur.events=new Array();
		if(window.addEventListener) {
			window.addEventListener("mousedown", sky.Blur, false);
		}else if(document.body.attachEvent) {
			document.body.attachEvent('onmousedown', sky.Blur);
		}
	}
	fn.element=element;
	sky.Blur.events.push(fn);
};
sky.Blur.detach=function(){
	var element=null;
	var fn=null;
	for(var i=0;i<arguments.length;i++){
		if(typeof arguments[i]=="function"){
			fn=arguments[i];
		}else{
			element=arguments[i];
		}
	}
	var events=sky.Blur.events;
	if(events){
		for(var i=events.length-1;i>=0;i--){
			if((!element || element==events[i].element) && (!fn || events[i]==fn)){
				events.splice(i,1);
			}
		}
		if(events.length==0){
			delete sky.Blur.events;
			Sky.detachEvent(document.body,"mousedown",sky.Blur);
			if(window.removeEventListener) {
				window.removeEventListener("mousedown", sky.Blur, false);
			}else if(document.body.detachEvent) {
				document.body.detachEvent('ononmousedown' , sky.Blur);
			}
		}
	}
};
sky.Container=function(ele){
	var $=this;
	this._super=function(){
		sky.events.EventDispatcher.call(this);//继承EventDispatcher
	};
	this._super();
	this.dom=Sky(ele);
	this.add=function(component){
		component.container=$;
		component.renderTo($.dom);
	};
	/*把容器设为填满的样式*/
	this.fillUp=function(){
		Sky.addClass($.dom,"s-full");
		if($.dom==document.body){document.documentElement.style.overflow="hidden";}
	};
	if(ele==window || ele==document || ele==document.body){
		$._super.addListener=$.addListener;
		var _timer;
		$.addListener=function(type,fn,before){
			if(type=="resize"){
				if(!_timer){
					var isResizing=0;
					_timer=setInterval(function(){
						if(isResizing){//最快每200毫秒刷新一次,,直接在resize里,刷新过快会卡顿
							if($.dispatchOnEvent('resize')){
								$.dispatchAfterEvent('resize');
							}
							isResizing--;
						}
					},200);
					Sky.attachEvent(window,'resize',function(){
						isResizing=2;
					});
				}
			}
			$._super.addListener.call($,type,fn,before);
		};
	}
};
sky.Viewport=function(){
	sky.Container.call(this,document.body);//继承Container
};
sky.Viewport.instance=null;
sky.Viewport.getInstance=function(){
	if(!sky.Viewport.instance){
		sky.Viewport.instance=new sky.Viewport();
	}
	return sky.Viewport.instance;
};
sky.Component=function(){
	sky.events.EventDispatcher.call(this);//继承EventDispatcher
	this.container=null;
	this.remove=function(){
		this.dom.parentNode.removeChild(this.dom);
	};
	this.renderTo=function(wrap){
		wrap=Sky(wrap);
		this.dom=document.createElement("div");
		wrap.appendChild(this.dom);
		console.log(this.container);
	};
};
sky.Panel=function(options){
	sky.Component.call(this);//继承Component
	var $=this;
	var conf={
		'height':null,
		'width':null,
		'content':null,
		'title':'Panel',
		'icon':null
	};
	conf=Sky.extend(conf,options);
	$.dom=document.createElement("div");
	$.dom.className="s-panel";
	var head=Sky.createDiv("s-panel-head",$.dom);
	var toolBar=Sky.createDiv("s-panel-tool",head);
	var icon=null;
	if(conf.icon){
		icon=Sky.createIcon(conf.icon);
		head.appendChild(icon);
	}
	var title=document.createTextNode(conf.title);
	head.appendChild(title);
	var body=Sky.createDiv("s-panel-body",$.dom);
	this.body=new sky.Container(body);
	this.icon=icon;
	this.title=title;
	this.toolBar=toolBar;
	this.renderTo=function(wrap){
		wrap=Sky(wrap);
		wrap.appendChild($.dom);
		if(conf.height){ $.body.dom.style.height= conf.height+"px";}
		if(conf.width){ $.dom.style.width=typeof(conf.width)=='number'?(conf.width+'px'):conf.width;}
		if(conf.content){ $.body.dom.innerHTML=conf.content;}
		return $;
	};
	this.remove=function(){
		$.dom.parentNode.removeChild($.dom);
	};
	this.addToolBtn=function(label,className,clickHandle){
		var btn=createToolBtn(className);
		$.toolBar.appendChild(btn);
		btn.appendChild(document.createTextNode(label));
		btn.onclick=clickHandle;
		return btn;
	};
	this.addToolBtnAt=function(poi,label,className,clickHandle){
		var btn=createToolBtn(className);
		$.toolBar.insertBefore(btn,$.toolBar.childNodes[poi]);
		btn.appendChild(document.createTextNode(label));
		btn.onclick=clickHandle;
		return btn;
	};
	this.addMoreBtn=function(dom){
		head.insertBefore(dom,head.firstChild)
	};
	function createToolBtn(className){
		var a=document.createElement("a");
		a.className=className+" s-tool-btn";
		return a;
	}
};
sky.Panel.base=function(wrap,options){
	var conf={
		'title':'Panel',
		'icon':null
	};
	conf=Sky.extend(conf,options);
	var head=Sky.createDiv("s-panel-head",wrap);
	var toolBar=Sky.createDiv("s-panel-tool",head);
	var icon=null;
	if(conf.icon){
		icon=Sky.createIcon(conf.icon);
		head.appendChild(icon);
	}
	var title=document.createTextNode(conf.title);
	head.appendChild(title);
	var body=Sky.createDiv("s-panel-body",wrap);
	this.head=new sky.Container(head);
	this.body=new sky.Container(body);
	this.icon=icon;
	this.title=title;
	this.toolBar=toolBar;
	return this;
};

sky.layout={};
sky.layout.BorderLayout=function(options){
	sky.Component.call(this);//继承EventDispatcher
	var conf={
		'west':{
			'width':220,
			'title':'',
			'isCollapse':false,//是否初始关闭
			'allowCollapse':true//是否允许关闭
		},
		'east':{
			'width':0,//0表示不使用
			'title':'',
			'isCollapse':false,//是否初始关闭
			'allowCollapse':true//是否允许关闭
		},
		'north':{
			'height':60
		},
		'south':{
			'height':60
		},
		'height':0,
		'space':3,
		'border':3
	};

	var $=this;//返回对象
	conf=Sky.extend(true,conf,options);
	var north=null;
	var east=null;
	var west=null;
	var south=null;
	var center=null;
	var ctrlSize=25;//左右缩小后的尺寸
	this.renderTo=function(wrap){
		$.dom=Sky.createDiv("s-layout",wrap);
		if(conf.north && conf.north.height){
			north=document.createElement("div");
			$.dom.appendChild(north);
			north.className="s-layout-north";
			$.north=new sky.Container(north);
		}
		if(conf.west && conf.west.width){
			west=document.createElement("div");
			$.dom.appendChild(west);
			west.className="s-layout-west";
			$.west=new sky.Container(west);
			$.west.isCollapse=conf.west.isCollapse;
			if(conf.west.allowCollapse){
				var lTitle=Sky.createDiv("s-panel-head",west);
				$.west.head=lTitle;
				var lTool=Sky.createDiv("s-panel-tool",lTitle);
				$.west.toolBar=lTool;
				var lHideBtn=Sky.createDiv("fa s-flat-btn",lTool);
				$.west.hideBtn=lHideBtn;
				lHideBtn.appendChild(document.createTextNode("\uf100"));
				$.west.title=document.createTextNode(conf.west.title);
				lTitle.appendChild($.west.title);
				Sky.attachEvent(lHideBtn,'click',function(){
					west.style.visibility="hidden";
					$.west.isCollapse=true;
					var lCtrl=Sky.createDiv('s-layout-lCtrl',$.dom);
					lCtrl.style.left=west.style.left;
					lCtrl.style.top=west.style.top;
					lCtrl.style.height=west.style.height;
					lCtrl.style.width=ctrlSize+'px';
					var lRecoverBtn=Sky.createDiv('fa s-flat-btn',lCtrl);
					lRecoverBtn.appendChild(document.createTextNode("\uf101"));
					lRecoverBtn.style.marginTop="4px";
					Sky.attachEvent(lRecoverBtn,'click',function(){
						$.west.isCollapse=false;
						west.style.visibility='';
						$.refreshPosition();
						$.dom.removeChild(lCtrl);
					});
					$.refreshPosition();
				});
			}
		}
		if(conf.east && conf.east.width){
			east=document.createElement("div");
			$.dom.appendChild(east);
			east.className="s-layout-east";
			$.east=new sky.Container(east);
			$.east.isCollapse=conf.east.isCollapse;
			if(conf.east.allowCollapse){
				var rTitle=Sky.createDiv("s-panel-head",east);
				$.east.head=rTitle;
				var rTool=Sky.createDiv("s-panel-tool",rTitle);
				$.east.toolBar=rTool;
				var rHideBtn=Sky.createDiv("fa s-flat-btn",rTool);
				$.east.hideBtn=rHideBtn;
				rHideBtn.appendChild(document.createTextNode("\uf101"));
				$.east.title=document.createTextNode(conf.east.title);
				rTitle.appendChild($.east.title);
				Sky.attachEvent(rHideBtn,'click',function(){
					east.style.visibility="hidden";
					$.east.isCollapse=true;
					var rCtrl=Sky.createDiv('s-layout-rCtrl',$.dom);
					rCtrl.style.right=east.style.right;
					rCtrl.style.top=east.style.top;
					rCtrl.style.height=east.style.height;
					rCtrl.style.width='25px';
					var rRecoverBtn=Sky.createDiv('fa s-flat-btn',rCtrl);
					rRecoverBtn.appendChild(document.createTextNode("\uf100"));
					rRecoverBtn.style.marginTop="4px";
					Sky.attachEvent(rRecoverBtn,'click',function(){
						$.east.isCollapse=false;
						east.style.visibility='';
						$.refreshPosition();
						$.dom.removeChild(rCtrl);
					});
					$.refreshPosition();
				});
			}
		}
		if(conf.south && conf.south.height){
			south=document.createElement("div");
			$.dom.appendChild(south);
			south.className="s-layout-south";
			$.south=new sky.Container(south);
		}
		center=document.createElement("div");
		$.dom.appendChild(center);
		Sky.addClass(center,"s-layout-center");
		$.center=new sky.Container(center);
		if(conf.height<=0 && $.container){
			$.container.fillUp();
			$.container.after('resize',$.refreshPosition);
		}
		$.refreshPosition();
	};
	$.refreshPosition=function(){
		var targetHeight=conf.height>0?conf.height:($.dom.parentNode.clientHeight+conf.height);//计算目标高度
		var northHeight=$.north?(conf.north.height+conf.space):0;
		var westWidth=$.west?($.west.isCollapse?(ctrlSize+1):(conf.west.width+conf.space)):0;
		var southHeight=$.south?(conf.south.height+conf.space):0;
		var eastWidth=$.east?($.east.isCollapse?(ctrlSize+1):(conf.east.width+conf.space)):0;
		$.center.dispatchOnEvent("resize");
		$.dom.style.height=targetHeight+"px";
		with($.center.dom.style){
			height=(targetHeight-2*conf.border-northHeight-southHeight-2)+'px';
			left=conf.border+westWidth+'px';
			top=conf.border+northHeight+'px';
			width=($.dom.clientWidth-westWidth-eastWidth-2*conf.border-2)+'px';
		}
		$.center.dispatchAfterEvent("resize");
		if($.west){
			$.west.dispatchOnEvent("resize");
			with($.west.dom.style){
				height=center.style.height;
				left=conf.border+'px';
				top=conf.border+northHeight+'px';
				width=(conf.west.width-2)+'px';
			}
			$.west.dispatchAfterEvent("resize");
		}
		if($.east){
			$.east.dispatchOnEvent("resize");
			with($.east.dom.style){
				height=center.style.height;
				right=conf.border+'px';
				top=center.style.top;
				width=(conf.east.width-2)+'px';
			}
			$.east.dispatchAfterEvent("resize");
		}
		if($.south){
			$.south.dispatchOnEvent("resize");
			with($.south.dom.style){
				height=(conf.south.height-(south.offsetHeight-south.clientHeight))+'px';
				left=conf.border+'px';
				bottom=conf.border+'px';
				width=width=($.dom.clientWidth-2*conf.border-(south.offsetWidth-south.clientWidth))+'px';
			}
			$.south.dispatchAfterEvent("resize");
		}
		if($.north){
			$.north.dispatchOnEvent("resize");
			with($.north.dom.style){
				height=(conf.north.height-(north.offsetHeight-north.clientHeight))+'px';
				left=conf.border+'px';
				top=conf.border+'px';
				width=width=($.dom.clientWidth-2*conf.border-(north.offsetWidth-north.clientWidth))+'px';
			}
			$.north.dispatchAfterEvent("resize");
		}
	};
	this.remove=function(){
		$.dom.parentNode.removeChild($.dom);
		if($.container) $.container.removeListener("resize", $.refreshPosition);
	};
};


sky.layout.Tabs=function(options){
	sky.Component.call(this);//继承 Component
	var $=this;//返回对象
	var conf={
		'height':NaN
	};
	conf=Sky.extend(conf,options);
	this.renderTo=function(wrap){
		$.dom=Sky.createDiv("s-tabs",wrap);
		$.head=document.createElement("ul");
		$.head.className="s-tabs-head";
		$.dom.appendChild($.head);
		$.body=document.createElement("div");
		$.dom.appendChild($.body);
		$.body.className="s-tabs-body";
		if(conf.height>0){
			$.body.style.height=(conf.height-$.head.offsetHeight-3)+"px";
		}else if(conf.height<=0 && $.container){
			$.container.fillUp();
			$.container.after('resize',$.refreshPosition);
		}
		$.refreshPosition();
	};
	this.remove=function(){
		this.dom.parentNode.removeChild(this.dom);
		if($.container) $.container.removeListener("resize", $.refreshPosition);
	};
	$.refreshPosition=function(){
		var height=$.dom.parentNode.clientHeight;
		$.body.style.height=(height-$.head.offsetHeight-3+conf.height)+"px";
		if($.activeItem){
			var container=$.activeItem.container;
			if(container){
				if(container.dispatchOnEvent("resize")){
					container.dispatchAfterEvent("resize");
				}
			}
		}
	};
	var menu=new sky.Menu([{'label':"刷新",'onclick':function(){
		this.tabItem.iframe.src=this.tabItem.iframe.src;
	}},{'label':"关闭",'onclick':function(){
		this.tabItem.close();
	}}]);
	menu.dom.style.width="100px";
	this.tabItems=[];
	this.add=function(op){
		if(op.id){//如果存在id相同的项就直接切换
			for(var i=0;i<$.tabItems.length;i++){
				if($.tabItems[i].id==op.id){
					$.tabItems[i].activate();
					return ;
				}
			}
		}
		var item=new sky.layout.TabItem();
		item.id=op.id;
		$.tabItems.push(item);
		var li=document.createElement("li");
		$.head.appendChild(li);
		item.head=li;
		if(op.icon){
			item.icon=Sky.createIcon(op.icon);
			li.appendChild(item.icon);
		}
		item.title=document.createTextNode(op.title);
		li.appendChild(item.title);
		if(op.url){
			var iframe=document.createElement("iframe");
			iframe.className="s-tabs-frame";
			iframe.setAttribute('frameborder','no');
			iframe.setAttribute('border','0');
			$.body.appendChild(iframe);
			iframe.src=op.url;
			item.iframe=iframe;
			item.window=iframe.contentWindow;
		}else{
			var div=Sky.createDiv("s-tab-container",$.body);
			var container=new sky.Container(div);
			item.container=container;
			if(op.content){
				container.dom.innerHTML=op.content;
			}
		}
		item.activate=function(){
			if(item.dispatchOnEvent('activate')){
				if($.dispatchOnEvent('activate')){
					var lis=$.head.getElementsByTagName("li");
					for(var i=0;i<lis.length;i++){
						if(item.head==lis[i]){
							lis[i].className="cur";
						}else{
							lis[i].className="";
						}
					}
					var cs=$.body.childNodes;
					for(var i=0;i<cs.length;i++){
						if(cs[i]==(item.iframe || item.container.dom)){
							cs[i].style.display="";
						}else{
							cs[i].style.display="none";
						}
					}
					if(item.container){
						item.container.dispatchAfterEvent('resize');
					}
					$.activeItem=item;
					item.dispatchAfterEvent('activate');
					$.dispatchAfterEvent('activate');
				}
			}
		};
		li.onclick=function(){
			item.activate();
		};
		item.activate();
		li.oncontextmenu=function(ev){
			if(item.dispatchOnEvent('contextMenu')){
				menu.tabItem=item;
				menu.popup(ev);
				menu.enableItem(0,item.iframe?true:false);
				menu.enableItem(1,op.closable!=false);
				item.dispatchAfterEvent('contextMenu');
				return false;
			}
		};
		item.close=function(){
			if(item.dispatchOnEvent('close')){
				if($.dispatchOnEvent('close')){
					if(item.iframe){
						item.iframe.src="about:blank";
						$.body.removeChild(item.iframe);
					}else{
						$.body.removeChild(item.container.dom);
					}
					$.head.removeChild(item.head);
					var index=$.tabItems.indexOf(item);
					$.tabItems.splice(index,1);
					if(index>0) index--;
					if($.tabItems.length){
						$.tabItems[index].activate();
					}
					item.dispatchAfterEvent('close');
					$.dispatchAfterEvent('close');
				}
			}
		};
		if(op.closable!=false){
			var closeBtn=document.createElement("span");
			closeBtn.className="s-tabs-closeBtn";
			li.appendChild(closeBtn);
			closeBtn.onclick=function(e){
				item.close();
				window.event? window.event.cancelBubble = true : e.stopPropagation();
				return false;
			};
			closeBtn.appendChild(document.createTextNode("×"));
		}
		return item;
	};
};
sky.layout.TabItem=function(attribute){
	sky.events.EventDispatcher.call(this);//继承EventDispatcher
	this.id=null;
	this.title=null;
	this.closable=true;
	this.icon=null;
	for( key in attribute){
		this[key]=attribute[key];
	}
	this.close=
		this.activate=
		this.close=function(){};


};

sky.dd={};
sky.dd.AuxiliaryBox=function(x,y,w,h){
	var $=this==sky.dd?{}:this;
	$.dom=Sky.createDiv("s-auxiliary-box",document.body);
	$.setLeft=function(x){
		$.dom.style.left=x+"px";
	};
	$.setTop=function(y){
		$.dom.style.top=y+"px";
	};
	$.setWidth=function(w){
		$.dom.style.width=w+"px";
	};
	$.setHeight=function(h){
		$.dom.style.height=h+"px";
	};
	$.remove=function(){
		document.body.removeChild($.dom);
	};
	$.setLeft(x);
	$.setTop(y);
	$.setWidth(w);
	$.setHeight(h);
	return $;
};
sky.dd.Drag=function(proxy,includeChild){
	sky.events.EventDispatcher.call(this);//继承EventDispatcher
	var $=this;
	proxy=Sky(proxy);
	this.dragging=false;
	Sky.attachEvent(proxy,"mousedown",function(e){
		if(!$.dragging){
			var e=window.event||e;
			var srcElement = e.srcElement?e.srcElement:e.target;
			if(includeChild || srcElement==proxy){
				if($.dispatchOnEvent("press",[e])){
					$.dragging=true;//setInterval(onMove,50);
					Sky.attachEvent(document.documentElement,'mousemove',onMove);
					Sky.attachEvent(document.documentElement,'mouseup',onRelease);
					Sky.clearSelect();
					$.dispatchAfterEvent("press",[e]);
				}
			}
		}else{
			onRelease(e);
		}
	});
	function onMove(e){
		if($.dispatchOnEvent("move",[window.event||e])){
			Sky.clearSelect();
			$.dispatchAfterEvent("move",[window.event||e]);
		}
	}
	function onRelease(e){
		if($.dispatchOnEvent("release",[window.event||e])){
			Sky.detachEvent(document.documentElement,'mouseup',onRelease);
			Sky.detachEvent(document.documentElement,'mousemove',onMove);
			//clearInterval(dragging);
			$.dragging=false;
			Sky.clearSelect();
			$.dispatchAfterEvent("release",[window.event||e]);
		}
	}

};
sky.dd.Move=function(proxy,target){
	sky.events.EventDispatcher.call(this);//继承EventDispatcher
	var $=this;
	proxy=Sky(proxy);
	target=Sky(target);
	var d=new sky.dd.Drag(proxy);
	var ab;
	var iX,iY;
	Sky.addClass(proxy,"s-drag-move");
	d.onPress=function(e){
		if($.dispatchOnEvent("press",[e])){
			iX = e.clientX - target.offsetLeft;
			iY = e.clientY - target.offsetTop;
			ab=new sky.dd.AuxiliaryBox(Sky.getPageLeft(target),Sky.getPageTop(target),target.offsetWidth-2,target.offsetHeight-2);
		}
	};
	d.afterPress=function(e){
		$.dispatchAfterEvent("press",[e]);
	};
	d.onMove=function(e){
		if($.dispatchOnEvent("move",[e])){
			ab.setLeft(e.clientX-iX);
			ab.setTop(e.clientY-iY);
			$.dispatchAfterEvent("move",[e]);
		}
	};
	d.onRelease=function(e){
		if($.dispatchOnEvent("release",[e])){
			var oX = e.clientX - iX;
			var oY = e.clientY - iY;
			with(target.style){
				top=oY+'px';
				left=oX+'px';
			}
			ab.remove();
		}
	};
	d.afterRelease=function(e){
		$.dispatchAfterEvent("release",[e]);
	};
};

sky.dd.Resize=function(target,inner){
	sky.events.EventDispatcher.call(this);//继承EventDispatcher
	var $=this;
	target=Sky(target);
	inner=Sky(inner);
	var proxy=Sky.createDiv("s-drag-resize",target);
	var d=new sky.dd.Drag(proxy);
	var ab;
	var iX,iY;
	this.minWidth=0;
	this.minHeight=0;
	d.onPress=function(e){
		if($.dispatchOnEvent("press",[e])){
			iX = e.clientX;
			iY = e.clientY;
			ab=new sky.dd.AuxiliaryBox(Sky.getPageLeft(target),Sky.getPageTop(target),target.offsetWidth-2,target.offsetHeight-2);
		}
	};
	d.afterPress=function(e){
		$.dispatchAfterEvent("press",[e]);
	};
	d.onMove=function(e){
		if($.dispatchOnEvent("move",[e])){
			var width=target.offsetWidth+e.clientX-iX;
			width=Math.max(width, $.minWidth);
			ab.setWidth(width);
			var height=target.offsetHeight+e.clientY-iY;
			height=Math.max(height, $.minHeight);
			ab.setHeight(height);
			$.dispatchAfterEvent("move",[e]);
		}
	};
	d.onRelease=function(e){
		if($.dispatchOnEvent("release",[e])){
			inner.style.display="none";
			target.style.width=ab.dom.style.width;
			inner.style.height=(ab.dom.offsetHeight-target.offsetHeight)+'px';
			inner.style.display="";
			proxy.style.bottom=0;
			ab.remove();
		}
	};
	d.afterRelease=function(e){
		$.dispatchAfterEvent("release",[e]);
	};
};
sky.layout.Accordion=function(options){
	sky.Component.call(this);//继承EventDispatcher
	var $=this;//返回对象
	var conf={
		'height':NaN,
		'panels':[]
	};
	conf=Sky.extend(conf,options);
	var panels=new Array();
	this.renderTo=function(wrap){
		$.dom=Sky.createDiv("s-accordion",wrap);
		if(conf.panels && conf.panels.length>0){
			$.addPanel.apply(this,conf.panels);
			if(!isNaN(conf.height)) $.expand(0);
		}
		if(conf.height<=0 && $.container){
			$.container.fillUp();
			$.container.after('resize',$.refreshPosition);
		}
	};
	this.remove=function(){
		$.dom.parentNode.removeChild($.dom);
		if($.container) $.container.removeListener("resize", $.refreshPosition);
	};
	$.expand=function(index){
		if($.dispatchOnEvent('expand',[index])){
			var panel=panels[index];
			panels[index].isExpand=true;
			Sky.addClass(panel.head.dom,'active');
			Sky.addClass(panel.body.dom,'show');
			//if(index== $.panels.length-1) Sky.addClass(panel.body.dom,'last');
			Sky.removeClass(panel.body.dom,'hide');
			$.dispatchAfterEvent('expand',[index]);
		}
	};
	$.collapse=function(index){
		if($.dispatchOnEvent('collapse',[index])){
			var panel=panels[index];
			panel.isExpand=false;
			Sky.removeClass(panel.head.dom,'active');
			Sky.removeClass(panel.body.dom,'show');
			//Sky.removeClass(panel.body.dom,'last');
			Sky.addClass(panel.body.dom,'hide');
			$.dispatchAfterEvent('collapse',[index]);
		}
	};
	$.toggle=function(index){
		if($.dispatchOnEvent('toggle',[index])){
			if(panels[index].isExpand){
				$.collapse(index);
			}else{
				$.expand(index);
			}
			$.dispatchAfterEvent('toggle',[index]);
		}
	};
	$.refreshPosition=function(){
		var height=$.dom.parentNode.clientHeight;
		var innerHeight=conf.height>0?height:height+conf.height;
		innerHeight--;
		for(var i=0;i<panels.length;i++){
			innerHeight-=panels[i].head.dom.offsetHeight;
		}
		for(var i=0;i<panels.length;i++){
			if(innerHeight<0) innerHeight=0;
			panels[i].body.dom.style.height=innerHeight+'px';
			//panels[i].body.style.maxHeight=innerHeight+'px';
		}
	};
	$.addPanel=function(){
		for(var i=0;i<arguments.length;i++){
			var options=arguments[i];
			if(typeof (options)=='string'){
				options={'title':options};
			}
			var panel=new sky.Panel.base($.dom,options);
			panels.push(panel);
			if(arguments[i].isExpand){
				panel.isExpand=true;
				panel.body.dom.className='s-accordion-body show';
				panel.head.dom.className='s-accordion-head active';
			}else{
				panel.isExpand=false;
				panel.body.dom.className='s-accordion-body hide';
				panel.head.dom.className='s-accordion-head';
			}
			var btn=Sky.createDiv("fa s-flat-btn",panel.toolBar);
			panel.head.dom.onclick=function(){
				for(var j=0;j<panels.length;j++){
					if(this==panels[j].head.dom){
						if(!isNaN(conf.height)){
							$.expand(j);
						}else{
							$.toggle(j);
						}
					}else if(!isNaN(conf.height)){
						$.collapse(j);
					}
				}
			};
		}
		if(!isNaN(conf.height)) $.refreshPosition();
	};
	$.panels=panels;
	return $;
};
sky.Menu=function(items){
	var $=this;
	sky.Component.call(this);//继承EventDispatcher
	$.dom=document.createElement("ul");
	$.dom.className="s-menu";
	$.items=new Array();
	$.addItem=function(btn){
		var li;
		if(btn=="-" || btn=="_"){
			li=document.createElement("li");
			li.className="s-menu-separator";
			$.dom.appendChild(li);
		}else{
			li=document.createElement("li");
			if(btn.icon){
				var icon=Sky.createIcon(btn.icon);
				Sky.addClass(icon,"icon");
				li.appendChild(icon);
			}
			li.appendChild(document.createTextNode(btn.label));
			li.onclick=function(){
				if(!Sky.hasClass(li,"disable")){
					if($.dispatchOnEvent('click',[btn])){
						if(btn.onclick){
							btn.onclick.call($);
						}
						if(btn.event){
							if($.dispatchOnEvent(btn.event,[btn])){
								$.dispatchAfterEvent(btn.event,[btn]);
							}
						}
						$.dispatchAfterEvent('click',[btn]);
					}
				}
			};
			btn.li=li;
			$.items.push(btn);
			$.dom.appendChild(li);
			return li;
		}
	}
	if(items && items.length){
		for(var i=0;i<items.length;i++){
			$.addItem(items[i]);
		}
	}
	$.enableItem=function(index,enable){
		var item=$.items[index];
		if(enable){
			Sky.removeClass(item.li,"disable")
		}else{
			Sky.addClass(item.li,"disable");
		}
	};
	$.show=function(x,y){
		$.dom.style.left=x+"px";
		$.dom.style.top=y+"px";
		document.body.appendChild($.dom);
	};
	$.popup=function(ev){
		ev=ev || window.event;
		if(ev.pageX || ev.pageY){
			$.show(ev.pageX,ev.pageY);
		}else{
			$.show(ev.clientX + document.body.scrollLeft - document.body.clientLeft,
				ev.clientY + document.body.scrollTop - document.body.clientTop);
		}
	};
	Sky.attachEvent(document.body,'click',function(){
		if($.dom.parentNode){
			$.dom.parentNode.removeChild($.dom);
		}
	});
	return $;
};
sky.tree={};
sky.tree.TreeItem=function(attribute){
	var $=this;
	this.attribute=attribute;
	this.root=null;
	this.parent=null;
	this.dom=null;
	this.listWrap=null;
	this.firstChild=null;
	this.children=null;
	this.lastChild=null;
	this.data=null;
	this.isExpand=true;
	if(attribute) this.id=attribute.id;
	this.addItem=function(treeItem){
		treeItem.root=$.root;
		treeItem.parent=$;
		if(!$.children){
			$.turnParent();
		}
		if(!$.children.length){
			$.listWrap.innerHTML="";
			$.firstChild=treeItem;
		}
		$.root.all.push(treeItem);
		$.children.push(treeItem);
		$.lastChild=treeItem;
		treeItem.dom=document.createElement("li");
		$.listWrap.appendChild(treeItem.dom);
		var a=document.createElement("a");
		treeItem.dom.appendChild(a);
		if(treeItem.attribute.checkbox!==false){
			if(treeItem.attribute.checkbox || treeItem.root.checkbox){
				if(!$.root.onlyLeafCheck || !treeItem.attribute.isParent){
					var checkbox=document.createElement("input");
					checkbox.type="checkbox";
					a.appendChild(checkbox);
					treeItem.checkbox=checkbox;
					checkbox.onclick=function(e){
						if($.root.dispatchOnEvent("check",[treeItem])){
							$.root.dispatchAfterEvent("check",[treeItem])
						}
					};
				}
			}
		}
		if(treeItem.attribute.icon){
			a.appendChild(Sky.createIcon(treeItem.attribute.icon));
		}
		if(treeItem.attribute.link){
			a.href=treeItem.attribute.link;
		}else{
			a.href="javascript:void 0;";
		}
		if(treeItem.attribute.href){
			a.href=treeItem.attribute.href;
		}else{
			a.href="javascript:void 0;";
		}
		if(treeItem.attribute.target){
			a.target=treeItem.attribute.target;
		}
		if(treeItem.attribute.title){
			a.appendChild(document.createTextNode(treeItem.attribute.title));
		}
		if(treeItem.attribute.isParent){
			treeItem.turnParent();
		}
		if(!treeItem.attribute.isExpand){
			treeItem.dom.className="collapse";
			treeItem.isExpand=false;
		}else{
			treeItem.isExpand=true;
		}
		a.onmousedown=function(e){
			if($.root.dispatchOnEvent('click',[treeItem])){
				var as=$.root.dom.getElementsByTagName("a");
				for(var i=0;i<as.length;i++){
					Sky.removeClass(as[i],'selected');
				}
				Sky.addClass(this,'selected');
				$.root.selected=treeItem.data;
				$.root.dispatchAfterEvent('click',[treeItem]);
			}else{
				return false;
			}
		};
	};
	this.activate=function(){
		var as=$.root.dom.getElementsByTagName("a");
		for(var i=0;i<as.length;i++){
			if(as[i].parentNode==this.dom){
				Sky.addClass(as[i],'selected');
			}else{
				Sky.removeClass(as[i],'selected');
			}
		}
		$.root.selected=this.data;
	};
	this.turnParent=function(){
		$.children=new Array();
		$.listWrap=document.createElement("ul");
		$.listWrap.innerHTML='<i>[空]</i>';
		$.dom.appendChild($.listWrap);
		var treeHit=document.createElement("i");
		treeHit.className="s-tree-hit";
		$.dom.insertBefore(treeHit,$.dom.firstChild);
		treeHit.onclick=function(){
			if($.root.dispatchOnEvent('hit',[$])){
				if($.isExpand){
					$.collapse();
				}else{
					$.expand();
				}
				$.root.dispatchAfterEvent('hit',[$]);
			}
		};
	};
	this.expand=function(){
		if($.children){
			if($.root.dispatchOnEvent('expand',[$])){
				$.dom.className="";
				$.isExpand=true;
				$.root.dispatchAfterEvent('expand',[$]);
			}
		}
	};
	this.collapse=function(){
		if($.children){
			if($.root.dispatchOnEvent('collapse',[$])){
				$.dom.className="collapse";
				$.isExpand=false;
				$.root.dispatchAfterEvent('collapse',[$]);
			}
		}
	};
};
sky.tree.MenuTree=function(options){
	options=Sky.extend({},options);
	sky.Component.call(this);//继承EventDispatcher
	sky.tree.TreeItem.call(this);//继承TreeItem
	var $=this;//返回对象
	this.renderTo=function(wrap){
		$.dom=document.createElement("div");
		$.dom.className=options.lines?"s-lines-tree":"s-menu-tree";
		$.listWrap=document.createElement("ul");
		wrap.appendChild($.dom);
		$.dom.appendChild($.listWrap);
	};
	this.remove=function(){
		$.dom.parentNode.removeChild($.dom);
	};
	this.selected=null;
	this.root=this;
	this.parent=null;
	this.firstChild=null;
	this.children=new Array();
	this.all=new Array();
	this.isExpand=true;
	this.checkbox=options.checkbox
	this.getItemById=function(id){
		for(var i=0;i<$.all.length;i++){
			var item=$.all[i];
			if(item.id==id){
				return item;
			}
		}
		return null;
	};
};
sky.tree.CheckTree=function(options){
	options=Sky.extend({
		'lines':true,
		'checkbox':true,
		'onlyLeafCheck':false
	},options);
	sky.tree.MenuTree.call(this,options);//继承TreeItem
	var me=this;//返回对象
	me.onlyLeafCheck=options.onlyLeafCheck;
	me.on('check',function(item){
		if(options.mode==1){
			if(item.listWrap){
				var inputs=item.listWrap.getElementsByTagName("input");
				for(var i=0;i<inputs.length;i++){
					if(inputs[i].type=="checkbox"){
						inputs[i].checked=item.checkbox.checked;
						inputs[i].indeterminate=false;
					}
				}
			}
			checkValue(item.parent,item.checkbox.checked);
		}else if(options.mode==2 || options.mode==3){
			if(item.listWrap){
				var inputs=item.listWrap.getElementsByTagName("input");
				for(var i=0;i<inputs.length;i++){
					if(inputs[i].type=="checkbox"){
						inputs[i].checked=item.checkbox.checked;
						inputs[i].indeterminate=false;
						if(options.mode==2) inputs[i].disabled=item.checkbox.checked;
					}
				}
			}
			checkValueEmpty(item.parent);
		}else if(options.mode==4){
			if(item.checkbox.checked && item.listWrap){
				var inputs=item.listWrap.getElementsByTagName("input");
				var i;
				var allEmpty=true;
				for(i=0;i<inputs.length;i++){
					if(inputs[i].type=="checkbox"){
						if(inputs[i].checked){
							allEmpty=false;
							break ;
						}
					}
				}
				if(allEmpty){
					for(i=0;i<inputs.length;i++){
						if(inputs[i].type=="checkbox"){
							inputs[i].checked=true;
						}
					}
				}
			}
		}else if(options.mode==0){
			if(item.checkbox.checked){
				var parent=item.parent;
				while(parent){
					if(!parent.checkbox.checked){
						parent.checkbox.indeterminate=true;
					}
					parent=parent.parent;
				}
			}else{
				uncheckValueEmpty(item);
			}
		}
		function uncheckValueEmpty(node){
			if(!node) return ;
			if(node.root==node) return ;
			if(node.checkbox.checked) return ;
			var checkboxs=[];
			var i;
			if(node.children){
				for(i=0;i<node.children.length;i++){
					var child=node.children[i];
					if(child.checkbox){
						checkboxs.push(child.checkbox);
					}
				}
			}
			var allEmpty=true;
			for(i=0;i<checkboxs.length;i++){
				if(checkboxs[i].checked || checkboxs[i].indeterminate){
					allEmpty=false;
					break ;
				}
			}
			if(allEmpty){
				node.checkbox.indeterminate=false;
				uncheckValueEmpty(node.parent);
			}else{
				node.checkbox.indeterminate=true;
			}
		}
		function checkValue(node,value){
			if(!node) return ;
			if(node.root==node) return ;
			var checkboxs=[];
			var i;
			for(i=0;i<node.children.length;i++){
				var child=node.children[i];
				if(child.checkbox){
					checkboxs.push(child.checkbox);
				}
			}
			var all=true;
			for(i=0;i<checkboxs.length;i++){
				if(checkboxs[i].checked!=value || checkboxs[i].indeterminate){
					all=false;
					break ;
				}
			}
			if(all){
				node.checkbox.checked=value;
				node.checkbox.indeterminate=false;

				checkValue(node.parent,value);
			}else{
				node.checkbox.indeterminate=true;
				checkValue(node.parent,!node.checkbox.checked);
			}
		}
		function checkValueEmpty(node){
			if(!node) return ;
			if(node.root==node) return ;
			var checkboxs=[];
			var i;
			for(i=0;i<node.children.length;i++){
				var child=node.children[i];
				if(child.checkbox){
					checkboxs.push(child.checkbox);
				}
			}
			var allEmpty=true;
			for(i=0;i<checkboxs.length;i++){
				if(checkboxs[i].checked!=false || checkboxs[i].indeterminate){
					allEmpty=false;
					break ;
				}
			}
			if(allEmpty){
				node.checkbox.checked=false;
				node.checkbox.indeterminate=false;
			}else{
				node.checkbox.checked=false;
				node.checkbox.indeterminate=true;
			}
			checkValueEmpty(node.parent);
		}
	});
	this.getCheckedItems=function(){
		var arr=[];
		for(var i=0;i<me.all.length;i++){
			var item=me.all[i];
			var checkbox=item.checkbox;
			if(checkbox){
				if(checkbox.checked && !checkbox.indeterminate){
					arr.push(item);
				}
			}
		}
		return arr;
	};
	this.getCheckedIds=function(){
		return getItemsId(this.getCheckedItems());
	};
	this.setCheckedByIds=function(arr){
		for(var i=0;i<arr.length;i++){
			var item=me.getItemById(arr[i]);
			if(item){
				if(item.checkbox){
					item.checkbox.checked=true;
					item.checkbox.indeterminate=false;
					if(item.root.dispatchOnEvent("check",[item])){
						item.root.dispatchAfterEvent("check",[item])
					}
				}
			}
		}
	};
	this.getCheckedLeafItems=function(){
		var arr=[];
		for(var i=0;i<me.all.length;i++){
			var item=me.all[i];
			if(item.children) continue;
			var checkbox=item.checkbox;
			if(checkbox){
				if(checkbox.checked && !checkbox.indeterminate){
					arr.push(item);
				}
			}
		}
		return arr;
	};
	this.getCheckedLeafIds=function(){
		return getItemsId(this.getCheckedLeafItems());
	};
	this.setLeafCheckedByIds=function(arr){
		for(var i=0;i<arr.length;i++){
			var item=me.getItemById(arr[i]);
			if(item){
				if(item.checkbox && !item.children){
					item.checkbox.checked=true;
					item.checkbox.indeterminate=false;
				}
			}
		}
		if(options.mode==1){
			for(var i=0;i<me.all.length;i++){
				var item=me.all[i];
				if(item.checkbox){
					if(item.children){
						var allChecked=true;
						var allEmpty=true;
						for(var j=0;j<item.children.length;j++){
							var subCheckbox=item.children[j].checkbox;
							if(subCheckbox){
								if(subCheckbox.checked){
									allEmpty=false;
								}else{
									allChecked=false;
								}
							}
						}
						if(allChecked){
							item.checkbox.checked=true;
							item.checkbox.indeterminate=false;
						}else if(allEmpty){
							item.checkbox.checked=false;
							item.checkbox.indeterminate=false;
						}else{
							item.checkbox.indeterminate=true;
						}
					}
				}
			}
		}
	};
	this.getCheckedIdsWithException=function(){
		var selection=[];
		var exception=[];
		findBy(me);
		function findBy(node){
			if(node.children){
				for(var i=0;i<node.children.length;i++){
					var item=node.children[i];
					var parentChecked=node.checkbox?node.checkbox.checked:false;
					var itemChecked=item.checkbox?item.checkbox.checked:false;
					if(!parentChecked && itemChecked){
						item.id && selection.push(item.id);
					}else if(parentChecked && !itemChecked){
						item.id && exception.push(item.id);
					}
					findBy(item);
				}
			}
		}
		return {'selection':selection,'exception':exception};
	};
	this.setCheckedByIdsWithException=function(selection,exception){
		function checkChildren(parentItem,checked){
			var children=parentItem.children;
			if(children){
				for(var i=0;i<children.length;i++){
					var item=children[i];
					if(item.checkbox){
						if(checked && exception.indexOf(item.id)>=0){
							item.checkbox.checked=false;
						}else if(!checked && selection.indexOf(item.id)>=0){
							item.checkbox.checked=true;
						}else{
							item.checkbox.checked=checked;
						}
						checkChildren(item,item.checkbox.checked);
					}else{
						checkChildren(item,checked);
					}
				}
			}
		}
		checkChildren(me,false);
	};
	this.checkAll=function(){
		for(var i=0;i<me.all.length;i++){
			var item=me.all[i];
			var checkbox=item.checkbox;
			if(checkbox){
				checkbox.checked=true;
				checkbox.indeterminate=false;
			}
		}
	};
	this.unCheckAll=function(){
		for(var i=0;i<me.all.length;i++){
			var item=me.all[i];
			var checkbox=item.checkbox;
			if(checkbox){
				checkbox.checked=false;
			}
		}
	};
	function getItemsId(items){
		var r=new Array();
		for(var i=0;i<items.length;i++){
			r.push(items[i].id);
		}
		return r;
	}

};
sky.Toolbar=function(items){
	sky.Component.call(this);//继承Component
	var $=this;
	$.items=new Array();
	this.renderTo=function(wrap){
		wrap=Sky(wrap);
		$.dom=Sky.createDiv("s-toolbar",wrap);
		for(var i=0;i<items.length;i++){
			$.addBtn(items[i]);
		}
	};
	this.addBtn=this.addButton=function(btn){
		if(btn=="|"){
			Sky.createDiv("s-bar-separator",$.dom);
		}else{
			if($.dispatchOnEvent("add",[btn])){
				if(sky.Toolbar.dispatchOnEvent("add",[btn])){
					var button=Sky.createDiv("s-toolbar-item",$.dom);
					if(btn.icon){
						button.appendChild(Sky.createIcon(btn.icon));
					}
					button.appendChild(document.createTextNode(btn.label));
					button.onclick=function(e){
						if($.dispatchOnEvent("click",[btn])){
							if(btn.onclick){
								btn.onclick.call(this,e);
							}
							if(btn.event){
								if($.dispatchOnEvent(btn.event,[btn])){
									$.dispatchAfterEvent(btn.event,[btn]);
								}
							}
							$.dispatchAfterEvent("click",[btn]);
						}
					};
					$.items.push(button);
					sky.Toolbar.dispatchAfterEvent("add",[btn]);
					$.dispatchAfterEvent("add",[btn]);
					return button;
				}
			}
		}
	};
	this.remove=function(){
		$.dom.parentNode.removeChild($.dom);
	};
};
sky.events.EventDispatcher.call(sky.Toolbar);


sky.ButtonBar=function(options){
	sky.Component.call(this);//继承Component
	var $=this;
	var conf={
		'align':'right',
		'btns':[]
	};
	conf=Sky.extend(conf,options);
	this.renderTo=function(wrap){
		wrap=Sky(wrap);
		$.dom=Sky.createDiv("s-buttonBar",wrap);
		for(var i=0;i<conf.btns.length;i++){
			$.addBtn(conf.btns[i]);
		}
		$.dom.align=conf.align;
	};
	this.addBtn=this.addButton=function(btn){
		var button=document.createElement("button");
		$.dom.appendChild(button);
		button.appendChild(document.createTextNode(btn.label));
		button.onclick=function(e){
			if($.dispatchOnEvent('click',[e])){
				if(btn.onclick){
					btn.onclick.call(this,e);
				}
				$.dispatchAfterEvent('click',[e]);
			}
		};
		//button.href="javascript:void 0";//使用a的情况
		//if(button.type=="submit") button.type="button";//使用button的情况
		return button;
	};
	return $;
};

sky.Dialog=function(options){
	sky.events.EventDispatcher.call(this);//继承EventDispatcher
	var conf={
		'width':400,
		'height':null,
		'closable':true,
		'title':'',
		'resizable':true,
		'movable':true,//自动居中,如果选false则无法拖动, 如果选true则窗口大小变化后位置不变
		'mask':true,//是否显示遮罩
		'buttonBar':null,
		'toolBar':null
	};
	conf=Sky.extend(conf,options);
	var $=this;
	this.panel=new sky.Panel(conf);
	Sky.addClass($.panel.dom,'s-dialog');
	if(conf.toolBar){
		$.toolBar=new sky.Toolbar(conf.toolBar);
		$.toolBar.renderTo($.panel.dom);
		$.panel.dom.appendChild($.panel.body.dom);
	}
	if(conf.buttonBar){
		if(conf.buttonBar instanceof sky.ButtonBar){
			$.buttonBar=conf.buttonBar;
		}else{
			$.buttonBar=new sky.ButtonBar(conf.buttonBar);
		}
		$.buttonBar.renderTo($.panel.dom);
	}else if(conf.buttons){
		$.buttonBar=new sky.ButtonBar({'btns':conf.buttons});
		$.buttonBar.renderTo($.panel.dom);
	}
	this.close=function(){
		if($.dispatchOnEvent('close')){
			$.dom.parentNode.removeChild($.dom);
			$.mask && $.mask.close();
			$.dispatchAfterEvent('close');
		}
	};
	if(conf.closable){
		$.panel.addToolBtn('\uf00d',"fa red",$.close);
	}
	if(conf.movable){
		if(conf.resizable){
			var d=new sky.dd.Resize($.panel.dom,$.panel.body.dom);
			if(conf.resizable.minWidth) d.minWidth=conf.resizable.minWidth;
			if(conf.resizable.minHeight) d.minHeight=conf.resizable.minHeight;
			d.afterRelease=function(){
				if($.panel.body.dispatchOnEvent("resize")){
					$.panel.body.dispatchAfterEvent("resize");
				}
			};
		}
		new sky.dd.Move($.panel.dom.firstChild,$.panel.dom);
	}
	this.show=function(options){
		var config=Sky.extend(conf,options);
		if(config.mask){
			$.mask=config.mask.close?config.mask:sky.Dialog.mask();
		}
		if(!conf.movable){
			var table=sky.Dialog.print();
			$.panel.renderTo(table.firstChild.firstChild.firstChild);
			$.dom=table;
		}else{
			$.dom=$.panel.dom;
			$.panel.renderTo(document.body);
			var dWidth=window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth;
			var dHeight=window.innerHeight || document.documentElement.offsetHeight || document.body.offsetHeight;
			with($.panel.dom.style){
				position="absolute";
				left=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft)+(dWidth-$.panel.dom.offsetWidth)/2+"px";
				top=Math.max(document.documentElement.scrollTop,document.body.scrollTop)+(dHeight-$.panel.dom.offsetHeight)/2+"px";
			}
		}
		if($.panel.body.dispatchOnEvent("resize")){
			$.panel.body.dispatchAfterEvent("resize");
		}
	};
	this.addBtn=function(btn){
		if($.buttonBar){
			$.buttonBar.addBtn(btn);
		}else{
			$.buttonBar=new sky.ButtonBar({'btns':[btn]});
			$.buttonBar.renderTo($.panel.dom);
		}
	};
	return $;
};
sky.Dialog.mask=function(){
	var $=new Object();
	var d=document;
	var db=d.body;
	var dd=d.documentElement;
	var mask =Sky.createDiv("s-mask",document.body);
	if(!window.XMLHttpRequest){
		var iframe = document.createElement("iframe");
		iframe.setAttribute('frameborder','0');
		iframe.setAttribute('border','0');
		mask.appendChild(iframe);
		iframe.contentWindow.document.write('<style>html,body{border:0 none;height:100%;background:#000;}</style>　');
		$.resize=function(){
			mask.style.height=dd.offsetHeight>db.offsetHeight?dd.offsetHeight:db.offsetHeight;
		};
		$.resize();
		window.attachEvent("onresize", $.resize);
	}
	$.close=function(){
		mask && mask.parentNode.removeChild(mask);
		if(!window.XMLHttpRequest){
			window.detachEvent("onresize", $.resize);
		}
	};
	return $;
};
sky.Dialog.showBusyIndicator=function(visibility){
	if(visibility){
		var mask =Sky.createDiv("s-busyIndicator",document.body);
	}else{
		var nodes=document.body.childNodes;
		for(var i=0;i<nodes.length;i++){
			if(nodes[i].className=="s-busyIndicator"){
				document.body.removeChild(nodes[i]);
			}
		}
	}
};
sky.Dialog.print=function(content){
	var d=document;
	var db=d.body;
	var dd=d.documentElement;
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	table.appendChild(tbody);
	tbody.appendChild(tr);
	tr.appendChild(td);
	table.style.position="fixed";//如果用fixed，在缩放时会有问题的
	table.style.left=table.style.top=0;
	table.style.width=table.style.height="100%";
	table.style.border="0 none";
	if(!window.XMLHttpRequest){
		table.style.position="absolute";
		table.style.top=dd.scrollTop;
		table.style.left=dd.scrollLeft;
	}
	if(window.innerHeight && window.innerHeight < dd.clientHeight){
		table.style.height=window.innerHeight+"px";
		table.style.top=Math.max(db.scrollTop,dd.scrollTop)+"px";
	}
	if(window.innerWidth && window.innerWidth < dd.clientWidth){
		table.style.width=window.innerWidth+"px";
		table.style.left=Math.max(db.scrollLeft,dd.scrollLeft)+"px";
	}
	db.appendChild(table);
	td.align="center";
	if(typeof(content)=="string"){
		td.innerHTML=content;
	}else if(content){
		td.appendChild(content);
	}
	return table;
};
sky.Dialog.waiting=function(message,options){
	var width=400;
	if(window.innerWidth && window.innerWidth<420){
		width=window.innerWidth-20;
	}
	var conf=Sky.extend({
		'width':width,
		'title':"提示",
		'content':message
	},options);
	var $=new sky.events.EventDispatcher();
	if(conf.mask && conf.mask.close){
		$.mask=conf.mask;
	}else{
		$.mask=sky.Dialog.mask();
	}
	var table=sky.Dialog.print();
	$.panel=new sky.Panel(conf);
	Sky.addClass($.panel.body.dom,"s-dialog-body");
	Sky.addClass($.panel.dom,"s-dialog");
	$.panel.renderTo(table.firstChild.firstChild.firstChild);
	$.close=function(){
		if($.dispatchOnEvent("close")){
			table.parentNode.removeChild(table);
			if($.mask) $.mask.close();
			$.dispatchAfterEvent("close");
		}
	};
	return $;
};
sky.Dialog.alert=function(message,title,mask){
	if(title==undefined) title="提示";
	var $=sky.Dialog.waiting(message,{
		'title':title,
		'content':message,
		'mask':mask
	});
	$.panel.addToolBtn('\uf00d',"fa red",$.close);
	$.buttonBar=new sky.ButtonBar({'btns':[{'label':'确定','onclick':$.close}]});
	$.buttonBar.renderTo($.panel.dom);
	return $;
};
sky.Dialog.success=function(message){
	var $=sky.Dialog.alert(message);
	Sky.addClass( $.panel.body.dom,'s-dialog-success');
	return $;
};
sky.Dialog.warn=function(message){
	var $=sky.Dialog.alert(message);
	Sky.addClass( $.panel.body.dom,'s-dialog-warn');
	return $;
};
sky.Dialog.error=function(message){
	var $=sky.Dialog.alert(message);
	Sky.addClass( $.panel.body.dom,'s-dialog-error');
	return $;
};
sky.Dialog.iframe=function(url,options){
	var $;
	var conf={
		'width':400,
		'height':300,
		'showClose':true,
		'title':'',
		'resizable':true,
		'movable':true,
		'mask':true,//是否显示遮罩
		'buttons':[{'label':'确定','onclick':function(){
			if($.dispatchOnEvent('confirm')){
				$.close();
				$.dispatchAfterEvent('confirm');
			}
		}}],
		'toolBar':null
	};
	conf=Sky.extend(conf,options);
	$=new sky.Dialog(conf);
	if(url==undefined) url='about:blank';
	var iframe=document.createElement("iframe");
	iframe.setAttribute('frameborder','0');
	iframe.setAttribute('border','0');
	$.panel.body.dom.appendChild(iframe);
	$.panel.addToolBtnAt(0,'\uf021','fa',function(){
		iframe.src=url;
	});
	Sky.addClass($.panel.body.dom,'s-dialog-iframe');
	$.show();
	iframe.src=url;
	$.frame=iframe;
	$.window=iframe.contentWindow;
	$.on('close',function(){
		iframe.src="about:blank";
	});
	return $;
};
sky.Dialog.showToast=function(msg,timeout){
	var dom=document.createElement("span");
	dom.className="s-toast";
	dom.appendChild(document.createTextNode(msg));
	var table=sky.Dialog.print(dom);
	if(!timeout){
		timeout=2000;
	}
	setTimeout(function(){
		table.parentNode.removeChild(table);
	},timeout)
};

sky.Grid=function(columns,options){
	sky.Component.call(this);//继承Component
	var conf={
		'height':NaN,
		'checkbox':false
	}
	conf=Sky.extend(conf,options);
	var $=this;
	if(conf.checkbox){
		var value=[];
		var headerCheckbox=document.createElement("INPUT");
		headerCheckbox.type="checkbox";
		headerCheckbox.onclick=function(){
			var trs=$.body.table.tbody.childNodes;
			for(var i=0;i<trs.length;i++){
				var input=trs[i].firstChild.firstChild;
				input.checked=headerCheckbox.checked;
			}
		};
		this.getChecked=function(){
			var trs=$.body.table.tbody.childNodes;
			var arr=[];
			for(var i=0;i<trs.length;i++){
				var input=trs[i].firstChild.firstChild;
				if(input.checked){
					arr.push(input.data);
				}
			}
			return arr;
		};
		if(typeof conf.checkbox=="string"){
			columns.unshift({
				'header':headerCheckbox,'align':"center",
				'name':conf.checkbox,'width':23,
				'render':function(value,data){
					var input=document.createElement("INPUT");
					input.type="checkbox";
					input.name=conf.checkbox+"["+value+"]";
					input.data=value;
					this.appendChild(input);
				}
			});
		}else{
			columns.unshift({
				'header':headerCheckbox,'align':"center",
				'name':columns[0].name,'width':23,
				'render':function(value,data){
					var input=document.createElement("INPUT");
					input.type="checkbox";
					input.data=data;
					this.appendChild(input);
				}
			});
		}
	}
	$.dom=Sky.createDiv("s-grid");
	$.header=Sky.createDiv("s-grid-header",$.dom);
	$.body=Sky.createDiv("s-grid-body",$.dom);
	$.footer=Sky.createDiv("s-grid-footer",$.dom);
	$.body.onscroll=function(){
		if(window.XMLHttpRequest){
			$.header.style.marginLeft=-$.body.scrollLeft+"px";
		}else{
			$.header.scrollLeft=$.body.scrollLeft;//ie67
		}
	};

	$.header.table=document.createElement("table");
	$.header.appendChild($.header.table);
	var node=document.createElement("thead");
	$.header.table.appendChild(node);
	$.header.table.thead=document.createElement("tr");
	node.appendChild($.header.table.thead);
	for(var i=0;i<columns.length;i++){
		var th=document.createElement("th");
		$.header.table.thead.appendChild(th);
		if(columns[i].sortable){
			var sortBtn=Sky.createDiv("s-grid-sort-btn",th);
			sortBtn.appendChild(document.createTextNode(columns[i].header));
			sortBtn.title=columns[i].header;
			sortBtn.name=columns[i].name;
			sortBtn.onclick=function(){
				var spans=this.parentNode.parentNode.getElementsByTagName("span");
				for(var i=0;i<spans.length;i++){
					spans[i].parentNode.removeChild(spans[i]);
				}
				if($.sortname==this.name && $.sortorder=="asc"){
					$.sortorder="desc";
					this.innerHTML=this.title+'<span class="fa">&#xf0d7;</span>';
				}else{
					this.innerHTML=this.title+'<span class="fa">&#xf0d8;</span>';
					$.sortorder="asc";
				}
				$.sortname=this.name;
				$.page=1;
				$.refresh();
			};
		}else{
			if(typeof columns[i].header=="string"){
				th.appendChild(document.createTextNode(columns[i].header));
			}else{
				th.appendChild(columns[i].header);
			}
		}
	}
	(function(){
		var d=new sky.dd.Drag($.header,true);
		var resizeLine=null;
		var selectedColumnIndex;
		var readyResize=false;
		var dragging=false;
		d.onPress=function(e){
			if(readyResize && !dragging){
				e = e || window.event;
				var x=e.clientX+Math.max(document.documentElement.scrollLeft,document.body.scrollLeft)-Sky.getPageLeft($.dom);
				if(!resizeLine){
					resizeLine=document.createElement("div");
					resizeLine.className="s-resize-line-v";
				}
				$.dom.appendChild(resizeLine);
				resizeLine.style.left=x+"px";
				Sky.addClass($.dom,"resizing");
				dragging=true;
			}
		};
		//平时鼠标移动到边缘就改变指针
		$.header.table.thead.onmousemove=function(e){
			e = e || window.event;
			if(!d.dragging){
				var x=e.clientX+Math.max(document.documentElement.scrollLeft,document.body.scrollLeft)-Sky.getPageLeft($.dom)+ $.body.scrollLeft;
				for(var i=0;i<this.childNodes.length;i++){
					var selectedColumn=this.childNodes[i];
					selectedColumnIndex=i;
					if(Math.abs(x-selectedColumn.offsetLeft-selectedColumn.offsetWidth)<5){
						$.header.style.cursor="w-resize";
						readyResize=true
						break ;
					}else{
						$.header.style.cursor="";
						readyResize=false;
					}
				}
			}
		};
		d.onMove=function(e){
			if(dragging){
				e = e || window.event;
				var x=e.clientX+Math.max(document.documentElement.scrollLeft,document.body.scrollLeft)-Sky.getPageLeft($.dom);
				resizeLine.style.left=x+"px";
			}
		};
		d.onRelease=function(e){
			if(dragging){
				e = e || window.event;
				var x=e.clientX;
				var ths=$.header.table.thead.childNodes;
				var selectedColumn=ths[selectedColumnIndex];
				Sky.removeClass($.dom,"resizing");
				$.dom.removeChild(resizeLine);
				$.header.style.cursor="";
				var tWidth=x-Sky.getPageLeft(selectedColumn)-1;
				if(tWidth<10)tWidth=10;
				$.body.table.firstChild.firstChild.childNodes[selectedColumnIndex].width=
					selectedColumn.width=tWidth;
				var totalWidth=0;
				for(var i=0;i<ths.length;i++){
					totalWidth+=parseInt(ths[i].width)+1;
				}
				$.header.table.width=$.body.table.width=totalWidth;
				dragging=false;
			}
		};
	})();
	$.body.table=$.header.table.cloneNode(true);
	$.body.appendChild($.body.table);
	$.body.table.thead=$.body.table.getElementsByTagName("tr")[0];
	$.body.table.tbody=document.createElement("tbody");
	$.body.table.appendChild($.body.table.tbody);
	$.footer.select=document.createElement("select");
	$.footer.select.options.add(new Option("10","10"));
	$.footer.select.options.add(new Option("20","20"));
	$.footer.select.options.add(new Option("50","50"));
	$.footer.select.options.add(new Option("100","100"));
	$.footer.select.options[1].selected=true;
	$.footer.appendChild($.footer.select);
	$.pageSize=20;
	$.page=1;
	$.footer.select.onchange=function(){
		$.pageSize=parseInt(this.value);
		$.page=1;
		$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
	};
	$.footer.firstPageBtn=Sky.createDiv("fa s-grid-btn disabled",$.footer);
	$.footer.prevPageBtn=Sky.createDiv("fa s-grid-btn disabled",$.footer);
	$.footer.pageInput=document.createElement("input");$.footer.pageInput.type="text";
	$.footer.pageInput.onblur=function(){
		var page=parseInt(this.value);
		if(!isNaN(page) && page>=1){
			$.page=page;
			$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
		}
	};
	$.footer.appendChild($.footer.pageInput);
	$.footer.totalPageDisplay=document.createTextNode("/");
	$.footer.appendChild($.footer.totalPageDisplay);
	$.footer.nextPageBtn=Sky.createDiv("fa s-grid-btn",$.footer);
	$.footer.lastPageBtn=Sky.createDiv("fa s-grid-btn",$.footer);
	$.footer.refreshPageBtn=Sky.createDiv("fa s-grid-btn",$.footer);
	$.footer.firstPageBtn.appendChild(document.createTextNode("\uf048"));
	$.footer.prevPageBtn.appendChild(document.createTextNode("\uf0d9"));
	$.footer.nextPageBtn.appendChild(document.createTextNode("\uf0da"));
	$.footer.lastPageBtn.appendChild(document.createTextNode("\uf051"));
	$.footer.refreshPageBtn.appendChild(document.createTextNode("\uf021"));

	var isTheFirstTimeShowData=true;
	this.clear=function(){
		while($.body.table.tbody.childNodes.length>0){
			$.body.table.tbody.deleteRow(0);
		}
	};
	this.setLoadingStyle=function(bool){
		if(bool){
			Sky.addClass($.body,"s-loading");
		}else{
			Sky.removeClass($.body,"s-loading");
		}
	};
	this.loadUrl=function(url,page,pageSize,sortname,sortorder){
		$.url=url;
		$.loadList.call($,page,pageSize,sortname,sortorder);
	};

	$.footer.refreshPageBtn.onclick=$.refresh=function(){
		Sky.clearSelect();
		$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
	};
	$.footer.nextPageBtn.onclick=$.nextPage=function(){
		Sky.clearSelect();
		if($.page<$.totalPage){
			$.page++;
			$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
		}
	};
	$.footer.lastPageBtn.onclick=$.lastPage=function(){
		if($.page!=$.totalPage){
			$.page=$.totalPage;
			$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
		}
	};
	$.footer.firstPageBtn.onclick=$.firstPage=function(){
		if($.page!=1){
			$.page=1;
			$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
		}
	};
	$.footer.prevPageBtn.onclick=$.prevPage=function(){
		Sky.clearSelect();
		if($.page>1){
			$.page--
			$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
		}
	};
	this.showData=function(data,page,total){
		if(page==undefined) page=1;
		if(total==undefined) total=data.length;
		total=parseInt(total);
		$.selected=undefined;
		for(var i=0;i<data.length;i++){
			var tr=document.createElement("tr");
			tr.dataId=i;
			tr.onclick=function(){
				var trs=this.parentNode.getElementsByTagName("tr");
				for(var i=0;i<trs.length;i++){
					Sky.removeClass(trs[i],"selected");
				}
				Sky.addClass(this,"selected");
				$.selected=data[this.dataId];
			};
			$.body.table.tbody.appendChild(tr);
			for(var j=0;j<columns.length;j++){
				var td=document.createElement("td");
				tr.appendChild(td);
				if('align' in columns[j]){
					td.align=columns[j].align;
				}
				var value=data[i][columns[j].name];
				if(columns[j].render){
					Sky.render(td,columns[j].render,[value,data[i]]);
				}else if(value){
					td.appendChild(document.createTextNode(value));
				}
			}
		}
		$.totalPage=parseInt(Math.ceil(total/$.pageSize));
		$.footer.totalPageDisplay.data="/"+$.totalPage;
		$.footer.pageInput.value=page;
		if(page==1){
			Sky.addClass($.footer.firstPageBtn,"disabled");
			Sky.addClass($.footer.prevPageBtn,"disabled");
		}else{
			Sky.removeClass($.footer.firstPageBtn,"disabled");
			Sky.removeClass($.footer.prevPageBtn,"disabled");
		}
		if(page==$.totalPage){
			Sky.addClass($.footer.nextPageBtn,"disabled");
			Sky.addClass($.footer.lastPageBtn,"disabled");
		}else{
			Sky.removeClass($.footer.nextPageBtn,"disabled");
			Sky.removeClass($.footer.lastPageBtn,"disabled");
		}
		if(isTheFirstTimeShowData){
			isTheFirstTimeShowData=false;
			setTimeout(function(){
				var clientWidth=$.body.clientWidth;
				var remainWidth=clientWidth-columns.length;
				var remainCount=0;
				var arr;
				for(var i=0;i<columns.length;i++){
					if(typeof columns[i].width=="string" && (arr=columns[i].width.match(/(\d+)%/))){
						columns[i].width=Math.round(clientWidth*parseFloat(arr[1])/100);
						if(columns[i].minWidth && columns[i].width<columns[i].minWidth){
							columns[i].width=columns[i].minWidth;
						}
						remainWidth-=columns[i].width;
					}else if(typeof columns[i].width=="number"){
						remainWidth-=columns[i].width;
					}else{
						remainCount++;
					}
				}
				if(remainWidth>0){
					for(var i=0;i<columns.length;i++){
						if(typeof columns[i].width!="number"){
							columns[i].width=Math.round(remainWidth/remainCount);
							remainWidth-=columns[i].width;
							remainCount--;
						}
						$.body.table.thead.childNodes[i].width=$.header.table.thead.childNodes[i].width=columns[i].width;
					}
				}
				var totalWidth=0;
				for(var i=0;i<columns.length;i++){
					totalWidth+=columns[i].width;
				}
				$.header.table.width=$.body.table.width=totalWidth;
			},0);
		}

	};
	this.getSelected=function(){
		return $.selected;
	};
	this.renderTo=function(wrap){
		wrap=Sky(wrap);
		wrap.appendChild($.dom);
		if(conf.height>50){
			$.body.style.height=conf.height-$.header.offsetHeight-$.footer.offsetHeight+'px';
		}else if(conf.height>0){
			$.body.style.height=conf.height+'px';
		}else{
			if($.container){
				$.container.fillUp();
				$.container.after('resize', $.refreshSize);
			}
			$.refreshSize();
		}
		if(conf.checkbox){
			Sky.attachEvent($.body.table,'click',function(e){
				var target=(e&&e.target)?e.target:window.event.srcElement;
				var parentNode=target;
				var tr,td;
				var tbody=$.body.table.getElementsByTagName("tbody")[0];
				if(tbody==parentNode) return ;
				do{
					td=tr;
					tr=parentNode;
					parentNode=parentNode.parentNode;
				}while(parentNode!=tbody)
				if(td && td==tr.firstChild){

				}else{
					var trs=tbody.childNodes;
					var arr=[];
					for(var i=0;i<trs.length;i++){
						var input=trs[i].firstChild.firstChild;
						input.checked=false;
					}
					tr.firstChild.firstChild.checked=true;
				}
			});
		}
	};
	this.refreshSize=function(){
		if(conf.height<=0){
			var remainHeight=$.dom.parentNode.clientHeight-$.header.offsetHeight-$.footer.offsetHeight;
			if(remainHeight>50){
				$.body.style.height=remainHeight+conf.height+"px";
			}
		}
	};
};

sky.Grid.prototype.loadList=function(page,pagesize,sortname,sortorder){
	var grid=this;
	var param={};
	if(page) param.page=page;
	if(pagesize) param.pagesize=pagesize;
	if(sortname) param.sortname=sortname;
	if(sortorder) param.sortorder=sortorder;
	this.clear();
	this.setLoadingStyle(true);
	Sky.post(this.url,param,function(data){
		grid.setLoadingStyle(false);
		grid.showData(data.items,page,data.total);
	},'json',function(data){
		grid.setLoadingStyle(false);
		if(this.status==405){
			alert('不能请求静态资源');
		}else if(this.status==404){
			alert('动态资源请求失败');
		}else if(this.status==403){
			alert('权限不足');
		}else{
			if(sky.Dialog){
				sky.Dialog.error(data);
			}else{
				alert('请求失败');
			}
		}
	});
};
sky.editor={};
sky.Editor=function(element,options,tag,type){
	var $=this;
	var conf={
		'required':false,
		'pattern':null,
		'value':null,//初始值
		'width':null,
		'height':null,
		'title':null,
		'maxLength':0,
		'validator':function(){
			var val=this.getValue();
			var required=options.required;
			var pattern=options.pattern;
			if(required){
				if(!val){
					return false;
				}
			}
			if(pattern && val){
				if(pattern.test && !pattern.test(val)){
					return false;
				}else if(typeof pattern ==='function'){
					return pattern.call(this,val);
				}else if(typeof pattern ==='string'){
					pattern=new RegExp(pattern);
					if(!pattern.test(val)) return false;
				}
			}
			if(options.maxLength){
				if(val && val.length && val.length>options.maxLength){
					return false;
				}
			}
			return true;
		}
	};
	for( var key in conf){
		if(!(key in options)){
			options[key]=conf[key];
		}
	}
	sky.events.EventDispatcher.call(this);//继承EventDispatcher
	element=Sky(element);
	this.isEditing=false;
	this.dom=document.createElement("div");
	if(element.tagName.toUpperCase()==tag.toUpperCase()){
		$.input=element;
		if(element.required)options.required=element.required;
		if(element.pattern)options.pattern=element.pattern;
		element.parentNode.insertBefore($.dom,$.input);
		if($.input.value!=null){
			options.value=$.input.value;
		}
	}else{
		element.appendChild($.dom);
		$.input=document.createElement(tag);
		if(type){$.input.type=type;}
	}
	$.dom.appendChild($.input);
	this.setWidth=function(width){
		if(typeof(width)=="number" ){
			$.dom.style.width=width-2+"px";
		}else{
			$.dom.style.width=width;
		}
	};
	this.setHeight=function(height){
		if(typeof(height)=="number" ){
			$.dom.style.lineHeight=$.dom.style.height=height-2+"px";
		}else{
			$.dom.style.lineHeight=$.dom.style.height=height;
		}
	};
	if(options.width){
		$.setWidth(options.width);
	}
	if(options.height){
		$.setHeight(options.height);
	}
	this.remove=function(){
		$.dom.parentNode.removeChild($.dom);
	};
	this.setText=function(){};
	this.setValue=function(val){
		$.input.value=val;
	};
	this.getValue=this.getText=function(){
		return $.input.value;
	};
	this.enabled=true;
	this.enable=function(){
		Sky.removeClass($.dom,"s-disabled");
		$.input.readOnly=false;
		$.enabled=true;
	};
	this.disable=function(){
		Sky.addClass($.dom,"s-disabled");
		$.input.readOnly=true;
		$.enabled=false;
	};
	var _validity=true;
	var tooltip;
	$.markInvalid=function(tip){
		Sky.addClass($.dom,"s-invalid");
		_validity=false;
		if(tip || options.title){
			if(!tooltip){
				tooltip=Sky.createDiv("s-tooltip");
			}
			$.dom.insertBefore(tooltip, $.dom.firstChild);
			tooltip.innerHTML='';
			if(tip){
				tooltip.appendChild(document.createTextNode(tip));
			}else{
				tooltip.appendChild(document.createTextNode(options.title));
			}
		}
	};
	$.clearInvalid=function(){
		Sky.removeClass($.dom,"s-invalid");
		if(tooltip && tooltip.parentNode){
			tooltip.parentNode.removeChild(tooltip);
		};
		_validity=true;
	};
	this.valid=function(bool){
		if(bool==false){
			$.markInvalid();
		}else{
			$.clearInvalid();
		}
	};
	this.isValid=function(){
		return _validity;
	};
	this.validate=function(){
		if(options.validator.call($)){
			$.clearInvalid();
			return true;
		}else{
			$.markInvalid();
			return false;
		}
	};
	this.clear=function(){
		$.setValue(null);
	};
	this.reset=function(){
		if(options.value){
			$.setValue(options.value);
		}else{
			this.clear();
		}
	};
	if(!options.required){//没有规定必填，就显示清空按钮
		$.clearBtn=document.createElement("div");
		$.clearBtn.className="s-editor-clearBtn";
		$.clearBtn.appendChild(document.createTextNode("×"));
		$.clearBtn.onclick=function(){
			if($.enabled){
				$.clearInvalid();
				$.setValue(null);
			}
		};
	}
};
sky.editor.TextArea=function(element,options){
	var conf={
		'height':120
	};
	conf=Sky.extend(conf,options);
	sky.Editor.call(this,element,conf,"textArea");
	Sky.addClass(this.dom,"s-textBox");
	this.input.style.height=this.dom.style.height;
};
sky.editor.TextInput=sky.editor.TextBox=function(element,options){
	var conf={
		'title':null,
		'value':null,
		'pattern':null,
		'required':false,
		'blankText':"请输入..",
		'maxLength':0
	};
	conf=Sky.extend(conf,options);
	sky.Editor.call(this,element,conf,"input","text");
	var $=this;
	$.dom.className="s-textBox";
	var blankText=document.createTextNode("");
	this.dom.appendChild(blankText);
	var _value;
	this.setValue=function(val){
		if($.dispatchOnEvent("change")){
			if(val==null){
				$.input.value="";
				$.input.style.display="none";
				blankText.data=conf.blankText;
				if($.clearBtn){
					$.clearBtn.style.display="none";
				}
				_value=null;
			}else{
				$.input.value=_value=val;
				$.input.style.display="";
				blankText.data="";
				if($.clearBtn){
					$.clearBtn.style.display="";
				}
			}
			$.dispatchAfterEvent("change")
		}
	};
	this.getValue=function(){
		if(_value==null) return null;
		return $.input.value;
	};
	$.dom.onclick=function(e){
		if($.enabled){
			var target= e?e.target:window.event.srcElement;
			if(target== $.dom ){
				if($.input.style.display=="none"){
					$.setValue("");
					$.input.focus();
				}
			}
		}
	};
	$.input.onblur=function(){
		$.validate();
		if($.dispatchOnEvent("change")){
			$.dispatchAfterEvent("change")
		}
	};
	if(conf.maxLength){this.input.maxLength=conf.maxLength;}
	if(!conf.required){//没有规定必填，就显示清空按钮
		$.dom.insertBefore($.clearBtn,$.dom.firstChild);
	}
	//初始值
	if(!conf.value){this.setValue(null);}else{this.setValue(conf.value);};
};

sky.editor.NumberInput=function(element,options){
	var $=this;
	var conf={
		'title':null,
		'value':null,
		'required':false,
		'pattern':null,
		'blankText':"请输入..",
		'step':1,
		'min':Number.NEGATIVE_INFINITY,
		'max':Number.POSITIVE_INFINITY
	};
	conf.validator=function(){
		var val=this.getValue();
		var required=!!conf.required;
		if(required){
			if(val==null){
				return false;
			}
		}
		if(val==null){
			if(required){
				return false;
			}
		}else{
			if(isNaN(val)){
				return false;
			}
			if(conf.min>val){
				return false;
			}
			if(conf.max<val){
				return false;
			}
		}
		return true;
	};
	conf=Sky.extend(conf,options);
	sky.Editor.call(this,element,conf,"input","number");
	$.dom.className="s-textBox";
	this.setValue=function(val){
		if(val==null){
			$.input.value="";
		}else{
			$.input.value=val;
		}
	};
	this.getValue=function(){
		if($.input.value){
			return Number($.input.value);
		}else{
			return null;
		}
	};
	$.input.onblur=function(){
		$.validate();
		if($.dispatchOnEvent("change")){
			$.dispatchAfterEvent("change")
		}
	};
	//初始值
	if(!conf.value){this.setValue(null);}else{this.setValue(conf.value);};
	if(conf.min){this.input.min=conf.min;}
	if(conf.max){this.input.max=conf.max;}
	if(conf.step){this.input.step=conf.step;}
	if(conf.blankText){this.input.placeholder=conf.blankText;}
};


sky.editor.CheckBox=function(element,options){
	var $=this;
	var conf={
		'validator':function(){
			return true;
		},
		'type':"boolean",//number
		'label':null
	};
	conf=Sky.extend(conf,options);
	conf.required=false;//这个必须不用必填
	sky.Editor.call(this,element,conf,"input","checkbox");
	Sky.addClass(this.dom,"s-checkBox");
	this.setValue=function(value){
		if($.dispatchOnEvent("change")){
			$.input.checked=value;
			$.dispatchAfterEvent("change")
		}
	};
	$.input.onclick=function(){
		if($.dispatchOnEvent("change")){
			$.dispatchAfterEvent("change")
		}
	}
	this.getValue=function(){
		if(conf.type.toLowerCase()=="boolean"){
			return $.input.checked;
		}
		return $.input.checked?1:0;
	};
	this.getText=function(){
		if( $.input.checked){
			return "是";
		}
		return "否";
	};
	this.enable=function(){
		this.enabled=true;
		this.input.disabled=false;
	};
	this.disable=function(){
		this.input.disabled=true;
		this.enabled=false;
	};
	if(conf.label) this.dom.appendChild(document.createTextNode(conf.label));
};

sky.editor.PopupInput=function(element,options){
	var $=this;
	var conf={
		'title':null,
		'value':null,
		'pattern':null,
		'required':false,
		'blankText':"请输入..",
		'maxLength':0
	};
	conf=Sky.extend(conf,options);
	sky.editor.TextInput.call(this,element,conf);
	Sky.addClass(this.dom,"s-autoBox");
	this.addon=Sky.createDiv("s-editor-addon",this.dom);
	$.addon.appendChild(document.createTextNode("…"));
	$.addon.onclick=function(){
		if($.enabled){
			if($.dispatchOnEvent("click")){
				if(conf.onclick){
					conf.onclick.call(this);
				}
				$.dispatchAfterEvent("click")
			}
		}
	};
	if(conf.readOnly){
		$.input.readOnly=true;
	}
	if(conf.value!=null){
		$.value=conf.value;
	}
};
sky.editor.SelectInput=function(element,options){
	var $=this;
	var conf={
		'title':null,
		'value':null,
		'pattern':null,
		'required':false,
		'blankText':"请输入..",
		'maxLength':0,
		'source':[],
		'selectBoxWidth':NaN,
		'selectBoxHeight':200
	};
	conf=Sky.extend(conf,options);
	sky.editor.PopupInput.call(this,element,conf);
	Sky.addClass( this.addon,"fa");
	this.addon.innerHTML='&#xf107;';
	var dropDownBox=new sky.SelectPicker();
	this.addon.onclick=function(){
		if($.enabled){
			if(!$.isEditing){
				var left=Sky.getPageLeft($.dom);
				var top=Sky.getPageTop($.dom)+$.dom.offsetHeight;
				var width;
				if(isNaN(conf.selectBoxWidth)){
					width=$.dom.clientWidth;
				}else{
					width=conf.selectBoxWidth;
				}
				dropDownBox.show(left,top,width);
				if('maxHeight' in dropDownBox.dom.style){
					dropDownBox.dom.style.maxHeight=conf.selectBoxHeight+"px";
				}else{
					dropDownBox.dom.style.height=conf.selectBoxHeight+"px";
				}
				$.isEditing=true;
			}
		}
	};
	dropDownBox.on('close',function(){
		$.isEditing=false;
	});
	var ul=document.createElement("ul");
	ul.className="s-editor-dropDownList";
	dropDownBox.dom.appendChild(ul);
	this.addItem=function(){
		for(var i=0;i<arguments.length;i++){
			var li=document.createElement("li");
			li.title=arguments[i];
			ul.appendChild(li);
			li.appendChild(document.createTextNode(arguments[i]));
			li.onmousedown=function(){
				var lis=this.parentNode.childNodes;
				for(var i=0;i<lis.length;i++){
					lis[i].className="";
				}
				this.className="selected";
				$.setValue(this.title);
			};
			li.onclick=function(){
				$.isEditing=false;
				dropDownBox.close();
			};
		}
	};
	if(conf.source){
		this.addItem.apply(this,conf.source);
	}
};
sky.editor.DateInput=function(element,options){
	var $=this;
	var conf={
		'title':"日期格式为：yyyy-MM-dd",
		'value':null,
		'required':false,
		'blankText':"未填写..",
		'readOnly':false,
		'format':"yyyy-MM-dd",
		'showTime':false,
		'type':'date'//date string timestamp time
	};
	conf.validator=function(){
		var value= $.getValue();
		if(value){
		}else{
			if(conf.required){
				return false
			}
		}
		return true;
	};
	conf=Sky.extend(conf,options);
	sky.editor.PopupInput.call(this,element,conf);
	Sky.addClass( this.addon,"fa");
	this.addon.innerHTML='&#xf073;';
	$.input.onblur=function(){
		var text= this.value;
		if(text){
			text=text.replace(/\-/g,"/");
			var date=new Date(text);
			if(isNaN(date)){
				$.markInvalid();
				return ;
			}else{
				$.setValue(date);
			}
		}else{
			$.setValue(null);
		}
		$.validate();
		if($.dispatchOnEvent("change")){
			$.dispatchAfterEvent("change")
		}
	};
	$.dom.onclick=function(e){
		if($.enabled){
			var target= e?e.target:window.event.srcElement;
			if(target== $.dom ){
				if($.input.style.display=="none"){
					$.setValue(new Date());
					$.input.focus();
				}
			}
		}
	};
	this.getText=this.getValue;
	this.setText=this.setValue;
	var datepicker;
	var event;
	if(conf.showTime){
		datepicker=new sky.picker.DateTimePicker(new Date());
		event="onConfirm";
	}else{
		datepicker=new sky.picker.DatePicker(new Date());
		event="afterPick";
	}
	$.on('click',function(){
		$.isEditing=true;
		var left;
		if($.dom.offsetWidth>206){
			left=Sky.getPageLeft($.dom)-206+$.dom.offsetWidth;
		}else{
			left=Sky.getPageLeft($.dom);
		}
		var top=Sky.getPageTop($.dom)+$.dom.offsetHeight;
		datepicker.show(left,top);
	});
	datepicker[event]=function(){
		if($.dispatchOnEvent("change")){
			$.setText(this.value.format(conf.format));
			$.value=this.value;
			$.dispatchAfterEvent("change");
		}
		this.close();
	};
	datepicker.onClose=function(){
		$.isEditing=false;
	};
	this.getValue=function(){
		var value;
		switch(conf.type.toLowerCase()){
			case "string":
				value=$.value.format(conf.format);
				break ;
			case "timestamp":
				value=parseInt($.value.getTime()/1000);
				break ;
			case "time":
				value=$.value.getTime();
				break ;
			default :
				value=$.value;
		}
		return value;
	};
	this.setValue=function(date){
		if($.dispatchOnEvent("change")){
			if(date){
				switch(typeof date){
					case "object":
						break ;
					case "number":
						date=new Date(date);
						if(isNaN(date)){
							date=new Date(date*1000);
						}
						break ;
					case "string":
						date=new Date(date.replace(/\-/g,'/'));
						break ;
					default :
						date=null;
				}
			}
			if(date){
				datepicker.value=date;
				datepicker.loadDate(date);
				$.setText(date.format(conf.format));
			}else{
				$.setText(null);
				date=null;
			}
			$.value=date;
			$.dispatchAfterEvent("change")
		}
	};
};

sky.editor.DateTimeInput=function(element,options){
	var $=this;
	var conf={
		'title':"日期格式错误",
		'value':null,
		'required':false,
		'blankText':"未填写..",
		'readOnly ':false,
		'format':"yyyy-MM-dd hh:mm:ss",
		'showTime':true,
		'type':'date'//date string timestamp time
	};
	conf=Sky.extend(conf,options);
	sky.editor.DateInput.call(this,element,conf);
};
sky.editor.PopupBox=function(element,options){
	var $=this;
	var conf={
		'blankText':"请选择..",
		'text':"　",
		'value':null,
		'render':null,//这个暂时还没考虑好
		'displayField':"name",
		'valueField':"id",
		'dataUrl':null
	};
	conf=Sky.extend(conf,options);
	sky.Editor.call(this,element,conf,"input","hidden");
	this.input.style.display="none";
	Sky.addClass($.dom,"s-popupBox");
	var blankText=document.createTextNode("");
	$.dom.appendChild(blankText);
	this.caption=document.createElement("span");
	$.caption.className="s-editor-caption";
	$.caption.appendChild(document.createTextNode(conf.text));
	$.dom.insertBefore($.caption,$.dom.firstChild);
	if(!conf.required){//没有规定必填，就显示清空按钮
		$.dom.insertBefore($.clearBtn,$.dom.firstChild);
	}
	this.trigger=document.createElement("div");
	$.trigger.className="s-editor-trigger";
	$.trigger.appendChild(document.createTextNode("…"));
	$.dom.insertBefore($.trigger,$.dom.firstChild);
	this.setText=function(txt){
		$.caption.innerHTML="";
		$.caption.appendChild(document.createTextNode(txt));
	};
	this.getText=function(){
		return $.caption.innerText || $.caption.textContent;
	};
	this.getValue=function(){
		return $.value;
	};
	this.setValue=function(val){
		if($.dispatchOnEvent("change")){
			$.value=val;
			if(val==null){
				$.input.value="";
				blankText.data=conf.blankText;
				if($.clearBtn) $.clearBtn.style.display="none";
				if($.caption) $.caption.style.display="none";
			}else{
				$.input.value=val;
				blankText.data="";
				if($.clearBtn) $.clearBtn.style.display="";
				if($.caption) $.caption.style.display="";
			}
			$.dispatchAfterEvent("change");
		}
	};
	if(conf.onclick){
		$.on('click',conf.onclick);
	}
	$.trigger.onclick=function(){
		if($.enabled){
			if($.dispatchOnEvent("click")){
				$.dispatchAfterEvent("click");
			}
		}
	};
	this.loadText=function(url){
		Sky.ajax.get(url+'?'+conf.valueField+'='+encodeURIComponent($.getValue()),function(data){
			if($.dispatchOnEvent("change")){
				$.setText(data[conf.displayField]);
				$.dispatchAfterEvent("change");
			}
		},'json');
	};
	$.setValue(conf.value);
};
sky.editor.PagePopupBox=function(element,options){
	var $=this;
	var conf={
		'url':"query.jsp",
		'run':"grid.getSelected()"
	};
	conf=Sky.extend(conf,options);
	sky.editor.PopupBox.call(this,element,conf);
	$.on('click',function(){
		$.isEditing=true;
		var dl=sky.Dialog.iframe(conf.url);
		dl.onConfirm=function(){
			var selection=dl.window.eval(conf.run);
			if(selection){
				$.setValue(selection[conf.valueField]);
				$.setText(selection[conf.displayField]);
			}else{
				alert("请选择一行");
				return false;
			}
			$.isEditing=false;
		};
	});
};
sky.editor.ComboBox=sky.editor.SelectBox=function(element,options){
	var $=this;
	var conf={
		'displayField':"name",
		'valueField':"id",
		'selectBoxWidth':NaN,
		'selectBoxHeight':200
	};
	conf=Sky.extend(conf,options);
	sky.editor.PopupBox.call(this,element,conf);
	Sky.addClass(this.dom,"s-comboBox");
	Sky.addClass( this.trigger,"fa");
	this.trigger.innerHTML='&#xf107;';
	var dropDownBox=new sky.SelectPicker();
	$.on('click',function(){
		if(!$.isEditing){
			if($.dispatchOnEvent("expand")){
				var left=Sky.getPageLeft($.dom);
				var top=Sky.getPageTop($.dom)+$.dom.offsetHeight;
				var width;
				if(isNaN(conf.selectBoxWidth)){
					width=$.dom.clientWidth;
				}else{
					width=conf.selectBoxWidth;
				}
				dropDownBox.show(left,top,width);
				if('maxHeight' in dropDownBox.dom.style){
					dropDownBox.dom.style.maxHeight=conf.selectBoxHeight+"px";
				}else{
					dropDownBox.dom.style.height=conf.selectBoxHeight+"px";
				}
				$.isEditing=true;
				$.dispatchAfterEvent("expand");
			}
		}
	});
	dropDownBox.on('close',function(){
		$.isEditing=false;
	});
	var ul=document.createElement("ul");
	ul.className="s-editor-dropDownList";
	dropDownBox.dom.appendChild(ul);
	this.addItem=function(){
		for(var i=0;i<arguments.length;i++){
			var li=document.createElement("li");
			ul.appendChild(li);
			li.appendChild(document.createTextNode(arguments[i][conf.displayField]));
			li.data=arguments[i][conf.valueField];
			//li.title=arguments[i][conf.displayField];
			li.onmousedown=function(){
				var lis=this.parentNode.childNodes;
				for(var i=0;i<lis.length;i++){
					lis[i].className="";
				}
				this.className="selected";
				//$.setText(this.title);
				$.setValue(this.data);
			};
			li.onclick=function(){
				if($.dispatchOnEvent("select")){
					$.isEditing=false;
					dropDownBox.close();
					$.dispatchAfterEvent("select");
				}
			};
		}
		$.updateText();
	};
	this.removeItemAt=function(index){
		conf.source.splice(index,1);
		ul.removeChild(ul.childNodes[index]);
	};
	this.removeItem=function(value){
		var index=Sky.inArray(conf.source,value,conf.valueField);
		$.removeItemAt(index);
	};
	this.clearItem=function(){
		ul.innerHTML="";
		conf.source=new Array();
	};
	this.updateText=function(){
		var val= $.getValue();
		var index=Sky.inArray(conf.source,val,conf.valueField);
		if(index>=0){
			$.setText(conf.source[index][conf.displayField]);
		}else{
			$.setText(val);
		}
	};
	this.loadItem=function(url){
		Sky.ajax.get(url,function(data){
			conf.source=data;
			$.addItem.apply(this,conf.source);
		},'json');
	};
	if(conf.source){
		if(typeof conf.source=="string"){
			$.loadItem(conf.source);
			conf.source=[];
		}else{
			$.addItem.apply(this,conf.source);
		}
	}
	$.after("change", $.updateText);
};
sky.editor.MaskedInput=function(element,options){
	var $=this;
	var conf={
		'title':null,
		'value':null,
		'required':false,
		'pattern':null
	};
	conf=Sky.extend(conf,options);
	sky.Editor.call(this,element,conf,"input","hidden");
	$.dom.className="s-maskedBox";
	var subInputs=[];
	$.subInputs=subInputs;
	var substring=[];
	(function(){
		if(conf.pattern){
			var source=conf.pattern.source;
			source=source.replace(/\\\(/g,"\（").replace(/\\\)/g,"\）");
			source=source.replace(/^\^/,"").replace(/\$$/,"");
			var a;
			a=source.match(/^[^\(]+\(/);
			if(a){
				substring.push(createSubInputSplit(a[0].replace(/\($/,"")));
			}else{
				substring.push("");
			}
			a=source.match(/\([^\)]+\)/g);
			b=source.match(/\)[^\(]+\(/g);
			for(var i=0;i< b.length;i++){
				substring.push(createSubInput(a[i]));
				substring.push(createSubInputSplit(b[i].replace(/^\)/,"").replace(/\($/,"")));
			}
			substring.push(createSubInput(a[b.length]));
			a=source.match(/\)[^\)]+$/);
			if(a){
				substring.push(createSubInputSplit(a[0].replace(/^\)/,"")));
			}else{
				substring.push("");
			}
			for(var i=0;i< subInputs.length;i++){
				if(i<subInputs.length-1){
					addKeyEvent(i);
				}
				subInputs[i].onblur=function(){
					$.input.value= $.getValue();
					var allFinnish=true;
					var index;
					for(var i=0;i< subInputs.length;i++){
						if(subInputs[i].value==""){
							allFinnish=false;
						}
						if(this==subInputs[i]){
							index=i;
						}
					}
					if($.dispatchOnEvent("blur",[this,index])){
						$.validate();
						$.dispatchAfterEvent("blur",[this,index]);
					}
				};
				subInputs[i].onfocus=function(){
					$.clearInvalid();
					if(this.setSelectionRange) {
						this.setSelectionRange(0, this.value.length);
					}else if(this.createTextRange){
						var range = this.createTextRange();
						range.collapse(true);
						range.moveEnd('character', 0);
						range.moveStart('character', this.value.length);
						range.select();
					}
				};
			}
		}
		function addKeyEvent(i){
			subInputs[i].onkeypress=function(e){
				e = e || window.event;
				var keyValue = e.charCode || e.which || e.keyCode;
				if(keyValue){
					if(substring[i*2+2].indexOf(String.fromCharCode(keyValue))==0){
						e.returnValue = false;
						if(e.preventDefault){
							e.preventDefault();
						}
						subInputs[i+1].focus();
					}
				}
			}
			subInputs[i].onkeyup=function(){
				if(this.value.length==this.maxLength){
					subInputs[i+1].focus();
				}
			};
		}
		function createSubInput(patten){
			patten=patten.replace(/\（/g,"\(").replace(/\）/,"\)");
			var input=document.createElement("input");
			input.type="text";
			var arr;
			var min;
			if(arr=patten.match(/{(\d+)}\)/)){
				input.maxLength=input.size=parseInt(arr[1]);
			}else if(arr=patten.match(/{(\d+),(\d+)}\)/)){
				input.maxLength=parseInt(arr[2]);
				input.size=parseInt(arr[1]);
				autosize(input,input.size);
			}else if(arr=patten.match(/{(\d+),}\)/)){
				input.size=parseInt(arr[1]);
				autosize(input,input.size);
			}else{
				input.size=1;
				autosize(input,1);
			}
			function autosize(input,min){
				if('oninput' in input) {
					input.addEventListener("input", func, false);
				}else{
					input.onpropertychange=func;
				}
				function func(){
					var rLength=this.value.length;
					if(rLength<1) rLength=1;
					if(rLength>=min){
						this.size=rLength;
					}else{
						this.size=min;
					}
				}
			}
			subInputs.push(input);
			$.dom.appendChild(input);
			return new RegExp(patten);
		}
		function createSubInputSplit(txt){
			txt=txt.replace(/\（/g,"\(").replace(/\）/,"\)");
			$.dom.appendChild(document.createTextNode(txt));
			return txt;
		}
	})();



	this.setValue=function(val){
		if($.dispatchOnEvent("change")){
			if(val==null){
				for(var i=0;i<subInputs.length;i++){
					subInputs[i].value="";
				}
			}else{
				var arr=val.match(conf.pattern);
				if(arr){
					for(var i=0;i<subInputs.length;i++){
						subInputs[i].value=arr[i+1];
						var rLength=subInputs[i].value.length;
						if(rLength>subInputs[i].size){
							subInputs[i].size=rLength;
						}
					}
					$.clearInvalid();
				}else{
					$.markInvalid();
				}
			}
			$.dispatchAfterEvent("change");
		}
	};
	this.getValue=function(){
		var str="";
		var allEmpty=true;
		for(var i=0;i<substring.length;i++){
			if(substring[i] instanceof RegExp){
				var value=subInputs[(i-1)/2].value;
				str+=value;
				if(value!=""){
					allEmpty=false;
				}
			}else{
				str+=substring[i];
			}
		}
		if(allEmpty){
			return null;
		}
		return str;
	};
	this.enable=function(){
		Sky.removeClass($.dom,"s-disabled");
		for(var i=0;i< subInputs.length;i++){
			subInputs[i].readOnly=false;
		}
		$.enabled=true;
	};
	this.disable=function(){
		Sky.addClass($.dom,"s-disabled");
		for(var i=0;i< subInputs.length;i++){
			subInputs[i].readOnly=true;
		}
		$.enabled=false;
	};
	//初始值
	if(!conf.value){this.setValue(null);}else{this.setValue(conf.value);};
	if(!conf.required){//没有规定必填，就显示清空按钮
		$.clearBtn.appendChild(document.createTextNode("×"));
	}
};
sky.SelectPicker=function(html){
	var $=this;
	sky.events.EventDispatcher.call(this);//继承EventDispatcher
	this.dom=Sky.createDiv("s-selectpicker");
	if(html){
		if(typeof html=="string"){
			this.dom.innerHTML=html;
		}else{
			this.dom.appendChild(html);
		}
	}
	this.show=function(left,top,width,height){
		document.body.appendChild(this.dom);
		if(left!=undefined){this.dom.style.left=left+'px';}
		if(top!=undefined){this.dom.style.top=top+'px';}
		if(width){this.dom.style.width=width+'px';}
		if(height){this.dom.style.height=height+'px';}
		sky.Blur.attach(this.dom,function(){
			$.close();
		});
	};
	this.close=function(){
		if(this.dispatchOnEvent("close")){
			if(this.dom.parentNode){
				this.dom.parentNode.removeChild(this.dom);
			}
			sky.Blur.detach(this.dom);
			this.dispatchAfterEvent("close");
		}
	};
};

sky.picker={};
sky.picker.DatePicker=function(date){
	var dayName=["日","一","二","三","四","五","六"];
	var $=this;
	if(date){this.value=date}
	else{this.value=new Date();};
	var pointDate=new Date();
	sky.SelectPicker.call(this);
	//$.dom.style.width="220px";
	Sky.addClass($.dom,"s-datepicker");
	var head=Sky.createDiv("s-datepicker-head", $.dom);
	var headTable=document.createElement("table");
	head.appendChild(headTable);
	var tbody=document.createElement("tbody");
	headTable.appendChild(tbody);
	var tr=document.createElement("tr");
	tbody.appendChild(tr);
	var td=document.createElement("td");
	tr.appendChild(td);
	td.width="20";/*想来想去，还是把上一年下一年的按钮先去掉了
	var prevYearBtn=document.createElement("span");
	td.appendChild(prevYearBtn);
	prevYearBtn.className="fa";
	prevYearBtn.innerHTML="&#xf100;";
	prevYearBtn.onclick=function(){
		pointDate.setFullYear(pointDate.getFullYear()-1);
		$.loadDate(pointDate);
	};*/
	td.appendChild(document.createTextNode(" "));
	var prevMouthBtn=document.createElement("span");
	td.appendChild(prevMouthBtn);
	prevMouthBtn.className="fa";
	prevMouthBtn.innerHTML="«";
	prevMouthBtn.onclick=function(){
		pointDate.setMonth(pointDate.getMonth()-1);
		$.loadDate(pointDate);
	};
	td=document.createElement("td");
	tr.appendChild(td);
	var yearText=document.createElement("span");
	td.appendChild(yearText);
	var yearInput=document.createElement("input");
	yearInput.size=4;
	if(Sky.browser.safari){//火狐对number的支持不是很好
		yearInput.type="number";
		yearInput.min=1000;
		yearInput.max=3000;
		yearInput.step=1;
	}else{
		yearInput.type="text";
	}
	yearText.onclick=function(e){
		e=e||window.event
		var target=e.target||e.srcElement;
		if(target==this){
			this.innerHTML="";
			this.appendChild(yearInput);
			yearInput.focus();
		}
	};
	yearInput.onblur=function(){
		yearText.innerHTML=yearInput.value;
		pointDate.setFullYear(parseInt(this.value));
		$.loadDate(pointDate);
	};
	td.appendChild(document.createTextNode("年"));
	var mouthText=document.createElement("span");
	var mouthSelector=document.createElement("select");
	for(var i=0;i<12;i++){
		var option=new Option(i+1,i);
		mouthSelector.options.add(option);
	}
	mouthText.onclick=function(e){
		e=e||window.event
		var target=e.target||e.srcElement;
		if(target==this){
			this.innerHTML="";
			this.appendChild(mouthSelector);
			mouthSelector.focus();
		}
	};
	mouthSelector.onblur=function(){
		if(mouthSelector.parentNode){
			try{
				mouthSelector.parentNode.removeChild(mouthSelector);
			}catch(e){
				console.log("为啥chrome这里会报错");
			}
		}
		mouthText.innerHTML=mouthSelector.options[mouthSelector.options.selectedIndex].text;
	};
	mouthSelector.onchange=function(){
		//console.log("onchange");
		//mouthText.removeChild(mouthSelector);
		Sky.fireEvent(mouthSelector,"blur");
		pointDate.setMonth(parseInt(this.value));
		$.loadDate(pointDate);
	};
	td.appendChild(mouthText);
	td.appendChild(document.createTextNode("月"));
	td=document.createElement("td");
	tr.appendChild(td);
	td.width="20";
	var nextMouthBtn=document.createElement("span");
	td.appendChild(nextMouthBtn);
	nextMouthBtn.className="fa";
	//nextMouthBtn.innerHTML="&#xf105;";
	nextMouthBtn.innerHTML="»";
	nextMouthBtn.onclick=function(){
		pointDate.setMonth(pointDate.getMonth()+1);
		$.loadDate(pointDate);
	};/*
	td.appendChild(document.createTextNode(" "));
	var nextYearBtn=document.createElement("span");
	td.appendChild(nextYearBtn);
	nextYearBtn.className="fa";
	nextYearBtn.innerHTML="&#xf101;";
	nextYearBtn.onclick=function(){
		pointDate.setFullYear(pointDate.getFullYear()+1);
		$.loadDate(pointDate);
	};*/
	var calendar=document.createElement("table");
	$.dom.appendChild(calendar);
	calendar.className="s-calendar";
	var thead=document.createElement("thead");
	calendar.appendChild(thead);
	tr=document.createElement("tr");
	thead.appendChild(tr);
	var th,i;
	for(i=0;i<dayName.length;i++){
		th=document.createElement("th");
		th.appendChild(document.createTextNode(dayName[i]));
		tr.appendChild(th);
	}
	var calendarBody=document.createElement("tbody");
	calendar.appendChild(calendarBody);
	this.loadDate=function(date){
		calendar.removeChild(calendarBody);
		calendarBody=document.createElement("tbody");
		calendar.appendChild(calendarBody);
		pointDate.setTime(date.getTime());
		with(pointDate){
			setSeconds(0);
			setMilliseconds(0);
			setMinutes(0);
			setHours(0);
		}
		var mouth=date.getMonth();
		var year=date.getFullYear();
		mouthText.innerHTML=mouth+1;
		yearText.innerHTML=year;
		mouthSelector.selectedIndex=mouth;
		yearInput.value=year;
		var today=new Date();
		with(today){
			setSeconds(0);
			setMilliseconds(0);
			setMinutes(0);
			setHours(0);
		}
		pointDate.setDate(1);
		pointDate.setDate(1-pointDate.getDay());
		var tr;
		for(var i=0;i<42;i++){
			var day=i%7;
			if(day==0){
				tr=document.createElement("tr");
				calendarBody.appendChild(tr);
			}
			var td=document.createElement("td");
			if(mouth!=pointDate.getMonth()){
				td.className='s-weak';
			}else if(day==0 || day==6){
				td.className='s-calendar-weekend';
			}
			if(pointDate.getTime()==today.getTime()){
				Sky.addClass(td,"s-calendar-today");
			}
			var dt=$.value.getTime()-pointDate.getTime()
			if(dt<24*60*60*1000 && dt>=0){
				Sky.addClass(td,"active");
			}
			td.timestamp=pointDate.getTime();
			td.onclick=function(){
				if($.dispatchOnEvent("pick")){
					$.value.setTime(this.timestamp);
					var tds=calendarBody.getElementsByTagName("td");
					for(var i=0;i<tds.length;i++){
						if(tds[i]==this){
							Sky.addClass(this,"active");
						}else{
							Sky.removeClass(tds[i],"active");
						}
					}
					$.dispatchAfterEvent("pick");
				}
			};
			tr.appendChild(td);
			var d=pointDate.getDate();
			td.appendChild(document.createTextNode(d));
			pointDate.setDate(d+1);
		}
		pointDate.setDate(-15);
	};
	this.loadDate(this.value);
	var ctrl=Sky.createDiv("s-datepicker-ctrl", $.dom);
	var curBtn=document.createElement("input");
	curBtn.type="button";
	curBtn.value="今天";
	curBtn.onclick=function(){
		var today=new Date();
		with(today){
			setSeconds(0);
			setMilliseconds(0);
			setMinutes(0);
			setHours(0);
		}
		$.value.setTime(today.getTime());
		confirmBtn.click();
	};
	ctrl.appendChild(curBtn);
	var confirmBtn=document.createElement("input");
	confirmBtn.type="button";
	confirmBtn.value="确定";
	ctrl.appendChild(confirmBtn);
	confirmBtn.onclick=function(){
		if($.dispatchOnEvent("pick")){
			$.dispatchAfterEvent("pick");
			if($.dispatchOnEvent("confirm")){
				$.close();
				$.dispatchAfterEvent("confirm");
			}
		}
	};
};
sky.picker.DateTimePicker=function(date){
	var $=this;
	sky.picker.DatePicker.call(this,date);
	var timeWrap=document.createElement("div");
	timeWrap.className="s-datepicker-timeWrap";
	timeWrap.appendChild(document.createTextNode("时间:"));
	$.dom.insertBefore(timeWrap,$.dom.lastChild);
	var timeInput=new sky.editor.MaskedInput(timeWrap,{
		'pattern':/^(\d{2}):(\d{2}):(\d{2})$/,
		'required':true,
		'width':74,
		'height':20,
		'value':date.format("hh:mm:ss")
	});
	timeInput.on('blur',function(input,index){
		var value=parseInt(input.value);
		if(isNaN(value)) value=0;
		if(value<0) value=0;
		var max=60;
		if(index==0){
			max=24;
		}
		if(value>=max){
			value=max-1;
		}
		if(index==0){
			$.value.setHours(value);
		}else if(index==1){
			$.value.setMinutes(value);
		}else{
			$.value.setSeconds(value);
		}
		if(value<10){
			input.value="0"+value;
		}else{
			input.value=value;
		}
	});
	$.after('pick',function(){
		var hr=parseInt( timeInput.subInputs[0].value);
		var m=parseInt( timeInput.subInputs[1].value);
		var s=parseInt( timeInput.subInputs[2].value);
		$.value.setHours(hr);
		$.value.setMinutes(m);
		$.value.setSeconds(s);
	});
};
sky.picker.FontPicker=function(){
	sky.SelectPicker.call(this);
	var $=this;
	var fontfamily=[
		{ name: '宋体', val: '宋体,SimSun'},
		{ name: '微软雅黑', val: '微软雅黑,Microsoft YaHei'},
		{ name: '楷体', val: '楷体,楷体_GB2312, SimKai'},
		{ name: '黑体', val: '黑体, SimHei'},
		{ name: '隶书', val: '隶书, SimLi'},
		{ name: 'andale mono', val: 'andale mono'},
		{ name: 'arial', val: 'arial, helvetica,sans-serif'},
		{ name: 'arial black', val: 'arial black,avant garde'},
		{ name: 'comic sans ms', val: 'comic sans ms'},
		{ name: 'impact', val: 'impact,chicago'},
		{ name: 'times new roman', val: 'times new roman'},
		{ name: 'sans-serif',val:'sans-serif'}
	];
	var ul=document.createElement("ul");
	this.dom.appendChild(ul);
	Sky.addClass(this.dom,"s-fontpicker");
	for(var i=0;i<fontfamily.length;i++){
		var li=document.createElement("li");
		li.title=fontfamily[i].val;
		li.appendChild(document.createTextNode(fontfamily[i].name));
		li.style.fontFamily=fontfamily[i].val;
		ul.appendChild(li);
		li.onclick=function(){
			if($.dispatchOnEvent("pick",[this.title])){
				$.dispatchAfterEvent("pick",[this.title]);
			}
			$.close();
		};
	}
};

sky.picker.ColorPicker=function(color){
	sky.SelectPicker.call(this);
	var me=this;
	Sky.addClass(this.dom,"s-colorpicker");
	this.color=color || "#000000";
	var dftBox,input;
	var table=document.createElement("table");
	document.createElement("table");
	var thead=createTableHead();
	table.appendChild(thead);
	var tbody=createColorTable();
	table.appendChild(tbody);
	this.dom.appendChild(table);
	this.pick=function(color){
		if(me.dispatchOnEvent("pick",[color])){//分发事件，把图片路径作为参数
			me.close();
			me.dispatchAfterEvent("pick",[color]);
		}
	};
	function createColorTable(){
		var tbody=document.createElement("tbody");
		var ColorHex=new Array('00','33','66','99','cc','ff');
		var SpColorHex=new Array('ff0000','00ff00','0000ff','ffff00','00ffff','ff00ff');
		for(i=0;i<2;i++){
			for(j=0;j<6;j++){
				var tr=document.createElement("tr");
				var td=document.createElement("td");
				td.bgColor="#000000";
				tr.appendChild(td);
				td=document.createElement("td");
				td.bgColor="#"+(i==0 ? ColorHex[j]+ColorHex[j]+ColorHex[j] : SpColorHex[j]);
				tr.appendChild(td);
				td=document.createElement("td");
				td.bgColor="#000000";
				tr.appendChild(td);
				for (k=0;k<3;k++){
					for (l=0;l<6;l++){
						td=document.createElement("td");
						td.bgColor="#"+(ColorHex[k+i*3]+ColorHex[l]+ColorHex[j]);
						tr.appendChild(td);
					}
				}
				tbody.appendChild(tr);
			}
		}
		tbody.onmouseout=function(e){
			e=e || window.event;
			var target=e.target || e.srcElement || this;
			if(document.activeElement==input){
			}else{
				dftBox.style.background=input.value=me.color;
			}
		};
		tbody.onmouseover=function(e){
			e=e || window.event;
			var target=e.target || e.srcElement || this;
			if(document.activeElement==input){
			}else if(target.bgColor){
				dftBox.style.background=input.value=target.bgColor;
			}
		};
		tbody.onclick=function(e){
			e=e || window.event;
			var target=e.target || e.srcElement || this;
			if(target.bgColor){
				me.color=target.bgColor;
				me.pick(me.color);
			}
		};
		return tbody;
	}
	function createTableHead(){
		var thead=document.createElement("thead");
		var tr=document.createElement("tr");
		var td=document.createElement("th");
		td.colSpan=21;
		tr.appendChild(td);
		thead.appendChild(tr);
		td.innerHTML='<input type="color" class="s-colorpicker-sysBtn"/>';
		var sysBtn=td.firstChild;
		sysBtn.parentNode.removeChild(sysBtn);
		if(sysBtn.type!="color"){
			sysBtn=null;
			if(!window.dlgHelper){
				window.dlgHelper=document.createElement("OBJECT");
				dlgHelper.setAttribute('classId',"clsid:3050f819-98b5-11cf-bb82-00aa00bdce0b");
				dlgHelper.setAttribute('width',"0");
				dlgHelper.setAttribute('height',"0");
				dlgHelper.setAttribute('id',"dlgHelper");
				//window.dlgHelper=new ActiveXObject('HtmlDlgSafeHelper.HtmlDlgSafeHelper');
				document.body.appendChild(dlgHelper);
			}
			if('ChooseColorDlg' in dlgHelper){
				sysBtn=document.createElement("button");
				sysBtn.setAttribute("type","button");
				sysBtn.className="s-colorpicker-sysBtn";
				sysBtn.onclick=function(){
					var color;
					if(me.color){
						color=dlgHelper.ChooseColorDlg(me.color);
					}else{
						color=dlgHelper.ChooseColorDlg();
					}
					color="000000"+color.toString(16);
					me.color="#"+color.substr(color.length-6,6);
					me.pick(me.color);
				};
			}
		}else{
			sysBtn.onchange=function(){
				me.color=this.value;
				me.pick(me.color);
			};
			sysBtn.onclick=function(){
				this.value=me.color;
			};
		}
		var noneBtn=document.createElement("button");
		noneBtn.setAttribute("type","button");
		noneBtn.className="s-colorpicker-noneBtn";
		noneBtn.onclick=function(){
			me.color="";
			me.pick(me.color);
		};
		dftBox=document.createElement("span");
		dftBox.className="s-colorpicker-dftBox";
		dftBox.onclick=function(){
			me.pick(input.value);
		};
		input=document.createElement("input");
		input.className="s-colorpicker-input";
		input.maxLength=7;
		input.onkeypress=function(e){
			e=e || window.event;
			if(e.keyCode==13){
				this.value=this.value.toLowerCase();
				if(/^#[a-f0-9]{6}$/.test(this.value)){
					me.pick(this.value);
				}else{
					alert("颜色格式不正确");
				}
			}
		};
		if('oninput' in input){
			input.onpaste=input.oninput=function(){
				var value=this.value.toLowerCase();
				if(/^#[a-f0-9]{6}$/.test(value)){
					dftBox.style.background=value;
				}
			};
		}else{
			input.onpropertychange=function(){
				if(event.propertyName.toLowerCase () == "value"){
					var value=this.value.toLowerCase();
					if(/^#[A-F0-9]{6}$/.test(value)){
						dftBox.style.background=value;
					}
				}
			};
		}
		input.onblur=function(){
			var value=this.value.toLowerCase();
			if(/^#[a-f0-9]{6}$/.test(value)){
				this.value=value;
			}else{
				this.value=me.color;
			}
			dftBox.style.background=this.value;
		};
		td.appendChild(dftBox);
		td.appendChild(input);
		dftBox.style.background=input.value=me.color;
		td.appendChild(noneBtn);
		if(sysBtn) td.appendChild(sysBtn);
		return thead;
	}
};
sky.Form=function(){
	var $=this;
	var items=new Array();
	this.items=items;
	var autoText=new Array();
	this.addField=function(name,editor){
		items.push({'name':name,'editor':editor});
	};
	this.addItem=function(name,editor,dom){
		items.push({'name':name,'editor':editor,'dom':dom});
	};
	this.loadText=function(name,url){
		autoText.push({'name':name,'url':url});
	};
	this.validate=function(){
		var r=true;
		for(var i=0;i<items.length;i++){
			if(items[i].editor.validate()){
			}else{
				r=false;
			}
		}
		return r;
	};
	this.getData=function(){
		var data={};
		for(var i=0;i<items.length;i++){
			var val=items[i].editor.getValue();
			if(val!=null && val!=undefined){
				data[items[i].name]=val;
			}
		}
		return data;
	};
	this.buildQuery=function(){
		return Sky.buildQuery($.getData());
	}
	//只修改，不删除
	this.setData=function(data){
		for(var i=0;i<items.length;i++){
			var name=items[i].name;
			if(name in data){
				var editor=items[i].editor;
				if(editor){
					editor.setValue(data[name]);
				}
			}
		}
		for(var i=0;i<autoText.length;i++){
			var name=autoText[i].name;
			if(name in data){
				var j=Sky.inArray(items,name,"name");
				items[j].editor.loadText(autoText[i].url);
			}
		}
	};
	this.clear=function(){
		for(var i=0;i<items.length;i++){
			var editor=items[i].editor;
			if(editor){
				editor.clear();
			}
		}
	};
	this.disableField=function(name){
		for(var i=0;i<items.length;i++){
			if(name==items[i].name){
				var editor=items[i].editor;
				if(editor){
					editor.disable();
				}
			}
		}
	};
	this.enableField=function(name){
		for(var i=0;i<items.length;i++){
			if(name==items[i].name){
				var editor=items[i].editor;
				if(editor){
					editor.enable();
				}
			}
		}
	};
	this.reset=function(){
		for(var i=0;i<items.length;i++){
			var editor=items[i].editor;
			if(editor){
				editor.reset();
			}
		}
	};
	this.hideItem=function(name){
		for(var i=0;i<items.length;i++){
			if(items[i].name==name){
				items.dom.style.display="none";
			}
		}
	};
	this.showItem=function(name){
		for(var i=0;i<items.length;i++){
			if(items[i].name==name){
				items.dom.style.display="";
			}
		}
	};
};
sky.form={};
sky.form.AnchorForm=function(options,fields){
	var $=this;
	var conf={
		labelWidth:50, tipWidth:40, space:10, editorHeight:22
	};
	conf=Sky.extend(conf,options);
	sky.Component.call(this);//继承Component
	sky.Form.call(this);//继承Form
	$.dom=document.createElement("table");
	$.dom.className="s-anchorForm";
	var tbody=document.createElement("tbody");
	$.dom.appendChild(tbody);
	$.dom.width="100%";
	$.dom.cellSpacing=conf.space;
	this.renderTo=function(wrap){
		wrap=Sky(wrap);
		wrap.appendChild($.dom);
		Sky.addClass(wrap,"s-scroll");
		return $;
	};
	this.addItem=function(name,label,EditorClass,editorOptions,tip){
		var tr=document.createElement("tr");
		var td=document.createElement("th");
		td.appendChild(document.createTextNode(label));
		td.width=conf.labelWidth;
		tr.appendChild(td);
		if(typeof EditorClass=="string"){
			EditorClass=sky.editor[EditorClass];
		}
		td=document.createElement("td");
		if(!('height' in editorOptions)){
			editorOptions.height=conf.editorHeight;
		}
		var editor=new EditorClass(td,editorOptions);
		editor.input.name=name;
		tr.appendChild(td);
		td=document.createElement("td");
		if(tip){
			td.appendChild(document.createTextNode(tip));
		}
		td.width=conf.tipWidth;
		td.className="s-tip";
		tr.appendChild(td);
		tbody.appendChild(tr);
		var item={
			'dom':tr,
			'name':name,
			'editor':editor
		};
		this.items.push(item);
	}
};
sky.form.FlowForm=function(options,items){
	var $=this;
	var conf={
		labelWidth:50,editorWidth:220, space:40, editorHeight:22
	};
	conf=Sky.extend(conf,options);
	sky.Component.call(this);//继承Component
	sky.Form.call(this);//继承Form
	$.dom=document.createElement("div");
	$.dom.className="s-flowForm";
	this.renderTo=function(wrap){
		wrap=Sky(wrap);
		wrap.appendChild($.dom);
		Sky.addClass(wrap,"s-scroll");
		return $;
	};
	this.addItem=function(name,label,EditorClass,editorOptions,tip,options){
		options=Sky.extend({},conf,options)
		var itemDom=document.createElement("section");
		itemDom.className="s-form-item";

		if($.items.length>1){
			if(options.newLine){
				itemDom.appendChild(document.createElement("br"));
			}else if($.items[$.items.length-1].endLine){
				itemDom.appendChild(document.createElement("br"));
			}
		}

		var box=document.createElement("label");
		box.className="s-form-cell";
		box.appendChild(document.createTextNode(label));
		box.style.width=(options.labelWidth)+"px";
		itemDom.appendChild(box);

		box=document.createElement("span");
		box.className="s-form-cell";
		box.style.width=options.editorWidth+"px";
		if(typeof EditorClass=="string"){
			EditorClass=sky.editor[EditorClass];
		}
		if(!('height' in editorOptions)){
			editorOptions.height=conf.editorHeight;
		}
		var editor=new EditorClass(box,editorOptions);
		editor.input.name=name;
		itemDom.appendChild(box);

		var space=null;
		space=document.createElement("span");
		space.className="s-form-cell";
		if(tip){
			var span=document.createElement("span");
			span.appendChild(document.createTextNode(tip));
			span.className="s-tip";
			space.appendChild(span);
		}
		if(options.space){
			space.style.width=options.space+'px';
		}
		if(options.space || tip){
			itemDom.appendChild(space);
		}
		$.dom.appendChild(itemDom);
		var item={
			'dom':itemDom,
			'name':name,
			'editor':editor
		};
		$.items.push(item);
	}
	if(items){
		for(var i=0;i<items.length;i++){
			this.addItem(items[i].name,items[i].label,items[i].Editor,items[i].editorOptions,items[i].tip,items[i]);
		}
	}
};

sky.form.Table=function(columns,options){
	var conf={
	}
	conf=Sky.extend(conf,options);
	var $=this;
	sky.Component.call(this);//继承Component
	$.data=[];
	this.dom=$.table=document.createElement("table");
	$.table.className="s-form-table";
	$.table.thead=document.createElement("thead");
	$.table.tbody=document.createElement("tbody");
	$.table.appendChild($.table.thead);
	$.table.appendChild($.table.tbody);
	$.table.thead.tr=document.createElement("tr");
	$.table.thead.appendChild($.table.thead.tr);
	for(var i=0;i<columns.length;i++){
		var th=document.createElement("th");
		$.table.thead.tr.appendChild(th);
		if(columns[i].width){th.width=columns[i].width}
		th.appendChild(document.createTextNode(columns[i].header));
		if(columns[i].editor){
			if(columns[i].editor.type){
				columns[i].options=columns[i].editor.options;
				columns[i].editor=columns[i].editor.type;
			}
			if(typeof columns[i].editor=="string"){
				columns[i].editor=sky.editor[columns[i].editor];
			}
			if(!columns[i].options){
				columns[i].options={};
			}
		}
	}
	var editor;//正在使用的编辑器
	this.addRow=function(data){
		$.data.push(data);
		var tr=document.createElement("tr");
		$.table.tbody.appendChild(tr);
		for(var i=0;i<columns.length;i++){
			var td=document.createElement("td");
			tr.appendChild(td);
			if(columns[i].render){
				Sky.render(td,columns[i].render,[data[columns[i].name],data]);
			}else if(columns[i].display){
				td.appendChild(document.createTextNode(data[columns[i].display]));
			}else{
				td.appendChild(document.createTextNode(data[columns[i].name]));
			}
			if(columns[i].align) td.align=columns[i].align;
			td.field=columns[i].name;
			if(columns[i].editor){
				td.onclick=function(e){
					if($.isEditing) return;
					$.isEditing=true;
					var column=columns[Sky.inArray(columns,this.field,"name")];
					var EditorClass=column.editor;
					var editorOptions=column.options;
					if(!editorOptions) editorOptions={};
					editorOptions.height=this.clientHeight-4;
					var text=this.innerText?this.innerText:this.textContent;
					this.innerHTML="";
					editor=new EditorClass(this,editorOptions);
					var td=this;
					editor.setValue(data[this.field]);
					editor.setText(text);
					try{
						editor.input.focus();
					}catch(error){
					}
					sky.Blur.attach(td,function(e){
						if(!editor.isEditing){
							if(editor.validate()){
								$.isEditing=false;
								data[td.field]=editor.getValue();
								if(column.render){
									Sky.render(td,column.render,[data[td.field],data]);
								}else{
									editor.remove();
									if(data[td.field]==null){
										td.appendChild(document.createTextNode("[空]"));
									}else{
										td.appendChild(document.createTextNode(editor.getText()));
									}
								}
								sky.Blur.detach(td);
							}
						}
					});
				};
			}
			tr.onmousedown=function(){
				if($.isEditing) return;
				var trs=this.parentNode.childNodes;
				for(var i=0;i<trs.length;i++){
					Sky.removeClass(trs[i],"selected");
				}
				Sky.addClass(this,"selected");
			};
		}
	};
	this.renderTo=function(wrap){
		wrap=Sky(wrap);
		wrap.appendChild($.dom);
		return $;
	};
	this.getSelectedRow=function(){
		var trs=$.table.tbody.childNodes;
		for(var i=0;i<trs.length;i++){
			if(Sky.hasClass(trs[i],"selected")){
				return i;
			}
		}
		return -1;
	};
	this.delRow=function(index){
		sky.Blur();
		$.data.splice(index,1)
		$.table.tbody.removeChild($.table.tbody.childNodes[index]);
	};
	this.showList=function(data){
		for(var i=0;i<data.length;i++){
			$.addRow(data[i]);
		}
	};
	this.clear=function(){
		while($.table.tbody.childNodes.length>0){
			$.table.tbody.deleteRow(0);
		}
		$.data=[];
	};
	this.loadList=function(data){
		if(typeof (data)=="string"){
			Sky.ajax.get(data,function(o){
				$.showList(o);
			},'json');
		}else{
			$.showList(data);
		}
	};
	(function(){
		var dragging = false;
		var drag=sky.form.Table.drag;
		if(!drag){
			drag=sky.form.Table.drag=document.createElement("div");
			drag.className="s-form-table-drag";
		}
		Sky.attachEvent($.table.tbody,'mousedown',function(e){
			var e = e || window.event;
			if(!dragging && e.button<2 && !$.isEditing){
				dragging=true;
				drag.style.width=$.dom.parentNode.clientWidth+"px";
				$.dom.parentNode.insertBefore(drag,$.table);
				drag.style.visibility="hidden";
				//$.table.style.cursor="move";
			}
		});
		Sky.attachEvent(document.documentElement,'mousemove',function(e){
			if (dragging) {
				var e = e || window.event;
				var oY = Math.max(document.documentElement.scrollTop,document.body.scrollTop)+e.clientY - Sky.getPageTop($.table.tbody);
				var linHeight=$.table.tbody.childNodes[0].offsetHeight;
				var i=Math.round(oY/linHeight);
				drag.style.marginTop=(i*linHeight+linHeight)+"px"
				if(i<0 || i>$.table.tbody.childNodes.length || Math.abs(i-$.getSelectedRow()-0.5)<1){
					drag.style.visibility="hidden";
					$.table.style.cursor="";
				}else{
					drag.style.visibility="";
					$.table.style.cursor="move";
					if(window.getSelection) window.getSelection().removeAllRanges();
					if(document.selection) document.selection.empty();
				}
			}
		});
		Sky.attachEvent(document.documentElement,'mouseup',function(e){
			if (dragging) {
				dragging=false;
				Sky.removeClass($.table,"draging");
				$.dom.parentNode.removeChild(drag);
				$.table.style.cursor="";
				var e = e || window.event;
				var oY = Math.max(document.documentElement.scrollTop,document.body.scrollTop)+e.clientY - Sky.getPageTop($.table.tbody);
				var linHeight=$.table.tbody.childNodes[0].offsetHeight;
				var i=Math.round(oY/linHeight);
				var n=$.getSelectedRow();
				if(i>=0 && (i>=n+2 || i<=n-1)){
					if(i>=$.table.tbody.childNodes.length){
						$.table.tbody.appendChild($.table.tbody.childNodes[n]);
					}else{
						$.table.tbody.insertBefore($.table.tbody.childNodes[n],$.table.tbody.childNodes[i]);
					}
					$.data.splice(i,0,$.data[n]);
					$.data.splice(n+(n>i?1:0),1);
				}
			}
		});
	})();
};

sky.form.PropertyGrid=function(){
	var $=this;
	sky.Component.call(this);//继承Component
	$.dom=document.createElement("table");
	$.dom.className="s-propertyGrid";
	$.thead=document.createElement("thead");
	$.dom.appendChild($.thead);
	var tr=document.createElement("tr");
	$.thead.appendChild(tr);
	var td=document.createElement("th");
	td.appendChild(document.createTextNode("属性"));
	tr.appendChild(td);
	td=document.createElement("th");
	td.appendChild(document.createTextNode("值"));
	tr.appendChild(td);
	this.renderTo=function(wrap){
		wrap=Sky(wrap);
		wrap.appendChild($.dom);
		Sky.addClass(wrap,"s-scroll");
		return $;
	};
	this.name=null;
	this.form=null;
	this.forms={};
	this.createForm=function(columns,name){
		if(!name) name="Default";
		if(name in $.forms){
			throw "已经存在";
			return ;
		}
		var propertyForm=new sky.form.PropertyForm(columns);
		$.forms[name]=propertyForm;
		propertyForm.onChange=function(name,data,editor){
			return $.dispatchOnEvent("change",[$.name,name,data,editor]);
		};
		propertyForm.afterChange=function(name,data,editor){
			return $.dispatchAfterEvent("change",[$.name,name,data,editor]);
		};
	};
	this.loadData=function(data,name){
		$.showForm(name);
		$.form.clear();
		$.form.setData(data);
	};
	this.showForm=function(name){
		if(!name) name="Default";
		if(name in $.forms){
			if($.form && $.form.dom){
				$.dom.removeChild($.form.dom);
			}
			$.form=$.forms[name];
			this.name=name;
			$.dom.appendChild($.form.dom);
		}
	};
};
sky.form.PropertyForm=function(columns){
	var $=this;
	this.dom=document.createElement("tbody");
	sky.events.EventDispatcher.call(this);//继承EventDispatcher
	sky.Form.call(this);//继承Form
	this.data=null;
	this.getData=function(){
		return $.data;
	};
	//只修改，不删除
	this.setData=function(data){
		$.data=data;
		var items= $.items;
		for(var i=0;i<items.length;i++){
			var name=items[i].name;
			if(name in data){
				var editor=items[i].editor;
				var valueWrap=items[i].valueWrap;
				if(editor){
					editor.setValue(data[name]);
				}
				if(valueWrap){
					valueWrap.innerHTML="";
					var index=Sky.inArray(columns,name,"name");
					if(index>=0 && columns[index].render){
						Sky.render(valueWrap,columns[index].render,[data[name]])
					}else{
						if(editor){
							valueWrap.appendChild(document.createTextNode(editor.getText()));
						}else{
							valueWrap.appendChild(document.createTextNode(data[name]));
						}
					}
				}
			}
		}
	};
	this.addItem=function(column){
		var tr=document.createElement("tr");
		var td=document.createElement("td");
		var label;
		if(column.label){
			label=column.label;
		}else{
			label=column.name;
		}
		td.appendChild(document.createTextNode(label));
		tr.appendChild(td);
		td=document.createElement("td");
		var span=document.createElement("span");
		td.appendChild(span);
		span.appendChild(document.createTextNode(" "));
		tr.appendChild(td);
		this.dom.appendChild(tr);
		var editor;
		if(column.editor){
			var EditorClass=column.editor;
			var editorOptions=column.options;
			if(EditorClass.type){
				editorOptions=EditorClass.options;
				EditorClass=EditorClass.type;
			}
			if(typeof EditorClass=="string"){
				EditorClass=sky.editor[column.editor];
			}
			if(!editorOptions) editorOptions={};
			editor=new EditorClass(td,editorOptions);
			editor.dom.style.display="none";
			td.onclick=function(e){
				if($.isEditing) return;
				$.isEditing=true;
				editor.setText(span.innerText || span.textContent);
				editor.setHeight(this.clientHeight-4);
				span.style.display="none";
				editor.dom.style.display="";
				try{
					editor.input.focus();
				}catch(error){
				}
				sky.Blur.attach(td,function(e){
					if(!editor.isEditing){
						if(editor.validate()){
							if($.dispatchOnEvent("change",[column.name,$.data,editor])){
								$.isEditing=false;
								editor.dom.style.display="none";
								span.style.display="";
								$.data[column.name]=editor.getValue();
								span.innerHTML="";
								span.appendChild(document.createTextNode(editor.getText()));
								sky.Blur.detach(td);
								$.dispatchAfterEvent("change",[column.name,$.data,editor]);
							}
						}
					}
				});
			};
		}
		$.items.push({'name':column.name,'editor':editor,'dom':tr,'valueWrap':span});
	};
	for(var i=0;i<columns.length;i++){
		$.addItem(columns[i]);
	}
};

sky.form.SearchForm=function(conf){
	var self=this;
	conf=Sky.extend({
		'width':120,
		'onsubmit':function(){
			if(self.dispatchOnEvent("submit",[editor.getValue()])){
				self.dispatchAfterEvent("submit",[editor.getValue()])
			}
			return false;
		},
		'showAdv':true,
		'advClick':function(){}
	},conf);
	sky.Component.call(this);//继承Component
	self.dom=document.createElement("form");
	self.dom.className="s-searchForm";
	var editor=new sky.editor.PopupInput(self.dom,{'width':conf.width,'height':22});
	self.editor=editor;
	Sky.addClass( editor.addon,"fa");
	editor.addon.innerHTML='&#xf002;';
	self.dom.onsubmit=editor.addon.onclick=conf.onsubmit;
	if(conf.showAdv){
		var advBtn=document.createElement("button");
		advBtn.className="s-button";
		advBtn.style.height="22px";
		advBtn.type="button";
		advBtn.innerHTML="高级搜索";
		advBtn.onclick=conf.advClick;
		this.advBtn=advBtn;
		self.dom.appendChild(advBtn);
	}
	this.renderTo=function(wrap){
		wrap=Sky(wrap);
		wrap.appendChild(self.dom);
		return self;
	};
};
sky.ListGroup=function(options){
	var me=this;
	var conf={
		'height':NaN
	};
	conf=Sky.extend(conf,options);
	sky.Component.call(this);//继承Component
	//dom属性
	var ul=this.dom=document.createElement("ul");
	ul.className="s-list-group";
	//重写renderTo方法
	this.renderTo=function(wrap){
		wrap=Sky(wrap);//这样可以传入id值
		wrap.appendChild(this.dom);
		
		//如果是通过container.add方法添加的，可以通过this.container读到container相关信息
		if(this.container){
			this.container.after('resize',resizeHandle);
		}
	};
	//重写remove方法
	this.remove=function(){
		this.dom.parentNode.removeChild(this.dom);
		if(this.container){
			this.container.removeListener('resize',resizeHandle);
		}
	};
	function resizeHandle(){
		if(!isNaN(conf.height)){
			if(conf.height>0){
				ul.style.height=conf.height+"px";
			}else if(conf.height<=0){
				ul.style.height=ul.parentNode.clientHeight+conf.height+"px";
			}else{
				ul.style.height=conf.height;
			}
		}
	}
	var toolBar=document.createElement("div");
	toolBar.className="s-panel-tool";
	this.addToolBtn=function(label,className,clickHandle){
		var btn=document.createElement("a");
		btn.className=className+" s-tool-btn";
		btn.appendChild(document.createTextNode(label));
		btn.onclick=clickHandle;
		
		toolBar.appendChild(btn);
		return btn;
	};
	var lis={};
	this.currentData=null;
	this.addItem=function(item){
		var li=document.createElement("li");
		var id=item.id;
		li.data=item.data;
		if(item.icon){
			li.appendChild(Sky.createIcon(item.icon));
		}
		li.appendChild(document.createTextNode(item.text));
		li.onmouseover=function(){
			this.appendChild(toolBar);
			me.currentData=item.data;
		};
		if(id){
			lis[id]=li;
		}
		ul.appendChild(li);
	};
	this.delItem=function(index){
		var lis=ul.getElementsByTagName("li");
		var li=lis[index];
		if(li){
			if(me.dispatchOnEvent("delItem",[li.data])){
				ul.removeChild(li);
				me.dispatchAfterEvent("delItem",[li.data]);
			}
		}
	};
	this.getData=function(){
		var lis=ul.getElementsByTagName("li");
		var r=[];
		for(var i=0;i<lis.length;i++){
			r.push(lis[i].data);
		}
		return r;
	};
	this.removeById=function(id){
		var li=lis[id];
		if(li){
			if(me.dispatchOnEvent("delItem",[li.data])){
				ul.removeChild(li);
				me.dispatchAfterEvent("delItem",[li.data]);
			}
		}
	};
	this.clear=function(id){
		ul.innerHTML='';
	};
};
