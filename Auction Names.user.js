// ==UserScript==
// @name         Auction Names
// @author RyuFive
// @match      https://www.torn.com/displaycase.php*
// @match      https://www.torn.com/amarket.php*
// @namespace    https://github.com/RyuFive/TornScripts/raw/main/Auction Names.user.js
// @updateURL    https://github.com/RyuFive/TornScripts/raw/main/Auction Names.js
// @version      0.7
// @description  try to take over the world!
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license MIT
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

function refreshData()
{
    var x = 1; // 1 Seconds

    // Do your thing here
    var icons = document.querySelectorAll(".bonus-attachment-icons")

    if (icons.length === undefined || icons.length === 0) {
        setTimeout(refreshData, x*1000);
        return
    }

    for (let i = 0; i < icons.length; i++) {
        if (icons[i].lastChild.tagName == 'SPAN') continue
        var bonus = document.createElement('span')

        var name = icons[i].title.split('>')[1].split('<')[0]
        var value = icons[i].title.split('%')[0].split('>')[3] + "% "
        var temp

        if (name == 'Irradiate' || name == 'Smash') {
            value = ''
        }
        else if (name == 'Disarm') {
            value = icons[i].title.split(' turns')[0].split('for ')[1] + " T "
        }
        else if (name == 'Bloodlust') {
            value = icons[i].title.split(' of')[0].split('by ')[1] + " "

        }
        else if (name == 'Execute') {
            value = icons[i].title.split(' life')[0].split('below ')[1] + " "
        }
        else if (name == 'Penetrate') {
            value = icons[i].title.split(' of')[0].split('Ignores ')[1] + " "
        }
        else if (name == 'Eviscerate') {
            value = icons[i].title.split(' extra')[0].split('them ')[1] + " "
        }
        bonus.innerHTML = value + name

        /*

        var background = GM.getValue(name, false)
        bonus.onclick = function () {
            background = !background
            GM.setValue(name, background);
            console.log(await GM.getValue(name))
            if (background == true) bonus.setAttribute('style','background-color: red')
            else bonus.setAttribute('style','')
        };*/
        const good = ['Revitalize', 'Warlord']
        for (var y in good) {
            if (good[y] == name) bonus.setAttribute('style', 'background-color: red')
        }

        icons[i].appendChild(bonus)
    }

    setTimeout(refreshData, x*1000);
}

refreshData()
