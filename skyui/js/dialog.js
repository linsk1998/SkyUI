
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
