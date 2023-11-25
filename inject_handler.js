/* This file injects buttons into the page so they can be used for user interaction.
This file also handles the state of these injected buttons. */

//Initializing variables
let dataArray = [];
let existingElement;
let newButton;
//Initializing css styles
const wipeStyles = `
background-color: #5fa695;
height: auto;
width: auto;
margin-right: 15px;
color: white;
padding: 15px;
font-weight: bold;
font-size: 25px;
`;
let elapsedTimeStyles = `
font-size: 30px;
font-weight: bold;
`;


//When invoked this function injects buttons into the page
function injectIntoDOM() {

    //Injecting button
    let settingsNavItem = document.querySelector(".settingsNavItem");
    let mainNavContainer = document.querySelector(".mainNavCont");
    if (!settingsNavItem && mainNavContainer) {
        settingsNavItem = document.createElement("div");
        settingsNavItem.className = "settingsNavItem";

        settingsNavItem.innerHTML = `
        <div class="mainNavItem" style="padding-right: 20px; font-size: xx-large; font-weight: bold">

        <div class="mainNavItemText">SETTINGS</div>
    </div >
    `;

        mainNavContainer.appendChild(settingsNavItem);

        settingsNavItem.addEventListener("click", function () {
            injectOuterIframe();
        });
    }

    //Initialized a node list with all the captains slots
    const offlineSlots = document.querySelectorAll(".capSlot");
    // Initialize a counter for generating unique IDs
    let buttonCounter = 1;
    //Iterates though each slot
    offlineSlots.forEach(function (slot) {
        //Checks if button already exists on the current slot
        existingElement = slot.querySelector(".offlineButton");
        //Gets current slot status
        const slotStatus = slot.querySelector(".capSlotStatus");

        //If button doesn't exist, one is created and injected.
        if (!existingElement) {
            newButton = document.createElement("button");
            newButton.classList.add("offlineButton");
            // Generate a unique ID for the button
            newButton.setAttribute("id", `offlineButton_${buttonCounter}`);
            newButton.style.fontSize = "30px";
            newButton.style.marginLeft = "15px";
            newButton.style.color = "white";
            newButton.textContent = "--------------";
            newButton.style.backgroundColor = "#5fa695";
            slotStatus.appendChild(newButton);
            // Increment the counter for the next button
            buttonCounter++;
        }
    });

    // Checks if wipe button already exists
    existingButton = document.querySelector(".wipeButton");
    //If button doesn't exist one is created and injected.
    if (!existingButton) {
        newButton = document.createElement("button");
        newButton.className = "wipeButton";
        newButton.innerHTML = "Wipe<br>data";
        newButton.style.cssText = wipeStyles;
        let quantityItemsCont = document.querySelector(".quantityItemsCont");
        quantityItemsCont.insertBefore(newButton, quantityItemsCont.firstChild);
    }

    // Checks if wipe button already exists
    let elapsedTimeContainer = document.querySelector(".elapsedTimeContainer");
    //If button doesn't exist one is created and injected.
    if (!elapsedTimeContainer) {
        elapsedTimeContainer = document.createElement("div");
        elapsedTimeContainer.className = "elapsedTimeContainer";
        elapsedTimeContainer.style.cssText = elapsedTimeStyles;
        let quantityItemsCont = document.querySelector(".quantityItemsCont");
        quantityItemsCont.appendChild(elapsedTimeContainer);
    }
}

//Event listened for user clicks on the injected buttons
document.addEventListener("click", function (event) {

    /* User clicked on the offline slot button.
    The offline button prevents the idle switcher from replacing
    captains on this slot even if the captains are idling or the slot is empty */
    if (event.target.classList.contains("offlineButton")) {
        let button = event.target;
        let id;
        //Checks button current state, updates it and save the slot id and state on the storage
        if (button.innerText === "ENABLED") {
            //Disable button
            button.innerText = "DISABLED";
            id = button.id;
            button.style.backgroundColor = "red";
            setIdleState(id, false);
        } else {
            //Enable button
            button.innerText = "ENABLED";
            button.style.backgroundColor = "#5fa695";
            id = button.id;
            setIdleState(id, true);
        }
    }

    //User clicked the wipe button.
    if (event.target.classList.contains("wipeButton")) {
        //Using the unique key idenfiers all data is removed from storage
        chrome.storage.local.remove(["dungeonCaptain", "clashCaptain", "duelCaptain", 'flaggedCaptains', 'captainLoyalty', 'idleData', 'dataArray', 'offlinePermission'], function () {
            //Resets dataArray to prevent data from being added from the array back to the storage.
            dataArray = [];
            loadBanner("Settings updated sucessfully", "#5fa695");
            //Resets button properties on the user interface.
            let captainPauseSlots = document.querySelectorAll(".capSlot");
            captainPauseSlots.forEach(function (slot) {
                slot.querySelector(".offlineButton").innerText = "ENABLED";
                slot.querySelector(".offlineButton").style.backgroundColor = "#5fa695";
            });
        });
    }

});

/* This function is invoked when user clicks on a pause button.
It updates the states of whether or not a unit can be placed on the slot
It receives the captain name and the new slot state to save in storage */
function saveStateToStorage(name, booleanValue) {
    //Check if an item with the same name already exists
    let existingItem = dataArray.find((item) => item.name === name);

    //Item exists so the value is updated
    if (existingItem) {
        //Update the booleanValue of the existing item
        existingItem.booleanValue = booleanValue;
    }
    //Item does not exist so the item is added
    else {
        //Add a new object to the array
        dataArray.push({ name, booleanValue });

        //Check if the array length exceeds 4 as there are 4 slots
        if (dataArray.length > 4) {
            // Remove the oldest item (first item in the array)
            dataArray.shift();
        }
    }

    //Save updated array to local storage, but only if it has 3 or fewer items
    //Loads a banner signaling completion
    if (dataArray.length <= 4) {
        chrome.storage.local.set({ "dataArray": dataArray }, function () {
            if (chrome.runtime.lastError) {
                loadBanner("Failed to update settings", "red");
            } else {
                loadBanner("Settings updated sucessfully", "#5fa695");
            }
        });
    }
}


// This function retrieves the captain name and returns the pause button state from storage
function retrieveStateFromStorage(captainName) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("dataArray", function (result) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                if (result.dataArray) {
                    dataArray = result.dataArray;
                    const matchingItem = dataArray.find((item) => item.name === captainName);
                    if (matchingItem) {
                        resolve(matchingItem.booleanValue);
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            }
        });
    });
}


/* This function is invoked when user clicks on a idle enabled button.
It updates the state of whether or not a captain replacement should be selected for individual slots
It the slot id and the new switch state to save on storage */

function setIdleState(id, booleanValue) {
    //Gets values currently in storage
    chrome.storage.local.get(['offlinePermission'], function (result) {
        let ids = result.offlinePermission || {};

        if (ids.hasOwnProperty(id)) {
            // id already exists, update state
            ids[id] = booleanValue;
        } else if (Object.keys(ids).length < 4) {
            // id does not exist and there are less than 4 on storage, save state
            ids[id] = booleanValue;
        }

        //Sets the new or update values into the storage and shows a banner to the user
        chrome.storage.local.set({ offlinePermission: ids }, function () {
            if (chrome.runtime.lastError) {
                loadBanner("Failed to update settings", "red");
            } else {
                loadBanner("Settings updated successfully", "#5fa695");
            }
        });
    });
}


//This function receives the slot id and returns the switch state value from storage
//If undefined (not been set by the user yet) it returns true as the default value
function getIdleState(id) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['offlinePermission'], function (result) {
            let ids = result.offlinePermission || {};
            let booleanValue = ids[id];
            resolve(booleanValue !== undefined ? booleanValue : true);
        });
    });
}

function injectOuterIframe() {
    const outerContainer = document.querySelector(".outer_container");
    const battleViewCheck = document.querySelector('.battleView');

    if (!outerContainer && battleViewCheck) {
        const outerContainer = document.createElement('div');

        outerContainer.style.width = '100%';
        outerContainer.style.height = '100%';
        outerContainer.style.position = 'absolute';

        outerContainer.style.top = '0';
        outerContainer.style.left = '0';
        outerContainer.style.backgroundColor = '#1b2a35';

        outerContainer.style.margin = '0';
        outerContainer.classList.add('outer_container');

        document.body.appendChild(outerContainer);

        injectIFrame(outerContainer);
        injectCloseButton(outerContainer);
    }
}

function injectIFrame(outerContainer) {
    const innerIframeCheck = outerContainer.querySelector('.settings_iframe');

    if (!innerIframeCheck) {
        const innerIframe = document.createElement('iframe');
        const localFileURL = chrome.runtime.getURL('iframe.html');

        innerIframe.src = localFileURL;

        innerIframe.style.width = '100%';
        innerIframe.style.height = '85%';
        innerIframe.style.border = 'none';

        innerIframe.classList.add('settings_iframe');


        outerContainer.appendChild(innerIframe);
    }
}

function injectCloseButton(outerContainer) {

    const closeButton = document.createElement('button');
    const innerIframe = document.querySelector(".settings_iframe");

    closeButton.innerText = 'CLOSE SETTINGS';
    closeButton.style.fontSize = "xx-large";
    closeButton.style.fontWeight = "bold";
    closeButton.style.position = 'absolute';
    closeButton.style.bottom = '20px';
    closeButton.style.right = '50%';
    closeButton.style.transform = 'translateX(50%)';
    closeButton.style.zIndex = '9999';
    closeButton.style.width = '250px';
    closeButton.style.height = '200px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';

    // Add the close button to the outerContainer
    outerContainer.appendChild(closeButton);

    // Add a click event listener to the button
    closeButton.addEventListener('click', function () {
        closeButton.remove();
        innerIframe.remove();
        outerContainer.remove();
    });
}
