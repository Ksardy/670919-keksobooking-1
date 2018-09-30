'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';

  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';

  var SUCCESS_STATUS = 200;

  var TIME_LOAD = 10000;

  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onLoad(xhr.response);
      } else {
        onError('Что-то пошло не так. Повторите попытку. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIME_LOAD;

    xhr.open('GET', URL);
    xhr.send();
  };

  var upLoad = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onLoad(xhr.response);
      } else {
        onError('Что-то пошло не так. Повторите попытку. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIME_LOAD;

    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  var onError = function (errorMessage) {

    var node = document.createElement('div');
    node.className = 'error';
    node.style = 'z-index: 100; text-align: center; background-color: red;';
    node.style.position = 'fixed';
    node.style.left = '50%';
    node.style.top = '50%';
    node.style.fontSize = '20px';
    node.style.width = '300px';
    node.style.height = '120px';
    node.style.transform = 'translate(-50%, -50%)';
    node.style.border = 'solid 2px black';
    node.style.padding = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style = 'z-index: 90; background-color: black;';
    overlay.style.opacity = '0.3';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    document.body.insertAdjacentElement('afterbegin', overlay);

    document.addEventListener('keydown', onEscPressClose);
    document.addEventListener('click', onClose);
  };

  var onClose = function () {
    var messageError = document.querySelector('.error');
    var overlay = document.querySelector('.overlay');
    if (messageError) {
      messageError.remove();
      overlay.remove();
      document.removeEventListener('keydown', onEscPressClose);
    }
  };

  var onEscPressClose = function (evt) {
    var messageError = document.querySelector('.error');
    if (messageError && evt.keyCode === window.map.ESC_KEYCODE) {
      close();
    }
  };

  window.backend = {
    load: load,
    upLoad: upLoad,
    onError: onError
  };
})();
