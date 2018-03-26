
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
