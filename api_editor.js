let uid;

try{
	uid = require('uid-safe'); 	
}
catch(e){
	console.log("require bad");  
	console.log(e.name); 
	console.log(e.message);
	console.log(e.stack);
	return;
}
const {scryptSync} = require('node:crypto'); //новая версия
//const scryptSync = require('crypto'); //старая версия

const salt="autotest ver 01";
const sql_list = require("./sql_list"); // запросы к базе
const fs = require('fs'); //работа с файлами

module.exports.run=function (data, response){
	try {
		let answer={api: data.api};
		if(data.api in cmd){
			data.funk=cmd[data.api](data, answer, response);
			if(!data.direct){
				data.funk.next();
			}
		}else{
			response.end('wrong command API');//сообщение об ошибке
		}
	} catch (e) {
		console.log(data.api);
			console.log(e.name); 
			console.log(e.message);
			console.log(e.stack);
    
		response.end('command is bad');//сообщение об ошибке
	}
}


let cmd={
	
	*editor(data, answer, response){
		sql_list.run('find_login', data);//проверка логина
		let count = yield; //получаем ответ от базы
		if(count){
			response.writeHead(200); 
			answer.check={message:'This login already exists'}; //такой логин уже есть		
		}else{
			yield* cmd.make_session(data, answer, response);	//композиция генераторов
			data.hash=cmd.hash(data.login, data.password);
			data.session=answer.session;
			sql_list.run('find_passkey', data);//создать владельца
			let abonent = yield;
			if(abonent){
				sql_list.run('edit_abonent', data);//создать владельца
				let ok = yield;
				if(ok){
					answer.check=1;
					answer.a_id=abonent.a_id;
				}else{
					answer.check=0;
					answer.message='passkey is wrong';
				}
			}
		}
		response.writeHead(200); 
		response.end(JSON.stringify(answer));
	},
	*new_session(data, answer, response){
		sql_list.run('find_session', data);//проверка сессии
		let obj = yield; //получаем ответ от базы
		if(obj){
			if(obj.a_id==data.a_id){
				answer.name=obj.name;
				yield* cmd.make_session(data, answer, response);	//композиция генераторов
				sql_list.run('new_session', data);//сохраняем новую сессию
				let check = yield;
				answer.check=0;
				if(check){
					answer.check=1;
					answer.a_id=obj.a_id;
					//sql_list.run('list_controller', data);
					//answer.list_controller = yield;
					//sql_list.run('list_user', data);
					//let list = yield;
					//answer.list_user=user_list(list);
				}else{
					answer.check={msg:'new session is not save'};
				}
			}else{
				answer.check={msg:'bad id abonent'};
			}
		}else{
			answer.check={msg:'bad session'};
		}
		response.writeHead(200); 
		response.end(JSON.stringify(answer));	
	},
	*abonent_in(data, answer, response){
		sql_list.run('abonent_in', data);//поиск по логину
		let obj = yield; //получаем ответ от базы
		if(obj){
			let hash=cmd.hash(data.login, data.password);
			if(obj.hash==hash){
				answer.name=obj.name;
				yield* cmd.make_session(data, answer, response);	//композиция генераторов
				data.a_id=obj.a_id;
				sql_list.run('new_session', data);//сохраняем новую сессию
				let check = yield;
				answer.check=0;
				if(check){
					answer.check=1;
					answer.a_id=obj.a_id;
					//sql_list.run('list_controller', data);
					//answer.list_controller = yield;
					//sql_list.run('list_user', data);
					//let list = yield;
					//answer.list_user=user_list(list);
				}
			}else{
				answer.check=0;
			}			
		}else{
			answer.check=0;
		}
		response.writeHead(200); 
		response.end(JSON.stringify(answer));	
	},
	*new_password(data, answer, response){
		sql_list.run('abonent_in', data);//поиск по логину
		let obj = yield; //получаем ответ от базы
		if(obj){
			data.hash=cmd.hash(data.login, data.password);
			if(obj.hash==data.hash){
				yield* cmd.make_session(data, answer, response);	//композиция генераторов
				data.a_id=obj.a_id;
				data.hash=cmd.hash(data.login, data.new_password);
				sql_list.run('new_password', data);//сохраняем новый пароль
				let check = yield;
				if(check){
					answer.check=1;
					answer.a_id=obj.a_id;
					//sql_list.run('list_controller', data);
					//answer.list_controller = yield;
					//sql_list.run('list_user', data);
					//let list = yield;
					//answer.list_user=user_list(list);
				}
			}else{
				answer.check=0;
			}			
		}else{
			answer.check=0;
		}
		response.writeHead(200); 
		response.end(JSON.stringify(answer));	
	},
	*new_stand(data, answer, response){
		//console.log('new_stand');
		sql_list.run('find_session', data);//проверка сессии
		let obj = yield; //получаем ответ от базы
		//console.log(obj);
		if(obj){
			if(obj.a_id==data.a_id){
				answer.check=1;
				sql_list.run('new_stand', data);//добавляем стенд = его описание
				let std_id = yield; //получаем ответ от базы
				if(std_id){
					answer.std_id=std_id;
				}else{
					answer.err='no std_id';
				}
				//sql_list.run('list_controller', data);
				//answer.list = yield;
			}else{
				answer.check={msg:'bad session'};
			}
		}
		response.writeHead(200); 
		response.end(JSON.stringify(answer));
	},
	*read_stand(data, answer, response){
		sql_list.run('find_session', data);//проверка сессии
		let obj = yield; //получаем ответ от базы
		if(obj){
			if(obj.a_id==data.a_id){
				answer.check=1;
				sql_list.run('read_stand', data);//читаем стенд
				let stand = yield; //получаем ответ от базы
				if(stand){
					answer.stand=stand;
				}else{
					answer.err='no std_id';
				}
			}else{
				answer.check={msg:'bad session'};
			}
		}
		response.writeHead(200); 
		response.end(JSON.stringify(answer));
	},
	*find_stand(data, answer, response){
		sql_list.run('find_session', data);//проверка сессии
		let obj = yield; //получаем ответ от базы
		if(obj){
			if(obj.a_id==data.a_id){
				answer.check=1;
				sql_list.run('find_stand', data);//читаем стенд
				let list = yield; //получаем ответ от базы
				if(list){
					answer.list=list;
				}
			}else{
				answer.check={msg:'bad session'};
			}
		}
		response.writeHead(200); 
		response.end(JSON.stringify(answer));
	},
	*write_stand(data, answer, response){
		sql_list.run('find_session', data);//проверка сессии
		let obj = yield; //получаем ответ от базы
		if(obj){
			if(obj.a_id==data.a_id){
				answer.check=1;
				sql_list.run('write_stand', data);//сохраняем стенд
				let ok = yield; //получаем ответ от базы
				if(ok){
					answer.ok=ok;
				}else{
					answer.err='no std_id';
				}
			}else{
				answer.check={msg:'bad session'};
			}
		}
		response.writeHead(200); 
		response.end(JSON.stringify(answer));
	},





	*edit_owner(data, answer, response){
		sql_list.run('find_owner_session', data);//проверка сессии
		let obj = yield; //получаем ответ от базы
		//answer.check1=obj;
		if(obj){
			if(obj.id_owner==data.id_owner){
				sql_list.run('edit_owner', data);
				let check = yield;
				if(check){
					answer.check=1;
				}
			}else{
				answer.check={msg:'bad session'};
			}
		}
		response.writeHead(200); 
		response.end(JSON.stringify(answer));
	},

	*dell_controller(data, answer, response){
		sql_list.run('find_owner_session', data);//проверка сессии
		let obj = yield; //получаем ответ от базы
		if(obj){
			if(obj.id_owner==data.id_owner){
				if(+data.id_controller){
					sql_list.run('read_controller', data);
					let controller = yield;
					if(controller.owner==data.id_owner){
						sql_list.run('dell_controller', data);
						answer.id_controller=data.id_controller;
						let check = yield;
						//answer.step=check;
						if(check){
							answer.check=1;
							dell_user (controller.controller);
						}
					}
				}else{
					answer.check={msg:'no controller id'};
				}
				sql_list.run('list_controller', data);
				answer.list = yield;
			}else{
				answer.check={msg:'bad session'};
			}
		}
		response.writeHead(200); 
		response.end(JSON.stringify(answer));
	},
	*save_user(data, answer, response){
		sql_list.run('find_owner_session', data);//проверка сессии
		let obj = yield; //получаем ответ от базы
		if(obj){
			if(obj.id_owner==data.id_owner){
				data.passkey=Math.floor(100000 + Math.random() * (999999 + 1 - 100000));
				if(!data.from){
					data.from=(new Date()).format();
				}
				if(!data.to){
					data.to=(new Date()).format();
				}
				if(!data.unlocks){
					data.unlocks=1;
				}
				if(+data.id_user){
					answer.id_user=+data.id_user;
					sql_list.run('read_user', data);
					let user = yield;
					if(user.owner==data.id_owner){
						sql_list.run('save_user', data);
						let check = yield;
						if(check){
							answer.check=1;
						}
					}
				}else{
					sql_list.run('insert_user', data);
					let check = yield;
					if(check){
						answer.id_user=check;
						answer.check=1;
					}
				}
				sql_list.run('list_user', data);
				let list = yield;
				answer.list=user_list(list);
			}else{
				answer.check={msg:'bad session'};
			}
		}
		response.writeHead(200); 
		response.end(JSON.stringify(answer));
	},
	*dell_user(data, answer, response){
		sql_list.run('find_owner_session', data);//проверка сессии
		let obj = yield; //получаем ответ от базы
		if(obj){
			if(obj.id_owner==data.id_owner){
				if(+data.id_user){
					sql_list.run('read_user', data);
					let user = yield;
					if(user.owner==data.id_owner){
						sql_list.run('dell_user', data);
						answer.id_user=data.id_user;
						let check = yield;
						//answer.step=check;
						if(check){
							answer.check=1;
						}
					}
				}else{
					answer.check={msg:'no user id'};
				}
				sql_list.run('list_user', data);
				let list = yield;
				answer.list=user_list(list);
			}else{
				answer.check={msg:'bad session'};
			}
		}
		response.writeHead(200); 
		response.end(JSON.stringify(answer));
	},
	*user_in(data, answer, response){
		data.id_user=data.path;
		sql_list.run('read_user', data);//проверка логина
		let user = yield; //получаем ответ от базы
		if(user){
			if(user.passkey==data.passkey){
				yield* cmd.make_session(data, answer, response);	//композиция генераторов
				answer.setings='other setings';
				data.passkey=0;
				sql_list.run('new_user_session', data);
				answer.check = yield;
				data.controllers_list=user.link;
				sql_list.run('controllers_select', data);
				answer.controllers_arr = yield;
			}else{
				answer.check={message:'The password is wrong'}; //такой логин уже есть		
			}
			response.writeHead(200); 
			response.end(JSON.stringify(answer));
		}else{
			response.writeHead(200); 
			answer.check={message:'No the user'}; //такой логин уже есть
			response.end(JSON.stringify(answer));			
		}
	},
	*check_session(data, answer, response){
		data.id_user=data.path;
		sql_list.run('read_user', data);//проверка логина
		let user = yield; //получаем ответ от базы
		if(user){
			if(user.session==data.session){
				answer.check=1;
				answer.user=user;
			}else{
				answer.check={message:'The session is wrong'}; //такой логин уже есть		
			}
			response.writeHead(200); 
			response.end(JSON.stringify(answer));
		}else{
			response.writeHead(200); 
			answer.check={message:'No the user'}; //такой логин уже есть
			response.end(JSON.stringify(answer));			
		}
	},
	*open_door(data, answer, response){
		data.id_user=data.path;
		sql_list.run('read_user', data);//проверка логина
		let user = yield; //получаем ответ от базы
		if(user){
			if(user.session==data.session){
				answer.user=user;
				if(data.id_controller){
					sql_list.run('read_controller', data);
					let controller = yield;
					answer.check=1;
					let topic=controller.mqtt_user+"/ctrl/BT"+controller.controller+"/ext_card";
					//console.log(topic);
					//console.log(user.card);
					//console.log(data.dir);
					opens (topic, user.card, data.dir);
				}	
			}else{
				answer.check={message:'The session is wrong'}; //такой логин уже есть		
			}
			response.writeHead(200); 
			response.end(JSON.stringify(answer));
		}else{
			response.writeHead(200); 
			answer.check={message:'No the user'}; //такой логин уже есть
			response.end(JSON.stringify(answer));			
		}
	},
	open_door_e(data, answer, response){
		answer.check=1;
		console.log('open_door_e');
		try {
			opens(data.topic, data.card, data.dir);
		} catch (e) {
			console.log(data.topic);
			console.log(data.card);
			console.log(data.dir);
			console.log(e.name); 
			console.log(e.message);
			console.log(e.stack);
		}
		console.log('send');
		response.writeHead(200); 
		response.end(JSON.stringify(answer));
		
	},
	
	*make_session(data, answer, response){
		uid(18, function (err, str) {
			if (err) throw err;
			data.funk.next(str);
		})
		answer.session = yield;
		data.session=answer.session;
	},
	hash(login, password){
		return scryptSync(password + login, salt, 32).toString('hex');
	},

};
function user_list(list){
	for(let i=0; i<list.length; i++){
		list[i].from_u=(new Date(list[i].from_u)).format(format = 'yyyy-mm-dd');
		list[i].to_u=(new Date(list[i].to_u)).format(format = 'yyyy-mm-dd');
	}
	return list;
};
function new_user (username, pass){
	if (client.connected === true) {
		let obj={
			commands:[
				{
					command: "createClient",
					username: username,
					password: String(pass)
				}
			]
		}
		let str_cmd = JSON.stringify(obj);
		client.publish('$CONTROL/dynamic-security/v1', str_cmd);
		console.log('add '+str_cmd);
	}
}

function dell_user (username){
	if (client.connected === true) {
		let obj={
			commands:[
				{
					command: "deleteClient",
					username: username
				}
			]
		}
		let str_cmd = JSON.stringify(obj);
		client.publish('$CONTROL/dynamic-security/v1', str_cmd);
		console.log('dell '+str_cmd);
	}
	
}
function opens (topic, card, dir){
	console.log('opens');
	if (client.connected === true) {
		let str_cmd = JSON.stringify({card:card, direction:dir});
		console.log('write');
		client.publish(topic, str_cmd);
		console.log('ok');
	}else{
		console.log('no connect');
	}
}
