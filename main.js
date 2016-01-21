var sheet = (function() {
    // Create the <style> tag
    var style = document.createElement("style");

    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute("media", "screen")
    // style.setAttribute("media", "only screen and (max-width : 1024px)")

    // WebKit hack :(
    style.appendChild(document.createTextNode(""));

    // Add the <style> element to the page
    document.head.appendChild(style);

    return style.sheet;
})();

var arrayOfTengwas = [];
$(document).ready(function(){
    sheet.insertRule('@font-face { font-family: "Tengwar"; src: url(http://may-cat.ru/tengwar/tngan.ttf) format("truetype");}', sheet.cssRules.length);
    sheet.insertRule('.tengwar { font-family: "Tengwar"; }', sheet.cssRules.length);
    $.ajax({
        dataType: "json",
        url: "data.json",
        success: function(x){
            arrayOfTengwas = x;
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