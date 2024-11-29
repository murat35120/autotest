let conn;
module.exports.start=function (connection){
	conn=connection;
}
module.exports.run=function (query, data){
	try {
		list[query](data);
	} catch (e) {
		setTimeout(() => data.funk.next("No the query"), 10);
	}
}

let list={
	find_passkey(data){
		let sql = "SELECT * FROM abonents WHERE passkey=?";
		let filter = [data.passkey];
		list.read(sql, filter, data);
	},
	read_passkeys(data){
		let sql = "SELECT a_id, role, name, passkey  FROM abonents WHERE passkey";
		let filter = [data.passkey];
		list.list(sql, filter, data);
	},
	insert_abonent(data){
		filter = [data.role, data.name, data.passkey];
		sql = "INSERT INTO abonents(role, name, passkey) VALUES (?, ?, ?)";	
		list.insert(sql, filter, data);
	},
	find_login(data){
		let sql = "SELECT * FROM abonents WHERE login=?";
		let filter = [data.login];
		list.read(sql, filter, data);
	},
	edit_abonent(data){
		let sql = "UPDATE abonents SET login=?, session=?, hash=?, passkey=?  WHERE passkey=? ";
		let filter = [data.login, data.session, data.hash, "0", data.passkey];
		list.edit(sql, filter, data);
	},
	find_session(data){
		let sql = "SELECT * FROM abonents WHERE session=?";
		let filter = [data.session];
		list.read(sql, filter, data);
	},
	new_session(data){
		filter = [data.session, data.a_id];
		sql = "UPDATE abonents SET session=? WHERE a_id=?";		
		list.edit(sql, filter, data);
	},
	abonent_in(data){
		let sql = "SELECT * FROM abonents WHERE login=?";
		let filter = [data.login ];
		list.read(sql, filter, data);
	},
	new_password(data){
		filter = [data.session, data.hash, data.a_id];
		sql = "UPDATE abonents SET session=?, hash=? WHERE a_id=? ";		
		list.edit(sql, filter, data);
	},
	new_stand(data){
		//console.log('sql');
		filter = [data.a_id, data.std_description];
		sql = "INSERT INTO stands(author, std_description) VALUES (?, ?)";	
		list.insert(sql, filter, data);
	},
	read_stand(data){
		let sql = "SELECT * FROM stands WHERE std_id=?";
		let filter = [data.std_id];
		list.read(sql, filter, data);
	},
	find_stand(data){	
	    let filter = ["%"+data.string+"%"];
		let sql = "SELECT * FROM  stands WHERE "+data.feld+" LIKE ?";	
		list.list(sql, filter, data);
	},
	write_stand(data){
		let sql = "UPDATE stands SET author=?, adapter_num=?, controllers_num=?, device=?, pins=?, std_description=?   WHERE std_id=?";
		let filter = [data.a_id, data.adapter_num, data.controllers_num, data.device, data.pins, data.std_description, data.std_id ];
		list.edit(sql, filter, data);
	},



	insert_controller(data){
		filter = [data.id_owner, data.controller, data.group, data.building, data.door, data.mqtt_user, data.pass];
		sql = "INSERT INTO controllers(owner, controller, group_c,  building_c, door_c, mqtt_user, pass) VALUES (?, ?, ?, ?, ?, ?, ?)";	
		list.insert(sql, filter, data);
	},
	list_controller(data){
		let sql = "SELECT * FROM controllers WHERE owner=?";
		let filter = [+data.id_owner];
		list.list(sql, filter, data);
	},
	edit_controller(data){
		let sql = "UPDATE controllers SET controller=?, group_c=?, building_c=?, door_c=?, mqtt_user=?, pass=?   WHERE id_controller=?";
		let filter = [data.controller, data.group, data.building, data.door, data.mqtt_user, data.pass, +data.id_controller];
		list.edit(sql, filter, data);
	},
	read_controller(data){
		let sql = "SELECT * FROM controllers WHERE id_controller=?";
		let filter = [+data.id_controller];
		list.read(sql, filter, data);
	},
	find_mqtt_user(data){
		let sql = "SELECT id_controller FROM controllers WHERE mqtt_user=?";
		let filter = [data.mqtt_user];
		list.read(sql, filter, data);
	},
	dell_controller(data){
		let sql = "DELETE FROM controllers WHERE id_controller=?";
		let filter = [+data.id_controller];
		list.edit(sql, filter, data);
	},
	read_user(data){
		let sql = "SELECT * FROM users WHERE id_user=?";
		let filter = [+data.id_user];
		list.read(sql, filter, data);
	},
	save_user(data){
		let sql = "UPDATE users SET card=?, name_user=?, passkey=?, from_u=?, to_u=?, unlocks=?, link=?   WHERE id_user=?";
		let filter = [data.card, data.name_user, data.passkey, data.from, data.to, data.unlocks, data.id_list, data.id_user];
		list.edit(sql, filter, data);
	},
	new_user_session(data){
		let sql = "UPDATE users SET session=?, passkey=?   WHERE id_user=? AND passkey<>0";
		let filter = [data.session, data.passkey, data.id_user];
		list.edit(sql, filter, data);
	},
	insert_user(data){
		filter = [data.id_owner, data.card, data.name_user, data.passkey, data.from, data.to, data.unlocks, data.id_list];
		sql = "INSERT INTO users(owner, card, name_user, passkey,  from_u, to_u, unlocks, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";	
		list.insert(sql, filter, data);
	},
	list_user(data){
		let sql = "SELECT id_user, card, name_user, passkey, from_u, to_u, unlocks, link FROM users WHERE owner=?";
		let filter = [+data.id_owner];
		list.list(sql, filter, data);
	},	
	dell_user(data){
		let sql = "DELETE FROM users WHERE id_user=?";
		let filter = [+data.id_user];
		list.edit(sql, filter, data);
	},	
	controllers_select(data){
		let sql = "SELECT id_controller, group_c, building_c, door_c  FROM controllers WHERE id_controller IN ("+data.controllers_list+")";
		let filter = '';
		list.list(sql, filter, data);
	},
	
	read(sql, filter, data){
		conn.query(sql, filter, function(err, results) {
			let temp;
			if(err) console.log(err);
			if(results){
				if("undefined" === typeof results[0]){
					temp=0;
				}else{
					temp=results[0];
				}
			}
			data.funk.next(temp);
		});
	},
	list(sql, filter, data){
		conn.query(sql, filter, function(err, results) {
			if(err) console.log(err);
			data.funk.next(results);
		});
	},
	insert(sql, filter, data){
		conn.query(sql, filter, function(err, results) {
			let temp;
			if(err) console.log(err);
			if(results){
				//console.log(results);
				temp=results.insertId;
			} else{
				temp='';
			}
			data.funk.next(temp);
		});
	},
	insert_extra(sql, filter, data){
		conn.query(sql, filter, function(err, results) {
			let temp;
			if(err) console.log(err);
			if(results){
				//console.log(results);
				temp=results.affectedRows;
			} else{
				temp='';
			}
			data.funk.next(temp);
		});
	},
	insert_arr(sql, arr, data){
		conn.query(sql, [arr], function(err, results) {
			let temp;
			if(err) console.log(err);
			if(results){
				//console.log(results);
				temp=results.affectedRows;
			} else{
				temp='';
			}
			data.funk.next(temp);
		});
	},
	edit(sql, filter, data){
		conn.query(sql, filter, function(err, results) {
			let temp;
			if(err) console.log(err);
			if(results){
				temp=1;//results.changedRows;
				//console.log(results.changedRows);
				//console.log(results);
			} else{
				temp='';
			}
			data.funk.next(temp);
		});
	},
	delete_base(data){
		//console.log('d2');
		let sql = `drop database autotest`;
		conn.query(sql, function(err, results) {
			if(err) console.log(err);
			else console.log("База autotest данных удалена");
			data.funk.next("base deleted");
		})
	}	
};






