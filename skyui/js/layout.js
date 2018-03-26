
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