# Deployment ke Vercel

Panduan ini menjelaskan cara mendeploy Briefly ke Vercel.

## Prasyarat

- Akun GitHub dengan repository project
- Akun Vercel (daftar di https://vercel.com)

## Langkah-Langkah Deployment

### 1. Push ke GitHub

Pastikan semua perubahan sudah di-commit ke GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy ke Vercel

#### Opsi A: Menggunakan Vercel Dashboard

1. Buka https://vercel.com/dashboard
2. Klik "Add New..." → "Project"
3. Import repository GitHub Briefly
4. Vercel akan otomatis mendeteksi Next.js
5. Klik "Deploy"

#### Opsi B: Menggunakan Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Untuk production
vercel --prod
```

### 3. Konfigurasi Environment Variables (Opsional)

Jika menggunakan Giscus untuk comments:

1. Di Vercel Dashboard, buka project Briefly
2. Pergi ke Settings → Environment Variables
3. Tambahkan variabel berikut jika diperlukan:
   - `NEXT_PUBLIC_GISCUS_REPO_ID`
   - `NEXT_PUBLIC_GISCUS_CATEGORY_ID`
   - `NEXT_PUBLIC_GISCUS_CATEGORY`

### 4. Domain Custom (Opsional)

1. Di project Vercel, buka Settings → Domains
2. Tambahkan domain custom Anda
3. Ikuti instruksi DNS configuration

## Build Success Indicators

Deployment berhasil jika Anda melihat:

✅ Build log: "✓ Compiled successfully"  
✅ TypeScript: "✓ Finished TypeScript in X.Xs"  
✅ Static generation: "✓ Generating static pages"  
✅ Production URL aktif dengan HTTPS

## Troubleshooting

### Build Failure

Jika deployment gagal:

1. Cek build log di Vercel Dashboard
2. Pastikan `npm run build` berjalan lancar lokal:
   ```bash
   npm run build
   npm start
   ```
3. Periksa TypeScript errors: `npx tsc --noEmit`

### Environment Variables Error

Jika aplikasi tidak bisa mengakses environment variables:

1. Pastikan variabel dimulai dengan `NEXT_PUBLIC_` untuk client-side
2. Redeploy setelah mengubah environment variables
3. Clear cache browser

### Image Loading Issues

Jika gambar tidak muncul:

1. Remote patterns sudah diatur di `next.config.ts`
2. Check Network tab di DevTools
3. Verifikasi URL feed masih aktif

## Next Steps

Setelah deployment berhasil:

- Monitor performance di Vercel Analytics
- Setup custom domain untuk branding
- Configure email notifications untuk failed deploys
- Setup GitHub integration untuk automatic deploys on push

## Referensi

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
