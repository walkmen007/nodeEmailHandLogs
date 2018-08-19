	var config = {
		development : {
			path : 'mongodb://localhost:27017/',
			database : 'admin',
			NODE_MODULES_PATH : '',
			mailHost : "smtp.gmail.com",
			mailServiceProvider : 'gmail',
			achvReoprtMailIdList : [ 'ghiya.ankit7@gmail.com'
									],
			achvMailIdSourceInfo : {
				user: "ghiya007@gmail.com",
				pass: "ghiya007"
			},
			achvMailText : 'Acheivement Unlock Daily Report',
			achvMailSub : "Achievement Report " + new Date(),
			achvFilePath : '/Achievement Node/achv_sheet/'
		},
		game : {
            maxLogSize : 1000,
            maxMonths : 20,
		},
			
	};

	module.exports = config;


