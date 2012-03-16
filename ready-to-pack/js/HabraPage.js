var HabraPage=function(){this.AUTHOR_CLASS_NAME="div.vcard.author.full a.fn.nickname.url";this.AUTHOR_CLASS_NAME_MODIFIED="div.vcard.author.full a.fn.nickname.url.karmaloaded";this.HABRAHABR_URL="habrahabr.ru";this.selectedErrors=[]};HabraPage.prototype.isCurrentUrlCorrect=function(){var b=false,a=document.baseURI;if(a.search(this.HABRAHABR_URL)!==-1){b=true}if(document.getElementById("comments")!==null){b=b&&true}else{b=false}return b};HabraPage.prototype.getAuthorName=function(){var b,c=$(this.AUTHOR_CLASS_NAME).length,a;if(c>0){for(a=0;a<c;a=+1){if($(this.AUTHOR_CLASS_NAME).attr("title")==="Автор текста"){b=$(this.AUTHOR_CLASS_NAME).text()}}}else{if($(this.AUTHOR_CLASS_NAME_MODIFIED).length>0){b=$(this.AUTHOR_CLASS_NAME_MODIFIED).text()}else{if($("div.infopanel div.author a").length>0){b=$("div.infopanel div.author a").text()}}}return b};HabraPage.prototype.getArticleTitle=function(){var a;if($("div.hentry h2.entry-title.single-entry-title span.topic").length>0){a=$("div.hentry h2.entry-title.single-entry-title span.topic")}else{if($("div.post h2.title span.post_title").length>0){a=$("div.post h2.title span.post_title")}else{if($("div.post h1.title span.post_title").length>0){a=$("div.post h1.title span.post_title")}}}return a.text()};HabraPage.prototype.getSelectedText=function(){var a="";if(window.getSelection){a=window.getSelection().toString()}else{if(document.getSelection){a=document.getSelection()}else{if(document.selection){a=document.selection.createRange().text}}}return a};HabraPage.prototype.getErrorsText=function(){var b,a="",c=this.selectedErrors.length;for(b=0;b<c;b+=1){a+=this.selectedErrors[b]}return a};HabraPage.prototype.getContentText=function(a){return'Ошибка в статье <a href="'+a+'">'+this.getArticleTitle()+"</a>"+this.getErrorsText()};HabraPage.prototype.addErrorText=function(){var a=this.getSelectedText();if(a!==""){this.selectedErrors.push("\n<blockquote>"+a+"</blockquote>")}};HabraPage.prototype.resetState=function(){this.selectedErrors=[]};