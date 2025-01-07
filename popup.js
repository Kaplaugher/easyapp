document.addEventListener('DOMContentLoaded', () => {
  // Load saved links when popup opens
  chrome.storage.local.get(['github', 'linkedin', 'portfolio'], (result) => {
    document.getElementById('github').value = result.github || '';
    document.getElementById('linkedin').value = result.linkedin || '';
    document.getElementById('portfolio').value = result.portfolio || '';
  });

  // Save links when save button is clicked
  document.getElementById('save').addEventListener('click', () => {
    const links = {
      github: document.getElementById('github').value.trim(),
      linkedin: document.getElementById('linkedin').value.trim(),
      portfolio: document.getElementById('portfolio').value.trim(),
    };

    chrome.storage.local.set(links, () => {
      const status = document.getElementById('status');
      status.style.display = 'block';
      setTimeout(() => {
        status.style.display = 'none';
      }, 2000);
    });
  });
});
