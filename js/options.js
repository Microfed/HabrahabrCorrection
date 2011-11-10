/**
 * @fileOverview Скрипт для страницы настроек расширения
 * @author <a href="mailto:microfed@gmail.com">Goder</a>
 */

/**
 * @class Класс для работы с настройками расширения.
 * @constructor
 * @name Options
 */
var Options = {};

/**
 * Проверяет, поддерживается LocalStorage.
 *
 * @return {boolean} Возвращает true, если браузер поддерживает LocalStorage, иначе - false
 */
Options.isLocalStorageEnable = function () {
    'use strict';
    return (window.hasOwnProperty('localStorage') && window.localStorage !== null);
};

/**
 * Устанавливает значение заданного элемента
 * в локальном хранилище.
 *
 * @param {string} name Имя параметра
 * @param value Значение параметра
 */
Options.setLocalStorageItem = function (name, value) {
    'use strict';
    if (Options.isLocalStorageEnable()) {
        localStorage.setItem(name, value);
    }
};

/**
 * Получает значение параметра из
 * локального хранилища.
 *
 * @param {string} name Имя параметра
 */
Options.getLocalStorageItem = function (name) {
    'use strict';
    if (Options.isLocalStorageEnable()) {
        return localStorage.getItem(name);
    } else {
        return null;
    }
};

/**
 * @return Возвращает слой, содержащий dynatree-дерево.
 */
Options.getTreeDiv = function () {
    'use strict';
    return $("#errorTree");
};

/**
 * Показывает информацию об элементе дерева.
 *
 * @param node Элемент дерева
 */
Options.printNodeInfo = function (node) {
    'use strict';
    $('#activeTreeElement #title').val(node.data.title);
    $('#activeTreeElement #messageText').val(node.data.messageText);
    if (node.data.isFolder) {
        $('#activeTreeElement #isFolder').attr("checked", "checked");
    }
    $('#activeTreeElement').show();
};

/**
 * Очищает информационную панель.
 */
Options.clearNodeInfo = function () {
    'use strict';
    $("#activeTreeElement #title").empty();
    $("#activeTreeElement #messageText").empty();
    $('#activeTreeElement #isFolder').removeAttr("checked");
    $('#activeTreeElement').hide();
};

/**
 * Показывает заданное сообщение с анимацией.
 *
 * @param messageText Текст сообщения
 */
Options.printStatusMessage = function (messageText) {
    'use strict';
    $('#status').append(messageText);
    $('#status').show();
    setTimeout(function () {
        $('#status').effect('fade', 500, function () {
            $('#status').empty();
        });
    }, 2000);
};

/**
 * Сохраняет текущие значения контролов в качестве соответствующих опций.
 */
Options.save_options = function () {
    'use strict';
    Options.setLocalStorageItem('isAdvtAttachToMessage', document.getElementById('isAdvtAttachToMessage').checked);
    Options.setLocalStorageItem('silentMode', document.getElementById('isSilentModeOn').checked);

    var dict = Options.getTreeDiv().dynatree("getTree").toDict();
    Options.setLocalStorageItem('errorList', JSON.stringify(dict.children));

    Options.printStatusMessage("Сохранено");
};

/**
 * Применяет стили для кнопок.
 */
Options.setButtonUI = function () {
    'use strict';
    $('button', '#activeTreeElement').button();
};

/**
 * Удаляет активный элемент из дерева.
 */
Options.deleteActiveElement = function () {
    'use strict';
    Options.getTreeDiv().dynatree("getActiveNode").remove();

    //Fix error: плагин после удаления элемента срет в стиль этого дива (display: none)
    $('#activeTreeElement').show();
};

/**
 * Применяет изменения для активного элемента.
 */
Options.acceptChangeActiveElement = function () {
    'use strict';
    var node = Options.getTreeDiv().dynatree("getActiveNode"),
        title = $('#activeTreeElement #title').val(),
        messageText = $('#activeTreeElement #messageText').val(),
        isFolder = $('input#isFolder').attr('checked') ? true : false;
    console.log(isFolder);
    if (!node) {
        return;
    }
    node.fromDict({
        title: title,
        messageText: messageText,
        isFolder: isFolder
    });
};

/**
 * Добавляет новый элемент в дерево.
 */
Options.addNewElement = function () {
    'use strict';
    var parentNode,
        root = Options.getTreeDiv().dynatree("getRoot"),
        activeNode = Options.getTreeDiv().dynatree("getActiveNode"),
        title = $('#activeTreeElement #title').val(),
        messageText = $('#activeTreeElement #messageText').val(),
        isFolder = false;

    if (activeNode !== null) {
        if (activeNode.data.isFolder) {
            parentNode = activeNode;
        } else {
            parentNode = activeNode.getParent();
        }
    } else {
        parentNode = root;
        activeNode = root;
    }

    if (parentNode === root && !(activeNode.data.isFolder)) {
        isFolder = ($('#activeTreeElement #isFolder:checked').val() !== undefined);
    }

    parentNode.addChild({
        title: title,
        messageText: messageText,
        isFolder: isFolder
    });

};

/**
 * Добавляет кнопки для управления деревом ошибок,
 * добавляет соответствующие события для кнопок.
 *
 * Используется библиотеки jQuery.dynatree, jQuery UI.
 */
Options.addButtonsToManageTree = function () {
    'use strict';
    Options.setButtonUI();

    $('#delete', '#activeTreeElement').click(Options.deleteActiveElement);
    $('#accept', '#activeTreeElement').click(Options.acceptChangeActiveElement);
    $('#add', '#activeTreeElement').click(Options.addNewElement);
};

/**
 * Устанавливает значения для дерева, корректно его отображает.
 */
Options.setTreeInfo = function () {
    'use strict';
    var treeDiv = Options.getTreeDiv();

    if (treeDiv.text() !== '') {
        treeDiv.dynatree("getTree").reload();
    } else {
        treeDiv.dynatree({
            onActivate: function (node) {
                Options.printNodeInfo(node);
            },
            onDeactivate: function () {
                Options.clearNodeInfo();
            },
            children: JSON.parse(Options.getLocalStorageItem('errorList'))
        });

        Options.addButtonsToManageTree();
    }
};

/**
 * Получает список ошибок из файла (в папке расширения),
 * устанавливает этот список как текущий,
 * обновляет информацию в дереве ошибок,
 * печатает сообщение, что все хорошо.
 */
Options.setErrorListFromFile = function () {
    'use strict';
    $.getJSON(chrome.extension.getURL('errorList.json'),
        function (data) {
            Options.setLocalStorageItem('errorList', JSON.stringify(data));
            Options.setTreeInfo();
            Options.printStatusMessage("Список ошибок загружен");
        }).error(function () {
            Options.printStatusMessage("Проблема при загрузке файла. Список ошибок не обновлен.");
        });
};

/**
 * Возвращает соответствующее булево значение, содержащееся в строке.
 * @param {string} string Строка для разбора
 * @return {boolean} True, если строка содержит 'true', иначе False
 */
Options.getBooleanValueFromString = function (string) {
    'use strict';
    var result = false;
    if (string === 'true') {
        result = true;
    }
    return result;
};

/**
 * Восстанавливает настройки.
 */
Options.restore_options = function () {
    'use strict';
    var isAdvtAttachToMessage = Options.getLocalStorageItem('isAdvtAttachToMessage'),
        isSilentModeOn = Options.getLocalStorageItem('silentMode');

    if (isSilentModeOn === null) {
        isSilentModeOn = 'false';
        Options.setLocalStorageItem('silentMode', isSilentModeOn);
    }

    if (isAdvtAttachToMessage === null) {
        isAdvtAttachToMessage = 'true';
        Options.setLocalStorageItem('isAdvtAttachToMessage', isAdvtAttachToMessage);
    }

    document.getElementById('isAdvtAttachToMessage').checked = Options.getBooleanValueFromString(isAdvtAttachToMessage);
    document.getElementById('isSilentModeOn').checked = Options.getBooleanValueFromString(isSilentModeOn);

    if (Options.getLocalStorageItem('errorList') === undefined || Options.getLocalStorageItem('errorList') === null) {
        Options.setErrorListFromFile();
    }

    Options.setTreeInfo();
};

Options.initOptions = function () {
    var isAdvtAttachToMessage = Options.getLocalStorageItem('isAdvtAttachToMessage'),
        isSilentModeOn = Options.getLocalStorageItem('silentMode');

    if (isSilentModeOn === null) {
        isSilentModeOn = 'false';
        Options.setLocalStorageItem('silentMode', isSilentModeOn);
    }

    if (isAdvtAttachToMessage === null) {
        isAdvtAttachToMessage = 'true';
        Options.setLocalStorageItem('isAdvtAttachToMessage', isAdvtAttachToMessage);
    }

    if (Options.getLocalStorageItem('errorList') === undefined || Options.getLocalStorageItem('errorList') === null) {
        Options.setErrorListFromFile();
    }
}