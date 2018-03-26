
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