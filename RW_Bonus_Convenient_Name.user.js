// ==UserScript==
// @name         RW Bonus Convenient Name
// @namespace    https://github.com/RyuFive/TornScripts
// @version      6.1.1
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

    // leftColumn.style.cssText = "float:left;white-space: nowrap;right: 0px;padding-left: 0px;top:-40px";
(function addCustomStyles() {
  const css = `
    .custom-itemmarket-container {
      display: flex !important;
      flex-direction: column;
      margin-top: 15px;
      white-space: normal;
      padding-left: 0;
    }
    .custom-bazaar-container {
      float: left;
      white-space: nowrap;
      margin-top: 9px;
      padding-left: 5;
      top: 3px;
      right: 0px;
      display: inline-block !important;
      position: relative;
    }
    .bonus-attachment-icons {
      width: auto !important;
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
      margin-bottom: 2px;
      display: inline-block;
      text-shadow: 0 1px 1px rgba(0,0,0,0.3);
      pointer-events: none;
      user-select: none;
      white-space: nowrap;       /* ✅ prevents wrapping */
      max-width: 100%;
    }
    .custom-bonus-label.dark-mode {
      background: linear-gradient(145deg, rgba(51, 51, 51, 0.7), rgba(17, 17, 17, 0.7)) !important;
      color: white !important;
    }
    .custom-bonus-label.light-mode {
      background: linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(230, 230, 230, 1)) !important;
      color: black !important;
    }
    .item-cont-wrap.glow-yellow-style {
      background-color: rgba(255, 255, 0, 0.2);
      border: 1px solid gold !important;
      border-radius: 6px;
    }
    .item-cont-wrap.glow-orange-style {
      background-color: rgba(255, 140, 0, 0.2);
      border: 1px solid darkorange !important;
      border-radius: 6px;
    }
    .item-cont-wrap.glow-red-style {
      background-color: rgba(255, 60, 60, 0.2);
      border: 1px solid crimson !important;
      border-radius: 6px;
    }
    #armoury-weapons .loaned {
      width: 75px !important;
      overflow: visible !important;
    }
    #armoury-weapons .type {
      width: 126px !important;
    }
    #armoury-weapons .double {
      height: 40px !important;
      line-height: 15px !important;
    }
    #armoury-armour .loaned {
      width: 75px !important;
      overflow: visible !important;
    }
    #armoury-armour .type {
      width: 126px !important;
    }
    #armoury-armour .double {
      height: 40px !important;
      line-height: 15px !important;
    }`;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();

function isMobile() {
    const menuDiv = document.querySelector('.header-menu.left.leftMenu___md3Ch');
    return menuDiv ? menuDiv.classList.contains('dropdown-menu') : false;
}

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

        // === Set background color and border based on glow class ===
        const glow = row.querySelector(".item-plate");

        row.classList.remove("glow-yellow-style", "glow-orange-style", "glow-red-style");

        if (glow?.classList.contains("glow-yellow")) {
            row.classList.add("glow-yellow-style");
        } else if (glow?.classList.contains("glow-orange")) {
            row.classList.add("glow-orange-style");
        } else if (glow?.classList.contains("glow-red")) {
            row.classList.add("glow-red-style");
        }

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

    container.classList.add("custom-bazaar-container");
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
    if (isMobile()) {
        // MOBILE LOGIC
        const root = triggered?.[0]
        if (!root) return

        // Traverse up to the main armoury section
        const armouryRoot = root.closest("#armoury-weapons, #armoury-armour")
        if (!armouryRoot) return

        const isWeapon = armouryRoot.id === "armoury-weapons"

        // Locate the display element (child index 9 from the grandparent)
        const display = root.parentElement?.parentElement?.childNodes?.[3]
        if (!display) return
        if (display.textContent.endsWith(")")) return

        // Locate the display element (child index 9 from the grandparent)
        const createBonusText = (child) => {
            const title = child?.title
            if (!title) return null

            const nameMatch = title.match(/>([^<]+)</)
            if (!nameMatch) return null

            const rawName = nameMatch[1].trim()
            const value = format(title, rawName)
            return `${value}${trueName(rawName)}`
        };

        // Build bonuses
        const bonuses = [
            createBonusText(root.childNodes?.[1]),
            isWeapon && createBonusText(root.childNodes?.[3])
        ].filter(Boolean)

        // Set formatted text
        if (bonuses.length) {
            display.textContent += ` (${bonuses.join(" - ")})`
        }
        display.title = display.textContent
    }
    else {
        // PC LOGIC
        const root = triggered?.[0]
        if (!root) return

        // Traverse up to the main armoury section
        const armouryRoot = root.closest("#armoury-weapons, #armoury-armour")
        if (!armouryRoot) return

        const isWeapon = armouryRoot.id === "armoury-weapons"

        // Locate the display element (child index 9 from the grandparent)
        const display = root.parentElement?.parentElement?.childNodes?.[9]
        if (!display) return

        display.textContent = ""; // Clear old content

        const createBonus = (child, pad = false) => {
            const title = child?.title
            if (!title) return null

            let name = title.split(">")[1]?.split("<")[0]
            if (!name) return null

            const value = format(title, name)
            name = trueName(name)

            const span = document.createElement("span")
            span.className = "custom-bonus-label" // marker class
            span.textContent = `${value}${name}`
            if (pad) span.style.paddingLeft = "11px"
            return span
        };

        // Append bonuses
        const bonuses = [
            createBonus(root.childNodes?.[1]),
            isWeapon && createBonus(root.childNodes?.[3], true)
        ].filter(Boolean)

        bonuses.forEach((bonus, i) => {
            display.appendChild(bonus)
            if (i === 0 && bonuses.length > 1) {
                display.appendChild(document.createElement("br"))
                display.classList.add("double")
            }
        })
    }
}

// ARMORY ========================================================================================================

// INVENTORY BAZAAR ========================================================================================================

function inventoryandbazaar(triggered) {
    const link = document.URL

    const removePreviousSpans = (container) => {
        if (container) {
            container.querySelectorAll(".custom-bonus-label").forEach(span => span.remove())
        }
    }

    if (link.includes('item')) {

        if (triggered?.[0]?.childElementCount >= 3) {
            const row = triggered[0];
            const bonusParentIndex = row.childNodes[5]?.className?.includes('testtest') ? 7 : 5;
            const element = row.childNodes[bonusParentIndex]?.childNodes?.[1];

            if (!element?.title) return;

            // Locate container once
            var parent = container = row.parentElement?.parentElement?.parentElement
            var container = ""
            if(isMobile()) {
                container = parent.querySelector(".name")
            }
            else {
                container = parent.querySelector(".name")
            }

            if (!container) return;

            removePreviousSpans(container);

            const parseBonus = (el) => {
                if (!el?.title) return null;
                const match = el.title.match(/>([^<]+)</);
                if (!match) return null;
                const rawName = match[1].trim();
                return `${format(el.title, rawName)} ${trueName(rawName)}`;
            };

            // Primary bonus
            const bonuses = [parseBonus(element)];

            // Secondary bonus
            const nextBonus = element.parentElement?.childNodes?.[3];
            if (nextBonus && !nextBonus.className?.includes('blank-bonus')) {
                const parsed = parseBonus(nextBonus);
                if (parsed) bonuses.push(parsed);
            }

            // Build and append single span
            if (bonuses[0]) {
                const span = document.createElement('span');
                span.className = "custom-bonus-label";
                span.textContent = ` (${bonuses.join(', ')})`;
                container.appendChild(span);
            }
        }
    } else if (link.includes('bazaar.php#/add')) {
        if (triggered && triggered[0] && triggered[0].childElementCount >= 1) {
            const element = triggered[0].childNodes[2]?.childNodes[0]
            if (!element || !element.title) return

            let container = triggered[0].parentElement.parentElement.parentElement
                                .childNodes[1].childNodes[1].childNodes[0]
            removePreviousSpans(container)

            let name = element.title.split('>')[1].split('<')[0]
            let value = format(element.title, name)
            name = trueName(name)

            const span1 = document.createElement('span')
            span1.classList.add("custom-bonus-label")
            span1.textContent = ` (${value} ${name}`
            container.appendChild(span1)

            const nextBonus = element.parentElement.childNodes[1]
            if (nextBonus && !nextBonus.className.includes('blank-bonus') && nextBonus.title) {
                name = nextBonus.title.split('>')[1].split('<')[0]
                value = format(nextBonus.title, name)
                name = trueName(name)

                const span2 = document.createElement('span')
                span2.classList.add("custom-bonus-label")
                span2.textContent = `, ${value} ${name})`
                container.appendChild(span2)
            } else {
                span1.textContent += ')'
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

    leftColumn.classList.add("custom-itemmarket-container");

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
    }
}

function addItem(triggered) {
    const row = triggered[0]
    const bonusElement = row?.childNodes[3]?.childNodes[0]
    const bonusDoesNotExist = row?.childNodes[3]?.childNodes[0]?.className.includes("bonus-attachment-blank-bonus-25")
    if (bonusDoesNotExist) {
        return
    }
    const parentElement = row?.parentElement?.parentElement?.parentElement?.childNodes[0]?.childNodes[1]?.childNodes[0]

    const parseBonus = el => {
        if (!el || el.classList.contains("bonus-attachment-blank-bonus-25")) return null
        const cls = [...el.classList].find(c => c.startsWith("bonus-attachment-"))
        if (!cls) return null
        const name = cls.replace("bonus-attachment-", "")
        return [format(cls.trim(), name.trim()), trueName(name.trim().charAt(0).toUpperCase() + name.trim().slice(1))].filter(Boolean).join(" ")
    }


    // Primary bonus
    const bonuses = [parseBonus(bonusElement)]

    // Secondary bonus
    const nextBonus = bonuses?.parentElement?.childNodes[1]
    if (nextBonus && !nextBonus.className?.includes('blank-bonus')) {
        const parsed = parseBonus(nextBonus)
        if (parsed) bonuses.push(parsed)
    }

    // Build and append single span
    if (bonuses[0]) {
        parentElement.innerHTML += "<br>"
        parentElement.className += " custom-bonus-label"
        parentElement.textContent += ` (${bonuses.join(', ')})`
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
  ".itemTile___cbw7w": newItemMarket,
  // ".properties___wA7fL": addItem
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
