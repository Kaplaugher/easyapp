// Common keywords for each type of link
const FIELD_PATTERNS = {
  github: [/github/i, /git(\s|-)?hub/i, /git(\s)?profile/i],
  linkedin: [/linkedin/i, /linked(\s|-)?in/i, /professional(\s)?profile/i],
  portfolio: [/portfolio/i, /personal(\s)?website/i, /web(\s)?site/i],
};

// Helper function to check if an input field matches our patterns
function matchesPattern(element, patterns) {
  const textToMatch = [
    element.id,
    element.name,
    element.placeholder,
    element.getAttribute('aria-label'),
    element.getAttribute('data-testid'),
    element.getAttribute('data-field'),
    element.getAttribute('label'),
    element.previousElementSibling?.textContent,
    element.closest('label')?.textContent,
    ...Array.from(element.labels || []).map((label) => label.textContent),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return patterns.some((pattern) => pattern.test(textToMatch));
}

// Function to find and fill input fields
function findAndFillFields(links) {
  // Get all input fields that could potentially be link inputs
  const inputs = Array.from(
    document.querySelectorAll(
      'input[type="text"], input[type="url"], input:not([type])'
    )
  );

  for (const input of inputs) {
    // Skip if the input is not visible or disabled
    if (!input.offsetParent || input.disabled || input.readOnly) {
      continue;
    }

    // Check each type of link
    for (const [type, patterns] of Object.entries(FIELD_PATTERNS)) {
      if (matchesPattern(input, patterns) && links[type]) {
        input.value = links[type];
        // Trigger input event to notify the form of changes
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillLinks') {
    chrome.storage.local.get(['github', 'linkedin', 'portfolio'], (links) => {
      findAndFillFields(links);
      sendResponse({ success: true });
    });
    return true; // Required for async response
  }
});

// Add a context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'fillLinks',
    title: 'Fill application links',
    contexts: ['page', 'selection'],
  });
});

// Optional: Automatically try to fill fields when the page loads
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['github', 'linkedin', 'portfolio'], (links) => {
    findAndFillFields(links);
  });
});

// Optional: Watch for dynamic form additions
const observer = new MutationObserver((mutations) => {
  chrome.storage.local.get(['github', 'linkedin', 'portfolio'], (links) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        findAndFillFields(links);
        break;
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
