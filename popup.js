document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Popup opened');

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
      console.log('📂 Loading saved information:', result);

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

      console.log('✅ Populated form fields with saved values');
    }
  );

  // Save information when save button is clicked
  document.getElementById('save').addEventListener('click', () => {
    console.log('💾 Save button clicked');

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

    console.log('📝 Saving information:', info);

    chrome.storage.local.set(info, () => {
      console.log('✅ Information saved successfully');

      const status = document.getElementById('status');
      status.style.display = 'block';

      console.log('⏳ Showing success message');
      setTimeout(() => {
        status.style.display = 'none';
        console.log('🔄 Hidden success message');
      }, 2000);
    });

    // Try to fill forms on the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        console.log('🎯 Attempting to fill forms on active tab:', tabs[0].url);
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'fillLinks' },
          (response) => {
            if (chrome.runtime.lastError) {
              console.warn(
                '⚠️ Error sending message to tab:',
                chrome.runtime.lastError
              );
            } else {
              console.log('✨ Successfully triggered form fill:', response);
            }
          }
        );
      }
    });
  });
});
