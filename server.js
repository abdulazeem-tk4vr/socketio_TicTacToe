var http = require('http');

function server() {}

// variables used to connect to various components involved
var app = http.createServer(server)
var socket = require('socket.io');
var io = socket(app);
var port = process.argv[2] || 5050;
var board = require('./board')

app.listen(port);

// variables used for keeping track of user gameplay
var playerCount = 0;
var users = {};
var currentUser = 0;
var gameEnded = false;

function reset() {
    board.resetGame()
    playerCount = 0
    users = {}
    gameEnded = false
}

// function meant for showing which player has won
function won(playerId) {
    if (playerId == 0) {
        io.emit("message", "Game won by first player.")
    } else {
        io.emit("message", "Game won by second player.")
    }
    gameEnded = true
    users[0].disconnect()
    users[1].disconnect()
}

// function used to declare a tie
function tie() {
    io.emit("message", "Game is tied.")
    gameEnded = true
    users[0].disconnect()
    users[1].disconnect()
}

// function used to start the game and deal with edge cases
io.on("connection", function(socket) {
    socket.emit("start", playerCount)
    var playerId = playerCount;

    if(playerCount >= 2){
        socket.emit("message","Please exit from the game, the game has reached the limit");
        socket.disconnect();
    } else {
        users[playerCount++] = socket;
    }

    if(playerCount == 2){
        users[0].emit("message", "Game started. You are the first player.");
        users[1].emit("message", "Game started. You are the second player.");
        
        board.showBoard(function (message) {
            io.emit("message", message);
        })
        
        currentUser = 0;
        users[currentUser].emit("event", "Your turn.");
    } else {
        socket.emit("event", "Waiting for one more player.");
    }

    socket.on("play", function(position) {
        if (playerCount != 2) {
            socket.emit("message", "There are not enough players.")
        } else if (playerId != currentUser) {
            socket.emit("message", "It's not your turn.");
        } else {
            var response = board.play(playerId, position-1);
            if (response == "Tie") {
                tie()
            } else if (response == "Won") {
                won(playerId)
            } else if (response == "Invalid") {
                users[currentUser].emit("message", "Your play was invalid. Try again.")
            } else {
                currentUser = currentUser == 0 ? 1 : 0
                board.showBoard(function (message) {
                    io.emit("message", message);
                })
                users[currentUser].emit("event", "Your turn.")
            }
        }
    })

    // function meant for dealing with a resigned player
    socket.on("resign", function() {
        gameEnded = true
        if(playerCount == 1) {
            socket.disconnect()
        } else {
            if(playerId == "0") {
                io.emit("message", "Game won by second player due to resignation.");
            } else {
                io.emit("message", "Game won by first player due to resignation.");
            }
            users[0].disconnect()
            users[1].disconnect()
        }
    })

    // function used to deal with a player who has lost connection
    socket.on("disconnect", function() {
        playerCount--;
        if(gameEnded == false) {
            if(playerId == 0) {
                io.emit("message", "Game won by second player since first player disconnected.")        
                users[1].disconnect()
            } else {
                io.emit("message", "Game won by first player since second player disconnected.")
                users[0].disconnect()
            }
        }
        if(playerCount == 0) {
            reset()
        }
    })
});

