# Halvor Lines Speedway Marketing Tool - Deployment Guide

This document provides detailed instructions for deploying the Halvor Lines Speedway Marketing Tool to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed on your computer
- Basic familiarity with command line operations

## Step 1: Create a GitHub Repository

1. Log in to your GitHub account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Enter "halvor-lines-speedway-marketing-tool" as the Repository name
4. Add a description: "Web-based marketing content creator for Halvor Lines Speedway"
5. Select "Public" for the repository visibility
6. Leave the "Initialize this repository with a README" option unchecked
7. Click "Create repository"

## Step 2: Push the Code to GitHub

After creating the repository, you'll see instructions for pushing an existing repository. Follow these steps:

1. Extract the provided ZIP file to a folder on your computer
2. Open a terminal or command prompt
3. Navigate to the extracted folder:
   ```
   cd path/to/extracted/folder
   ```
4. Initialize a Git repository (if not already initialized):
   ```
   git init
   ```
5. Add all files to the repository:
   ```
   git add .
   ```
6. Commit the files:
   ```
   git commit -m "Initial commit of Halvor Lines Speedway Marketing Tool"
   ```
7. Add the GitHub repository as a remote:
   ```
   git remote add origin https://github.com/yourusername/halvor-lines-speedway-marketing-tool.git
   ```
   (Replace "yourusername" with your actual GitHub username)
8. Push the code to GitHub:
   ```
   git push -u origin main
   ```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" (tab with gear icon)
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select "main" branch
5. Click "Save"
6. Wait a few minutes for GitHub Pages to build your site
7. Once built, you'll see a message with your site's URL (typically https://yourusername.github.io/halvor-lines-speedway-marketing-tool/)

## Step 4: Verify Deployment

1. Visit the provided GitHub Pages URL
2. Verify that all pages load correctly
3. Test the template browser, editor, and export functionality
4. Check that the strategies and help pages are accessible

## Making Future Updates

To update the site after deployment:

1. Make changes to the local files
2. Commit the changes:
   ```
   git add .
   git commit -m "Description of changes"
   ```
3. Push the changes to GitHub:
   ```
   git push
   ```
4. GitHub Pages will automatically rebuild your site with the new changes

## Troubleshooting

- If your site doesn't appear after enabling GitHub Pages, wait a few minutes and refresh
- If images or resources don't load, check that file paths are correct (case-sensitive)
- If you encounter 404 errors, verify that all HTML files are in the correct location
- For JavaScript errors, check the browser console for specific error messages

## Support

For questions or issues with the Halvor Lines Speedway Marketing Tool, please contact the development team.

