// ==UserScript==
// @name         Auction Names
// @author RyuFive
// @match      https://www.torn.com/amarket.php*
// @namespace    https://github.com/RyuFive/TornScripts/raw/main/Auction Names.user.js
// @downloadURL    https://github.com/RyuFive/TornScripts/raw/main/Auction Names.js
// @updateURL    https://github.com/RyuFive/TornScripts/raw/main/Auction Names.js
// @require      https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// @version      1.3
// @description  try to take over the world!
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license MIT
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

var mode = 'dark' // dark or light

function refreshData()
{
    $(".t-gray-6").html("")

    var row = $(".bonus-attachment-icons").parents("div.item-cont-wrap")

    if (row.length === 0) {
        return
    }

    for (var i in row) {
        if (!isIntNumber(i)) continue
        if (document.URL.includes('amarket')) {
            var title = $(row[i]).find("span.bonus-attachment-icons")[0].title
            if (title == '') continue
        }

        var name = title.split('>')[1].split('<')[0]
        var value = format(title, name)

        $(row[i]).find("p.t-gray-6")[0].innerHTML = value + name
        if ($(row[i]).find("span.bonus-attachment-icons")[1] != undefined) {
            title = $(row[i]).find("span.bonus-attachment-icons")[1].title
            name = title.split('>')[1].split('<')[0]
            value = format(title, name)
            $(row[i]).find("p.t-gray-6")[0].innerHTML += "<br>" + value + name
        }
    }
}

function format(title, name) {
    var value = title.split('%')[0].split('>')[3] + "% "
    if (name == 'Irradiate' || name == 'Smash') {
        value = ''
    }
    else if (name == 'Disarm') {
        value = title.split(' turns')[0].split('for ')[1] + " T "
    }
    else if (name == 'Bloodlust') {
        value = title.split(' of')[0].split('by ')[1] + " "
    }
    else if (name == 'Execute') {
        value = title.split(' life')[0].split('below ')[1] + " "
    }
    else if (name == 'Penetrate') {
        value = title.split(' of')[0].split('Ignores ')[1] + " "
    }
    else if (name == 'Eviscerate') {
        value = title.split(' extra')[0].split('them ')[1] + " "
    }
    return value
}

waitForKeyElements(".item-cont-wrap ", refreshData)
