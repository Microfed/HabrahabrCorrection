var OptionsTest = TestCase("OptionsTest");

OptionsTest.prototype.setUp = function () {
    $('body').html('\
        <h3>Настроки расширения HabraCorrection</h3>\
        <h4>Формирование сообщения об ошибке</h4>\
        <input type="checkbox" id="isAdvtAttachToMessage"/> Добавлять информацию о расширении в конец </br>\
        сообщения об ошибке ("<sub>With help <a href="https://chrome.google.com/webstore/detail/kcdmenmdkfpfbdilcpfehcnahhkjfipe">HabraCorrection</a>.</sub>")\
        <br/><br/>\
        <h4>Редактирование списка ошибок</h4>\
        \
        <div id="activeTreeElement" style="border: 1px dotted gray; width: 620px;font-family:verdana,sans-serif;font-size:12px">\
            <small>Не больше 2-х уровней вложенности относительно корня</small>\
            <div id="errorTree" style="width: 618px"></div>\
            <strong>Название ошибки/раздела: </strong></strong><br/>\
            <input type="text" id="title" style="width: 510px">\
            <input type="checkbox" id="isFolder"> это раздел<br/>\
            <strong>Текст сообщения об ошибке:</strong><br/>\
            <textarea id="messageText" cols="74" rows="4" maxlength="500"></textarea>\
            <br/>\
            <button id="accept">Принять изменения</button>\
            <button id="delete">Удалить ошибку</button>\
            <button id="add">Добавить ошибку</button>\
        </div>\
        <br/><br/>\
        <button onclick="Options.save_options()">Сохранить все настройки</button>\
        <button onclick="Options.setErrorListFromFile()">Восстановить список ошибок по умолчанию</button>\
        <div id="status" class="ui-widget-content" hidden></div>\
    ');
    $('body').attr('onLoad', 'Options.restore_options()');
};

OptionsTest.prototype.testShouldBeReturnTrueInChrome = function () {
    assertTrue(Options.isLocalStorageEnable());
};

OptionsTest.prototype.testGetItemShouldReturnSameTheSameWeSet = function () {
    var item = "item-string";
    Options.setLocalStorageItem(item, item);
    assertEquals(item, Options.getLocalStorageItem(item));
};

OptionsTest.prototype.testShouldReturnTreeDiv = function () {
    var treeDiv = Options.getTreeDiv();
    assertEquals(1, treeDiv.length);
};

OptionsTest.prototype.tearDown = function (){
    window.localStorage.clear();
}