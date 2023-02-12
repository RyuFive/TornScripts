// ==UserScript==
// @name        Fair Fight multi
// @author RyuFive
// @match      https://www.torn.com/profiles.php*
// @namespace    https://github.com/RyuFive/TornScripts/raw/main/Fair_Fight_Multi.user.js
// @version      0.1
// @description  try to take over the world!
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license MIT
// @grant none
// ==/UserScript==

var stat = 5 * 1000000000

window.addEventListener('load', function() {

    // your code here
    var title = document.querySelector("#skip-to-content")

    var respect = document.querySelector("#userInformation > main > div.section.attack-history > div > div.tt-table-body > div > div.tt-table-row-cell.neutral")
    if (respect == null) {
        title.innerHTML += " No attack info avaliable"
        return
    }
    else respect = respect.innerHTML

    var left = document.querySelector("#profileroot > div > div > div > div:nth-child(1) > div.profile-left-wrapper.left > div > div > div.cont.bottom-round.cont-gray > div.profile-information-wrapper.right > div:nth-child(1) > div.block-value > ul > li.digit-r > div.digit.left").innerHTML
    var mid = document.querySelector("#profileroot > div > div > div > div:nth-child(1) > div.profile-left-wrapper.left > div > div > div.cont.bottom-round.cont-gray > div.profile-information-wrapper.right > div:nth-child(1) > div.block-value > ul > li.digit-m > div.digit").innerHTML
    var right = document.querySelector("#profileroot > div > div > div > div:nth-child(1) > div.profile-left-wrapper.left > div > div > div.cont.bottom-round.cont-gray > div.profile-information-wrapper.right > div:nth-child(1) > div.block-value > ul > li.digit-l > div.digit.left").innerHTML
    var level = parseInt(left + mid + right)

    var ff = respect / ((getBaseLog(2.71828, level) + 1.0) / 4.0)
    ff = Math.round(ff * 100)/100
    if (ff > 3) ff = 3

    title.innerHTML += " (Fair Fight x " + ff + ")"
    var ratio = (((ff-1)*3)/8)

    //title.innerHTML += " (Approx Stats: " + Math.round((ratio * (stat*0.5))/10000000)/100 + "b"
    //if (ratio == 0.75) title.innerHTML += "+"
    //title.innerHTML += ")"

}, false);


function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}
