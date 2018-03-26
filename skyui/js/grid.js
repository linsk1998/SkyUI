
sky.Grid=function(columns,options){
	sky.Component.call(this);//继承Component
	var conf={
		'height':NaN,
		'checkbox':false
	}
	conf=Sky.extend(conf,options);
	var $=this;
	if(conf.checkbox){
		var value=[];
		var headerCheckbox=document.createElement("INPUT");
		headerCheckbox.type="checkbox";
		headerCheckbox.onclick=function(){
			var trs=$.body.table.tbody.childNodes;
			for(var i=0;i<trs.length;i++){
				var input=trs[i].firstChild.firstChild;
				input.checked=headerCheckbox.checked;
			}
		};
		this.getChecked=function(){
			var trs=$.body.table.tbody.childNodes;
			var arr=[];
			for(var i=0;i<trs.length;i++){
				var input=trs[i].firstChild.firstChild;
				if(input.checked){
					arr.push(input.data);
				}
			}
			return arr;
		};
		if(typeof conf.checkbox=="string"){
			columns.unshift({
				'header':headerCheckbox,'align':"center",
				'name':conf.checkbox,'width':23,
				'render':function(value,data){
					var input=document.createElement("INPUT");
					input.type="checkbox";
					input.name=conf.checkbox+"["+value+"]";
					input.data=value;
					this.appendChild(input);
				}
			});
		}else{
			columns.unshift({
				'header':headerCheckbox,'align':"center",
				'name':columns[0].name,'width':23,
				'render':function(value,data){
					var input=document.createElement("INPUT");
					input.type="checkbox";
					input.data=data;
					this.appendChild(input);
				}
			});
		}
	}
	$.dom=Sky.createDiv("s-grid");
	$.header=Sky.createDiv("s-grid-header",$.dom);
	$.body=Sky.createDiv("s-grid-body",$.dom);
	$.footer=Sky.createDiv("s-grid-footer",$.dom);
	$.body.onscroll=function(){
		if(window.XMLHttpRequest){
			$.header.style.marginLeft=-$.body.scrollLeft+"px";
		}else{
			$.header.scrollLeft=$.body.scrollLeft;//ie67
		}
	};

	$.header.table=document.createElement("table");
	$.header.appendChild($.header.table);
	var node=document.createElement("thead");
	$.header.table.appendChild(node);
	$.header.table.thead=document.createElement("tr");
	node.appendChild($.header.table.thead);
	for(var i=0;i<columns.length;i++){
		var th=document.createElement("th");
		$.header.table.thead.appendChild(th);
		if(columns[i].sortable){
			var sortBtn=Sky.createDiv("s-grid-sort-btn",th);
			sortBtn.appendChild(document.createTextNode(columns[i].header));
			sortBtn.title=columns[i].header;
			sortBtn.name=columns[i].name;
			sortBtn.onclick=function(){
				var spans=this.parentNode.parentNode.getElementsByTagName("span");
				for(var i=0;i<spans.length;i++){
					spans[i].parentNode.removeChild(spans[i]);
				}
				if($.sortname==this.name && $.sortorder=="asc"){
					$.sortorder="desc";
					this.innerHTML=this.title+'<span class="fa">&#xf0d7;</span>';
				}else{
					this.innerHTML=this.title+'<span class="fa">&#xf0d8;</span>';
					$.sortorder="asc";
				}
				$.sortname=this.name;
				$.page=1;
				$.refresh();
			};
		}else{
			if(typeof columns[i].header=="string"){
				th.appendChild(document.createTextNode(columns[i].header));
			}else{
				th.appendChild(columns[i].header);
			}
		}
	}
	(function(){
		var d=new sky.dd.Drag($.header,true);
		var resizeLine=null;
		var selectedColumnIndex;
		var readyResize=false;
		var dragging=false;
		d.onPress=function(e){
			if(readyResize && !dragging){
				e = e || window.event;
				var x=e.clientX+Math.max(document.documentElement.scrollLeft,document.body.scrollLeft)-Sky.getPageLeft($.dom);
				if(!resizeLine){
					resizeLine=document.createElement("div");
					resizeLine.className="s-resize-line-v";
				}
				$.dom.appendChild(resizeLine);
				resizeLine.style.left=x+"px";
				Sky.addClass($.dom,"resizing");
				dragging=true;
			}
		};
		//平时鼠标移动到边缘就改变指针
		$.header.table.thead.onmousemove=function(e){
			e = e || window.event;
			if(!d.dragging){
				var x=e.clientX+Math.max(document.documentElement.scrollLeft,document.body.scrollLeft)-Sky.getPageLeft($.dom)+ $.body.scrollLeft;
				for(var i=0;i<this.childNodes.length;i++){
					var selectedColumn=this.childNodes[i];
					selectedColumnIndex=i;
					if(Math.abs(x-selectedColumn.offsetLeft-selectedColumn.offsetWidth)<5){
						$.header.style.cursor="w-resize";
						readyResize=true
						break ;
					}else{
						$.header.style.cursor="";
						readyResize=false;
					}
				}
			}
		};
		d.onMove=function(e){
			if(dragging){
				e = e || window.event;
				var x=e.clientX+Math.max(document.documentElement.scrollLeft,document.body.scrollLeft)-Sky.getPageLeft($.dom);
				resizeLine.style.left=x+"px";
			}
		};
		d.onRelease=function(e){
			if(dragging){
				e = e || window.event;
				var x=e.clientX;
				var ths=$.header.table.thead.childNodes;
				var selectedColumn=ths[selectedColumnIndex];
				Sky.removeClass($.dom,"resizing");
				$.dom.removeChild(resizeLine);
				$.header.style.cursor="";
				var tWidth=x-Sky.getPageLeft(selectedColumn)-1;
				if(tWidth<10)tWidth=10;
				$.body.table.firstChild.firstChild.childNodes[selectedColumnIndex].width=
					selectedColumn.width=tWidth;
				var totalWidth=0;
				for(var i=0;i<ths.length;i++){
					totalWidth+=parseInt(ths[i].width)+1;
				}
				$.header.table.width=$.body.table.width=totalWidth;
				dragging=false;
			}
		};
	})();
	$.body.table=$.header.table.cloneNode(true);
	$.body.appendChild($.body.table);
	$.body.table.thead=$.body.table.getElementsByTagName("tr")[0];
	$.body.table.tbody=document.createElement("tbody");
	$.body.table.appendChild($.body.table.tbody);
	$.footer.select=document.createElement("select");
	$.footer.select.options.add(new Option("10","10"));
	$.footer.select.options.add(new Option("20","20"));
	$.footer.select.options.add(new Option("50","50"));
	$.footer.select.options.add(new Option("100","100"));
	$.footer.select.options[1].selected=true;
	$.footer.appendChild($.footer.select);
	$.pageSize=20;
	$.page=1;
	$.footer.select.onchange=function(){
		$.pageSize=parseInt(this.value);
		$.page=1;
		$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
	};
	$.footer.firstPageBtn=Sky.createDiv("fa s-grid-btn disabled",$.footer);
	$.footer.prevPageBtn=Sky.createDiv("fa s-grid-btn disabled",$.footer);
	$.footer.pageInput=document.createElement("input");$.footer.pageInput.type="text";
	$.footer.pageInput.onblur=function(){
		var page=parseInt(this.value);
		if(!isNaN(page) && page>=1){
			$.page=page;
			$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
		}
	};
	$.footer.appendChild($.footer.pageInput);
	$.footer.totalPageDisplay=document.createTextNode("/");
	$.footer.appendChild($.footer.totalPageDisplay);
	$.footer.nextPageBtn=Sky.createDiv("fa s-grid-btn",$.footer);
	$.footer.lastPageBtn=Sky.createDiv("fa s-grid-btn",$.footer);
	$.footer.refreshPageBtn=Sky.createDiv("fa s-grid-btn",$.footer);
	$.footer.firstPageBtn.appendChild(document.createTextNode("\uf048"));
	$.footer.prevPageBtn.appendChild(document.createTextNode("\uf0d9"));
	$.footer.nextPageBtn.appendChild(document.createTextNode("\uf0da"));
	$.footer.lastPageBtn.appendChild(document.createTextNode("\uf051"));
	$.footer.refreshPageBtn.appendChild(document.createTextNode("\uf021"));

	var isTheFirstTimeShowData=true;
	this.clear=function(){
		while($.body.table.tbody.childNodes.length>0){
			$.body.table.tbody.deleteRow(0);
		}
	};
	this.setLoadingStyle=function(bool){
		if(bool){
			Sky.addClass($.body,"s-loading");
		}else{
			Sky.removeClass($.body,"s-loading");
		}
	};
	this.loadUrl=function(url,page,pageSize,sortname,sortorder){
		$.url=url;
		$.loadList.call($,page,pageSize,sortname,sortorder);
	};

	$.footer.refreshPageBtn.onclick=$.refresh=function(){
		Sky.clearSelect();
		$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
	};
	$.footer.nextPageBtn.onclick=$.nextPage=function(){
		Sky.clearSelect();
		if($.page<$.totalPage){
			$.page++;
			$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
		}
	};
	$.footer.lastPageBtn.onclick=$.lastPage=function(){
		if($.page!=$.totalPage){
			$.page=$.totalPage;
			$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
		}
	};
	$.footer.firstPageBtn.onclick=$.firstPage=function(){
		if($.page!=1){
			$.page=1;
			$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
		}
	};
	$.footer.prevPageBtn.onclick=$.prevPage=function(){
		Sky.clearSelect();
		if($.page>1){
			$.page--
			$.loadList.call($,$.page,$.pageSize,$.sortname,$.sortorder);
		}
	};
	this.showData=function(data,page,total){
		if(page==undefined) page=1;
		if(total==undefined) total=data.length;
		total=parseInt(total);
		$.selected=undefined;
		for(var i=0;i<data.length;i++){
			var tr=document.createElement("tr");
			tr.dataId=i;
			tr.onclick=function(){
				var trs=this.parentNode.getElementsByTagName("tr");
				for(var i=0;i<trs.length;i++){
					Sky.removeClass(trs[i],"selected");
				}
				Sky.addClass(this,"selected");
				$.selected=data[this.dataId];
			};
			$.body.table.tbody.appendChild(tr);
			for(var j=0;j<columns.length;j++){
				var td=document.createElement("td");
				tr.appendChild(td);
				if('align' in columns[j]){
					td.align=columns[j].align;
				}
				var value=data[i][columns[j].name];
				if(columns[j].render){
					Sky.render(td,columns[j].render,[value,data[i]]);
				}else if(value){
					td.appendChild(document.createTextNode(value));
				}
			}
		}
		$.totalPage=parseInt(Math.ceil(total/$.pageSize));
		$.footer.totalPageDisplay.data="/"+$.totalPage;
		$.footer.pageInput.value=page;
		if(page==1){
			Sky.addClass($.footer.firstPageBtn,"disabled");
			Sky.addClass($.footer.prevPageBtn,"disabled");
		}else{
			Sky.removeClass($.footer.firstPageBtn,"disabled");
			Sky.removeClass($.footer.prevPageBtn,"disabled");
		}
		if(page==$.totalPage){
			Sky.addClass($.footer.nextPageBtn,"disabled");
			Sky.addClass($.footer.lastPageBtn,"disabled");
		}else{
			Sky.removeClass($.footer.nextPageBtn,"disabled");
			Sky.removeClass($.footer.lastPageBtn,"disabled");
		}
		if(isTheFirstTimeShowData){
			isTheFirstTimeShowData=false;
			setTimeout(function(){
				var clientWidth=$.body.clientWidth;
				var remainWidth=clientWidth-columns.length;
				var remainCount=0;
				var arr;
				for(var i=0;i<columns.length;i++){
					if(typeof columns[i].width=="string" && (arr=columns[i].width.match(/(\d+)%/))){
						columns[i].width=Math.round(clientWidth*parseFloat(arr[1])/100);
						if(columns[i].minWidth && columns[i].width<columns[i].minWidth){
							columns[i].width=columns[i].minWidth;
						}
						remainWidth-=columns[i].width;
					}else if(typeof columns[i].width=="number"){
						remainWidth-=columns[i].width;
					}else{
						remainCount++;
					}
				}
				if(remainWidth>0){
					for(var i=0;i<columns.length;i++){
						if(typeof columns[i].width!="number"){
							columns[i].width=Math.round(remainWidth/remainCount);
							remainWidth-=columns[i].width;
							remainCount--;
						}
						$.body.table.thead.childNodes[i].width=$.header.table.thead.childNodes[i].width=columns[i].width;
					}
				}
				var totalWidth=0;
				for(var i=0;i<columns.length;i++){
					totalWidth+=columns[i].width;
				}
				$.header.table.width=$.body.table.width=totalWidth;
			},0);
		}

	};
	this.getSelected=function(){
		return $.selected;
	};
	this.renderTo=function(wrap){
		wrap=Sky(wrap);
		wrap.appendChild($.dom);
		if(conf.height>50){
			$.body.style.height=conf.height-$.header.offsetHeight-$.footer.offsetHeight+'px';
		}else if(conf.height>0){
			$.body.style.height=conf.height+'px';
		}else{
			if($.container){
				$.container.fillUp();
				$.container.after('resize', $.refreshSize);
			}
			$.refreshSize();
		}
		if(conf.checkbox){
			Sky.attachEvent($.body.table,'click',function(e){
				var target=(e&&e.target)?e.target:window.event.srcElement;
				var parentNode=target;
				var tr,td;
				var tbody=$.body.table.getElementsByTagName("tbody")[0];
				if(tbody==parentNode) return ;
				do{
					td=tr;
					tr=parentNode;
					parentNode=parentNode.parentNode;
				}while(parentNode!=tbody)
				if(td && td==tr.firstChild){

				}else{
					var trs=tbody.childNodes;
					var arr=[];
					for(var i=0;i<trs.length;i++){
						var input=trs[i].firstChild.firstChild;
						input.checked=false;
					}
					tr.firstChild.firstChild.checked=true;
				}
			});
		}
	};
	this.refreshSize=function(){
		if(conf.height<=0){
			var remainHeight=$.dom.parentNode.clientHeight-$.header.offsetHeight-$.footer.offsetHeight;
			if(remainHeight>50){
				$.body.style.height=remainHeight+conf.height+"px";
			}
		}
	};
};

sky.Grid.prototype.loadList=function(page,pagesize,sortname,sortorder){
	var grid=this;
	var param={};
	if(page) param.page=page;
	if(pagesize) param.pagesize=pagesize;
	if(sortname) param.sortname=sortname;
	if(sortorder) param.sortorder=sortorder;
	this.clear();
	this.setLoadingStyle(true);
	Sky.post(this.url,param,function(data){
		grid.setLoadingStyle(false);
		grid.showData(data.items,page,data.total);
	},'json',function(data){
		grid.setLoadingStyle(false);
		if(this.status==405){
			alert('不能请求静态资源');
		}else if(this.status==404){
			alert('动态资源请求失败');
		}else if(this.status==403){
			alert('权限不足');
		}else{
			if(sky.Dialog){
				sky.Dialog.error(data);
			}else{
				alert('请求失败');
			}
		}
	});
};