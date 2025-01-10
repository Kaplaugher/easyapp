// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'fillLinks',
    title: 'Fill application links',
    contexts: ['page', 'selection'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'fillLinks') {
    chrome.tabs.sendMessage(tab.id, { action: 'fillLinks' });
  }
});

// Handle storage access requests from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStorageData') {
    try {
      chrome.storage.local.get(request.keys, (data) => {
        if (chrome.runtime.lastError) {
          sendResponse({ error: chrome.runtime.lastError });
        } else {
          sendResponse({ data });
        }
      });
      return true;
    } catch (error) {
      sendResponse({ error: error.message });
    }
  }
});
