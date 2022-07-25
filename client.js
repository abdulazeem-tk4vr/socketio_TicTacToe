//taking in command line arguments for the port as directed
var io = require('socket.io-client')(
    `http://${process.argv[2]}:${process.argv[3]}`
  );

var command = require('readcommand');
var playerName = "";

// message to confirm that the user has connected
io.on("start", function(playerCount) {
    playerName = playerCount;
    console.log(`You have connected to http://${process.argv[2]}:${process.argv[3]}`);
})

// fucntion to log messages
io.on('message', function(data) {
    console.log(data);
});

io.on('disconnect', function() {
    process.exit(0);
})

// loop to keep the users playing and throwing in exceptions for edge cases encountered
command.loop(function(err, args, str, next) {
    if (args[0] == "r") {
        io.emit("resign", playerName);
    } else {
      if (args[0] >= 1 && args[0] <= 9) {
        io.emit("play", args[0]);
      } else {
        console.log("Please enter in a number from 1-9.")
      }
    }    
    return next();
  });