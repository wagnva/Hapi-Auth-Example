const Mongoose = require("mongoose");

exports.register = function(plugin, options, next){
    
    Mongoose.connect("localhost:27017/hapi_auth");
    var db = Mongoose.connection;
    
    db.on("error", console.error.bind(console, "connection error"));
    db.once("open", function(){
       console.log("[Database] Connection succeeded");
    });
    
    exports.Mongoose = Mongoose;
    exports.db = db;
    
    next();
}

//user Schema
const user = new Mongoose.Schema({
   username: {
       type: String,
       required: true
   },
    password: {
        type: String,
        required: true
    }
});

exports.user = Mongoose.model("User", user);

exports.register.attributes = {
    name: "db",
    version: require("./package.json").version
}