/**
 * @fileOverview Контент-скрипт, который будет внедряться в страницы хабра-статей. Рисует окошки и отправляет сообщения
 * пользователям-авторам статей.
 * @author <a href="mailto:microfed@gmail.com">Goder</a>
 */

/**
 @namespace Содержит весь функционал контент-скрипта.
 @name ContentScript
 */
$(function () {
    'use strict';
    /**@lends ContentScript*/

    var habraCorrector = new HabraCorrector();
    habraCorrector.Init();
});