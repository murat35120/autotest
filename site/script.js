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
					control[parent_name](name);
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
	dell_base(){
		let obj={
			api:"delete_base",
		};
		comm.ax_post( obj);
	},
	
	
	owner(){
		let obj={
			api:"owner",
			login:blocks.read.login.value,
			password:blocks.read.password.value
		};
		comm.ax_post( obj);
	},
	owner_in(){
		let obj={
			api:"owner_in",
			login:blocks.read.login.value,
			password:blocks.read.password.value
		};
		comm.ax_post( obj);
	},
	new_owner_password(){
		let obj={
			api:"new_owner_password",
			login:blocks.read.login.value,
			password:blocks.read.password.value,
			new_password:blocks.read.new_password.value
		};
		comm.ax_post( obj);
	},
	new_session(){
		let obj={
			api:"new_session",
			id_owner:abonent.id_owner,
			session:abonent.session,
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
	dell_base(){
		protocol.dell_base();
	},
    goIn(){
        protocol.owner_in();
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
        protocol.owner();
    },
    newPassword(){
        protocol.new_owner_password();
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
};

let receivers={
    owner(obj){
		if(obj.check){
			if(obj.check==1){
				abonent.id_owner=obj.id_owner;
				abonent.session=obj.session;
				carcass_functions.saveLS();
				blocks.id.mainButtons.dataset.parentsgroup=abonent.start_block;
				maker.parentsgroup();
				blocks.read.password.value='';
			}else{
				if('login' in obj.check){
					blocks.read.login.value='';
				}
			}
		}	
    },
    owner_in(obj){
		if(obj.check){
			if(obj.check==1){
				abonent.id_owner=obj.id_owner;
				abonent.name_owner=obj.name_owner;
				abonent.session=obj.session;
				abonent.email=obj.email;
				abonent.telegram=obj.telegram;
				blocks.read.email.value=obj.email;
				blocks.read.telegram.value=obj.telegram;
				blocks.read.name_owner.value=obj.name_owner;
				carcass_functions.saveLS();
				if(abonent.name_owner){
					abonent.start_block='goControllers';
				}else{
					abonent.start_block='goInfo';
				}
				blocks.id.mainButtons.dataset.parentsgroup=abonent.start_block;
				maker.parentsgroup();
				blocks.read.password.value='';
				abonent.list_controller=obj.list_controller;
				functions.add_check(abonent.list_controller);
				abonent.list_user=obj.list_user;
			}else{
				if('login' in obj.check){
					blocks.read.login.value='';
				}else{
					blocks.read.passkey.value='';
				}
			}
		}
    },
    new_owner_password(obj){
		if(obj.check){
			if(obj.check==1){
				abonent.id_owner=obj.id_owner;
				abonent.name_owner=obj.name_owner;
				abonent.session=obj.session;
				carcass_functions.saveLS();
				blocks.id.mainButtons.dataset.parentsgroup=abonent.start_block;
				maker.parentsgroup();
				blocks.read.password.value='';
				abonent.list_controller=obj.list_controller;
				functions.add_check(abonent.list_controller);
				abonent.list_user=obj.list_user;
			}else{
				if('login' in obj.check){
					blocks.read.login.value='';
				}else{
					blocks.read.passkey.value='';
				}
			}
		}	
    },	
	new_session(obj){
		if(obj.check){
			if(obj.check==1){
				if(obj.session){
					abonent.id_owner=obj.id_owner;
					abonent.name_owner=obj.name_owner;
					abonent.session=obj.session;
					abonent.email=obj.email;
					abonent.telegram=obj.telegram;
					blocks.read.email.value=obj.email;
					blocks.read.telegram.value=obj.telegram;
					blocks.read.name_owner.value=obj.name_owner;
				}
				carcass_functions.saveLS();
				if(abonent.name_owner){
					abonent.start_block='goControllers';
				}
				blocks.id.mainButtons.dataset.parentsgroup=abonent.start_block;
				maker.parentsgroup();
				blocks.read.password.value='';
				abonent.list_controller=obj.list_controller;
				functions.add_check(abonent.list_controller);
				abonent.list_user=obj.list_user;
			}else{
				blocks.parentsgroup.gomainSet.dataset.parentsgroup='goLogin';
				maker.parentsgroup();
			}
		}
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
			abonent.list_user=obj.list;
			//functions.add_check(abonent.list_user);
			carcass_functions.saveLS();
			maker.writeList(abonent.list_user, blocks.id.userResult, 'id_user', 'check');
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
		maker.one.prepare([['header', 'header', 'Autotest Гость'], ['slogan', 'slogan', 'Сервис автоматической проверки на функционирование'] ], parentBlk);
		return parentBlk;
	},
	loginPass(parentBlk){
		let my_name='login';
		if(!parentBlk){
			parentBlk = document.createElement('div');
		}
		maker.one.prepare([[my_name+'Main', 'directionColumn'], [my_name+'Buttons', 'directionColumn']], parentBlk);
		maker.addBlocks.prepare([[maker.name_id_type.prepare(['Логин', 'login'])]], blocks.id[my_name+'Main']);
		maker.addBlocks.prepare([[maker.name_id_type.prepare(['Пароль', 'password'])]],blocks.id[my_name+'Main']);
		maker.addBlocks.prepare([[maker.name_id_type.prepare(['Новый пароль', 'new_password'])]],blocks.id[my_name+'Main']);
		maker.clickItem.prepare([["goIn", "Вход"], ["goOut", "Выход"], ["registration", "Регистрирация"], ["newPassword", "Новый пароль"], ["dell_base", "Удалить Базу"]], blocks.id[my_name+'Buttons']);
		return parentBlk;
	},
	ownerInfo(parentBlk){
		let my_name='info';
		if(!parentBlk){
			parentBlk = document.createElement('div');
		}
		maker.one.prepare([[my_name+'Main', 'directionColumn'], [my_name+'Buttons', 'directionColumn']], parentBlk);
		maker.addBlocks.prepare([[maker.name_id_type.prepare(['Имя', 'name_owner'])]],blocks.id[my_name+'Main']);
		maker.addBlocks.prepare([[maker.name_id_type.prepare(['Email', 'email'])]],blocks.id[my_name+'Main']);
		maker.addBlocks.prepare([[maker.name_id_type.prepare(['Telegram', 'telegram'])]],blocks.id[my_name+'Main']);
		
		maker.clickItem.prepare([[my_name+"Save", "Сохранить"]], blocks.id[my_name+'Buttons']);
		return parentBlk;
	},
	controllersList(parentBlk){
		let my_name='controller';
	    maker.one.prepare([[my_name+'FindWindow', "directionColumn"], [my_name+'EditWindow', 'justifyCenter']], parentBlk);
	    maker.one.prepare([[my_name+'Buttons', "wrap justifyCenter"], [my_name+'Result', 'directionColumn justifyCenter']], blocks.id[my_name+'FindWindow']);
	    findWindow(blocks.id[my_name+'Buttons'], my_name);
	    
	    maker.multi.prepare([[my_name+'EditFeld', "directionColumn justifyCenter"], [my_name+'EditButtons', 'directionColumn','', my_name]], blocks.id[my_name+'EditWindow']);

	    blocks.id[my_name+'EditButtons'].dataset.item='on';
	    maker.clickItem.prepare([[my_name+'Save', "Сохранить", 'do'], [my_name+'Out', "Отменить", 'do'], [my_name+'New', "Создать", 'on'], [my_name+'Edit', "Изменить", 'on'], [my_name+'Dell', "Удалить", 'on']], blocks.id[my_name+'EditButtons']);
		maker.name_idText(['ID', my_name+'Id'], blocks.id[my_name+'EditFeld']);
		maker.name_idType(['Номер', [my_name+'Controller', 'number']], blocks.id[my_name+'EditFeld']);
		//maker.name_idType(['Auth-Key', my_name+'Auth_key'], blocks.id[my_name+'EditFeld']);
		maker.name_idType(['Группа', my_name+'Group'], blocks.id[my_name+'EditFeld']);
		maker.name_idType(['Здание', my_name+'Building'], blocks.id[my_name+'EditFeld']);
		maker.name_idType(['Дверь', my_name+'Door'], blocks.id[my_name+'EditFeld']);
		maker.name_idText(['MQTT Broker', my_name+'Broker'], blocks.id[my_name+'EditFeld']);
		maker.name_idText(['MQTT Topic', my_name+'Topic'], blocks.id[my_name+'EditFeld']);
	    maker.multigroup();
		functions.allOff(blocks.id[my_name+'EditFeld']);
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
	usersList(parentBlk){
		let my_name='user';
	    maker.one.prepare([[my_name+'FindWindow', "directionColumn"], [my_name+'EditWindow', 'justifyCenter']], parentBlk);
	    maker.one.prepare([[my_name+'Buttons', "wrap justifyCenter"], [my_name+'Result', 'directionColumn justifyCenter']], blocks.id[my_name+'FindWindow']);
	    findWindow(blocks.id[my_name+'Buttons'], my_name);
	    
	    maker.multi.prepare([[my_name+'EditFeld', "directionColumn justifyCenter"], [my_name+'EditButtons', 'directionColumn','', 'my_name']], blocks.id[my_name+'EditWindow']);

	    blocks.id[my_name+'EditButtons'].dataset.item='on';
	    maker.clickItem.prepare([[my_name+'Save', "Сохранить", 'do'], [my_name+'Out', "Отменить", 'do'], [my_name+'New', "Создать", 'on'], [my_name+'Edit', "Изменить", 'on'], [my_name+'Dell', "Удалить", 'on']], blocks.id[my_name+'EditButtons']);
		maker.name_idText(['Дверей', my_name+'Doors'], blocks.id[my_name+'EditFeld']);
		maker.name_idText(['ID', my_name+'Id_user'], blocks.id[my_name+'EditFeld']);
		maker.name_idType(['Карта', my_name+'Card'], blocks.id[my_name+'EditFeld']);
		maker.name_idType(['Имя', my_name+'Name_user'], blocks.id[my_name+'EditFeld']);
		maker.name_idType(['С', [my_name+'From', 'date']], blocks.id[my_name+'EditFeld']);
		maker.name_idType(['По', [my_name+'To', 'date']], blocks.id[my_name+'EditFeld']);
		maker.name_idType(['Открытий', [my_name+'Unlocks', 'number']], blocks.id[my_name+'EditFeld']);
		maker.name_idText(['Адрес', my_name+'Address'], blocks.id[my_name+'EditFeld']);
		maker.name_idText(['Пароль', my_name+'Passkey'], blocks.id[my_name+'EditFeld']);
		
	    maker.multigroup();
		functions.allOff(blocks.id[my_name+'EditFeld']);
	    function findWindow (parentBlk, my_name){
    		if(!parentBlk){
    			parentBlk = document.createElement('div');
    		}
    		let list=[
    			['Номер', 'id_user'],
    			['Карта', 'card'],
    			['Имя', 'name_user'],				
    		];
    		maker.listReadValue_read_nameClick.prepare([[list, my_name+'Feld', 'card'], my_name+'String'], parentBlk);
    		blocks.read[my_name+'String'].placeholder="Строка поиска";
			maker.clickItem.prepare([[my_name+'Find', "Искать", 'on']], parentBlk);
	    }
	},
}

function carcass(){
	let screen=maker.ligth.make('', document.body,'screen','screen directionColumn alignCenter');
	maker.one.prepare([['blockHeader', 'directionColumn'], ['baner', 'directionColumn'], ['mainArea', 'directionColumn']], screen);
	make_bock.headerSlogan(blocks.id.blockHeader);
	// arr - название кнопки, id блока, функция при нажатии на кнопку, класс стиля блока
	let arr_arss=[
		['Авторизация', 'blockIn', 'goLogin'],
		['Информация', 'infoIn', 'goInfo'],
		['Контроллеры', 'controllersIn', 'goControllers'],
		['Пользователи', 'userIn', 'goUser'],
	];
	maker.buttonsBlocks(arr_arss, 'main', 'justifyCenter', blocks.id.mainArea);
	
	make_bock.loginPass(blocks.id.blockIn);
	make_bock.ownerInfo(blocks.id.infoIn);
	make_bock.controllersList(blocks.id.controllersIn);
	blocks.id.controllersIn.className='wrap justifyCenter';
	make_bock.usersList(blocks.id.userIn);
	blocks.id.userIn.className='wrap justifyCenter';
}

function start(){
    st=1; //признак готовности
	carcass();
	document.title='Autotest Гость';
	protocol.new_session();
	carcass_functions.show_name_read(); // только для отладки
	if(abonent.session){
		abonent.start_block='goInfo';
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