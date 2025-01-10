document.addEventListener('DOMContentLoaded', () => {
  // Load saved information when popup opens
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
    (result) => {
      // Personal Information
      document.getElementById('firstName').value = result.firstName || '';
      document.getElementById('lastName').value = result.lastName || '';
      document.getElementById('email').value = result.email || '';
      document.getElementById('location').value = result.location || '';
      document.getElementById('phone').value = result.phone || '';

      // Professional Links
      document.getElementById('github').value = result.github || '';
      document.getElementById('linkedin').value = result.linkedin || '';
      document.getElementById('portfolio').value = result.portfolio || '';
    }
  );

  // Save information when save button is clicked
  document.getElementById('save').addEventListener('click', () => {
    const info = {
      // Personal Information
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      email: document.getElementById('email').value.trim(),
      location: document.getElementById('location').value.trim(),
      phone: document.getElementById('phone').value.trim(),

      // Professional Links
      github: document.getElementById('github').value.trim(),
      linkedin: document.getElementById('linkedin').value.trim(),
      portfolio: document.getElementById('portfolio').value.trim(),
    };

    chrome.storage.local.set(info, () => {
      const status = document.getElementById('status');
      status.style.display = 'block';

      setTimeout(() => {
        status.style.display = 'none';
      }, 2000);
    });

    // Try to fill forms on the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'fillLinks' });
      }
    });
  });
});
