// ==UserScript==
// @name         RW Bonus Convenient Name
// @author      RyuFive
// @match      https://www.torn.com/displaycase.php*
// @match      https://www.torn.com/amarket.php*
// @match      https://www.torn.com/bazaar.php*
// @match      https://www.torn.com/factions.php?step*
// @namespace    https://github.com/RyuFive/TornScripts/raw/main/Auction Names.user.js
// @downloadURL    https://github.com/RyuFive/TornScripts/raw/main/Auction_Names.user.js
// @updateURL    https://github.com/RyuFive/TornScripts/raw/main/Auction_Names.user.js
// @require      https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// @version      3.1
// @description  try to take over the world!
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license MIT
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
#armoury-weapons{
.loaned {
  width: 75px !important;
}
.type {
  width: 133px !important;
}
.double {
  height: 40px !important;
  line-height: 20px !important;
}
}
#armoury-armour{
.loaned {
  width: 75px !important;
}
.type {
  width: 133px !important;
}
.double {
  height: 40px !important;
  line-height: 20px !important;
}
}
`)

function amarket()
{
    $(".t-gray-6").html("")

    var row = $(".bonus-attachment-icons").parents("div.item-cont-wrap")

    if (row.length === 0) {
        return
    }

    for (var i in row) {
        if (!isIntNumber(i)) continue
        var title = $(row[i]).find("span.bonus-attachment-icons")[0].title
        if (title == '') continue

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

function displaycase() {
    var darkmode = $("#dark-mode-state")[0].checked // dark or light

    var items = $(".bonus-attachment-icons").parents("div.iconsbonuses")

    if (items.length === 0) {
        return
    }

    for (var i in items) {
        if (!isIntNumber(i)) continue
        var title = $(items[i]).find("span.bonus-attachment-icons")[0].title
        if (title == '') continue

        var name = title.split('>')[1].split('<')[0]
        var value = format(title, name)

        var bonus = document.createElement('span')
        var br = document.createElement('br')

        bonus.innerHTML = value + name
        if (darkmode) {
            bonus.setAttribute("style", "background-color: #000000b0;")
        }
        else {
            bonus.setAttribute("style", "background-color: #ffffffb0;")
        }
        $(items[i]).find("span.bonus-attachment-icons")[0].appendChild(bonus)
        $(items[i]).find("span.bonus-attachment-icons")[0].setAttribute("style", "float:left;white-space: nowrap;right: 0px;padding-left: 0px;top:-40px")

        var second = $(items[i]).find("span.bonus-attachment-icons")[1]
        if (second != undefined) {
            items[i].insertBefore(br, second)
            title = second.title
            name = title.split('>')[1].split('<')[0]
            value = format(title, name)
            var bonus2 = document.createElement('span')

            bonus2.innerHTML = value + name
            if (darkmode) {
                bonus2.setAttribute("style", "background-color: #000000b0;")
            }
            else {
                bonus2.setAttribute("style", "background-color: #ffffffb0;")
            }
            second.appendChild(bonus2)
            second.setAttribute("style", "float:left;white-space: nowrap;right: 0px;padding-left: 0px;top:-40px")
        }
    }
}

function bazaar(triggered) {
    var darkmode = $("#dark-mode-state")[0].checked // dark or light

    // var items = $(".bonus-attachment-icons").parents("div.iconsbonuses")
    if (triggered && triggered[0] && triggered[0].childElementCount >= 1) {
        var name = triggered[0].childNodes[0].childNodes[0].className.split('-')[2]
        name = name.charAt(0).toUpperCase() + name.slice(1)

        if (name == "Full") name = "EOD"
        if (name == "Negative") name = "Delta"
        if (name == "Sentinel") name = "Sentinel"
        if (name == "Vanguard") name = "Vanguard"


        var bonus = document.createElement('span')
        var br = document.createElement('br')

        bonus.innerHTML = name
        if (darkmode) {
            bonus.setAttribute("style", "background-color: #000000b0;")
        }
        else {
            bonus.setAttribute("style", "background-color: #ffffffb0;")
        }
        triggered[0].childNodes[0].appendChild(bonus)
        triggered[0].setAttribute("style", "float:left;white-space: nowrap;right: 0px;padding-left: 5px;top: 3px;display:inline-block !important")

        if (triggered[0].childElementCount == 2) {
            name = triggered[0].childNodes[1].childNodes[0].className.split('-')[2]
            name = name.charAt(0).toUpperCase() + name.slice(1)

            if (name != undefined) {
                var bonus2 = document.createElement('span')

                bonus2.innerHTML = name
                if (darkmode) {
                    bonus2.setAttribute("style", "background-color: #000000b0;")
                }
                else {
                    bonus2.setAttribute("style", "background-color: #ffffffb0;")
                }
                triggered[0].childNodes[1].appendChild(bonus2)
                triggered[0].setAttribute("style", "float:left;white-space: nowrap;right: 0px;padding-left: 5px;top:3px;display:inline-block !important")
            }
        }
    }
}

function armory(triggered) {
    if (triggered[0].parentElement.parentElement.parentElement.parentElement.id == "armoury-weapons") {
        console.log("HI")
        var display = triggered[0].parentElement.parentElement.childNodes[9]
        display.textContent = ""

        var title1 = triggered[0].childNodes[1].title
        if (title1 == "") return
        var name1 = title1.split('>')[1].split('<')[0]
        var value1 = format(title1, name1)
        var text = document.createElement('span')
        var br = document.createElement('br')
        text.textContent = value1 + name1
        display.appendChild(text)
        display.appendChild(br)


        var title2 = triggered[0].childNodes[3].title
        if (title2 == "") return
        var name2 = title2.split('>')[1].split('<')[0]
        var value2 = format(title2, name2)
        text = document.createElement('span')
        text.textContent = "" + value2 + name2
        text.setAttribute("style", "padding-left: 11px !important;")
        display.appendChild(text)
        display.className += " double"
    }
    else if (triggered[0].parentElement.parentElement.parentElement.parentElement.id == "armoury-armour"){
        display = triggered[0].parentElement.parentElement.childNodes[9]
        display.textContent = ""

        title1 = triggered[0].childNodes[1].title
        if (title1 == "") return
        name1 = title1.split('>')[1].split('<')[0]
        value1 = format(title1, name1)
        text = document.createElement('span')
        br = document.createElement('br')
        text.textContent = value1 + name1
        display.appendChild(text)
        display.appendChild(br)
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

waitForKeyElements(".item-cont-wrap ", amarket)
waitForKeyElements(".display-main-page ", displaycase)
waitForKeyElements(".iconBonuses____iFjZ", bazaar)
waitForKeyElements(".bonus",armory)
