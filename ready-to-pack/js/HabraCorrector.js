var URL_SEND_MESSAGE="http://habrahabr.ru/ajax/messages/add/";var HabraCorrector=function(){this.habraPage=new HabraPage();this.errorListManager;this.dialogBox};HabraCorrector.prototype.loadErrorListAndAppendDialogBox=function(){var a=this;chrome.extension.sendRequest({get_errorList:true},function(b){a.errorListManager=new ErrorListManager(b.data);a.dialogBox=new DialogBox(a.errorListManager);a.dialogBox.appendStyle();a.dialogBox.appendDialog()})};HabraCorrector.prototype.Init=function(){if(this.habraPage.isCurrentUrlCorrect()){this.loadErrorListAndAppendDialogBox()}this.addHotKey()};HabraCorrector.prototype.alertWhenFail=function(a){var b=$(a).find("error");if(b[0]!==undefined){alert(b[0].textContent)}};HabraCorrector.prototype.sendDataPost=function(b){var a=this;$.post(URL_SEND_MESSAGE,b,function(c){a.alertWhenFail(c)})};HabraCorrector.prototype.sendRequestToBackgroundPage=function(a,c,b){chrome.extension.sendRequest({to_send_data:true,send_author:a,send_title:c,send_text:b},function(d){HabraCorrector.prototype.sendDataPost(d.send_data)})};HabraCorrector.prototype.startDialog=function(){var a=this;if(a.habraPage.isCurrentUrlCorrect()){var d=document.baseURI,b=a.habraPage.getAuthorName(),e='Ошибка в статье "'+a.habraPage.getArticleTitle()+'"',c=a.habraPage.getContentText(d);a.dialogBox.resetDialogFields();a.dialogBox.setDialogContent(b,e,c);a.dialogBox.showDialog(b,e,a.sendRequestToBackgroundPage)}};HabraCorrector.prototype.addHotKey=function(){var a=this;window.addEventListener("keydown",function(c){var b=c.ctrlKey||c.metaKey;if(b&&c.keyCode===13){a.startDialog()}},false)};