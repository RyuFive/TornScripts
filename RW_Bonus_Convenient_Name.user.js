// ==UserScript==
// @name         RW Bonus Convenient Name
// @namespace    https://github.com/RyuFive/TornScripts
// @version      8.1.3
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
		.custom-itemmarket-container { display: flex !important; flex-direction: column; margin-top: 15px; white-space: normal; padding-left: 0; }
		.custom-bazaar-container { float: left; white-space: nowrap; margin-top: 9px; padding-left: 5px; top: 3px; right: 0; display: inline-block !important; position: relative; }
		.bonus-attachment-icons { display: inline-table !important; width: auto !important; float: left !important; white-space: nowrap !important; padding-left: 0 !important; padding-top: 3px !important; position: relative !important; top: -40px !important; right: 0 !important; }
		.custom-bonus-label { font-size: 12px; padding: 1px 4px; border-radius: 3px; margin-left: 2px; margin-bottom: 2px; display: inline-block; text-shadow: 0 1px 1px rgba(0,0,0,0.3); pointer-events: none; user-select: none; white-space: nowrap; max-width: 100%; }
		.custom-bonus-badge { display: inline-block; font-size: 1em; font-weight: 600; color: #fff; border-radius: 8px; padding: 3px 8px; white-space: nowrap; line-height: 1.1em; box-shadow: 0 1px 3px rgba(0,0,0,0.2); border: 1px solid rgba(0,0,0,0.6); vertical-align: middle; transition: background 0.4s ease, transform 0.1s ease; }
		.custom-bonus-badge.dark-mode { text-shadow: 0 0 2px rgba(0,0,0,1), 0 0 3px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.9); color: white !important; }
		.custom-bonus-badge.light-mode { text-shadow: 0 0 2px rgba(255,255,255,1), 0 0 3px rgba(255,255,255,0.9), 0 0 3px rgba(255,255,255,0.9); color: black !important; }
		.custom-bonus-label.dark-mode { background: linear-gradient(145deg, rgba(51,51,51,0.7), rgba(17,17,17,0.7)) !important; color: white !important; }
		.custom-bonus-label.light-mode { background: linear-gradient(145deg, rgba(255,255,255,1), rgba(230,230,230,1)) !important; color: black !important; }
		.item-cont-wrap.glow-yellow-style { background-color: rgba(255,255,0,0.2); border: 1px solid gold !important; border-radius: 6px; }
		.item-cont-wrap.glow-orange-style { background-color: rgba(255,140,0,0.2); border: 1px solid darkorange !important; border-radius: 6px; }
		.item-cont-wrap.glow-red-style { background-color: rgba(255,60,60,0.2); border: 1px solid crimson !important; border-radius: 6px; }
		#armoury-weapons .loaned, #armoury-armour .loaned { width: 75px !important; overflow: visible !important; }
		#armoury-weapons .type, #armoury-armour .type { width: 126px !important; box-sizing: border-box !important; padding: 0 !important; position: relative !important; overflow: hidden !important; }
		#armoury-weapons .double, #armoury-armour .double { height: 40px !important; line-height: normal !important; }
		.custom-armory-bonus-badge { position: absolute !important; left: 0 !important; right: 0 !important; margin: 0 !important; border-radius: 0 !important; box-shadow: none !important; box-sizing: border-box !important; display: block !important; overflow: hidden !important; padding: 0 !important; text-align: left !important; text-indent: 0 !important; }
		.custom-armory-bonus-text { position: absolute !important; left: 5px !important; right: 5px !important; top: 50% !important; transform: translateY(-50%) !important; white-space: nowrap !important; line-height: 1.1em !important; }
		.custom-armory-bonus-badge:first-child:last-child { top: 0 !important; bottom: 0 !important; }
		.double .custom-armory-bonus-badge:first-child { top: 0 !important; bottom: 50% !important; }
		.double .custom-armory-bonus-badge:last-child { top: 50% !important; bottom: 0 !important; }
	`
    const style = document.createElement("style")
    style.textContent = css
    document.head.appendChild(style)
})()
const isMobile = () =>/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 0 && window.innerWidth <= 768)
const weaponBonuses = {
    "general": {
        "achilles": {"orange": {"max": 112, "min": 75}, "red": {"max": 169, "min": 113}, "yellow": {"max": 74, "min": 50}},
        "assassinate": {"orange": {"max": 100, "min": 70}, "red": {"max": 148, "min": 100}, "yellow": {"max": 70, "min": 50}},
        "backstab": {"orange": {"max": 64, "min": 44}, "red": {"max": 96, "min": 66}, "yellow": {"max": 43, "min": 30}},
        "berserk": {"orange": {"max": 58, "min": 36}, "red": {"max": 88, "min": 60}, "yellow": {"max": 35, "min": 20}},
        "bleed": {"orange": {"max": 46, "min": 31}, "red": {"max": 72, "min": 48}, "yellow": {"max": 30, "min": 20}},
        "blindside": {"orange": {"max": 62, "min": 40}, "red": {"max": 97, "min": 63}, "yellow": {"max": 39, "min": 25}},
        "bloodlust": {"orange": {"max": 15, "min": 12}, "red": {"max": 19, "min": 15}, "yellow": {"max": 12, "min": 10}},
        "comeback": {"orange": {"max": 99, "min": 70}, "red": {"max": 138, "min": 102}, "yellow": {"max": 70, "min": 50}},
        "conserve": {"orange": {"max": 37, "min": 30}, "red": {"max": 49, "min": 38}, "yellow": {"max": 30, "min": 25}},
        "cripple": {"orange": {"max": 41, "min": 29}, "red": {"max": 63, "min": 43}, "yellow": {"max": 29, "min": 20}},
        "crusher": {"orange": {"max": 108, "min": 75}, "red": {"max": 171, "min": 114}, "yellow": {"max": 74, "min": 50}},
        "cupid": {"orange": {"max": 110, "min": 75}, "red": {"max": 168, "min": 113}, "yellow": {"max": 74, "min": 50}},
        "deadeye": {"orange": {"max": 74, "min": 45}, "red": {"max": 123, "min": 75}, "yellow": {"max": 45, "min": 25}},
        "deadly": {"orange": {"max": 6, "min": 4}, "red": {"max": 11, "min": 7}, "yellow": {"max": 3, "min": 2}},
        "disarm": {"orange": {"max": 9, "min": 5}, "red": {"max": 15, "min": 9}, "yellow": {"max": 5, "min": 3}},
        "double tap": {"orange": {"max": 36, "min": 24}, "red": {"max": 58, "min": 38}, "yellow": {"max": 24, "min": 15}},
        "double-edged": {"orange": {"max": 24, "min": 16}, "red": {"max": 40, "min": 25}, "yellow": {"max": 16, "min": 10}},
        "empower": {"orange": {"max": 148, "min": 90}, "red": {"max": 245, "min": 152}, "yellow": {"max": 89, "min": 50}},
        "eviscerate": {"orange": {"max": 25, "min": 19}, "red": {"max": 34, "min": 25}, "yellow": {"max": 19, "min": 15}},
        "execute": {"orange": {"max": 22, "min": 18}, "red": {"max": 30, "min": 23}, "yellow": {"max": 18, "min": 15}},
        "expose": {"orange": {"max": 14, "min": 10}, "red": {"max": 21, "min": 14}, "yellow": {"max": 9, "min": 7}},
        "finale": {"orange": {"max": 15, "min": 12}, "red": {"max": 18, "min": 15}, "yellow": {"max": 12, "min": 10}},
        "focus": {"orange": {"max": 24, "min": 19}, "red": {"max": 35, "min": 25}, "yellow": {"max": 19, "min": 15}},
        "frenzy": {"orange": {"max": 10, "min": 7}, "red": {"max": 14, "min": 10}, "yellow": {"max": 7, "min": 5}},
        "fury": {"orange": {"max": 24, "min": 16}, "red": {"max": 40, "min": 25}, "yellow": {"max": 16, "min": 10}},
        "grace": {"orange": {"max": 55, "min": 36}, "red": {"max": 84, "min": 60}, "yellow": {"max": 36, "min": 20}},
        "home run": {"orange": {"max": 74, "min": 60}, "red": {"max": 99, "min": 76}, "yellow": {"max": 59, "min": 50}},
        "irradiate": {"orange": {"max": 49, "min": 20}, "red": {"max": 86, "min": 50}, "yellow": {"max": 19, "min": 0}},
        "motivation": {"orange": {"max": 25, "min": 19}, "red": {"max": 35, "min": 25}, "yellow": {"max": 19, "min": 15}},
        "paralyze": {"orange": {"max": 12, "min": 8}, "red": {"max": 18, "min": 13}, "yellow": {"max": 8, "min": 5}},
        "parry": {"orange": {"max": 74, "min": 60}, "red": {"max": 95, "min": 75}, "yellow": {"max": 60, "min": 50}},
        "penetrate": {"orange": {"max": 37, "min": 30}, "red": {"max": 49, "min": 38}, "yellow": {"max": 30, "min": 25}},
        "plunder": {"orange": {"max": 35, "min": 26}, "red": {"max": 49, "min": 35}, "yellow": {"max": 26, "min": 20}},
        "powerful": {"orange": {"max": 32, "min": 22}, "red": {"max": 50, "min": 33}, "yellow": {"max": 22, "min": 15}},
        "proficience": {"orange": {"max": 39, "min": 28}, "red": {"max": 59, "min": 40}, "yellow": {"max": 28, "min": 20}},
        "puncture": {"orange": {"max": 27, "min": 20}, "red": {"max": 39, "min": 28}, "yellow": {"max": 20, "min": 15}},
        "quicken": {"orange": {"max": 149, "min": 90}, "red": {"max": 245, "min": 150}, "yellow": {"max": 89, "min": 50}},
        "rage": {"orange": {"max": 11, "min": 7}, "red": {"max": 18, "min": 11}, "yellow": {"max": 6, "min": 4}},
        "revitalize": {"orange": {"max": 17, "min": 13}, "red": {"max": 24, "min": 18}, "yellow": {"max": 13, "min": 10}},
        "roshambo": {"orange": {"max": 107, "min": 75}, "red": {"max": 160, "min": 113}, "yellow": {"max": 73, "min": 50}},
        "slow": {"orange": {"max": 42, "min": 29}, "red": {"max": 64, "min": 43}, "yellow": {"max": 29, "min": 20}},
        "smurf": {"orange": {"max": 3, "min": 2}, "red": {"max": 5, "min": 3}, "yellow": {"max": 1, "min": 1}},
        "specialist": {"orange": {"max": 39, "min": 28}, "red": {"max": 59, "min": 40}, "yellow": {"max": 28, "min": 20}},
        "stricken": {"orange": {"max": 63, "min": 44}, "red": {"max": 99, "min": 69}, "yellow": {"max": 43, "min": 30}},
        "stun": {"orange": {"max": 25, "min": 16}, "red": {"max": 40, "min": 25}, "yellow": {"max": 16, "min": 10}},
        "suppress": {"orange": {"max": 42, "min": 32}, "red": {"max": 51, "min": 43}, "yellow": {"max": 32, "min": 25}},
        "sure shot": {"orange": {"max": 8, "min": 5}, "red": {"max": 12, "min": 8}, "yellow": {"max": 4, "min": 3}},
        "throttle": {"orange": {"max": 111, "min": 75}, "red": {"max": 170, "min": 113}, "yellow": {"max": 74, "min": 50}},
        "warlord": {"orange": {"max": 27, "min": 20}, "red": {"max": 45, "min": 28}, "yellow": {"max": 20, "min": 15}},
        "weaken": {"orange": {"max": 42, "min": 29}, "red": {"max": 63, "min": 43}, "yellow": {"max": 29, "min": 20}},
        "wind-up": {"orange": {"max": 174, "min": 145}, "red": {"max": 221, "min": 175}, "yellow": {"max": 145, "min": 125}},
        "wither": {"orange": {"max": 42, "min": 29}, "red": {"max": 64, "min": 43}, "yellow": {"max": 29, "min": 20}}
    },
    "special": {
        "blindfire": {"max": 20, "min": 15},
        "burn": {"max": 50, "min": 30},
        "demoralize": {"max": 23, "min": 20},
        "emasculate": {"max": 16, "min": 15},
        "freeze": {"max": 26, "min": 20},
        "hazardous": {"max": 31, "min": 20},
        "laceration": {"max": 45, "min": 35},
        "poison": {"max": 100, "min": 85},
        "severe burning": {"max": 100, "min": 100},
        "shock": {"max": 100, "min": 75},
        "sleep": {"max": 0, "min": 0},
        "smash": {"max": 100, "min": 100},
        "spray": {"max": 24, "min": 20},
        "storage": {"max": 0, "min": 0},
        "toxin": {"max": 44, "min": 30}
    }
}
const armorBonuses = {
    "100": {"color": "orange", "max": 3, "min": 2, "name": "Imperviable", "slots": ["gloves"]},
    "110": {"color": "yellow", "max": 75, "min": 75, "name": "Kinetokinesis", "slots": ["body_armor"]},
    "111": {"color": "yellow", "max": 75, "min": 75, "name": "Kinetokinesis", "slots": ["pants"]},
    "112": {"color": "yellow", "max": 75, "min": 75, "name": "Kinetokinesis", "slots": ["boots"]},
    "113": {"color": "yellow", "max": 75, "min": 75, "name": "Kinetokinesis", "slots": ["gloves"]},
    "114": {"color": "yellow", "max": 75, "min": 75, "name": "Kinetokinesis", "slots": ["helmet"]},
    "115": {"color": "orange", "max": 43, "min": 30, "name": "Immutable", "slots": ["helmet"]},
    "116": {"color": "orange", "max": 52, "min": 40, "name": "Immutable", "slots": ["body_armor"]},
    "117": {"color": "orange", "max": 33, "min": 25, "name": "Immutable", "slots": ["pants"]},
    "118": {"color": "orange", "max": 19, "min": 15, "name": "Immutable", "slots": ["boots"]},
    "119": {"color": "orange", "max": 19, "min": 15, "name": "Immutable", "slots": ["gloves"]},
    "121": {"color": "orange", "max": 41, "min": 30, "name": "Irrepressible", "slots": ["helmet"]},
    "122": {"color": "orange", "max": 52, "min": 40, "name": "Irrepressible", "slots": ["body_armor"]},
    "123": {"color": "orange", "max": 33, "min": 25, "name": "Irrepressible", "slots": ["pants"]},
    "124": {"color": "orange", "max": 19, "min": 15, "name": "Irrepressible", "slots": ["boots"]},
    "125": {"color": "orange", "max": 19, "min": 15, "name": "Irrepressible", "slots": ["gloves"]},
    "15": {"color": "yellow", "max": 29, "min": 20, "name": "Impregnable", "slots": ["helmet", "body_armor", "pants", "boots", "gloves"]},
    "17": {"color": "yellow", "max": 29, "min": 20, "name": "Impenetrable", "slots": ["helmet", "body_armor", "pants", "boots", "gloves"]},
    "22": {"color": "orange", "max": 7, "min": 5, "name": "Imperviable", "slots": ["helmet"]},
    "26": {"color": "red", "max": 29, "min": 20, "name": "Impassable", "slots": ["helmet", "body_armor", "pants", "boots", "gloves"]},
    "90": {"color": "yellow", "max": 82, "min": 1, "name": "Radiation Protection", "slots": ["helmet"]},
    "91": {"color": "orange", "max": 15, "min": 12, "name": "Invulnerable", "slots": ["helmet"]},
    "92": {"color": "yellow", "max": 40, "min": 30, "name": "Insurmountable", "slots": ["helmet", "body_armor", "pants", "boots", "gloves"]},
    "93": {"color": "orange", "max": 11, "min": 8, "name": "Invulnerable", "slots": ["body_armor"]},
    "94": {"color": "orange", "max": 10, "min": 7, "name": "Invulnerable", "slots": ["pants"]},
    "95": {"color": "orange", "max": 7, "min": 4, "name": "Invulnerable", "slots": ["boots"]},
    "96": {"color": "orange", "max": 7, "min": 4, "name": "Invulnerable", "slots": ["gloves"]},
    "97": {"color": "orange", "max": 11, "min": 7, "name": "Imperviable", "slots": ["body_armor"]},
    "98": {"color": "orange", "max": 6, "min": 4, "name": "Imperviable", "slots": ["pants"]},
    "99": {"color": "orange", "max": 3, "min": 2, "name": "Imperviable", "slots": ["boots"]}
}
const BONUS_COLORS = {
    red: {fill: "rgba(180,0,40,0.75)", base: "rgba(128,0,32,0.2)"},
    orange: {fill: "rgba(191,111,0,0.75)", base: "rgba(191,111,0,0.2)"},
    yellow: {fill: "rgba(191,191,0,0.75)", base: "rgba(191,191,0,0.2)"}
}
const STATIC_BONUSES = new Set(["irradiate", "smash", "radiation protection", "dimensiokinesis", "oneirokinesis",])
const UNIT_OVERRIDES = { disarm: "T", freeze: "s" }
const ABBREVIATIONS = {"radiation protection": "Radiation",}

function createBonusGradient(value, min, max, color) {
    const selected = BONUS_COLORS[color]
    if (!selected) return "linear-gradient(90deg, #333, #3a3a3a)"
    const percent = max > min ? Math.min(Math.max(((value - min) / (max - min)) * 100,0),100) : 100

    return `linear-gradient(90deg, ${selected.fill} 0%, ${selected.fill} ${percent - 0.1}%, ${selected.base} ${percent + 0.1}%, ${selected.base} 101%)`
}

function getItemSlot(itemName) {
    const itemLower = String(itemName || "").toLowerCase()
    if (itemLower.includes("gloves")) return "gloves"
    if (itemLower.includes("boots") || itemLower.includes("hooves")) return "boots"
    if (itemLower.includes("helmet") || itemLower.includes("mask") || itemLower.includes("respirator")) return "helmet"
    if (itemLower.includes("pants")) return "pants"
    if (itemLower.includes("body") || itemLower.includes("apron") || itemLower.includes("vest") || itemLower.includes("mail") || itemLower.includes("suit") || itemLower.includes("jacket")) return "body_armor"
    return null
}

function getWeaponBonus(bonusName, numericValue) {
    const general = weaponBonuses?.general?.[bonusName]

    if (general) {
        const tiers = ["yellow", "orange", "red"].filter(tier => general[tier]).sort((a, b) => general[a].min - general[b].min)
        let color = null
        let range = null
        for (const tier of tiers) {
            if (numericValue >= general[tier].min) {
                color = tier
                range = general[tier]
            }
        }
        return { color, range }
    }

    const special = weaponBonuses?.special?.[bonusName]
    if (special) {
        if (numericValue >= special.min && numericValue <= special.max) return { color: "orange", range: special }
    }
    return null
}

function createBonusBadge(value, bonus_name, item_name) {
    const isDarkMode = document.body.classList.contains("dark-mode")
    const modeClass = isDarkMode ? "dark-mode" : "light-mode"

    const badge = document.createElement("div")
    badge.className = `custom-bonus-badge ${modeClass}`

    const numericValue = parseInt(String(value).replace(/[^0-9.-]/g, ""), 10) || 0
    const bonusName = String(bonus_name || "").trim().toLowerCase()
    let gradient = "linear-gradient(90deg, #333, #3a3a3a)"

    const itemSlot = getItemSlot(item_name)

    const armorBonus = Object.values(armorBonuses).find(b => b?.name?.trim().toLowerCase() === bonusName && b?.slots?.includes(itemSlot))
    const weaponBonus = getWeaponBonus(bonusName, numericValue)
    if (!armorBonus && !weaponBonus) { console.log("No matching armor or weapon bonus:", {bonus_name, item_name, bonusName, itemSlot, armorBonus, weaponBonus})}

    if (armorBonus) gradient = createBonusGradient(numericValue, armorBonus.min, armorBonus.max, armorBonus.color)
    else if (weaponBonus) {
        const { color, range } = weaponBonus
        if (color && range) gradient = createBonusGradient(numericValue, range.min, range.max, color)
    }

    const unit = UNIT_OVERRIDES[bonusName] || "%"
    const isStatic = STATIC_BONUSES.has(bonusName)

    if (isStatic) {
        badge.textContent = bonus_name
        gradient = "rgba(191,111,0,0.75)"
    } else badge.textContent = `${numericValue}${unit} ${bonus_name}`
    badge.style.background = gradient
    badge.style.transform = "scale(0.75)"
    setTimeout(() => (badge.style.transform = ""), 100)
    return badge
}

// AUCTION HOUSE / AMARKET ========================================================================================================

function amarket() {
    document.querySelectorAll(".t-gray-6").forEach((el) => (el.innerHTML = ""))

    const iconSpans = document.querySelectorAll("span.bonus-attachment-icons")
    const uniqueRows = new Set(Array.from(iconSpans).map((icon) => icon.closest("div.item-cont-wrap")).filter(Boolean),)

    for (const row of uniqueRows) {
        const container = row.querySelector("p.t-gray-6")
        const icons = row.querySelectorAll("span.bonus-attachment-icons")

        if (!container || icons.length === 0) continue

        container.style.display = "flex"
        container.style.flexDirection = "row"
        container.style.flexWrap = "wrap"
        container.style.alignItems = "center"
        container.style.justifyContent = "flex-start"
        container.style.gap = "4px"
        container.style.marginTop = "2px"

        const nameNode = row.querySelector("[class*=name]")
        const item_name = nameNode ? nameNode.textContent.trim() : ""

        const processIcon = (icon) => {
            if (!icon || !icon.title) return

            const name = icon.title.split(">")[1]?.split("<")[0]
            if (!name) return

            const value = format(icon.title, name)
            const badge = createBonusBadge(value, trueName(name), item_name)

            badge.style.margin = "0"
            container.appendChild(badge)
        }

        if (icons[0]) processIcon(icons[0])
        if (icons[1]) processIcon(icons[1])

        const glow = row.querySelector(".item-plate")

        if (glow?.classList.contains("glow-yellow")) row.classList.add("glow-yellow-style")
        else if (glow?.classList.contains("glow-orange")) row.classList.add("glow-orange-style")
        else if (glow?.classList.contains("glow-red")) row.classList.add("glow-red-style")
    }
}

// DISPLAY ========================================================================================================

function displaycase() {
    const iconSpans = document.querySelectorAll("span.bonus-attachment-icons")
    const uniqueItems = new Set(Array.from(iconSpans).map((icon) => icon.closest("div.iconsbonuses")).filter(Boolean),)

    for (const item of uniqueItems) {
        const bonusIcons = item.querySelectorAll("span.bonus-attachment-icons")
        if (bonusIcons.length === 0) continue

        item.querySelectorAll("div.custom-bonus-badge").forEach((el) => el.remove())

        const nameNode = bonusIcons[0].closest(".torn-divider")?.querySelector("[class*=name]")
        const item_name = nameNode ? nameNode.childNodes[3]?.textContent : ""

        const first = bonusIcons[0]
        if (first && first.title) {
            let name1 = first.title.split(">")[1]?.split("<")[0]
            if (name1) {
                let value1 = format(first.title, name1)
                const badge1 = createBonusBadge(value1, trueName(name1), item_name)
                badge1.style.marginLeft = "4px"
                first.appendChild(badge1)
            }
        }

        const second = bonusIcons[1]
        if (second && second.title) {
            let name2 = second.title.split(">")[1]?.split("<")[0]
            if (name2) {
                let value2 = format(second.title, name2)
                const badge2 = createBonusBadge(value2, trueName(name2), item_name)
                badge2.style.marginLeft = "4px"
                second.appendChild(badge2)
            }
        }
    }
}

// BAZAAR ========================================================================================================

function bazaar(triggered) {
    if (!triggered || !triggered[0] || triggered[0].childElementCount < 1) return

    const container = triggered[0]

    container.querySelectorAll(".custom-bonus-label, .custom-bonus-badge").forEach((e) => e.remove())

    const appendBonus = (bonusWrapper) => {
        const element = bonusWrapper?.childNodes?.[0]
        if (!element) return

        const name = element.getAttribute("data-bonus-attachment-title")
        const desc = element.getAttribute("data-bonus-attachment-description")
        const item_name = element.parentElement.parentElement.parentElement.parentElement.querySelector('[class*=name]').textContent
        if (!name || !desc) return

        const value = formatNew(desc, name)
        const properName = trueName(name)

        const badge = createBonusBadge(value, properName, item_name)
        badge.style.lineHeight = "1em"
        badge.style.fontSize = "0.9em"
        badge.style.padding = "2px 3px"
        bonusWrapper.appendChild(badge)
    }
    appendBonus(container.childNodes[0])
    if (container.childElementCount === 2) appendBonus(container.childNodes[1])
    container.classList.add("custom-bazaar-container")
}

const observer = new MutationObserver(() => document.querySelectorAll(".iconBonuses____iFjZ").forEach((el) => {bazaar([el])}))
observer.observe(document.body, {attributes: true, attributeFilter: ["class"], subtree: false,})

function manage(triggered) {
    if (triggered && triggered[0]) {
        var className = triggered[0].className
        if (className.includes("blank-bonus")) return
        var name = className.split("-")[2]
        name = trueName(name.charAt(0).toUpperCase() + name.slice(1))

        triggered[0].parentElement.parentElement.parentElement.childNodes[2].childNodes[0].innerHTML =
            triggered[0].parentElement.parentElement.parentElement.childNodes[2].childNodes[0].innerHTML.split(" x",)[0] + " (" + name + ")"
    }
}

// ARMORY ========================================================================================================

function armory(triggered) {

    const renameTypeHeader = (armouryRoot) => armouryRoot?.querySelectorAll(".type").forEach((el) => {
        if (el.textContent.trim() === "Type") el.textContent = "Bonus"
    })

    if (isMobile()) {
        // MOBILE LOGIC
        const root = triggered?.[0]
        if (!root) return

        const armouryRoot = root?.parentElement?.parentElement?.parentElement?.parentElement
        if (!armouryRoot) return

        const isWeapon = armouryRoot.id === "armoury-weapons"

        const display = root.parentElement?.parentElement?.childNodes?.[3]
        if (!display) return
        if (display.textContent.endsWith(")")) return

        if (display.querySelector('.custom-bonus-badge')) return
        display.style.display = 'flex'
        display.style.flexDirection = 'column'
        display.style.alignItems = 'flex-start'

        const createBonusData = (child) => {
            const title = child?.title
            if (!title) return null

            const nameMatch = title.match(/>([^<]+)</)
            if (!nameMatch) return null

            const rawName = nameMatch[1].trim()
            const value = format(title, rawName)

            return { value, name: trueName(rawName) }
        }

        const bonuses = Array.from(root.children).filter(child => child.title).map(createBonusData).filter(Boolean)
        const item_name = root.parentElement.parentElement.querySelector('[class*=name]').textContent

        if (bonuses.length) {
            const bonusContainer = document.createElement('div')
            bonusContainer.style.display = 'flex'
            bonusContainer.style.justifyContent = 'center'
            bonusContainer.style.alignItems = 'center'
            bonusContainer.style.flexWrap = 'wrap'
            bonusContainer.style.width = '100%'

            bonuses.forEach(b => {
                const badge = createBonusBadge(b.value, b.name, item_name)
                bonusContainer.appendChild(badge)
            })

            display.parentElement.appendChild(bonusContainer)
        }
    } else {
        // PC LOGIC
        const root = triggered?.[0]
        if (!root) return

        const armouryRoot = root?.parentElement?.parentElement?.parentElement?.parentElement
        if (!armouryRoot) return
        renameTypeHeader(armouryRoot)

        const isWeapon = armouryRoot.id === "armoury-weapons"

        const display = root.parentElement?.parentElement?.childNodes?.[9]
        if (!display) return
        display.textContent = ""

        const titledChild = root.querySelector(':scope > [title]')

        if (!titledChild) return
        const item_name = root.parentElement.parentElement.querySelector('[class*=name]').textContent

        const createBonusBadgeElement = (child, pad = false) => {
            const title = child?.title
            if (!title) return null

            let name = title.split(">")[1]?.split("<")[0]
            if (!name) return null

            const value = format(title, name)
            name = trueName(name)

            return createBonusBadge( value, name, item_name )
        }

        const bonuses = Array.from(root.children).filter(child => child.title).map((child, index) => createBonusBadgeElement(child, index > 0)).filter(Boolean)

        if (bonuses.length) {
            display.textContent = ""
            display.style.position = "relative"
            display.style.padding = "0"
            display.style.overflow = "hidden"
            display.classList.toggle("double", bonuses.length > 1)
            display.style.height = bonuses.length > 1 ? "32px" : ""
            bonuses.forEach((badge) => {
                const text = document.createElement("span")
                text.className = "custom-armory-bonus-text"
                text.textContent = badge.textContent
                badge.textContent = ""
                badge.appendChild(text)
                badge.classList.add("custom-armory-bonus-badge")
                badge.style.fontSize = bonuses.length > 1 ? "8px" : "10px"
                badge.style.lineHeight = "1.1em"
                badge.style.transform = ""
                display.appendChild(badge)
                const fitArmoryBadgeText = () => {
                    badge.style.transform = ""
                    while ((text.scrollWidth > text.clientWidth || text.getBoundingClientRect().height > badge.clientHeight) && parseFloat(badge.style.fontSize) > 7) {
                        badge.style.fontSize = `${parseFloat(badge.style.fontSize) - 0.5}px`
                    }
                }
                fitArmoryBadgeText()
                setTimeout(fitArmoryBadgeText, 120)
            })
        }
    }
}

// INVENTORY BAZAAR-ADD ========================================================================================================

function inventoryandbazaar(triggered) {
    const link = document.URL

    const removePreviousSpans = (container) => {
        if (container) container.querySelectorAll(".custom-bonus-label").forEach((span) => span.remove())
    }

    if (link.includes("item")) {
        if (triggered?.[0]?.childElementCount >= 3) {
            const row = triggered[0]
            const bonusParentIndex = row.childNodes[5]?.className?.includes("testtest") ? 7 : 5
            const element = row.childNodes[bonusParentIndex]?.childNodes?.[1]

            if (!element?.title) return

            const parent = row.parentElement?.parentElement?.parentElement
            let container = ""

            if (isMobile()) container = parent.querySelector(".name")
            else container = parent.querySelector(".name")
            if (!container) return

            removePreviousSpans(container)

            const parseBonus = (el) => {
                if (!el?.title) return null
                const match = el.title.match(/>([^<]+)</)
                if (!match) return null
                const rawName = match[1].trim()
                const val = format(el.title, rawName)
                const bonusName = trueName(rawName)
                return { val, bonusName }
            }

            const item_name = row.parentElement.parentElement.parentElement.querySelector('[class*=name]').childNodes[5].textContent
            const bonuses = [parseBonus(element)]

            const nextBonus = element.parentElement?.childNodes?.[3]
            if (nextBonus && !nextBonus.className?.includes("blank-bonus")) {
                const parsed = parseBonus(nextBonus)
                if (parsed) bonuses.push(parsed)
            }

            bonuses.forEach((b) => {
                if (!b?.val || !b?.bonusName) return
                const badge = createBonusBadge(b.val, b.bonusName, item_name)
                badge.style.padding = "2px 6px"
                badge.style.marginLeft = "6px"
                container.appendChild(badge)
            })
        }
    } else if (link.includes("bazaar.php#/add")) {
        if (triggered && triggered[0] && triggered[0].childElementCount >= 1) {
            const element = triggered[0].childNodes[2]?.childNodes[0]
            if (!element || !element.title) return

            let container = triggered[0].parentElement.parentElement.parentElement.childNodes[1].childNodes[1].childNodes[0]

            removePreviousSpans(container)

            let name = element.title.split(">")[1].split("<")[0]
            let value = format(element.title, name)
            name = trueName(name)
            const item_name = triggered[0].parentElement.parentElement.parentElement.querySelector('.name-wrap .t-overflow').childNodes[0].textContent.trim()

            const badge1 = createBonusBadge(value, name, item_name)
            badge1.style.padding = "2px 6px"
            badge1.style.marginLeft = "6px"
            container.appendChild(badge1)

            const nextBonus = element.parentElement.childNodes[1]
            if ( nextBonus && !nextBonus.className.includes("blank-bonus") && nextBonus.title ) {
                let name2 = nextBonus.title.split(">")[1].split("<")[0]
                let value2 = format(nextBonus.title, name2)
                name2 = trueName(name2)

                const badge2 = createBonusBadge(value2, name2, item_name)
                badge2.style.padding = "2px 6px"
                badge2.style.marginLeft = "6px"
                container.appendChild(badge2)
            }
        }
    }
}

// ITEM MARKET ========================================================================================================

function newItemMarket(triggered) {

    if (!triggered?.[0]) return
    if (!document.URL.includes("ItemMarket")) return

    const tile = triggered[0]

    if (tile.getAttribute("data-badge-added") === "true") return

    const isDarkMode = document.body.classList.contains("dark-mode")
    const modeClass = isDarkMode ? "dark-mode" : "light-mode"

    const bonusContainer = triggered[0].childNodes?.[0]?.childNodes?.[2]?.childNodes?.[0]
    const item_name = triggered[0]?.querySelector('[class*="name___"]')?.textContent
    const primary = bonusContainer?.childNodes?.[1]?.childNodes?.[0]
    if (!primary) return

    const leftColumn = bonusContainer.childNodes?.[0]
    if (!leftColumn) return

    const appendNode = leftColumn.parentElement.parentElement.parentElement.parentElement
    if (!appendNode) return

    appendNode.querySelectorAll(".custom-bonus-badge").forEach((el) => el.remove())

    const name1 = primary.getAttribute("data-bonus-attachment-title")
    const desc1 = primary.getAttribute("data-bonus-attachment-description")
    const value1 = formatNew(desc1, name1)

    const badge1 = createBonusBadge(value1, name1, item_name)
    appendNode.appendChild(badge1)
    appendNode.style.height = "145px"
    badge1.style.width = "80px"
    badge1.style.boxSizing = "border-box"
    badge1.style.whiteSpace = "nowrap"

    let fontSize = parseFloat(getComputedStyle(badge1).fontSize)

    // First increase width up to 110px
    while (badge1.scrollWidth > badge1.clientWidth && badge1.clientWidth < 100) badge1.style.width = `${badge1.clientWidth + 10}px`

    // Only resize text if 110px still isn't enough
    while (badge1.scrollWidth > badge1.clientWidth && fontSize > 6) {
        fontSize -= 0.5
        badge1.style.fontSize = `${fontSize}px`
    }
    badge1.style.width = `${badge1.clientWidth + 10}px`
    leftColumn.classList.add("custom-itemmarket-container")

    // Check for second bonus
    const secondBonusExists = bonusContainer?.childNodes?.[1]?.childElementCount === 2
    if (secondBonusExists) {
        const secondary = bonusContainer.childNodes[1].childNodes[1]
        const name2 = secondary.getAttribute("data-bonus-attachment-title")
        const desc2 = secondary.getAttribute("data-bonus-attachment-description")
        const value2 = formatNew(desc2, name2)

        const badge2 = createBonusBadge(value2, name2, item_name)
        appendNode.appendChild(badge2)
        appendNode.style.height = "145px"
        badge2.style.width = "80px"
        badge2.style.boxSizing = "border-box"
        badge2.style.whiteSpace = "nowrap"

        let fontSize = parseFloat(getComputedStyle(badge2).fontSize)

        // First increase width up to 110px
        while (badge2.scrollWidth > badge2.clientWidth && badge2.clientWidth < 100) badge2.style.width = `${badge2.clientWidth + 10}px`

        // Only resize text if 110px still isn't enough
        while (badge2.scrollWidth > badge2.clientWidth && fontSize > 6) {
            fontSize -= 0.5
            badge2.style.fontSize = `${fontSize}px`
        }
        badge2.style.width = `${badge2.clientWidth + 10}px`
    }

    tile.setAttribute("data-badge-added", "true")
}

function addItem(triggered) {
    const row = triggered?.[0]
    if (!row) return

    if (row.getAttribute("data-label-added") === "true") return

    const bonusElement = row?.childNodes?.[3]?.childNodes?.[0]
    if (!bonusElement) return

    // Skip items with no bonus
    if (bonusElement.classList.contains("bonus-attachment-blank-bonus-25")) return

    const parentElement = row?.parentElement?.parentElement?.parentElement?.childNodes?.[0]?.childNodes?.[1]?.childNodes?.[0]
    if (!parentElement) return

    const parseBonus = (el) => {
        if (!el || el.classList.contains("bonus-attachment-blank-bonus-25")) return null

        const cls = [...el.classList].find((c) => c.startsWith("bonus-attachment-"))
        if (!cls) return null

        const name = cls.replace("bonus-attachment-", "").trim()
        return [ format(cls, name), trueName(name.charAt(0).toUpperCase() + name.slice(1)), ].filter(Boolean).join(" ")
    }

    const bonuses = []
    const primaryBonus = parseBonus(bonusElement)
    if (primaryBonus) bonuses.push(primaryBonus)
    const nextBonus = bonusElement?.parentElement?.childNodes?.[1]

    if ( nextBonus && !nextBonus.className?.includes("blank-bonus") ) {
        const secondaryBonus = parseBonus(nextBonus)
        if (secondaryBonus) bonuses.push(secondaryBonus)
    }
    if (!bonuses.length) return

    parentElement.appendChild(document.createElement("br"))
    parentElement.classList.add("custom-bonus-label")
    parentElement.appendChild(document.createTextNode(` (${bonuses.join(", ")})`))

    row.setAttribute("data-label-added", "true")
}

let darkModeTimer

const darkModeObserver = new MutationObserver(() => {
    clearTimeout(darkModeTimer)

    darkModeTimer = setTimeout(() => {
        const isDarkMode = document.body.classList.contains("dark-mode")

        document.querySelectorAll(".custom-bonus-badge, .custom-bonus-label").forEach((el) => {
            el.classList.toggle("dark-mode", isDarkMode)
            el.classList.toggle("light-mode", !isDarkMode)
        })
    }, 50)
})

darkModeObserver.observe(document.body, { attributes: true, attributeFilter: ["class"],})

// FORMATTING & HELPERS ================================================================================================

const executeFormatting = (str, name) => {
    if (STATIC_BONUSES.has(name.toLowerCase())) return ""
    const specialHandlers = {
        Disarm: () => str.split(" turns")[0]?.split("for ")[1] + " T ",
        Bloodlust: () => str.split(" of")[0]?.split("by ")[1] + " ",
        Execute: () => str.split(" life")[0]?.split("below ")[1] + " ",
        Penetrate: () => str.split(" of")[0]?.split("Ignores ")[1] + " ",
        Eviscerate: () => str.split(" extra")[0]?.split("them ")[1] + " ",
        Poison: () =>
        (str.includes("</b><br/>")
         ? str.split(" chance to Poison")[0]?.split("</b><br/>")[1]
         : str.split(" chance to Poison")[0]) + " ",
    }
    if (specialHandlers[name]) {
        try {
            return specialHandlers[name]() || ""
        } catch (e) {
            return ""
        }
    }
    try {
        if (str.includes(">")) return (str.split(">")[3]?.split("%")[0] || "") + "% "
        return str.split("%")[0] + "% "
    } catch (e) {
        return ""
    }
}

function format(title, name) {
    return executeFormatting(title, name)
}
function formatNew(desc, name) {
    return executeFormatting(desc, name)
}

function trueName(text) {
    const map = { Full: "EOD", Negative: "Delta", Poisoned: "Poison" }
    return map[text] || text
}

// OBSERVER ========================================================================================================
const observerMap = {
    ".item-cont-wrap": amarket,
    ".display-main-page": displaycase,
    "[class*='iconBonuses___']": bazaar,
    "[class*='extraBonusIcon___']": manage,
    ".bonuses-wrap": inventoryandbazaar,
    ".bonus": armory,
    "[class*='itemTile___']": newItemMarket,
}

const seenElements = new WeakSet()

const process = () => {
    for (const [selector, callback] of Object.entries(observerMap)) {
        document.querySelectorAll(selector).forEach((el) => {
            if (!seenElements.has(el)) {
                seenElements.add(el)
                callback([el])
            }
        })
    }
}

// Debounced Observer to drastically reduce CPU overhead during heavy DOM modifications
let isProcessing = false
const mainObserver = new MutationObserver(() => {
    if (!isProcessing) {
        isProcessing = true
        requestAnimationFrame(() => {
            process()
            isProcessing = false
        })
    }
})
mainObserver.observe(document.body, { childList: true, subtree: true })
process()
