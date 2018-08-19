		var path = require('path');
		var express  = require('express');
		var app = express();
		var parser = require('body-parser');
		var config = require('./config');
		var NODE_PATH = config.development.NODE_MODULES_PATH;
		var mongoose = require('mongoose');
		var queryModel = require('./query_model');
		var Utility = require('./utility');
		var hhHandler = require('./handHistoryHandler');
		var port = process.env.PORT || 3333;
			mongoose.connect( config.development.path + config.development.database, { useNewUrlParser: true });
	        //Crone Job to Schedule Achievement List of last day.
			
             
			var lastHandsPlayed = function(userInfo){
				 userInfo.handCount = userInfo.handCount >0 ? userInfo.handCount : config.game.maxLogSize;
		         var handHistoryArr = [];
		           //handHistoryArr = hhHandler.createHandHistoryData(userInfo);	 
		           handHistoryArr = hhHandler.createConfigList(userInfo);   
			};

			var userInfo = {
				 	hours : 24,
					userId : 24389,
					hhFor : 'MTT',
					days : 15,
					handCount : 250,
					mttCount : 20,
					configList : [],
					gameType : 'MTT'
				 }

		    var HHR_FOR = {
		    	RING_HANDS : 'RING_HANDS',
		    	RING_DAYS : 'RING_DAYS',
		    	RING_HOURS : 'RING_HOURS',
		    	SNG : 'STT',
		    	MTT : 'MTT',
		    }

			lastHandsPlayed(userInfo);

			// var cronJob = schedule.scheduleJob('33 * * * * *', ()=>{
			// 	console.log("Run Crone Job:::", new Date());	 
			// });


		    //cronJob.schedule();