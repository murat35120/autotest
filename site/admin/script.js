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
	new_abonent(){
		let obj={
			api:"new_abonent",
			login:blocks.read.login.value,
			password:blocks.read.password.value,
			name:blocks.read.name.value,
			role:blocks.read.role.value			
		};
		comm.ax_post( obj);
	},
	read_passkeys(){
		let obj={
			api:"read_passkeys",
			login:blocks.read.login.value,
			password:blocks.read.password.value,		
		};
		comm.ax_post( obj);
	},
	delete_base(){
		let obj={
			api:"delete_base",
			login:blocks.read.login.value,
			password:blocks.read.password.value,		
		};
		comm.ax_post( obj);
	},
};


let control={
	goSave(){
	  protocol.new_abonent();
	},
	goRead(){
	  protocol.read_passkeys();
	},
	delete_base(){
		protocol.delete_base();
	},
};

		
let functions={
};

let receivers={
	new_abonent(obj){
		if(obj.check){
			if(obj.check==1){
				blocks.read.passkey.innerText=obj.passkey;
			}else{
				blocks.read.passkey.innerText="Wrong Login or Password";
			}
		}
	},
	read_passkeys(obj){
		if(obj.check){
			if(obj.check==1){
				blocks.id.infoArea.innerHTML='';
				maker.writeList(obj.list, blocks.id.infoArea, 'a_id')  ;
			}else{
				blocks.id.infoArea.innerText="Wrong Login or Password";
			}
		}
	},
    
};

let make_bock={
	headerSlogan(parentBlk){
		if(!parentBlk){
			parentBlk = document.createElement('div');
		}
		maker.one.prepare([['header', 'header', 'Autotest Админ'], ['slogan', 'slogan', 'Сервис автоматической проверки на функционирование']], parentBlk);
		return parentBlk;
	},
	loginPass(parentBlk){
		if(!parentBlk){
			parentBlk = document.createElement('div');
		}
		maker.one.prepare([['loginPass', 'directionColumn'], ['buttons', 'alignStretch']], parentBlk);
		maker.name_idType(['Логин', 'login'], blocks.id.loginPass);
		maker.name_idType(['Пароль', 'password'], blocks.id.loginPass);
		maker.name_idType(['Имя', 'name'], blocks.id.loginPass);
		let list=[
    		    ["Редактор", 'editor'],
    		    ["Тестировщик", 'tester'],
    		    ["Гость", 'guest'],
		    ];
		maker.name_idList(['Роль', ['role', list]], blocks.id.loginPass);
		maker.name_idText(['Код', 'passkey'], blocks.id.loginPass);
		maker.click.prepare([ ["goRead", "Читать"]], blocks.id.buttons);
		maker.click.prepare([ ["goSave", "Создать"]], blocks.id.buttons);
		maker.click.prepare([ ["delete_base", "Удалить базу"]], blocks.id.buttons);
		return parentBlk;
	},


}

function carcass(){
	let screen=maker.ligth.make('', document.body,'screen','screen directionColumn alignCenter');
	maker.one.prepare([['blockHeader', 'directionColumn'], ['baner', 'directionColumn'], ['mainArea', 'directionColumn alignCenter'], ['buttonsArea', 'directionColumn alignCenter'], ['infoArea', 'directionColumn alignCenter']], screen);
	make_bock.headerSlogan(blocks.id.blockHeader);
	make_bock.loginPass(blocks.id.mainArea);
	maker.parentsgroup();
}

function start(){
    st=1; //признак готовности
	carcass();
	document.title='Autotest Админ';
	carcass_functions.show_name_read(); // только для отладки
}
let st=0;
if(typeof carcass_start !== "undefined"){
   if(!st){ 
        start();
   }
}