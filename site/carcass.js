
let abonent={	
	domain:'',
	guest_login:'',
	path:'',
};


let comm={
	ax_get(func=comm.show_ax, url){//стандартная функция отправки сообщения
		let req=new XMLHttpRequest();
		req.addEventListener('load', control[func]);//привязали контекст
		req.open('GET', url, true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.responseType = 'text';
		req.send();
	},
	ax_post(obj, func=comm.show_ax, url=abonent.path){//стандартная функция отправки сообщения
		let req=new XMLHttpRequest();
		req.addEventListener('load', func);//привязали контекст
		req.open('POST', url, true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.responseType = 'text';
		let str_obj=JSON.stringify(obj);
		req.send(str_obj);
		req.onload=comm.err;
	},
	ax_form(obj, func=comm.show_ax, url=abonent.path){//стандартная функция отправки сообщения
		let req=new XMLHttpRequest();
		let ab = new FormData();
		for (let i in obj){
			ab.append(i, obj[i]);
		}
		req.addEventListener('load', func);//привязали контекст
		req.open('POST', url, true);
		req.setRequestHeader('Content-Type', 'multipart/form-data');
		req.responseType = 'text';
		req.send(ab);
		req.onload=comm.err;
	},
	err(e){
		let data=e.target;
		if(data.status!=200){
			if(data.status>399){
				console.log(data.status);
			}
			if(data.response=="Wrong login or password"||data.response=="Wrong domain, session or session expired"){
				control.on_on(['first_menu', 'manual_munu', 'manual_login']);
			}
		}
	},
    show_ax(e) {//стандартная функция получения сообщения
        let data=e.target;
		let obj;
		let isValidJSON=true;
        if(data.status==200){
			try { obj=JSON.parse(data.response)} catch { isValidJSON = false };
			if(!isValidJSON){
				obj=data.response;
				console.log(obj);
				//тут можно вывести сообщение в специальной строке
			}
			if(obj.user_check==0){
    			if(typeof control !== "undefined"){ //функции по клику
    				if(control.check_0){
    					control.check_0(obj); 
    				}
    			}
			}else{
				if(receivers[obj.api]){
					receivers[obj.api](obj);
				}
			}
		}else{
			//тут можно вывести сообщение в специальной строке 
		}
    }

};

let carcass_links={ //связываем действия пользователя с функциями
    call_func (e){
        let link=e.target;
		let name;
		name=link.parentNode.dataset.parentsgroup;
        if(typeof name !== "undefined"){ //функции по клику
			link.parentNode.dataset.parentsgroup=link.dataset.click;
			maker.parentsgroup();
        }
		name=link.parentNode.dataset.clicklist;
        if(typeof name !== "undefined"){ //функции по клику
			if(typeof control !== "undefined"){ //функции по клику
				if(control[name]){
					control[name](link); 
				}
			}
        }
		name=link.parentNode.dataset.multigroup;
        if(typeof name !== "undefined"){ //функции по клику
			link.parentNode.dataset.item=link.dataset.item;
			maker.multigroup();
        }
        name=link.dataset.click;
        if(typeof name !== "undefined"){ //функции по клику
			if(typeof control !== "undefined"){ //функции по клику
				if(control[name]){
					control[name](link); 
				}
			}
        }
		carcass_links.next(link);
    },
    call_func_chng (e){
        let link=e.target;
        let name=link.dataset.read;
        if(name){ //функции по изменению
			if(typeof control !== "undefined"){ 
				if(control[name]){
					control[name](link);
				}
			}
        }
		carcass_links.next(link);
    },
	next(link){
		if(typeof links !== "undefined"){ 
			if(links.call_func){
				links.call_func(link);
			}
		}
	},
};

let carcass_functions={
    aa:{},
    txt:'',
	saveLS(){
		localStorage[abonent.domainAbonent]=JSON.stringify(abonent);
	},
	dellLS(){
		localStorage.removeItem(abonent.domainAbonent);
	},
	show_name_read(){
		for(let i in blocks.read){
		    blocks.read[i].setAttribute('title', i);
		}
		for(let i in blocks.click){
		    blocks.click[i].setAttribute('title', i);
		}
	},
	read_block(parent, obj){
	    // !!!  нужна таблица  псевдонимов!!!
	    let arr=parent.querySelectorAll('input[data-read]');
	    for(let i=0; i<arr.length; i++){
            obj[arr[i].dataset.read]=arr[i].value;
	    }
	    arr=parent.querySelectorAll('area[data-read]');
	    for(let i=0; i<arr.length; i++){
            obj[arr[i].dataset.read]=arr[i].value;
	    }
	},
	write_object(obj, alias){
	    for(let i in alias){
	        obj[i]=alias[i].value;
	    }
	},
	write_alias(obj, alias){
	    for(let i in obj){
	        if(i in alias){
	            alias[i].value=obj[i];
	        }
	    }
	},
	recovery(link){
		let filters = [
            { usbVendorId: 8580, usbProductId: 17 }
		];
		let settings = {
			baudRate: 115200,
			dataBits: 8,
			stopBits: 1,
			parity: "none",
			flowControl: "none"
		};
		(async () => { //ввод и вывод данных порта
			port = await navigator.serial.requestPort(); //выбираем порт
			//console.log(port.getInfo());
			await port.open(settings); //настройки
		//	for(let i in links.click){
		//		links.click[i].style.opacity=1;
		//	}
			carcass_functions.aa.writer = port.writable.getWriter(); //функция записи в порт
			//aa= new MyClass(writer); //параметр - функция отправки сообщения
			carcass_functions.aa.reader = port.readable.getReader();
			link.dataset.active=1;
			if(control.recovery_connected){
			    control.recovery_connected(carcass_functions.aa);
			}
			while (true) { //слушаем порт
				let { value, done } = await carcass_functions.aa.reader.read();
				if (done) {
					reader.releaseLock();
					break;
				}
				//aa.listener.call(aa, value)
				let decoded = new TextDecoder("windows-1251").decode(value);
				//pole.innerText=pole.innerText+decoded;//вызов функции чтения из порта
				carcass_functions.writeInfo(decoded);
			}
		})();		
	},
	portWriter(data){
	    let ss=data+"\r";
	    let encoded = new TextEncoder("windows-1251").encode(ss);
	    carcass_functions.aa.writer.write(encoded);
	    control.logC(data);
	},
	writeInfo(data){
		console.log('data');
        console.log(data);
	    carcass_functions.txt=carcass_functions.txt+data;
	    let ttxt='';
	    let pos=carcass_functions.txt.indexOf('\r');
	    let msg='';
    	while(pos !=-1){ 
	        ttxt=carcass_functions.txt.slice(0, pos);
	        if(functions.qrCode){
	            functions.qrCode(ttxt);
	        }else{
	            console.log(ttxt);
	            console.log('len = '+ttxt.length);
	        }
    	    carcass_functions.txt=ttxt.slice(pos+1);
    	    pos=carcass_functions.txt.indexOf('\r');
	    }
	},
};

class ligth_builder{
	constructor(blocks) { // blocks - место хранения ссылок на создаваемые блоки, для всех dataset
		if(blocks){
			this.blocks=blocks;
		} else{
			this.blocks={};
		}
	}
	make(text="", parent="", id="", className="", replace=""){//видимый текст или объект, место вставки, dataset id, dataset CSS, редактировать или заменить
		let blk = document.createElement('div');  //создали блок 
		if(id){
			blk.dataset.id=id;     //вставили новый id
			if(this.blocks['id']){
				this.blocks['id'][id]=blk;
			}else{
				this.blocks['id']={};
				this.blocks['id'][id]=blk;
			}
		}
		if(className){
			blk.className=className;     //вставили новый class	
		}
		if(text){
			blk.textContent=text;   //вставляем текст
		}
		if(replace&&parent){
			parent.innerHTML="";
		}
		if(parent){
			parent.appendChild(blk); //вставили в блок
		}else{
		//	document.body.appendChild(blk);
		}
		return blk;
	}
}
class Builder{
	constructor(blocks) {// blocks - место хранения ссылок на создаваемые блоки, для всех dataset
		if(blocks){
			this.blocks=blocks;
		} else{
			this.blocks={};
		}
	}
	make(text="", parent=""){ //в поле text массив объектов, объект описывает создаваемый блок
		if(typeof(text)=="object"){
			let parent_temp=parent;
			if(!parent){
				parent="div";
			}
			if(typeof(parent)=="string"){
				parent_temp = document.createElement(parent);
			}
			//--------------------------------------			
			let arr=[];
			for (let i=0; i<text.length; i++){
				if(!text[i].object){
					if(!text[i].tag){text[i].tag="div"}
					arr[i] = document.createElement(text[i].tag);
				}else{
					arr[i]=text[i].object; //вложение готового объекта
				}
				if(text[i].tag=="div"||!text[i].tag||text[i].tag=="button"||text[i].tag=="span"){
					if(text[i].text){
						arr[i].innerText=text[i].text;
					}
				}
				if(text[i].list&&text[i].tag=='select'){
					if(Array.isArray(text[i].list)){
						for(let j=0; j<text[i].list.length; j++ ){ 
							arr[i].appendChild(new Option(text[i].list[j][0],text[i].list[j][1],text[i].list[j][2], text[i].list[j][3]));
						}
					}
				}
				other(text[i], arr[i], this.blocks);
				parent_temp.appendChild(arr[i]);
			}
			return parent_temp;
		}
		function other(obj_in, obj_out, blocks){
			for (let k in obj_in){
				let arr_k=k.split("_");
				switch (k) {
					case "tag":
					break;
					case "list":
					break;
					case "object":
					break;
					default:
					if(arr_k.length>1){
						if(arr_k[0]=="dataset"){
							if(blocks[arr_k[1]]){
								blocks[arr_k[1]][obj_in[k]]=obj_out;
							}else{
								blocks[arr_k[1]]={};
								blocks[arr_k[1]][obj_in[k]]=obj_out;
							}
						}
						if(arr_k.length==2){obj_out[arr_k[0]][arr_k[1]]=obj_in[k];}
						if(arr_k.length==3){obj_out[arr_k[0]][arr_k[1]][arr_k[2]]=obj_in[k];}
					}else{
						obj_out[k]=obj_in[k];
					}
				}
			}
		}
	}
};
class OneType extends Builder{ //однотипные блоки
	constructor(tags, set, blocks) {//tags - массив вередаваемых свойств, set - общие свойства для всех полей
		super(blocks); 		
		this.tags=tags;  
		this.set=set;
		}
	prepare(data, parent){ //в данных передаем только значения в заданном порядке указанном в tags - массив массивов
		let arr=[];  //если в данных одно значение,  скобки массива можно не ставвить.
		for(let i=0; i<data.length; i++){
			let obj={};
			if(Array.isArray(data[i])){
				for(let x=0; x<this.tags.length; x++){
					if(data[i][x]){
						obj[this.tags[x]]=data[i][x];
					}
				}
			}else{
				obj[this.tags[0]]=data[i];
			}
			for(let y in this.set){
				obj[y]=this.set[y];
			}
			arr[i]=obj;
		}
		//console.log(arr);
		return this.make(arr, parent);
	}
}
class ManyTypes extends Builder {
	constructor(sets, blocks) {
		super(blocks);
		this.sets=sets; //масив объектов со значениями [{tags=[], set={}}, {tags=[], set={}}, {tags=[], set={}}]
	}
		// при настройке указываем какие будут переданы свойства  для каждого поля tags=["text", "dataset_id"], 
		// общие свойства для каждого поля set={dataset_clss:"btn"}
		//в данных передаем только значения в заданном порядке [fg, ghj], [erd, tygd]
		// если в данных одно значение, можно  скобки массива не вставлять.
	prepare(data, parent){
		let arr=[];
		for(let i=0; i<data.length; i++){
			let obj={};
			if(typeof(data[i])=="object"){
				for(let x=0; x<this.sets[i].tags.length; x++){
					if(data[i][x]){
						obj[this.sets[i].tags[x]]=data[i][x];
					}
				}
			}else{
				obj[this.sets[i].tags[0]]=data[i];
			}
			for(let y in this.sets[i].set){
				obj[y]=this.sets[i].set[y];
			}
			arr[i]=obj;
		}
		return this.make(arr, parent);
	}
}

let blocks={};

let maker={
	one: new OneType(['dataset_id', 'className', 'text', 'dataset_parentsgroup'],{}, blocks ),
	multi: new OneType(['dataset_id', 'className', 'text', 'dataset_multigroup'],{}, blocks ),
	click: new OneType(['dataset_click', 'text', 'dataset_group'],{className:'buttons'}, blocks ),
	clickItem: new OneType(['dataset_click', 'text', 'dataset_item', 'dataset_call'],{className:'buttons'}, blocks ),
	addBlocks: new OneType(['object', 'dataset_block', 'className', 'dataset_slave'],{}, blocks ),
	textBlocks: new OneType(['dataset_write', 'text'],{}, blocks ),
	areaBlocks: new OneType(['dataset_read', 'className', 'value'],{tag:'textarea'}, blocks ),
	inputBlocks: new OneType(['dataset_read', 'type', 'className'],{tag:'input'}, blocks ),
	spanBlocks: new OneType(['text','dataset_span'],{tag:'span'}, blocks ),	
	ligth: new ligth_builder(blocks),
	name_id_text: new ManyTypes([
	    {tags:['text'], set:{className:'name_feld'}},
	    {tags:['dataset_read', 'text'], set:{className:'feld'}}
	    ], blocks),	
	name_id_type: new ManyTypes([
	    {tags:['text'], set:{className:'name_feld'}},
	    {tags:['dataset_read', 'type', 'value'], set:{tag:"input", className:'feld'}}
	    ], blocks),	
	name_id_area: new ManyTypes([
	    {tags:['text'], set:{className:'name_feld'}},
	    {tags:['dataset_read', 'value'], set:{tag:"textarea", className:'feld'}}
	    ], blocks),
	name_id_list: new ManyTypes([
	    {tags:['text'], set:{className:'name_feld'}},
	    {tags:['dataset_read', 'list', 'value'], set:{tag:'select', className:'feld'}}
	    ], blocks),
	listReadValue_read_nameClick: new ManyTypes([
		{tags:['list', 'dataset_read', 'value'], set:{tag:'select', className:'feld'}},
		{tags:['dataset_read'], set:{tag:"input", className:'feld'}},
	    {tags:['text', 'dataset_click'], set:{className:'buttons'}}	    
	    ], blocks),
	name_idText(feld, parent){maker.addBlocks.prepare([maker.name_id_text.prepare(feld)], parent);},
	name_idType(feld, parent){maker.addBlocks.prepare([maker.name_id_type.prepare(feld)], parent);},
	name_idArea(feld, parent){maker.addBlocks.prepare([maker.name_id_area.prepare(feld)], parent);},
	name_idList(feld, parent){maker.addBlocks.prepare([maker.name_id_list.prepare(feld)], parent);},
	parentsgroup(){ //приводит активные блоки в соответствие с настройкой
		for (let i in blocks.parentsgroup){
			let mygroup=blocks.parentsgroup[i].querySelectorAll('div[data-click]');
			let on;
			for(let j=0; j<mygroup.length; j++){
				if(mygroup[j].dataset.click==blocks.parentsgroup[i].dataset.parentsgroup){
					mygroup[j].dataset.active=1;
					on=1; 
				}else{
					mygroup[j].dataset.active=0;
					on=0;
				}
				if(blocks.id[mygroup[j].dataset.group]){
				    blocks.id[mygroup[j].dataset.group].dataset.on=on;
				}
			}
		}		
	}, 
	multigroup(){
	    for (let i in blocks.multigroup){
	        let parent=blocks.multigroup[i];
    	    let mygroup=parent.querySelectorAll('div[data-item]');
    		for(let j=0; j<mygroup.length; j++){
    			if(mygroup[j].dataset.item==parent.dataset.item){
    				mygroup[j].dataset.on=1;
    			}else{
    				mygroup[j].dataset.on=0;
    			}
    		}
	    }
	},
	writeList(list, parentBlk, feld_id, feld_click){//ожидается [{},{},{}]
		parentBlk.innerHTML='';
	    let i=0;
		for(i=0; i<list.length; i++){
			let k=maker.ligth.make('', parentBlk);
			for(let j in list[i]){
				let blk=maker.ligth.make(list[i][j], k);
    			if(j==feld_id){
    			     k.dataset.list_id=list[i][j];
    			}
    			if(j==feld_click){
    			     blk.dataset.check=list[i][j];
    			}
			}
		}
		if(i>0){
		   i=i-1; 
		}
		return i;
	},
	buttonsBlocks(arr, name, styleClass, parentBlk){
		// массив, базовое имя, стиль кнопок и настроек,  родитель
		// arr - название кнопки, id блока, функция при нажатии на кнопку, класс стиля блока
		if(!parentBlk){
			parentBlk = document.createElement('div');
		}
		// блок кнопок name+'Buttons' : блок настроек  name+'Setting' : группа управления 'go'+name+'Set'],
		maker.one.prepare([[name+'Buttons', styleClass, '', 'go'+name+'Set'], [name+'Setting', styleClass]], parentBlk);
		for(let i=0; i<arr.length; i++ ){
			maker.one.prepare([[arr[i][1], arr[i][3]]], blocks.id[name+'Setting']);
			maker.click.prepare([[arr[i][2], arr[i][0], arr[i][1]]], blocks.id[name+'Buttons']);
		}

		return parentBlk;
	},
};

Date.prototype.format = function(format = 'yyyy-mm-dd hh:MM:ss') {
    const replaces = {
        yyyy: this.getFullYear(),
        mm: ('0'+(this.getMonth() + 1)).slice(-2),
        dd: ('0'+this.getDate()).slice(-2),
        hh: ('0'+this.getHours()).slice(-2),
        MM: ('0'+this.getMinutes()).slice(-2),
        ss: ('0'+this.getSeconds()).slice(-2)
    };
    let result = format;
    for(const replace in replaces){
        result = result.replace(replace,replaces[replace]);
    }
    return result;
	// вызов (new Date()).format()
	
};

let link_window_all=document.querySelector('body');
link_window_all.addEventListener('click', carcass_links.call_func);  
link_window_all.addEventListener("change", carcass_links.call_func_chng);

//let dd=new Date(+new Date()-(60*1000*new Date().getTimezoneOffset())).toISOString().slice(0, 10);//текущая дата в формате SQL
//let dd_tt=new Date(+new Date()-(60*1000*new Date().getTimezoneOffset())).toISOString().slice(0, 19).replace('T', ' ');//текущая дата и время в формате SQL

function carcass_start(){
	let arr=document.location.pathname.split("/");
	let domain=arr[1]+arr[2];
	if(domain == "undefined"){
	    domain='';
	}
	abonent.origin=document.location.origin;
	abonent.path='../'+domain+'/';
	abonent.domain=domain;
	abonent.domainAbonent=domain+'abonent';
	if(localStorage[abonent.domainAbonent]){
		abonent=JSON.parse(localStorage[abonent.domainAbonent]);
	}
	if(typeof start !== "undefined"){
		start();
	}
}

carcass_start();