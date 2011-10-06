@echo off

set root-dir=%~dp0
set lib-utility-path=%root-dir%lib-utility\
set yuicompressor-path=%lib-utility-path%yuicompressor-2.4.6.jar
set pack-path=%root-dir%ready-to-pack\
set pack-js-path=%pack-path%js
set pack-css-path=%pack-path%css
set pack-image-path=%pack-path%i
set js-path=%root-dir%js
set css-path=%root-dir%css
set image-path=%root-dir%i

set zip-utility-path="%programfiles%\7-Zip\"

SET COPYCMD=/Y

echo "Copying scripts..."
xcopy %js-path% %pack-js-path% /i /d /s

echo "Copying css-styles..."
xcopy %css-path% %pack-css-path% /i /d /s

echo "Copying images..."
xcopy %image-path% %pack-image-path% /i /d /s

echo "Copying manifest..."
xcopy %root-dir%manifest.json %pack-path%manifest.json /d

echo "Copying html-pages..."
xcopy %root-dir%background.html %pack-path%background.html /d
xcopy %root-dir%options.html %pack-path%options.html /d

echo "Compessing and moving a content script..."
java -jar %yuicompressor-path% -o %pack-js-path%\content-script.js %js-path%\content-script.js

echo "Compresing files..."
%zip-utility-path%7z a -r -tzip -o{"%root-dir%"} "pack_extension.zip" ready-to-pack\*



