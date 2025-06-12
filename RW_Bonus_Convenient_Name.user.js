// ==UserScript==
// @name         RW Bonus Convenient Name
// @namespace    https://github.com/RyuFive/TornScripts
// @version      5.5
// @description  Displays RW bonus values with convenient names across Torn pages.
// @author       RyuFive
// @match        https://www.torn.com/displaycase.php*
// @match        https://www.torn.com/amarket.php*
// @match        https://www.torn.com/bazaar.php*
// @match        https://www.torn.com/factions.php?step=*
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL  https://github.com/RyuFive/TornScripts/raw/main/RW_Bonus_Convenient_Name.user.js
// @updateURL    https://github.com/RyuFive/TornScripts/raw/main/RW_Bonus_Convenient_Name.user.js
// @license      MIT
// ==/UserScript==

(function addCustomStyles() {
  const css = `
    .custom-left-column {
      float:left;
      margin-top: 15px;
      white-space: nowrap;
      padding-left: 0;
      top:-40px;
    }
    .custom-left-column-two {
      float:left;
      white-space: nowrap;
      vpadding-left: 5px;
      top:3px;
      vdisplay:grid !important
    }
    .custom-bonus-container {
      float: left;
      white-space: nowrap;
      margin-top: 9px;
      vpadding-left: 5;
      vtop: 3px;
      vright: 0px;
      display: inline-block !important;
      position: relative;
    }
    .bonus-attachment-icons {
      float: left !important;
      white-space: nowrap !important;
      padding-left: 0px !important;
      position: relative !important; /* needed if you use absolute children */
      top: -40px !important;
      right: 0px !important;
    }
    .custom-bonus-label {
      font-size: 10px;
      padding: 1px 4px;
      border-radius: 3px;
      margin-left: 2px;
      display: inline-block;
      text-shadow: 0 1px 1px rgba(0,0,0,0.3);
      pointer-events: none;
      user-select: none;
    }
    .custom-bonus-label.dark-mode {
      background: linear-gradient(145deg, rgba(51, 51, 51, 0.7), rgba(17, 17, 17, 0.7)) !important;
      color: white !important;
    }
    .custom-bonus-label.light-mode {
      background: linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(230, 230, 230, 1)) !important;
      color: black !important;
    }
    #armoury-weapons .loaned {
      width: 75px !important;
    }
    #armoury-weapons .type {
      width: 133px !important;
    }
    #armoury-weapons .double {
      height: 40px !important;
      line-height: 20px !important;
    }
    #armoury-armour .loaned {
      width: 75px !important;
    }
    #armoury-armour .type {
      vwidth: 133px !important;
    }
    #armoury-armour .double {
      height: 40px !important;
      line-height: 20px !important;
    }`;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();

// AUCTION HOUSE ========================================================================================================

function amarket() {
    $(".t-gray-6").html(""); // Clear previous content

    const rows = $(".bonus-attachment-icons").parents("div.item-cont-wrap");
    if (rows.length === 0) return;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const container = $(row).find("p.t-gray-6")[0];
        const icons = $(row).find("span.bonus-attachment-icons");

        if (!container || icons.length === 0) continue;

        container.innerHTML = "";

        let bonus1 = "", bonus2 = "";

        // First bonus
        if (icons[0]) {
            const title1 = icons[0].title;
            if (title1) {
                const name1 = title1.split('>')[1]?.split('<')[0];
                const value1 = format(title1, name1);
                bonus1 = value1 + name1;
            }
        }

        // Second bonus
        if (icons[1]) {
            const title2 = icons[1].title;
            if (title2) {
                const name2 = title2.split('>')[1]?.split('<')[0];
                const value2 = format(title2, name2);
                bonus2 = value2 + name2;
            }
        }

        // Output: Second bonus first
        container.innerHTML = bonus2
            ? (bonus1 ? bonus2 + "<br>" + bonus1 : bonus2)
            : bonus1;
    }
}

// AUCTION HOUSE ========================================================================================================

// DISPLAY ========================================================================================================

function displaycase() {
    const items = $(".bonus-attachment-icons").parents("div.iconsbonuses");
    if (items.length === 0) return;

    for (let i in items) {
        if (!isIntNumber(i)) continue;

        const bonusIcons = $(items[i]).find("span.bonus-attachment-icons");
        if (bonusIcons.length === 0) continue;

        // Remove all existing custom spans
        bonusIcons.find("span.custom-bonus-label").remove();

        const first = bonusIcons[0];
        if (!first || !first.title) continue;

        let name1 = first.title.split('>')[1]?.split('<')[0];
        if (!name1) continue;

        let value1 = format(first.title, name1);
        name1 = trueName(name1);

        const bonus1 = document.createElement('span');
        bonus1.className = `custom-bonus-label ${document.body.classList.contains("dark-mode") ? "dark-mode" : "light-mode"}`;
        bonus1.innerHTML = value1 + name1;
        first.appendChild(bonus1);

        const second = bonusIcons[1];
        if (second && second.title) {
            let name2 = second.title.split('>')[1]?.split('<')[0];
            let value2 = format(second.title, name2);
            name2 = trueName(name2);

            const bonus2 = document.createElement('span');
            bonus2.className = `custom-bonus-label ${document.body.classList.contains("dark-mode") ? "dark-mode" : "light-mode"}`;
            bonus2.innerHTML = value2 + name2;
            second.appendChild(bonus2);
        }
    }
}


function observeDarkModeToggle() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (
                mutation.type === "attributes" &&
                mutation.attributeName === "class"
            ) {
                const hasDark = document.body.classList.contains("dark-mode");
                displaycase(); // Re-apply correct styles
            }
        }
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"]
    });
}

observeDarkModeToggle();

// DISPLAY ========================================================================================================

// BAZAAR ========================================================================================================

function bazaar(triggered) {
    if (!triggered || !triggered[0] || triggered[0].childElementCount < 1) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    const modeClass = isDarkMode ? "dark-mode" : "light-mode";

    const container = triggered[0];

    // Remove previous custom labels if any
    container.querySelectorAll('.custom-bonus-label').forEach(e => e.remove());

    const appendBonus = (bonusWrapper) => {
        const element = bonusWrapper?.childNodes?.[0];
        if (!element) return;

        const name = element.getAttribute("data-bonus-attachment-title");
        const desc = element.getAttribute("data-bonus-attachment-description");
        if (!name || !desc) return;

        const value = formatNew(desc, name);

        const bonus = document.createElement('span');
        bonus.className = `custom-bonus-label ${modeClass}`;
        bonus.textContent = `${value}${name}`;

        bonusWrapper.appendChild(bonus);
    };

    appendBonus(container.childNodes[0]);

    if (container.childElementCount === 2) {
        appendBonus(container.childNodes[1]);
    }

    container.classList.add("custom-bonus-container");
}


const observer = new MutationObserver(() => {
    document.querySelectorAll(".iconBonuses____iFjZ").forEach(el => {
        bazaar([el]);
    });
});

observer.observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: false });

// BAZAAR ========================================================================================================

function manage(triggered) {
    if (triggered && triggered[0]) {
        var className = triggered[0].className
        if (className.includes('blank-bonus')) return
        var name = className.split('-')[2]
        name = name.charAt(0).toUpperCase() + name.slice(1)

        name = trueName(name)

        triggered[0].parentElement.parentElement.parentElement.childNodes[2].childNodes[0].innerHTML = triggered[0].parentElement.parentElement.parentElement.childNodes[2].childNodes[0].innerHTML.split(' x')[0] + " (" + name + ")"
    }
}

// ARMORY ========================================================================================================

function armory(triggered) {
    const root = triggered?.[0]?.parentElement?.parentElement?.parentElement?.parentElement;
    if (!root) return;

    const isWeapon = root.id === "armoury-weapons";
    const isArmour = root.id === "armoury-armour";
    if (!isWeapon && !isArmour) return;

    const display = triggered[0]?.parentElement?.parentElement?.childNodes?.[9];
    if (!display) return;

    display.textContent = ""; // Clear previous content

    const createBonus = (child, pad = false) => {
        const title = child?.title;
        if (!title) return null;

        let name = title.split('>')[1]?.split('<')[0];
        if (!name) return null;

        const value = format(title, name);
        name = trueName(name);

        const span = document.createElement('span');
        span.classList.add('custom-bonus-label'); // ✅ Add marker class
        span.textContent = `${value}${name}`;
        if (pad) span.style.paddingLeft = "11px";
        return span;
    };

    // Primary bonus
    const bonus1 = createBonus(triggered[0]?.childNodes?.[1]);
    if (bonus1) {
        display.appendChild(bonus1);
        display.appendChild(document.createElement('br'));
    }

    // Secondary bonus (only for weapons)
    if (isWeapon) {
        const bonus2 = createBonus(triggered[0]?.childNodes?.[3], true);
        if (bonus2) {
            display.appendChild(bonus2);
            display.classList.add("double");
        }
    }
}

// ARMORY ========================================================================================================

// INVENTORY BAZAAR ========================================================================================================

function inventoryandbazaar(triggered) {
    const link = document.URL;

    const removePreviousSpans = (container) => {
        if (container) {
            container.querySelectorAll(".custom-bonus-label").forEach(span => span.remove());
        }
    };

    if (link.includes('item')) {
        if (triggered && triggered[0] && triggered[0].childElementCount >= 3) {
            let element = triggered[0].childNodes[5]?.childNodes[1];
            if (triggered[0].childNodes[5]?.className?.includes('testtest')) {
                element = triggered[0].childNodes[7]?.childNodes[1];
            }

            if (!element || !element.title) return;

            let container = triggered[0].parentElement.parentElement.parentElement
                                .childNodes[3].childNodes[1].childNodes[3].childNodes[3];
            removePreviousSpans(container);

            let name = element.title.split('>')[1].split('<')[0];
            let value = format(element.title, name);
            name = trueName(name);

            const span1 = document.createElement('span');
            span1.classList.add("custom-bonus-label");
            span1.textContent = ` (${value} ${name}`;
            container.appendChild(span1);

            const nextBonus = element.parentElement.childNodes[3];
            if (nextBonus && !nextBonus.className.includes('blank-bonus') && nextBonus.title) {
                name = nextBonus.title.split('>')[1].split('<')[0];
                value = format(nextBonus.title, name);
                name = trueName(name);

                const span2 = document.createElement('span');
                span2.classList.add("custom-bonus-label");
                span2.textContent = `, ${value} ${name})`;
                container.appendChild(span2);
            } else {
                span1.textContent += ')';
            }
        }

    } else if (link.includes('bazaar.php#/add')) {
        if (triggered && triggered[0] && triggered[0].childElementCount >= 1) {
            const element = triggered[0].childNodes[2]?.childNodes[0];
            if (!element || !element.title) return;

            let container = triggered[0].parentElement.parentElement.parentElement
                                .childNodes[1].childNodes[1].childNodes[0];
            removePreviousSpans(container);

            let name = element.title.split('>')[1].split('<')[0];
            let value = format(element.title, name);
            name = trueName(name);

            const span1 = document.createElement('span');
            span1.classList.add("custom-bonus-label");
            span1.textContent = ` (${value} ${name}`;
            container.appendChild(span1);

            const nextBonus = element.parentElement.childNodes[1];
            if (nextBonus && !nextBonus.className.includes('blank-bonus') && nextBonus.title) {
                name = nextBonus.title.split('>')[1].split('<')[0];
                value = format(nextBonus.title, name);
                name = trueName(name);

                const span2 = document.createElement('span');
                span2.classList.add("custom-bonus-label");
                span2.textContent = `, ${value} ${name})`;
                container.appendChild(span2);
            } else {
                span1.textContent += ')';
            }
        }
    }
}

// INVENTORY BAZAAR ========================================================================================================

// ITEM MARKET ========================================================================================================

function newItemMarket(triggered) {
    if (!triggered?.[0]) return;
    if (!document.URL.includes('ItemMarket')) return;

    const isDarkMode = document.body.classList.contains("dark-mode");
    const modeClass = isDarkMode ? "dark-mode" : "light-mode";

    const bonusContainer = triggered[0].childNodes?.[0]?.childNodes?.[2]?.childNodes?.[0];
    const primary = bonusContainer?.childNodes?.[1]?.childNodes?.[0];
    if (!primary) return;

    const leftColumn = bonusContainer.childNodes?.[0];
    if (!leftColumn) return;

    // 🔹 Remove old spans before adding new ones
    leftColumn.querySelectorAll(".custom-bonus-label").forEach(el => el.remove());

    const name1 = primary.getAttribute("data-bonus-attachment-title");
    const desc1 = primary.getAttribute("data-bonus-attachment-description");
    const value1 = formatNew(desc1, name1);

    const span1 = document.createElement('span');
    span1.textContent = value1 + name1;
    span1.className = `custom-bonus-label ${modeClass}`;
    leftColumn.appendChild(span1);

    leftColumn.classList.add("custom-left-column");
    leftColumn.style.cssText = "float:left;white-space: nowrap;right: 0px;padding-left: 0px;top:-40px";

    const secondBonusExists = bonusContainer?.childNodes?.[1]?.childElementCount === 2;
    if (secondBonusExists) {
        const secondary = bonusContainer.childNodes[1].childNodes[1];
        const name2 = secondary.getAttribute("data-bonus-attachment-title");
        const desc2 = secondary.getAttribute("data-bonus-attachment-description");
        const value2 = formatNew(desc2, name2);

        const span2 = document.createElement('span');
        span2.textContent = value2 + name2;
        span2.className = `custom-bonus-label ${modeClass}`;
        leftColumn.appendChild(span2);

        leftColumn.classList.add("custom-left-column-two");
    }
}


function rerunNewItemMarket() {
    document.querySelectorAll(".itemTile___cbw7w").forEach(el => {
        const bonusArea = el.querySelector(".bonuses-wrap") ||
                          el.childNodes?.[0]?.childNodes?.[2]?.childNodes?.[0]?.childNodes?.[0];
        if (bonusArea) {
            bonusArea.querySelectorAll(".custom-bonus-label").forEach(span => span.remove());
            newItemMarket([el]);
        }

    });
}

let darkModeTimer;
const darkModeObserver = new MutationObserver(() => {
    clearTimeout(darkModeTimer);
    darkModeTimer = setTimeout(rerunNewItemMarket, 50); // slight debounce
});

darkModeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"]
});

// ITEM MARKET ========================================================================================================

// FORMATTING ========================================================================================================

function format(title, name) {
    const excludedNames = ['Irradiate', 'Smash', 'Dimensiokinesis', 'Oneirokinesis'];
    if (excludedNames.includes(name)) return '';

    const specialHandlers = {
        'Disarm': () => title.split(' turns')[0]?.split('for ')[1] + " T ",
        'Bloodlust': () => title.split(' of')[0]?.split('by ')[1] + " ",
        'Execute': () => title.split(' life')[0]?.split('below ')[1] + " ",
        'Penetrate': () => title.split(' of')[0]?.split('Ignores ')[1] + " ",
        'Eviscerate': () => title.split(' extra')[0]?.split('them ')[1] + " ",
        'Poison': () => title.split(' chance to Poison')[0]?.split('</b><br/>')[1] + " "
    };

    if (specialHandlers[name]) {
        try {
            return specialHandlers[name]() || '';
        } catch (e) {
            console.warn(`Format error for "${name}":`, e);
            return '';
        }
    }

    // Default fallback (tries to extract % value from HTML-ish string)
    try {
        const raw = title.split('>')[3]?.split('%')[0];
        return raw ? raw + '% ' : '';
    } catch (e) {
        console.warn('Default format parsing failed:', e);
        return '';
    }
}

function formatNew(desc, name) {
    const specialHandlers = {
        'Disarm': () => desc.split(' turns')[0]?.split('for ')[1] + " T ",
        'Bloodlust': () => desc.split(' of')[0]?.split('by ')[1] + " ",
        'Execute': () => desc.split(' life')[0]?.split('below ')[1] + " ",
        'Penetrate': () => desc.split(' of')[0]?.split('Ignores ')[1] + " ",
        'Eviscerate': () => desc.split(' extra')[0]?.split('them ')[1] + " ",
        'Poison': () => desc.split(' chance to Poison')[0] + " ",
    };

    const excludedNames = ['Irradiate', 'Smash', 'Dimensiokinesis', 'Oneirokinesis'];

    if (excludedNames.includes(name)) return '';

    if (specialHandlers[name]) {
        try {
            return specialHandlers[name]() || '';
        } catch (e) {
            console.warn(`Failed to format "${name}": ${e}`);
            return '';
        }
    }

    return desc.split('%')[0] + "% ";
}

function trueName(text) {
    const map = {
        "Full": "EOD",
        "Negative": "Delta",
        "Poisoned": "Poison"
    };

    return map[text] || text;
}

// FORMATTING ========================================================================================================

const observerMap = {
  ".item-cont-wrap": amarket,
  ".display-main-page": displaycase,
  ".iconBonuses____iFjZ": bazaar,
  ".extraBonusIcon___x2WH_": manage,
  ".bonuses-wrap": inventoryandbazaar,
  ".bonus": armory,
  ".itemTile___cbw7w": newItemMarket
};

const seenElements = new WeakSet();

const process = () => {
  for (const [selector, callback] of Object.entries(observerMap)) {
    document.querySelectorAll(selector).forEach(el => {
      if (!seenElements.has(el)) {
        seenElements.add(el);
        callback([el]); // ⬅️ wrap element in array for compatibility
      }
    });
  }
};


// Observe DOM changes
const mainObserver = new MutationObserver(process);
mainObserver.observe(document.body, { childList: true, subtree: true });

// Initial check
process();
