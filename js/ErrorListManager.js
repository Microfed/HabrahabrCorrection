/**
 * @fileOverview Отвечает за работу со списком ошибок.
 * @author <a href="mailto:microfed@gmail.com">Goder</a>
 */


/**
 * @class Отвечает за работу со списком ошибок.
 * @constructor
 * @name ErrorListManager
 * @param {object} errorDict JSON-представление списка ошибок
 */
var ErrorListManager = function (errorDict) {
    'use strict';
    this.errorDict = errorDict;
};

/**
 * Возвращает информацию для сообщения, соответсвующую типу ошибки.
 *
 * @param {string} errorType Тип ошибки
 * @return {string} Текст сообщения об ошибке
 */
ErrorListManager.prototype.getErrorMessageText = function (errorType) {
    'use strict';
    var errorMessageText,
        errorListManager = this;

    $.each(errorListManager.errorDict, function () {
        if (this.title === errorType) {
            errorMessageText = this.messageText;
            return false;
        }
        if (errorListManager.isErrorHasSubTypes(this.title)) {
            $.each(this.children, function () {
                if (this.title === errorType) {
                    errorMessageText = this.messageText;
                    return false;
                }
            });
        }
    });
    return errorMessageText;
};


/**
 * Есть ли у типа ошибки её подтипы.
 *
 * @param {string} errorType
 * @return {boolean} true, если у типа есть подтип, иначе false
 */
ErrorListManager.prototype.isErrorHasSubTypes = function (errorType) {
    'use strict';
    var hasSubTypes = false,
        errorListManager = this;

    $.each(errorListManager.errorDict, function () {
        if (this.title === errorType && this.children !== undefined) {
            hasSubTypes = true;
            return false;
        }
    });

    return hasSubTypes;
};


