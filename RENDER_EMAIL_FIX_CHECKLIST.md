# 🆘 Email Not Sending on Render - Diagnostic Guide

## ✅ What You MUST Do (Most Likely Issue)

**Your SMTP environment variables are probably NOT set on Render's dashboard.**

### 🔴 CRITICAL: Set Render Environment Variables

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click your backend service** (SmartStay backend)
3. **Click "Settings"** tab (top right)
4. **Click "Environment"** on the left menu
5. **Verify these variables exist and are set:**

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=shubhambatwal14@gmail.com
SMTP_PASS=alkwovicbfsouapx
SMTP_FROM=shubhambatwal14@gmail.com
HOST_NOTIFICATION_EMAIL=shubhambatwal14@gmail.com
```

**⚠️ IMPORTANT**: Each variable must be added individually in Render's UI (not as a .env file).

---

## 🔍 How to Verify Email is Configured on Render

1. **Check the Render logs** after deployment:
   - Go to your Render service
   - Click **Logs** tab
   - Look for lines that say:

   **✓ If you see this (email IS configured)**:
   ```
   🚀 SMARTSTAY STARTUP CONFIGURATION
   Email Status: ✓ READY
   ✓ SMTP_HOST: smtp.gmail.com
   ✓ SMTP_USER: shubhambatwal14@gmail.com
   ```

   **✗ If you see this (email NOT configured)**:
   ```
   Email Status: ✗ NOT CONFIGURED
   ✗ SMTP_HOST: NOT SET
   ✗ SMTP_USER: NOT SET
   ✗ SMTP_PASS: NOT SET
   WARNING: Email is not configured on Render!
   ```

---

## 🛠️ Step-by-Step Fix (Copy-Paste Instructions)

### Step 1: Add Variables to Render

In Render Dashboard → Your Service → Settings → Environment:

**Add these 7 variables** (click "+ Add Environment Variable" for each):

| Variable Name | Value |
|--------------|-------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | `shubhambatwal14@gmail.com` |
| `SMTP_PASS` | `alkwovicbfsouapx` |
| `SMTP_FROM` | `shubhambatwal14@gmail.com` |
| `HOST_NOTIFICATION_EMAIL` | `shubhambatwal14@gmail.com` |

### Step 2: Save and Deploy

1. Scroll to bottom and click **"Save Changes"**
2. Render will show a prompt: "Redeploy with these changes?" → Click **"Deploy"**
3. Wait for deployment to complete (check Logs tab)

### Step 3: Verify in Logs

1. Click **Logs** tab
2. Look for the startup message showing email status
3. Should see: `✓ READY` for Email Configuration

### Step 4: Test

1. Go to your deployed frontend URL
2. Make a test booking
3. Check Render logs for:
   ```
   📧 Starting email send process...
   📤 Sending emails to: { guest: '...', host: '...' }
   ✓ 2 of 2 booking emails sent
   ```
4. Check your email inbox (and spam folder)

---

## 🔧 Additional Improvements Made

Your backend has been updated with:

✅ **Better startup logging** - Shows exactly what's configured  
✅ **Improved error messages** - Tells you what's missing  
✅ **Timeout protection** - Emails won't hang forever  
✅ **Better diagnostics** - Shows SMTP config status in logs  
✅ **Connection pooling** - Handles multiple bookings better  

---

## 📋 Complete Checklist

- [ ] Committed and pushed code changes
- [ ] Went to Render dashboard
- [ ] Clicked your backend service
- [ ] Clicked Settings → Environment
- [ ] Added all 7 SMTP variables
- [ ] Clicked "Save Changes"
- [ ] Clicked "Deploy" when prompted
- [ ] Waited for deployment to complete
- [ ] Checked Logs for "Email Status: ✓ READY"
- [ ] Made a test booking
- [ ] Saw email send logs in Render
- [ ] Received email in inbox

---

## ✅ Expected Log Output (After Fix)

When the backend starts on Render, you should see:

```
============================================================
🚀 SMARTSTAY STARTUP CONFIGURATION
============================================================
  Environment: production
  Port: 3000
  MongoDB: ✓ Connected
  Razorpay: ✓ Configured
  Frontend URL: https://shubz-smart-stay.vercel.app/

📧 EMAIL CONFIGURATION:
  Status: ✓ READY
  ✓ SMTP_HOST: smtp.gmail.com
  ✓ SMTP_PORT: 587
  ✓ SMTP_SECURE: false
  ✓ SMTP_USER: shubhambatwal14@gmail.com
  ✓ SMTP_PASS: [SET - 16 chars]
  ✓ SMTP_FROM: shubhambatwal14@gmail.com
  ✓ HOST_NOTIFICATION_EMAIL: shubhambatwal14@gmail.com
============================================================
```

---

## ❌ Common Issues During Testing

### Issue: Still see "NOT CONFIGURED" in logs

**Cause**: Environment variables weren't saved properly

**Fix**:
1. Go back to Render Environment settings
2. Verify all 7 variables are there
3. Check for typos in variable names (case-sensitive)
4. Click "Save Changes" again
5. Click "Deploy"
6. Wait 30 seconds
7. Check logs again

---

### Issue: See "SMTP Connection Failed" error

**Cause**: Gmail password might be wrong or App Password expired

**Fix**:
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Go to [App passwords](https://myaccount.google.com/apppasswords)
3. Create a NEW app password (delete the old one)
4. Copy the 16-character password
5. Update `SMTP_PASS` on Render with the new password
6. Deploy again

---

### Issue: Email sends but goes to spam

**Fix**:
1. Check your spam/promotions folder
2. Mark the email as "Not Spam"
3. Add the sender to your contacts

---

## 🚨 If Still Not Working

Check Render logs for one of these errors:

### "SMTP Configuration Error - Missing required variables"
→ You didn't set all 7 variables on Render

### "SMTP Connection Failed: Invalid login"
→ Gmail password is wrong or App Password expired

### "connect ETIMEDOUT"
→ Network issue - try changing to port 465 with SECURE=true

### "All emails failed"
→ Check error message in logs for exact reason

---

## 📞 Quick Test Command (Local Only)

To verify locally that email works:

```bash
cd backend
npm start

# In another terminal:
node -e "
require('dotenv').config();
const { sendBookingEmails } = require('./config/emailService');
const mockBooking = {
  _id: 'test',
  user: { fullName: 'Test User', email: 'shubhambatwal14@gmail.com' },
  home: { houseName: 'Test Home', houseAddr: 'Test Address', owner: { fullName: 'Host', email: 'shubhambatwal14@gmail.com' } },
  checkIn: new Date(),
  checkOut: new Date(Date.now() + 86400000),
  guests: 2,
  amount: 5000
};
sendBookingEmails(mockBooking).then(result => {
  console.log('Result:', result);
  process.exit(result.success ? 0 : 1);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
"
```

---

**The fix is almost certainly just adding those 7 environment variables to Render. Do it now and test again!**
