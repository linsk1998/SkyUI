
sky.Dom={};
sky.Dom.parseSelector=function(selector,parent){
	var arr=selector.split(",");
	if(arr.length==1){
		var dom=parse1(selector);
		if(parent && parent.appendChild) parent.appendChild(dom);
		return dom;
	}
	var fragment = document.createDocumentFragment();
	for(var i=0;i<arr.length;i++){
		var dom=parse1(arr[i]);
		fragment.appendChild(dom);
	}
	if(parent && parent.appendChild) parent.appendChild(fragment);
	return fragment;
	function parse1(selector){
		var arr=selector.split(">");
		var dom=parse2(arr[0]);
		if(arr.length>1){
			var parent=dom;
			for(var i=1;i<arr.length;i++){
				var sub=parse2(arr[i]);
				parent.appendChild(sub);
				parent=sub;
			}
		}
		return dom;
	}
	function parse2(selector){
		selector=selector.replace(/\s/,'');
		var arr=selector.match(/\[(\d+)\]$/);
		var other=0;
		if(arr && arr.length>1){
			other=parseInt(arr[1]);
			if(isNaN(other)){
				other=0;
			}
		}
		var dom;
		arr=selector.match(/^[a-zA-Z0-9_\-]+/);
		if(arr){
			dom=document.createElement(arr[0]);
		}else{
			dom=document.createElement("div");
		}
		arr=selector.match(/#([a-zA-Z0-9_\-]+)/);
		if(arr && arr.length>1){
			dom.id=arr[1];
		}
		var regexp=/\.([a-zA-Z0-9_\-]+)/g;
		var rs;
		arr=[];
		while((rs = regexp.exec(selector)) != null){
			arr.push(rs[1]);
		}
		if(arr.length){
			dom.className=arr.join(" ");
		}
		regexp=/\[([a-zA-Z0-9_\-]+)=([a-zA-Z0-9_\-']+)\]/g
		while((rs = regexp.exec(selector)) != null){
			var value=rs[2];
			var key=rs[1];
			if(value.charAt(0)=="'" && value.charAt(value.length-1)){
				value=value.substr(1,value.length-2);
			}
			dom.setAttribute(key,value);
		}
		return dom;
	}
};
sky.dom={};
sky.dom.Mustache=function(tplString){
	var dom=document.createDocumentFragment();
	var div=document.createElement("div");
	tplString=tplString.replace(/{{\s*([a-zA-Z0-9_\$]+)\s*}}/g,'<script:$1 type="variable/text" name="$1"></script:$1>')
		.replace(/{{&\s*([a-zA-Z0-9_\$]+)\s*}}/g,'<script:$1 type="variable/html" name="$1"></script:$1>')
		.replace(/{{#\s*([a-zA-Z0-9_\$]+)\s*}}/g,'<script:$1 type="section/existed" name="$1">')
		.replace(/{{\^\s*([a-zA-Z0-9_\$]+)\s*}}/g,'<script:$1 type="section/inverted" name="$1">')
		.replace(/{{\/\s*([a-zA-Z0-9_\$]+)\s*}}/g,'</script:$1>');
	div.innerHTML=tplString;
	console.log(div);
	alert(div.getElementsByTagName("mustache").length);
	dom.data={};
};
var div=document.createElement("div");
sky.dom.Mustache2=function(tplString){
	var dom=document.createDocumentFragment();
	/*分析层次结构*/
	var htmlParts=tplString.split(/({{#\s*[a-zA-Z0-9_\$]+\s*}}|{{\^\s*[a-zA-Z0-9_\$]+\s*}}|{{\/\s*[a-zA-Z0-9_\$]+\s*}})/);
	var root=new ObjectPart(null);
	var p=root;
	htmlParts.forEach(function(item){
		var arr;
		if(arr=item.match(/{{#\s*([a-zA-Z0-9_\$\.]+)\s*}}/)){
			p.htmlParts.push('<script type="section/existed" name="'+arr[1]+'" index="'+p.objectParts.length+'"></script>');
			var objectPart=new ObjectPart(root);
			objectPart.parent=p;
			objectPart.name=arr[1];
			p.objectParts.push(objectPart);
			p=objectPart;
		}else if(arr=item.match(/{{\^\s*([a-zA-Z0-9_\$\.]+)\s*}}/)){
			p.htmlParts.push('<script type="section/inverted" name="'+arr[1]+'" index="'+p.objectParts.length+'"></script>');
			var objectPart=new ObjectPart(root);
			objectPart.parent=p;
			objectPart.name=arr[1];
			p.objectParts.push(objectPart);
			p=objectPart;
		}else if(arr=item.match(/{{\/\s*([a-zA-Z0-9_\$]+)\s*}}/)){
			if(!p.parent){
				throw "Unexpected ended tag "+arr[0];
			}else if(p.name!=arr[1]){
				throw "Unexpected ended tag "+arr[0]+". Missing {{/"+p.parent.name+"}}";
			}
			p=p.parent;
		}else{
			p.htmlParts.push(item.replace(/{{\s*([a-zA-Z0-9_\$\.]+)\s*}}/g,'<script type="variable/text" name="$1"></script>')
				.replace(/{{&\s*([a-zA-Z0-9_\$\.]+)\s*}}/g,'<script type="variable/html" name="$1"></script>'));
		}
	});
	if(p!=root){
		throw "Missing ended tag {{/"+ p.name+"}}";
	}
	/*创建区域*/
	createSection(root.htmlParts.join(''),root);
	function createSection(tplString,objectPart){
		div.innerHTML=tplString;
		var options=new TObjectOptions();
		var tags=div.getElementsByTagName("script");
		for(var i=0;i<tags.length;i++){
			var tag;
			if(tags[i].type=="variable/text"){
				tag=new TText();
				tags[i].parentNode.insertBefore(tag.dom,tags[i]);
				options.texts.push({'name':tags[i].name,'tag':tag});
			}else if(tags[i].type=="variable/html"){
				tag=new THtml();
				tags[i].parentNode.insertBefore(tag.dom,tags[i]);
				options.htmls.push({'name':tags[i].name,'tag':tag});
			}
		}
		for(var i=tags.length-1;i>=0;i--){
			tags[i].parentNode.removeChild(tags[i]);
		}
		new TObject(options);
	}
	console.log(div);
	dom.data={};
	function ObjectPart(root){
		this.objectParts=[];
		this.htmlParts=[];
		this.parent=null;
	}
};
TObjectOptions=function(){
	this.texts=[];
	this.htmls=[];
	this.sections=[];
	this.inverts=[];
};
TObject=function(options){
	var propOptions={};
	var props={};
	function getPropOptions(name){
		if(name in propOptions){
			return propOptions[name];
		}
		return propOptions[name]=new TObjectOptions();
	}
};
SectionObject=function(){

};
sky.dom.TTag=function(nodes){

};
TText=function(){
	this.dom=document.createTextNode("");
	this.setData=function(data){
		this.dom.data=data;
	};
};
THtml=function(){
	this.dom=document.createDocumentFragment();
	this.setData=function(data){
		while(this.dom.childNodes.length){
			this.dom.removeChild(this.dom.firstChild);
		}
		if(Sky.isString(data)){
			div.innerHTML=data;
			while(div.childNodes.length){
				this.dom.appendChild(div.firstChild);
			}/*
			for(var i=0;i<div.childNodes.length;i++){
				this.dom.appendChild(div.childNodes[i]);
			}*/
		}else{
			this.dom.appendChild(data);
		}
	};
};
sky.dom.TSection=function(nodes){
	this.dom=document.createDocumentFragment();

};
sky.dom.TInvertedSection=function(nodes){

};