// O ficheiro principal, que carrega os restantes módulos, define a função re processamento de pedido e inicia a sua escuta

"use strict";

const PORT = 8019 //8000 + grupo
const http = require('http');
const processes = require('./Modulos/processes.js');
const fs = require('fs');
const url = require('url');
//verificar tipo de ficheiro a ser transmitido
function getTypes(pathname){
    let typeContent= 'application/octet-stream'; //isto e o nosso caso de erro(nunca vai acontecer na vida real)

    let type = mediaTypes; //buscar os tipos
    for(let key in type){
        if(type.hasOwnProperty(key)){ //existe o tipo
            if(pathname.indexOf(key) > -1) //se existir o index
                typeContent= type[key]; //return do q deu
        }
    }
    return typeContent;
}

//conf.mediatype -> array tipos de media
//conf.defaultIndex -> 'index.html
//conf.documentRoot -> './'
var mediaTypes = {
    'txt':      'text/plain',
    'html':     'text/html',
    'css':      'text/css',
    'js':       'application/javascript',
    'json':     'application/json',
    'png':      'image/png',
    'jpg':      'image/jpeg'
}

const server = http.createServer(function (request, response) {

	const preq = url.parse(request.url,true);
    var pathname = preq.pathname;
    let body = '';
    console.log(request.method);

    switch(request.method) {
        case "POST":
             processes.POSTrequest(request,response);
             break;

            //  case "GET":
            //  processes.GETrequest(request,response);
            //  break;
        default:
        
        	//para ver se e uma request vazia
    		if(pathname==='/'){
        		pathname = 'index.html';
    		}
    		response.setHeader('Content-Type', getTypes(pathname));
    		fs.readFile( './' + pathname, function(error, data){
       			if(error){
            			response.writeHead(404);
            			response.end('404 - File Not Found');
        		}
        		else{
            			response.writeHead(200);
            			response.end(data);
        		}
    		});	          
		break;
    }
});
server.listen(PORT);

console.log("Server is running -> localhost:8019");
