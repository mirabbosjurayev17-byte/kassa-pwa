# Kassa — Claude Code Build Spec

> Bu spec Claude Code uchun. Loyihani noldan quradi, bu hujjat — yagona manba. Boshqa joydan ko'rsatma olmaysan.

---

## 1. Context & subject

**Mahsulot:** Kassa — kunlik savdo va xarajat trackeri PWA.

**Foydalanuvchi:** Do'kon, kafe, ustaxona egasi (30–55 yosh). Excel va daftarni almashtirmoqchi. Telefonda kun yakunida raqam kiritadi. Oy oxirida desktop'da analytics ko'radi.

**Markaziy ish:** Egasi har kuni kechqurun 2-3 ta raqam kiritadi (bugungi savdo, xarajat), oy oxirida sof foyda va dinamikani ko'radi.

**Eslatma:** Bu portfolio demo — backend yo'q, localStorage'da yashaydi, lekin **real ishlaydi**. Foydalanuvchi raqam kiritsa, saqlanadi, grafiklar yangilanadi.

---

## 2. Design tokens

### 2.1 Palette

Image 5'dagi Satoshi palitra asos qilib olingan, lekin neytral oraliq tonlar qo'shilgan (chunki 5 ta ko'k yetmaydi UI uchun).

```ts
// tailwind.config.ts colors
{
  // Neytrallar (foydalanuvchi ko'p ko'radi)
  base:    '#F8FAFC',  // sahifa foni — sof oq emas, ko'k tinge bilan
  surface: '#FFFFFF',  // card
  ink:     '#0F172A',  // asosiy matn, xarajat raqami
  mute:    '#64748B',  // ikkilamchi matn
  border:  '#E2E8F0',  // hairline
  subtle:  '#F1F5F9',  // hover, tag fon

  // Brand (ishlatilishi cheklangan — restraint)
  blue: {
    DEFAULT: '#0077CC',   // asosiy accent — CTA, savdo, brand
    light:   '#0EA5E9',   // chart highlight, bugungi kun
    dark:    '#004A80',   // chart base, deep emphasis
    pale:    '#E0F2FE',   // bg tints, success badge
  },
}
```

**Rang mantiqi (MUHIM — bu loyihaning xarakteri):**
- Savdo (income) = **blue** (#0077CC) — brand rang, ijobiy
- Xarajat (expense) = **ink** (#0F172A) — qora, neytral og'irlik
- Fintech klishesi (yashil/qizil) ishlatmaymiz — butun app ko'k brand'da yashaydi
- Grafiklar uchun 3 ta ko'k ton bor (light → DEFAULT → dark)

### 2.2 Typography

**Font:** Satoshi (bitta, butun app uchun). Fontshare CDN orqali:

```html
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap">
```

Yoki Next.js `next/font` orqali (afzal):

```ts
import localFont from 'next/font/local'

const satoshi = localFont({
  src: [
    { path: './fonts/Satoshi-Regular.woff2', weight: '400' },
    { path: './fonts/Satoshi-Medium.woff2', weight: '500' },
    { path: './fonts/Satoshi-Bold.woff2', weight: '700' },
    { path: './fonts/Satoshi-Black.woff2', weight: '900' },
  ],
  variable: '--font-satoshi',
})
```

**Type scale:**

| Rol | Class | Wazn | Misol |
|---|---|---|---|
| Display (signature raqam) | `text-5xl lg:text-6xl` | 900 | "1 847 000" |
| H1 | `text-3xl` | 900 | "Bosh sahifa" |
| H2 | `text-lg` | 700 | "Bu hafta" |
| Body | `text-sm` | 500 | matn |
| Caption | `text-xs` | 500 | "Bugun, 19-iyun" |
| Eyebrow | `text-xs uppercase tracking-wide` | 700 | "BUGUNGI SOF FOYDA" |

**Raqamlar uchun majburiy:** `font-variant-numeric: tabular-nums` — kassa app'ida raqamlar ustun-ustun tekis turishi kerak. Tailwind class: `tabular-nums`.

### 2.3 Spacing, radius, shadow

```
Spacing: Tailwind default (4px grid)
Radius:
  - sm: 8px  (badge, pill)
  - md: 12px (button, input)
  - lg: 16px (card)
  - xl: 24px (hero card)
  - 2xl: 32px (modal)
Shadow:
  - Cheklangan ishlatish. Card'larda border ishlatamiz, soya emas.
  - Faqat FAB, modal va hover'da: shadow-lg shadow-blue/20
```

### 2.4 tailwind.config.ts — to'liq blok

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
      },
      colors: {
        base: '#F8FAFC',
        surface: '#FFFFFF',
        ink: '#0F172A',
        mute: '#64748B',
        border: '#E2E8F0',
        subtle: '#F1F5F9',
        blue: {
          DEFAULT: '#0077CC',
          light: '#0EA5E9',
          dark: '#004A80',
          pale: '#E0F2FE',
        },
      },
      borderRadius: {
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      },
    },
  },
  plugins: [],
} satisfies Config
```

---

## 3. Layout philosophy

### 3.1 Responsive strategiya

Bitta kod, ikki tajriba. Tailwind breakpoint'lari:

- **Mobile** (`<lg:1024px`) — kunlik tez kirit. Bottom nav. Single column. Hero card eng yuqorida.
- **Desktop** (`≥lg`) — oylik analytics. Sidebar nav. Multi-column grid. Ko'proq ma'lumot ekranida.

Bu **adaptive emas, contextual** — mobile'da kassa egasi raqam kiritmoqda (action), desktop'da analitika ko'rmoqda (insight). Shu sababli mobile va desktop layout'lari aynan bir xil bo'lishi shart emas, har biri o'z kontekstiga optimallashgan.

### 3.2 Grid mantiqi

Desktop'da KPI row uchun 4-column grid. Bosh sahifada bitta card 2 ta column oladi (hero foyda), qolganlari 1×1.

Mobile'da hammasi single column, lekin "bugungi savdo / xarajat" yonma-yon (2-col grid).

### 3.3 Signature element

**Bugungi sof foyda raqami.** Boshqa hech narsa shu darajada katta va og'ir bo'lmasligi kerak. Bu — har ekranda mavjud bo'lsa, asosiy raqam.

- Satoshi Black (900)
- `text-5xl` mobile, `text-6xl` desktop
- `tabular-nums`
- Tracking tight
- Ostida small label ("Bugungi sof foyda" eyebrow style)

Bu kassa egasining "telefonni ochishi bilan birinchi ko'radigan narsasi". Magazin muqovasidagi katta raqam mantiqi.

### 3.4 Restraint qoidasi

`frontend-design` skill'idan: **boldness'ni bir joyda sarflang**. Bizning bold joyimiz — Signature raqam. Qolgan hammasi quiet va disciplined:

- Soya yo'q (faqat hover'da)
- Gradient yo'q (faqat agar onboarding'da bitta dekoratif rasm bo'lsa)
- Ko'p rang yo'q — palette to'liq ko'k + neytral
- Animatsiya minimal — number count-up signature element uchun, qolgan joylarda 150ms hover transitions

---

## 4. Screen-by-screen spec

### 4.1 Onboarding (`/onboarding`)

3 ta slide, swipe yoki "Keyingi" tugma bilan o'tish. localStorage'da `onboarding_completed: true` bo'lsa, to'g'ridan-to'g'ri `/` ga yo'naltirish.

**Slide 1 — Hi:**
```
[ Bosh sahifa: signature raqam preview, ~ 3 200 000 so'm, animatsion ]

Kassa
Kunlik savdo va xarajat trackeri.

[Boshlash →]
```

**Slide 2 — Value:**
```
[ Wireframe: raqam kiritish form'i mockup ]

Kuniga 30 soniya.
Kechqurun bugungi savdo va xarajatni kiriting.
Oy oxirida foyda tayyor.

[Keyingi →]
```

**Slide 3 — Setup:**
```
Biznes nomingiz nima?
[input: "Olov Grill"]

Valyuta:
( ) so'm   ( ) USD

[Davom etish →]
```

Setup yakunida → localStorage'ga `business_name`, `currency`, `onboarding_completed` yoziladi → `/` ga redirect.

### 4.2 Bosh sahifa (`/`)

**Mobile wireframe:**
```
┌─────────────────────────────┐
│ Salom, Akmal                │
│ Olov Grill · Chilonzor      │  notif icon →
├─────────────────────────────┤
│                             │
│  BUGUNGI SOF FOYDA   ↑12.4% │
│                             │
│  1 847 000  so'm            │  ← signature
│                             │
│  Kechagiga +203 000         │
│ ─────────────────────────── │
│  ● Savdo      ● Xarajat     │
│  2 450 000    603 000       │
└─────────────────────────────┘

[+ Yangi yozuv qo'shish]   ← primary CTA

Bu hafta              [Hafta ▼]
┌─────────────────────────────┐
│ ▎▎▎▎▍▌▊ ← bar chart         │
│ Du Se Ch Pa Ju Sh Ya        │
└─────────────────────────────┘

Bugungi yozuvlar       Hammasi →
[card: Naqd savdo  +850 000]
[card: Halol Meat  −420 000]
[card: Click       +1 600 000]
...

[ Bottom nav: Bosh | Hisobot | (+) | Yozuvlar | Profil ]
```

**Desktop wireframe:**
```
┌──────────┬────────────────────────────────────────────────┐
│ [K]      │  Bosh sahifa                  [Hisobot] [+ Yangi]│
│ Kassa    │  Bugun, 19-iyun 2026                            │
│ Olov Grill│                                                 │
│          │ ┌──────────────┬──────────┬──────────┐          │
│ Bosh ●   │ │              │ Savdo    │ Xarajat  │          │
│ Hisobot  │ │ BUGUNGI SOF  │ 2.45M    │ 603K     │          │
│ Yozuvlar │ │ FOYDA  ↑12%  ├──────────┼──────────┤          │
│ Kategor. │ │              │ Av.chek  │ Marjin   │          │
│ Xodimlar │ │ 1 847 000    │ 87 500   │ 75.4%    │          │
│          │ │ so'm         │          │          │          │
│ ────────  │ │              ├──────────┴──────────┤          │
│ Sozlamalar│ │ Oylik prognoz: 48.2M so'm           │          │
│          │ └──────────────┴─────────────────────┘          │
│          │                                                  │
│          │ ┌──────────────────────┬──────────────┐         │
│          │ │ Savdo va xarajat     │ Bugungi      │         │
│          │ │ ┌─┐                  │ yozuvlar     │         │
│          │ │ │ │ ┌─┐  ┌─┐         │              │         │
│          │ │ │ │ │ │  │█│   chart │ list of      │         │
│          │ │ │ │ │ │  │█│         │ 5 items      │         │
│          │ │ Du Se Ch Pa Ju Sh Ya │              │         │
│          │ └──────────────────────┴──────────────┘         │
└──────────┴────────────────────────────────────────────────┘
```

**Komponentlar:**
- `<KpiHeroCard>` — signature foyda raqami
- `<KpiCard>` — kichik metrika (savdo, xarajat, marjin)
- `<WeeklyChart>` — bar chart (mobile va desktop'da har xil o'lcham)
- `<TransactionItem>` — bitta yozuv satri
- `<MobileBottomNav>`, `<DesktopSidebar>`

### 4.3 Yangi yozuv (`/transactions/new`)

Mobile-first form. Desktop'da modal sifatida ochiladi.

```
┌─────────────────────────────┐
│ ←  Yangi yozuv              │
├─────────────────────────────┤
│                             │
│  Turi                       │
│  [ SAVDO ]  [ Xarajat ]     │  ← pill toggle, blue selected
│                             │
│  Summa                      │
│  ┌─────────────────────────┐│
│  │  500 000                ││  ← katta input, tabular-nums
│  │  so'm                   ││
│  └─────────────────────────┘│
│  [+10K] [+50K] [+100K] [+500K] ← quick amount chips
│                             │
│  Kategoriya                 │
│  [Naqd ●] [Click] [Payme] [Boshqa]
│                             │
│  Izoh (ixtiyoriy)           │
│  [textarea]                 │
│                             │
│  Sana va vaqt               │
│  [Bugun, 19:42]             │
│                             │
└─────────────────────────────┘
        [Saqlash]   ← sticky bottom button
```

**Interactions:**
- Summa input fokus bo'lganda numeric keyboard (mobile)
- Quick amount chips bosish summaga qo'shadi
- Kategoriya — gorizontal scroll qilinadigan chip ro'yxat
- Saqlash → toast "Yozuv qo'shildi" → `/` ga qaytish

### 4.4 Yozuvlar tarixi (`/transactions`)

```
┌─────────────────────────────┐
│ Yozuvlar                    │
│                             │
│ [Bugun] [Hafta ●] [Oy]      │  ← segmented control
│                             │
│ Sarhisob                    │
│ ┌─────────────────────────┐ │
│ │ Savdo   14 200 000      │ │
│ │ Xarajat  3 800 000      │ │
│ │ ───────────────────     │ │
│ │ FOYDA   10 400 000      │ │
│ └─────────────────────────┘ │
│                             │
│ DUSHANBA, 17-IYUN           │  ← day header
│ [transaction item]          │
│ [transaction item]          │
│ [transaction item]          │
│                             │
│ SESHANBA, 18-IYUN           │
│ [transaction item]          │
│ ...                         │
└─────────────────────────────┘
```

**Funksiyalar:**
- Filter: Bugun / Hafta / Oy / Custom range
- Har kunni alohida group qilish (eyebrow sticky header)
- Yozuvni bosish → detail/edit modal

### 4.5 Oylik hisobot (`/reports`)

Eng "WOW" ekran — bu joyda data viz boy bo'ladi. Reels uchun aynan shu ekran ishlatilsa kerak.

```
┌─────────────────────────────────────────┐
│ Hisobot                  [Iyun 2026 ▼] │
├─────────────────────────────────────────┤
│                                         │
│ SOF FOYDA                               │
│ 32 400 000 so'm    ↑18% o'tgan oydan   │  ← katta raqam
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Foyda dinamikasi                    │ │
│ │ ╱╲    ╱╲                            │ │
│ │/  ╲__╱  ╲___╱╲___       line chart  │ │
│ │1  5   10  15  20  25  30            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌──────────────┬──────────────────────┐ │
│ │ Top savdo    │ Top xarajat          │ │
│ │ kategoriyasi │ kategoriyasi         │ │
│ ├──────────────┼──────────────────────┤ │
│ │ Naqd  62%    │ Mahsulot  48%        │ │
│ │ ████████░░   │ ████████░░           │ │
│ │              │                      │ │
│ │ Click 28%    │ Kommunal  22%        │ │
│ │ █████░░░░░   │ ████░░░░░░           │ │
│ │              │                      │ │
│ │ Payme 10%    │ Ish haqi  18%        │ │
│ │ ██░░░░░░░░   │ ███░░░░░░░           │ │
│ └──────────────┴──────────────────────┘ │
│                                         │
│ Eng yaxshi kun                          │
│ 14-iyun, Shanba                         │
│ +2 850 000 so'm                         │
│                                         │
│ [Excel'ga eksport]                      │
└─────────────────────────────────────────┘
```

**Funksiyalar:**
- Oy o'zgartirish dropdown
- Line chart — kunlik foyda dinamikasi
- Top kategoriyalar bar
- Eng yaxshi kun callout
- Eksport (CSV blob download)

### 4.6 Sozlamalar (`/settings`)

Sodda list, segmentlangan.

```
┌─────────────────────────────┐
│ Sozlamalar                  │
├─────────────────────────────┤
│                             │
│ BIZNES                      │
│ ┌─────────────────────────┐ │
│ │ Nom: Olov Grill       › │ │
│ │ Manzil: Chilonzor     › │ │
│ │ Valyuta: so'm         › │ │
│ └─────────────────────────┘ │
│                             │
│ KATEGORIYALAR               │
│ ┌─────────────────────────┐ │
│ │ Savdo kategoriyalari  › │ │
│ │ Xarajat kategoriyalari› │ │
│ └─────────────────────────┘ │
│                             │
│ MA'LUMOTLAR                 │
│ ┌─────────────────────────┐ │
│ │ Eksport (CSV)         › │ │
│ │ Barchasini o'chirish  › │ │  ← danger
│ └─────────────────────────┘ │
│                             │
│ HAQIDA                      │
│ Kassa v1.0                  │
│ Kodd Studio mahsuloti       │
└─────────────────────────────┘
```

---

## 5. Stack & constraints

### 5.1 Stack

```
Next.js 15 (App Router) + TypeScript strict
Tailwind CSS v4
Zustand (persist middleware) — localStorage state
next-pwa — PWA manifest + service worker
lucide-react — iconlar (faqat kerakli ikon import)
date-fns — sana formatlash
recharts — line chart hisobotda (bar chart custom, recharts ishlatmaymiz)
```

### 5.2 Folder strukturasi

```
src/
  app/
    layout.tsx          ← Satoshi font, root providers
    page.tsx            ← / Bosh sahifa
    onboarding/page.tsx
    transactions/
      page.tsx          ← tarix
      new/page.tsx
    reports/page.tsx
    settings/page.tsx
    globals.css
  components/
    layout/
      MobileBottomNav.tsx
      DesktopSidebar.tsx
      ResponsiveShell.tsx
    home/
      KpiHeroCard.tsx
      KpiCard.tsx
      WeeklyChart.tsx
      TransactionItem.tsx
    forms/
      AmountInput.tsx
      CategoryPicker.tsx
      TypeToggle.tsx
    reports/
      MonthlyChart.tsx
      CategoryBar.tsx
  store/
    useKassaStore.ts    ← Zustand store
  lib/
    formatCurrency.ts
    mockSeed.ts         ← demo uchun seed data
    categories.ts       ← default kategoriyalar
  types/
    index.ts
```

### 5.3 Zustand store shape

```ts
type Transaction = {
  id: string
  type: 'sale' | 'expense'
  amount: number
  category: string
  note?: string
  date: string  // ISO
}

type Settings = {
  businessName: string
  location: string
  currency: 'UZS' | 'USD'
  onboardingCompleted: boolean
}

type KassaState = {
  transactions: Transaction[]
  settings: Settings
  saleCategories: string[]
  expenseCategories: string[]

  addTransaction: (t: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  updateSettings: (s: Partial<Settings>) => void
  resetAll: () => void
  seedDemo: () => void  // 30 kunlik mock data
}
```

`persist` middleware bilan butun state localStorage'da `kassa-storage` kalit ostida saqlanadi.

### 5.4 Seed data (MUHIM)

Birinchi marta sahifa ochilganda, agar `transactions.length === 0` bo'lsa, **avtomatik 30 kunlik realistik mock data** kiritiladi. Bu reels uchun zarur — bo'sh ekran demo qilinmaydi.

`mockSeed.ts` — kuniga 5-15 ta tranzaksiya, real Uzbek kategoriyalar (Naqd, Click, Payme, Mahsulot, Ish haqi, Kommunal, Ijara), bugungi kungacha sana.

### 5.5 PWA manifest

```json
{
  "name": "Kassa",
  "short_name": "Kassa",
  "theme_color": "#0077CC",
  "background_color": "#F8FAFC",
  "display": "standalone",
  "start_url": "/",
  "icons": [...]
}
```

### 5.6 Constraints (CLAUDE.md uchun ham)

- **Branch yo'q, PR yo'q** — direct main commit
- **Backend yo'q** — Supabase/API yozilmaydi
- **Auth yo'q** — har kim app'ni ochsa, o'z brauzerida o'z ma'lumoti
- **Vercel-ready** — `npm run build` xatosiz, `npm run start` ishlaydi
- **Mobile-first** — har componentni avval `<lg` da yozish
- **Strict TS** — `any` yo'q

---

## 6. "Qochish kerak" ro'yxati

`frontend-design` skill'idan critical pass: bu loyiha **boshqa hech qaysi fintech app'ga o'xshamasligi** kerak.

❌ **Gradient hero** — ko'k-binafsha gradient orqa fon. Klishe. Sof rang ishlatamiz.

❌ **Glassmorphism** — backdrop-blur, semi-transparent card'lar. 2022 trend, hozir charchatadi.

❌ **Floating credit card mockup** — har "fintech" app'da bor 3D karta vizuali. Bizda yo'q.

❌ **Yashil/qizil income/expense** — fintech klishesi. Bizda blue/ink.

❌ **Excessive iconography** — har label oldida ikon. Faqat funksional joyda ikon (nav, action button, transaction type).

❌ **Skeuomorfik dollar belgisi** — "$" yoki cash bundle ikoni hero'da. Bizda raqam o'zi — typography hero.

❌ **Dark mode birinchi versiyada** — vaqt sarflamaymiz. v2'ga qoldiramiz.

❌ **Onboarding'da lottie animatsiya** — bezakdir, lekin sekin yuklanadi va generic ko'rinadi. Bizda real UI mockup preview.

❌ **Material/Bootstrap-ko'rinishidagi tugmalar** — sharp shadow, vivid blue background. Bizda flat ink button (`bg-ink text-white`) yoki ghost (`border border-border`).

❌ **shadcn/ui default Card komponentasi** — custom yozamiz, chunki shadcn radius/shadow shablonga o'xshatadi.

---

## 7. Build order

Claude Code aynan shu tartibda quradi. Har bosqichdan keyin user (Abbos) commit qiladi va tasdiqlaydi.

### Step 1 — Setup
- `npx create-next-app@latest kassa --typescript --tailwind --app --no-src-dir=false`
- Satoshi fontni `public/fonts/` ga qo'shish (yoki Fontshare CDN link layout'da)
- `tailwind.config.ts` — 2.4 dagi to'liq blokni qo'yish
- `globals.css` — Tailwind base + `body { @apply bg-base text-ink font-sans antialiased; }`
- Zustand o'rnatish: `npm i zustand`
- next-pwa: `npm i next-pwa` + `next.config.js`'ga conf
- Folder struktura yaratish (5.2)

### Step 2 — Store + types
- `types/index.ts` — Transaction, Settings types
- `lib/categories.ts` — default Uzbek kategoriyalar
- `lib/formatCurrency.ts` — "1 847 000" format
- `lib/mockSeed.ts` — 30 kunlik mock generator
- `store/useKassaStore.ts` — full Zustand with persist + seedDemo

### Step 3 — Layout shell
- `app/layout.tsx` — root, font, providers
- `components/layout/ResponsiveShell.tsx` — mobile bottom nav vs desktop sidebar logic
- `components/layout/MobileBottomNav.tsx`
- `components/layout/DesktopSidebar.tsx`
- Test: bo'sh sahifa ochiladi, mobile va desktop layout to'g'ri ko'rinadi

### Step 4 — Bosh sahifa (eng muhim — signature element shu yerda)
- `components/home/KpiHeroCard.tsx` — signature foyda raqami
- `components/home/KpiCard.tsx` — kichik metrika
- `components/home/WeeklyChart.tsx` — custom CSS bar chart (recharts emas, performance va dizayn control uchun)
- `components/home/TransactionItem.tsx`
- `app/page.tsx` — store'dan data olib hammasini birlashtirish
- **CRITIQUE PAUSE**: build qilingach, screenshot ol, `frontend-design`'ning self-critique bo'limini qo'lla. Signature element haqiqatan "WOW"mi? Hierarchy aniqmi? Restraint saqlanganmi?

### Step 5 — Yangi yozuv form'i
- `components/forms/TypeToggle.tsx`
- `components/forms/AmountInput.tsx` — katta tabular-nums input + quick chips
- `components/forms/CategoryPicker.tsx`
- `app/transactions/new/page.tsx`
- Mobile: full page, Desktop: modal

### Step 6 — Yozuvlar tarixi
- `app/transactions/page.tsx`
- Filter chips, day grouping, summary card

### Step 7 — Hisobot (data viz)
- `components/reports/MonthlyChart.tsx` — recharts line chart
- `components/reports/CategoryBar.tsx`
- `app/reports/page.tsx`
- CSV export funksiya

### Step 8 — Onboarding
- 3 ta slide, swipe yoki tugma
- Setup form
- localStorage flag
- `app/onboarding/page.tsx` + redirect logic

### Step 9 — Sozlamalar
- `app/settings/page.tsx`
- Edit modal'lari
- Reset all confirmation

### Step 10 — PWA + deploy
- `manifest.json` to'g'irlash
- App icon (oddiy K harfi blue square)
- `npm run build` test
- Vercel deploy

---

## 8. Acceptance — ish bajarilganligi qanday tekshiriladi

Quyidagi narsalar ishlasa, MVP tayyor:

1. ✅ Birinchi ochilishda onboarding ko'rsatiladi
2. ✅ Onboarding tugagach bosh sahifaga o'tadi, mock data avtomatik kiritilgan (signature raqam ko'rinadi)
3. ✅ Mobile'da +tugma bilan yangi yozuv qo'shish ishlaydi
4. ✅ Yozuv qo'shilganda bosh sahifadagi raqam yangilanadi
5. ✅ Yozuvlar tarixi sahifasida filter ishlaydi
6. ✅ Hisobot sahifasida joriy oy ma'lumotlari ko'rinadi
7. ✅ Sozlamalardan biznes nomi o'zgartirilsa, bosh sahifada yangilanadi
8. ✅ Brauzer yangilanganda ma'lumot saqlanib qoladi (localStorage)
9. ✅ Mobile'da Add to Home Screen tugmasi paydo bo'ladi (PWA)
10. ✅ Desktop'da Lighthouse 90+ Performance, 100 Accessibility
11. ✅ Vercel'ga deploy bo'ladi, ochiq URL'dan ishlaydi

---

## 9. Claude Code uchun yakuniy ko'rsatma

Bu spec'ni o'qib chiqdingmi? Yaxshi.

**Boshlash:**
1. Step 1 ni bajar.
2. Setup tayyor bo'lgach to'xta, menga ayt: "Setup tayyor, devda ishlamoqda".
3. Men keyingi qadamni aniqlayman.

**Har bir Step uchun qoidalar:**
- Spec'dagi tokenlardan chetga chiqma. Boshqa rang qo'shma. Boshqa shrift qo'shma.
- Komponent yozayotganda har biri o'z faylida bo'lsin, type'lari export qilinsin.
- Step yakunida git commit qil — `feat: step N - description`.
- Step yakunida menga aniq ayt: nima qildim, nima ishlayapti, qanday tekshirish mumkin.
- Self-critique majburiy bo'lgan Step 4'da: build qilingach, browser'da och, mobile va desktop screenshot menga ko'rsat (yoki ekrandan o'qib ber). "Signature element ishlayaptimi" deb tekshir.

**Qochish:**
- `any` ishlatma, strict mode buziladi.
- Spec'da yo'q komponent yozma (masalan, dark mode toggle, multi-currency).
- `frontend-design` 6-bo'limidagi "qochish ro'yxati"ga rioya qil.

Boshla.
