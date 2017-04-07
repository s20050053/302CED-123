var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var serverurl = 'mongodb://localhost:27017/my_database_name';

var http = require('http');
var url = require('url');
fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var qs = require('querystring');
format = function() {
    return util.format.apply(null, arguments);
};

var mimeTypes = {
           "html": "text/html",
           "jpeg": "image/jpeg",
           "jpg": "image/jpeg",
           "png": "image/png",
           "js": "text/javascript",
           "css": "text/css"};

var loginSucsuccessful = false;
var loginFail = false;

var sendSucsuccessful = false;
var sendFail = false;

var server =http.createServer(function (request, response) {
  
  var urlParts = url.parse(request.url);
  var fullPath = urlParts.pathname;
       //var page = 'pages' + urlParts.pathname;
  var page = './' + urlParts.pathname;
  console.log(fullPath);
       var jsonUserOject = '';
       var action, form, formData, msg, publicPath, urlData;
        urlData = url.parse(request.url, true);
        action = urlData.pathname;
        publicPath = __dirname + "\\public\\";
	      console.log(request.url);	
  
  
if (request.method === "POST") {
return request.on('data', function(data) {
formData += data;
return request.on('end', function() {  
  
  var user;
                  user = qs.parse(formData);
									msg = JSON.stringify(user);
                  //console.log("obj = qs.parse(formData);");
                 // console.log(user);
									//console.log("msg = JSON.stringify(user);");
                  //console.log(msg);
									//console.log("Test end");
                  response.writeHead(200, {
                    "Content-Type": "application/json",
                    "Content-Length": msg.length
                  });
                  var obj = JSON.parse(msg);
                  if (request.url == "/" ) {
										console.log("There is a login request");
										var username = obj.username;
										var password = obj.password;
										MongoClient.connect(serverurl, function (err, db) {
												if (err) {
													console.log('Unable to connect to the mongoDB server. Error:', err);
												} else {
												//Successfully connected to database
												
										
												db.collection('users', function (err, collection) {
														collection.find().toArray(function(err, items) {
																if(err) throw err;
																if (items !== "") {
																	// Check whether the user account exists
																	for (var i=0; i<items.length; i++) {
                                    console.log('Connection established to', serverurl);
																		if (username == items[i].username && password == items[i].password) {
																			loginSucsuccessful = true;
																			sendSucsuccessful = true;
																			console.log("The user " + username + " password " + password + ".");
																		} else {
																			console.log("Login Fail");
																		}
																	}
																}
																console.log(items);            
														});
												});
												
												//Close connection
												db.close();
												}
										});
										
										
									}else if (request.url == "/signup") {  
 //var addusername = obj.username;
	//var addpassword = obj.password; 
MongoClient.connect(serverurl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', serverurl);
    
    var adddata = { username: obj.username, password: obj.password, email:obj.email};
   
                           
    var collection = db.collection('users', function (err, collection){
    //var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
    //var user2 = {name: 'modulus user', age: 22, roles: ['user']};
    //var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

    collection.insert([adddata], function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      }
      	/*collection.find().toArray(function(err, items) {
																if(err) throw err;    
																console.log(items);            
														});*/
      
});
      db.close();
    });
     //collection.remove(adddata);
  }
});
}
 
                    return response.end();
  
});
});                            
}
  
  
  
   if (request.url == '/') {
					form="index.html";
					fs.readFile(form, function(err, contents) {
          if (err !== true) {
            response.writeHead(200, {
              "Content-Type": "text/html"
            });
            response.end(contents);
          } else {
            response.writeHead(500);
						response.end('_testcb(\'{"message": "Hello world 444!"}\')');
            //return response.end;
          }
        });
            //response.writeHead(200, {'content-type': 'text/html'})
						//response.end();
            //response.end("<h1>歡迎光臨</h1><p><a href=\"/signup\">註冊</a></p>");
          // util.pump(fs.createReadStream('index.html'), response)
        }else if (request.url == '/home'){
             form = "home.html";
          fs.readFile(form, function(err, contents) {
             if (err !== true) {
            response.writeHead(200, {
              "Content-Type": "text/html"
            });
            response.end(contents);
          } else {
            response.writeHead(500);
			response.end('_testcb(\'{"message": "Hello world 444!"}\')');
            //return response.end;
          }
        });
      }else if (request.url == '/list'){
             form = "list.html";
          fs.readFile(form, function(err, contents) {
             if (err !== true) {
            response.writeHead(200, {
              "Content-Type": "text/html"
            });
            response.end(contents);
          } else {
            response.writeHead(500);
			response.end('_testcb(\'{"message": "Hello world 444!"}\')');
            //return response.end;
          }
        });
      }else if (request.url == '/signup'){
         form = "signup.html";
        fs.readFile(form, function(err, contents) {
       	if (err !== true) {
            response.writeHead(200, {
              "Content-Type": "text/html"
            });
				  	response.writeHead(500);
			response.end(contents);
          } else {
            response.writeHead(500);
							response.end('_testcb(\'{"message": "Hello world 444!"}\')');
            //return response.end;
          }
        });
      }
  
  
}).listen(4001);

var io = require("socket.io").listen(server);

	
function upload() {
	if (loginSucsuccessful === true) {
		//Send message if login is successful
		if (sendSucsuccessful) {
			console.log("Send message to html");
			io.emit("login", { message: "Successful!" });
			sendSucsuccessful = false;
		}
	}
	
	if (loginFail === true) {
		//Send message if login is fail
		if(sendFail) {
			console.log("Can not send message to html");
			io.emit("unlogin", { message: "Failed!" });
			loginFail = false;
			sendFail = false;
		}
	}
}
setInterval(upload, 3000);


