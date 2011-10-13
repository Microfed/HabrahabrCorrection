/**
 * @fileOverview Скрипт для страницы настроек расширения
 * @author <a href="mailto:microfed@gmail.com">Goder</a>
 */

/**
 * @return Возвращает слой, содержащий dynatree-дерево.
 */
var getTreeDiv = function () {
    'use strict';
    return $("#errorTree");
};

/**
 * Показывает информацию об элементе дерева.
 *
 * @param node Элемент дерева
 */
function printNodeInfo(node) {
    'use strict';
    $('#activeTreeElement #title').val(node.data.title);
    $('#activeTreeElement #messageText').val(node.data.messageText);
    if (node.data.isFolder) {
        $('#activeTreeElement #isFolder').attr("checked", "checked");
    }
    $('#activeTreeElement').show();
}

/**
 * Очищает информационную панель.
 */
function clearNodeInfo() {
    'use strict';
    $("#activeTreeElement #title").empty();
    $("#activeTreeElement #messageText").empty();
    $('#activeTreeElement #isFolder').removeAttr("checked");
    $('#activeTreeElement').hide();
}

/**
 * Показывает заданное сообщение с анимацией.
 *
 * @param messageText Текст сообщения
 */
function printStatusMessage(messageText) {
    'use strict';
    $('#status').append(messageText);
    $('#status').show();
    setTimeout(function () {
        $('#status').effect('fade', 500, function () {
            $('#status').empty();
        });
    }, 2000);
}

/**
 * Сохраняет текущие значения контролов в качестве соответствующих опций.
 */
function save_options() {
    'use strict';
    localStorage["isAdvtAttachToMessage"] = document.getElementById('isAdvtAttachToMessage').checked;

    var dict = getTreeDiv().dynatree("getTree").toDict();
    localStorage["errorList"] = JSON.stringify(dict.children);

    printStatusMessage("Сохранено");
}

/**
 * Применяет стили для кнопок.
 */
var setButtonUI = function () {
    'use strict';
    $('button', '#activeTreeElement').button();
};

/**
 * Удаляет активный элемент из дерева.
 */
var deleteActiveElement = function () {
    'use strict';
    getTreeDiv().dynatree("getActiveNode").remove();

    //Fix error: плагин после удаления элемента срет в стиль этого дива (display: none)
    $('#activeTreeElement').show();
};

/**
 * Применяет изменения для активного элемента.
 */
var acceptChangeActiveElement = function () {
    'use strict';
    var node = getTreeDiv().dynatree("getActiveNode"),
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
var addNewElement = function () {
    'use strict';
    var parentNode,
        root = getTreeDiv().dynatree("getRoot"),
        activeNode = getTreeDiv().dynatree("getActiveNode"),
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
function addButtonsToManageTree() {
    'use strict';
    setButtonUI();

    $('#delete', '#activeTreeElement').click(deleteActiveElement);
    $('#accept', '#activeTreeElement').click(acceptChangeActiveElement);
    $('#add', '#activeTreeElement').click(addNewElement);
}

/**
 * Устанавливает значения для дерева, корректно его отображает.
 */
function setTreeInfo() {
    'use strict';
    var treeDiv = getTreeDiv();

    if (treeDiv.text() !== '') {
        treeDiv.dynatree("getTree").reload();
    } else {
        treeDiv.dynatree({
            onActivate: function (node) {
                printNodeInfo(node);
            },
            onDeactivate: function () {
                clearNodeInfo();
            },
            children: JSON.parse(localStorage["errorList"])
        });

        addButtonsToManageTree();
    }
}

/**
 * Получает список ошибок из файла (в папке расширения),
 * устанавливает этот список как текущий,
 * обновляет информацию в дереве ошибок,
 * печатает сообщение, что все хорошо.
 */
function setErrorListFromFile() {
    'use strict';
    $.getJSON(chrome.extension.getURL('/errorList.json'),
        function (data) {
            localStorage["errorList"] = JSON.stringify(data);
            setTreeInfo();
            printStatusMessage("Список ошибок загружен");
        })
        .error(function () {
            printStatusMessage("Проблема при загрузке файла. Список ошибок не обновлен.");
        });
}

/**
 * Восстанавливает настройки.
 */
function restore_options() {
    'use strict';
    var isAdvtAttachToMessage = localStorage["isAdvtAttachToMessage"],
        result = false;

    if (isAdvtAttachToMessage === 'true') {
        result = true;
    }
    document.getElementById('isAdvtAttachToMessage').checked = result;

    if (localStorage["errorList"] === undefined) {
        setErrorListFromFile();
    }

    setTreeInfo();
}