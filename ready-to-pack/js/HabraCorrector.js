var URL_SEND_MESSAGE="http://habrahabr.ru/ajax/messages/add/";var HabraCorrector=function(){this.habraPage=new HabraPage()};HabraCorrector.prototype.loadErrorListAndAppendDialogBox=function(){var a=this;chrome.extension.sendRequest({get_errorList:true},function(b){a.errorListManager=new ErrorListManager(b.data);a.dialogBox=new DialogBox(a.errorListManager);a.dialogBox.appendStyle();a.dialogBox.appendDialog()})};HabraCorrector.prototype.Init=function(){var a=this;chrome.extension.sendRequest({init_options:true});setTimeout(function(){if(a.habraPage.isCurrentUrlCorrect()){a.loadErrorListAndAppendDialogBox();a.addHotKey()}},100)};HabraCorrector.prototype.alertWhenFail=function(a){var b=$(a).find("error");if(b[0]!==undefined){alert(b[0].textContent)}};HabraCorrector.prototype.sendDataPost=function(b){var a=this;$.post(URL_SEND_MESSAGE,b,function(c){a.alertWhenFail(c)})};HabraCorrector.prototype.sendRequestToBackgroundPage=function(a,c,b){chrome.extension.sendRequest({to_send_data:true,send_author:a,send_title:c,send_text:b},function(d){HabraCorrector.prototype.sendDataPost(d.send_data)})};HabraCorrector.prototype.isItArticlePage=function(a){return a.habraPage.isCurrentUrlCorrect()};HabraCorrector.prototype.startDialog=function(){var e=document.baseURI,c=this.habraPage.getAuthorName(),f='Ошибка в статье "'+this.habraPage.getArticleTitle()+'"',d=this.habraPage.getContentText(e),b,a=this;if(a.isItArticlePage(a)){a.dialogBox.resetDialogFields();a.dialogBox.setDialogContent(c,f,d);b=a.dialogBox.showDialog(c,f);b.done(function(){a.sendRequestToBackgroundPage(c,f,a.dialogBox.getMessageText());a.habraPage.resetState()})}};HabraCorrector.prototype.addHotKey=function(){var a=this,b;window.addEventListener("keydown",function(d){var c=d.ctrlKey||d.metaKey;if(c&&d.keyCode===13){chrome.extension.sendRequest({get_silentMode:true},function(e){b=e.silent_mode;if(b==="true"&&a.habraPage.getSelectedText()!==""){a.habraPage.addErrorText()}else{a.habraPage.addErrorText();a.startDialog()}})}},false)};