# Dashboard Subdomain Setup

This document explains how to access the dashboard at `dashboard.website.com` instead of `website.com/dashboard`.

## How It Works

A Next.js middleware (`middleware.ts` or `proxy.ts`) automatically routes requests from `dashboard.website.com` to the `/dashboard` route internally, while users still see the clean subdomain URL in their browser.

## Local Development

### Setup Subdomain for Local Testing

#### Option 1: Using the Helper Script
```bash
# Make the script executable
chmod +x scripts/setup-dashboard-subdomain.sh

# Run the script
./scripts/setup-dashboard-subdomain.sh
```

#### Option 2: Manual Setup

**macOS/Linux:**
1. Edit `/etc/hosts`:
   ```bash
   sudo nano /etc/hosts
   ```
2. Add this line:
   ```
   127.0.0.1 dashboard.localhost
   ```
3. Save and exit (Ctrl+X, then Y, then Enter)

**Windows:**
1. Open Notepad as Administrator
2. Open file: `C:\Windows\System32\drivers\etc\hosts`
3. Add this line:
   ```
   127.0.0.1 dashboard.localhost
   ```
4. Save the file

### Access the Dashboard

After setting up the hosts file, you can access the dashboard at:
- `http://dashboard.localhost:3000` (local development)
- `http://dashboard.localhost:3000/dashboard` (also works)
- `http://dashboard.localhost:3000/settings` (any dashboard route)

## Production Deployment

### DNS Configuration

Add the following DNS record:
- **Type**: CNAME
- **Name**: dashboard
- **Value**: your-main-domain.com
- **TTL**: 300-600 seconds

Alternatively, add an A record:
- **Type**: A
- **Name**: dashboard
- **Value**: YOUR_SERVER_IP
- **TTL**: 300-600 seconds

### Platform-Specific Setup

#### Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add `dashboard.yourdomain.com` as a domain
3. Follow Vercel's DNS configuration instructions
4. Vercel will automatically generate an SSL certificate for the subdomain

#### Netlify
1. Go to Netlify Dashboard → Your Site → Domain Settings
2. Add custom domain: `dashboard.yourdomain.com`
3. Configure DNS as instructed by Netlify

#### Other Platforms
- Add the subdomain in your hosting platform's dashboard
- Configure the DNS record as directed
- Ensure SSL certificate covers the subdomain (most platforms handle this automatically)

## Testing

### Local Testing
1. Run your development server: `bun dev` or `npm run dev`
2. Visit `http://dashboard.localhost:3000`
3. Verify that the dashboard loads correctly
4. Test all dashboard routes (settings, analytics, etc.)

### Production Testing
1. Ensure DNS has propagated (can take up to 48 hours, usually 5-10 minutes)
2. Visit `https://dashboard.yourdomain.com`
3. Verify SSL certificate is valid
4. Test all dashboard functionality

## Benefits

- **Clean URLs**: Users see `dashboard.website.com` instead of `website.com/dashboard`
- **Better UX**: Dedicated subdomain feels more professional
- **SEO Friendly**: Better subdomain structure for search engines
- **Scalable**: Easy to add more subdomains (app.website.com, etc.)
- **Centralized**: All routing logic in one middleware file

## Troubleshooting

### Dashboard subdomain not working
1. Check `/etc/hosts` entry is correct (local)
2. Verify DNS has propagated (production)
3. Ensure middleware.ts is in the root directory
4. Check browser console for any errors
5. Try accessing the main domain first to ensure the app is running

### 404 errors on dashboard routes
1. Verify the dashboard route exists at `app/dashboard/`
2. Check middleware.ts matcher pattern isn't blocking the route
3. Ensure Next.js build completed successfully

### SSL certificate issues
1. For Vercel/Netlify: Wait a few minutes after domain setup
2. Check DNS is pointing to the correct platform
3. Contact platform support if SSL doesn't auto-provision

## Security Considerations

- All authentication and session management remains the same
- CORS policies should be reviewed for subdomain access
- Cookies should include the domain attribute if sharing auth across subdomains
- Ensure proper security headers are set for the subdomain
