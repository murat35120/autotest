
module.exports.create_base=function (mysql){
	let connection = mysql.createConnection({
	  host: "localhost",
	  user: "murat",
	  password: "3512086"
	});
	connection.query("CREATE  DATABASE autotest",
    function(err, results) {
		if(err) console.log("База данных autotest уже существует");
		else console.log("База данных autotest создана");
	});
	 connection = mysql.createConnection({
	  host: "localhost",
	  user: "murat",
	  database: "autotest",
	  password: "3512086"
	});
	// запись создает админ id, роль, имя, паскей. Абонент при регистрации добавляет логин, хэш, сессию
	sql = `create table if not exists abonents( 
		a_id int(16) PRIMARY KEY AUTO_INCREMENT,
		login varchar(30),
		session varchar(24),
		hash varchar(64), 
		role varchar(15),
		name varchar(30),
		passkey varchar(15)
	)`;
	connection.query(sql, function(err, results) {
		if(err) console.log(err);
		else console.log("Таблица abonents  создана");
	});
	//при создании заполняется автоматически  id, дата, автор
	//при заполнении проверки  добавляем статус и номер стенда
	//после выполнения меняется статус и результат
	sql = `create table if not exists checks( 
		c_id int(16) PRIMARY KEY AUTO_INCREMENT,
		date_do datetime default(CURRENT_TIMESTAMP),
		abonent_id int(16),
		name_c TEXT,
		status varchar(15),
		result_c TINYINT(1),
		stand_id int(16)
	)`;
	connection.query(sql, function(err, results) {
		if(err) console.log(err);
		else console.log("Таблица checks  создана");
	});


	sql = `create table if not exists tests( 
		t_id int(16) PRIMARY KEY AUTO_INCREMENT,
		check_id int(16),
		number_t int(16),
		result_t TINYINT(1), 
		do_text TEXT,
		result_text TEXT
	)`;
	connection.query(sql, function(err, results) {
		if(err) console.log(err);
		else console.log("Таблица tests создана");
	});

	//  какая инфОРМАЦИЯ ХРАНИТСЯ В obj json?
	//- шаблон проверки изменений
	//- состояние
	// - изменения
	// - новое состояние
	sql = `create table if not exists steps( 
		s_id int(16) PRIMARY KEY AUTO_INCREMENT,
		test_id int(16),
		number_s int(16),
		obj_s JSON,
		signal_s TEXT,
		duration_s int(16),
		pulse_s TINYINT(1),
		pause_s int(16),
		result_s int(16),
		state_text TEXT,
		state_do TINYINT(1)
	)`;
	connection.query(sql, function(err, results) {
		if(err) console.log(err);
		else console.log("Таблица steps создана");
	});

		if(0){
				sql = `create table if not exists actions( 
					act_id int(16) PRIMARY KEY AUTO_INCREMENT,
					description TEXT,
					func TEXT
				)`;
				connection.query(sql, function(err, results) {
					if(err) console.log(err);
					else console.log("Таблица actions создана");
				});
				
				sql = `create table if not exists types_devices( 
					type_dev_id int(16) PRIMARY KEY AUTO_INCREMENT,
					type_dev_name varchar(15),
					type_dev_pin varchar(15),
					type_dev_description TEXT,
					type_dev_function varchar(15)
				)`;
				connection.query(sql, function(err, results) {
					if(err) console.log(err);
					else console.log("Таблица types_devices создана");
				});
				
				sql = `create table if not exists types_checked( 
					type_ch_id int(16) PRIMARY KEY AUTO_INCREMENT,
					type_ch_name varchar(15),
					type_ch_pin varchar(15),
					type_ch_description TEXT

				)`;
				connection.query(sql, function(err, results) {
					if(err) console.log(err);
					else console.log("Таблица types_checked создана");
				});
				
				sql = `create table if not exists devices( 
					type_device_id int(16),
					number_device int(16),
					address int(16),
					obj_write TEXT,
					obj_read TEXT,
					dev_description TEXT

				)`;
				connection.query(sql, function(err, results) {
					if(err) console.log(err);
					else console.log("Таблица devices создана");
				});	
		}	

	//при создании заполняется автоматически  id, дата, автор
	//при заполнении проверки  добавляем статус и номер стенда
	sql = `create table if not exists stands( 
		std_id int(16) PRIMARY KEY AUTO_INCREMENT,
		author int(16),
		adapter_num TEXT,
		controllers_num TEXT,
		device TEXT,
		pins JSON,
		std_description TEXT
	)`;
	connection.query(sql, function(err, results) {
		if(err) console.log(err);
		else console.log("Таблица stands создана");
	});		
	
		if(0){
			sql = `create table if not exists pins( 
				stand_id int(16),
				count int(16),
				type_checked_id int(16),
				pin_checked int(16),
				action_id int(16),
				type_device_id int(16),
				number_dev int(16),
				pin_dev int(16),
				circuit TEXT,
				pin_description TEXT
			)`;
			connection.query(sql, function(err, results) {
				if(err) console.log(err);
				else console.log("Таблица pins создана");
			});	
		}
	
	connection.end();
}