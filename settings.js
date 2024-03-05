
let unitsArrayList = undefined;
let arrayOfFetchedUnits = [];
//This script handles the user interaction with the toggle switches and radio buttons on the popup of the extension.

//Event listener to initialize the switches as well as update their states
document.addEventListener("DOMContentLoaded", function () {
    initializeSwitch("questSwitch");
    initializeSwitch("scrollSwitch");
    initializeSwitch("extraSwitch");
    initializeSwitch("commonSwitch");
    initializeSwitch("uncommonSwitch");
    initializeSwitch("rareSwitch");
    initializeSwitch("legendarySwitch");
    initializeSwitch("dungeonSwitch");
    initializeSwitch("dungeonLevelSwitch");
    initializeSwitch("dungeonPlaceAnywaySwitch");
    initializeSwitch("duelSwitch");
    initializeSwitch("clashSwitch");
    initializeSwitch("campaignSwitch");
    initializeSwitch("battlepassSwitch");
    initializeSwitch("logSwitch");
    initializeSwitch("offlineSwitch");
    initializeSwitch("setMarkerSwitch");
    initializeSwitch("skipSwitch");
    initializeSwitch("completeQuests");
    initializeSwitch("dailySwitch");
    initializeSwitch("eventChestSwitch");
    initializeSwitch("equipSwitch");
    initializeSwitch("equipNoDiamondSwitch");
    initializeSwitch("favoriteSwitch");
    initializeSwitch("liveMasterSwitch");
    initializeSwitch("priorityMasterSwitch");
    initializeSwitch("idleMasterSwitch");
    initializeSwitch("skipIdleMasterSwitch");
    initializeSwitch("priorityListSwitch");
    initializeSwitch("lgoldSwitch");
    initializeSwitch("lskinSwitch");
    initializeSwitch("lscrollSwitch");
    initializeSwitch("ltokenSwitch");
    initializeSwitch("lbossSwitch");
    initializeSwitch("lsuperbossSwitch");
    initializeSwitch("beforeSwitch");
    initializeSwitch("afterSwitch");
    initializeSwitch("dungeonSlotSwitch");
    initializeSwitch("skipDungeonSlotSwitch");
    initializeSwitch("duelsSlotSwitch");
    initializeSwitch("skipDuelsSlotSwitch");
    initializeSwitch("clashSlotSwitch");
    initializeSwitch("skipClashSlotSwitch");
    initializeSwitch("levelSwitch");
    initializeSwitch("chestSwitch");
    initializeReloader("reloaderInput");
    initializeReloader("minimumCurrencyInput");
    initializeReloader("maxUnitLvlDungInput");
    initializeReloader("maxDungeonLvlInput");
    initializeReloader("userIdleTimeInput");
    initializeReloader("placementOddsInput")
    initializeReloader("veInput");
    initializeReloader("eInput");
    initializeReloader("mInput");
    initializeReloader("hInput");
    initializeReloader("vhInput");
    initializeReloader("iInput");
    initializeReloader("bInput");
    initializeReloader("ebInput");
    initializeReloader("bronzeInput");
    initializeReloader("silverInput");
    initializeReloader("goldInput");
    initializeReloader("lGoldInput");
    initializeReloader("lSkinInput");
    initializeReloader("lTokenInput");
    initializeReloader("lScrollInput");
    initializeReloader("BossInput");
    initializeReloader("sBossInput")
});

//When the user interacts with the toggle switches, it gets the current stored value and update them with the value.
function initializeSwitch(switchId) {
    const switchElement = document.getElementById(switchId);

    // Load switch state from storage
    chrome.storage.local.get([switchId], function (result) {
        switchElement.checked = result[switchId] || false;
    });

    //Listen to changes on the switch states and set the new value.
    switchElement.addEventListener("change", function () {
        const switchState = this.checked;
        chrome.storage.local.set({ [switchId]: switchState }, function () {
            if (chrome.runtime.lastError) {
                loadBanner(failureMessage, redColor)
            } else {
                loadBanner(successMessage, greenColor)
            }
        });
    });
}

//Event listener to initialize the radio buttons as well as update their states
document.addEventListener("DOMContentLoaded", async function () {
    //Function to save the new radio button state on the storage
    function handlePotionRadioButtonChange() {
        let selectedOption = document.querySelector('input[name="potion"]:checked').value;
        chrome.storage.local.set({ selectedOption: selectedOption }, function () {
            if (chrome.runtime.lastError) {
                loadBanner(failureMessage, redColor);
            } else {
                loadBanner(successMessage, greenColor);
            }
        });
    }

    setInputButtonListener('reloaderButton', 'reloaderInput');
    setInputButtonListener('minimumCurrencyButton', 'minimumCurrencyInput');
    setInputButtonListener('minUnitLvlButton', 'maxUnitLvlDungInput');
    setInputButtonListener('minDungeonLvlButton', 'maxDungeonLvlInput');
    setInputButtonListener('idleTimeButton', 'userIdleTimeInput');
    setInputButtonListener('placeOddButton', 'placementOddsInput');
    setInputButtonListener('veButton', 'veInput');
    setInputButtonListener('eButton', 'eInput');
    setInputButtonListener('mButton', 'mInput');
    setInputButtonListener('hButton', 'hInput');
    setInputButtonListener('vhButton', 'vhInput');
    setInputButtonListener('iButton', 'iInput');
    setInputButtonListener('bButton', 'bInput');
    setInputButtonListener('ebButton', 'ebInput');
    setInputButtonListener('bronzeButton', 'bronzeInput');
    setInputButtonListener('silverButton', 'silverInput');
    setInputButtonListener('goldButton', 'goldInput');
    setInputButtonListener('lGoldButton', 'lGoldInput');
    setInputButtonListener('lSkinButton', 'lSkinInput');
    setInputButtonListener('lTokenButton', 'lTokenInput');
    setInputButtonListener('lScrollButton', 'lScrollInput');
    setInputButtonListener('BossButton', 'BossInput');
    setInputButtonListener('sBossButton', 'sBossInput');

    //Event listener for when the potion radio button is changed by the user
    let potionRadioButtons = document.querySelectorAll('input[name="potion"]');
    potionRadioButtons.forEach(function (radioButton) {
        radioButton.addEventListener("change", handlePotionRadioButtonChange);
    });

    //Get potion radio button state from storage and set the button with the value for the user to visually see
    chrome.storage.local.get(["selectedOption"], function (result) {
        let savedOption = result.selectedOption;
        if (savedOption) {
            let radioToCheck = document.querySelector('input[name="potion"][value="' + savedOption + '"]');
            if (radioToCheck) {
                radioToCheck.checked = true;
            }
        }
    });

    //Function to save the new radio button state on the storage
    function handleLoyaltyRadioButtonChange() {
        let loyaltyOption = document.querySelector('input[name="loyalty"]:checked').value;
        chrome.storage.local.set({ loyalty: loyaltyOption }, function () {
            if (chrome.runtime.lastError) {
                loadBanner(failureMessage, redColor);
            } else {
                loadBanner(successMessage, greenColor);
            }
        });
    }

    // Event listener for when the loyalty radio button is changed by the user
    let loyaltyRadioButtons = document.querySelectorAll('input[name="loyalty"]');
    loyaltyRadioButtons.forEach(function (radioButton) {
        radioButton.addEventListener("change", handleLoyaltyRadioButtonChange);
    });

    //Get loyalty radio button state from storage and set the button with the value for the user to visually see
    chrome.storage.local.get(["loyalty"], function (result) {
        let savedOption = result.loyalty;
        if (savedOption) {
            let radioToCheck = document.querySelector('input[name="loyalty"][value="' + savedOption + '"]');
            if (radioToCheck) {
                radioToCheck.checked = true;
            }
        }
    });

});

function setInputButtonListener(buttonId, inputId) {
    document.getElementById(buttonId).addEventListener('click', function () {
        const inputValue = document.getElementById(inputId).value;
        if (inputValue != undefined || inputValue != null) {
            const storageObject = {};
            storageObject[inputId] = inputValue;

            chrome.storage.local.set(storageObject, function () {
                if (chrome.runtime.lastError) {
                    loadBanner(failureMessage, redColor);
                } else {
                    loadBanner(successMessage, greenColor);
                }
            });
        }
    });
}


const successMessage = "Settings updated sucessfully";
const failureMessage = "Failed to update settings";
const redColor = "red";
const greenColor = "#5fa695";


function loadBanner(message, color) {
    //If the user rapid clicks, it removes the button if it exists so a new one can be injected
    let customBanner = document.querySelector(".custom_banner");
    if (customBanner) {
        customBanner.remove();
    }

    //Banner styles so a retangle can be displayed on the center of the screen
    const bannerStyles = `
        background-color: ${color};
        zIndex: 9999;
        color: white;
        position: fixed;
        font-size: xxx-large;
        text-align: center;
        padding: 10px;
        width: 100%;
    `;

    //Creates the element
    const banner = document.createElement("div");
    banner.className = "custom_banner";
    banner.textContent = message;
    banner.style.cssText = bannerStyles;

    //Injects the element
    const mainDiv = document.querySelector(".main");
    mainDiv.appendChild(banner);

    //Removes the element after 500 milliseconds.
    setTimeout(function () {
        banner.remove();
    }, 400);
}

async function initializeReloader(key) {
    const result = await new Promise((resolve) => {
        chrome.storage.local.get([key], function (result) {
            resolve(result);
        });
    });

    const reloaderInput = result[key];
    if (reloaderInput !== undefined) {
        document.getElementById(key).value = reloaderInput;
    }
}