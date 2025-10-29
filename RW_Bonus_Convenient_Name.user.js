// ==UserScript==
// @name         RW Bonus Convenient Name
// @namespace    https://github.com/RyuFive/TornScripts
// @version      7.5
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

let bonusColorsEnabled = true;

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
      display:
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
      display: inline-table !important;
      width: auto !important;
      float: left !important;
      white-space: nowrap !important;
      padding-left: 0px !important;
      padding-top: 3px !important;
      position: relative !important; /* needed if you use absolute children */
      top: -40px !important;
      right: 0px !important;
    }
    .custom-bonus-label {
      font-size: 12px;
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
    .custom-bonus-badge {
      display: inline-block;
      font-size: 1em;
      font-weight: 600;
      color: #fff;
      border-radius: 8px;
      padding: 3px 8px;
      white-space: nowrap;
      line-height: 1.1em;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      border: 1px solid rgba(0,0,0,0.6);
      vertical-align: middle;
      transition: background 0.4s ease, transform 0.1s ease;
    }
    .custom-bonus-badge.dark-mode {
      text-shadow: 0 0 2px rgba(0,0,0,1),0 0 3px rgba(0,0,0,0.9),0 0 3px rgba(0,0,0,0.9);
      color: white !important;
    }
    .custom-bonus-badge.light-mode {
      text-shadow: 0 0 2px rgba(255,255,255,1),0 0 3px rgba(255,255,255,0.9),0 0 3px rgba(255,255,255,0.9);
      color: black !important;
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


const bonusRanges = {
  // Weapon bonuses
  blindfire: { min: 15, max: 20 },
  burn: { min: 30, max: 50 },
  demoralize: { min: 20, max: 23 },
  emasculate: { min: 15, max: 16 },
  freeze: { min: 20, max: 26 },
  hazardous: { min: 20, max: 31 },
  laceration: { min: 35, max: 45 },
  poison: { min: 85, max: 100 },
  "severe burning": { min: 100, max: 100 },
  shock: { min: 75, max: 100 },
  sleep: { min: 0, max: 0 },
  smash: { min: 100, max: 100 },
  spray: { min: 20, max: 24 },
  storage: { min: 0, max: 0 },
  toxin: { min: 30, max: 44 },
  achilles: { min: 50, max: 149 },
  assassinate: { min: 50, max: 148 },
  backstab: { min: 30, max: 96 },
  berserk: { min: 20, max: 87 },
  bleed: { min: 20, max: 72 },
  blindside: { min: 25, max: 96 },
  bloodlust: { min: 10, max: 19 },
  comeback: { min: 50, max: 127 },
  conserve: { min: 25, max:  49},
  cripple: { min: 20, max: 58 },
  crusher: { min: 50, max: 133 },
  cupid: { min: 50, max: 158 },
  deadeye: { min: 25, max: 123 },
  deadly: { min: 2, max: 10 },
  disarm: { min: 3, max: 15 },
  "double-edged": { min: 10, max: 32 },
  "double tap": { min: 15, max: 57 },
  empower: { min: 50, max: 206 },
  eviscerate: { min: 15, max: 34 },
  execute: { min: 15, max: 29 },
  expose: { min: 7, max: 21 },
  finale: { min: 10, max: 17 },
  focus: { min: 15, max: 35 },
  frenzy: { min: 5, max: 14 },
  fury: { min: 10, max: 36 },
  grace: { min: 20, max: 66 },
  "home run": { min: 50, max: 93 },
  irradiate: { min: 100, max: 100 },
  motivation: { min: 15, max: 35 },
  paralyze: { min: 5, max: 18 },
  parry: { min: 50, max: 92 },
  penetrate: { min: 25, max: 49 },
  plunder: { min: 20, max: 49 },
  powerful: { min: 15, max: 49 },
  proficience: { min: 20, max: 59 },
  puncture: { min: 20, max: 57 },
  quicken: { min: 50, max: 219 },
  rage: { min: 4, max: 18 },
  revitalize: { min: 10, max: 24 },
  roshambo: { min: 50, max: 132 },
  slow: { min: 20, max: 64 },
  smurf: { min: 1, max: 5 },
  specialist: { min: 20, max: 59 },
  stricken: { min: 30, max: 96 },
  stun: { min: 10, max: 40 },
  suppress: { min: 25, max: 49 },
  "sure shot": { min: 3, max: 11 },
  throttle: { min: 50, max: 170 },
  warlord: { min: 15, max: 38 },
  weaken: { min: 20, max: 63 },
  "wind-up": { min: 125, max: 221 },
  wither: { min: 20, max: 63 },

  // Armor bonuses
  impregnable: { min: 20, max: 29 },
  impenetrable: { min: 20, max: 29 },
  insurmountable: { min: 30, max: 39 },
  invulnerable: { min: 4, max: 14 },
  imperviable: { min: 2, max: 10 },
  immutable: { min: 15, max: 50 },
  irrepressible: { min: 15, max: 52 },
  impassable: { min: 20, max: 28 }
};


function createBonusBadge(value, name) {

    const isDarkMode = document.body.classList.contains("dark-mode");
    const modeClass = isDarkMode ? "dark-mode" : "light-mode";

    const badge = document.createElement('div');
    badge.className = `custom-bonus-badge ${modeClass}`;

    // Extract numeric part of value
    const numericValue = parseInt(String(value).replace(/[^0-9.-]/g, ''), 10) || 0;
    const keyName = name.toLowerCase().replace(/\s+/g, ' ').trim();

    // Lookup range
    const range = bonusRanges[keyName];
    let gradient = 'linear-gradient(90deg, #333, #3a3a3a)'; // default gray

    if (bonusColorsEnabled && range && range.max > range.min) {
        const { min, max } = range;
        const percent = Math.min(Math.max(((numericValue - min) / (max - min)) * 100, 0), 100);


        const badgeOpacity = 0.75; // 🎛️ Adjust transparency (0 = invisible, 1 = solid)

        // if (percent >= 50) gradient = `linear-gradient(90deg, rgba(2,48,32,${badgeOpacity}), rgba(34,139,34,${badgeOpacity}))`; // green
        // else if (percent >= 25) gradient = `linear-gradient(90deg, rgba(138,101,0,${badgeOpacity}), rgba(191,111,0,${badgeOpacity}))`; // yellow
        // else gradient = `linear-gradient(90deg, rgba(128,0,32,${badgeOpacity}), rgba(192,64,0,${badgeOpacity}))`; // red

        let fillColor, baseColor;

        if (percent >= 50) {
            fillColor = `rgba(128,0,32,${badgeOpacity})`; // red
            baseColor = `rgba(128,0,32,0.2)`; // faded red
        } else if (percent >= 25) {
            fillColor = `rgba(191,111,0,${badgeOpacity})`; // orange
            baseColor = `rgba(191,111,0,0.2)`; // faded orange
        } else {
            fillColor = `rgba(191,191,0,${badgeOpacity})`; // yellow
            baseColor = `rgba(191,191,0,0.2)`; // faded yellow
        }

        // gradient = `linear-gradient( 90deg, ${fillColor} ${percent}%, ${baseColor} ${percent}%)`;
        gradient = `linear-gradient( 90deg, ${fillColor} 0%, ${fillColor} ${percent - 0.1}%, ${baseColor} ${percent + 0.1}%, ${baseColor} 101%)`;


    }

    const unitOverrides = { disarm: 'T', freeze: 's' };
    const unit = unitOverrides[keyName] || '%';

    // Special case: irradiate — no numeric value or unit
    if (keyName === 'irradiate') {
        badge.textContent = name;
        if (bonusColorsEnabled) {
            var badgeOpacity = 0.75
            var percent = 100
            var fillColor = `rgba(191,111,0,${badgeOpacity})`; // orange
            var baseColor = `rgba(191,111,0,0.2)`; // faded orange
            gradient = `linear-gradient( 90deg, ${fillColor} 0%, ${fillColor} ${percent - 0.1}%, ${baseColor} ${percent + 0.1}%, ${baseColor} 101%)`;
        }
    } else {
        badge.textContent = `${numericValue}${unit} ${name}`;
    }
    badge.style.background = gradient;


    badge.style.transform = 'scale(0.75)';
    setTimeout(() => (badge.style.transform = ''), 100);

    return badge;
}


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

        // Remove all existing custom badges or labels
        bonusIcons.find("div.custom-bonus-badge").remove();

        const first = bonusIcons[0];
        if (!first || !first.title) continue;

        let name1 = first.title.split('>')[1]?.split('<')[0];
        if (!name1) continue;

        let value1 = format(first.title, name1);
        name1 = trueName(name1);

        // 🔹 Use badge instead of span
        const badge1 = createBonusBadge(value1, name1);
        badge1.style.lineHeight = '1em'
        badge1.style.padding = '2px 3px'
        first.appendChild(badge1);

        const second = bonusIcons[1];
        if (second && second.title) {
            let name2 = second.title.split('>')[1]?.split('<')[0];
            let value2 = format(second.title, name2);
            name2 = trueName(name2);

            // 🔹 Second badge
            const badge2 = createBonusBadge(value2, name2);
            badge1.style.lineHeight = '1em'
            badge1.style.padding = '2px 3px'
            second.appendChild(badge2);
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
                if (document.URL.includes('display')) displaycase(); // Re-apply correct styles
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

    const container = triggered[0];

    // Remove previous custom badges or labels if any
    container.querySelectorAll('.custom-bonus-label, .custom-bonus-badge').forEach(e => e.remove());

    const appendBonus = (bonusWrapper) => {
        const element = bonusWrapper?.childNodes?.[0];
        if (!element) return;

        const name = element.getAttribute("data-bonus-attachment-title");
        const desc = element.getAttribute("data-bonus-attachment-description");
        if (!name || !desc) return;

        const value = formatNew(desc, name);
        const properName = trueName(name);

        // 🔹 Create and append badge instead of span
        const badge = createBonusBadge(value, properName);
        badge.style.lineHeight = '1em'
        badge.style.fontSize = '0.9em'
        badge.style.padding = '2px 3px'
        bonusWrapper.appendChild(badge);
    };

    // 🔹 First bonus
    appendBonus(container.childNodes[0]);

    // 🔹 Second bonus (if present)
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

        if (display.querySelector('.custom-bonus-badge')) return; // already has badges

        // Helper to create badge data
        const createBonusData = (child) => {
            const title = child?.title;
            if (!title) return null;

            const nameMatch = title.match(/>([^<]+)</);
            if (!nameMatch) return null;

            const rawName = nameMatch[1].trim();
            const value = format(title, rawName);
            return { value, name: trueName(rawName) };
        };

        // Collect bonuses
        const bonuses = [
            createBonusData(root.childNodes?.[1]),
            isWeapon && createBonusData(root.childNodes?.[3])
        ].filter(Boolean);

        // Append badges if found
        if (bonuses.length) {
            bonuses.forEach(b => {
                const badge = createBonusBadge(b.value, b.name);
                display.appendChild(badge);
            });
        }
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

        // Clear old badges
        display.textContent = ""; // Clear old content

        // Helper to create a bonus badge
        const createBonusBadgeElement = (child, pad = false) => {
            const title = child?.title;
            if (!title) return null;

            let name = title.split(">")[1]?.split("<")[0];
            if (!name) return null;

            const value = format(title, name);
            name = trueName(name);

            const badge = createBonusBadge(value, name);
            return badge;
        };

        // Collect bonuses
        const bonuses = [
            createBonusBadgeElement(root.childNodes?.[1]),
            isWeapon && createBonusBadgeElement(root.childNodes?.[3], true)
        ].filter(Boolean);

        // Append to display
        if (bonuses.length) {
            display.textContent = ""; // Clear text only once before adding badges
            bonuses.forEach((badge, i) => {
                if (bonuses.length == 2) badge.style.marginTop = "4px";
                else badge.style.marginTop = "8px";
                badge.style.marginBottom = "-20px";
                badge.style.marginLeft = "8px";
                badge.style.display = "table"
                badge.style.paddingRight = "8px"
                display.appendChild(badge);
                if (i === 0 && bonuses.length > 1) {
                    display.appendChild(document.createElement("br"));
                    display.classList.add("double");
                }
            });
        }
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
            const parent = row.parentElement?.parentElement?.parentElement;
            let container = "";

            if (isMobile()) {
                container = parent.querySelector(".name");
            } else {
                container = parent.querySelector(".name");
            }

            if (!container) return;

            removePreviousSpans(container);

            const parseBonus = (el) => {
                if (!el?.title) return null;
                const match = el.title.match(/>([^<]+)</);
                if (!match) return null;
                const rawName = match[1].trim();
                const val = format(el.title, rawName);
                const bonusName = trueName(rawName);
                return { val, bonusName };
            };

            // Primary bonus
            const bonuses = [parseBonus(element)];

            // Secondary bonus
            const nextBonus = element.parentElement?.childNodes?.[3];
            if (nextBonus && !nextBonus.className?.includes('blank-bonus')) {
                const parsed = parseBonus(nextBonus);
                if (parsed) bonuses.push(parsed);
            }

            // Append badges instead of spans
            bonuses.forEach(b => {
                if (!b?.val || !b?.bonusName) return;
                const badge = createBonusBadge(b.val, b.bonusName);
                badge.style.padding = '2px 6px';
                badge.style.marginLeft = '6px';
                container.appendChild(badge);
            });
        }

    } else if (link.includes('bazaar.php#/add')) {
        if (triggered && triggered[0] && triggered[0].childElementCount >= 1) {
            const element = triggered[0].childNodes[2]?.childNodes[0];
            if (!element || !element.title) return;

            let container = triggered[0].parentElement.parentElement.parentElement
            .childNodes[1].childNodes[1].childNodes[0];

            removePreviousSpans(container);

            // 🔹 First bonus
            let name = element.title.split('>')[1].split('<')[0];
            let value = format(element.title, name);
            name = trueName(name);

            const badge1 = createBonusBadge(value, name);
            badge1.style.padding = '2px 6px';
            badge1.style.marginLeft = '6px';
            container.appendChild(badge1);

            // 🔹 Second bonus (if exists)
            const nextBonus = element.parentElement.childNodes[1];
            if (nextBonus && !nextBonus.className.includes('blank-bonus') && nextBonus.title) {
                let name2 = nextBonus.title.split('>')[1].split('<')[0];
                let value2 = format(nextBonus.title, name2);
                name2 = trueName(name2);

                const badge2 = createBonusBadge(value2, name2);
                badge2.style.padding = '2px 6px';
                badge2.style.marginLeft = '6px';
                container.appendChild(badge2);
            }
        }
    }
}

// INVENTORY BAZAAR ========================================================================================================

// ITEM MARKET ========================================================================================================

function newItemMarket(triggered) {
    if (!triggered?.[0]) return;
    if (!document.URL.includes('ItemMarket')) return;

    const tile = triggered[0];

    // Skip if we already added badges for this tile
    if (tile.getAttribute("data-badge-added") === "true") return;

    const isDarkMode = document.body.classList.contains("dark-mode");
    const modeClass = isDarkMode ? "dark-mode" : "light-mode";

    const bonusContainer = triggered[0].childNodes?.[0]?.childNodes?.[2]?.childNodes?.[0];
    const primary = bonusContainer?.childNodes?.[1]?.childNodes?.[0];
    if (!primary) return;

    const leftColumn = bonusContainer.childNodes?.[0];
    if (!leftColumn) return;

    const appendNode = leftColumn.parentElement.parentElement.parentElement.parentElement
    if (!appendNode) return;

    // Remove old bonus badges
    appendNode.querySelectorAll(".custom-bonus-badge").forEach(el => el.remove());

    const name1 = primary.getAttribute("data-bonus-attachment-title");
    const desc1 = primary.getAttribute("data-bonus-attachment-description");
    const value1 = formatNew(desc1, name1);

    // 🟩 Create and append badge
    const badge1 = createBonusBadge(value1, name1);
    appendNode.appendChild(badge1);
    appendNode.style.height = "132px"
    leftColumn.classList.add("custom-itemmarket-container");

    // Check for second bonus
    const secondBonusExists = bonusContainer?.childNodes?.[1]?.childElementCount === 2;
    if (secondBonusExists) {
        const secondary = bonusContainer.childNodes[1].childNodes[1];
        const name2 = secondary.getAttribute("data-bonus-attachment-title");
        const desc2 = secondary.getAttribute("data-bonus-attachment-description");
        const value2 = formatNew(desc2, name2);

        const badge2 = createBonusBadge(value2, name2);
        appendNode.appendChild(badge2);
    }

    // Mark tile as processed so duplicates don't get added
    tile.setAttribute("data-badge-added", "true");
}


function addItem(triggered) {
    const row = triggered[0]
    if (!row) return;
    // avoid adding the same text multiple times
    if (row.getAttribute("data-label-added") === "true") return;
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
    // after you append the label:
    row.setAttribute("data-label-added", "true");

}


function rerunNewItemMarket() {
    document.querySelectorAll(".itemTile___cbw7w").forEach(el => {
        // existing bonus area detection (keeps your fallback)
        const bonusArea = el.querySelector(".bonuses-wrap") ||
                          el.childNodes?.[0]?.childNodes?.[2]?.childNodes?.[0]?.childNodes?.[0];

        // Remove custom-bonus-labels (from addItem)
        bonusArea?.querySelectorAll(".custom-bonus-label").forEach(span => span.remove());

        // Remove badges appended to appendNode (walk up from left column similar to newItemMarket)
        try {
            const bonusContainer = el.childNodes?.[0]?.childNodes?.[2]?.childNodes?.[0];
            const leftColumn = bonusContainer?.childNodes?.[0];
            const appendNode = leftColumn?.parentElement?.parentElement?.parentElement?.parentElement;
            if (appendNode) {
                appendNode.querySelectorAll(".custom-bonus-badge").forEach(node => node.remove());
            }
        } catch (e) {
            // if structure differs, fall back to scanning the tile for badges
            el.querySelectorAll(".custom-bonus-badge").forEach(node => node.remove());
        }

        // Clear processed flag so newItemMarket can re-add (useful for dark mode or full reruns)
        el.removeAttribute("data-badge-added");

        // Re-run to add fresh badges
        newItemMarket([el]);
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
