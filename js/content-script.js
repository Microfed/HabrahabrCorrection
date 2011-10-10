/**
 * @fileOverview Контент-скрипт, который будет внедряться в страницы хабра-статей. Рисует окошки и отправляет сообщения
 * пользователям-авторам статей.
 * @author <a href="mailto:microfed@gmail.com">Goder</a>
 */

/**
    @namespace Содержит весь функционал контент-скрипта.
    @name ContentScript
*/
$(function () {
    'use strict';
    /**@lends ContentScript*/

    var URL_SEND_MESSAGE = "http://habrahabr.ru/ajax/messages/add/",
        AUTHOR_CLASS_NAME = '.author',
        AUTHOR_CLASS_NAME_MODIFIED = '.author.karmaloaded',
        TYPE_OF_ERROR_SPELLING = 'Слитное и раздельное написание',
        TYPE_OF_ERROR_COMMA = 'Запятые',
        THERULES_URL = '<a href="http://therules.ru/',
        HABRAHABR_URL = 'habrahabr.ru',
        DIALOG_STYLE = "font-family:verdana,sans-serif;font-size:12px;text-align:left";

    /**
     * Проверяет, подходит ли текущая страница для работы скрипта.
     *
     * @return {boolean} Возвращает true, если текущая страница - это страница на хабре
     * с комментами (это означает, что открыта страница статьи).
     */
    function isCurrentUrlCorrect() {
        var isCorrect = false,
            url = document.baseURI;

        if (url.search(HABRAHABR_URL) !== -1) {
            isCorrect = true;
        }
        if (document.getElementById("comments") !== undefined) {
            isCorrect = isCorrect && true;
        } else {
            isCorrect = false;
        }
        return isCorrect;
    }

    /**
     * Загружает и добавляет файл стилей jQuery UI для
     * темы Redmond
     */
    function appendStyle() {
        $('head').append('<link type="text/css" href="' +
            chrome.extension.getURL("css/redmond/jquery-ui-1.8.16.custom.css") +
            '" rel="stylesheet" />');
    }

    /**
     * Возвращает тип ошибки (раздел правил), который был выбран пользователем.
     *
     * @return {string} Значение аттрибута value в ввиде строки.
     */
    function getErrorType() {
        return $('#type-of-error option:selected').val();
    }

    /**
     * @function
     */
    function getCommasList() {
        return $(
            '<option value="4_1">Сложные и придаточные</option>' +
                '<option value="4_2">Главное и придаточное предложения</option>' +
                '<option value="4_3">Однородные члены предложения</option>' +
                '<option value="4_4">Повторяющиеся слова</option>' +
                '<option value="4_5">Cравнительные обороты</option>' +
                '<option value="4_6">Определительные обороты</option>' +
                '<option value="4_7">Обстоятельственные обороты</option>' +
                '<option value="4_8">Уточняющие слова</option>' +
                '<option value="4_9">Вводные слова</option>' +
                '<option value="4_10">Обращения</option>' +
                '<option value="4_11">Междометия</option>' +
                '<option value="4_12">Утвердительные, отрицательные и вопросительные слова</option>'
        );
    }

    /**
     * @function
     */
    function getListOfSpellings() {
        return $(
            '<option value="5_1">Общие правила</option>' +
                '<option value="5_2">Существительные</option>' +
                '<option value="5_3">Прилагательные</option>' +
                '<option value="5_4">Числительные</option>' +
                '<option value="5_5">Наречия</option>' +
                '<option value="5_6">Предлоги, союзы, частицы, междометия</option>' +
                '<option value="5_7">Правописание не и ни</option>'
        );
    }

    /**
     * Возвращает тему в разделе правил.
     *
     * @param errorSubType Значение, определяющие раздел правил.
     * @return {string} часть ссылки на правило, соответсвующее выбранной теме.
     */
    function getErrorSubType(errorSubType) {
        var topic = '';
        switch (errorSubType) {
        case "5_2":
            topic = '-nouns';
            break;
        case "5_3":
            topic = '-adjectives';
            break;
        case "5_4":
            topic = '-numerals';
            break;
        case "5_5":
            topic = '-adverbs';
            break;
        case "5_6":
            topic = '-prepositions';
            break;
        case "5_7":
            topic = '-particles';
            break;
        }
        return topic;
    }

    /**
     * Добавляет текст к элементу textarea диалогового окна.
     *
     * @param {string} text Текст для добавления
     */
    function addTextToMessage(text) {
        var messageTextarea = $('#dialog-message-text');
        messageTextarea.text(messageTextarea.val(messageTextarea.val() + text));
    }


    /**
     * Добавляет событие onChange для элемента c id='type-of-error' диалогового окна.
     * При срабатывании события проверяется выделенный элемент. Дальнейшие действия
     * зависят от его содержания.
     */
    function addEventTypeOfError_Change() {
        $('#type-of-error').change(function () {
            var errorType = getErrorType(),
                subtypeOfErrorSelect = $('#subtype-of-error'),
                listToAppend = '',
                messageToAppend = '\n';

            subtypeOfErrorSelect.empty();

            switch (errorType) {
            case "1":
                messageToAppend += 'Пропущен пробел.';
                break;
            case "2":
                messageToAppend += 'Лишняя запятая.';
                break;
            case "3":
                messageToAppend += '<a href="http://tsya.ru">tsya.ru</a>';
                break;
            case "4":
                listToAppend = getCommasList();
                break;
            case "5":
                listToAppend = getListOfSpellings();
                break;
            }

            if (listToAppend.length > 1) {
                subtypeOfErrorSelect.append(listToAppend);
                subtypeOfErrorSelect.show();
            }

            addTextToMessage(messageToAppend);
        });
    }

    /**
     * Добавляет событие onChange для элемента c id='subtype-of-error' диалогового окна.
     * При срабатывании события проверяется выделенный элемент. Дальнейшие действия
     * зависят от его содержания.
     */
    function addEventSubTypeOfError_Change() {
        $('#subtype-of-error').change(function () {
            var messageToAppend = '\n',
                topic = '',
                errorSubType = $('#subtype-of-error').val();

            if (errorSubType[0] === '4') {
                messageToAppend += THERULES_URL + 'comma-' + errorSubType.substr(2) + '/">' + TYPE_OF_ERROR_COMMA + '</a>';
            } else {
                topic = getErrorSubType(errorSubType);
                messageToAppend += THERULES_URL + 'hyphen' + topic + '/">' + TYPE_OF_ERROR_SPELLING + '</a>';
            }

            addTextToMessage(messageToAppend);
        });
    }

    /**
     * Добавляет слой с диалоговым окном к элементу body текущей страницы.
     * Добавляет события для контролов внутри этого слоя.
     */
    function appendDialog() {
        $('body').append('<div id="habracorrect-dialog" title="Сообщение об ошибке" style=' + DIALOG_STYLE + ' hidden>' +
            '<p id="dialog-author-name"></p>' +
            '<p id="dialog-message-title"><b>Заголовок:</b>&nbsp;</p>' +
            '<p><b>Текст сообщения:</b></p>' +
            '<textarea id="dialog-message-text" cols="60" rows="8" maxlength="1000" required></textarea>' +
            '<select id="type-of-error">' +
            '<option value="1">Пропущен пробел</option>' +
            '<option value="2">Лишняя запятая</option>' +
            '<option value="3">Тся/ться</option>' +
            '<option value="4">Запятые</option>' +
            '<option value="5">Различное написание (слитное/дефис)</option>' +
            '</select>' +
            '</br>' +
            '<select id="subtype-of-error" style="width : 200px" hidden></select>' +
            '</div>');

        addEventTypeOfError_Change();
        addEventSubTypeOfError_Change();
    }

    if (isCurrentUrlCorrect()) {
        appendStyle();
        appendDialog();
    }

    /**
     * Возвращает имя автора статьи.
     *
     * @return {string} Ник автора статьи
     */
    function getAuthorName() {
        var author;
        if ($(AUTHOR_CLASS_NAME).length) {
            author = $(AUTHOR_CLASS_NAME + ' a').text();
        } else {
            // Некоторые расширения для хабры меняют имя класса
            author = $(AUTHOR_CLASS_NAME_MODIFIED + ' a').text();
        }
        return author;
    }

    /**
     * Возвращает заголовок статьи.
     *
     * @return {string} Название статьи
     */
    function getArticleTitle() {
        var title = $('.post .title');
        //удаляем все лишние символы в начале и конце заголовка
        return title.text().replace(/^\s*|\s*$|[\t\n]/g, '');
    }

    /**
     * Возвращает выделенный текст.
     *
     * @return {string} Выделенный текст
     */
    function getSelectedText() {
        var txt;
        if (window.getSelection) {
            txt = window.getSelection().toString();
        } else if (document.getSelection) {
            txt = document.getSelection();
        } else if (document.selection) {
            txt = document.selection.createRange().text;
        }
        return txt;
    }

    /**
     *  Возвращает выделенный текст, как цитату.
     *
     * @param {string} articleUrl Ссылка на статью
     * @return {string} Текст ошибки, подготовленный для сообщения
     */
    function getContentText(articleUrl) {
        return 'Ошибка в статье <a href="' + articleUrl + '">' + getArticleTitle() + '</a>\n<blockquote>' + getSelectedText() + '</blockquote>';
    }

    /**
     * Обнуляет состояние контролов диалогового окна.
     */
    function resetDialogFields() {
        $('#dialog-author-name').empty();
        $('#dialog-message-title').empty();
        $('#dialog-author-name').append("<b>Кому:</b>&nbsp;");
        $('#dialog-message-title').append("<b>Заголовок:</b>&nbsp;");
        $('#dialog-message-text').empty();
        $('#subtype-of-error').empty();
        $('#subtype-of-error').hide();
    }

    /**
     * Устанавливает значение для поля в диалоговом окне.
     *
     * @param name Имя автора статьи
     */
    function setAuthorName(name) {
        $('#dialog-author-name').append(name);
    }

    /**
     * Устанавливает значение для поля в диалоговом окне.
     *
     * @param title Название статьи
     */
    function setMessageTitle(title) {
        $('#dialog-message-title').append(title);
    }

    /**
     * Устанавливает значение для поля в диалоговом окне.
     *
     * @param text Текст сообщения
     */
    function setMessageText(text) {
        $('#dialog-message-text').val(text);
    }

    /**
     * Заполняет предварительной информацией поля диалогового окна.
     *
     * @param name Имя автора
     * @param title Название статьи
     * @param text Текст сообщения
     */
    function setDialogContent(name, title, text) {
        setAuthorName(name);
        setMessageTitle(title);
        setMessageText(text);
    }

    /**
     * Возвращает текст сообщения, написанный пользователем.
     *
     * @return Текст сообщения
     */
    function getMessageText() {
        return $('#dialog-message-text').val();
    }

    /**
     * Проверяет ответ севера. Если ответ содержит информацию
     * об ошибке, сообщает эту информацию пользователю
     * посредством alert()
     *
     * @param response Ответ на запрос к серверу
     */
    function alertWhenFail(response) {
        var resp = $(response).find('error');
        if (resp[0] !== undefined) {
            alert(resp[0].textContent);
        }
    }

    /**
     * Отправляет данные на сервер post-методом
     *
     * @param data Данные
     * @param url Адрес отправки
     */
    function sendDataPost(data, url) {
        $.post(url, data, function (response) {
            alertWhenFail(response);
        });
    }

    /**
     * Отправляет сообщение фоновой странице расширения, отправляя данные для формирования сообщения
     * об ошибке; принимает ответ и шлет сформированное сообщение автору статьи. Для успешнйо отправки
     * сообщения требуется быть аутентифицированным пользователем.
     *
     * @param name Имя автора статьи
     * @param title Название статьи
     * @param messageText Текст сообщения
     */
    function sendRequestToBackgroundPage(name, title, messageText) {
        chrome.extension.sendRequest({to_send_data: true, send_author: name, send_title: title, send_text: messageText},
            function (response) {
                sendDataPost(response.send_data, URL_SEND_MESSAGE);
            });
    }

    /**
     * Показывает диалоговое окно для отправки сообщения автору статьи.
     * Добавляет события для контролов диалогового окна.
     *
     * @param {string} name Имя автора статьи
     * @param {string} title Название статьи
     */
    function showDialog(name, title) {
        $('#habracorrect-dialog').attr('hidden', 'true');
        $('#habracorrect-dialog').dialog({
            width: 500
        }, {
            height: 360
        }, {
            buttons: {
                "Опечатка!": function () {
                    addTextToMessage("\nОпечатка!");
                },
                "Отправить": function () {
                    sendRequestToBackgroundPage(name, title, getMessageText());
                    $(this).dialog("close");
                },
                "Отменить": function () {
                    $(this).dialog("close");
                }
            }
        });

        $('.ui-dialog-buttonpane').find('button:contains("Опечатка!")').css("margin-right", "180px");
    }

    /**
     * Заполняет необходимые поля и показывает диалоговое окно пользователю.
     */
    function startDialog() {
        if (isCurrentUrlCorrect()) {
            var articleUrl = document.baseURI,
                author = getAuthorName(),
                title = 'Ошибка в статье "' + getArticleTitle() + '"',
                content = getContentText(articleUrl);
            resetDialogFields();
            setDialogContent(author, title, content);
            showDialog(author, title);
        }
    }

    /**
     * Добавляет событие для сочетания клавиш Ctrl+Enter.
     * При срабатывании показывает диалоговое окно для отправки сообщения об ошибке.
     */
    window.addEventListener("keydown", function (event) {
        var modifier = event.ctrlKey || event.metaKey;
        if (modifier && event.keyCode === 13) {
            startDialog();
        }
    }, false);
});