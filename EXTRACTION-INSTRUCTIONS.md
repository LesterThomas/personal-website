# Authory Content Extraction Instructions

Follow these steps to extract all your content from Authory.com:

## Step 1: Prepare the Browser

1. Open https://authory.com/lesterthomas in Chrome, Edge, or Firefox
2. **IMPORTANT:** Scroll down through the entire page multiple times
   - Keep scrolling until no new content appears
   - This loads all 50+ items into the page
3. Wait a few seconds for all content to fully render

## Step 2: Extract the Data

1. Press **F12** to open Developer Tools
2. Click on the **Console** tab
3. Open the file `scripts/browser-extract.js` in a text editor
4. **Copy ALL the contents** of that file
5. **Paste** into the Console
6. Press **Enter** to run the script

## Step 3: Save the JSON

You should see output like:
```
🔍 Starting Authory content extraction...
Found 50 potential items
✅ Extracted 48 items
📋 Copy the JSON below and save to: scripts/authory-data.json
==== START JSON ====
[
  {
    "title": "...",
    "url": "...",
    ...
  }
]
==== END JSON ====
✨ JSON also copied to clipboard!
```

**Option A (if clipboard copy worked):**
1. The JSON is already in your clipboard
2. Create a new file: `scripts/authory-data.json`
3. Paste the clipboard contents
4. Save the file

**Option B (manual copy):**
1. In the Console, select all the JSON between `==== START JSON ====` and `==== END JSON ====`
2. Right-click > Copy
3. Create a new file: `scripts/authory-data.json`
4. Paste the JSON
5. Save the file

## Step 4: Convert to YAML Files

1. Open a terminal in the project folder
2. Run:
   ```bash
   npm run convert-json
   ```

You should see output like:
```
📖 Reading JSON from scripts/authory-data.json
✅ Found 48 items in JSON
  ✓ Saved: 2024-06-19-...yml
  ✓ Saved: 2024-05-26-...yml
  ⊘ Skipped (exists): 2024-05-09-...yml
  ...
🎉 Conversion complete!
   Saved: 43 new files
   Skipped: 5 existing files
   Total: 48 items
```

## Troubleshooting

### "File not found: scripts/authory-data.json"
- Make sure you saved the JSON file in the correct location
- The file should be at: `scripts/authory-data.json`

### "Found 0 items"
- You didn't scroll down enough on the Authory page
- Go back to Step 1 and scroll more
- Try refreshing the page and scrolling again

### JSON Copy Failed
- Use Option B (manual copy) from Step 3
- Make sure to copy ONLY the JSON between the START/END markers
- Don't include the markers themselves

### Script Doesn't Run in Console
- Make sure you copied the ENTIRE contents of `browser-extract.js`
- Check for any red errors in the Console
- Try refreshing the page and starting over

## Verify the Results

After conversion, check:
```bash
ls src/data/content/
```

You should see 48+ `.yml` files with dates and titles.

Example filenames:
- `2026-02-24-how-telcos-are-building-safe-environments-for-ai-agents.yml`
- `2024-06-18-dtw24-ignite-telcos-adopt-oda-canvas.yml`
- etc.

## Next Steps

Once you have all YAML files:
1. Commit them to Git: `git add src/data/content && git commit -m "Add content data"`
2. Continue with React app development
