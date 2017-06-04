/*
 * Created by bambooom on Sun Jun 04 2017
 */

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.local.get([`toggle-rain-${tab.id}`], function(results) {
        // store new swapped setting
        const tabToggle = !results[`toggle-rain-${tab.id}`];
        chrome.storage.local.set({
            [`toggle-rain-${tab.id}`]: tabToggle
        });

        if (tabToggle) {
            chrome.tabs.sendMessage(tab.id, 'TOGGLE_RAIN', () => {});
        } else {
            chrome.tabs.sendMessage(tab.id, 'TOGGLE_RAIN_OFF', () => {});
        }
    });

});