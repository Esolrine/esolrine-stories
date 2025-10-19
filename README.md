# Esolrine Stories Website

A minimalist blog website for reading short stories from the Esolrine webtoon universe. Features a custom admin panel for managing stories with a WYSIWYG editor.

## Features

- **Public Site**
  - Mobile-first, minimalist design with Solarpunk aesthetic
  - Story listing with cover images, tags, and excerpts
  - Individual story reading pages
  - SEO optimized (Open Graph, Twitter Cards, sitemap)
  - Social media links

- **Admin Panel**
  - GitHub OAuth authentication
  - WYSIWYG editor (Tiptap) with image upload support
  - Story CRUD operations
  - Metadata management (title, excerpt, cover image, tags, publish date, draft/published status)
  - Image hosting via Vercel Blob Storage

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Editor**: Tiptap
- **Authentication**: NextAuth.js with GitHub OAuth
- **Database**: Vercel Postgres
- **Storage**: Vercel Blob Storage
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- A Vercel account
- A GitHub account

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Esolrine Admin (or any name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID**
6. Generate a new **Client Secret** and copy it

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Fill in the following variables:

```env
# Database (leave empty for now, will be added after Vercel setup)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NO_SSL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Blob Storage (leave empty for now, will be added after Vercel setup)
BLOB_READ_WRITE_TOKEN=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl

# GitHub OAuth (from step 2)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Admin GitHub username (your GitHub username)
ADMIN_GITHUB_USERNAME=your-github-username
```

To generate `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the public site.

**Note**: You won't be able to access the admin panel or create stories until you set up Vercel Postgres and Blob Storage.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
5. Click "Deploy"

### 3. Set Up Vercel Postgres

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database"
3. Select "Postgres"
4. Follow the prompts to create the database
5. Go to the ".env.local" tab in your database settings
6. Copy all the `POSTGRES_*` environment variables
7. Go to your project settings → Environment Variables
8. Add each `POSTGRES_*` variable

### 4. Set Up Vercel Blob Storage

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database"
3. Select "Blob"
4. Follow the prompts to create the blob storage
5. Copy the `BLOB_READ_WRITE_TOKEN` variable
6. Add it to your project's environment variables

### 5. Update GitHub OAuth App

1. Go back to your GitHub OAuth App settings
2. Update the callback URL to: `https://your-vercel-domain.vercel.app/api/auth/callback/github`
3. You can add multiple callback URLs (keep localhost for development)

### 6. Add Remaining Environment Variables

In Vercel project settings → Environment Variables, add:

```
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your-generated-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
ADMIN_GITHUB_USERNAME=your-github-username
```

### 7. Redeploy

After adding environment variables, trigger a new deployment or wait for automatic deployment on push.

### 8. Initialize Database

Visit `https://your-vercel-domain.vercel.app/api/setup` to create the database table. You should see:

```json
{"message": "Database initialized successfully"}
```

**Important**: You can delete the `/app/api/setup/route.ts` file after running it for security.

## Using the Admin Panel

1. Visit `https://your-domain.com/admin`
2. Click "Sign in with GitHub"
3. Authorize the application
4. You'll be redirected to the admin dashboard
5. Click "New Story" to create your first story

## Customization

### Update Social Media Links

Edit `components/SocialLinks.tsx` and replace the placeholder URLs with your actual social media links.

### Change Site Metadata

Update the metadata in `app/layout.tsx` to customize the site title, description, and Open Graph images.

### Styling

The site uses Tailwind CSS. You can customize colors and styles in `tailwind.config.ts` or by editing the component classes.

## Project Structure

```
esolrine-website/
├── app/
│   ├── admin/           # Admin panel pages
│   ├── api/             # API routes
│   ├── stories/         # Public story pages
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Homepage
│   ├── robots.ts        # Robots.txt
│   └── sitemap.ts       # Dynamic sitemap
├── components/
│   ├── admin/           # Admin-specific components
│   ├── editor/          # WYSIWYG editor
│   ├── SessionProvider.tsx
│   └── SocialLinks.tsx
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── blob.ts          # Blob storage utilities
│   ├── db.ts            # Database functions
│   └── session.ts       # Session utilities
└── middleware.ts        # Route protection
```

## Troubleshooting

### "Unauthorized" errors in admin panel
- Make sure `ADMIN_GITHUB_USERNAME` matches your exact GitHub username
- Try signing out and signing in again

### Database connection errors
- Verify all `POSTGRES_*` environment variables are set
- Make sure you've run the setup endpoint

### Image upload errors
- Verify `BLOB_READ_WRITE_TOKEN` is set correctly
- Check file size (max 5MB) and type (JPEG, PNG, GIF, WebP only)

## License

MIT