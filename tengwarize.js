/**
 * Скрипт подключает шрифт к странице,
 * загружает базу тенгв,
 * и создаёт метод для превращения текста в тенгвар.
 */

(function ( $ ) {
    options = {};
    options.font_path = "./tngan.ttf";
    options.json_path = "data.json";
    // Прописываем стили, на которые будет цепляться библиотека для тенгвара
    var sheet = (function() {
        var style = document.createElement("style"); // Create the <style> tag
        style.appendChild(document.createTextNode("")); // WebKit hack :(
        document.head.appendChild(style); // Add the <style> element to the page
        return style.sheet;
    })();
    sheet.insertRule('@font-face { font-family: "Tengwar Annatar"; src: url('+options.font_path+') format("truetype");}', sheet.cssRules.length);
    sheet.insertRule('.tengwar { font-family: "Tengwar Annatar"; }', sheet.cssRules.length);

    var methods = {
        init: function (options){
            this.css({fontFamily: "Tengwar Annatar"});
            var $this = this;
            this.tengwar_array = [];
            this.tengwar_config = [];
            // Загрузка JSON с данным
            $.ajax({
                dataType: "json",
                url: options.json_path,
                success: function(data) {
                    $this.tengwar_array = $this.tengwar_array.concat(data.regex.digits); // @todo: сделать перебор языков по переданным в options
                    $this.tengwar_array = $this.tengwar_array.concat(data.regex.en); // @todo: сделать перебор языков по переданным в options
                    $this.tengwar_array = $this.tengwar_array.concat(data.regex.ru); // @todo: сделать перебор языков по переданным в options
                    console.log($this.tengwar_array);
                    $this.tengwar_config = data.config;
                    if (options.mode=='once') {
                        $(this).each(function() {
                            $this.tengwarize('convert_text',options);
                        });
                    } else if (options.mode=='event-keyup') {
                        $(options.source_selector).keyup(function(){$this.tengwarize('convert_text',options);});
                        $this.tengwarize('convert_text',options);
                    } else if (options.mode=='change') {
                        $(options.source_selector).change(function(){$this.tengwarize('convert_text',options);});
                    }
                }
            });
        },
        convert_text: function(options) {
            // подрубаем к объекту стили со шрифтом Tengwar Annatar
            var txt = this.tengwarize('extract_text',options);
            $(this).html(''); // затираем всё, что есть
            var arTxt = txt.split('\n'); // вытащенный текст разбиваем по словам
            for (line in arTxt){
                var arLine = arTxt[line].split(' ');
                for (i in arLine) { // и по словам превращаем в тенгвар
                    var curTengwa;
                    // Применяем все шаблоны по очереди
                    for (curTengwa in this.tengwar_array) {
                        var re = new RegExp(this.tengwar_array[curTengwa].regexp, "ig");
                        if (arLine[i].match(re))
                            arLine[i] = arLine[i].replace(re, this.tengwar_array[curTengwa].replace);
                        console.log(arLine[i]);
                    }
                    // удаляем временные разделители, которые необходимы из-за английского языка
                    var re = new RegExp(this.tengwar_config.delimiterbefore, "ig");
                    arLine[i] = arLine[i].replace(re,"");
                    var re = new RegExp(this.tengwar_config.delimiterafter, "ig");
                    arLine[i] = arLine[i].replace(re,"");
                    // пишем сконвертированное слово в объект
                    $(this).append(arLine[i]+' ');
                }
                if (options.linebreaks)
                    $(this).append('<br>');
            }
        },
        extract_text: function(options) {
            // Вытаскиваем текст из источника или из того же объекта, на котором инициализированы
            if (! options.source_selector) { // @todo: исправить, ведь это некорректный JS
                var txt = $(this).text();
            } else {
                 if ($(options.source_selector).val().length>0)
                    return $(options.source_selector).val(); // @todo: но источник может не иметь .text, а иметь .val()!
                 else
                    return $(options.source_selector).text();
            }
            return txt;
        }
    };


    $.fn.tengwarize = function(method) {
        // @todo: проверить, что в options пришли нужные параметры, и заполнять их оттуда!
        options = {};
        options.font_path = "./tngan.ttf";
        options.json_path = "data.json";
        options.languages = ['ru','en','digits']; // словари, которые применяем
        options.source_selector = ""; // селектор по которому выбираем источник данных
        options.mode = 'once';
        // options.mode = 'event-keyup';


        if ( methods[method] ) {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          $.error( 'Метод с именем ' +  method + ' не существует для jQuery.tengwarize' );
        }
    }

}( jQuery ));