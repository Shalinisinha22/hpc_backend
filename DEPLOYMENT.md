# Vercel Deployment Guide

## Prerequisites

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

## Environment Variables

Before deploying, you need to set up the following environment variables in Vercel:

- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key
- `NODE_ENV` - Set to "production"

You can set these either through the Vercel dashboard or using the CLI:

```bash
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add NODE_ENV
```

## Deployment Steps

1. Navigate to your project directory:
   ```bash
   cd c:\HPC\hpc_back
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (for first deployment)
   - What's your project's name? **hpc-back** (or your preferred name)
   - In which directory is your code located? **./**

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Configuration Files Created

- `vercel.json` - Vercel configuration
- `api/index.ts` - Serverless function entry point
- `.vercelignore` - Files to exclude from deployment

## API Endpoints

After deployment, your API will be available at:
- `https://your-project.vercel.app/api/v1/users`
- `https://your-project.vercel.app/api/v1/rooms`
- `https://your-project.vercel.app/api/v1/bookings`
- And all other endpoints...

## Notes

- The app is configured to work in serverless environment
- Database connections are handled per request
- CORS is configured for production domains