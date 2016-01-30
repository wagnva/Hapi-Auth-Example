"use strict";

const Glue = require("glue");
const Hapi = require("hapi");

const config = {
    manifest: {
        connections: [{
            port: 8000
        }],
        registrations: [
            {
                plugin: {
                    register: "inert"
                }
            },
            {
                plugin: {
                    register: "hapi-auth-cookie"
                }
            },
            {
                plugin: {
                    register: "./db"
                }  
            },
            {
                plugin: {
                    register: "./handler"
                }
            },
            {
                plugin: {
                    register: "./routes"
                }
            }
        ]
    }
}

Glue.compose(config.manifest, {relativeTo: __dirname}, function(err, server){
    if(err){
        console.log("[Server] Error while starting the server ", err)
    }
    server.start(function(){
        console.log("[Server] Server started...")
    })
});