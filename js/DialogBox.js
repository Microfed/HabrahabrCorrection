/**
 * @fileOverview Отвечает за работу с диалоговым окном.
 * @author <a href="mailto:microfed@gmail.com">Goder</a>
 */

/**
 * @class Отвечает за работу с диалоговым окном.
 * @constructor
 * @name DialogBox
 * @param {ErrorListManager} ErrorListManager Класс, отвечающий за работу со списком ошибок
 */
var DialogBox = function (ErrorListManager) {
    'use strict';
    this.ErrorListManager = ErrorListManager;
    this.DIALOG_STYLE = "font-family:verdana,sans-serif;font-size:12px;text-align:left";
};

/**
 * Загружает и добавляет файл стилей jQuery UI для
 * темы Redmond.
 */
DialogBox.prototype.appendStyle = function () {
    'use strict';
    $('head').append('<link type="text/css" href="' +
        chrome.extension.getURL("css/redmond/jquery-ui-1.8.16.custom.css") +
        '" rel="stylesheet" />');
};

/**
 * Добавляет текст к элементу textarea диалогового окна.
 *
 * @param {string} text Текст для добавления
 */
DialogBox.prototype.addTextToMessage = function (text) {
    'use strict';
    var messageTextarea = $('#dialog-message-text');
    messageTextarea.text(messageTextarea.val(messageTextarea.val() + text));
};


/**
 * Возвращает тип ошибки (раздел правил), который был выбран пользователем.
 *
 * @return {string} Значение text тега option в ввиде строки.
 */
DialogBox.prototype.getErrorType = function () {
    'use strict';
    return $('#type-of-error option:selected').text();
};
/**
 * Добавляет событие onChange для элемента c id='type-of-error' диалогового окна.
 * При срабатывании события проверяется выделенный элемент. Дальнейшие действия
 * зависят от его содержания.
 */
DialogBox.prototype.addEventTypeOfError_Change = function () {
    'use strict';
    var dialogBox = this,
        EventHandler = function () {
            var errorType = dialogBox.getErrorType(),
                subtypeOfErrorSelect = $('#subtype-of-error'),
                messageToAppend = '\n';

            subtypeOfErrorSelect.empty();
            messageToAppend += dialogBox.ErrorListManager.getErrorMessageText(errorType);
            if (dialogBox.ErrorListManager.isErrorHasSubTypes(errorType)) {
                dialogBox.appendErrorSubTypesList(errorType, subtypeOfErrorSelect);
                subtypeOfErrorSelect.show();
            }

            dialogBox.addTextToMessage(messageToAppend);
        };

    $('#type-of-error').change(EventHandler);
    $('#type-of-error').dblclick(EventHandler);
};

/**
 * Добавляет событие onChange для элемента c id='subtype-of-error' диалогового окна.
 * При срабатывании события проверяется выделенный элемент. Дальнейшие действия
 * зависят от его содержания.
 */
DialogBox.prototype.addEventSubTypeOfError_Change = function () {
    'use strict';
    var dialogBox = this,
        EventHandler = function () {
            var messageToAppend = '',
                errorSubType = dialogBox.getErrorSubType();

            messageToAppend += dialogBox.ErrorListManager.getErrorMessageText(errorSubType);
            dialogBox.addTextToMessage(messageToAppend);
        };

    $('#subtype-of-error').change(EventHandler);
    $('#subtype-of-error').dblclick(EventHandler);
};

/**
 * Добавляет слой с диалоговым окном к элементу body текущей страницы.
 * Добавляет события для контролов внутри этого слоя.
 */
DialogBox.prototype.appendDialog = function () {
    'use strict';
    var dialogBox = this;
    $('body').append('<div id="habracorrect-dialog" title="Сообщение об ошибке" style=' + dialogBox.DIALOG_STYLE + ' hidden>' +
        '<p id="dialog-author-name"></p>' +
        '<p id="dialog-message-title"><b>Заголовок:</b>&nbsp;</p>' +
        '<p><b>Текст сообщения:</b></p>' +
        '<textarea id="dialog-message-text" cols="60" rows="8" maxlength="1000" required></textarea>' +
        '<select id="type-of-error">' +
        '</select>' +
        '</br>' +
        '<select id="subtype-of-error" style="width : 200px" hidden></select>' +
        '</div>');

    dialogBox.addTypeOfErrorOptions();
    dialogBox.addEventTypeOfError_Change();
    dialogBox.addEventSubTypeOfError_Change();
};

/**
 * Обнуляет состояние контролов диалогового окна.
 */
DialogBox.prototype.resetDialogFields = function () {
    'use strict';
    $('#dialog-author-name').empty();
    $('#dialog-message-title').empty();
    $('#dialog-author-name').append("<b>Кому:</b>&nbsp;");
    $('#dialog-message-title').append("<b>Заголовок:</b>&nbsp;");
    $('#dialog-message-text').empty();
    $('#subtype-of-error').empty();
    $('#subtype-of-error').hide();
};

/**
 * Устанавливает значение для поля в диалоговом окне.
 *
 * @param name Имя автора статьи
 */
DialogBox.prototype.setAuthorName = function (name) {
    'use strict';
    $('#dialog-author-name').append(name);
};

/**
 * Устанавливает значение для поля в диалоговом окне.
 *
 * @param title Название статьи
 */
DialogBox.prototype.setMessageTitle = function (title) {
    'use strict';
    $('#dialog-message-title').append(title);
};

/**
 * Устанавливает значение для поля в диалоговом окне.
 *
 * @param text Текст сообщения
 */
DialogBox.prototype.setMessageText = function (text) {
    'use strict';
    $('#dialog-message-text').val(text);
};

/**
 * Заполняет предварительной информацией поля диалогового окна.
 *
 * @param name Имя автора
 * @param title Название статьи
 * @param text Текст сообщения
 */
DialogBox.prototype.setDialogContent = function (name, title, text) {
    'use strict';
    var dialogBox = this;
    dialogBox.setAuthorName(name);
    dialogBox.setMessageTitle(title);
    dialogBox.setMessageText(text);
};

/**
 * Возвращает текст сообщения, написанный пользователем.
 *
 * @return Текст сообщения
 */
DialogBox.prototype.getMessageText = function () {
    'use strict';
    return $('#dialog-message-text').val();
};

/**
 * Добавляет к заданному контролу для перечисления ошибок
 * option для каждого типа ошибки.
 */
DialogBox.prototype.addTypeOfErrorOptions = function () {
    'use strict';
    var dialogBox = this,
        getTypeOfErrorSelect = function () {
            return $('#type-of-error');
        },
        typeOfErrorSelect = getTypeOfErrorSelect();

    if (dialogBox.ErrorListManager.errorDict) {
        $.each(dialogBox.ErrorListManager.errorDict, function () {
            typeOfErrorSelect.append(new Option(this.title, 0));
        });
    }
};

/**
 * Добавляет элементы option, которые соответствуют
 * подтипам определенной ошибки, к заданному select
 *
 * @param {string} errorType Тип ошибки
 * @param {jQuery object} subtypeOfErrorSelect Select для подтипов ошибок
 */
DialogBox.prototype.appendErrorSubTypesList = function (errorType, subtypeOfErrorSelect) {
    'use strict';
    var dialogBox = this;
    $.each(dialogBox.ErrorListManager.errorDict, function () {
        if (this.title === errorType) {
            $.each(this.children, function () {
                subtypeOfErrorSelect.append(new Option(this.title, 0));
            });
        }
    });
};

/**
 * Показывает диалоговое окно для отправки сообщения автору статьи.
 * Добавляет события для контролов диалогового окна.
 *
 * @param {string} name Имя автора статьи
 * @param {string} title Название статьи
 */
DialogBox.prototype.showDialog = function (name, title, sendMessage) {
    'use strict';
    var dialogBox = this;
    $('#habracorrect-dialog').attr('hidden', 'true');
    $('#habracorrect-dialog').dialog({
        width: 500
    }, {
        height: 360
    }, {
        buttons: {
            "Опечатка!": function () {
                dialogBox.addTextToMessage("\nОпечатка!");
            },
            "Отправить": function () {
                sendMessage(name, title, dialogBox.getMessageText());
                $(this).dialog("close");
            },
            "Отменить": function () {
                $(this).dialog("close");
            }
        }
    });

    $('.ui-dialog-buttonpane').find('button:contains("Опечатка!")').css("margin-right", "180px");
};

/**
 * Возвращает тему в разделе правил.
 *
 * @return {string} текст подтипа ошибки.
 */
DialogBox.prototype.getErrorSubType = function () {
    'use strict';
    return $('#subtype-of-error option:selected').text();
};
