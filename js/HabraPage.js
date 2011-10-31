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
    if (document.getElementById("comments") !== undefined) {
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
    var author;
    var length = $(this.AUTHOR_CLASS_NAME).length;
    if (length > 0) {
        for (var i = 0; i < length; i = +1) {
            if ($(this.AUTHOR_CLASS_NAME).attr('title') === 'Автор текста') {
                author = $(this.AUTHOR_CLASS_NAME).text();
            }
        }
    } else {
        // Некоторые расширения для хабры меняют имя класса
        author = $(this.AUTHOR_CLASS_NAME_MODIFIED).text();
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
    var title = $('div.hentry h2.entry-title.single-entry-title span.topic');
    //удаляем все лишние символы в начале и конце заголовка
    return title.text();
};

/**
 * Возвращает выделенный текст.
 *
 * @return {string} Выделенный текст
 */
HabraPage.prototype.getSelectedText = function () {
    'use strict';
    var txt;
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
 *  Возвращает выделенный текст, как цитату.
 *
 * @param {string} articleUrl Ссылка на статью
 * @return {string} Текст ошибки, подготовленный для сообщения
 */
HabraPage.prototype.getContentText = function (articleUrl) {
    'use strict';
    return 'Ошибка в статье <a href="' + articleUrl + '">' + this.getArticleTitle() + '</a>\n<blockquote>' + this.getSelectedText() + '</blockquote>';
};