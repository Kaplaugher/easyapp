// Common keywords for each type of field
const FIELD_PATTERNS = {
  // Personal Information
  firstName: [
    /first[\s-]?name/i,
    /given[\s-]?name/i,
    /^first$/i,
    /^fname$/i,
    /^givenname$/i,
  ],
  lastName: [
    /last[\s-]?name/i,
    /family[\s-]?name/i,
    /surname/i,
    /^last$/i,
    /^lname$/i,
  ],
  fullName: [
    /^name$/i,
    /full[\s-]?name/i,
    /your[\s-]?name/i,
    /complete[\s-]?name/i,
  ],
  email: [
    /^email$/i,
    /e-?mail/i,
    /email.*address/i,
    /^mail$/i,
    /contact.*email/i,
  ],
  location: [
    /location/i,
    /city/i,
    /state/i,
    /address/i,
    /where.*located/i,
    /where.*based/i,
  ],
  phone: [/phone/i, /telephone/i, /mobile/i, /cell/i, /contact.*number/i],
  // Professional Links
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

// Helper function to check if an input is a select-like element
function isSelectLikeInput(element) {
  // Check for common select-related attributes
  const selectAttributes = [
    'role="combobox"',
    'aria-haspopup="true"',
    'aria-expanded',
    'aria-autocomplete="list"',
  ];

  // Check for common select-related classes
  const selectClassPatterns = [/select/i, /dropdown/i, /combobox/i];

  // Check if element has select-like attributes
  const hasSelectAttributes = selectAttributes.some((attr) => {
    const [attrName, attrValue] = attr.split('=');
    const elementValue = element.getAttribute(attrName.replace('="', ''));
    return attrValue
      ? elementValue === attrValue.replace(/"/g, '')
      : elementValue !== null;
  });

  // Check if element has select-like classes
  const hasSelectClasses =
    element.className &&
    selectClassPatterns.some((pattern) => pattern.test(element.className));

  return hasSelectAttributes || hasSelectClasses;
}

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
function findAndFillFields(info) {
  const inputs = Array.from(
    document.querySelectorAll(
      'input[type="text"], input[type="url"], input[type="tel"], input:not([type])'
    )
  ).filter((input) => !isSelectLikeInput(input));

  for (const input of inputs) {
    if (!input.offsetParent || input.disabled || input.readOnly) {
      continue;
    }

    for (const [type, patterns] of Object.entries(FIELD_PATTERNS)) {
      if (matchesPattern(input, patterns)) {
        let valueToFill = info[type];

        if (type === 'fullName' && info.firstName && info.lastName) {
          valueToFill = `${info.firstName} ${info.lastName}`;
        }

        if (valueToFill) {
          input.value = valueToFill;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
        break;
      }
    }
  }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillLinks') {
    chrome.storage.local.get(
      [
        'firstName',
        'lastName',
        'email',
        'location',
        'phone',
        'github',
        'linkedin',
        'portfolio',
      ],
      (info) => {
        findAndFillFields(info);
        sendResponse({ success: true });
      }
    );
    return true;
  }
});

// Automatically try to fill fields when the page loads
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(
    [
      'firstName',
      'lastName',
      'email',
      'location',
      'phone',
      'github',
      'linkedin',
      'portfolio',
    ],
    (info) => {
      findAndFillFields(info);
    }
  );
});

// Watch for dynamic form additions
const observer = new MutationObserver((mutations) => {
  chrome.storage.local.get(
    [
      'firstName',
      'lastName',
      'email',
      'location',
      'phone',
      'github',
      'linkedin',
      'portfolio',
    ],
    (info) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          findAndFillFields(info);
          break;
        }
      }
    }
  );
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
