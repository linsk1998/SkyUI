
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