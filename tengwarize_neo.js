/**
 * Скрипт подключает шрифт к странице,
 * загружает базу тенгв,
 * и создаёт метод для превращения текста в тенгвар.
 *
 * Вообще так кодить нельзя, это жуткая лапша. Фу таким быть!
 */


var arrayOfTengwas = [];
var config = [];

$.fn.tengwarize = function(options) {
    // @todo: проверить, что в options пришли нужные параметры, и заполнять их оттуда!
    options.font_path = "./tngan.ttf";
    options.json_path = "data_neo.json";
    options.languages = ['ru','en']; // словари, которые применяем
    options.source_selector = ""; // селектор по которому выбираем источник данных
    options.mode = 'once';
    // options.mode = 'event-keyup';

    // @todo: здесь загрузка данных, если они ещё не загружены
    this.tengwar_array = [];
    this.tengwar_config = [];



    if (! $('body.tengwar-loaded')) {
        // Прописываем стили, на которые будет цепляться библиотека для тенгвара
        var sheet = (function() {
            var style = document.createElement("style"); // Create the <style> tag
            style.appendChild(document.createTextNode("")); // WebKit hack :(
            document.head.appendChild(style); // Add the <style> element to the page
            return style.sheet;
        })();
        sheet.insertRule('@font-face { font-family: "Tengwar"; src: url('+options.font_path+') format("truetype");}', sheet.cssRules.length);
        sheet.insertRule('.tengwar { font-family: "Tengwar"; }', sheet.cssRules.length);

        // Загрузка JSON с данным
        $.ajax({
            dataType: "json",
            url: options.json_path,
            success: function(data){
                for (i in options.languages)
                {
                    this.tengwar_array = data.regex.ru; // @todo: add to array instead of writing
                                                        // @todo: not regex.ru! depends on language!
                }
                this.tengwar_config = data.config;
            },
            async: false
        });
    }

    // Если режим разовый - просто конвертируем и всё
    // Если нет - то вешаемся на событие keyup и занимаемся конвертацией при каждом нажатии
    if (options.mode=='once') {
        return this.each(function() {
            var curTengwa;
            // подрубаем к объекту стили со шрифтом Tengwar Annatar
            if (! $(this).hasClass('tengwar')) {
                $(this).addClass('tengwar');
            }
            // Вытаскиваем текст из источника или из того же объекта, на котором инициализированы
            if (! options.source_selector) { // @todo: исправить, ведь это некорректный JS
                var txt = $(this).text();
            }else{
                var txt = $(options.source_selector).text(); // @todo: но источник может не иметь .text, а иметь .val()!
            }
            $(this).html(''); // затираем всё, что есть
            var arTxt = txt.split(' '); // вытащенный текст разбиваем по словам
            for (i in arTxt) { // и по словам превращаем в тенгвар
                // Применяем все шаблоны по очереди
                for (curTengwa in this.tengwar_array) {
                    var re = new RegExp(arrayOfTeng[curTengwa].regexp, "ig");
                    if (arTxt[i].match(re))
                        arTxt[i] = arTxt[i].replace(re, arrayOfTeng[curTengwa].replace);
                }
                // удаляем временные разделители, которые необходимы из-за английского языка
                var re = new RegExp(config.delimiterbefore, "ig");
                arTxt[i] = arTxt[i].replace(re,"");
                var re = new RegExp(config.delimiterafter, "ig");
                arTxt[i] = arTxt[i].replace(re,"");
                // пишем сконвертированное слово в объект
                $(this).append(arTxt[i]+' ');
            }
        });
    } else if (options.mode=='event-keyup') {

    }
}