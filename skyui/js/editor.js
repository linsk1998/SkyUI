
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