
var GJDQBox=function(element,options){
	var $=this;
	var conf={
		'valueField':"id",
		'displayField':"mc"
	};
	conf=Sky.extend(conf,options);
	sky.editor.PopupBox.call(this,element,conf);
	$.on('click',function(){
		$.isEditing=true;
		var dl=sky.Dialog.iframe("/demo/grid/dataGrid.html",{'title':"国家地区"});
		dl.onConfirm=function(){
			var selection=dl.window.grid.getSelected();
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