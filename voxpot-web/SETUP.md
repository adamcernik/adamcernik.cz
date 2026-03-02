# Voxpot Dotazník – Setup Guide

## 1. Supabase setup

### Vytvoření projektu
1. Jdi na [supabase.com](https://supabase.com) a přihlaš se (nebo vytvoř účet)
2. Klikni **New Project**
3. Název: `voxpot-survey` (nebo cokoliv)
4. Region: **EU West** (Frankfurt)
5. Počkej na vytvoření (~2 min)

### Vytvoření tabulky
1. V Supabase dashboardu jdi do **SQL Editor**
2. Vlož obsah souboru `supabase-schema.sql`
3. Klikni **Run**
4. Ověř v **Table Editor**, že existuje tabulka `survey_responses`

### Získání credentials
1. Jdi do **Settings → API**
2. Zkopíruj:
   - **Project URL** (např. `https://abc123.supabase.co`)
   - **anon public** key (dlouhý string začínající `eyJ...`)

## 2. Konfigurace dotazníku

V souboru `voxpot/index.html` najdi nahoře v `<script>` sekci:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Nahraď placeholder hodnoty svými credentials.

## 3. Nasazení

Soubor `voxpot/index.html` commitni do svého GitHub repa.
GitHub Pages ho automaticky zpřístupní na:

```
https://adamcernik.cz/voxpot/
```

### URL parametry

Můžeš posílat přímé odkazy na konkrétní verzi:
- Vedení: `https://adamcernik.cz/voxpot/?v=vedeni`
- Přispěvatelé: `https://adamcernik.cz/voxpot/?v=prispevatel`

Nebo nechat, ať si uživatel vybere sám na úvodní obrazovce.

## 4. Čtení odpovědí

### V Supabase dashboardu
- Jdi do **Table Editor → survey_responses**
- Filtruj podle `version` (vedeni / prispevatel)
- JSONB sloupec `answers` obsahuje všechny odpovědi

### SQL dotazy
```sql
-- Všechny odpovědi vedení
SELECT * FROM survey_responses WHERE version = 'vedeni' ORDER BY created_at;

-- Přehled
SELECT * FROM survey_overview;

-- Nejčastější nástroje (vedení)
SELECT
    tool,
    COUNT(*) as count
FROM survey_responses,
    jsonb_array_elements_text(answers->'tools') as tool
WHERE version = 'vedeni'
GROUP BY tool
ORDER BY count DESC;
```

## 5. Bezpečnost

- `anon` key je bezpečný pro frontend (je navržený pro veřejné použití)
- RLS (Row Level Security) je zapnutá – anonymní uživatelé mohou pouze vkládat, ne číst
- Pro čtení odpovědí se přihlaš do Supabase dashboardu
- Stránka má `noindex, nofollow` meta tag – nebude v Google

## Soubory

```
voxpot/
├── index.html           ← Dotazník (obě verze)
├── supabase-schema.sql  ← SQL pro vytvoření tabulky
└── SETUP.md             ← Tento soubor
```
