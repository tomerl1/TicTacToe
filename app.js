; (function ($) {
    'use strict';

    var disabled = false;
    var playerSide = null;
    var aiSide = null;

    //console.log(arguments);

    function init() {
        if (!disabled) {
            console.log('loaded');
            chooseSide();
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
    }

    function getRandomArbitrary() {
        return Math.floor(Math.random() * 2);
    }

    function resetGame() {
        radnomizeFirstPlayer();
    }

    $(function () {
        init();
    });

})(jQuery)