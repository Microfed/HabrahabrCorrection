@echo off
set js-path=.\js\
set content-script-path=%js-path%DialogBox.js %js-path%ErrorListManager.js %js-path%HabraPage.js %js-path%HabraCorrector.js %js-path%content-script.js %js-path%options.js %js-path%background.js
set option=-a -p

jsrun %content-script-path% %option%