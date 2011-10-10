@echo off
set DOCDIR=%JSDOCDIR%
set APPDIR=%JSDOCDIR%\app
set BASEDIR=%JSDOCDIR%
set TDIR=%JSDOCTEMPLATEDIR%
set DOCSDIR=%CD%\docs

set CMD=java -Djsdoc.dir=%DOCDIR% -Djsdoc.template.dir=%TDIR% -jar %BASEDIR%\jsrun.jar %APPDIR%\run.js -d=%DOCSDIR% %1
echo Writing a documentation...
echo Output dir: %DOCSDIR%
%CMD%