'use strict';

(function () {
  // движение маркера

  var MAIN_PIN_X = 32;
  var MAIN_PIN_Y = 84;
  var TOP_Y = 130;
  var LOW_Y = 630;
  var LEFT_X = 0;
  var RIGHT_X = 1200;
  var mainPin = document.querySelector('.map__pin--main');

  window.action = {
    addCoordsToInput: function () {
      inputAddress.value = getMainPinXY(mainPin.style.left, MAIN_PIN_X) + ', ' + getMainPinXY(mainPin.style.top, MAIN_PIN_Y);
    }
  };

  // Определение координат mainPin
  var getMainPinXY = function (pos, gap) {
    return parseInt(pos.split('px', 1), 10) + gap;
  };

  // Добавление в инпут адреса формы
  var inputAddress = document.querySelector('#address');

  window.action.addCoordsToInput();

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      window.action.addCoordsToInput();

      var newTopCord = ((mainPin.offsetTop - shift.y) < TOP_Y - MAIN_PIN_Y) ? TOP_Y - MAIN_PIN_Y : mainPin.offsetTop - shift.y;
      newTopCord = ((newTopCord - shift.y) > LOW_Y - MAIN_PIN_Y) ? LOW_Y - MAIN_PIN_Y : newTopCord;


      var newLeftCord = ((mainPin.offsetLeft - shift.x) < LEFT_X - MAIN_PIN_X) ? LEFT_X - MAIN_PIN_X : mainPin.offsetLeft - shift.x;
      newLeftCord = (newLeftCord > RIGHT_X - MAIN_PIN_X) ? RIGHT_X - MAIN_PIN_X : newLeftCord;

      mainPin.style.top = newTopCord + 'px';
      mainPin.style.left = newLeftCord + 'px';

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', window.activation.onMainPinClick);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', window.activation.onMainPinClick);
    document.addEventListener('mouseup', onMouseUp);
  });

})();
