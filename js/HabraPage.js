/**
 * @fileOverview Отвечает за работу со страницей хабра-статьи.
 * @author <a href="mailto:microfed@gmail.com">Goder</a>
 */

/**
 * @class Отвечает за работу со страницей хабра-статьи.
 * @constructor
 * @name HabraPage
 */
var HabraPage = function () {
    'use strict';
    this.AUTHOR_CLASS_NAME = 'div.vcard.author.full a.fn.nickname.url';
    this.AUTHOR_CLASS_NAME_MODIFIED = 'div.vcard.author.full a.fn.nickname.url.karmaloaded';
    this.HABRAHABR_URL = 'habrahabr.ru';
    this.selectedErrors = []; //текущий список выделенных пользователем ошибок
};

/**
 * Проверяет, подходит ли текущая страница для работы скрипта.
 *
 * @return {boolean} Возвращает true, если текущая страница - это страница на хабре
 * с комментами (это означает, что открыта страница статьи).
 */
HabraPage.prototype.isCurrentUrlCorrect = function () {
    'use strict';
    var isCorrect = false,
        url = document.baseURI;

    if (url.search(this.HABRAHABR_URL) !== -1) {
        isCorrect = true;
    }
    if (document.getElementById("comments") !== null) {
        isCorrect = isCorrect && true;
    } else {
        isCorrect = false;
    }
    return isCorrect;
};

/**
 * Возвращает имя автора статьи.
 *
 * @return {string} Ник автора статьи
 */
HabraPage.prototype.getAuthorName = function () {
    'use strict';
    var author,
        length = $(this.AUTHOR_CLASS_NAME).length,
        i;

    if (length > 0) {
        for (i = 0; i < length; i = +1) {
            if ($(this.AUTHOR_CLASS_NAME).attr('title') === 'Автор текста') {
                author = $(this.AUTHOR_CLASS_NAME).text();
            }
        }
    } else if ($(this.AUTHOR_CLASS_NAME_MODIFIED).length > 0) {
        // Некоторые расширения для хабры меняют имя класса
        author = $(this.AUTHOR_CLASS_NAME_MODIFIED).text();
    } else if ($('div.infopanel div.author a').length > 0) {
        author = $('div.infopanel div.author a').text();
    }
    return author;
};

/**
 * Возвращает заголовок статьи.
 *
 * @return {string} Название статьи
 */
HabraPage.prototype.getArticleTitle = function () {
    'use strict';
    var title;
    if ($('div.hentry h2.entry-title.single-entry-title span.topic').length > 0) {
        title = $('div.hentry h2.entry-title.single-entry-title span.topic');
    } else if ($('div.post h2.title span.post_title').length > 0) {
        title = $('div.post h2.title span.post_title');
    } else if($('div.post h1.title span.post_title').length > 0){ // fix https://github.com/Microfed/HabrahabrCorrection/issues/2
        title = $('div.post h1.title span.post_title');
    }

    return title.text();
};

/**
 * Возвращает выделенный текст.
 *
 * @return {string} Выделенный текст
 */
HabraPage.prototype.getSelectedText = function () {
    'use strict';
    var txt = '';
    if (window.getSelection) {
        txt = window.getSelection().toString();
    } else if (document.getSelection) {
        txt = document.getSelection();
    } else if (document.selection) {
        txt = document.selection.createRange().text;
    }
    return txt;
};

/**
 * @return {string} Возвращает строку, содержащую все выделенные пользователем
 * ошибки с момента последней отправки сообщения об ошибке.
 */
HabraPage.prototype.getErrorsText = function () {
    'use strict';
    var i,
        textString = '',
        length = this.selectedErrors.length;

    for (i = 0; i < length; i += 1) {
        textString += this.selectedErrors[i];
    }

    return textString;
};

/**
 *  Возвращает выделенный текст, как цитату.
 *
 * @param {string} articleUrl Ссылка на статью
 * @return {string} Текст ошибки, подготовленный для сообщения
 */
HabraPage.prototype.getContentText = function (articleUrl) {
    'use strict';
    return 'Ошибка в статье <a href="' + articleUrl + '">' + this.getArticleTitle() + '</a>' + this.getErrorsText();
};

/**
 * Добавляет выделенный текст в буфер для последующего включения
 * текста в сообщение об ошибках.
 */
HabraPage.prototype.addErrorText = function () {
    'use strict';
    var selectedText = this.getSelectedText();
    if (selectedText !== '') {
        this.selectedErrors.push('\n<blockquote>' + selectedText + '</blockquote>');
    }
};

/**
 * Очищает буфер выделенных ошибок. Обычно срабатывает после
 * отправки сообщения об ошибках пользователю.
 */
HabraPage.prototype.resetState = function () {
    'use strict';
    this.selectedErrors = [];
};