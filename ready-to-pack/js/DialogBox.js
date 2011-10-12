var DialogBox=function(a){this.ErrorListManager=a;this.DIALOG_STYLE="font-family:verdana,sans-serif;font-size:12px;text-align:left"};DialogBox.prototype.appendStyle=function(){$("head").append('<link type="text/css" href="'+chrome.extension.getURL("css/redmond/jquery-ui-1.8.16.custom.css")+'" rel="stylesheet" />')};DialogBox.prototype.addTextToMessage=function(b){var a=$("#dialog-message-text");a.text(a.val(a.val()+b))};DialogBox.prototype.getErrorType=function(){return $("#type-of-error option:selected").text()};DialogBox.prototype.addEventTypeOfError_Change=function(){var a=this;var b=function(){var e=a.getErrorType(),d=$("#subtype-of-error"),c="\n";d.empty();c+=a.ErrorListManager.getErrorMessageText(e);if(a.ErrorListManager.isErrorHasSubTypes(e)){a.appendErrorSubTypesList(e,d);d.show()}a.addTextToMessage(c)};$("#type-of-error").change(b);$("#type-of-error").dblclick(b)};DialogBox.prototype.addEventSubTypeOfError_Change=function(){var a=this;var b=function(){var d="",c=a.getErrorSubType();d+=a.ErrorListManager.getErrorMessageText(c);a.addTextToMessage(d)};$("#subtype-of-error").change(b);$("#subtype-of-error").dblclick(b)};DialogBox.prototype.appendDialog=function(){var a=this;$("body").append('<div id="habracorrect-dialog" title="Сообщение об ошибке" style='+a.DIALOG_STYLE+' hidden><p id="dialog-author-name"></p><p id="dialog-message-title"><b>Заголовок:</b>&nbsp;</p><p><b>Текст сообщения:</b></p><textarea id="dialog-message-text" cols="60" rows="8" maxlength="1000" required></textarea><select id="type-of-error"></select></br><select id="subtype-of-error" style="width : 200px" hidden></select></div>');a.addTypeOfErrorOptions();a.addEventTypeOfError_Change();a.addEventSubTypeOfError_Change()};DialogBox.prototype.resetDialogFields=function(){$("#dialog-author-name").empty();$("#dialog-message-title").empty();$("#dialog-author-name").append("<b>Кому:</b>&nbsp;");$("#dialog-message-title").append("<b>Заголовок:</b>&nbsp;");$("#dialog-message-text").empty();$("#subtype-of-error").empty();$("#subtype-of-error").hide()};DialogBox.prototype.setAuthorName=function(a){$("#dialog-author-name").append(a)};DialogBox.prototype.setMessageTitle=function(a){$("#dialog-message-title").append(a)};DialogBox.prototype.setMessageText=function(a){$("#dialog-message-text").val(a)};DialogBox.prototype.setDialogContent=function(b,d,c){var a=this;a.setAuthorName(b);a.setMessageTitle(d);a.setMessageText(c)};DialogBox.prototype.getMessageText=function(){return $("#dialog-message-text").val()};DialogBox.prototype.addTypeOfErrorOptions=function(){var a=this;var c=function(){return $("#type-of-error")};var b=c();if(a.ErrorListManager.errorDict){$.each(a.ErrorListManager.errorDict,function(){b.append(new Option(this.title,0))})}};DialogBox.prototype.appendErrorSubTypesList=function(c,b){var a=this;$.each(a.ErrorListManager.errorDict,function(){if(this.title===c){$.each(this.children,function(){b.append(new Option(this.title,0))})}})};DialogBox.prototype.showDialog=function(b,d,c){var a=this;$("#habracorrect-dialog").attr("hidden","true");$("#habracorrect-dialog").dialog({width:500},{height:360},{buttons:{"Опечатка!":function(){a.addTextToMessage("\nОпечатка!")},"Отправить":function(){c(b,d,a.getMessageText());$(this).dialog("close")},"Отменить":function(){$(this).dialog("close")}}});$(".ui-dialog-buttonpane").find('button:contains("Опечатка!")').css("margin-right","180px")};DialogBox.prototype.getErrorSubType=function(){return $("#subtype-of-error option:selected").text()};