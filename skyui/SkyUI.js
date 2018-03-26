
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
