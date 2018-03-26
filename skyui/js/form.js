
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