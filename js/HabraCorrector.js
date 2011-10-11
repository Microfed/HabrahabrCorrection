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
var HabraCorrector = function() {
    this.habraPage = new HabraPage();
    this.errorListManager;
    this.dialogBox;
};

/**
 * Загружает список ошибок из JSON-файла. После загрузки добавляет диалоговое окно
 * в DOM страницы.
 */
HabraCorrector.prototype.loadErrorListAndAppendDialogBox = function() {
    var habraCorrector = this;
    $.getJSON(chrome.extension.getURL('/error-list.json'), function(data) {
        habraCorrector.errorListManager = new ErrorListManager(data);
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
HabraCorrector.prototype.Init = function() {
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
HabraCorrector.prototype.alertWhenFail = function(response) {
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
HabraCorrector.prototype.sendDataPost = function(data) {
    var habraCorrector = this;
    $.post(URL_SEND_MESSAGE, data, function (response) {
        habraCorrector.alertWhenFail(response);
    });
};

/**
 * Отправляет сообщение фоновой странице расширения, отправляя данные для формирования сообщения
 * об ошибке; принимает ответ и шлет сформированное сообщение автору статьи. Для успешнйо отправки
 * сообщения требуется быть аутентифицированным пользователем.
 *
 * @param name Имя автора статьи
 * @param title Название статьи
 * @param messageText Текст сообщения
 */
HabraCorrector.prototype.sendRequestToBackgroundPage = function(name, title, messageText) {
    chrome.extension.sendRequest({to_send_data: true, send_author: name, send_title: title, send_text: messageText},
        function (response) {
            HabraCorrector.prototype.sendDataPost(response.send_data);
        });
};

/**
 * Заполняет необходимые поля и показывает диалоговое окно пользователю.
 */
HabraCorrector.prototype.startDialog = function() {
    var habraCorrector = this;
    if (habraCorrector.habraPage.isCurrentUrlCorrect()) {
        var articleUrl = document.baseURI,
            author = habraCorrector.habraPage.getAuthorName(),
            title = 'Ошибка в статье "' + habraCorrector.habraPage.getArticleTitle() + '"',
            content = habraCorrector.habraPage.getContentText(articleUrl);
        habraCorrector.dialogBox.resetDialogFields();
        habraCorrector.dialogBox.setDialogContent(author, title, content);
        habraCorrector.dialogBox.showDialog(author, title, habraCorrector.sendRequestToBackgroundPage);
    }
};

/**
 * Добавляет событие для сочетания клавиш Ctrl+Enter.
 * При срабатывании показывает диалоговое окно для отправки сообщения об ошибке.
 */
HabraCorrector.prototype.addHotKey = function() {
    var habraCorrector = this;
    window.addEventListener("keydown", function (event) {
        var modifier = event.ctrlKey || event.metaKey;
        if (modifier && event.keyCode === 13) {
            habraCorrector.startDialog();
        }
    }, false);
};