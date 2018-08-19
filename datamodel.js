        var mongoose = require('mongoose');
        var Schema = mongoose.Schema;

        var Game_Table_Schema = new Schema(
            {
            "_id" : mongoose.Schema.Types.ObjectId,
            "gid" :{type: Number},
            "tid" :{type: Number},
            "cid" : {type: Number},
            "st" : {type: Date},
            "ct" : {type: String},
            "gv" : {type: String},
            "gt" : {type: String},
            "tn" : {type: String},
            "cn" : {type: String},
            "users" : [ 
                {
                    "id" : {type: String},
                    "uid" :{type: Number},
                    "un" : {type: String},
                    "sid" : {type: Number},
                    "tamt" : {type: Number},
                    "samt" :{type: Number},
                    "ip" : {type: String},
                    "cl" : {type: String},
                }, 
            ],    
        });

        var Mtt_Session_Sechma = new Schema({
            "_id" : mongoose.Schema.Types.ObjectId,
            "cid" : {type: Number},
            "uid" : {type: Number},
            "un"  : {type: String},
            "gv"  : {type: String},
            "ttype" : {type: String},
            "rst" : {type: Date},
            "ret" : {type: Date},
        });

        module.exports = {
            MTT_SESSION :  mongoose.model('MTT_SESSION', Mtt_Session_Sechma, "mtt_session"),
            Game_Table_Schema : Game_Table_Schema,
        };