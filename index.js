const http = require('http');
const fs = require('fs'); //работа с файлами
const path = require('path'); //работа с путями
const os = require('os'); // работа с операционной системой
const base = require("./base"); //создание базы
const api_cmd = require("./api_cmd"); //команды API
const api_admin = require("./api_admin"); //команды API
const api_tester = require("./api_tester"); //команды API
const api_editor = require("./api_editor"); //команды API
const api_guest = require("./api_guest"); //команды API
const sql_list = require("./sql_list"); // запросы к базе
const picture_types=['jpg', 'gif', 'png'];
let mysql;
try{
	mysql = require("mysql2");	
}
catch(e){
	console.log("require bad");  
	console.log(e.name); 
	console.log(e.message);
	console.log(e.stack);
	return;
}

const root=__dirname+"/site";
const port_http=8080;
const order={};

base.create_base(mysql);

const ip_adresses = os.networkInterfaces();
for(const i in ip_adresses){
	for(const k in ip_adresses[i])if(ip_adresses[i][k].family == 'IPv4')console.log("Server running at http://" + ip_adresses[i][k].address + ':' + port_http);
}
log("start \r");
log(String(new Date())+ "\r");

const server = http.createServer((req, res) => {
    let first_url=req.url;
    let new_url;
    try{//исправляем кодировку 
        new_url=decodeURIComponent(first_url);   
    }
    catch(e){
        res.statusCode = 400;  
        res.end("Bad reques");
        return;
    }
    if(~new_url.indexOf('\0')){// проверяем отсутствие 0 байта
        res.statusCode = 400;  
        res.end("Realy Bad reques");
        return;
    }
	if(req.method=='GET'){ // запросы страниц
		send_file( res, new_url);
	}
	if(req.method=='POST'){ // запросы от контроллера и администратора
		send_post(req, res, new_url);
	}
	
	
}); 


const connection = mysql.createConnection({
	  host: "localhost",
	  user: "murat",
	  database: "autotest",
	  password: "3512086"
});
let reconect_start=0;
function reConnect(){
    if(!reconect_start){
        reconect_start=1;
        connection.connect(function(err){
        	if (err) {
        		return console.error("Ошибка: " + err.message);
        	} else {
        	    log("Повторное подключение к серверу MySQL parts успешно установлено");
        		sql_list.start(connection, reConnect, log);
        	}
        });
        setTimeout(()=>{reconect_start=0;},3000);
	}
}
connection.connect(function(err){
	if (err) {
		return console.error("Ошибка: " + err.message);
	} else {
		console.log("Подключение к серверу MySQL успешно установлено");
		sql_list.start(connection, reConnect, log);
	}
});


server.listen(port_http);
//console.log('port_http  '+port_http);


function send_file( res, new_url){
	let all_url=path.normalize(path.join(__dirname, new_url)); //полный путь к файлу
	let path_arr=new_url.split('/')
	if(path.extname(all_url)==""){ //если нет расширения файла
		if(path_arr[path_arr.length-1]!=''){
			res.statusCode = 301;
			res.setHeader('location', new_url+'/');
			res.end("Realy Bad reques");
        return;
		}
		all_url=__dirname+"/site/index.html";
		//console.log("path_arr");
		//console.log(path_arr);
		if(path_arr.length==2){
			all_url=__dirname+"/site/"+path_arr[1]+"/index.html";
		}
		if(path_arr.length>2){
			all_url=__dirname+"/site/"+path_arr[1]+"/index.html";
		}
	} else {
	    if(path.dirname(new_url)=="/"){ //если расширение есть, но нет пути
	        all_url=__dirname+"/site/"+path.basename(new_url);
	    }else{//если есть расширение и путь
			//console.log("path_arr without .");
			//console.log(path_arr);
			
			if(path_arr[1]=='files'){
				all_url=__dirname+"/files/"+path.basename(new_url);
			}else{
				if(path_arr.length==2){
					all_url=__dirname+"/site/"+path_arr[1]+"/"+path.basename(new_url);
				}
				if(path_arr.length>2){
					all_url=__dirname+"/site/"+path_arr[1]+"/"+path.basename(new_url);
				}
			}
			//console.log(all_url);
		}
	}
	fs.stat(all_url,  function(err, st){
		let mimeType=path.extname(new_url);
		fs.readFile(all_url, function(err, content, the_type=mimeType) { 
			if (err){
				//console.log("no file");
				res.writeHead(400,{'Content-Type':'text'});
				res.end('no file');
			}else{
				res.writeHead(200,{'Content-Type':the_type});
				res.end(content);
			}				
		});
	});
}


function send_post(request, response, new_url){
	let type=request.headers['content-type'];
    let body = [];		
	let data;
	let path_arr=new_url.split('/')
	
    request.on('error', function(err) {
        console.error(err);
    });
	switch(type){
		case 'application/json':
			request.on('data', function(chunk) {
				body.push(chunk);
				if(body.length>2){
					response.writeHead(503);    
					response.end('bad request');//сообщение об ошибке
					request.destroy();
				}
			});
			request.on('end', function() {
				body = Buffer.concat(body).toString();
				try{
					data = JSON.parse(body); 
					//data.path=path_arr[1];
					switch (path_arr[1]) {
					  case 'admin':
						api_admin.run(data, response);
						break;
					  case 'editor':
						api_editor.run(data, response);
						break;
					  default: //guest
						api_guest.run(data, response);
					}
				}catch (err) {
					response.writeHead(503);    
					response.end('bad JSON');//сообщение об ошибке
				}
			});
		break;			
		case 'multipart/form-data':
			request.on('data', function(chunk) {
				body.push(chunk);
				if(body.length>4){
					//response.writeHead(503);    
					//response.end('bad request big file');//сообщение об ошибке
					//setTimeout(() =>request.destroy(), 20);
					request.destroy();
				}
			});
			request.on('end', function() {
				body = Buffer.concat(body);
				try{
					data = form_parser(body, path_arr[1]+'-'); 
					if(!data.err){
						data.path=path_arr[1];
						api_cmd.run(data, response);
					}else{
						response.writeHead(503);    
						response.end(data.err);//сообщение об ошибке
					}

				}catch (err) {
					response.writeHead(503);    
					response.end('bad FORM');//сообщение об ошибке
				}
			});	
		break;	
		default:
			response.writeHead(503);    
			response.end('bad type');//сообщение об ошибке
	}
}

function form_parser(body, name_file){
	let buffer;
	let form_arr=[];
	let tek_num=0;
	let zero=0;
	let start=0;
	let end=body.indexOf('\r\n', start);
	let arr=[];
	let out_obj={};
	while(end!=-1){
		arr.push(body.subarray(start, end));
		start=end+2;
		end=body.indexOf('\r\n', start);
	}
	if(arr.length){
		if(arr[arr.length-1].indexOf(arr[0])===0){
			for(let i=0; i<arr.length; i++){
				if(arr[i].indexOf(arr[0])===0){
					tek_num=i+1;
					zero=arr.length;
					if(i!=arr.length-1){
						form_arr.push({});
					}
				}
				if(tek_num==i){	//разбор первой строки
				let str=arr[tek_num].toString();
					let feld=str.split('; ');
					for(let j=0; j<feld.length; j++){
						let val=feld[j].split('=');
						if(val.length==2){
							form_arr[form_arr.length-1][val[0]]=val[1];
						}
					}
				}
				if(tek_num<i){
					if(arr[i].length<1){
						zero=i;
						form_arr[form_arr.length-1].val=[];
					}
					if(zero<i){
						form_arr[form_arr.length-1].val.push(arr[i]);
					}
				}
			}
		}else{
			response.writeHead(503);    
			response.end('bad form');//сообщение об ошибке
		}
	}
	for(let i=0; i<form_arr.length; i++){
		if(form_arr[i].name){	
			if(form_arr[i].filename){
				let name_arr=form_arr[i].filename.split('.');
				if(name_arr[name_arr.length-1].split('"').length){
					out_obj.ext=name_arr[name_arr.length-1].split('"')[0];
				}
				let len=0;
				if(picture_types.includes(out_obj.ext)){//разрешено ли такое расширение файла
					if(form_arr[i].val){
						len=form_arr[i].val[0].length;
						for(let k=1; k< form_arr[i].val.length; k++){
							len=len+form_arr[i].val[k].length;
							len=len+2;
						}
						buffer = new Uint8Array(len);
						let lr = new Uint8Array([13,10]); //разделитель
						buffer.set(form_arr[i].val[0]);//последовательно добавляем элементы, сдвигая указатель
						let kk=form_arr[i].val[0].length;
						for(let k=1; k< form_arr[i].val.length; k++){
							buffer.set(lr, kk);
							kk=kk+2;
							buffer.set(form_arr[i].val[k], kk);
							kk=kk+form_arr[i].val[k].length;
						}
						out_obj.file=buffer;
					}else{
						out_obj.err='no value';
					}
				}else{
					out_obj.err='ext '+out_obj.ext+' no valid';
				}
			}else{
				if(form_arr[i].name){
					//console.log(form_arr[i].name.split('"')[1]);
					out_obj[form_arr[i].name.split('"')[1]]=form_arr[i].val.toString();
				}
			}
		}
	}
	if(out_obj.var_name&&out_obj.ext){
		out_obj.full_name=name_file+out_obj.var_name+'.'+out_obj.ext;
	}
	return out_obj;
}

function log(txt){
	fs.appendFileSync("log.txt", txt);
}

//преобразование даты
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



