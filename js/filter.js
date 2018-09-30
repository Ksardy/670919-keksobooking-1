'use strict';

(function () {

  var DEBOUNCE_INTERVAL = 300;
  var FILTER_LIMIT = 5;

  var houseType = document.querySelector('#housing-type');
  var housePrice = document.querySelector('#housing-price');
  var houseRoom = document.querySelector('#housing-rooms');
  var houseGuest = document.querySelector('#housing-guests');
  var houseFeatures = document.querySelector('#housing-features');

  var houseFilter = document.querySelector('.map__filters');

  var priceMap = {
    any: {
      minPrice: 0,
      maxPrice: Infinity
    },
    middle: {
      minPrice: 10000,
      maxPrice: 50000
    },
    low: {
      minPrice: 0,
      maxPrice: 10000
    },
    high: {
      minPrice: 50000,
      maxPrice: Infinity
    },
  };

  var lastTimeout;

  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };

  var filter = {

    checkType: function (ad) {
      if (houseType.value === 'any') {
        return true;
      }
      return ad.offer.type === houseType.value;
    },

    checkPrice: function (ad) {
      return ad.offer.price >= priceMap[housePrice.value].minPrice && ad.offer.price <= priceMap[housePrice.value].maxPrice;
    },

    checkRooms: function (ad) {
      if (houseRoom.value === 'any') {
        return true;
      }
      return ad.offer.rooms === Number(houseRoom.value);
    },

    checkGuests: function (ad) {
      if (houseGuest.value === 'any') {
        return true;
      }
      return ad.offer.guests === Number(houseGuest.value);
    }
  };

  var updateFunction = function () {
    var checkFeatures = function () {
      var selectedFeatures = houseFeatures.querySelectorAll('input:checked');
      for (var i = 0; i < selectedFeatures.length; i++) {
        similarAds = similarAds.filter(function (ad) {
          return ad.offer.features.includes(selectedFeatures[i].value);
        });
      }
      return similarAds;
    };

    var similarAds = window.map.ads.filter(function (it) {
      return filter.checkType(it) && filter.checkPrice(it) && filter.checkGuests(it) && filter.checkRooms(it);
    });

    checkFeatures();
    window.form.deletePin();
    var cardClose = document.querySelector('.map__card.popup');
    if (cardClose) {
      cardClose.remove();
    }

    if (similarAds.length > FILTER_LIMIT) {
      similarAds = similarAds.slice(0, FILTER_LIMIT);
    }
    window.map.createPinsMap(similarAds);
    return similarAds;
  };

  var onUpdateFunction = function () {
    debounce(updateFunction);
  };

  var activationFilter = function () {
    for (var i = 0; i < houseFilter.children.length; i++) {
      houseFilter.children[i].addEventListener('change', onUpdateFunction);
    }
  };

  var resetFilter = function () {
    for (var i = 0; i < houseFilter.children.length; i++) {
      houseFilter.children[i].removeEventListener('change', onUpdateFunction);
    }
  };

  window.filter = {
    activationFilter: activationFilter,
    resetFilter: resetFilter
  };
})();
