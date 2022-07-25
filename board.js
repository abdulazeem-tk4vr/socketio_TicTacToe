var board = ["*", "*", "*", "*", "*", "*", "*", "*", "*"]
var count = 0

  // function used to display the tic-tac-toe board
  exports.showBoard = function(print) {
    var output = "\n";

    for (i = 0; i < board.length; i++) {
      output += board[i]
      if (i == 2 || i == 5 || i == 8) {
        output += "\n"
      } else {
        output += " "
      }
    }
    print(output);
  }

  // function used to determine input and result
  exports.play = function (player, position) {
    if (board[position] != "*") {
      return "Invalid"
    }
    
    count++;
    
    if(player == 0) {
      board[position] = "X"
    } else {
      board[position] = "O"
    }
    
    if (gameWon()) {
      return "Won"
    } else if (count >= 9) {
      return "Tie"
    } else {
      return ""
    }
  }

  exports.resetGame = function() {
    board = ["*", "*", "*", "*", "*", "*", "*", "*", "*"]
    count = 0
  };

  // function used to determine if the rules of the winning condition have met
  function gameWon() {
    if(
      (board[0] == board[1] && board[0] == board[2] && board[0] != "*") || 
      (board[3] == board[4] && board[3] == board[5] && board[3] != "*") || 
      (board[6] == board[7] && board[6] == board[8] && board[6] != "*") ||
      (board[0] == board[4] && board[0] == board[8] && board[0] != "*") ||  
      (board[2] == board[4] && board[2] == board[6] && board[2] != "*") ||
      (board[0] == board[3] && board[0] == board[6] && board[0] != "*") ||
      (board[1] == board[4] && board[1] == board[7] && board[1] != "*") ||
      (board[2] == board[5] && board[2] == board[8] && board[2] != "*")
    )  {
      return true
    }
    return false
  }

