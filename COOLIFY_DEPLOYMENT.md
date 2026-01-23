# Coolify Deployment Guide for CCRentals

## Prerequisites

- Digital Ocean account with a Droplet (recommended: 2GB RAM, 1 CPU minimum)
- Coolify installed on your Droplet
- GitHub repository with your code

## Step 1: Install Coolify on Digital Ocean

1. Create a new Droplet in Digital Ocean (Ubuntu 22.04 LTS recommended)
2. SSH into your Droplet:
   ```bash
   ssh root@your-droplet-ip
   ```

3. Install Coolify:
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```

4. Wait for installation to complete and note the displayed credentials

5. Access Coolify at: `http://your-droplet-ip:3000`

## Step 2: Configure GitHub Integration

1. In Coolify dashboard, go to **Settings** → **GitHub**
2. Connect your GitHub account
3. Grant access to your `CCRentals` repository

## Step 3: Create New Application

1. Click **New Application** → **From Git**
2. Select your `CCRentals` repository
3. Select **main** branch
4. Configure build settings:

### Build Configuration

**Build Type:** Dockerfile

**Environment Variables:**
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

**Labels (if needed):**
```yaml
com.coolify.enable=true
```

## Step 4: Deployment Settings

### Basic Settings
- **Name:** ccrentals
- **Port:** 80

### Domain Settings
1. Add your domain (e.g., `coastalcleanrentals.com`)
2. Coolify will generate SSL certificates automatically

### Resource Limits (recommended)
- **CPU Limit:** 1 (or more for better performance)
- **Memory Limit:** 512MB
- **Memory Reservation:** 256MB

## Step 5: DNS Configuration

1. Go to your domain registrar (where you bought `coastalcleanrentals.com`)
2. Update DNS records:
   ```
   Type: A
   Name: @
   Value: your-droplet-ip
   TTL: 300

   Type: A
   Name: www
   Value: your-droplet-ip
   TTL: 300
   ```

3. Wait for DNS propagation (can take up to 48 hours, usually minutes)

## Step 6: Deploy

1. Click **Deploy** button in Coolify
2. Wait for build to complete (~2-3 minutes)
3. Access your site at `https://coastalcleanrentals.com`

## Troubleshooting

### Check Logs
In Coolify dashboard → Your Application → **Logs**

### SSH into Droplet
```bash
ssh root@your-droplet-ip
cd /data/coolify/source/ccrentals
docker logs -f ccrentals
```

### Rebuild Image
In Coolify dashboard → Your Application → **Settings** → **Rebuild Image**

### Port Already in Use
If port 80 is used, change nginx port in `nginx.conf` and update Coolify port setting.

## Environment Variables Checklist

Required for production:
- ✅ `VITE_SUPABASE_URL` - Your Supabase project URL
- ✅ `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

Optional (for features):
- `GEMINI_API_KEY` - For AI features
- `RESEND_API_KEY` - For email notifications
- `BUSINESS_EMAIL` - Contact email

## Cost Estimate (Digital Ocean)

- Droplet (2GB RAM, 1 CPU, 50GB SSD): $24/month
- Bandwidth: 1TB/month included
- Additional bandwidth: $0.01/GB

**Total:** ~$24/month

Alternative: Use a 1GB RAM Droplet for $6/month (smaller sites only)
