var fs = require("fs");
var path = require("path");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  	//res.render('index', { title: 'Habits' });
  	//res.sendFile(__dirname + '/../public/html/welcome.html');
  	var filename = "/../public/html/welcome.html";
	var ext = path.extname(filename);
	var localPath = __dirname;
	var validExtensions = {
		".html" : "text/html",			
		".js": "application/javascript", 
		".css": "text/css",
		".txt": "text/plain",
		".jpg": "image/jpeg",
		".gif": "image/gif",
		".png": "image/png"
	};

	if (validExtensions[ext]) {
		
		localPath += filename;
		fs.exists(localPath, function(exists) {
			if(exists) {
				console.log("Serving file: " + localPath);
				fs.readFile(localPath, function(err, contents) {
					if(!err) {
						res.setHeader("Content-Length", contents.length);
						res.setHeader("Content-Type", ext);
						res.statusCode = 200;
						res.end(contents);
					} else {
						res.writeHead(500);
						res.end();
					}
				});
			} else {
				console.log("File not found: " + localPath);
				res.writeHead(404);
				res.end();
			}
		});

	} else {
		console.log("Invalid file extension detected: " + ext)
	}
});

/*router.get('/list', function(req, res, next) {
  res.render('list.html');
});*/

module.exports = router;

