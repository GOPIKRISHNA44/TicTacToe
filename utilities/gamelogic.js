// Java program to find the 
// next optimal move for a this.player
class Move {

    constructor() {
        this.row = 0;
        this.col = 0;
    }

}
class Game {
    // This  returns true if there are moves
    // remaining on the board. It returns false if
    // there are no moves left to play.
    constructor(player, opponent) {
        this.player = this.player;
        this.opponent = this.opponent;
        console.log("SETTING VALS IN THIS "+this.player)
    }

    isMovesLeft(board) {
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                if (board[i][j] == "-")
                    return true;
        return false;
    }

    // This is the evaluation  as discussed
    // in the previous article ( http://goo.gl/sJgv68 )
    evaluate(b) {
        //if(this.player)
      //  console.log("&&&&&&&& "+this.player+this.opponent)
        // Checking for Rows for X or O victory.
        for (var row = 0; row < 3; row++) {
            if (b[row][0] == b[row][1] &&
                b[row][1] == b[row][2]) {
                if (b[row][0] == this.player)
                    return +10;
                else if (b[row][0] == this.opponent)
                    return -10;
            }
        }

        // Checking for Columns for X or O victory.
        for (var col = 0; col < 3; col++) {
            if (b[0][col] == b[1][col] &&
                b[1][col] == b[2][col]) {
                if (b[0][col] == this.player)
                    return +10;

                else if (b[0][col] == this.opponent)
                    return -10;
            }
        }

        // Checking for Diagonals for X or O victory.
        if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
            if (b[0][0] == this.player)
                return +10;
            else if (b[0][0] == this.opponent)
                return -10;
        }

        if (b[0][2] == b[1][1] && b[1][1] == b[2][0]) {
            if (b[0][2] == this.player)
                return +10;
            else if (b[0][2] == this.opponent)
                return -10;
        }

        // Else if none of them have won then return 0
        return 0;
    }

    // This is the minimax . It considers all
    // the possible ways the game can go and returns
    // the value of the board
    minimax(board,
        depth, isMax) {
        var score = this.evaluate(board);

        // If Maximizer has won the game 
        // return his/her this.evaluated score
        if (score == 10)
            return score;

        // If Minimizer has won the game 
        // return his/her evaluated score
        if (score == -10)
            return score;

        // If there are no more moves and 
        // no winner then it is a tie
        if (this.isMovesLeft(board) == false)
            return 0;

        // If this maximizer's move
        if (isMax) {
            var best = -1000;

            // Traverse all cells
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    // Check if cell is empty
                    if (board[i][j] == "-") {
                        // Make the move
                        board[i][j] = this.player;

                        // Call minimax recursively and choose
                        // the maximum value
                        best = Math.max(best, this.minimax(board,
                            depth + 1, !isMax));

                        // Undo the move
                        board[i][j] = "-";
                    }
                }
            }
            return best;
        }

        // If this minimizer's move
        else {
            var best = 1000;

            // Traverse all cells
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    // Check if cell is empty
                    if (board[i][j] == "-") {
                        // Make the move
                        board[i][j] = this.opponent;

                        // Call minimax recursively and choose
                        // the minimum value
                        best = Math.min(best, this.minimax(board,
                            depth + 1, !isMax));

                        // Undo the move
                        board[i][j] = "-";
                    }
                }
            }
            return best;
        }
    }

    // This will return the best possible
    // move for the this.player
    findBestMove(board) {
        var bestVal = -1000;
        var bestMove = new Move();
        bestMove.row = -1;
        bestMove.col = -1;
        // Traverse all cells, evaluate minimax  
        // for all empty cells. And return the cell 
        // with optimal value.
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                // Check if cell is empty
                if (board[i][j] == "-") {
                    // Make the move
                    console.log(i+" "+j+" %%%%%%%%%%%%"+board);
                    board[i][j] = this.player;

                    // compute evaluation  for this
                    // move.
                    var moveVal = this.minimax(board, 0, false);

                    // Undo the move
                    board[i][j] = "-";

                    // If the value of the current move is
                    // more than the best value, then update
                    // best/
                    if (moveVal > bestVal) {
                        console.log("coming fffffffffffffffffffffffff")
                        bestMove.row = i;
                        bestMove.col = j;
                        bestVal = moveVal;
                    }
                }
            }
        }

        console.log("The value of the best Move " +
            "is : %d\n\n", bestVal, bestMove.row, bestMove.col);

        return bestMove;
    }

    // Driver code
    findTheBestMove(board) {
        console.log("Came***********************" + board);
        var bestMove = this.findBestMove(board);
        console.log("The Optimal Move is ");
        console.log("ROW:  COL: " + bestMove.row + " " + 
        bestMove.col + " combined best move " + 
        this.getBestMoveHard(String(bestMove.row) + String(bestMove.col)));
        return   this.getBestMoveHard(String(bestMove.row) + String(bestMove.col));
    }
    getBestMoveHard(str) {
        console.log("strrr "+str); 
        if (str[0] == "0")
            return Number(str[1]);
        if (str[0] == "1")
            return Number(str[1]) + 3;
        return Number(str[1]) + 6
    }

}
// This code is contributed by PrinciRaj1992
function findTheBestMove(board) {
    console.log("Came" + board);
    //  let bestMove = this.findBestMove(board);
    console.log("The Optimal Move is ");
    console.log("ROW:  COL: ");
    return 1;
}

export { Game, Move, findTheBestMove };