/**
 * @fileOverview Скрипт для фоновой страницы расширения
 * @author <a href="mailto:microfed@gmail.com">Goder</a>
 */

/**Текст рекламы*/
var AD_TEXT = '\n\n\n<sub>Составлено с помощью <a href="https://chrome.google.com/webstore/detail/kcdmenmdkfpfbdilcpfehcnahhkjfipe">HabraCorrection</a>.</sub>';

/*
 Добавляет в сообщение информацию о расширении в качестве
 рекламы, если пользователь установил соответствующую опцию.

 @return {string} Возвращает строку, содержащую рекламный текст.
 */
function getAdText() {
    'use strict';
    var isAdvtAttachToMessage = localStorage["isAdvtAttachToMessage"];

    if (isAdvtAttachToMessage === 'true') {
        return AD_TEXT;
    } else {
        return '';
    }
}

/**
 * Возващает настройки из localStorage
 * @param {string} name Название опции
 */
function getSettings(name) {
    'use strict';
    var value = '';

    if (name !== undefined) {
        if (localStorage[name] !== undefined) {
            value = localStorage[name];
        }
    }

    return value;
}

/**
 * Возвращает готовые для отправки данные.
 *
 * @param name Ник получателя
 * @param title Заголовок сообщения
 * @param text Текст сообщения
 * @return {string} Возвращает строку с подготовленными для отправки данными
 */
function getData(name, title, text) {
    'use strict';
    return "message[recipients]=" + encodeURIComponent(name) + "&message[title]=" + encodeURIComponent(title) +
        "&message[text]=" + encodeURIComponent(text) + encodeURIComponent(getAdText());
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        'use strict';
        var name, title, text, data, errorList;
        if (request.to_send_data === true) {
            name = request.send_author;
            title = request.send_title;
            text = request.send_text;
            data = getData(name, title, text);
            sendResponse({send_data: data});
        }
        if (request.get_errorList) {
            errorList = JSON.parse(localStorage['errorList']);
            sendResponse({data: errorList});
        }
        if (request.get_silentMode) {
            sendResponse({silent_mode: getSettings('silentMode')});
        }
        if (request.init_options) {
            Options.initOptions();
        }
    }
);
