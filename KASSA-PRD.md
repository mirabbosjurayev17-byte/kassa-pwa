# KASSA — PRD / Texnik Vazifa

**Loyiha:** Kassa — kunlik savdo va xarajat trackeri (PWA mobil ilova)
**Mijoz (case study):** Mehr Market — oziq-ovqat do'koni, egasi Aziz Karimov, Toshkent
**Maqsad:** Demo emas, real ishlaydigan, do'kon egasining haqiqiy muammosini hal qiladigan ilova
**Hujjat turi:** Single source of truth. Kod yozishdan oldin to'liq o'qiladi.

---

## 0. Eng muhim qoidalar (Claude Code uchun)

1. Bu hujjat — yagona haqiqat manbai. Har bir bosqich shu yerga tayanadi.
2. **Bosqichli (step-gated) bajarish:** har bosqich oxirida `hisobot` chiqar va **tasdiq kutib to'xta**. Tasdiqsiz keyingi bosqichga o'tma.
3. Branch/PR yo'q — to'g'ridan-to'g'ri `main`ga commit.
4. Backend yo'q. Hammasi frontend + Zustand (`persist` / localStorage). "AI" — lokal heuristika (tashqi API yo'q).
5. Mavjud kod buzilmasin — avval o'qib chiq, keyin o'zgartir.
6. Anti-template: lorem ipsum yo'q, generic card grid yo'q, har bo'limda signature element.
7. Real O'zbek datasi: real summalar (UZS), real kategoriyalar, real to'lov turlari.

---

## 1. Vizyon va asosiy va'da

Do'kon / kafe / ustaxona egasi **kun oxirida qancha foyda qilganini 3 soniyada** ko'ra olishi kerak — daftarsiz, buxgaltersiz, murakkab dastursiz.

**Bitta jumlada:** "Telefonda sotuvni bos — bugungi foydangni ko'r."

**Core loop:**
`Sotuv/Xarajat qo'shish (1 tap)` → `Bosh ekranda foyda yangilanadi` → `AI o'sayotgan xarajatni aytadi` → `Kun yakunida natija`

---

## 2. Maqsadli foydalanuvchilar (personas)

| Persona | Kim | Asosiy ehtiyoj | Ko'radigan ma'lumot |
|---|---|---|---|
| **Ega (owner)** | Aziz aka, 38, 2 do'kon | Foyda, xarajat, tahlil, hisobot | Hammasi |
| **Xodim (employee)** | Sotuvchi | Tez sotuv/xarajat kiritish | Faqat kiritish + bugungi sotuv (foyda EMAS) |

Rol farqi muhim: xodim foyda va marjani **ko'rmasligi** kerak. Bu real do'kon egasi uchun sotiladigan funksiya.

---

## 3. Texnik stack (qat'iy)

| Qatlam | Texnologiya | Izoh |
|---|---|---|
| Framework | Next.js 15 (App Router) | 16+ ishlatma (next-pwa webpack mosligi) |
| Til | TypeScript (strict) | `any` taqiqlanadi |
| Styling | Tailwind CSS v4 | shadcn/ui **ishlatilmaydi** |
| State | Zustand + `persist` | localStorage, backend yo'q |
| Charts | Recharts | |
| Motion | Framer Motion | |
| Icons | lucide-react | yagona icon kutubxonasi |
| PWA | next-pwa | service worker, offline |
| i18n | next-intl | UZ (default) / RU |
| Font | Onest | Lotin + Kirill qo'llab-quvvatlash |
| Sana | date-fns | timezone: `Asia/Tashkent` |

**Palitra (FINAI-inspired sage green):**
- Asosiy fon (dark hero): `#141F14`
- Yashil accent: `#2E7D32` / `#34C759` (success)
- Xarajat / minus: `#E5484D` (red)
- Sotuv / plus: yashil
- Neytral: oq/och kulrang fonlar, `#0F172A` matn

---

## 4. Ma'lumotlar modeli (TypeScript types)

```ts
type PaymentMethod = 'naqd' | 'uzcard' | 'humo' | 'click' | 'transfer';
type TxType = 'sale' | 'expense';
type Role = 'owner' | 'employee';

interface Business {
  id: string;
  name: string;            // "Mehr Market"
  type: 'dokon' | 'kafe' | 'ustaxona';
  ownerName: string;       // "Aziz Karimov"
  createdAt: string;       // ISO
}

interface Employee {
  id: string;
  name: string;            // "Aziz aka" / "Dilnoza"
  role: Role;
  pin: string;             // 4 raqamli kirish
}

interface Category {
  id: string;
  name: string;            // "Mahsulot", "Ish haqi", "Soliq", "Kommunal", "Transport"
  kind: TxType;            // sale yoki expense
  color: string;
  icon: string;            // lucide nomi
}

interface Transaction {
  id: string;
  type: TxType;            // sale | expense
  amount: number;          // so'm, musbat son
  categoryId: string;
  paymentMethod: PaymentMethod;
  note?: string;
  createdAt: string;       // ISO — MUHIM: "bugun" shu maydon bo'yicha hisoblanadi
  createdBy: string;       // Employee.id
}
```

### Zustand stores
- `useAuthStore` — joriy employee, login/logout, PIN.
- `useBusinessStore` — biznes ma'lumoti.
- `useTransactionStore` (persist) — barcha transactionlar, CRUD, derived selectorlar.
- `useSettingsStore` (persist) — til, tema.

### Derived (selectorlar — komponentda emas, store'da hisoblanadi)
- `todayProfit = todaySales − todayExpenses`
- `todaySales`, `todayExpenses` — `createdAt` bugungi kunга tushadiganlari
- `margin = todaySales > 0 ? (todayProfit / todaySales) * 100 : 0`
- `expenseByCategory(thisMonth)` — donut uchun
- `salesLast7Days()` — kunlik massiv (grafik uchun)
- `comparisonVsYesterday(metric)` — % o'zgarish

---

## 5. P0 — BLOKLOVCHI BUG'LAR (birinchi bosqich)

Bular tuzatilmaguncha ilova "demo" tuyuladi va video uchun yaroqsiz.

| # | Muammo | Talab |
|---|---|---|
| P0-1 | Bosh ekran foyda/sotuv/xarajat **0**, lekin yozuvlar to'la | Bosh ekran KPI'lari `createdAt`=bugun bo'lgan transactionlardan hisoblansin. Hech qachon noto'g'ri 0 chiqmasin |
| P0-2 | Mock data o'tgan sanaga (M06 20) qotirilgan → "bugun" har doim bo'sh | Mock data **dinamik**: `new Date()`ga nisbatan oxirgi 30 kun + **bugun** uchun ham yozuvlar generatsiya qilinsin |
| P0-3 | "Обзор продаж" grafigi bo'sh | `salesLast7Days()` data bilan to'lsin, Recharts area/line chizsin |
| P0-4 | Salomlashuv "Привет, 5546456" (telefon raqami) | Biznes/ega nomi bilan: "Salom, Aziz aka 👋" |

**Acceptance:** Ilova birinchi ochilganda bosh ekranda bugungi foyda > 0, grafik to'la, ism bilan salomlashadi.

---

## 6. Ekranlar (screens) spetsifikatsiyasi

### 6.1 Onboarding / Kirish
- Birinchi ochilishda: biznes nomi + turi + ega ismi so'raladi (3 qadam, qisqa).
- Keyin 4 raqamli PIN o'rnatish.
- Keyingi kirishlarda: PIN ekrani.
- Demo uchun: "Namuna bilan boshlash" tugmasi — Mehr Market mock datasi yuklanadi.

### 6.2 Bosh ekran (Dashboard)
- **Hero:** bugungi foyda (katta), ko'z-icon bilan yashirish imkoni.
- 3 KPI: Sotuv, Xarajat, Marja — har birida "kechagiga nisbatan ↑/↓ %".
- **Xarajat taqsimoti** (donut, Recharts) — kategoriya bo'yicha, bu oy.
- **AI tahlil** kartasi (6.9 ga qarang) — "Подробнее" real ekranga olib boradi.
- **Tezkor amallar:** Sotuv (+), Xarajat (−), Hisobot, Eksport.
- **Savdo dinamikasi** grafigi — 7 kun.
- **Bugungi yozuvlar** ro'yxati — oxirgi 5 ta, "Barchasi".

### 6.3 Sotuv / Xarajat qo'shish (CORE — eng muhim ekran)
- Pastdan ochiladigan **bottom sheet** (tez, qulay).
- Katta **summa klaviaturasi** (telefon uchun).
- Kategoriya tanlash (chip'lar).
- To'lov turi (Naqd / Uzcard / Humo / Click / O'tkazma).
- Izoh (ixtiyoriy).
- "Saqlash" → mikro-animatsiya (raqam count-up, success) → bosh ekran darhol yangilanadi.
- **Maqsad: 3 soniyada bitta yozuv.** Ortiqcha qadam yo'q.

### 6.4 Yozuvlar (Records)
- To'liq ro'yxat, kun bo'yicha guruhlangan.
- Filter: tur (sotuv/xarajat), sana, kategoriya, to'lov turi.
- Har yozuvni tahrirlash / o'chirish (swipe yoki long-press).
- Qidiruv.

### 6.5 Hisobotlar (Reports)
- Davr tanlash: Bugun / Hafta / Oy / Maxsus.
- Foyda/sotuv/xarajat dinamikasi.
- Kategoriya bo'yicha breakdown.
- To'lov turi bo'yicha breakdown (naqd vs karta nisbati — soliq uchun muhim).
- **Eksport:** CSV / rasm (kun yakuni kartasi).

### 6.6 Kategoriyalar
- Sotuv va xarajat kategoriyalarini CRUD.
- Rang + icon tanlash.
- Standart kategoriyalar oldindan to'ldirilgan.

### 6.7 Xodimlar
- Ega xodim qo'shadi (ism + PIN + rol).
- Rol: owner / employee.
- Employee kirsa — faqat "Qo'shish" va bugungi sotuv ko'rinadi; **foyda/marja/hisobot yashirin**.

### 6.8 Sozlamalar
- Til (UZ/RU), biznes ma'lumoti, tema, ma'lumotni tozalash.
- PWA: "Bosh ekranga o'rnatish" tugmasi.

### 6.9 AI tahlil (lokal heuristika — tashqi API yo'q)
Lokal data ustida qoidalar:
- Bu hafta vs o'tgan hafta har kategoriya xarajatini solishtir.
- Agar biror kategoriya **>20%** o'ssa → ogohlantirish + tavsiya. Masalan: *"Mahsulot xarajati 32% oshdi — ta'minotchini qayta ko'ring."*
- Marja pasaysa → ogohlantirish.
- Eng foydali kun/eng katta xarajat kunini aniqlash.
- Har tavsiya inson tilida, do'kon egasi tushunadigan tarzda.

### 6.10 Kun yakuni (Daily close)
- Kun oxirida (yoki tugma bilan) "Bugun: +1.2M foyda" ulashish kartasi.
- Sotuv/xarajat/foyda/eng yaxshi kategoriya.
- Rasm sifatida saqlash/ulashish (Reels va retention uchun).

---

## 7. Mobil / PWA talablari

- **Mobile-first.** Asosiy maqsad — telefon. Desktop ikkilamchi.
- **Pastki tab bar:** Bosh ekran · Yozuvlar · [+ katta markaziy tugma] · Hisobot · Sozlama.
- Markaziy "+" tugma → Sotuv/Xarajat bottom sheet.
- Katta tap-zona (min 44px), bosh barmoq yetadigan joyda.
- **Safe area** (iPhone notch / home indicator) hisobga olinsin.
- **PWA install** prompt toza; ikonka + splash + theme-color `#141F14`.
- **Offline:** internetsiz ham yozuv kiritiladi (Zustand persist), keyin ko'rinadi. Service worker shell'ni cache qiladi.

---

## 8. Motion / animatsiya (Framer Motion)

- KPI raqamlari — count-up.
- Donut va chart — kirishda chizilib chiqadi.
- Bottom sheet — silliq spring.
- Yozuv saqlanganda — success mikro-animatsiya (haptik tuyg'u).
- Sahifa o'tishlari — yengil fade/slide.
- Ortiqcha emas: tez va "premium" tuyulsin, sekinlashtirmaslik.

---

## 9. i18n (UZ / RU)

- Barcha matn `next-intl` orqali. Hardcode matn yo'q.
- UZ default, RU to'liq parallel.
- Raqam formati: `1 234 567 so'm` (probel ajratuvchi).
- Sana: `20-iyun, 19:30`.

---

## 10. Mock data talablari (real tuyulishi shart)

- Biznes: **Mehr Market**, ega **Aziz Karimov**, Yunusobod.
- Xodimlar: Aziz aka (owner), Dilnoza, Sardor (employee).
- **Dinamik sana:** oxirgi 30 kun + bugun uchun transactionlar (`new Date()`ga nisbatan).
- Kunlik 8–20 ta yozuv, real summalar (50K–1.5M).
- Kategoriyalar: Sotuv → Mahsulot savdosi; Xarajat → Mahsulot, Ish haqi, Soliq, Kommunal, Transport, Boshqa.
- To'lov turlari aralash: ~50% naqd, ~30% karta, ~20% Click.
- Hech qachon bo'sh ekran ko'rinmasin.

---

## 11. "Tayyor" ta'rifi (Definition of Done)

Har feature uchun:
- [ ] TypeScript strict — xato yo'q, `any` yo'q
- [ ] UZ va RU ikkalasida ishlaydi
- [ ] Mobil va desktopda buzilmaydi
- [ ] Bo'sh holat (empty state) bor
- [ ] Animatsiya silliq, lag yo'q
- [ ] Zustand persist saqlaydi (reload'dan keyin ham turadi)
- [ ] Har tap'lanadigan element javob beradi (dead button yo'q)

---

## 12. Bosqichli build rejasi (har bosqichdan keyin HISOBOT + tasdiq)

> Har bosqich oxirida: nima qilinди, qaysi fayllar o'zgardi, qanday tekshirish mumkin — qisqa `hisobot`. Keyin **to'xta**, tasdiq kut.

**Bosqich 1 — P0 bug fix (eng muhim)**
Data model + dinamik mock + bosh ekran KPI wiring + grafik + ism bilan salomlashuv. (5-bo'lim)

**Bosqich 2 — Core loop**
Sotuv/Xarajat qo'shish bottom sheet + summa klaviaturasi + saqlash animatsiyasi + bosh ekran real-time yangilanishi. (6.3)

**Bosqich 3 — Mobil shell + PWA**
Pastki tab bar + markaziy + tugma + safe area + PWA install + offline. (7)

**Bosqich 4 — Yozuvlar + Hisobotlar + Eksport**
Records (filter/edit/delete) + Reports + CSV/rasm eksport. (6.4, 6.5)

**Bosqich 5 — Kategoriyalar + Xodimlar (rol)**
CRUD + employee roli (foyda yashirin). (6.6, 6.7)

**Bosqich 6 — AI tahlil + Kun yakuni**
Lokal heuristika + tavsiyalar + ulashish kartasi. (6.9, 6.10)

**Bosqich 7 — Polish**
Motion sayqal + i18n to'liqligi + dead button audit + empty states + DoD tekshiruvi.

---

## 13. Non-functional

- **Performance:** birinchi yuk < 2s; tap → reaktsiya < 100ms.
- **Accessibility:** kontrast yetarli, tap-zona ≥ 44px, fokus ko'rinadi.
- **Maxfiylik:** ma'lumot faqat qurilmada (localStorage), tashqariga yuborilmaydi — bu sotuv argumenti.
- **Barqarorlik:** reload, offline, ma'lumot tozalashda buzilmaydi.

---

## 14. Bu hujjat doirasidan TASHQARI (hozircha emas)

- Real backend / bulutga sinxron.
- Ko'p qurilma o'rtasida sinxronizatsiya.
- Real to'lov tizimi integratsiyasi (Click/Payme API).
- Chek chop etish (printer).

Bular kelajak versiyalar uchun — hozircha frontend + lokal data bilan mukammal ishlaydigan ilova maqsad.

---

*Kodd Studio · Kassa PRD · 2026*
