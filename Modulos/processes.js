const url = require("url");
const fs = require("fs");
const crypto = require('crypto');
const processes = require("./processes.js");


module.exports.GETrequest = function (request, response) {
    var parsedUrl = url.parse(request.url, true);
    var pathname = parsedUrl.pathname;
    var query = parsedUrl.query;    //este precisa do parsedbody
    var body = "";

    request.on("data", function (chunk) {
        body += chunk;
    });
    request.on("end", function () {
        switch (pathname) {
            case "/update": //SO EXISTE UPDATE COM METHOD: GET
                break;
        }

    });
    request.on("close", function (err) { // conexao tem de encerrar
        response.end();
    });
    request.on("error", function (err) { // erro generico nao encontrado
        console.log(err.message);
        response.writeHead(404, {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        });
        response.end();
    });

}

module.exports.POSTrequest = function (request, response) {
    var parsedUrl = url.parse(request.url, true);
    var pathname = parsedUrl.pathname;
    var body = "";
    request.on("data", function (chunk) {
        body += chunk;
    });
    request.on("end", function () {
        try {
            var parsedbody = JSON.parse(body);
        }
        catch (err) {
            console.log(err.message);
            response.writeHead(400, {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }); // se apanhou erro significa que foi um erro do cliente!
            response.write(JSON.stringify({ error: "Error parsing JSON request: " + err }));
            response.end();
            return;
        }
        switch (pathname) {
            case "/register":
                if (parsedbody["nick"] == null) { //nick nao pode ser null
                    response.writeHead(400, {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }); 
                    response.write(JSON.stringify({ error: "Nick is undefined" }));
                    response.end();
                    break;
                }
                else if (parsedbody["password"] == null) { // pass nao pode ser null
                    response.writeHead(400, {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            });
                    response.write(JSON.stringify({ error: "Pass is undefined" }));
                    response.end();
                    break;
                }

                var sucOUnao = analisaCredent(parsedbody["nick"], parsedbody["password"]);

                 if (sucOUnao == 1) { // 1 é vazio
                    response.writeHead(400, {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            });
                    response.write(JSON.stringify({ error: "User registered with a different password" }));
                    response.end();
                } else if (sucOUnao == 2) { // 2 nao encontrou ou nao conseguiu escrever no ficheiro
                    response.writeHead(500, {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            });
                    response.end();
                } else { //sucesso
                    response.writeHead(200, {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            });
                    response.write(JSON.stringify({}));
                    response.end();
                } 
                break;


            case "/ranking":
                if (parsedbody["size"] == null) { // size nao pode ser null
                    response.writeHead(400, {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            });
                    response.write(JSON.stringify({ error: "Undefined size" }));
                    response.end();
                    break;
                }
                else if (!Number.isInteger(parseInt(parsedbody["size"]))) { // size tem de ser numero inteiro positivo
                    response.writeHead(400, {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            });
                    response.write(JSON.stringify({ error: "Invalid size" }));
                    response.end();
                    break;
                }

                try {
                    var fileData = fs.readFileSync("Data/users.json");
                    fileData = JSON.parse(fileData.toString())["users"];
                }
                catch (err) { //server nao conseguiu encontrar users.json
                    console.log(err);
                    response.writeHead(500, {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            });
                    response.end();
                    break;
                }

                var array = [];
                var i = 0;
                for (i = 0; i < fileData.length; i++) {
                    if (fileData[i]["games"][parsedbody["size"]] != null)
                        array.push({ nick: fileData[i]["nick"], victories: fileData[i]["games"][parsedbody["size"]]["victories"], games: fileData[i]["games"][parsedbody["size"]]["games"] });
                }

                var j = 0;
                for (i = 0; i < array.length; i++) {
                    for (j = i + 1; j < array.length; j++) {
                        if (array[j]["victories"] > array[i]["victories"]) {
                            var temp = array[i];
                            array[i] = array[j];
                            array[j] = temp;
                        }
                    }
                }
                array = array.slice(0, 10);
                array = { ranking: array };
                response.writeHead(200, {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            });
                response.write(JSON.stringify(array));
                response.end();
                break;
        }
    });
}

function analisaCredent(nick, pwd){
	if(nick == "" || pwd == ""){ //vazio
		return 1;
	}
	pwd = crypto
				.createHash('md5')
				.update(pwd)
				.digest('hex');

	try{
		var fileData = fs.readFileSync("Data/users.json"); //exportado do file system
		fileData = JSON.parse(fileData.toString())["users"];
	}
	catch(err){
		console.log(err);
		return 2; //nao existe ficheiro de usuarios
	}

	var flag = 0;
	var i;
	for(i=0; i<fileData.length; i++){
		if(fileData[i]["nick"] == nick){
			flag = 1;
			break;
		}
	}
	if(flag==0){
		fileData.push({nick: nick, password: pwd, games: {}});
		fileData = {users: fileData};
		try{
			fs.writeFileSync("Data/users.json", JSON.stringify(fileData));
		}
		catch(err){
			console.log("Couldnt write on the users.json file");
			console.log(err);
			return 2;
		}
	}
	else{ //flag ==1
		if(fileData[i]["password"] == pwd){
			return 0;
		}
		else
			return 1;
	}
}