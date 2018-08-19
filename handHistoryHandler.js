	var queryModel = require('./query_model');
	var config = require('./config');
    var handHistoryHandler = {};

	function HandHistoryObj(userObj){
	        	this.userId = userObj.userId;
				this.startTime = new Date();
	    		this.endTime = new Date();
	    		this.maxHands = userObj.handCount;
	    		this.maxMonths = 6;
	    		this.currentMonth = (new Date()).getMonth()+1;
	    		this.hhFor = userObj.hhFor;
	    		this.configIds = userObj.configIds;
	    		this.gameType = userObj.gameType;
	 }; 
	        

	var setCollectionName = function(data){
		    var collArr = [];
		    var date = new Date();
		    var year = date.getFullYear();
		    var month = date.getMonth()+2;
		        data.maxMonths = data.maxMonths > config.game.maxMonths ? config.game.maxMonths : data.maxMonths+1;
		        if(data.maxMonths > 0){
		        	for(var i=0; i< data.maxMonths ; i++){
				    	month = month - 1;
				    	var obj = {
				        	userId : data.userId,
				    		gameType : data.gameType,
	                        startTime : date,
	                        endTime : data.endTime,
	                        maxHands : data.maxHands,
	                        cid : data.configIds,
				        }
				    	if(month==0){
				    		year = year-1;
				    		month = 12;
				    	}
				        month = month < 10 ? '0' + month : '' + month;  
				        obj.collectionName = 'game_'+year+''+month;
	                    collArr.push(obj);
			        }
		        }else{
		        	     month = month-1;
		        	     month = month < 10 ? '0' + month : '' + month;	
		        	 var game_table = 'game_'+year+''+ month;
		        	 var obj={
				        	userId : data.userId,
				    		gameType : data.gameType,
	                        startTime : data.startTime,
	                        endTime :  data.endTime,
	                        collectionName: game_table,
	                        maxHands : data.maxHands,
	                        cid : data.configIds,
				      }
				      collArr.push(obj);
		        }
			    return collArr;
	};

	var calculateMonthDiff = function(endDateTime){
		var date = new Date();
		var yearDiff = date.getFullYear() - endDateTime.getFullYear();
		var monthDiff = yearDiff > 0 ? (12 * yearDiff + date.getMonth()) - endDateTime.getMonth() : date.getMonth() - endDateTime.getMonth();
	    return monthDiff;
	}

	var createTimeObj = function(obj){
	    var monthDiff;
	    var endDateTime = new Date();   
	        if(obj.hhFor == 'RING_HOURS'){
	          endDateTime.setHours(endDateTime.getHours() - obj.hours);	
	          console.log("End Date::::",endDateTime);                      
	        }else if(obj.hhFor == 'RING_DAYS'){
	          endDateTime.setDate(endDateTime.getDate() - obj.days);
	          endDateTime.setHours(00, 00, 00, 00);
	        }
	         monthDiff = calculateMonthDiff(endDateTime);
	    return {
	    	monthDiff : monthDiff,
	    	endDateTime : endDateTime,
	    	currMonth : (new Date()).getMonth()+1,
	    	endMonth : endDateTime.getMonth()+1,
	    }
	};

	var setEndTime = function(){
		var date = new Date();
		    date = date.setDate(date.getDate() - 180);
		var y = new Date(date);
		return y;
	}

	var fetchGameList = function (userObj, gameLogList,callback){
		    var maxHands;
		    var params = [];
		        params = userObj;
			
			params[0].maxHands = params[0].maxHands - gameLogList.length;
			maxHands = params[0].maxHands;
			console.log("param------handHistory Handler",params[0].maxHands);
			queryModel.getRealGameData(params[0], function(err, resp){
				    //console.log("Query Call back", resp);
	                if(err){
	                	console.log(err);
	                }else{
	                    	params.shift();
	                    	if(resp.length > 0){
	                    		gameLogList = gameLogList.concat(resp);
	                    		console.log("Param length",params.length);
	                    		if(params.length < 1 || gameLogList.length >= maxHands){
	                               callback(gameLogList);
	                    	    }else{
	                        	   fetchGameList(userObj, gameLogList, callback);
	                    	    }
	                    	}
	                    	else{
	                    		if(params.length > 0){
	                    			fetchGameList(userObj, gameLogList,callback);
	                    		}else{
	                    			callback(gameLogList);
	                    		}
	                             
	                    	}
	                }
	                callback(gameLogList);
			});
		}

	var fetchRecord  = function(userObj){
	    var gameLogList = [];
	    gameLogList = fetchGameList(userObj, gameLogList, function(logList){
	    	console.log("game list",logList.length);
	    });
	    return gameLogList;                            		                                                                
	};

	var createList = function(resp){
		var list = [];
	    for(var i=0; i < resp.length; i++){
             list.push(resp[i]);
	    }
	    return list;
	};
					    
	handHistoryHandler.createHandHistoryData  = function(userObj){
	        var time, param, localObj;
	        var queryParam, handHistoryDataArr = [];
		         param = new HandHistoryObj(userObj);
		         if(userObj.hhFor == 'RING_DAYS' || userObj.hhFor == 'RING_HOURS'){
			    	 time = (userObj.hhFor == 'RING_DAYS')? userObj.hours : userObj.date;
			    	 localObj = createTimeObj(userObj);
			    	 param.endTime = localObj.endDateTime;
			         param.maxMonths = localObj.monthDiff;
		        }else if(userObj.hhFor === 'RING_HANDS' || userObj.hhFor === 'STT' || userObj.hhFor === 'MTT'){
                     param.endTime = setEndTime(180);
		        }
		        queryParam = setCollectionName(param);
		        console.log("queryParam---",queryParam);
		        handHistoryDataArr = fetchRecord(queryParam);
		},

    handHistoryHandler.createConfigList = function(userObj){	
          	//console.log("userObj",userObj);	
			var congifList = queryModel.getConfigList(userObj, function(resp){
                    userObj.configIds = createList(resp);
                    handHistoryHandler.createHandHistoryData(userObj);
			});
    }


	module.exports = handHistoryHandler;