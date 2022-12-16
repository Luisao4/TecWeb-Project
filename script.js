/* 2nd PART  UPDATES: alerts => Rectangles with information*/
// MENU FOR MOBILE DEVICES -------------------------------------------------------------

const hamburger = document.querySelector('.header .nav-bar .nav-list .hamburger');
const mobile_menu = document.querySelector('.header .nav-bar .nav-list ul');
const menu_item = document.querySelectorAll('.header .nav-bar .nav-list ul li a');
const header = document.querySelector('.header.container');

hamburger.addEventListener('click', () => {
	hamburger.classList.toggle('active');
	mobile_menu.classList.toggle('active');
});

document.addEventListener('scroll', () => {
	var scroll_position = window.scrollY;
	if (scroll_position > 250) {
		header.style.backgroundColor = '#29323c';
	} else {
		header.style.backgroundColor = 'transparent';
	}
});
// ----------------------------------------------------



var divsArray = ["gameFormDiv", "gameDiv", "restartGameDiv", "leaveGameDiv", "rankingDiv"];
var gameInProgress = false;
var mainGame;
var timeOutMessage;
var timer;
var timeLeft;
var wins = 0;
var games = 0;
var ratio;
var flag = 0;

function displayRules() {
	document.getElementById("rules").style.display = "inline-block";
	document.getElementById("Brules").style.display = "inline-block";
	const brules = document.getElementById("Brules");
	brules.addEventListener('click', () => {
		document.getElementById("Brules").style.display = "none";

		document.getElementById("rules").style.display = "none";
		//console.log("ya");
	});
}

function displayAuthors() {
	document.getElementById("authors").style.display = "inline-block";
	document.getElementById("Bauthors").style.display = "inline-block";

	const baut = document.getElementById("Bauthors");
	baut.addEventListener('click', () => {
		document.getElementById("authors").style.display = "none";

		document.getElementById("Bauthors").style.display = "none";
	})
}

function displayRanking() {
	if (flag == 0) { // offline
		
		document.getElementById("ranking").style.display = "inline-block";
		document.getElementById("Branking").style.display = "inline-block";
		const rank = document.getElementById("ranking");
		const paragraph = document.createElement("p");
		paragraph.setAttribute("id", "Div1");
		if (games == 0) {
			paragraph.textContent = " Wins: " + wins + "\n Losses: " + (games - wins) + "\n Ratio: 0%";
			rank.append(paragraph);
		}
		else
			paragraph.textContent = " Wins: " + wins + "\n Losses: " + (games - wins) + "\n Ratio: " + ((wins / games) * 100).toFixed(2) + "%";
		rank.append(paragraph);
		const branking = document.getElementById("Branking");
		branking.addEventListener('click', () => {
			document.getElementById("ranking").style.display = "none";
			document.getElementById("Branking").style.display = "none";
			paragraph.remove();

		});
	}
	else { //online
		//document.getElementById("BrankingON").style.display= "block";
		document.getElementById("Branking").style.display="none";
		x = {
			"group": user.group,
			"size": game.size
		}
		fetch(url + '/ranking',{
		method: 'POST',
		body:JSON.stringify(x)		
	})
	      .then(checkonlinerank)
		  .then(onlinerank); 
		//  .catch(console.log);
	}
}

function checkonlinerank(response){
	if(response.status >= 200 && response.status < 300) //positive response
		return response.json();
	else
		alert("Server error!");
}
function onlinerank(response){
	if (response.ranking != undefined) {
		//console.log(response.ranking.length);
		var json = response.ranking;
		var test =
		  "<table id=test_>" +
		  "<tr>" +
		  "<th>Jogador&nbsp;&nbsp;</th>" +
		  "<th>Número de Jogos&nbsp;&nbsp;</th>" +
		  "<th>Número de Vitórias&nbsp;&nbsp;</th>" +
		  "<th>Número de Derrotas&nbsp;&nbsp;</th>" +
		  "<th>Percentagem de Vitórias&nbsp;&nbsp;</th>" +
		  "</tr>";
	
	
		for (var j = 0; j < json.length; j++) {
	
		  test +=
			"<tr>" +
			"<td>" + json[j].nick + "</td>" +
			"<td>" + json[j].games + "</td>" +
			"<td>" + json[j].victories + "</td>" +
			"<td>" + (json[j].games - json[j].victories) + "</td>" +
			"<td>" + ((json[j].victories / json[j].games) * 100).toFixed(1) + "%" + "</td>";
		  test += "</tr>";
		}
	
		test +=
		  "</table>" +
		  "</div>";
	
		document.getElementById("table").style.display = "block";
		document.getElementById("table").innerHTML = test;


	  } else {
		document.getElementById("table").innerHTML = "Classificações indisponíveis ou vazias";
	}
closerank(); // create a button maybe
}

function closerank(){
	let y = document.getElementById("table");
	  y.addEventListener('click', () => {
		// click then close
		document.getElementById("table").style.display="none";
		//console.log("entrou");
	  });
}

function showSingleplayerOptions() {
	document.getElementById("singleplayerOptionsDiv").style.display = "block";
	document.getElementById("multiplayerOptionsDiv").style.display = "block";
}

function showGameDiv() {
	document.getElementById("gameDiv").style.display = "block";
}

function playGame() {
	var dif = document.getElementById("difficultyForm").elements["difficultyButton"].value;
	document.getElementById("quitbutton").style.display = "block";
	var firstPlayer = document.getElementById("playFirstForm").elements["playFirstButton"].value;

	var boardSize = document.getElementById("boardSizeForm").elements["boardSizeInput"].value;

	if (boardSize % 1 != 0.0 || boardSize <= 0) { //number with colon
		showGameForm(false);
		return;
	}

	mainGame = new nimGame(dif, firstPlayer, boardSize);

	mainGame.initiateGame();


}

function showGameForm(goodBoardSize) {

	if (gameInProgress) {
		document.getElementById("gameDiv").style.display = "block";
		document.getElementById("leaveGameDiv").style.display = "block";
		return;
	}

	document.getElementById("difficultyForm").reset();
	document.getElementById("playFirstForm").reset();
	document.getElementById("boardSizeForm").reset();

	document.getElementById("gameFormDiv").style.display = "block";

	document.getElementById("optionsDiv").style.display = "block";

	showSingleplayerOptions();

	if (goodBoardSize)
		document.getElementById("wrongBoardSizeText").style.display = "none";
	else
		document.getElementById("wrongBoardSizeText").style.display = "block";
}

function Board(x, y) {
	this.boardQuantityArray = [];
	this.boardDivArray = [];
	this.xMax = x;
	this.yMax = y;
	this.boardDiv;

	this.createBoard = function () {
		this.boardDiv = document.createElement("div");
		this.boardDiv.className = "boardDiv";
		this.boardDiv.id = "boardDiv";
		this.boardDiv.style.width = "" + (90 * this.xMax) + "px";
		document.getElementById("gameDiv").appendChild(this.boardDiv);

		for (var i = 0; i < this.yMax; i++) {
			this.boardQuantityArray.push(i + 1);
			var tempDiv = document.createElement("div");
			tempDiv.id = "cellDiv" + i;
			tempDiv.className = "cellDiv";
			for (var j = i; j >= 0; j--) {
				var piece = new Piece(i, j);
				tempDiv.appendChild(piece.html);
			}
			this.boardDiv.appendChild(tempDiv);
		}
	}
}
function resetGameDiv() {
	var elem = document.getElementById("gameDiv");
	document.getElementById("restartGameDiv").style.display = "none";
	while (elem.firstChild)
		elem.removeChild(elem.firstChild);
}

function nimGame(dif, firstPlayer, boardSize) {
	this.dif = dif;
	this.firstPlayer = firstPlayer;
	this.boardSize = boardSize;

	this.board;
	this.moves;
	this.pc;

	this.initiateGame = function () {
		this.board = new Board(this.boardSize, this.boardSize);
		this.pc = new PC(this.dif);
		this.moves = 0;

		gameInProgress = true;

		resetGameDiv();
		document.getElementById("wrongBoardSizeText").style.display = "none";

		var messageH = document.createElement("h1");
		messageH.id = "messageH1";
		document.getElementById("gameDiv").appendChild(messageH);

		var timerH = document.createElement("h2");
		timerH.id = "timerH2";
		document.getElementById("gameDiv").appendChild(timerH);

		this.board.createBoard();

		showGameDiv();

		document.getElementById("leaveGameDiv").style.display = "block";

		this.updateMessageDiv();

		var _this = this;
		if (this.firstPlayer == "pc")
			setTimeout(function () { _this.pc.move(); }, 1500);
	}

	this.updateMessageDiv = function () {
		if ((this.moves % 2 == 0 && this.firstPlayer == "player") || (this.moves % 2 != 0 && this.firstPlayer != "player")) {
			document.getElementById("messageH1").innerHTML = "-> It's <ins>your turn</ins> <-";
			setTimer();
		}
		else {
			document.getElementById("messageH1").innerHTML = "-> It's the <ins>Computer's</ins> turn <-";
			setTimer();
		}
	}

	this.deletePiece = function (x, y) {
		for (var i = y; i < this.board.boardQuantityArray[x]; i++)
			document.getElementById("piece" + x + "|" + i).className = "pieceDeleted";

		this.board.boardQuantityArray[x] = y;

		if (this.checkGameOver() == true) {
			this.endGame();
			return;
		}

		this.moves++;

		if (gameInProgress == true)
			this.updateMessageDiv();

		var _this = this;
		if ((this.moves % 2 == 0 && this.firstPlayer == "pc") || (this.moves % 2 != 0 && this.firstPlayer != "pc"))
			setTimeout(function () { _this.pc.move(); }, 1500);
	}

	this.checkGameOver = function () {
		var gameOver = true;
		for (var i = 0; i < this.board.boardQuantityArray.length; i++) {
			if (this.board.boardQuantityArray[i] > 0)
				return false;
		}

		return true;
	}

	this.endGame = function () {
		if ((this.moves % 2 == 0 && this.firstPlayer == "player") || (this.moves % 2 != 0 && this.firstPlayer != "player")) {
			document.getElementById("messageH1").innerHTML = "YOU WON 😃 CONGRATULATIONS!";
			wins++;
			games++;
		}
		else {
			document.getElementById("messageH1").innerHTML = "The Computer won 😣";
			games++;
		}

		gameInProgress = false;

		document.getElementById("restartGameDiv").style.display = "block";
		document.getElementById("boardDiv").style.display = "none";
		document.getElementById("leaveGameDiv").style.display = "none";
		document.getElementById("timerH2").style.display = "none";
	}
}
function PC(dif) {
	this.dif = dif;
	this.easyMove = function () {
		while (true) {
			var x = Math.floor(Math.random() * mainGame.board.boardQuantityArray.length);
			if (mainGame.board.boardQuantityArray[x] > 0) {
				var y = Math.floor(Math.random() * mainGame.board.boardQuantityArray[x]);

				mainGame.deletePiece(x, y);

				break;
			}
		}
	}

	this.hardMove = function () {
		for (var i = 0; i < mainGame.board.boardQuantityArray.length; i++) {
			for (var j = 0; j < mainGame.board.boardQuantityArray[i]; j++) {
				var oldValue = mainGame.board.boardQuantityArray[i];
				mainGame.board.boardQuantityArray[i] = j;
				if (this.xor() != 0) {
					mainGame.board.boardQuantityArray[i] = oldValue;
				}
				else {
					mainGame.board.boardQuantityArray[i] = oldValue;
					mainGame.deletePiece(i, j);

					return;
				}
			}
		}
		var x = Math.floor(Math.random() * mainGame.board.boardQuantityArray.length);
		while (mainGame.board.boardQuantityArray[x] == 0)
			x = Math.floor(Math.random() * mainGame.board.boardQuantityArray.length);
		mainGame.deletePiece(x, mainGame.board.boardQuantityArray[x] - 1);
	}

	this.xor = function () {
		var value = 0;
		for (var i = 0; i < mainGame.board.boardQuantityArray.length; i++)
			value ^= mainGame.board.boardQuantityArray[i];

		return value;
	}

	this.move = function () {
		switch (this.dif) {
			case "easy":
				this.easyMove();
				break;

			case "normal":
				var rand = Math.floor(Math.random() * 2);

				if (rand == 0)
					this.easyMove();
				else
					this.hardMove();

				break;

			case "hard":
				this.hardMove();
				break;

			default:
				break;
		}
	}
}
function Piece(x, y) {
	this.x = x;
	this.y = y;
	this.html = document.createElement("img");
	this.html.className = "piece";
	this.html.id = "piece" + x + "|" + y;
	this.html.src = "imgs/logo.jpg";

	this.html.onmouseover = function () {
		if (this.className != "pieceDeleted" && ((mainGame.moves % 2 == 0 && mainGame.firstPlayer == "player") || (mainGame.moves % 2 != 0 && mainGame.firstPlayer != "player"))) {
			this.className = "pieceHovered";
			var length = this.id.length;
			var temp = this.id.indexOf("|");
			var x = parseInt(this.id.slice(5, temp));
			var y = parseInt(this.id.slice(temp + 1, length));
			for (; y < mainGame.board.boardQuantityArray[x]; y++)
				document.getElementById("piece" + x + "|" + y).className = "pieceHovered";
		}
	}

	this.html.onmouseleave = function () {
		if (this.className != "pieceDeleted" && ((mainGame.moves % 2 == 0 && mainGame.firstPlayer == "player") || (mainGame.moves % 2 != 0 && mainGame.firstPlayer != "player"))) {
			this.className = "piece";
			var length = this.id.length;
			var temp = this.id.indexOf("|");
			var x = parseInt(this.id.slice(5, temp));
			var y = parseInt(this.id.slice(temp + 1, length));
			for (; y < mainGame.board.boardQuantityArray[x]; y++)
				document.getElementById("piece" + x + "|" + y).className = "piece";
		}
	}

	this.html.onclick = function () {
		if (this.className != "pieceDeleted" && ((mainGame.moves % 2 == 0 && mainGame.firstPlayer == "player") || (mainGame.moves % 2 != 0 && mainGame.firstPlayer != "player"))) {
			this.deletePiece();
		}
	}

	this.html.deletePiece = function () {
		var length = this.id.length;
		var temp = this.id.indexOf("|");
		var x = parseInt(this.id.slice(5, temp));
		var y = parseInt(this.id.slice(temp + 1, length));

		mainGame.deletePiece(x, y);
	}
}
function setTimer() {
	timeLeft = 60000;
	clearInterval(timer);
	timer = setInterval(function () {

		// Time calculations for days, hours, minutes and seconds
		var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

		// Display the result in the element with id="demo"
		document.getElementById("timerH2").innerHTML = minutes + "m " + seconds + "s ";

		// If the count down is finished, write some text
		if (timeLeft == 0) {
			clearInterval(timer);
			if (flag == 0) {
				document.getElementById("timerH2").innerHTML = "Time to play exceeded!";
			}
			else {
				document.getElementById("timerH2").innerHTML = "Time to find an opponent exceeded!";
				document.getElementById("messageH1").innerHTML = "Something went wrong!";
			}
			document.getElementById("leaveGameDiv").style.display = "none";
			if (document.getElementById("boardDiv") != null)
				document.getElementById("boardDiv").style.display = "none";
			gameInProgress = false;
			leaveGame();
		}

		timeLeft = timeLeft - 1000;
	}, 1000);
}

function restartGame() {
	document.getElementById("restartGameDiv").style.display = "none"
	playGame();
}
function leaveGame() {
	clearTimeout(timeOutMessage);
	if (flag == 0) {
		document.getElementById("messageH1").innerHTML = "The Computer won 😣";
		games++;
	}
	else {
		document.getElementById("messageH1").innerHTML = "Something went wrong!";
	}
	gameInProgress = false;

	document.getElementById("restartGameDiv").style.display = "block";
	document.getElementById("restartgamediv").style.display = "none"
	document.getElementById("boardDiv").style.display = "none";
	document.getElementById("leaveGameDiv").style.display = "none";
	document.getElementById("timerH2").style.display = "none";

	clearInterval(timer);
}
function leaveOnline() {
	x = {
		"nick": user.username,
		"password": user.password,
		"game": game.gameID
	}
	//console.log(x);

	fetch(url + "/leave", {
		method: "POST",
		body: JSON.stringify(x)
	})
		// .then(response => console.log(response)) // -> print HTTP request
		// .catch(console.log);
		.then(_leave);
}
function _leave(response) {
	clearInterval(timer);
	document.getElementById("timerH2").style.display = "none";
	if (response.status >= 200 && response.status < 300) {
		document.getElementById("messageH1").innerHTML = "You gave up!";
		document.getElementById("onlineQuit").style.display = "none";

	}
	else 
		document.getElementById("messageH1").innerHTML = "Something went wrong!";
	
}

function logout() {
	document.getElementById("logsec").style.display = "block";
	document.getElementById("after").style.display = "none";
	document.getElementById("suc").style.display = "none";
}
// pvp game show only the board size (size in join function)
function pvp() {
	flag=1;
	document.getElementById("tabuleiro").style.display = "block"
	document.getElementById("difficultyForm").style.display = "none";
	document.getElementById("playFirstForm").style.display = "none";
	document.getElementById("startbutton").style.display = "none";
	document.getElementById("pvpstart").style.display = "block";
	document.getElementById("singleplayerOptionsDiv").style.display = "none";
	document.getElementById("restartgamediv").style.display = "none";
}
// quick game show game options vs AI
function meAI() {
	flag=0;
	document.getElementById("onlineQuit").style.display = "none";
	document.getElementById("tabuleiro").style.display = "block"
	document.getElementById("difficultyForm").style.display = "block";
	document.getElementById("playFirstForm").style.display = "block";
	document.getElementById("startbutton").style.display = "block";
	document.getElementById("pvpstart").style.display = "none";
	document.getElementById("singleplayerOptionsDiv").style.display = "block";
}
// const host = 'twserver.alunos.dcc.fc.up.pt';
// const port = '8008';
// const url = 'http://' + host + ':' + port;

class Game {
	constructor(gameID, size) {
		this.gameID = gameID;
		this.size = size;
	}
}

var game = new Game(null, null);


function join() {
	let boardSize = document.getElementById("boardSizeForm").elements["boardSizeInput"].value;
	
	if (boardSize <= 0) {		//if board size is wrong display a error message
		const eBS = document.createElement("h1");
		eBS.id = "errorboardsize";
		document.getElementById("gameDiv").appendChild(eBS);
		eBS.innerHTML = "Please enter a valid board size!";
	}
	else {
		flag = 1;
		game.size = boardSize;
		//console.log(game);
		x = {
			"group": user.group,
			"nick": user.username,
			"password": user.password,
			"size": boardSize
		}
		// console.log(x);
		// console.log("above is whats passed to the server");
		fetch(url + '/join', {
			method: "POST",
			body: JSON.stringify(x),
		})
		// catch for reject .then for resolve
			.then(catchgameID) //get gameID
			//.then(console.log);
			.then(waitgame); //initialize variable
		document.getElementById("onlineQuit").style.display = "block";
		document.getElementById("quitbutton").style.display = "none";
	}
}
function catchgameID(response) {
	if (response.status >= 200 && response.status < 300) {
		return response.json();
	}
	else
		alert("Something went terribly wrong!"); //should never get here
}

function waitgame(response) {

	game.gameID = response.game;
	resetGameDiv();
	//console.log(game);
	var messageH = document.createElement("h1");
	messageH.id = "messageH1";
	document.getElementById("gameDiv").appendChild(messageH);

	var timerH = document.createElement("h2");
	timerH.id = "timerH2";
	document.getElementById("gameDiv").appendChild(timerH);

	setTimer();

	showGameDiv();

	flag = 1;

	initiateEventSource(game.gameID);
	gameInProgress = true;
	messageH.innerHTML = "Waiting for the oponent...";
	mainGame = new nimOnlineGame(game.gameID, game.size);
	document.getElementById("leaveGameDiv").style.display = "block";
}

function nimOnlineGame(GameID, Size) {
	//Info de IDs e Dize(Para emparelhar)
	this.gameId = GameID;
	this.boardSize = Size;
	//Info de estado de jogo
	this.turn;
	this.board;
	//Start
	this.initiateGame = function (firstPlayer) {
		//Inicializa tamanho de board, semelhante a configuração singleplayer
		this.board = new Board(this.boardSize, this.boardSize);
		//Cria configuração de board HTML com método createBoard
		this.board.createBoard();
		//Quem é o 1º jogador? Usa método presente em initiateEventSource para determinar a que jogador(Username) pertence cada turno, para assim o representar
		this.turn = firstPlayer;																				//		/
		this.updateMessageDiv();																				//	   /
		//	  /
		//	 /
	}																											//	/
	//Esta mensagem atualiza ao fim de cada turno															 //	   /
	this.updateMessageDiv = function () {																		 //	  /
		clearTimeout(timeOutMessage);																		 //	 /
		document.getElementById("messageH1").innerHTML = "-> It's <ins>" + this.turn + "</ins> turn <-";//<-----/Aqui
	}
	this.deletePiece = function (x, y) {
		//Prepara x com info de jogada --> Envia com POST
		x = {
			"nick": user.username,
			"password": user.password,
			"game": this.gameId,
			"group": user.group,
			"stack": x,
			"pieces": y
		}
		//console.log(x);
		//console.log("Testing JSON for moves");
		fetch(url + '/notify', {
			method: "POST",
			body: JSON.stringify(x),
		})
			.then(evaluateplays);
	}
	//Confirma deleção da peça
	this.deletePieceConfirmation = function (x, y) {
		for (var i = y; i < this.board.boardQuantityArray[x]; i++)
			document.getElementById("piece" + x + "|" + i).className = "pieceDeleted";
		this.board.boardQuantityArray[x] = y;
	}
	//Termina jogo
	this.endGame = function (winner) {
		clearTimeout(timeOutMessage);

		document.getElementById("messageH1").innerHTML = "The player <ins>" + winner + "</ins> won!";

		gameInProgress = false;

		document.getElementById("restartGameDiv").style.display = "block";
		document.getElementById("boardDiv").style.display = "none";
		document.getElementById("leaveGameDiv").style.display = "none";
		document.getElementById("timerH2").style.display = "none";

		clearInterval(timer);
		evtSource.close();
	}
}

function evaluateplays(response) {
	if (response.status >= 200 && response.status < 300) {
		//console.log("validPlay");
	}
	else {
		document.getElementById("messageH1").innerHTML = "Error! Not your turn to play.";
		timeOutMessage = setTimeout("mainGame.updateMessageDiv()", 3000);
	}
}

function initiateEventSource(gameId) {
	// console.log(game.gameID);
	// console.log(gameId);
	// console.log(user.username);
	//encodeURIComponent -> to encode args to urlencode (numbers and letters stay the same but special characters = & or %X)
	evtSource = new EventSource(url + '/update?nick=' + encodeURIComponent(user.username) + '&game=' + encodeURIComponent(gameId)); 
	evtSource.onmessage = function (packet) {
		var json = JSON.parse(packet.data); //encode to JS so its easy to compare
		//Recebe packet de dados
		//console.log(json);

		/* ADIÇÕES GAME LOGIC */


		//Lógica para turnos e jogadas
		if (json["turn"] != null) {//Se há turns -->									
			//																			 
			if (json["stack"] != null) {//E há stacks não vazios --> Continua com jogo  
				var x = json["stack"];
				var y = json["pieces"];
				mainGame.deletePieceConfirmation(x, y);
				mainGame.turn = json["turn"];//Turn pertence a que usename?
				mainGame.updateMessageDiv();//Update mensagem de turno
				if (mainGame.turn == user.username)
					setTimer();
				else {
					clearInterval(timer);
					document.getElementById("timerH2").innerHTML = "1m 0s"
				}
			}
			else { //Se 
				var firstPlayer = json["turn"];
				mainGame.initiateGame(firstPlayer);
				if (firstPlayer == user.username)
					setTimer();
				else {
					clearInterval(timer);
					document.getElementById("timerH2").innerHTML = "1m 0s"
				}
			}
		}
		else if (json["winner"] != null) {//Se o turno for null, então verifica se já houve vencedor. Se alguém venceu, chama endGame com o username presente no JSON
			mainGame.endGame(json["winner"]);//O winner é o que teve o turno final, vai sacar nome a JSON
		}
		//Se o JSON resultou em erro, verifica qual foi
		else if (json["error"]) {
			if (json["error"] == "Invalid game reference") {
				clearTimeout(timeOutMessage);
				document.getElementById("messageH1").innerHTML = "Error! Incorrect game ID.";
			}
			else {
				clearTimeout(timeOutMessage);
				document.getElementById("messageH1").innerHTML = json["error"];
			}
		}
		//Se não houve vencedores.
		else if (json["winner"] == null) {
			if (timeLeft <= 0) {//Ficou sem tempo, prepara timeout
				setTimeout(function () {
					gameInProgress = false;
					showGameForm(true, true);
					evtSource.close();
				}
					, 3000);
			}
			else {
				gameInProgress = false;
				showGameForm(true, true);
				evtSource.close();
			}
		}
	}
}