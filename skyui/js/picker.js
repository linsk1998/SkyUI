
sky.SelectPicker=function(html){
	var $=this;
	sky.events.EventDispatcher.call(this);//继承EventDispatcher
	this.dom=Sky.createDiv("s-selectpicker");
	if(html){
		if(typeof html=="string"){
			this.dom.innerHTML=html;
		}else{
			this.dom.appendChild(html);
		}
	}
	this.show=function(left,top,width,height){
		document.body.appendChild(this.dom);
		if(left!=undefined){this.dom.style.left=left+'px';}
		if(top!=undefined){this.dom.style.top=top+'px';}
		if(width){this.dom.style.width=width+'px';}
		if(height){this.dom.style.height=height+'px';}
		sky.Blur.attach(this.dom,function(){
			$.close();
		});
	};
	this.close=function(){
		if(this.dispatchOnEvent("close")){
			if(this.dom.parentNode){
				this.dom.parentNode.removeChild(this.dom);
			}
			sky.Blur.detach(this.dom);
			this.dispatchAfterEvent("close");
		}
	};
};

sky.picker={};
sky.picker.DatePicker=function(date){
	var dayName=["日","一","二","三","四","五","六"];
	var $=this;
	if(date){this.value=date}
	else{this.value=new Date();};
	var pointDate=new Date();
	sky.SelectPicker.call(this);
	//$.dom.style.width="220px";
	Sky.addClass($.dom,"s-datepicker");
	var head=Sky.createDiv("s-datepicker-head", $.dom);
	var headTable=document.createElement("table");
	head.appendChild(headTable);
	var tbody=document.createElement("tbody");
	headTable.appendChild(tbody);
	var tr=document.createElement("tr");
	tbody.appendChild(tr);
	var td=document.createElement("td");
	tr.appendChild(td);
	td.width="20";/*想来想去，还是把上一年下一年的按钮先去掉了
	var prevYearBtn=document.createElement("span");
	td.appendChild(prevYearBtn);
	prevYearBtn.className="fa";
	prevYearBtn.innerHTML="&#xf100;";
	prevYearBtn.onclick=function(){
		pointDate.setFullYear(pointDate.getFullYear()-1);
		$.loadDate(pointDate);
	};*/
	td.appendChild(document.createTextNode(" "));
	var prevMouthBtn=document.createElement("span");
	td.appendChild(prevMouthBtn);
	prevMouthBtn.className="fa";
	prevMouthBtn.innerHTML="«";
	prevMouthBtn.onclick=function(){
		pointDate.setMonth(pointDate.getMonth()-1);
		$.loadDate(pointDate);
	};
	td=document.createElement("td");
	tr.appendChild(td);
	var yearText=document.createElement("span");
	td.appendChild(yearText);
	var yearInput=document.createElement("input");
	yearInput.size=4;
	if(Sky.browser.safari){//火狐对number的支持不是很好
		yearInput.type="number";
		yearInput.min=1000;
		yearInput.max=3000;
		yearInput.step=1;
	}else{
		yearInput.type="text";
	}
	yearText.onclick=function(e){
		e=e||window.event
		var target=e.target||e.srcElement;
		if(target==this){
			this.innerHTML="";
			this.appendChild(yearInput);
			yearInput.focus();
		}
	};
	yearInput.onblur=function(){
		yearText.innerHTML=yearInput.value;
		pointDate.setFullYear(parseInt(this.value));
		$.loadDate(pointDate);
	};
	td.appendChild(document.createTextNode("年"));
	var mouthText=document.createElement("span");
	var mouthSelector=document.createElement("select");
	for(var i=0;i<12;i++){
		var option=new Option(i+1,i);
		mouthSelector.options.add(option);
	}
	mouthText.onclick=function(e){
		e=e||window.event
		var target=e.target||e.srcElement;
		if(target==this){
			this.innerHTML="";
			this.appendChild(mouthSelector);
			mouthSelector.focus();
		}
	};
	mouthSelector.onblur=function(){
		if(mouthSelector.parentNode){
			try{
				mouthSelector.parentNode.removeChild(mouthSelector);
			}catch(e){
				console.log("为啥chrome这里会报错");
			}
		}
		mouthText.innerHTML=mouthSelector.options[mouthSelector.options.selectedIndex].text;
	};
	mouthSelector.onchange=function(){
		//console.log("onchange");
		//mouthText.removeChild(mouthSelector);
		Sky.fireEvent(mouthSelector,"blur");
		pointDate.setMonth(parseInt(this.value));
		$.loadDate(pointDate);
	};
	td.appendChild(mouthText);
	td.appendChild(document.createTextNode("月"));
	td=document.createElement("td");
	tr.appendChild(td);
	td.width="20";
	var nextMouthBtn=document.createElement("span");
	td.appendChild(nextMouthBtn);
	nextMouthBtn.className="fa";
	//nextMouthBtn.innerHTML="&#xf105;";
	nextMouthBtn.innerHTML="»";
	nextMouthBtn.onclick=function(){
		pointDate.setMonth(pointDate.getMonth()+1);
		$.loadDate(pointDate);
	};/*
	td.appendChild(document.createTextNode(" "));
	var nextYearBtn=document.createElement("span");
	td.appendChild(nextYearBtn);
	nextYearBtn.className="fa";
	nextYearBtn.innerHTML="&#xf101;";
	nextYearBtn.onclick=function(){
		pointDate.setFullYear(pointDate.getFullYear()+1);
		$.loadDate(pointDate);
	};*/
	var calendar=document.createElement("table");
	$.dom.appendChild(calendar);
	calendar.className="s-calendar";
	var thead=document.createElement("thead");
	calendar.appendChild(thead);
	tr=document.createElement("tr");
	thead.appendChild(tr);
	var th,i;
	for(i=0;i<dayName.length;i++){
		th=document.createElement("th");
		th.appendChild(document.createTextNode(dayName[i]));
		tr.appendChild(th);
	}
	var calendarBody=document.createElement("tbody");
	calendar.appendChild(calendarBody);
	this.loadDate=function(date){
		calendar.removeChild(calendarBody);
		calendarBody=document.createElement("tbody");
		calendar.appendChild(calendarBody);
		pointDate.setTime(date.getTime());
		with(pointDate){
			setSeconds(0);
			setMilliseconds(0);
			setMinutes(0);
			setHours(0);
		}
		var mouth=date.getMonth();
		var year=date.getFullYear();
		mouthText.innerHTML=mouth+1;
		yearText.innerHTML=year;
		mouthSelector.selectedIndex=mouth;
		yearInput.value=year;
		var today=new Date();
		with(today){
			setSeconds(0);
			setMilliseconds(0);
			setMinutes(0);
			setHours(0);
		}
		pointDate.setDate(1);
		pointDate.setDate(1-pointDate.getDay());
		var tr;
		for(var i=0;i<42;i++){
			var day=i%7;
			if(day==0){
				tr=document.createElement("tr");
				calendarBody.appendChild(tr);
			}
			var td=document.createElement("td");
			if(mouth!=pointDate.getMonth()){
				td.className='s-weak';
			}else if(day==0 || day==6){
				td.className='s-calendar-weekend';
			}
			if(pointDate.getTime()==today.getTime()){
				Sky.addClass(td,"s-calendar-today");
			}
			var dt=$.value.getTime()-pointDate.getTime()
			if(dt<24*60*60*1000 && dt>=0){
				Sky.addClass(td,"active");
			}
			td.timestamp=pointDate.getTime();
			td.onclick=function(){
				if($.dispatchOnEvent("pick")){
					$.value.setTime(this.timestamp);
					var tds=calendarBody.getElementsByTagName("td");
					for(var i=0;i<tds.length;i++){
						if(tds[i]==this){
							Sky.addClass(this,"active");
						}else{
							Sky.removeClass(tds[i],"active");
						}
					}
					$.dispatchAfterEvent("pick");
				}
			};
			tr.appendChild(td);
			var d=pointDate.getDate();
			td.appendChild(document.createTextNode(d));
			pointDate.setDate(d+1);
		}
		pointDate.setDate(-15);
	};
	this.loadDate(this.value);
	var ctrl=Sky.createDiv("s-datepicker-ctrl", $.dom);
	var curBtn=document.createElement("input");
	curBtn.type="button";
	curBtn.value="今天";
	curBtn.onclick=function(){
		var today=new Date();
		with(today){
			setSeconds(0);
			setMilliseconds(0);
			setMinutes(0);
			setHours(0);
		}
		$.value.setTime(today.getTime());
		confirmBtn.click();
	};
	ctrl.appendChild(curBtn);
	var confirmBtn=document.createElement("input");
	confirmBtn.type="button";
	confirmBtn.value="确定";
	ctrl.appendChild(confirmBtn);
	confirmBtn.onclick=function(){
		if($.dispatchOnEvent("pick")){
			$.dispatchAfterEvent("pick");
			if($.dispatchOnEvent("confirm")){
				$.close();
				$.dispatchAfterEvent("confirm");
			}
		}
	};
};
sky.picker.DateTimePicker=function(date){
	var $=this;
	sky.picker.DatePicker.call(this,date);
	var timeWrap=document.createElement("div");
	timeWrap.className="s-datepicker-timeWrap";
	timeWrap.appendChild(document.createTextNode("时间:"));
	$.dom.insertBefore(timeWrap,$.dom.lastChild);
	var timeInput=new sky.editor.MaskedInput(timeWrap,{
		'pattern':/^(\d{2}):(\d{2}):(\d{2})$/,
		'required':true,
		'width':74,
		'height':20,
		'value':date.format("hh:mm:ss")
	});
	timeInput.on('blur',function(input,index){
		var value=parseInt(input.value);
		if(isNaN(value)) value=0;
		if(value<0) value=0;
		var max=60;
		if(index==0){
			max=24;
		}
		if(value>=max){
			value=max-1;
		}
		if(index==0){
			$.value.setHours(value);
		}else if(index==1){
			$.value.setMinutes(value);
		}else{
			$.value.setSeconds(value);
		}
		if(value<10){
			input.value="0"+value;
		}else{
			input.value=value;
		}
	});
	$.after('pick',function(){
		var hr=parseInt( timeInput.subInputs[0].value);
		var m=parseInt( timeInput.subInputs[1].value);
		var s=parseInt( timeInput.subInputs[2].value);
		$.value.setHours(hr);
		$.value.setMinutes(m);
		$.value.setSeconds(s);
	});
};
sky.picker.FontPicker=function(){
	sky.SelectPicker.call(this);
	var $=this;
	var fontfamily=[
		{ name: '宋体', val: '宋体,SimSun'},
		{ name: '微软雅黑', val: '微软雅黑,Microsoft YaHei'},
		{ name: '楷体', val: '楷体,楷体_GB2312, SimKai'},
		{ name: '黑体', val: '黑体, SimHei'},
		{ name: '隶书', val: '隶书, SimLi'},
		{ name: 'andale mono', val: 'andale mono'},
		{ name: 'arial', val: 'arial, helvetica,sans-serif'},
		{ name: 'arial black', val: 'arial black,avant garde'},
		{ name: 'comic sans ms', val: 'comic sans ms'},
		{ name: 'impact', val: 'impact,chicago'},
		{ name: 'times new roman', val: 'times new roman'},
		{ name: 'sans-serif',val:'sans-serif'}
	];
	var ul=document.createElement("ul");
	this.dom.appendChild(ul);
	Sky.addClass(this.dom,"s-fontpicker");
	for(var i=0;i<fontfamily.length;i++){
		var li=document.createElement("li");
		li.title=fontfamily[i].val;
		li.appendChild(document.createTextNode(fontfamily[i].name));
		li.style.fontFamily=fontfamily[i].val;
		ul.appendChild(li);
		li.onclick=function(){
			if($.dispatchOnEvent("pick",[this.title])){
				$.dispatchAfterEvent("pick",[this.title]);
			}
			$.close();
		};
	}
};

sky.picker.ColorPicker=function(color){
	sky.SelectPicker.call(this);
	var me=this;
	Sky.addClass(this.dom,"s-colorpicker");
	this.color=color || "#000000";
	var dftBox,input;
	var table=document.createElement("table");
	document.createElement("table");
	var thead=createTableHead();
	table.appendChild(thead);
	var tbody=createColorTable();
	table.appendChild(tbody);
	this.dom.appendChild(table);
	this.pick=function(color){
		if(me.dispatchOnEvent("pick",[color])){//分发事件，把图片路径作为参数
			me.close();
			me.dispatchAfterEvent("pick",[color]);
		}
	};
	function createColorTable(){
		var tbody=document.createElement("tbody");
		var ColorHex=new Array('00','33','66','99','cc','ff');
		var SpColorHex=new Array('ff0000','00ff00','0000ff','ffff00','00ffff','ff00ff');
		for(i=0;i<2;i++){
			for(j=0;j<6;j++){
				var tr=document.createElement("tr");
				var td=document.createElement("td");
				td.bgColor="#000000";
				tr.appendChild(td);
				td=document.createElement("td");
				td.bgColor="#"+(i==0 ? ColorHex[j]+ColorHex[j]+ColorHex[j] : SpColorHex[j]);
				tr.appendChild(td);
				td=document.createElement("td");
				td.bgColor="#000000";
				tr.appendChild(td);
				for (k=0;k<3;k++){
					for (l=0;l<6;l++){
						td=document.createElement("td");
						td.bgColor="#"+(ColorHex[k+i*3]+ColorHex[l]+ColorHex[j]);
						tr.appendChild(td);
					}
				}
				tbody.appendChild(tr);
			}
		}
		tbody.onmouseout=function(e){
			e=e || window.event;
			var target=e.target || e.srcElement || this;
			if(document.activeElement==input){
			}else{
				dftBox.style.background=input.value=me.color;
			}
		};
		tbody.onmouseover=function(e){
			e=e || window.event;
			var target=e.target || e.srcElement || this;
			if(document.activeElement==input){
			}else if(target.bgColor){
				dftBox.style.background=input.value=target.bgColor;
			}
		};
		tbody.onclick=function(e){
			e=e || window.event;
			var target=e.target || e.srcElement || this;
			if(target.bgColor){
				me.color=target.bgColor;
				me.pick(me.color);
			}
		};
		return tbody;
	}
	function createTableHead(){
		var thead=document.createElement("thead");
		var tr=document.createElement("tr");
		var td=document.createElement("th");
		td.colSpan=21;
		tr.appendChild(td);
		thead.appendChild(tr);
		td.innerHTML='<input type="color" class="s-colorpicker-sysBtn"/>';
		var sysBtn=td.firstChild;
		sysBtn.parentNode.removeChild(sysBtn);
		if(sysBtn.type!="color"){
			sysBtn=null;
			if(!window.dlgHelper){
				window.dlgHelper=document.createElement("OBJECT");
				dlgHelper.setAttribute('classId',"clsid:3050f819-98b5-11cf-bb82-00aa00bdce0b");
				dlgHelper.setAttribute('width',"0");
				dlgHelper.setAttribute('height',"0");
				dlgHelper.setAttribute('id',"dlgHelper");
				//window.dlgHelper=new ActiveXObject('HtmlDlgSafeHelper.HtmlDlgSafeHelper');
				document.body.appendChild(dlgHelper);
			}
			if('ChooseColorDlg' in dlgHelper){
				sysBtn=document.createElement("button");
				sysBtn.setAttribute("type","button");
				sysBtn.className="s-colorpicker-sysBtn";
				sysBtn.onclick=function(){
					var color;
					if(me.color){
						color=dlgHelper.ChooseColorDlg(me.color);
					}else{
						color=dlgHelper.ChooseColorDlg();
					}
					color="000000"+color.toString(16);
					me.color="#"+color.substr(color.length-6,6);
					me.pick(me.color);
				};
			}
		}else{
			sysBtn.onchange=function(){
				me.color=this.value;
				me.pick(me.color);
			};
			sysBtn.onclick=function(){
				this.value=me.color;
			};
		}
		var noneBtn=document.createElement("button");
		noneBtn.setAttribute("type","button");
		noneBtn.className="s-colorpicker-noneBtn";
		noneBtn.onclick=function(){
			me.color="";
			me.pick(me.color);
		};
		dftBox=document.createElement("span");
		dftBox.className="s-colorpicker-dftBox";
		dftBox.onclick=function(){
			me.pick(input.value);
		};
		input=document.createElement("input");
		input.className="s-colorpicker-input";
		input.maxLength=7;
		input.onkeypress=function(e){
			e=e || window.event;
			if(e.keyCode==13){
				this.value=this.value.toLowerCase();
				if(/^#[a-f0-9]{6}$/.test(this.value)){
					me.pick(this.value);
				}else{
					alert("颜色格式不正确");
				}
			}
		};
		if('oninput' in input){
			input.onpaste=input.oninput=function(){
				var value=this.value.toLowerCase();
				if(/^#[a-f0-9]{6}$/.test(value)){
					dftBox.style.background=value;
				}
			};
		}else{
			input.onpropertychange=function(){
				if(event.propertyName.toLowerCase () == "value"){
					var value=this.value.toLowerCase();
					if(/^#[A-F0-9]{6}$/.test(value)){
						dftBox.style.background=value;
					}
				}
			};
		}
		input.onblur=function(){
			var value=this.value.toLowerCase();
			if(/^#[a-f0-9]{6}$/.test(value)){
				this.value=value;
			}else{
				this.value=me.color;
			}
			dftBox.style.background=this.value;
		};
		td.appendChild(dftBox);
		td.appendChild(input);
		dftBox.style.background=input.value=me.color;
		td.appendChild(noneBtn);
		if(sysBtn) td.appendChild(sysBtn);
		return thead;
	}
};