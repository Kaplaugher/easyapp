# EasyFill Chrome Extension

## Purpose

The EasyFill is a Chrome extension designed to streamline the job application process by automatically filling in your professional profile links (GitHub, LinkedIn, and Portfolio) across various job application forms. It solves the common problem of repeatedly entering the same URLs during job applications, saving time and reducing errors.

## Features

- 🔄 Automatically detects and fills link fields in job applications
- 💾 Securely stores your profile links in Chrome's local storage
- 🔍 Smart field detection using multiple identification methods:
  - Input labels
  - Placeholder text
  - ARIA labels
  - Field IDs and names
  - Surrounding text content
- ⚡ Real-time form filling as new fields appear
- 🛡️ Safe and private - all data stored locally in your browser

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your Chrome toolbar

## How to Use

1. Click the extension icon in your Chrome toolbar
2. Enter your profile URLs:
   - GitHub profile
   - LinkedIn profile
   - Portfolio website
3. Click "Save"
4. Navigate to any job application form
5. The extension will automatically fill in your links when it detects matching fields

## Supported Field Types

The extension recognizes various field patterns including:

- GitHub profile fields
- LinkedIn profile inputs
- Personal website/portfolio fields
- Professional profile links
- Various URL input fields

## Debugging

If you need to troubleshoot:

1. Right-click the extension icon and select "Inspect popup" to debug the popup
2. Open Chrome DevTools (F12) on the application page to see field detection logs
3. Look for emoji-marked log messages showing the extension's activity

## Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- No tracking or analytics included

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

MIT License - feel free to use and modify as needed.

## Support

If you encounter any issues or have suggestions:

1. Check the console logs for debugging information
2. Submit an issue on GitHub
3. Provide the URL of the form that's not working (if applicable)
