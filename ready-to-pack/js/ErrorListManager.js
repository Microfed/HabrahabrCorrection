var ErrorListManager=function(a){this.errorDict=a};ErrorListManager.prototype.getErrorMessageText=function(b){var a;var c=this;$.each(c.errorDict.errorTypes,function(){if(this.optionText===b){a=this.messageText;return false}if(c.isErrorHasSubTypes(this.optionText)){$.each(this.errorSubtypes,function(){if(this.optionText===b){a=this.messageText;return false}})}});return a};ErrorListManager.prototype.isErrorHasSubTypes=function(a){var c=false;var b=this;$.each(b.errorDict.errorTypes,function(){if(this.optionText===a&&this.errorSubtypes!==undefined){c=true;return false}});return c};