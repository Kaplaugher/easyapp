// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('🔧 Extension installed/updated');

  // Create context menu item
  chrome.contextMenus.create({
    id: 'fillLinks',
    title: 'Fill application links',
    contexts: ['page', 'selection'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'fillLinks') {
    console.log('🎯 Context menu clicked, attempting to fill forms');
    chrome.tabs.sendMessage(tab.id, { action: 'fillLinks' });
  }
});

// Handle storage access requests from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStorageData') {
    console.log('📦 Storage access requested for keys:', request.keys);

    try {
      chrome.storage.local.get(request.keys, (data) => {
        if (chrome.runtime.lastError) {
          console.error('❌ Storage access error:', chrome.runtime.lastError);
          sendResponse({ error: chrome.runtime.lastError });
        } else {
          console.log('✅ Retrieved data:', data);
          sendResponse({ data });
        }
      });
      return true; // Required for async response
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      sendResponse({ error: error.message });
    }
  }
});
