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
var ErrorListManager = function(errorDict) {
    this.errorDict = errorDict;
};

/**
 * Возвращает информацию для сообщения, соответсвующую типу ошибки.
 *
 * @param {string} errorType Тип ошибки
 * @return {string} Текст сообщения об ошибке
 */
ErrorListManager.prototype.getErrorMessageText = function (errorType) {
    var errorMessageText;
    var errorListManager = this;

    $.each(errorListManager.errorDict.errorTypes, function() {
        if (this.optionText === errorType) {
            errorMessageText = this.messageText;
            return false;
        }
        if (errorListManager.isErrorHasSubTypes(this.optionText)) {
            $.each(this.errorSubtypes, function() {
                if (this.optionText === errorType) {
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
    var hasSubTypes = false;
    var errorListManager = this;

    $.each(errorListManager.errorDict.errorTypes, function() {
        if (this.optionText === errorType && this.errorSubtypes !== undefined) {
            hasSubTypes = true;
            return false;
        }
    });

    return hasSubTypes;
};


