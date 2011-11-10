/**
 * @fileOverview Отвечает за работу расширения.
 * @author <a href="mailto:microfed@gmail.com">Goder</a>
 */

/**
 * Адресс скрипта отправки личных сообщений.
 */
var URL_SEND_MESSAGE = "http://habrahabr.ru/ajax/messages/add/";

/**
 * @class Отвечает за работу расширения.
 * @constructor
 * @name HabraCorrector
 */
var HabraCorrector = function () {
    'use strict';
    this.habraPage = new HabraPage();
};

/**
 * Загружает список ошибок из JSON-файла. После загрузки добавляет диалоговое окно
 * в DOM страницы.
 */
HabraCorrector.prototype.loadErrorListAndAppendDialogBox = function () {
    'use strict';
    var habraCorrector = this;

    chrome.extension.sendRequest({get_errorList: true},
        function (response) {
            habraCorrector.errorListManager = new ErrorListManager(response.data);
            habraCorrector.dialogBox = new DialogBox(habraCorrector.errorListManager);
            habraCorrector.dialogBox.appendStyle();
            habraCorrector.dialogBox.appendDialog();
        });
};

/**
 * Инициализирует главный класс контент-скрипта:
 * - добавляет событие для горячих клавиш;
 * - загружает список ошибок;
 * - добавляет к DOM страницы диалоговое окно.
 */
HabraCorrector.prototype.Init = function () {
    'use strict';
    if (this.habraPage.isCurrentUrlCorrect()) {
        this.loadErrorListAndAppendDialogBox();
    }
    this.addHotKey();
};

/**
 * Проверяет ответ севера. Если ответ содержит информацию
 * об ошибке, сообщает эту информацию пользователю
 * посредством alert()
 *
 * @param response Ответ на запрос к серверу
 */
HabraCorrector.prototype.alertWhenFail = function (response) {
    'use strict';
    var resp = $(response).find('error');
    if (resp[0] !== undefined) {
        alert(resp[0].textContent);
    }
};

/**
 * Отправляет данные на сервер post-методом
 *
 * @param data Данные
 */
HabraCorrector.prototype.sendDataPost = function (data) {
    'use strict';
    var habraCorrector = this;
    $.post(URL_SEND_MESSAGE, data, function (response) {
        habraCorrector.alertWhenFail(response);
    });
};

/**
 * Отправляет сообщение фоновой странице расширения, отправляя данные для формирования сообщения
 * об ошибке; принимает ответ и шлет сформированное сообщение автору статьи. Для успешной отправки
 * сообщения требуется быть аутентифицированным пользователем.
 *
 * @param name Имя автора статьи
 * @param title Название статьи
 * @param messageText Текст сообщения
 */
HabraCorrector.prototype.sendRequestToBackgroundPage = function (name, title, messageText) {
    'use strict';
    chrome.extension.sendRequest(
        {
            to_send_data: true,
            send_author: name,
            send_title: title,
            send_text: messageText
        },
        function (response) {
            HabraCorrector.prototype.sendDataPost(response.send_data);
        }
    );
};

/**
 * Проверяет корректность текущей страницы.
 *
 * @return {boolean} True, если страница соответствует статье на Хабре, иначе False
 */
HabraCorrector.prototype.isItArticlePage = function () {
    'use strict';
    return this.habraPage.isCurrentUrlCorrect();
};

/**
 * Заполняет необходимые поля и показывает диалоговое окно пользователю.
 */
HabraCorrector.prototype.startDialog = function () {
    'use strict';
    var articleUrl = document.baseURI,
        author = this.habraPage.getAuthorName(),
        title = 'Ошибка в статье "' + this.habraPage.getArticleTitle() + '"',
        content = this.habraPage.getContentText(articleUrl),
        dialogResult,
        self = this;

    if (this.isItArticlePage()) {
        this.dialogBox.resetDialogFields();
        this.dialogBox.setDialogContent(author, title, content);
        dialogResult = this.dialogBox.showDialog(author, title);
        dialogResult.done(function () {
            self.sendRequestToBackgroundPage(author, title, self.dialogBox.getMessageText());
            self.habraPage.resetState();
        });
    }
};

/**
 * Добавляет событие для сочетания клавиш Ctrl+Enter.
 * При срабатывании показывает диалоговое окно для отправки сообщения об ошибке.
 *
 * С версии 1.0.0. добавлен silent mode. Если он включен, то выделенный текст добавляется
 * в буфер для последующего включения в общее сообщение.
 * Для вызова диалогового окна нужно сбросить выделение с текста и нажать Ctrl+Enter.
 */
HabraCorrector.prototype.addHotKey = function () {
    'use strict';
    var habraCorrector = this,
        silentMode;

    window.addEventListener("keydown", function (event) {
        var modifier = event.ctrlKey || event.metaKey;
        if (modifier && event.keyCode === 13) {
            chrome.extension.sendRequest({get_silentMode: true},
                function (response) {
                    silentMode = response.silent_mode;
                    if (silentMode === 'true' && habraCorrector.habraPage.getSelectedText() !== '') {
                        habraCorrector.habraPage.addErrorText();
                    } else {
                        habraCorrector.habraPage.addErrorText();
                        habraCorrector.startDialog();
                    }
                });
        }
    }, false);
};
