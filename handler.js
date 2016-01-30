const Joi = require("joi");
const User = require("./db").user;
const Bcrypt = require("bcryptjs");

const getHome = {
    handler: function(request, reply){
        return reply("<h1>Home</h1>")
    }
}

const getLogin = {
    handler: function(request, reply){
        return reply.file("views/login.html");
    }
}

const getRegister = {
    handler: function(request, reply){
        return reply.file("views/register.html");
    }
}

const postLogin = {
    validate: {
        payload: {
            username: Joi.string().required(),
            password: Joi.string().required()
        }
    },
    handler: function(request, reply){
        
        if(request.auth.isAuthenticated){
            return reply.redirect("/");
        }
        
        var user = User.findOne({username: request.payload.username}, function(err, user){
            if(err){
                console.log(err);
                return reply(err);
            }
            
            if(user){
                if(Bcrypt.compareSync(request.payload.password, user.password)){
                        
                    request.cookieAuth.set(user);
                    console.log("[Auth] User logged in: " + user.username);
                    return reply.redirect("/");

                }
            }
            return reply("Wrong Username or Password");
        });
    }
}

const postRegister = {
    validate: {
        payload: {
            username: Joi.string().required(),
            password: Joi.string().required()
        }
    },
    handler: function(request, reply){
        var password = Bcrypt.hashSync(request.payload.password, 8);
        var newUser = new User({username: request.payload.username , password: password});
        newUser.save(function(err, user){
            console.log("[Auth] User registered: " + user.username);
            return reply.redirect("/login"); 
        });
    }
}

const validate = function(request, session, callback){
    if(!session.username || !session.password){
        return callback(null, false);
    }
    var user = User.findOne({username: session.username}, function(err, user){
        if(err){
            console.log(err);
            return reply(err);
        }
            
        if(!user){
            return callback(null, false);
        }
            
        if(user.password === session.password){
            return callback(null, true, user);
        }
        
        return callback(null, false);
            
    }); 
}

const getTest = {
    auth: {
        strategy: "session"
    },
    handler: function(request, reply){
        return reply("You are logged in and can see this super thing user: " + request.auth.credentials.username);
    }
}

exports.get = function(){
    const handler = {};
    handler.getHome = getHome;
    handler.getLogin = getLogin;
    handler.getRegister = getRegister;
    handler.postRegister = postRegister;
    handler.postLogin = postLogin;
    handler.getTest = getTest;
    return handler;
}

exports.register = function(plugin, options, next){
    console.log("[Plugin] Handler loaded");
    
    // Set our strategy
    plugin.auth.strategy('session', 'cookie', {
        password: 'supersecret', // cookie secret
        cookie: 'session', // Cookie name
        isSecure: false, // required for non-https applications
        validateFunc: validate
    });
    
    next();
}

exports.register.attributes = {
    name: "handler",
    version: require("./package.json").version
}