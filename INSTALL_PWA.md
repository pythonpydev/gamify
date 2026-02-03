# Installing Pokerdoro PWA on iPhone

## The Problem
iOS Safari requires **HTTPS** (secure connection) to show the "Add to Home Screen" option for PWAs. When accessing via `http://192.168.1.177:3000`, the share button won't offer the install option.

## Solutions (Choose One)

### ✅ Option 1: Deploy to Vercel (Recommended - Easiest)

This is the fastest and most reliable solution:

1. **Push your code to GitHub** (if not already done)
2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import your repository
   - Deploy (takes ~2 minutes)

3. **Install on iPhone**:
   - Open Safari on your iPhone
   - Visit your Vercel URL (e.g., `https://pokerdoro.vercel.app`)
   - Tap the **Share** button (square with arrow up)
   - Tap **"Add to Home Screen"**
   - Tap **"Add"**
   - Done! 🎉

### 🔧 Option 2: Local HTTPS Development

If you want to test locally with HTTPS:

1. **Generate SSL certificate**:
   ```bash
   chmod +x setup-https.sh
   ./setup-https.sh
   ```

2. **Install certificate on iPhone**:
   - The certificate will be created at `./certificates/localhost.crt`
   - Transfer it to your iPhone (email, AirDrop, cloud storage)
   - On iPhone: Open the `.crt` file → Install Profile
   - Go to **Settings > General > About > Certificate Trust Settings**
   - Enable **"Enable Full Trust"** for the localhost certificate

3. **Start HTTPS server**:
   ```bash
   npm run dev:https
   ```

4. **Access on iPhone**:
   - Open Safari
   - Visit: `https://192.168.1.177:3000`
   - Accept the security warning (one-time only)
   - Tap Share → Add to Home Screen

### ⚡ Option 3: Use ngrok (Quick Tunnel)

Install ngrok for instant HTTPS:

```bash
# Install ngrok (one-time)
# Download from https://ngrok.com/download
# or: snap install ngrok

# Start your dev server
npm run dev

# In another terminal, create tunnel
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Open it on your iPhone in Safari
# Share → Add to Home Screen
```

## What Changed

I've updated your app to support PWA installation:

1. ✅ Enabled PWA in development mode
2. ✅ Added `apple-touch-icon` metadata for iOS
3. ✅ Improved status bar styling for iOS
4. ✅ Created HTTPS server script

## Troubleshooting

### "Add to Home Screen" option still not showing?

1. **Check you're using HTTPS** (URL starts with `https://`)
2. **Use Safari** (Chrome on iOS won't show this option)
3. **Check manifest is loading**: Open Safari Developer Tools → Application → Manifest
4. **Clear Safari cache**: Settings → Safari → Clear History and Website Data

### Certificate errors on iPhone?

- Make sure you trusted the certificate in **Certificate Trust Settings**
- Try restarting Safari after installing the certificate

### App not working offline?

- First visit all pages while online to cache them
- Check service worker is registered: Safari DevTools → Application → Service Workers

## Testing the PWA

Once installed, test these features:

- ✅ Launches in fullscreen (no browser UI)
- ✅ Shows your custom icon on home screen
- ✅ Works offline after first visit
- ✅ Receives notifications (if enabled)
- ✅ Looks like a native app

Enjoy your Pokerdoro PWA! 🎰⏲️
