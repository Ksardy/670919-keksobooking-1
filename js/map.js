'use strict';

// Функция создания метки

(function () {

  window.map = {
    ENTER_KEYCODE: 13,
    ESC_KEYCODE: 27,
    ads: [],
    showMap: document.querySelector('.map'),
    createPinsMap: function (data) {
      var fragment = document.createDocumentFragment();
      data.forEach(function (currentValue) {
        var pin = createPin(currentValue);
        fragment.appendChild(pin);
      });
      mapPinsContainer.appendChild(fragment);
      mapPinsContainer.addEventListener('click', onMapPinsContainerClick);
    },
    mainPin: document.querySelector('.map__pin--main'),
  };

  var typeMap = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var createAds = function (data) {
    data.forEach(function (currentValue) {
      var id = data.indexOf(currentValue);
      window.map.ads[id] = currentValue;
      window.map.ads[id].id = id;
    });
  };

  window.backend.load(createAds, window.onError);

  var templateContent = document.querySelector('template').content;
  var pinTemplate = templateContent.querySelector('.map__pin');

  window.map.showMap.classList.remove('map--faded');

  var createPin = function (data) {

    var copy = pinTemplate.cloneNode(true);
    copy.style.left = data.location.x + 'px';
    copy.style.top = data.location.y + 'px';
    copy.querySelector('.map__pin img').src = data.author.avatar;
    copy.querySelector('.map__pin img').alt = data.offer.title;
    copy.id = '' + data.id;
    return copy;
  };

  var mapPinsContainer = document.querySelector('.map__pins');
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  var onMapPinsContainerClick = function (evt) {
    var button = tryGetButtonAsTarget(evt.target);
    if (button) {
      var pinIndex = button.id;
      if (pinIndex !== -1) {
        showCard(pinIndex);
      }
    }
  };

  var tryGetButtonAsTarget = function (target) {
    if (target !== window.map.mainPin && target.tagName === 'BUTTON') {
      return target;
    } else if (target.parentNode !== window.map.mainPin && target.parentNode.tagName === 'BUTTON') {
      return target.parentNode;
    }
    return undefined;
  };

  var showCard = function (index) {
    var mapCard = document.querySelector('.map__card');
    if (mapCard) {
      mapCard.parentNode.removeChild(mapCard);
    }
    var data = window.map.ads[index];
    var map = document.querySelector('section.map');
    map.insertBefore(createCard(data), mapFiltersContainer);

    var cardClose = document.querySelector('.map__card.popup');
    var closeButton = cardClose.querySelector('.popup__close');

    // Закрытие карточки
    var onCloseCardClick = function () {
      cardClose.remove();
      document.removeEventListener('keydown', onPopupEscPress);
    };

    var onPopupEscPress = function (evt) {
      if (evt.keyCode === window.map.ESC_KEYCODE && cardClose) {
        onCloseCardClick();
      }
    };

    closeButton.addEventListener('click', onCloseCardClick);
    closeButton.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.map.ENTER_KEYCODE) {
        onCloseCardClick();
      }
    });

    document.addEventListener('keydown', onPopupEscPress);
  };

  var template = document.querySelector('template');
  var cardTemplate = template.content.querySelector('.map__card');

  var translateFlatType = function (typeEn) {
    return typeMap[typeEn];
  };

  // Функция вывода карточки
  var createCard = function (data) {

    var card = cardTemplate.cloneNode(true);

    card.querySelector('.popup__title').textContent = data.offer.title;
    card.querySelector('.popup__text--address').textContent = data.offer.address;
    card.querySelector('.popup__text--price').textContent = data.offer.price + ' ₽/ночь';
    card.querySelector('.popup__type').textContent = translateFlatType(data.offer.type);
    card.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    card.querySelector('.popup__features').innerHTML = '';
    for (var k = 0; k < data.offer.features.length; k++) {
      card.querySelector('.popup__features').innerHTML += '<li class="popup__feature popup__feature--' + data.offer.features[k] + '"></li>';
    }
    card.querySelector('.popup__description').textContent = data.offer.description;
    card.querySelector('.popup__photos').innerHTML = '';
    for (var j = 0; j < data.offer.photos.length; j++) {
      card.querySelector('.popup__photos').innerHTML += '<img src="' + data.offer.photos[j] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
    }
    card.querySelector('.popup__avatar').src = data.author.avatar;

    return card;
  };

  var fragmentCards = document.createDocumentFragment();

  window.map.showMap.appendChild(fragmentCards);

  window.map.onMapPinsContainerClick = onMapPinsContainerClick;

})();
