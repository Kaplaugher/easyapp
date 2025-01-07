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
