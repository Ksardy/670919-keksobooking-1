'use strict';

(function () {

  var PIN_LIMIT = 5;

  window.activation = {
    pinsCreated: false,
    getDisabledFields: function (input) {
      for (var t = 0; t < adForms.length; t++) {
        adForms[t].disabled = input;
      }
    }
  };

  // Возвращаем карту в исходное состояние, затемняем ее
  document.querySelector('.map').classList.add('map--faded');

  var adForms = document.querySelectorAll('.ad-form fieldset');

  // Все поля формы делаем неактивными

  window.activation.getDisabledFields(true);

  // Активация страницы

  var form = document.querySelector('.ad-form');

  var enableForm = function () {
    form.classList.remove('ad-form--disabled');
    for (var n = 0; n < adForms.length; n++) {
      adForms[n].removeAttribute('disabled');
    }
  };

  var despatch = document.querySelector('.ad-form');
  var resetButton = document.querySelector('.ad-form__reset');

  var onMainPinClick = function () {
    window.map.showMap.classList.remove('map--faded');
    enableForm();
    window.form.activationForm();
    window.form.onSelectedRoomsClick();
    window.filter.activationFilter();
    if (!window.activation.pinsCreated) {
      var limitAds = window.map.ads;
      if (limitAds.length > PIN_LIMIT) {
        limitAds = limitAds.slice(0, PIN_LIMIT);
      }
      window.map.createPinsMap(limitAds);

      window.form.onSelectPriceClick();
      window.activation.pinsCreated = true;
    }
    despatch.addEventListener('submit', window.form.onDespatchClick);
    resetButton.addEventListener('click', window.form.onResetPage);
    document.removeEventListener('keydown', onKeyMainPin);
  };

  var onKeyMainPin = function (evt) {
    if (evt.keyCode === window.map.ENTER_KEYCODE) {
      onMainPinClick();
    }
  };

  window.activation.onMainPinClick = onMainPinClick;

})();
