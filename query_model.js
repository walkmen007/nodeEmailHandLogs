		var parser = require('body-parser');
		var config = require('./config');
		var NODE_PATH = config.development.NODE_MODULES_PATH;
		var mongoose = require('mongoose');
		var Schema = mongoose.Schema;
		var SchemaModel = require('./datamodel');
	    var Game_Table_Schema = SchemaModel.Game_Table_Schema;

		module.exports= {
            getRealGameData : function(userInfo, callback){ 
            	//console.log("Query Param", userInfo); 
                var GAME_TABLE_DATA  =  mongoose.model('GAME_TABLE_DATA', Game_Table_Schema, userInfo.collectionName); 
                   
	            var query = GAME_TABLE_DATA.find
		    	                  ({'users.uid':userInfo.userId, gt: userInfo.gameType, 
		    	                  	st : {$gt : userInfo.startDateTime, $lt : userInfo.endDateTime}
		    	                   },
		    		               {st:1, 'gd.dt': 1, 'gd.gs' :1, 'gd.an':1, 'gd.amt':1, 'users.uid' :1, 'users.un' :1,'users.hc':1,
		    		               'winners.uid' :1, 'winners.amt':1}
		    		               ).limit(userInfo.maxHands); 
			  	    query.exec(function (err, resp){
			  	    	//console.log("Query Executed-----",resp);
			  	    	callback(err, resp);
			  	   });                
            },

		    getSnGTourneyGameData : function(userInfo){
	            var GAME_TABLE_DATA = dynamicTableName();
		    	var query = GAME_TABLE_DATA.find({ 'cid' : userInfo.cid, gt: userInfo.gameType, 'users.uid': userInfo.uid}, 
		    		                   {st:1, 'gd.dt': 1, 'gd.gs' :1, 'gd.an':1, 'gd.amt':1, 'users.uid' :1, 
		    		                    'users.un' :1,'users.hc':1,
		    		                    'winners.uid' :1, 'winners.amt':1}); 
			  	    query.exec(function (err, resp){
			  	    	if(err){
		                  throw err;
			  	    	}
			  	    });
		    },

		    getConfigList : function(userInfo, callback){
		    	var query = SchemaModel.MTT_SESSION.distinct('cid', {uid : userInfo.userId, ttype : userInfo.hhFor});         
			  	    query.exec(function(err, resp){
			  	    	if(err){
		                  throw err;
			  	    	}else{
			  	    		//console.log("config list response----",resp);
			  	    		callback(resp)
			  	    	}
			  	    });
		    },

		};