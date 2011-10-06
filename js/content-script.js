/*function loadScript(url, callback) {

 var script = document.createElement("script")
 script.type = "text/javascript";

 script.onload = tryReady(0, callback)

 script.src = url;
 document.getElementsByTagName("head")[0].appendChild(script);
 }

 function tryReady(time_elapsed, callback) {
 // Continually polls to see if jQuery is loaded.
 if (typeof $ == "undefined") { // if jQuery isn't loaded yet...
 if (time_elapsed <= 5000) { // and we havn't given up trying...
 setTimeout(tryReady(time_elapsed+200, callback), 200); // set a timer to check again in 200 ms.
 }
 } else {
 callback();
 }
 }

 loadScript(chrome.extension.getURL('/js/jquery-1.6.2.min.js'), main);*/

$(function() {
    const URL_SEND_MESSAGE = "http://habrahabr.ru/ajax/messages/add/";
    const AUTHOR_CLASS_NAME = '.author';
    const AUTHOR_CLASS_NAME_MODIFIED = '.author.karmaloaded';
    const TYPE_OF_ERROR_SPELLING = 'Слитное и раздельное написание';
    const TYPE_OF_ERROR_COMMA = 'Запятые';
    const THERULES_URL = '<a href="http://therules.ru/';
    const HABRAHABR_URL = 'habrahabr.ru';
    const AD_TEXT = '\n\n<sub>Сделано с помощью <a href="https://chrome.google.com/webstore/detail/kcdmenmdkfpfbdilcpfehcnahhkjfipe">HabraCorrection</a>.</sub>';

    /*function load_javascript(src, callback) {
     var a = document.createElement('script');
     a.type = 'text/javascript';
     a.src = src;
     var s = document.getElementsByTagName('script')[0];
     s.parentNode.insertBefore(a, s);

     // attach it to the script tag
     window.addEventListener(a, "load", function() {
     callback();
     }, false);
     }

     //load_javascript("https://www.google.com/jsapi", onGoogleLoad);
     load_javascript("http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js", onGoogleLoad);

     function onGoogleLoad() {
     //google.load("jqueryui", "1.7.2");
     }*/

    if (IsCurrentUrlCorrect()) {
        appendStyle();
        appendDialog();
    }

    window.addEventListener("keydown", function (event) {
        var modifier = event.ctrlKey || event.metaKey;
        if (modifier && event.keyCode == 13 /* Enter*/) {
            startDialog();
        }
    }, false);


    function startDialog() {
        if (IsCurrentUrlCorrect()) {
            var articleUrl = document.baseURI;
            var author = getAuthorName();
            var title = 'Ошибка в статье "' + getArticleTitle() + '"';
            var content = getContentText(articleUrl);
            resetDialogFields();
            setDialogContent(author, title, content);
            showDialog(author, title)
        }
    }

    function alertWhenFail(response) {
        var resp = $(response).find('error');
        if (resp[0] != undefined) {
            alert(resp[0].textContent)
        }
    }

    function getSelectedText() {
        var txt;
        if (window.getSelection) {
            txt = window.getSelection().toString()
        } else if (document.getSelection) {
            txt = document.getSelection()
        } else if (document.selection) {
            txt = document.selection.createRange().text
        }
        return txt;
    }

    function getArticleTitle() {
        var title = $('.post .title');
        //удаляем все лишние символы в начале и конце заголовка
        return title.text().replace(/^\s*|\s*$|[\t\n]/g, '');
    }

    /*
     Возвращает выделенный текст, как цитату.
     */
    function getContentText(articleUrl) {
        return 'Ошибка в статье <a href="' + articleUrl + '">' + getArticleTitle() + '</a>\n<blockquote>' + getSelectedText() + '</blockquote>';
    }

    /*
     Возвращает имя автора статьи.
     */
    function getAuthorName() {
        var author;
        if ($(AUTHOR_CLASS_NAME).length) {
            author = $(AUTHOR_CLASS_NAME + ' a').text()
        } else {
            // Некоторые расширения для хабры меняют имя класса
            author = $(AUTHOR_CLASS_NAME_MODIFIED + ' a').text()
        }
        return author
    }

    /*
     Проверяет, подходит ли текущая страница для работы скрипта.
     Возвращает true, если текущая страница - это страница на хабре
     с комментами (это означает, что открыта страница статьи)
     */
    function IsCurrentUrlCorrect() {
        var isCorrect = false;
        var url = document.baseURI;

        if (url.search(HABRAHABR_URL) != -1) {
            isCorrect = true
        }
        if (document.getElementById("comments") !== undefined) {
            isCorrect = isCorrect && true
        } else {
            isCorrect = false
        }
        return isCorrect
    }

    function sendDataPost(data, url) {
        $.post(url, data, function(response) {
            alertWhenFail(response)
        })
    }


    function getErrorType() {
        return $('#type-of-error option:selected').val()
    }


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
                '<option value="4_12">Утвердительные, отрицательные и вопросительные слова</option>')
    }

    function getListOfSpellings() {
        return $(
            '<option value="5_1">Общие правила</option>' +
                '<option value="5_2">Существительные</option>' +
                '<option value="5_3">Прилагательные</option>' +
                '<option value="5_4">Числительные</option>' +
                '<option value="5_5">Наречия</option>' +
                '<option value="5_6">Предлоги, союзы, частицы, междометия</option>' +
                '<option value="5_7">Правописание не и ни</option>')
    }

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
        return topic
    }

    function appendDialog() {
        $('body').append('<div id="habracorrect-dialog" title="Сообщение об ошибке" style="font-family:verdana,sans-serif;font-size:12px;text-align:left" hidden>' +
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

    function addEventTypeOfError_Change() {
        $('#type-of-error').change(function() {
            var errorType = getErrorType();
            var subtypeOfErrorSelect = $('#subtype-of-error');
            var listToAppend = '';
            var messageToAppend = '\n';

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
                subtypeOfErrorSelect.show()
            }

            addTextToMessage(messageToAppend);
        })
    }

    function addEventSubTypeOfError_Change() {
        $('#subtype-of-error').change(function() {
            var messageToAppend = '\n';
            var topic = '';
            var errorSubType = $('#subtype-of-error').val();

            if (errorSubType[0] == '4') {
                messageToAppend += THERULES_URL + 'comma-' + errorSubType.substr(2) + '/">' + TYPE_OF_ERROR_COMMA + '</a>'
            }
            else {
                topic = getErrorSubType(errorSubType);
                messageToAppend += THERULES_URL + 'hyphen' + topic + '/">' + TYPE_OF_ERROR_SPELLING + '</a>'
            }

            addTextToMessage(messageToAppend);
        })
    }


    function appendStyle() {
        $('head').append('<link type="text/css" href="' +
            chrome.extension.getURL("css/redmond/jquery-ui-1.8.16.custom.css") +
            '" rel="stylesheet" />');
    }

    function setAuthorName(name) {
        $('#dialog-author-name').append(name);
    }

    function setMessageTitle(title) {
        $('#dialog-message-title').append(title);
    }

    function setMessageText(text) {
        $('#dialog-message-text').val(text);
    }

    function setDialogContent(name, title, text) {
        setAuthorName(name);
        setMessageTitle(title);
        setMessageText(text);
    }

    function SendRequestToBackgroundPage(name, title, messageText) {
        chrome.extension.sendRequest({
                to_send_data: true, send_author: name, send_title: title, send_text: messageText},
            function(response) {
                sendDataPost(response.send_data, URL_SEND_MESSAGE);
            });
    }

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
                    //var data = getData(name, title);
                    SendRequestToBackgroundPage(name, title, getMessageText())
                    $(this).dialog("close")
                },
                "Отменить": function () {
                    $(this).dialog("close")
                }
            }
        });

        $('.ui-dialog-buttonpane').find('button:contains("Опечатка!")').css("margin-right", "180px");
    }

    function getMessageText() {
        return $('#dialog-message-text').val();
    }

    function addTextToMessage(text) {
        var messageTextarea = $('#dialog-message-text');
        messageTextarea.text(messageTextarea.val(messageTextarea.val() + text))
    }

    function getData(name, title) {
        var content = getMessageText();
        return "message[recipients]=" + encodeURIComponent(name) + "&message[title]=" + encodeURIComponent(title) + "&message[text]=" + encodeURIComponent(content)
    }

    function resetDialogFields() {
        $('#dialog-author-name').empty();
        $('#dialog-message-title').empty();
        $('#dialog-author-name').append("<b>Кому:</b>&nbsp;");
        $('#dialog-message-title').append("<b>Заголовок:</b>&nbsp;");
        $('#dialog-message-text').empty();
        $('#subtype-of-error').empty();
        $('#subtype-of-error').hide()
    }
});