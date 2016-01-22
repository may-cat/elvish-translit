/**
 * Скрипт подключает шрифт к странице,
 * загружает базу тенгв,
 * и создаёт метод для превращения текста в тенгвар.
 *
 * Вообще так кодить нельзя, это жуткая лапша. Фу таким быть!
 *
 * @todo: сделать путь до шрифта параметром метода .tengwarize()
 * @todo: сделать путь до data.json параметром метода .tengwarize()
 * @todo: включить все загрузки данных и т.п. в объект, на который инициализирован .tengwarize()
 * @todo: избавиться от глобальных переменных arrayOfTengwas, config - это ж стыдоба!
 */

var sheet = (function() {
    // Create the <style> tag
    var style = document.createElement("style");

    // WebKit hack :(
    style.appendChild(document.createTextNode(""));

    // Add the <style> element to the page
    document.head.appendChild(style);

    return style.sheet;
})();

var arrayOfTengwas = [];
var config = [];
$(document).ready(function(){
    sheet.insertRule('@font-face { font-family: "Tengwar"; src: url(./tngan.ttf) format("truetype");}', sheet.cssRules.length);
    sheet.insertRule('.tengwar { font-family: "Tengwar"; }', sheet.cssRules.length);
    $.ajax({
        dataType: "json",
        url: "data_2.json",
        success: function(x){
            arrayOfTengwas = x.regex_ru;
            config = x.config;
        },
        async: false
    });
});

$.fn.tengwarize = function() {
    return this.each(function() {
        var curTengwa;
        $(this).addClass('tengwar');
        var txt = $(this).text();
        $(this).html('');
        var arTxt = txt.split(' ');
        for (i in arTxt) {
            for (curTengwa in arrayOfTengwas) {
                var re = new RegExp(arrayOfTengwas[curTengwa].regexp, "ig");
                if (arTxt[i].match(re))
                    arTxt[i] = arTxt[i].replace(re, arrayOfTengwas[curTengwa].replace);
            }
            $(this).append(arTxt[i] + ' ');
        }
    });
}