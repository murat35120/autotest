let links={ //связываем действия пользователя с функциями, нестандартные варианты
    call_func (link){
		let name;
		name=link.dataset.read;
        if(typeof name !== "undefined"){ //функции по клику
			if(control[name]){
			    control[name](link);
			}
        }
		name=link.dataset.a;
        if(typeof name !== "undefined"){ //функции по клику
			 control.click_a(link);
        }
		if(link.parentNode){
			if(link.parentNode.parentNode){
				name=link.parentNode.parentNode.dataset.id;
				if(typeof name !== "undefined"){ //функции по клику
					if(control[name]){
						control[name](link);
					}
				}
			}
		}
    },
    
};

let protocol={
	user_in(){
		let obj={
			api:"user_in",
			passkey:blocks.read.password.value,
		};
		comm.ax_post( obj);
	},
	check_session(){
		let obj={
			api:"check_session",
			session:abonent.session,
		};
		comm.ax_post( obj);
	},
	open_door(blk){
		let name=blk.dataset.click.split('-');
		let dir=0;
		if(name[0]=='goOut'){
			dir=1;
		}
		//console.log(name);
		
		let obj={
			api:"open_door",
			session:abonent.session,
			id_controller:+name[1],
			dir:dir
		};
		comm.ax_post( obj);
	},
};


let control={
	goIn(){
	  //blocks.id.mainArea.innerHTML='';
	  protocol.user_in();
	  //make_bock.verifyList(blocks.id.mainArea);
	},
	groupBlock(){
	  functions.new_group(blocks.read.buildBlock, abonent.obj_buttons[blocks.read.groupBlock.value]);
	},
	buildBlock(){
	  functions.make_buttons(blocks.id.buttonsArea, abonent.obj_buttons[blocks.read.groupBlock.value][blocks.read.buildBlock.value]);
	},
	buttonsArea(blk){
	  protocol.open_door(blk);
	},
};

		
let functions={
	make_obj_buttons(arr){
		let obj={};
		for (let i=0; i<arr.length; i++){
			if('group_c' in arr[i]){
				obj[arr[i].group_c]={};
			}
		}
		for (let i=0; i<arr.length; i++){
			if('building_c' in arr[i]){
				obj[arr[i].group_c][arr[i].building_c]={};
			}
		}
		for (let i=0; i<arr.length; i++){
			if('door_c' in arr[i]){
				obj[arr[i].group_c][arr[i].building_c][arr[i].door_c]={id_controller:arr[i].id_controller};
			}
		}
		return obj;
	},
	new_group(block, arr){
		block.innerHTML='';
		let fr=0;
		let out='';
		for (let i in arr){
			if(fr==0){
				block.options.add(new Option(i, i, true, true));
				fr=1;
				out=i;
			}else{
				block.options.add(new Option(i, i));
			}
		}
		//return out;
	},
	make_buttons(block, arr){
		block.innerHTML='';
		for (let i in arr){
			make_bock.two_buttons(block, i, arr[i].id_controller);
		}
	}
};

let receivers={
	user_in(obj){
		if(obj.check){
			if(obj.check==1){
				blocks.id.mainArea.innerHTML='';
				abonent.session=obj.session;
				abonent.controllers_arr=obj.controllers_arr;
				carcass_functions.saveLS();
				make_bock.userList();
				abonent.obj_buttons=functions.make_obj_buttons(abonent.controllers_arr);
				functions.new_group(blocks.read.groupBlock, abonent.obj_buttons);
				functions.new_group(blocks.read.buildBlock, abonent.obj_buttons[blocks.read.groupBlock.value]);
				functions.make_buttons(blocks.id.buttonsArea, abonent.obj_buttons[blocks.read.groupBlock.value][blocks.read.buildBlock.value]);
			}else{
				//make_bock.verifyList(blocks.id.mainArea);
			}
		}
	},
    
};

let make_bock={
	headerSlogan(parentBlk){
		if(!parentBlk){
			parentBlk = document.createElement('div');
		}
		maker.one.prepare([['header', 'header', 'MQTT API'], ['slogan', 'slogan', 'Сервис дистанционного открытия замка'], ['notify', 'notify', 'Вход открыт!']], parentBlk);
		return parentBlk;
	},
	loginPass(parentBlk){
		if(!parentBlk){
			parentBlk = document.createElement('div');
		}
		maker.one.prepare([['loginPass', 'directionColumn'], ['buttons', 'directionColumn alignStretch']], parentBlk);
		//maker.addBlocks.prepare([maker.name_id_type.prepare(['Пароль', 'password']), maker.name_id_type.prepare(['Новый пароль', 'new_password'])], blocks.id.loginPass);
		//maker.click.prepare([["goIn", "Вход"], ["goSave", "Сохранить"], ["goNew", "Новый"]], blocks.id.buttons);
		maker.addBlocks.prepare([maker.name_id_type.prepare(['Пароль', 'password'])], blocks.id.loginPass);
		maker.click.prepare([["goIn", "Вход"]], blocks.id.buttons);
		//maker.click.prepare([["goIn", "Вход"], ["goSave", "Сохранить"], ["goNew", "Новый"]], blocks.id.buttons);
		return parentBlk;
	},
	userList(){
		let parentBlk=blocks.id.mainArea;
		if(!parentBlk){
			parentBlk = document.createElement('div');
		}
		let groupList=[
    		    ["Ягуар", 'jag'],
    		    ["ОТК", 'otk'],
    		    ["Ресурсы", 'res'],
		    ];
		let buildList=[
    		    ["Иркутская", 'irk'],
    		    ["Литовская", 'lit'],
    		    ["Бобруйская", 'bobr'],
		    ];	
		maker.selectBlocks.prepare([['groupBlock', groupList, 'big1'], ['buildBlock', buildList, 'big2']], parentBlk);
		return parentBlk;
	},
	two_buttons(parentBlk, door_name, door_id){
		if(!parentBlk){
			parentBlk = document.createElement('div');
		}
		maker.one.prepare([['door'+door_id, 'feld', door_name], ['buttons'+door_id, 'forTwo']], parentBlk);
		maker.click.prepare([["goIn-"+door_id, "Вход"], ["goOut-"+door_id, "Выход"]], blocks.id['buttons'+door_id]);

		
		return parentBlk;
	},

}

function carcass(){
	let screen=maker.ligth.make('', document.body,'screen','screen directionColumn alignCenter');
	maker.one.prepare([['blockHeader', 'directionColumn'], ['baner', 'directionColumn'], ['mainArea', 'directionColumn alignCenter'], ['buttonsArea', 'directionColumn alignCenter']], screen);
	make_bock.headerSlogan(blocks.id.blockHeader);
	// arr - название кнопки, id блока, функция при нажатии на кнопку, класс стиля блока
	make_bock.loginPass(blocks.id.mainArea);
	//make_bock.verifyList(blocks.id.editIn);

	maker.parentsgroup();
}

function start(){
    st=1; //признак готовности
	carcass();
	document.title='Autotest';
	if(abonent.session){
		blocks.id.mainArea.innerHTML='';
		carcass_functions.saveLS();
		make_bock.userList(blocks.id.mainArea);
		protocol.check_session();
		abonent.obj_buttons=functions.make_obj_buttons(abonent.controllers_arr);
		functions.new_group(blocks.read.groupBlock, abonent.obj_buttons);
		functions.new_group(blocks.read.buildBlock, abonent.obj_buttons[blocks.read.groupBlock.value]);
		functions.make_buttons(blocks.id.buttonsArea, abonent.obj_buttons[blocks.read.groupBlock.value][blocks.read.buildBlock.value]);
	}
	carcass_functions.show_name_read(); // только для отладки
}
let st=0;
if(typeof carcass_start !== "undefined"){
   if(!st){ 
        start();
   }
}