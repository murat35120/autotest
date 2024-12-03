let links={ //связываем действия пользователя с функциями, нестандартные варианты
    call_func (link){
		let name;
		name=link.parentNode.dataset.list_id;
        if(typeof name !== "undefined"){ //функции по клику
			let parent_name=link.parentNode.parentNode.dataset.id;
			let check_name=link.dataset.check;
			if(typeof parent_name !== "undefined"){ //функции по клику
				if(typeof check_name !== "undefined"){ //функции по клику
					if(control.check){
						control.check(link);
					}
				}
				if(control[parent_name]){
					control[parent_name](name, link);
					return;
				}
			}
        }
		let name_p=link.parentNode.parentNode.dataset.id;
        if(typeof name_p !== "undefined"){ //функции по клику
			if(control[name_p]){
			    control[name_p](name);
				return;
			}
        }
		name=link.dataset.read;
        if(typeof name !== "undefined"){ //функции по клику
			if(control[name]){
			    control[name](link);
				return;
			}
        }
		name=link.dataset.a;
        if(typeof name !== "undefined"){ //функции по клику
			 control.click_a(link);
			 return;
        }
    },
    
};

let protocol={
	
	editor(){
		let obj={
			api:"editor",
			login:blocks.read.login.value,
			password:blocks.read.password.value,
			passkey:blocks.read.passkey.value
		};
		comm.ax_post( obj);
	},
	new_session(){
		let obj={
			api:"new_session",
			a_id:abonent.a_id,
			session:abonent.session,
		};
		comm.ax_post( obj);
	},
	abonent_in(){
		let obj={
			api:"abonent_in",
			login:blocks.read.login.value,
			password:blocks.read.password.value,
		};
		comm.ax_post( obj);
	},
	new_password(){
		let obj={
			api:"new_password",
			login:blocks.read.login.value,
			password:blocks.read.password.value,
			new_password:blocks.read.new_password.value
		};
		comm.ax_post( obj);
	},
	new_stand(){
		let obj={
			api:"new_stand",
			a_id:abonent.a_id,
			session:abonent.session,
			std_description:blocks.read.makeDescription.value,
		};
		comm.ax_post( obj);
	},
	read_stand(){
		let obj={
			api:"read_stand",
			a_id:abonent.a_id,
			session:abonent.session,
			std_id:abonent.std_id
		};
		comm.ax_post( obj);
	},
	find_stand(){
		let obj={
			api:"find_stand",
			a_id:abonent.a_id,
			session:abonent.session,
			feld:blocks.read.findFeld.value,
			string:blocks.read.findString.value
		};
		comm.ax_post( obj);
	},
	write_stand(){
		let list=[];
		for(let i in controllers){
			list.push(controllers[i].sn);
		}
		let obj={
			api:"write_stand",
			a_id:abonent.a_id,
			session:abonent.session,
			std_id:blocks.read.makenumber.innerText,
			adapter_num:'',
			controllers_num:list.join(', '),
			device:blocks.read.device.value,
			pins: JSON.stringify(abonent.pins),
			std_description:blocks.read.makeDescription.value,
		};
		comm.ax_post( obj);
	},

	edit_owner(){
		let obj={
			api:"edit_owner",
			id_owner:abonent.id_owner,
			session:abonent.session,
			name_owner:blocks.read.name_owner.value,
			email:blocks.read.email.value,
			telegram:blocks.read.telegram.value,
		};
		comm.ax_post( obj);
	},	
	read_owner(){
		let obj={
			api:"read_owner",
			id_owner:abonent.id_owner,
			session:abonent.session,
		};
		comm.ax_post( obj);
	},	
	save_controller(){
		let obj={
			api:"save_controller",
			id_owner:abonent.id_owner,
			session:abonent.session,
			id_controller:blocks.read.controllerId.innerText,
			controller:blocks.read.controllerController.value,
			//auth_key:blocks.read.controllerAuth_key.value,
			group:blocks.read.controllerGroup.value,
			building:blocks.read.controllerBuilding.value,
			door:blocks.read.controllerDoor.value,
		};
		comm.ax_post( obj);
	},	
	dell_controller(){
		let obj={
			api:"dell_controller",
			id_owner:abonent.id_owner,
			session:abonent.session,
			id_controller:blocks.read.controllerId.innerText		
		};
		comm.ax_post( obj);
	},
	controllers_list(){
		let obj={
			api:"controllers_list",
			id_owner:abonent.id_owner,
			session:abonent.session,		
		};
		comm.ax_post( obj);
	},
	save_user(){
		let obj={
			api:"save_user",
			id_owner:abonent.id_owner,
			session:abonent.session,
			id_user:blocks.read.userId_user.innerText,
			card:blocks.read.userCard.value,
			name_user:blocks.read.userName_user.value,
			from:blocks.read.userFrom.value,
			to:blocks.read.userTo.value,
			unlocks:blocks.read.userUnlocks.value,
			id_list:abonent.controllerResult.str,
		};
		comm.ax_post( obj);
	},	
	dell_user(){
		let obj={
			api:"dell_user",
			id_owner:abonent.id_owner,
			session:abonent.session,
			id_user:blocks.read.userId_user.innerText,
		};
		comm.ax_post( obj);
	},	
	users_list(){
		let obj={
			api:"users_list",
			id_owner:abonent.id_owner,
			session:abonent.session,
		};
		comm.ax_post( obj);
	},
	open_door_e(topic='1437226964/ctrl/BT45001349/ext_card', card='112233445566', dir='0'){
		let obj={
			//id_owner:abonent.id_owner,
			//session:abonent.session,
			api:"open_door_e",
			topic:topic,
			card:card,
			dir:dir,
			direct:'1',
		};
		comm.ax_post( obj);
	},
	
};

let control={
    goIn(){
        protocol.abonent_in();
    },
    goOut(){
        carcass_functions.dellLS();
        abonent.id_owner='';
        abonent.login='';
        abonent.session='';
		abonent='';
        blocks.read.login.value='';
        blocks.read.password.value='';
		blocks.read.new_password.value='';
		carcass_functions.saveLS();

    },
    registration(){
        protocol.editor();
    },
    newPassword(){
        protocol.new_password();
    },
	makeNew(){
        protocol.new_stand();
    },	
	converter(){
		control_stand.recovery();
	},
	controllers(){
		control_stand.fnd();
		setTimeout(()=>{control_stand.fnd();}, 10*twa);
		setTimeout(()=>{control.source(blocks.read.source);}, 20*twa);
	},
	adapter(){
		carcass_functions.recovery();
	},
	findFind(){
        protocol.find_stand();
    },
	findResult(name,blk){
        functions.stands_off();
		blk.parentNode.dataset.active=1;
		abonent.std_id=+name;
		blocks.read.makenumber.innerText=+name;
		protocol.read_stand();
    },
	source(blk){
		if(blk.value==37){
			blocks.read.numberSource.innerHTML='';
			for (let i in controllers){
				if('sn' in controllers[i]){
					blocks.read.numberSource.append(new Option(controllers[i].sn,controllers[i].sn));
				}
			}
			blocks.read.pinSource.innerHTML='';
			for (let i=0; i<abonent.pinz5net.length; i++){
				blocks.read.pinSource.append(new Option(abonent.pinz5net[i][0],abonent.pinz5net[i][1]));
			}
		}else{
			blocks.read.pinSource.innerHTML='';
			for (let i=0; i<abonent.pinz2base.length; i++){
				blocks.read.pinSource.append(new Option(abonent.pinz2base[i][0],abonent.pinz2base[i][1]));
			}
		}
	},
	makeAdd(){
		if(!abonent.pins){
			abonent.pins=[];			
		}
		//let obj={};
		//carcass_functions.write_object(obj, carcass_functions.allInput(blocks.id.makeFelds));
		let obj=carcass_functions.allInput(blocks.id.makeFelds);
		abonent.pins.push(obj);
		abonent.position=abonent.pins.length-1;
		maker.writeList(abonent.pins, blocks.id.makeList, '', '', ["signalName", "numberSource", "pinSource" ]);
		protocol.write_stand();
    },
	makeSave(){
		//let obj={};
		//carcass_functions.write_object(obj, carcass_functions.allInput(blocks.id.makeFelds));
		let obj=carcass_functions.allInput(blocks.id.makeFelds);
		abonent.pins[abonent.position]=obj;
		maker.writeList(abonent.pins, blocks.id.makeList);
		protocol.write_stand();
    },
	makeDell(){
		abonent.pins.splice(abonent.position, 1);
		maker.writeList(abonent.pins, blocks.id.makeList);
		abonent.position=abonent.pins.length-1;
		protocol.write_stand();
    },
	makeList(num){
		abonent.position=num;
		//carcass_functions.write_alias(abonent.pins[num], carcass_functions.allInput(blocks.id.makeFelds));
		carcass_functions.write_alias(abonent.pins[num], blocks.read);
    },
	
	
	infoSave(){
        protocol.edit_owner();
    },
	controllerNew(blk){
		blocks.read.controllerId.innerText=0;
		blocks.id.controllerEditButtons.dataset.item='do';
		maker.multigroup();
		functions.allOn(blk.parentNode.parentNode);
	},
	controllerEdit(blk){
		blocks.id.controllerEditButtons.dataset.item='do';
		maker.multigroup();
		functions.allOn(blk.parentNode.parentNode);
	},
	controllerOut(blk){
		blocks.id.controllerEditButtons.dataset.item='on';
		maker.multigroup();
		functions.allOff(blk.parentNode.parentNode);
	},
	controllerSave(blk){
		blocks.id.controllerEditButtons.dataset.item='on';
		maker.multigroup();
		functions.allOff(blk.parentNode.parentNode);
		protocol.save_controller();
	},
	controllerFind(blk){
		let list=functions.findFeld(abonent.list_controller, blocks.read.controllerFeld.value, blocks.read.controllerString.value);
		maker.writeList(list, blocks.id.controllerResult, 'id_controller', 'check');
	},
	controllerResult(num){
		functions.make_list(blocks.id.controllerResult);
		let arr=abonent.list_controller;
		for(let i=0; i<arr.length; i++){
			if(arr[i].id_controller==num){
				blocks.read.controllerId.innerText=num;
				blocks.read.controllerController.value=arr[i].controller;
				//blocks.read.controllerAuth_key.value=arr[i].auth_key;
				blocks.read.controllerGroup.value=arr[i].group_c;
				blocks.read.controllerBuilding.value=arr[i].building_c;
				blocks.read.controllerDoor.value=arr[i].door_c;
				functions.write_links(num);
			}
		}
	},
	check(blk){
		if(blk.dataset.check=='+'){
			blk.dataset.check='';
			blk.innerText='';
		}else{
			blk.dataset.check='+';
			blk.innerText='+';
		}
	},
	controllerDell(blk){
		//blocks.id.controllerEditButtons.dataset.item='on';
		//maker.multigroup();
		//functions.allOff(blk.parentNode.parentNode);
		protocol.dell_controller();
	},
	userNew(blk){
		blocks.read.userId_user.innerText=0;
		blocks.id.userEditButtons.dataset.item='do';
		maker.multigroup();
		functions.allOn(blk.parentNode.parentNode);
		functions.make_list(blocks.id.controllerResult);
		blocks.read.userDoors.innerText=abonent.controllerResult.count;
	},	
	userEdit(blk){
		blocks.id.userEditButtons.dataset.item='do';
		maker.multigroup();
		functions.allOn(blk.parentNode.parentNode);
		functions.make_list(blocks.id.controllerResult);
		blocks.read.userDoors.innerText=abonent.controllerResult.count;
	},
	userOut(blk){
		blocks.id.userEditButtons.dataset.item='on';
		maker.multigroup();
		functions.allOff(blk.parentNode.parentNode);
	},
	userSave(blk){
		blocks.id.userEditButtons.dataset.item='on';
		maker.multigroup();
		functions.allOff(blk.parentNode.parentNode);
		functions.make_list(blocks.id.controllerResult);
		blocks.read.userDoors.innerText=abonent.controllerResult.count;
		protocol.save_user();
	},
	userDell(blk){
		protocol.dell_user();
	},
	userFind(blk){
		let list=functions.findFeld(abonent.list_user, blocks.read.userFeld.value, blocks.read.userString.value);
		maker.writeList(list, blocks.id.userResult, 'id_user', 'check');
	},
	userResult(num){
		let arr=abonent.list_user;
		for(let i=0; i<arr.length; i++){
			if(arr[i].id_user==num){
				blocks.read.userId_user.innerText=num;
				blocks.read.userCard.value=arr[i].card;
				blocks.read.userName_user.value=arr[i].name_user;
				blocks.read.userFrom.value=arr[i].from_u;
				blocks.read.userTo.value=arr[i].to_u;
				blocks.read.userUnlocks.value=arr[i].unlocks;
				blocks.read.userPasskey.innerText=arr[i].passkey;
				if(arr[i].link){
					let list=arr[i].link.split(' ');
					blocks.read.userDoors.innerText=list.length-1;
					functions.controller_select(list);
				}else{
					blocks.read.userDoors.innerText=0;
					functions.controller_select([]);
				}
			}
		}
	},
};

let functions={
    findFeld(obj, feld, str){
        let list=[];
        for(let i=0; i<obj.length; i++ ){
			let nfeld=String(obj[i][feld]);
			if(nfeld.includes(str)){
				list.push(obj[i]);
			}
        }
        return list;
    },
    allOff(parent){
        let arr=parent.querySelectorAll('input[data-read]');
        for (let i=0; i<arr.length; i++){
            arr[i].setAttribute('readonly', 'yes');
        }
        arr=parent.querySelectorAll('select[data-read]');
        for (let i=0; i<arr.length; i++){
            arr[i].setAttribute('readonly', 'yes');
        }
        arr=parent.querySelectorAll('textarea[data-read]');
        for (let i=0; i<arr.length; i++){
            arr[i].setAttribute('readonly', 'yes');
        }
    },
    allOn(parent){
        let arr=parent.querySelectorAll('input[data-read]');
        for (let i=0; i<arr.length; i++){
            arr[i].removeAttribute('readonly');
        }
        arr=parent.querySelectorAll('select[data-read]');
        for (let i=0; i<arr.length; i++){
            arr[i].removeAttribute('readonly');
        }
        arr=parent.querySelectorAll('textarea[data-read]');
        for (let i=0; i<arr.length; i++){
            arr[i].removeAttribute('readonly');
        }
    },
	add_check(arr){
		for(let i=0; i<arr.length; i++){
			arr[i].check='';
		}
	},
	make_list(obj){
		let asd=[];
		let arr=obj.querySelectorAll('div[data-check="+"]');
        for (let i=0; i<arr.length; i++){
            asd[i]=arr[i].parentNode.dataset.list_id;
        }
		abonent[obj.dataset.id]={};
		abonent[obj.dataset.id].count=asd.length;
		abonent[obj.dataset.id].str=asd.join(", ");
	},
	write_links(id){
		let arr=abonent.list_controller;
		for(let i=0; i<arr.length; i++){
			if(arr[i].id_controller==id){
				blocks.read.controllerBroker.innerText="mqtt://"+arr[i].mqtt_user+":"+arr[i].pass+"@mqtt.ironlogic.ru";
				blocks.read.controllerTopic.innerText=arr[i].mqtt_user+"/ctrl/BT"+arr[i].controller+"/ext_card";
			}
		}
	},
	controller_select(arr){
		let list=abonent.list_controller;
		for(let i=0; i<list.length; i++){
			if(arr.includes(String(list[i].id_controller))){
				list[i].check="+";
			}else{
				list[i].check="";
			}
		}
		maker.writeList(list, blocks.id.controllerResult, 'id_controller', 'check');
	},
	stands_off(){
		let list=blocks.id.findResult.children;
		for(let i=0; i<list.length; i++){
			list[i].dataset.active=0;
		}
	},
};

let receivers={
    editor(obj){
		if(obj.check){
			if(obj.check==1){
				abonent.a_id=obj.a_id;
				abonent.session=obj.session;
				carcass_functions.saveLS();
				blocks.id.mainButtons.dataset.parentsgroup=abonent.start_block;
				maker.parentsgroup();
				blocks.read.password.value='';
				blocks.read.passkey.value='';
			}else{
				if('login' in obj.check){
					blocks.read.login.value='';
				}
			}
		}	
    },
	new_session(obj){
		if(obj.check){
			if(obj.check==1){
				if(obj.session){
					abonent.a_id=obj.a_id;
					abonent.name=obj.name;
					abonent.session=obj.session;
				}
				carcass_functions.saveLS();
				if(abonent.name){
					//abonent.start_block='goChoose';
				}
				blocks.id.mainButtons.dataset.parentsgroup=abonent.start_block;
				maker.parentsgroup();
				blocks.read.password.value='';
			}else{
				blocks.parentsgroup.gomainSet.dataset.parentsgroup='goLogin';
				maker.parentsgroup();
			}
		}
    },
    abonent_in(obj){
		if(obj.check){
			if(obj.check==1){
				abonent.a_id=obj.a_id;
				abonent.name=obj.name;
				abonent.session=obj.session;
				//blocks.read.name_owner.value=obj.name;
				carcass_functions.saveLS();
				abonent.start_block='goChoose';
				blocks.id.mainButtons.dataset.parentsgroup=abonent.start_block;
				maker.parentsgroup();
				blocks.read.password.value='';
				//abonent.list_controller=obj.list_controller;
				//functions.add_check(abonent.list_controller);
				//abonent.list_user=obj.list_user;
			}else{
				if('login' in obj.check){
					blocks.read.login.value='';
				}else{
					blocks.read.passkey.value='';
				}
			}
		}
    },
    new_password(obj){
		if(obj.check){
			if(obj.check==1){
				abonent.std_id=obj.std_id;
				abonent.name=obj.name;
				abonent.session=obj.session;
				carcass_functions.saveLS();
				blocks.id.mainButtons.dataset.parentsgroup=abonent.start_block;
				maker.parentsgroup();
				blocks.read.password.value='';
				//abonent.list_controller=obj.list_controller;
				//functions.add_check(abonent.list_controller);
				//abonent.list_user=obj.list_user;
			}else{
				if('login' in obj.check){
					blocks.read.login.value='';
				}else{
					blocks.read.passkey.value='';
				}
			}
		}	
    },
	new_stand(obj){
		if(obj.check){
			if(obj.check==1){
				abonent.std_id=obj.std_id;
				blocks.read.makenumber.innerText=obj.std_id;
				abonent.pins=[];
				maker.writeList(abonent.pins, blocks.id.makeList, '', '', ["signalName", "numberSource", "pinSource" ]);
			}else{

			}
		}	
    },
	read_stand(obj){
		if(obj.check){
			if(obj.check==1){
				//abonent.std_id=obj.std_id;
				//blocks.read.findnumber.innerText=obj.std_id;
				// тут нужен переход на другую вкладку и заполнение полей
				if(!obj.err){
					//blocks.id.standButtons.dataset.parentsgroup="goMake";
					//maker.parentsgroup();
					blocks.read.makenumber.innerText=obj.stand.std_id;
					blocks.read.makeDescription.value=obj.stand.std_description;
					blocks.read.device.value=obj.stand.device;
					abonent.pins=obj.stand.pins;
					abonent.adapter_num=obj.stand.adapter_num;
					abonent.author=obj.stand.author;
					abonent.controllers_num=obj.stand.controllers_num;
					abonent.device=obj.stand.device;
					maker.writeList(abonent.pins, blocks.id.makeList, '', '', ["signalName", "numberSource", "pinSource" ]);
				}
			}else{

			}
		}	
    },
	find_stand(obj){
		maker.writeList(obj.list, blocks.id.findResult, "std_id", '', ["std_id", "std_description", "author" ] ); //(list, parentBlk, feld_id, feld_click){//ожидается [{},{},{}]
		
	},

	
	edit_owner(obj){
        if(obj.check==1){
			abonent.name_owner=obj.name_owner;
			abonent.email=obj.email;
			abonent.telegram=obj.telegram;
			carcass_functions.saveLS();
			if(abonent.name_owner){
				abonent.start_block='goControllers';
			}
			blocks.id.mainButtons.dataset.parentsgroup=abonent.start_block;
			maker.parentsgroup();
        }else{

        }
    },
	save_controller(obj){
        if(obj.check==1){
			blocks.read.controllerId.innerText=obj.id_controller;
			abonent.list_controller=obj.list;
			functions.add_check(abonent.list_controller);
			functions.write_links(obj.id_controller);
			carcass_functions.saveLS();
			maker.writeList(abonent.list_controller, blocks.id.controllerResult, 'id_controller', 'check');
        }else{

		}
	},
	dell_controller(obj){
        if(obj.check==1){
			abonent.list_controller=obj.list;
			functions.add_check(abonent.list_controller);
			carcass_functions.saveLS();
			maker.writeList(abonent.list_controller, blocks.id.controllerResult, 'id_controller', 'check');
			blocks.read.controllerId.innerText='';
			blocks.read.controllerController.value='';
			blocks.read.controllerAuth_key.value='';
			blocks.read.controllerGroup.value='';
			blocks.read.controllerBuilding.value='';
			blocks.read.controllerDoor.value='';
        }else{

		}
	},
	read_owner(obj){
        if(check==1){
			abonent.name_owner=obj.name_owner;
			abonent.email=obj.email;
			abonent.telegram=obj.telegram;
			blocks.read.name_owner.value=obj.name_owner;
			blocks.read.email.value=obj.email;
			blocks.read.telegram.value=obj.telegram;
			carcass_functions.saveLS();
        }else{

        }
    },	
	controllers_list(obj){
        if(obj.check==1){
			abonent.list_controller=obj.list;
			functions.add_check(abonent.list_controller);
			functions.make_links(abonent.list_controller);
			maker.writeList(abonent.list_controller, blocks.id.controllerResult, 'id_controller', 'check');
        }else{

		}
    },
	save_user(obj){
        if(obj.check==1){
			blocks.read.userId_user.innerText=obj.id_user;
			//abonent.list_user=obj.list;
			//functions.add_check(abonent.list_user);
			carcass_functions.saveLS();
			//maker.writeList(abonent.list_user, blocks.id.userResult, 'id_user', 'check');
        }else{

		}
    },	
	dell_user(obj){
        if(obj.check==1){
			blocks.read.userId_user.innerText=obj.id_user;
			abonent.list_user=obj.list;
			//functions.add_check(abonent.list_user);
			carcass_functions.saveLS();
			maker.writeList(abonent.list_user, blocks.id.userResult, 'id_user', 'check');
        }else{

        }
    },




	users_list(obj){
        if(check==1){
			abonent.users_list=obj.users_list;
			carcass_functions.saveLS();
			//function show of users_list
        }else{

        }
    },
	
};

let make_bock={
	headerSlogan(parentBlk){
		if(!parentBlk){
			parentBlk = document.createElement('div');
		}
		maker.one.prepare([['header', 'header', 'Autotest Редактор'], ['slogan', 'slogan', 'Сервис автоматической проверки на функционирование'] ], parentBlk);
		return parentBlk;
	},
	loginPass(parentBlk){
		let my_name='login';
		if(!parentBlk){
			parentBlk = document.createElement('div');
		}
		maker.one.prepare([[my_name+'Main', 'directionColumn'], [my_name+'Buttons', 'directionColumn']], parentBlk);
		maker.name_idType(['Логин', 'login'], blocks.id[my_name+'Main']);
		maker.name_idType(['Пароль', 'password'],blocks.id[my_name+'Main']);
		maker.name_idType(['Новый пароль', 'new_password'],blocks.id[my_name+'Main']);
		maker.name_idType(['Код', 'passkey'],blocks.id[my_name+'Main']);		
		maker.clickItem.prepare([["goIn", "Вход"], ["goOut", "Выход"], ["registration", "Регистрирация"], ["newPassword", "Новый пароль"]], blocks.id[my_name+'Buttons']);
		return parentBlk;
	},
	chooseList(parentBlk){
		let my_name='choose';
	    maker.one.prepare([[my_name+'FindWindow', "directionColumn"],[my_name+'ButtonsWindow', "directionColumn"]], parentBlk);
	    maker.one.prepare([[my_name+'Buttons', "wrap justifyCenter"], [my_name+'Result', 'directionColumn justifyCenter']], blocks.id[my_name+'FindWindow']);
	    findWindow(blocks.id[my_name+'Buttons'], my_name);
		buttonsWindow(blocks.id[my_name+'ButtonsWindow'], my_name);
		function buttonsWindow (parentBlk, my_name){
			maker.clickItem.prepare([[my_name+'make', "Создать", 'on']], parentBlk);
			maker.clickItem.prepare([[my_name+'Edit', "Редактировать", 'on']], parentBlk);
			maker.clickItem.prepare([[my_name+'Copy', "Дублировать", 'on']], parentBlk);
			maker.clickItem.prepare([[my_name+'Dell', "Удалить", 'on']], parentBlk);
		}
	    function findWindow (parentBlk, my_name){
    		if(!parentBlk){
    			parentBlk = document.createElement('div');
    		}
    		let list=[
				['ID', 'id_controller'],
    			['номер', 'сontroller'],
    			['Группа', 'group_c'],
    			['Здание', 'building_c'],
    			['Дверь', 'door_c'],
    		];
    		maker.listReadValue_read_nameClick.prepare([[list, my_name+'Feld', 'id_controller'], my_name+'String'], parentBlk);
    		blocks.read[my_name+'String'].placeholder="Строка поиска";
			maker.clickItem.prepare([[my_name+'Find', "Искать", 'on']], parentBlk);
	    }
	},
	findStand(parentBlk){
		let my_name='find';
		//maker.one.prepare([[my_name+'Header','directionColumn'], [my_name+'Main', 'justifyCenter']], parentBlk);
		//maker.name_idText(['Номер',[my_name+'number', 1]], blocks.id[my_name+'Header']);
		//maker.name_idArea(['Описание',[my_name+'Description', "Описание"]], blocks.id[my_name+'Header']);
		maker.one.prepare([[my_name+'header', ""],[my_name+'Bottom', ""]], parentBlk);
	    maker.one.prepare([[my_name+'FindWindow', "directionColumn"],[my_name+'ButtonsWindow', "directionColumn"]], blocks.id[my_name+'Bottom']);
	    maker.one.prepare([[my_name+'Buttons', "wrap justifyCenter"], [my_name+'Result', 'directionColumn']], blocks.id[my_name+'FindWindow']);
	    findWindow(blocks.id[my_name+'Buttons'], my_name);
		buttonsWindow(blocks.id[my_name+'ButtonsWindow'], my_name);
		function buttonsWindow (parentBlk, my_name){
			//maker.clickItem.prepare([[my_name+'Make', "Создать", 'on']], parentBlk);
			//maker.clickItem.prepare([[my_name+'Edit', "Редактировать", 'on']], parentBlk);
			maker.clickItem.prepare([[my_name+'Copy', "Дублировать", 'on']], parentBlk);
			maker.clickItem.prepare([[my_name+'Dell', "Удалить", 'on']], parentBlk);
		}
	    function findWindow (parentBlk, my_name){
    		if(!parentBlk){
    			parentBlk = document.createElement('div');
    		}
    		let list=[
				['ID', 'std_id'],
    			['Автор', 'author'],
    			['Описание', 'std_description'],
    		];
    		maker.listReadValue_read_nameClick.prepare([[list, my_name+'Feld', 'std_id'], my_name+'String'], parentBlk);
    		blocks.read[my_name+'String'].placeholder="Строка поиска";
			maker.clickItem.prepare([[my_name+'Find', "Искать", 'on']], parentBlk);
	    }
	},
	makeStand(parentBlk){
		let my_name='make';
		maker.one.prepare([[my_name+'Header','directionColumn'], [my_name+'Main', 'justifyCenter wrap']], parentBlk);
		maker.one.prepare([[my_name+'List','directionColumn'], [my_name+'Felds','directionColumn'], [my_name+'Buttons','directionColumn']], blocks.id[my_name+'Main']);
		maker.name_idText(['Номер',[my_name+'number', 1]], blocks.id[my_name+'Header'], 'for_button');
		maker.name_idArea(['Описание',[my_name+'Description', "Описание стенда"]], blocks.id[my_name+'Header']);
		//maker.one.prepare([maker.clickItem.prepare([[my_name+'New', "Новый стенд"]])], blocks.id[my_name+'Header']);
		maker.clickItem.prepare([[my_name+'New', "Новый стенд"]], blocks.block.for_button);
		maker.name_idList(['Проверяем',['device', abonent.deviceList]], blocks.id[my_name+'Header']);

		//maker.name_idText(['Соединение',['position', "0"]], blocks.id[my_name+'Felds']);
		maker.name_idArea(['Сигнал',['signalName', "Тестовое воздействие"]], blocks.id[my_name+'Felds']);
		maker.name_idList(['Источник', ['source', abonent.sourceList]],blocks.id[my_name+'Felds']);
		maker.name_idList(['Зав. номер', ['numberSource', abonent.sourceNum]],blocks.id[my_name+'Felds']);
		maker.name_idList(['Контакт', ['pinSource', abonent.pinz5net]],blocks.id[my_name+'Felds']);
		let list=[
			["Да",1],
			["Нет",0]
		];
		maker.name_idList(['Инверсия', ['inversion', list]],blocks.id[my_name+'Felds']);

		//maker.name_idList(['Проверяем',['device', abonent.deviceList]], blocks.id[my_name+'Felds']);
		
		maker.name_idList(['Подключаем к', ['pinDevice', abonent.devicePin]],blocks.id[my_name+'Felds'])
		maker.clickItem.prepare([[my_name+'Add', "Создать"], [my_name+'Save', "Изменить"], [my_name+'Dell', "Удалить"]], blocks.id[my_name+'Buttons']);		
	},
	devices(parentBlk){
		let my_name='devices';
		maker.one.prepare([[my_name+'Felds','directionColumn'], [my_name+'Buttons','directionColumn']],parentBlk);
		maker.one.prepare([[my_name+'Converter','directionColumn'], [my_name+'Adapter','directionColumn'], [my_name+'Controllers','directionColumn']], blocks.id[my_name+'Felds']);
		maker.clickItem.prepare([['adapter', "Адаптер"], ['converter', "Конвертер"], ['controllers', "Контроллеры"]], blocks.id[my_name+'Buttons']);
		nex_name='adapter';
		maker.name_idText(['Модель',[my_name+nex_name+'model']], blocks.id[my_name+'Adapter']);
		maker.name_idText(['Версия',[my_name+nex_name+'version']], blocks.id[my_name+'Adapter']);
		maker.name_idText(['Номер',[my_name+nex_name+'number']], blocks.id[my_name+'Adapter']);
		
	},
	edit(parentBlk){
		let my_name='edit';
		maker.one.prepare([[my_name+'Header','directionColumn'], [my_name+'Main', 'justifyCenter wrap']], parentBlk);
		maker.one.prepare([[my_name+'List','directionColumn'], [my_name+'Felds','directionColumn'], [my_name+'Buttons','directionColumn']], blocks.id[my_name+'Main']);
		maker.name_idText(['Номер',[my_name+'number', 1]], blocks.id[my_name+'Header'], 'for_button');
		maker.name_idArea(['Описание',[my_name+'Description', "Описание стенда"]], blocks.id[my_name+'Header']);
		//maker.one.prepare([maker.clickItem.prepare([[my_name+'New', "Новый стенд"]])], blocks.id[my_name+'Header']);
		maker.clickItem.prepare([[my_name+'New', "Новый стенд"]], blocks.block.for_button);
		maker.name_idList(['Проверяем',['device', abonent.deviceList]], blocks.id[my_name+'Header']);

		//maker.name_idText(['Соединение',['position', "0"]], blocks.id[my_name+'Felds']);
		maker.name_idArea(['Сигнал',['signalName', "Тестовое воздействие"]], blocks.id[my_name+'Felds']);
		maker.name_idList(['Источник', ['source', abonent.sourceList]],blocks.id[my_name+'Felds']);
		maker.name_idList(['Зав. номер', ['numberSource', abonent.sourceNum]],blocks.id[my_name+'Felds']);
		maker.name_idList(['Контакт', ['pinSource', abonent.pinz5net]],blocks.id[my_name+'Felds']);
		let list=[
			["Да",1],
			["Нет",0]
		];
		maker.name_idList(['Инверсия', ['inversion', list]],blocks.id[my_name+'Felds']);

		//maker.name_idList(['Проверяем',['device', abonent.deviceList]], blocks.id[my_name+'Felds']);
		
		maker.name_idList(['Подключаем к', ['pinDevice', abonent.devicePin]],blocks.id[my_name+'Felds'])
		maker.clickItem.prepare([[my_name+'Add', "Создать"], [my_name+'Save', "Изменить"], [my_name+'Dell', "Удалить"]], blocks.id[my_name+'Buttons']);		
	},
	doing(parentBlk){
		let my_name='doing';
		maker.one.prepare([[my_name+'Header','directionColumn'], [my_name+'Main', 'justifyCenter wrap']], parentBlk);
		maker.one.prepare([[my_name+'List','directionColumn'], [my_name+'Felds','directionColumn'], [my_name+'Buttons','directionColumn']], blocks.id[my_name+'Main']);
		maker.name_idText(['Номер',[my_name+'number', 1]], blocks.id[my_name+'Header'], 'for_button');
		maker.name_idArea(['Описание',[my_name+'Description', "Описание стенда"]], blocks.id[my_name+'Header']);
		//maker.one.prepare([maker.clickItem.prepare([[my_name+'New', "Новый стенд"]])], blocks.id[my_name+'Header']);
		maker.clickItem.prepare([[my_name+'New', "Новый стенд"]], blocks.block.for_button);
		maker.name_idList(['Проверяем',['device', abonent.deviceList]], blocks.id[my_name+'Header']);

		//maker.name_idText(['Соединение',['position', "0"]], blocks.id[my_name+'Felds']);
		maker.name_idArea(['Сигнал',['signalName', "Тестовое воздействие"]], blocks.id[my_name+'Felds']);
		maker.name_idList(['Источник', ['source', abonent.sourceList]],blocks.id[my_name+'Felds']);
		maker.name_idList(['Зав. номер', ['numberSource', abonent.sourceNum]],blocks.id[my_name+'Felds']);
		maker.name_idList(['Контакт', ['pinSource', abonent.pinz5net]],blocks.id[my_name+'Felds']);
		let list=[
			["Да",1],
			["Нет",0]
		];
		maker.name_idList(['Инверсия', ['inversion', list]],blocks.id[my_name+'Felds']);

		//maker.name_idList(['Проверяем',['device', abonent.deviceList]], blocks.id[my_name+'Felds']);
		
		maker.name_idList(['Подключаем к', ['pinDevice', abonent.devicePin]],blocks.id[my_name+'Felds'])
		maker.clickItem.prepare([[my_name+'Add', "Создать"], [my_name+'Save', "Изменить"], [my_name+'Dell', "Удалить"]], blocks.id[my_name+'Buttons']);		
	},
}

function carcass(){
	let screen=maker.ligth.make('', document.body,'screen','screen directionColumn alignCenter');
	maker.one.prepare([['blockHeader', 'directionColumn'], ['baner', 'directionColumn'], ['mainArea', 'directionColumn']], screen);
	make_bock.headerSlogan(blocks.id.blockHeader);
	// arr - название кнопки, id блока, функция при нажатии на кнопку, класс стиля блока
	let arr_arss=[
		['Авторизация', 'blockIn', 'goLogin'],
		['Проверка', 'checkIn', 'goCheck','wrap justifyCenter directionColumn'],
		['Стенд', 'standIn', 'goStand','wrap directionColumn'],		
	];
	maker.buttonsBlocks(arr_arss, 'main', 'justifyCenter', blocks.id.mainArea);
	arr_arss=[
		['Выбрать', 'chooseIn', 'goChoose','wrap justifyCenter'],
		['Редактировать', 'editIn', 'goEdit'],
		['Выполнить', 'doIn', 'goDo'],
	];
	maker.buttonsBlocks(arr_arss, 'check', 'justifyCenter', blocks.id.checkIn);
	arr_arss=[
		['Оборудование', 'devicesIn', 'goDevices','wrap'],
		['Выбрать', 'findIn', 'goFind','wrap directionColumn'],
		['Редактировать', 'makeIn', 'goMake','wrap directionColumn'],
	];
	maker.buttonsBlocks(arr_arss, 'stand', 'justifyCenter', blocks.id.standIn);
	make_bock.findStand(blocks.id.findIn);
	make_bock.loginPass(blocks.id.blockIn);
	make_bock.chooseList(blocks.id.chooseIn);
	make_bock.makeStand(blocks.id.makeIn);
	make_bock.devices(blocks.id.devicesIn);
	make_bock.edit(blocks.id.editIn);
	make_bock.doing(blocks.id.doIn);
}

function start(){
    st=1; //признак готовности
	abonent.deviceList=[
		["Z-5R", 'z5r'],
		["Z-5R Net Extended", 'z5rExt'],
		["Z-5R Wiegand", 'z5r_wigand'],
	];
	abonent.devicePin=[
		["ZUMM", 'zumm'],
		["EXIT", 'exit'],
		["LED", 'led'],
		["LOCK", 'lock'],
		["DOOR", 'door'],
	];
	abonent.sourceList=[
		['Z-5R Net', 37],
		['Z-2 Base', 38],
	];
	abonent.pinz5net=[
		["ZUMM", 'zumm'],
		["EXIT", 'exit'],
		["LED", 'led'],
		["LOCK", 'lock'],
		["DOOR", 'door'],
	];
	abonent.pinz2base=[
		["D0", 'd0'],
		["D1", 'exit'],
		["LED G", 'ledg'],
		["LED R", 'ledr'],
		["BEEP", 'beep'],
		["POWER", 'power'],
	];
	abonent.sourceNum=[
		["1234", "1234"],
		["5678", "5678"],
	];
	carcass();
	document.title='Autotest Редактор';
	protocol.new_session();
	carcass_functions.show_name_read(); // только для отладки
	if(abonent.session){
		abonent.start_block='goChoose';
	}else{
		abonent.start_block='goLogin';
	}
	blocks.id.mainButtons.dataset.parentsgroup=abonent.start_block;
	maker.parentsgroup();
}
let st=0;
if(typeof carcass_start !== "undefined"){
   if(!st){ 
        start();
   }
}