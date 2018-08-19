	    var createCsvWriter = require('csv-writer').createObjectCsvWriter;
		var nodemailer = require('nodemailer');       
		var config = require('./config');                            
		var createFileName = function(){
		                          var dateObj = new Date();
								  var year = dateObj.getUTCFullYear(); 
								  var month = dateObj.getUTCMonth() + 1; //months from 1-12
								  var date = dateObj.getDate();
								      date = date < 10 ? '0' + date : '' + date;
									  month = month < 10 ? '0' + month : '' + month;
								  var time = dateObj.getTime();
									       
								  var fileName = 'achv_unlock'+year+''+month + '' + date +'.csv';
								  var fileName2 = 'achv_detail'+year+''+month + '' + date + '.csv';
								  
								  var fileArr = [fileName, fileName2];
							      return fileArr;
		 }
		                                 
		module.exports= {

		          createCSVfile : function(achv_history_arr, player_gameHistory){
										  
										  var fileList =createFileName();
										  console.log("File Name---",fileList);
										  var csvWriter = createCsvWriter({
											    path: './achv_sheet/' + fileList[0],
											    header: [
											        {id: 'userId', title: 'User Id'},
											        {id: 'userName', title: 'User Name'},
											        {id: 'stackChallange', title: 'Stack Challange'},
											        {id: 'backToBack', title: 'Back to Back'},
											        {id: 'bigPot', title: 'Big Pot'},
											        {id: 'straightUp', title: 'Straight Up'},
											        // {id: 'masterStroke', title: 'Master Stroke'},
											        // {id: 'ftLegend', title: 'FT Legend'},
											    ]
										  });

										  var csvWriter2 = createCsvWriter({
											    path: './achv_sheet/' + fileList[1],
											    header: [
											        {id: 'userId', title: 'User Id'},
											        {id: 'userName', title: 'User Name'},
											        {id: 'opponentplayers', title: 'Players against whom achievement was competed'},
											        {id: 'achv_type', title: 'Achievement Name'},
											        {id: 'amt_won', title: 'Amount won'},
											        {id: 'tableId', title: 'Table ID'},
											        {id: 'gameId', title: 'Game ID of  last hand'},
											        {id: 'achvDate', title: 'Date & Time of Compvarion'},
											        {id: 'ipAddress', title: 'IP Address'},
											        {id: 'unlockAchvCount', title: 'Number of times user unlocked achievement in last 1 month'},
											    ]
										  });

										  csvWriter.writeRecords(achv_history_arr)       // returns a promise
										    .then(() => {    
										         console.log('...Sheet1'); 
										  });

										  csvWriter2.writeRecords(player_gameHistory)       // returns a promise
										    .then(() => {
										           console.log('...sheet2');
										   });

		                            },

		          sendMail : function(){
		          	                  var fileList =createFileName();
		                              var smtpTransport = nodemailer.createTransport({
														    service: config.development.mailServiceProvider,
														    host: config.development.mailHost,
														    auth: {
														        user: config.development.achvMailIdSourceInfo.user,
														        pass: config.development.achvMailIdSourceInfo.pass
														    }
				                       });
							            var subjectText = "Achievement Report " + new Date();
									    var mailOptions={
									        to : config.development.achvReoprtMailIdList,
									        subject : subjectText,
									        text : 'Achievement Report',
									        attachments: [
											    {   // file on disk as an attachment
											        filename: fileList[0],
											        path: config.development.achvFilePath + fileList[0], // stream this file
											    },
											    {   // file on disk as an attachment
											        filename: fileList[1],
											        path: config.development.achvFilePath + fileList[1], // stream this file
											    },
										    ]
									    }
									    smtpTransport.sendMail(mailOptions, function(error, response){
										     if(error){
										            console.log(error);
										     }else{
										        console.log("Message sent: " + response.message);
										     }
							            });
		                         }

		}
