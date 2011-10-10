@echo off
set content-script-path=.\js\content-script.js
set option=-a -p

jsrun %content-script-path% %option%