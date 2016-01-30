const Handler = require("./handler").get();

exports.register = function(plugin, options, next){
    console.log("[Plugin] Routes loaded")
    
    plugin.route([{method: "GET", path: "/", config: Handler.getHome},
                  {method: "GET", path: "/login", config: Handler.getLogin},
                  {method: "GET", path: "/register", config: Handler.getRegister},
                  {method: "POST", path: "/register", config: Handler.postRegister},
                  {method: "POST", path: "/login", config: Handler.postLogin},
                  {method: "GET", path: "/test", config: Handler.getTest}]);
    
    next();
}

exports.register.attributes = {
    name: "routes",
    version: require("./package.json").version
}