// Common keywords for each type of link
const FIELD_PATTERNS = {
  github: [
    /github/i,
    /git(\s|-)?hub/i,
    /git(\s)?profile/i,
    /github.*profile/i,
    /github.*url/i,
  ],
  linkedin: [
    /linkedin/i,
    /linked(\s|-)?in/i,
    /professional(\s)?profile/i,
    /linkedin.*profile/i,
    /linkedin.*url/i,
    /^li$/i, // Some forms use "li" as shorthand
    /^li.*profile$/i,
  ],
  portfolio: [
    /portfolio/i,
    /personal(\s)?website/i,
    /web(\s)?site/i,
    /portfolio.*url/i,
    /personal.*url/i,
  ],
};

// Helper function to check if an input field matches our patterns
function matchesPattern(element, patterns) {
  console.debug('🔍 Checking element for patterns:', {
    id: element.id,
    type: element.type,
    'aria-label': element.getAttribute('aria-label'),
    placeholder: element.placeholder,
  });

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

  console.debug('📝 Text to match:', textToMatch);

  // Log each pattern being tested
  patterns.forEach((pattern) => {
    console.debug(
      `🔍 Testing pattern ${pattern} against text:`,
      pattern.test(textToMatch)
    );
  });

  const matchedPattern = patterns.find((pattern) => pattern.test(textToMatch));
  if (matchedPattern) {
    console.debug('✅ Found matching pattern:', matchedPattern);
    return true;
  }
  return false;
}

// Function to find and fill input fields
function findAndFillFields(links) {
  console.log('🔎 Starting to search for fields to fill...', links);

  // Get all input fields that could potentially be link inputs
  const inputs = Array.from(
    document.querySelectorAll(
      'input[type="text"], input[type="url"], input:not([type])'
    )
  );

  console.log(`📋 Found ${inputs.length} potential input fields`);

  for (const input of inputs) {
    // Skip if the input is not visible or disabled
    if (!input.offsetParent || input.disabled || input.readOnly) {
      console.debug('⏭️ Skipping hidden/disabled input:', input);
      continue;
    }

    // Check each type of link
    for (const [type, patterns] of Object.entries(FIELD_PATTERNS)) {
      if (matchesPattern(input, patterns) && links[type]) {
        console.log(`✨ Found match for ${type}:`, input);
        console.log(`💾 Filling with value: ${links[type]}`);

        input.value = links[type];
        // Trigger input event to notify the form of changes
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`✅ Successfully filled ${type} field`);
        break;
      }
    }
  }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Received message:', request);

  if (request.action === 'fillLinks') {
    console.log('🎯 Processing fillLinks action');
    chrome.storage.local.get(['github', 'linkedin', 'portfolio'], (links) => {
      console.log('📦 Retrieved stored links:', links);
      findAndFillFields(links);
      sendResponse({ success: true });
    });
    return true; // Required for async response
  }
});

// Automatically try to fill fields when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌟 Page loaded, attempting to fill fields');
  chrome.storage.local.get(['github', 'linkedin', 'portfolio'], (links) => {
    findAndFillFields(links);
  });
});

// Watch for dynamic form additions
const observer = new MutationObserver((mutations) => {
  console.log('👀 Detected DOM changes, checking for new fields');
  chrome.storage.local.get(['github', 'linkedin', 'portfolio'], (links) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        console.log('🆕 New nodes added to DOM, attempting to fill fields');
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
