// Common keywords for each type of field
const FIELD_PATTERNS = {
  // Personal Information
  firstName: [
    /first[\s-]?name/i,
    /given[\s-]?name/i,
    /^first$/i,
    /^fname$/i,
    /^givenname$/i,
    /\[first_name\]/i,
    /^first_name$/i,
    /^job_application\[first_name\]$/i,
    /autocomplete="given-name"/i,
  ],
  lastName: [
    /last[\s-]?name/i,
    /family[\s-]?name/i,
    /surname/i,
    /^last$/i,
    /^lname$/i,
    /\[last_name\]/i,
    /^last_name$/i,
    /^job_application\[last_name\]$/i,
    /autocomplete="family-name"/i,
  ],
  fullName: [
    /^name$/i,
    /full[\s-]?name/i,
    /your[\s-]?name/i,
    /complete[\s-]?name/i,
    /\[name\]/i,
  ],
  location: [
    /location/i,
    /city/i,
    /state/i,
    /address/i,
    /where.*located/i,
    /where.*based/i,
    /\[location\]/i,
  ],
  phone: [
    /phone/i,
    /telephone/i,
    /mobile/i,
    /cell/i,
    /contact.*number/i,
    /\[phone\]/i,
    /^job_application\[phone\]$/i,
    /autocomplete="tel"/i,
  ],
  email: [
    /email/i,
    /e-mail/i,
    /\[email\]/i,
    /^job_application\[email\]$/i,
    /autocomplete="email"/i,
  ],
  // Professional Links
  github: [
    /github/i,
    /git(\s|-)?hub/i,
    /git(\s)?profile/i,
    /github.*profile/i,
    /github.*url/i,
    /\[github\]/i,
  ],
  linkedin: [
    /linkedin/i,
    /linked(\s|-)?in/i,
    /professional(\s)?profile/i,
    /linkedin.*profile/i,
    /linkedin.*url/i,
    /^li$/i,
    /^li.*profile$/i,
    /\[linkedin\]/i,
  ],
  portfolio: [
    /portfolio/i,
    /personal(\s)?website/i,
    /web(\s)?site/i,
    /portfolio.*url/i,
    /personal.*url/i,
    /\[portfolio\]/i,
    /\[website\]/i,
  ],
};

// Helper function to check if an input field matches our patterns
function matchesPattern(element, patterns) {
  const elementInfo = {
    id: element.id,
    name: element.name,
    type: element.type,
    'aria-label': element.getAttribute('aria-label'),
    placeholder: element.placeholder,
    autocomplete: element.getAttribute('autocomplete'),
    required: element.required,
    'aria-required': element.getAttribute('aria-required'),
    class: element.className,
    outerHTML: element.outerHTML,
  };

  console.debug('🔍 Checking element for patterns:', elementInfo);

  // Create a comprehensive text string to match against
  const textToMatch = [
    element.id,
    element.name,
    element.placeholder,
    element.getAttribute('aria-label'),
    element.getAttribute('data-testid'),
    element.getAttribute('data-field'),
    element.getAttribute('label'),
    element.getAttribute('autocomplete'),
    element.type,
    element.className,
    element.previousElementSibling?.textContent,
    element.closest('label')?.textContent,
    ...Array.from(element.labels || []).map((label) => label.textContent),
    element.outerHTML,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  console.debug('📝 Text to match:', textToMatch);

  // Log each pattern being tested
  for (const pattern of patterns) {
    const matches = pattern.test(textToMatch);
    console.debug(
      `🔍 Testing pattern ${pattern}:`,
      matches ? '✅ MATCH' : '❌ NO MATCH',
      { pattern: pattern.toString(), text: textToMatch }
    );
    if (matches) {
      console.debug('✅ Found matching pattern:', pattern.toString());
      return true;
    }
  }

  return false;
}

// Function to find all input fields, including those in iframes
function getAllInputs() {
  let inputs = [];

  // Get inputs from main document
  inputs = Array.from(
    document.querySelectorAll(
      'input[type="text"], input[type="url"], input[type="tel"], input[type="email"], input:not([type]), input[name*="first_name"], input[name*="last_name"], input[name*="phone"], input[name*="email"]'
    )
  );

  // Get inputs from iframes
  const iframes = document.querySelectorAll('iframe');
  console.log(`🔍 Found ${iframes.length} iframes`);

  iframes.forEach((iframe, index) => {
    try {
      console.log(`📺 Checking iframe ${index}:`, {
        src: iframe.src,
        id: iframe.id,
        name: iframe.name,
      });

      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        const iframeInputs = Array.from(
          iframeDoc.querySelectorAll(
            'input[type="text"], input[type="url"], input[type="tel"], input[type="email"], input:not([type]), input[name*="first_name"], input[name*="last_name"], input[name*="phone"], input[name*="email"]'
          )
        );
        console.log(
          `📝 Found ${iframeInputs.length} inputs in iframe ${index}`
        );
        inputs = inputs.concat(iframeInputs);
      }
    } catch (error) {
      console.warn(`⚠️ Cannot access iframe ${index}:`, error);
    }
  });

  return inputs;
}

// Function to find and fill input fields
function findAndFillFields(info) {
  console.log('🔎 Starting to search for fields to fill...', info);

  // Get all input fields including those in iframes
  const inputs = Array.from(document.querySelectorAll('input'));

  console.log(`📋 Found ${inputs.length} total potential input fields`);

  // Log all found inputs for debugging
  inputs.forEach((input) => {
    console.log('🔍 Found input:', {
      id: input.id,
      name: input.name,
      type: input.type,
      value: input.value,
      'aria-label': input.getAttribute('aria-label'),
      placeholder: input.placeholder,
      autocomplete: input.getAttribute('autocomplete'),
      visible: !!input.offsetParent,
      disabled: input.disabled,
      readOnly: input.readOnly,
      required: input.required,
      'aria-required': input.getAttribute('aria-required'),
      class: input.className,
      outerHTML: input.outerHTML,
    });
  });

  for (const input of inputs) {
    // Skip if the input is not visible or disabled
    if (!input.offsetParent || input.disabled || input.readOnly) {
      console.debug('⏭️ Skipping hidden/disabled input:', {
        id: input.id,
        name: input.name,
        visible: !!input.offsetParent,
        disabled: input.disabled,
        readOnly: input.readOnly,
      });
      continue;
    }

    // Check each type of field
    for (const [type, patterns] of Object.entries(FIELD_PATTERNS)) {
      // Direct matching for Greenhouse.io forms
      const greenhouseMatch =
        (type === 'firstName' &&
          (input.name === 'job_application[first_name]' ||
            input.id === 'first_name' ||
            input.getAttribute('autocomplete') === 'given-name')) ||
        (type === 'lastName' &&
          (input.name === 'job_application[last_name]' ||
            input.id === 'last_name' ||
            input.getAttribute('autocomplete') === 'family-name')) ||
        (type === 'email' &&
          (input.name === 'job_application[email]' ||
            input.id === 'email' ||
            input.type === 'email' ||
            input.getAttribute('autocomplete') === 'email')) ||
        (type === 'phone' &&
          (input.name === 'job_application[phone]' ||
            input.id === 'phone' ||
            input.type === 'tel' ||
            input.getAttribute('autocomplete') === 'tel'));

      if (greenhouseMatch || matchesPattern(input, patterns)) {
        console.log(`✨ Found match for ${type}:`, {
          id: input.id,
          name: input.name,
          type: input.type,
          autocomplete: input.getAttribute('autocomplete'),
          matchType: greenhouseMatch ? 'greenhouse' : 'pattern',
          patterns: patterns.map((p) => p.toString()),
        });

        let valueToFill = info[type];

        // Special handling for full name
        if (type === 'fullName' && info.firstName && info.lastName) {
          valueToFill = `${info.firstName} ${info.lastName}`;
          console.log('👥 Combining first and last name:', valueToFill);
        }

        if (valueToFill) {
          try {
            console.log(`💾 Filling ${type} field with value: ${valueToFill}`);
            input.value = valueToFill;
            // Trigger input event to notify the form of changes
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('blur', { bubbles: true }));
            console.log(`✅ Successfully filled ${type} field`);
          } catch (error) {
            console.error(`❌ Error filling ${type} field:`, error);
          }
        }
        break;
      }
    }
  }
}

// Function to safely access storage with fallback
function safeGetStorage(keys, callback) {
  try {
    chrome.storage.local.get(keys, callback);
  } catch (error) {
    console.warn('⚠️ Storage access error:', error);
    // Request data from background script instead
    chrome.runtime.sendMessage(
      { action: 'getStorageData', keys },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('❌ Failed to get data:', chrome.runtime.lastError);
          return;
        }
        callback(response.data);
      }
    );
  }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Received message:', request);

  if (request.action === 'fillLinks') {
    console.log('🎯 Processing fillLinks action');
    safeGetStorage(
      [
        'firstName',
        'lastName',
        'location',
        'phone',
        'github',
        'linkedin',
        'portfolio',
      ],
      (info) => {
        console.log('📦 Retrieved stored information:', info);
        findAndFillFields(info);
        sendResponse({ success: true });
      }
    );
    return true; // Required for async response
  }
});

// Automatically try to fill fields when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌟 Page loaded, attempting to fill fields');
  safeGetStorage(
    [
      'firstName',
      'lastName',
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
  console.log('👀 Detected DOM changes, checking for new fields');
  safeGetStorage(
    [
      'firstName',
      'lastName',
      'location',
      'phone',
      'github',
      'linkedin',
      'portfolio',
    ],
    (info) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          console.log('🆕 New nodes added to DOM, attempting to fill fields');
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
