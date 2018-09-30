'use strict';

// Ввод данных

(function () {

  var MIN_PRICES = [0, 1000, 5000, 10000];

  var NUMB_ELEMENT = 2;

  var roomMap = {
    one: [1],
    two: [2, 1],
    three: [3, 2, 1],
    hundred: [100]
  };

  window.form = {
    START_PIN_X: 375,
    START_PIN_Y: 570,
    onSelectPriceClick: function () {
      var minPrice = MIN_PRICES[selectType.selectedIndex];
      inputPrice.placeholder = minPrice;
      inputPrice.min = minPrice;
    },
    onSelectedRoomsClick: function () {
      var selectRooms = Object.values(roomMap)[selectRoomNumber.selectedIndex];
      var selectedNumbers = Object.values(selectCapacity)[selectCapacity.selectedIndex];
      return selectRooms.indexOf(Number(selectedNumbers.value)) === -1 ? selectCapacity.setCustomValidity('Колличество гостей не соответсвует выбранной комнате') : selectCapacity.setCustomValidity('');
    },
    deletePin: function () {
      var mapPinsContainer = document.querySelector('.map__pins');
      mapPinsContainer.removeEventListener('click', window.map.onMapPinsContainerClick);
      while (mapPinsContainer.children[NUMB_ELEMENT]) {
        mapPinsContainer.removeChild(mapPinsContainer.children[2]);
      }
    }
  };


  var despatch = document.querySelector('.ad-form');

  var messageSuccess = document.querySelector('.success');

  var closeSuccess = function () {
    messageSuccess.classList.add('hidden');
    document.removeEventListener('keydown', onSuccessEscPress);
    document.removeEventListener('keydown', closeSuccess);
  };

  var onSuccessEscPress = function (evt) {
    if (evt.keyCode === window.map.ESC_KEYCODE) {
      closeSuccess();
    }
  };

  var confirmedSuccess = function () {
    messageSuccess.classList.remove('hidden');
    document.addEventListener('keydown', function () {
      closeSuccess();
    });
    document.addEventListener('click', closeSuccess);
  };

  var selectType = document.querySelector('#type');
  var inputPrice = document.querySelector('#price');

  var selectTimein = document.querySelector('#timein');
  var selectTimeout = document.querySelector('#timeout');

  var changeTime = function (timein, timeout) {
    if (timein.selectedIndex !== timeout.selectedIndex) {
      timeout.selectedIndex = timein.selectedIndex;
    }
  };

  var onChangeTimein = function () {
    changeTime(selectTimein, selectTimeout);
  };

  var onChangeTimeout = function () {
    changeTime(selectTimeout, selectTimein);
  };

  var selectRoomNumber = document.querySelector('#room_number');
  var selectCapacity = document.querySelector('#capacity');

  var activationForm = function () {
    selectType.addEventListener('change', window.form.onSelectPriceClick);
    selectRoomNumber.addEventListener('change', window.form.onSelectedRoomsClick);
    selectCapacity.addEventListener('change', window.form.onSelectedRoomsClick);
    selectTimein.addEventListener('change', onChangeTimein);
    selectTimeout.addEventListener('change', onChangeTimeout);
  };

  var removeForm = function () {
    selectType.removeEventListener('change', window.form.onSelectPriceClick);
    selectRoomNumber.removeEventListener('change', window.form.onSelectedRoomsClick);
    selectCapacity.removeEventListener('change', window.form.onSelectedRoomsClick);
    selectTimein.removeEventListener('change', onChangeTimein);
    selectTimeout.removeEventListener('change', onChangeTimeout);
  };

  var resetMyPin = function () {
    window.map.mainPin.style.top = window.form.START_PIN_X + 'px';
    window.map.mainPin.style.left = window.form.START_PIN_Y + 'px';
    window.action.addCoordsToInput();
  };
  var resetButton = document.querySelector('.ad-form__reset');

  var onResetPage = function () {
    removeForm();
    despatch.removeEventListener('submit', onDespatchClick);
    despatch.reset();
    window.form.deletePin();
    resetMyPin();
    var cardClose = document.querySelector('.map__card.popup');
    if (cardClose) {
      cardClose.remove();
    }
    window.map.showMap.classList.add('map--faded');
    despatch.classList.add('ad-form--disabled');
    window.filter.resetFilter();
    window.activation.getDisabledFields(true);
    window.activation.pinsCreated = false;
    resetButton.removeEventListener('click', onResetPage);
  };

  var onDespatchClick = function (evt) {
    evt.preventDefault();
    window.backend.upLoad(new FormData(despatch), function () {
      confirmedSuccess();
      onResetPage();
    }, window.backend.onError);
  };

  window.form.activationForm = activationForm;
  window.form.onDespatchClick = onDespatchClick;
  window.form.onResetPage = onResetPage;
})();
