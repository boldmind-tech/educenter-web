#!/usr/bin/env node

/**
 * BoldMind Ecosystem — Icon & Social Asset Generator
 * ────────────────────────────────────────────────────
 * Generates from your logo:
 *   • All favicon sizes (16–512)
 *   • Apple touch icon
 *   • Android / PWA icons
 *   • Windows tile icons
 *   • browserconfig.xml
 *   • site.webmanifest
 *   • favicon.ico (multi-size)
 *
 * Generates from your social banner:
 *   • OG image (1200×630)
 *   • Twitter card (1500×500)
 *   • WhatsApp preview (1080×608)
 *   • LinkedIn banner (1128×191)
 *
 * Usage:
 *   node generate-assets.js \
 *     --logo ./planai-logo.png \
 *     --banner ./planai-banner.png \
 *     --brand planai \
 *     --color "#5B21B6" \
 *     --name "PlanAI by BoldMind" \
 *     --url "https://planai.boldmind.ng" \
 *     --desc "AI business tools for Nigerian entrepreneurs" \
 *     --out ./public
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ─── Parse CLI args ───────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i += 2) {
    result[args[i].replace('--', '')] = args[i + 1];
  }
  return result;
}

const args = parseArgs();

const CONFIG = {
  logo:   args.logo   || './public/logo.png',
  banner: args.banner || './public/socail-media-banner.png',
  brand:  args.brand  || 'educenter',
  color:  args.color  || '#1E40AF', 
  name:   args.name   || 'EduCenter NG',
  url:    args.url    || 'https://educenter.com.ng',
  desc:   args.desc   || 'Pass exams. Build business. Master AI.',
  out:    args.out    || './public',
};

// ─── Icon size definitions ────────────────────────────────────────────────────

const FAVICON_SIZES = [16, 32, 48, 64, 96, 128, 256];

const PWA_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

const APPLE_SIZES = [57, 60, 72, 76, 114, 120, 144, 152, 167, 180];

const WINDOWS_TILES = [
  { size: 70,  name: 'mstile-70x70'   },
  { size: 144, name: 'mstile-144x144' },
  { size: 150, name: 'mstile-150x150' },
  { size: 310, name: 'mstile-310x310' },
];

const SOCIAL_SIZES = [
  { w: 1200, h: 630,  name: 'og-image',        label: 'Open Graph (Facebook/LinkedIn)' },
  { w: 1500, h: 500,  name: 'twitter-card',     label: 'Twitter/X Card'                },
  { w: 1080, h: 608,  name: 'whatsapp-preview', label: 'WhatsApp Preview'              },
  { w: 1128, h: 191,  name: 'linkedin-banner',  label: 'LinkedIn Company Banner'       },
  { w: 820,  h: 312,  name: 'facebook-cover',   label: 'Facebook Cover'                },
  { w: 2560, h: 1440, name: 'youtube-art',       label: 'YouTube Channel Art'           },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function log(icon, msg) {
  console.log(`${icon}  ${msg}`);
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Make a rounded square background with the brand color
// Used when padding icons for Windows tiles
async function makeBackground(size, hexColor) {
  const { r, g, b } = hexToRgb(hexColor);
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r, g, b, alpha: 1 },
    },
  }).png().toBuffer();
}

// ─── ICO file builder ─────────────────────────────────────────────────────────
// Builds a proper multi-size .ico from PNG buffers

async function buildIco(pngBuffers) {
  // ICO header: ICONDIR
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = headerSize + numImages * dirEntrySize;

  // Calculate offsets
  let offset = dirSize;
  const entries = [];
  for (const buf of pngBuffers) {
    const img = sharp(buf);
    const meta = await img.metadata();
    const w = meta.width > 255 ? 0 : meta.width;   // 0 means 256 in ICO spec
    const h = meta.height > 255 ? 0 : meta.height;
    entries.push({ w, h, buf, offset });
    offset += buf.length;
  }

  // Write ICO header
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);         // Reserved
  header.writeUInt16LE(1, 2);         // Type: ICO
  header.writeUInt16LE(numImages, 4); // Number of images

  // Write directory entries
  const dir = Buffer.alloc(numImages * dirEntrySize);
  entries.forEach((e, i) => {
    const base = i * dirEntrySize;
    dir.writeUInt8(e.w, base);          // Width (0 = 256)
    dir.writeUInt8(e.h, base + 1);      // Height (0 = 256)
    dir.writeUInt8(0, base + 2);        // Color palette count
    dir.writeUInt8(0, base + 3);        // Reserved
    dir.writeUInt16LE(1, base + 4);     // Color planes
    dir.writeUInt16LE(32, base + 6);    // Bits per pixel
    dir.writeUInt32LE(e.buf.length, base + 8);  // Size of image data
    dir.writeUInt32LE(e.offset, base + 12);     // Offset to image data
  });

  return Buffer.concat([header, dir, ...entries.map(e => e.buf)]);
}

// ─── Main generator ───────────────────────────────────────────────────────────

async function generate() {
  console.log('\n🚀 BoldMind Asset Generator');
  console.log('─'.repeat(50));
  console.log(`Brand:   ${CONFIG.name}`);
  console.log(`Logo:    ${CONFIG.logo}`);
  console.log(`Banner:  ${CONFIG.banner || 'none (will use logo)'}`);
  console.log(`Color:   ${CONFIG.color}`);
  console.log(`Output:  ${CONFIG.out}`);
  console.log('─'.repeat(50) + '\n');

  if (!fs.existsSync(CONFIG.logo)) {
    console.error(`❌ Logo file not found: ${CONFIG.logo}`);
    process.exit(1);
  }

  // Create output directories
  const dirs = {
    root:    CONFIG.out,
    icons:   path.join(CONFIG.out, 'icons'),
    apple:   path.join(CONFIG.out, 'icons', 'apple'),
    pwa:     path.join(CONFIG.out, 'icons', 'pwa'),
    windows: path.join(CONFIG.out, 'icons', 'windows'),
    social:  path.join(CONFIG.out, 'social'),
  };

  Object.values(dirs).forEach(ensureDir);

  const logoBuffer = fs.readFileSync(CONFIG.logo);
  const logoMeta = await sharp(logoBuffer).metadata();
  log('📐', `Logo loaded: ${logoMeta.width}×${logoMeta.height}px ${logoMeta.format}`);

  // ── 1. FAVICON SIZES ──────────────────────────────────────────────────────

  log('\n📁', 'Generating favicon sizes...');
  const faviconBuffers = [];

  for (const size of FAVICON_SIZES) {
    const buf = await sharp(logoBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    const outPath = path.join(dirs.icons, `favicon-${size}x${size}.png`);
    fs.writeFileSync(outPath, buf);
    log('  ✓', `favicon-${size}x${size}.png`);

    if ([16, 32, 48].includes(size)) {
      faviconBuffers.push(buf);
    }
  }

  // ── 2. FAVICON.ICO (16 + 32 + 48) ────────────────────────────────────────

  log('\n🔖', 'Building favicon.ico (16 + 32 + 48px)...');
  const icoBuffer = await buildIco(faviconBuffers);
  const icoPath = path.join(dirs.root, 'favicon.ico');
  fs.writeFileSync(icoPath, icoBuffer);
  log('  ✓', 'favicon.ico');

  // Also copy 32px as the standard favicon.png
  const favicon32 = await sharp(logoBuffer)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(dirs.root, 'favicon.png'), favicon32);
  log('  ✓', 'favicon.png (32px)');

  // ── 3. APPLE TOUCH ICONS ──────────────────────────────────────────────────

  log('\n🍎', 'Generating Apple touch icons...');

  for (const size of APPLE_SIZES) {
    // Apple icons: square, NO transparency — use brand color background
    const bg = await makeBackground(size, CONFIG.color);
    const logo = await sharp(logoBuffer)
      .resize(Math.round(size * 0.75), Math.round(size * 0.75), {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    const composed = await sharp(bg)
      .composite([{
        input: logo,
        gravity: 'center',
      }])
      .png()
      .toBuffer();

    const name = size === 180
      ? 'apple-touch-icon.png'
      : `apple-touch-icon-${size}x${size}.png`;

    fs.writeFileSync(path.join(dirs.apple, name), composed);

    // Also copy the main apple-touch-icon to root
    if (size === 180) {
      fs.writeFileSync(path.join(dirs.root, 'apple-touch-icon.png'), composed);
    }

    log('  ✓', name);
  }

  // ── 4. PWA / ANDROID ICONS ────────────────────────────────────────────────

  log('\n🤖', 'Generating PWA / Android icons...');

  for (const size of PWA_SIZES) {
    // Maskable version: logo at 80% size with brand color bg + safe zone
    const bg = await makeBackground(size, CONFIG.color);
    const logoSize = Math.round(size * 0.7);
    const logo = await sharp(logoBuffer)
      .resize(logoSize, logoSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    const maskable = await sharp(bg)
      .composite([{ input: logo, gravity: 'center' }])
      .png()
      .toBuffer();

    // Transparent version
    const transparent = await sharp(logoBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(dirs.pwa, `icon-${size}x${size}.png`), transparent);
    fs.writeFileSync(path.join(dirs.pwa, `icon-${size}x${size}-maskable.png`), maskable);

    // Copy key sizes to root icons dir
    if (size === 192 || size === 512) {
      fs.writeFileSync(
        path.join(dirs.root, `icon-${size}x${size}.png`),
        transparent
      );
      fs.writeFileSync(
        path.join(dirs.root, `icon-${size}x${size}-maskable.png`),
        maskable
      );
    }

    log('  ✓', `icon-${size}x${size}.png + maskable`);
  }

  // ── 5. WINDOWS TILE ICONS + browserconfig.xml ────────────────────────────

  log('\n🪟', 'Generating Windows tile icons...');

  for (const tile of WINDOWS_TILES) {
    const bg = await makeBackground(tile.size, CONFIG.color);
    const logoSize = Math.round(tile.size * 0.6);
    const logo = await sharp(logoBuffer)
      .resize(logoSize, logoSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    const composed = await sharp(bg)
      .composite([{ input: logo, gravity: 'center' }])
      .png()
      .toBuffer();

    fs.writeFileSync(
      path.join(dirs.windows, `${tile.name}.png`),
      composed
    );
    log('  ✓', `${tile.name}.png`);
  }

  // Special: 310x150 wide tile
  const wideBg = await sharp({
    create: {
      width: 310, height: 150, channels: 4,
      background: hexToRgb(CONFIG.color),
    },
  }).png().toBuffer();
  const wideLogo = await sharp(logoBuffer)
    .resize(100, 100, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const wideTile = await sharp(wideBg)
    .composite([{ input: wideLogo, gravity: 'center' }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(dirs.windows, 'mstile-310x150.png'), wideTile);
  log('  ✓', 'mstile-310x150.png');

  // Write browserconfig.xml
  const { r, g, b } = hexToRgb(CONFIG.color);
  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');

  const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/icons/windows/mstile-70x70.png"/>
      <square150x150logo src="/icons/windows/mstile-150x150.png"/>
      <wide310x150logo src="/icons/windows/mstile-310x150.png"/>
      <square310x310logo src="/icons/windows/mstile-310x310.png"/>
      <TileColor>#${rHex}${gHex}${bHex}</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

  fs.writeFileSync(path.join(dirs.root, 'browserconfig.xml'), browserconfig);
  log('  ✓', 'browserconfig.xml');

  // ── 6. SITE.WEBMANIFEST ───────────────────────────────────────────────────

  log('\n📋', 'Generating site.webmanifest...');

  const manifest = {
    name: CONFIG.name,
    short_name: CONFIG.brand.toUpperCase(),
    description: CONFIG.desc,
    start_url: '/',
    display: 'standalone',
    background_color: CONFIG.color,
    theme_color: CONFIG.color,
    orientation: 'portrait-primary',
    icons: [
      ...PWA_SIZES.map(size => ([
        {
          src: `/icons/pwa/icon-${size}x${size}.png`,
          sizes: `${size}x${size}`,
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: `/icons/pwa/icon-${size}x${size}-maskable.png`,
          sizes: `${size}x${size}`,
          type: 'image/png',
          purpose: 'maskable',
        },
      ])).flat(),
    ],
    shortcuts: [
      {
        name: `Open ${CONFIG.name}`,
        url: '/',
        icons: [{ src: '/icons/pwa/icon-192x192.png', sizes: '192x192' }],
      },
    ],
  };

  fs.writeFileSync(
    path.join(dirs.root, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
  log('  ✓', 'site.webmanifest');

  // ── 7. SOCIAL / OG IMAGES ────────────────────────────────────────────────

  const sourceImage = CONFIG.banner && fs.existsSync(CONFIG.banner)
    ? CONFIG.banner
    : CONFIG.logo;

  const sourceLabel = CONFIG.banner && fs.existsSync(CONFIG.banner)
    ? 'banner' : 'logo (no banner provided — using logo)';

  log(`\n📸`, `Generating social images from ${sourceLabel}...`);

  const sourceBuf = fs.readFileSync(sourceImage);
  const sourceMeta = await sharp(sourceBuf).metadata();

  for (const social of SOCIAL_SIZES) {
    let result;

    if (sourceMeta.width >= social.w && sourceMeta.height >= social.h) {
      // Source is large enough — crop/cover
      result = await sharp(sourceBuf)
        .resize(social.w, social.h, {
          fit: 'cover',
          position: 'centre',
        })
        .jpeg({ quality: 95, mozjpeg: true })
        .toBuffer();
    } else {
      // Source too small — place on brand color background
      const bg = await sharp({
        create: {
          width: social.w,
          height: social.h,
          channels: 4,
          background: { ...hexToRgb(CONFIG.color), alpha: 1 },
        },
      }).png().toBuffer();

      const logoW = Math.min(sourceMeta.width, Math.round(social.h * 0.7));
      const logoH = Math.round(logoW * (sourceMeta.height / sourceMeta.width));

      const logo = await sharp(sourceBuf)
        .resize(logoW, logoH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();

      result = await sharp(bg)
        .composite([{ input: logo, gravity: 'centre' }])
        .jpeg({ quality: 95, mozjpeg: true })
        .toBuffer();
    }

    const outPath = path.join(dirs.social, `${social.name}.jpg`);
    fs.writeFileSync(outPath, result);
    log('  ✓', `${social.name}.jpg  (${social.w}×${social.h}) — ${social.label}`);
  }

  // Also export a WebP og-image for modern browsers
  const ogBuf = fs.readFileSync(path.join(dirs.social, 'og-image.jpg'));
  const ogWebP = await sharp(ogBuf).webp({ quality: 92 }).toBuffer();
  fs.writeFileSync(path.join(dirs.social, 'og-image.webp'), ogWebP);
  log('  ✓', 'og-image.webp (WebP version for modern browsers)');

  // ── 8. META TAGS SNIPPET ─────────────────────────────────────────────────

  log('\n📝', 'Generating meta tags snippet...');

  const metaSnippet = `<!-- ═══════════════════════════════════════════════════════
     ${CONFIG.name} — Meta & Icon Tags
     Generated by BoldMind Asset Generator
     ═══════════════════════════════════════════════════════ -->

<!-- ── Charset & Viewport ── -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />

<!-- ── Primary Meta ── -->
<meta name="application-name" content="${CONFIG.name}" />
<meta name="description" content="${CONFIG.desc}" />
<meta name="theme-color" content="${CONFIG.color}" />
<meta name="msapplication-TileColor" content="${CONFIG.color}" />
<meta name="msapplication-config" content="/browserconfig.xml" />

<!-- ── Favicon ── -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />

<!-- ── Apple Touch Icons ── -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="apple-touch-icon" sizes="57x57"   href="/icons/apple/apple-touch-icon-57x57.png" />
<link rel="apple-touch-icon" sizes="60x60"   href="/icons/apple/apple-touch-icon-60x60.png" />
<link rel="apple-touch-icon" sizes="72x72"   href="/icons/apple/apple-touch-icon-72x72.png" />
<link rel="apple-touch-icon" sizes="76x76"   href="/icons/apple/apple-touch-icon-76x76.png" />
<link rel="apple-touch-icon" sizes="114x114" href="/icons/apple/apple-touch-icon-114x114.png" />
<link rel="apple-touch-icon" sizes="120x120" href="/icons/apple/apple-touch-icon-120x120.png" />
<link rel="apple-touch-icon" sizes="144x144" href="/icons/apple/apple-touch-icon-144x144.png" />
<link rel="apple-touch-icon" sizes="152x152" href="/icons/apple/apple-touch-icon-152x152.png" />
<link rel="apple-touch-icon" sizes="167x167" href="/icons/apple/apple-touch-icon-167x167.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple/apple-touch-icon-180x180.png" />

<!-- ── PWA Manifest ── -->
<link rel="manifest" href="/site.webmanifest" />

<!-- ── Open Graph / Facebook / LinkedIn ── -->
<meta property="og:type"        content="website" />
<meta property="og:url"         content="${CONFIG.url}" />
<meta property="og:site_name"   content="${CONFIG.name}" />
<meta property="og:title"       content="${CONFIG.name}" />
<meta property="og:description" content="${CONFIG.desc}" />
<meta property="og:image"       content="${CONFIG.url}/social/og-image.jpg" />
<meta property="og:image:width"  content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt"   content="${CONFIG.name} — ${CONFIG.desc}" />
<meta property="og:locale"      content="en_NG" />

<!-- ── Twitter / X Card ── -->
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:site"        content="@${CONFIG.brand}NG" />
<meta name="twitter:creator"     content="@boldmindng" />
<meta name="twitter:title"       content="${CONFIG.name}" />
<meta name="twitter:description" content="${CONFIG.desc}" />
<meta name="twitter:image"       content="${CONFIG.url}/social/twitter-card.jpg" />

<!-- ── WhatsApp Preview (uses OG) ── -->
<!-- WhatsApp reads og:image — no extra tags needed -->

<!-- ── Windows Tiles ── -->
<meta name="msapplication-square70x70logo"   content="/icons/windows/mstile-70x70.png" />
<meta name="msapplication-square150x150logo" content="/icons/windows/mstile-150x150.png" />
<meta name="msapplication-wide310x150logo"   content="/icons/windows/mstile-310x150.png" />
<meta name="msapplication-square310x310logo" content="/icons/windows/mstile-310x310.png" />
`;

  fs.writeFileSync(path.join(dirs.root, 'meta-tags.html'), metaSnippet);
  log('  ✓', 'meta-tags.html (paste into your <head>)');

  // ── 9. NEXT.JS METADATA EXPORT ───────────────────────────────────────────

  log('\n⚡', 'Generating Next.js metadata export...');

  const nextMeta = `// Generated by BoldMind Asset Generator
// Paste into your app/layout.tsx or app/[page]/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('${CONFIG.url}'),
  title: {
    default: '${CONFIG.name}',
    template: \`%s | ${CONFIG.name}\`,
  },
  description: '${CONFIG.desc}',
  applicationName: '${CONFIG.name}',
  keywords: ['Nigeria', '${CONFIG.brand}', 'BoldMind', 'Nigerian entrepreneur'],
  authors: [{ name: 'BoldMind Technology', url: 'https://boldmind.ng' }],
  creator: 'BoldMind Technology',
  publisher: 'BoldMind Technology',
  
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/icons/apple/apple-touch-icon-152x152.png', sizes: '152x152' },
      { url: '/icons/apple/apple-touch-icon-167x167.png', sizes: '167x167' },
      { url: '/icons/apple/apple-touch-icon-180x180.png', sizes: '180x180' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/favicon-96x96.png' },
    ],
  },

  manifest: '/site.webmanifest',

  openGraph: {
    type: 'website',
    url: '${CONFIG.url}',
    siteName: '${CONFIG.name}',
    title: '${CONFIG.name}',
    description: '${CONFIG.desc}',
    locale: 'en_NG',
    images: [
      {
        url: '/social/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '${CONFIG.name}',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@${CONFIG.brand}NG',
    creator: '@BoldMindNG',
    title: '${CONFIG.name}',
    description: '${CONFIG.desc}',
    images: ['/social/twitter-card.jpg'],
  },

  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '${CONFIG.color}' },
    { media: '(prefers-color-scheme: dark)',  color: '${CONFIG.color}' },
  ],

  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};
`;

  fs.writeFileSync(path.join(dirs.root, 'metadata.ts'), nextMeta);
  log('  ✓', 'metadata.ts (Next.js App Router metadata export)');

  // ── 10. SUMMARY REPORT ───────────────────────────────────────────────────

  const totalFiles = [
    ...FAVICON_SIZES,
    ...APPLE_SIZES,
    ...PWA_SIZES.flatMap(s => [s, s]), // both versions
    ...WINDOWS_TILES, 1,               // tiles + wide
    ...SOCIAL_SIZES, 1,               // + webp
    4,                                 // ico, png, manifest, browserconfig
    2,                                 // meta tags, next metadata
  ].length;

  console.log('\n' + '═'.repeat(50));
  console.log(`✅  Done! ${CONFIG.name} assets generated.`);
  console.log('═'.repeat(50));
  console.log(`\n📂 Output structure:\n`);
  console.log(`${CONFIG.out}/`);
  console.log(`  ├── favicon.ico                    ← multi-size (16+32+48)`);
  console.log(`  ├── favicon.png                    ← 32×32`);
  console.log(`  ├── apple-touch-icon.png           ← 180×180`);
  console.log(`  ├── icon-192x192.png               ← PWA`);
  console.log(`  ├── icon-512x512.png               ← PWA`);
  console.log(`  ├── icon-192x192-maskable.png      ← PWA maskable`);
  console.log(`  ├── icon-512x512-maskable.png      ← PWA maskable`);
  console.log(`  ├── site.webmanifest               ← PWA manifest`);
  console.log(`  ├── browserconfig.xml              ← Windows tiles`);
  console.log(`  ├── meta-tags.html                 ← paste into <head>`);
  console.log(`  ├── metadata.ts                    ← Next.js export`);
  console.log(`  ├── icons/`);
  console.log(`  │   ├── favicon-16x16.png → 256x256`);
  console.log(`  │   ├── apple/ (all Apple sizes)`);
  console.log(`  │   ├── pwa/   (all PWA sizes + maskable)`);
  console.log(`  │   └── windows/ (all tile sizes)`);
  console.log(`  └── social/`);
  console.log(`      ├── og-image.jpg               ← 1200×630`);
  console.log(`      ├── og-image.webp              ← WebP version`);
  console.log(`      ├── twitter-card.jpg           ← 1500×500`);
  console.log(`      ├── whatsapp-preview.jpg       ← 1080×608`);
  console.log(`      ├── linkedin-banner.jpg        ← 1128×191`);
  console.log(`      ├── facebook-cover.jpg         ← 820×312`);
  console.log(`      └── youtube-art.jpg            ← 2560×1440`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Copy everything in ${CONFIG.out}/ into your Next.js /public folder`);
  console.log(`   2. Import metadata.ts into your app/layout.tsx`);
  console.log(`   3. The meta-tags.html is for non-Next.js apps — paste into <head>`);
  console.log(`\n`);
}

generate().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});