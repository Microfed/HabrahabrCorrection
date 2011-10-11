@echo off
set content-script-path=.\js\DialogBox.js .\js\ErrorListManager.js .\js\HabraPage.js .\js\HabraCorrector.js .\js\content-script.js
set option=-a -p

jsrun %content-script-path% %option%