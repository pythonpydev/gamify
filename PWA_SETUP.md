# PWA Setup for Pokerdoro

Your app is now configured as a Progressive Web App! 🎉

## What's Been Done

✅ Installed `next-pwa` package
✅ Configured Next.js for PWA support
✅ Created web app manifest with Pokerdoro branding
✅ Added PWA meta tags for iOS and Android
✅ Set up service worker with caching strategies
✅ Configured offline support

## What You Need to Do

### 1. Create App Icons

You need to create two PNG icon files and place them in the `public/` folder:

- **icon-192.png** - 192x192 pixels
- **icon-512.png** - 512x512 pixels

**Quick ways to create icons:**

1. **Canva** (easiest for non-designers)
   - Go to canva.com
   - Create 192x192 and 512x512 designs
   - Add poker chip emoji or logo + "Pokerdoro" text
   - Download as PNG

2. **Favicon.io** (instant generation)
   - Go to favicon.io/favicon-generator/
   - Type "P" or "🎰"
   - Choose colors (purple theme: #8b5cf6)
   - Download and resize to 192x192 and 512x512

3. **Use emoji as placeholder** (quick test)
   ```bash
   # Create simple colored squares for testing
   # You can replace these later with proper designs
   ```

### 2. Test PWA on iPhone

1. **Build and run the app:**
   ```bash
   npm run build
   npm start
   ```

2. **Access on iPhone:**
   - Open Safari on your iPhone
   - Go to your local IP address (e.g., http://192.168.1.x:3000)
     - Find your IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Or deploy to Vercel and visit pokerdoro.com

3. **Install to Home Screen:**
   - Tap the **Share** button (square with arrow)
   - Scroll down and tap **"Add to Home Screen"**
   - Tap **"Add"**
   - The Pokerdoro icon will appear on your home screen!

4. **Test the app:**
   - Tap the icon to launch (looks like native app!)
   - Check that it works offline (turn on airplane mode)
   - Verify timer functionality
   - Test navigation

### 3. Deploy to Vercel

Once you have the icons ready:

```bash
git add .
git commit -m "feat: add PWA support for iOS and Android"
git push
```

Vercel will automatically deploy with PWA support enabled.

## PWA Features Enabled

### 📱 Install to Home Screen
- iOS: Add to Home Screen via Safari
- Android: Install prompt appears automatically
- Desktop: Install icon in address bar

### 🔌 Offline Support
- Pages cached after first visit
- Works without internet connection
- Background sync when connection restored

### ⚡ Fast Loading
- Service worker caches static assets
- Instant subsequent loads
- Optimized caching strategies:
  - **NetworkFirst**: API calls, dynamic pages
  - **CacheFirst**: Fonts, long-term assets
  - **StaleWhileRevalidate**: Images, styles

### 🎯 App-Like Experience
- No browser UI (standalone mode)
- Full screen on mobile
- Custom theme color (#8b5cf6 purple)
- Splash screen (iOS)

### 🔗 Deep Linking
- App shortcuts for quick actions:
  - Start Quick Session (15min)
  - Start Standard Session (25min)
  - View Dashboard

## Testing Checklist

- [ ] Icons created (192x192 and 512x512)
- [ ] Icons placed in `public/` folder
- [ ] Build successful (`npm run build`)
- [ ] No console errors
- [ ] Service worker registered (check DevTools)
- [ ] Manifest loads (check Network tab)
- [ ] Install prompt appears on mobile
- [ ] App works offline
- [ ] Timer functions correctly
- [ ] Data syncs when back online

## Troubleshooting

### "Add to Home Screen" doesn't appear on iOS
- Must use Safari (not Chrome/Firefox on iOS)
- Must be served over HTTPS (works on Vercel)
- Manifest must be valid
- Icons must exist

### Service worker not registering
- Check browser console for errors
- Verify manifest.json is accessible
- Try in incognito/private mode
- Clear cache and reload

### App doesn't work offline
- Service worker needs time to cache assets
- Visit key pages first while online
- Check Application tab in DevTools
- Verify caching strategies in next.config.mjs

### Icons not showing
- Verify files are named exactly: `icon-192.png` and `icon-512.png`
- Check files are in `public/` folder (not `public/icons/`)
- Clear browser cache
- Uninstall and reinstall PWA

## PWA Configuration Files

- **next.config.mjs** - PWA webpack configuration
- **public/manifest.json** - App metadata and icons
- **src/app/layout.tsx** - PWA meta tags
- **.gitignore** - Excludes generated service worker files

## Next Steps

1. Create your icons (use Canva or Favicon.io)
2. Test locally on your iPhone
3. Deploy to Vercel
4. Share the installed app experience!

## Resources

- [PWA Builder](https://www.pwabuilder.com/) - Test your PWA
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA audit
- [Can I Use PWA](https://caniuse.com/web-app-manifest) - Browser support
- [Apple PWA Guide](https://developer.apple.com/design/human-interface-guidelines/web-apps)

---

**Questions?** The PWA is configured and ready - just add icons and deploy! 🚀
