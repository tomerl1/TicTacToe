; (function ($) {
    'use strict';

    var disabled = false;
    var currentPlayer = null;
    var playerSide = null;
    var aiSide = null;

    //console.log(arguments);
    var game = {

        winCombos: [[0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]],

        init: function () {
            this.resetBoard();
        },

        resetBoard: function () {
            this.board = [];
            for (var i = 1; i <= 9; i++) {
                this.board.push(null);
            }
        },

        setValue: function (index, value) {
            $('#box-' + index).text(value);
            this.board[index] = value;
        },

        getAvaliableMoves: function (board) {
            board = board || this.board;
            var moves = [];
            for (var i = 0; i < board.length; i++) {
                if (!board[i]) {
                    moves.push(i);
                }
            }
            return moves;
        },

        getAvaliableWinCombos: function (player) {
            var winCombos = this.getAvaliableMoves();
            for (var i = 0; i < this.board.length; i++) {
                if (this.board[i] === player) {
                    winCombos.push(i);
                }
            }
            return winCombos;
        },

        gameEnded: function (board) {
            board = board || this.board;
            var result = false;

            var moves = this.getAvaliableMoves(board);
            if (moves.length === 0) {
                result = true;
            }
            else if (this.getWinner(board)) {
                result = true;
            }

            return result;
        },

        getWinner: function (board) {
            board = board || this.board;
            var values = ['X', 'O'];
            for (var i = 0; i < values.length; i++) {
                var player = values[i];
                for (var j = 0; j < this.winCombos.length; j++) {
                    var win = true;
                    var combo = this.winCombos[j];
                    for (var k = 0; k < combo.length; k++) {
                        if (board[combo[k]] !== player) {
                            win = false;
                        }
                    }

                    if (win) {
                        return player;
                    }
                }
            }

            return null;
        },

        getOpponent: function (player) {
            return player === 'X' ? 'O' : 'X';
        },

        minmax: function (board, player, best) {
            best = best || -2;

            if (this.gameEnded(board)) {
                var winner = this.getWinner(board);
                if (!winner) { //tie
                    return 0;
                }
                else if (winner === 'X') {
                    return 1;
                }
                else if (winner === 'O') {
                    return -1;
                }
            }

            var moves = this.getAvaliableMoves(board);
            for (var i = 0; i < moves.length; i++) {
                board[moves[i]] = player;
                var val = this.minmax(board, this.getOpponent(player));
                board[moves[i]] = null;

                if (player === 'O') {
                    if (val > best) {
                        best = val;
                    }
                }
                else if (val < best) {
                    best = val;
                }
            }

            return best;
        },

        aiDetermineMove: function (player) {
            var moves = this.getAvaliableMoves();

            if (moves.length === 9) {
                return 5;
            }

            var value = -2;
            var bestMoves = [];
            var board = this.board.slice();
            for (var i = 0; i < moves.length; i++) {
                var move = moves[i];
                board[move] = player;
                var testValue = this.minmax(board, player, value);
                board[move] = null;

                if (testValue > value) {
                    value = testValue;
                    bestMoves = [move];
                }
                else if (testValue === value) {
                    bestMoves.push(move);
                }
            }

            return this.randomMove(bestMoves);
        },

        randomMove: function (movesArray) {
            return movesArray[Math.floor(Math.random() * movesArray.length)];
        }
    };

    function init() {
        if (!disabled) {
            console.log('loaded');
            chooseSide();
            game.init();

            $('.game-tile').on('click', function () {
                if (!disabled) {
                    disabled = !disabled;
                    var id = $(this).attr('id').substring(4);
                    makeMove(+id);

                    if (game.gameEnded()) {
                        var winner = game.getWinner();
                        console.log('The game has ended, "%s" won the game.', winner);
                    }
                    else {
                        var move = game.aiDetermineMove(currentPlayer);
                        makeMove(move);
                        if (game.gameEnded()) {
                            var winner = game.getWinner();
                            console.log('The game has ended, "%s" won the game.', winner);
                        }
                        else {
                            disabled = !disabled;
                        }
                    }
                }
            })
        }
    }

    function chooseSide() {
        $('#modal-side')
            .on('shown.bs.modal', function (e) {
                var $modal = $(e.target);
                $modal.find('a.btn').on('click', function (e) {
                    $modal.modal('hide');

                    playerSide = $(this).text();
                    aiSide = playerSide === 'X' ? 'O' : 'X';
                    console.log('Player is "%s", Computer is "%s"', playerSide, aiSide);
                    resetGame();
                })
            })
            .modal();
    }

    function radnomizeFirstPlayer() {
        var randNumber = getRandomArbitrary();
        var currentPlayer = randNumber === 0 ? playerSide : aiSide;
        console.log('Randomized current player: "%s"', currentPlayer);
        return currentPlayer;
    }

    function getRandomArbitrary() {
        return Math.floor(Math.random() * 2);
    }

    function resetGame() {
        currentPlayer = radnomizeFirstPlayer();

        if (currentPlayer === aiSide) {
            var move = game.aiDetermineMove(currentPlayer);
            makeMove(move);
        }
    }

    function makeMove(move) {
        game.setValue(move, currentPlayer);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    $(function () {
        init();
    });

})(jQuery)