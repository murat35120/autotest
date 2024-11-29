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

const salt="version 01";
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
	*delete_base(data, answer, response){  //отладочная функция
		data.hash=cmd.hash(data.login, data.password);
		if(data.hash=="7ce0b98f45df6752e96f4af584ba345aa80cd5f980cf6040a41e287151ec8c86"){
			sql_list.run('delete_base', data);
			answer.list = yield;
			answer.check=1;
			answer.passkey=data.passkey;
		}else{
			answer.check=0;
		}			
		response.writeHead(200); 
		response.end(JSON.stringify(answer));
	},
	*new_abonent(data, answer, response){
		data.hash=cmd.hash(data.login, data.password);
		if(data.hash=="7ce0b98f45df6752e96f4af584ba345aa80cd5f980cf6040a41e287151ec8c86"){
			abonent=1;
			while(abonent){
				data.passkey=Math.floor(100000 + Math.random() * (999999 + 1 - 100000));
				sql_list.run('find_passkey', data);
				abonent = yield;
			}
			sql_list.run('insert_abonent', data);
			let a_id = yield;
			answer.check=1;
			answer.passkey=data.passkey;
		}else{
			answer.check=0;
		}			
		response.writeHead(200); 
		response.end(JSON.stringify(answer));	
	},
	*read_passkeys(data, answer, response){
		data.hash=cmd.hash(data.login, data.password);
		if(data.hash=="7ce0b98f45df6752e96f4af584ba345aa80cd5f980cf6040a41e287151ec8c86"){
			sql_list.run('read_passkeys', data);
			answer.list = yield;
			answer.check=1;
			answer.passkey=data.passkey;
		}else{
			answer.check=0;
		}			
		response.writeHead(200); 
		response.end(JSON.stringify(answer));	
	},
	hash(login, password){
		return scryptSync(password + login, salt, 32).toString('hex');
	},

};

