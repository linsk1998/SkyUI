

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