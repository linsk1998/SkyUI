
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