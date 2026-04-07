# Road Safety Project Notes

## 1. Database Overview

- Default database connection: `mysql`
- Config source: `config/database.php`
- Charset: `utf8mb4`
- Collation: `utf8mb4_unicode_ci`

Project hii ina makundi mawili ya tables:

- Business tables za mfumo wa road safety
- Laravel system tables za auth, sessions, cache, na jobs

## 2. Main Business Tables

### `officers`
Wahudumu wa mfumo wa ndani.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | Primary key |
| `full_name` | string | Jina kamili |
| `email` | string | Unique |
| `password` | string | Inahashiwa na model cast |
| `role` | string(50) | Default: `officer` |
| `last_login_at` | timestamp nullable | Mara ya mwisho kuingia |
| `remember_token` | string nullable | Auth token |
| `created_at` / `updated_at` | timestamps | Audit |

### `violation_types`
Aina za makosa au matukio ya barabarani.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | Primary key |
| `name` | string | Unique |
| `description` | text nullable | Maelezo |
| `is_active` | boolean | Default: `true` |
| `created_at` / `updated_at` | timestamps | Audit |

### `road_segments`
Vipande vya barabara vinavyoweza kuwa na rules.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | Primary key |
| `segment_name` | string | Jina la segment |
| `segment_type` | string(100) nullable | Mfano highway/urban |
| `boundary_coordinates` | json nullable | Coordinates za mipaka |
| `length_km` | decimal(8,2) nullable | Urefu kwa km |
| `description` | text nullable | Maelezo ya sehemu |
| `created_by` | foreignId nullable | FK -> `officers.id`, `nullOnDelete()` |
| `created_at` / `updated_at` | timestamps | Audit |

### `road_rules`
Sheria za barabara kwa sehemu au eneo fulani.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | Primary key |
| `rule_name` | string | Jina la rule |
| `rule_type` | string(100) | Aina ya rule |
| `latitude_start` | decimal(10,7) nullable | Mwanzo wa eneo |
| `longitude_start` | decimal(10,7) nullable | Mwanzo wa eneo |
| `latitude_end` | decimal(10,7) nullable | Mwisho wa eneo |
| `longitude_end` | decimal(10,7) nullable | Mwisho wa eneo |
| `location_name` | string nullable | Jina la eneo |
| `rule_value` | string nullable | Value kama speed limit |
| `description` | text nullable | Maelezo ya rule |
| `effective_from` | datetime nullable | Rule inaanza lini |
| `effective_to` | datetime nullable | Rule inaisha lini |
| `is_active` | boolean | Default: `true` |
| `segment_id` | foreignId nullable | FK -> `road_segments.id`, `nullOnDelete()` |
| `created_by` | foreignId nullable | FK -> `officers.id`, `nullOnDelete()` |
| `created_at` / `updated_at` | timestamps | Audit |

### `reports`
Ripoti zinazotumwa kuhusu matukio au uvunjaji wa sheria.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | Primary key |
| `reference_no` | string | Unique report number |
| `violation_type_id` | foreignId | FK -> `violation_types.id`, `restrictOnDelete()` |
| `description` | text | Maelezo ya tukio |
| `latitude` | decimal(10,7) | Location |
| `longitude` | decimal(10,7) | Location |
| `location_name` | string nullable | Eneo lililoandikwa |
| `status` | string(50) | Default: `submitted`, indexed |
| `priority` | string(30) | Default: `normal` |
| `reported_at` | timestamp nullable | Muda wa tukio/ripoti |
| `officer_id` | foreignId nullable | FK -> `officers.id`, `nullOnDelete()` |
| `reviewed_at` | timestamp nullable | Muda wa review |
| `officer_notes` | text nullable | Notes za officer |
| `created_at` / `updated_at` | timestamps | Audit |

Indexes za ziada:

- `status, created_at`
- `latitude, longitude`

### `evidence_files`
Faili za ushahidi zilizounganishwa na report.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | Primary key |
| `report_id` | foreignId | FK -> `reports.id`, `cascadeOnDelete()` |
| `file_name` | string | Jina la faili |
| `file_path` | string | Path ya storage |
| `file_type` | string(100) nullable | MIME/type |
| `file_size` | unsignedBigInteger nullable | Ukubwa wa faili |
| `created_at` / `updated_at` | timestamps | Audit |

### `rule_violations`
Meza ya kuunganisha report na rule iliyovunjwa.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | Primary key |
| `report_id` | foreignId | FK -> `reports.id`, `cascadeOnDelete()` |
| `rule_id` | foreignId | FK -> `road_rules.id`, `cascadeOnDelete()` |
| `matched_automatically` | boolean | Default: `false` |
| `confidence_score` | decimal(5,2) nullable | Confidence ya auto match |
| `verified_by` | foreignId nullable | FK -> `officers.id`, `nullOnDelete()` |
| `verified_at` | timestamp nullable | Muda wa verification |
| `created_at` / `updated_at` | timestamps | Audit |

Constraint:

- Unique pair: `report_id + rule_id`

### `hotspots`
Maeneo hatarishi au yenye matukio mengi.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | Primary key |
| `name` | string nullable | Jina la hotspot |
| `latitude` | decimal(10,7) | Location |
| `longitude` | decimal(10,7) | Location |
| `radius_meters` | decimal(10,2) | Default: `100` |
| `frequency` | unsignedInteger | Default: `0` |
| `severity` | string(30) | Default: `medium` |
| `rule_id` | foreignId nullable | FK -> `road_rules.id`, `nullOnDelete()` |
| `last_updated_at` | timestamp nullable | Last refresh |
| `created_at` / `updated_at` | timestamps | Audit |

Index ya ziada:

- `severity, frequency`

## 3. Laravel System Tables

### `users`
Default Laravel users table. Kwa project hii inaonekana bado ipo kwa auth ya kawaida ya framework, lakini officer auth ndiyo inayotumika zaidi upande wa mfumo wa ndani.

Columns kuu:

- `id`
- `name`
- `email` unique
- `email_verified_at`
- `password`
- `remember_token`
- `created_at`
- `updated_at`

### `password_reset_tokens`

- `email` primary key
- `token`
- `created_at`

### `sessions`

- `id` primary key
- `user_id` nullable, indexed
- `ip_address`
- `user_agent`
- `payload`
- `last_activity` indexed

### `cache`

- `key` primary key
- `value`
- `expiration` indexed

### `cache_locks`

- `key` primary key
- `owner`
- `expiration` indexed

### `jobs`

- `id`
- `queue` indexed
- `payload`
- `attempts`
- `reserved_at`
- `available_at`
- `created_at`

### `job_batches`

- `id` primary key
- `name`
- `total_jobs`
- `pending_jobs`
- `failed_jobs`
- `failed_job_ids`
- `options`
- `cancelled_at`
- `created_at`
- `finished_at`

### `failed_jobs`

- `id`
- `uuid` unique
- `connection`
- `queue`
- `payload`
- `exception`
- `failed_at`

## 4. Relationships Summary

- Officer mmoja anaweza kuwa na reports nyingi kupitia `reports.officer_id`
- Officer mmoja anaweza ku-create road segments nyingi kupitia `road_segments.created_by`
- Officer mmoja anaweza ku-create road rules nyingi kupitia `road_rules.created_by`
- Officer mmoja anaweza ku-verify rule violations nyingi kupitia `rule_violations.verified_by`
- Violation type moja inaweza kuwa na reports nyingi
- Road segment moja inaweza kuwa na road rules nyingi
- Road rule moja inaweza kuwa na rule violations nyingi
- Road rule moja inaweza kuwa na hotspots nyingi
- Report moja inaweza kuwa na evidence files nyingi
- Report moja inaweza kuhusishwa na road rules nyingi kupitia `rule_violations`

## 5. Seeders Zilizopo

Seeder zinazokimbizwa na `DatabaseSeeder`:

- `OfficerSeeder`
- `ViolationTypeSeeder`

Hakuna seeders nyingine za `road_segments`, `road_rules`, `reports`, `evidence_files`, `rule_violations`, au `hotspots` kwa sasa.

### `OfficerSeeder`
Huongeza au kusasisha officer wa mfumo:

| Field | Value |
|---|---|
| `full_name` | `System Officer` |
| `email` | `officer@roadsafety.test` |
| `password` | `password` |
| `role` | `admin` |

Note:

- Password itahashiwa automatically kupitia cast ya model ya `Officer`.
- Inatumia `updateOrCreate`, hivyo haitazalisha duplicate kwa email hiyo.

### `ViolationTypeSeeder`
Huongeza au kusasisha record za `violation_types` kwa kutumia `upsert`.

Data zilizopo:

| Name | Description | is_active |
|---|---|---|
| `Overspeeding` | Vehicle operating beyond the allowed speed limit. | `true` |
| `Dangerous Overtaking` | Unsafe overtaking that puts other road users at risk. | `true` |
| `Drunk Driving` | Suspected driving under the influence of alcohol or drugs. | `true` |
| `Overloading` | Vehicle carrying passengers or goods beyond safe limits. | `true` |
| `Road Damage` | Potholes, broken signage, or dangerous road infrastructure. | `true` |
| `Traffic Obstruction` | Vehicles or activities blocking normal traffic flow. | `true` |

Note:

- Key ya upsert ni `name`
- Fields zinazoupdate ni `description`, `is_active`, `updated_at`

## 6. Color Schema

Project hii ina palettes mbili kuu:

- Public/Auth palette
- Officer dashboard palette

### A. Public/Auth Palette
Inatumika zaidi kwenye:

- `public/css/app.css`
- `public/css/auth.css`
- pia imeandikwa kwenye `Documentations/projectColors.md`

| Token | Color | Usage |
|---|---|---|
| `--rs-primary` | `#1f2937` | Main brand dark gray |
| `--rs-primary-hover` | `#111827` | Hover state |
| `--rs-accent` | `#dc2626` | Danger / critical |
| `--rs-warning` | `#f59e0b` | Warning |
| `--rs-success` | `#16a34a` | Success |
| `--rs-surface` | `#f8fafc` | Light surface |
| `--rs-surface-soft` | `#f3f4f6` | Soft background |
| `--rs-dark` | `#111827` | Main text |
| `--rs-border` | `#d1d5db` | Borders |
| `--rs-muted` | `#6b7280` | Muted text |

Usage summary:

- Dark gray ndiyo brand kuu ya system
- White / soft gray hutumika kwenye cards, forms, backgrounds
- Red kwa danger au rejected states
- Yellow kwa warning au pending states
- Green kwa success au completed states

### B. Officer Dashboard Palette
Inatumika kwenye:

- `public/css/officerlayout.css`

| Token | Color | Usage |
|---|---|---|
| `--officer-primary` | `#0f5d73` | Main officer blue/teal |
| `--officer-primary-deep` | `#0a3440` | Deep heading/nav tone |
| `--officer-accent` | `#f4b942` | Accent gold |
| `--officer-surface` | `#f4f8fb` | Soft surface |
| `--officer-card` | `#ffffff` | Cards |
| `--officer-text` | `#183642` | Main text |
| `--officer-muted` | `#6f8590` | Secondary text |
| `--officer-border` | `#dbe5eb` | Borders |
| `--officer-shadow` | `0 18px 50px rgba(13, 53, 64, 0.08)` | Card shadow |

Status colors zinazotumika officer side:

| State | Background | Text |
|---|---|---|
| `submitted` / `normal` | `#e9f3ff` | `#1d5fab` |
| `under-review` / `high` | `#fff4d8` | `#9a6400` |
| `verified` / `resolved` / `low` | `#e6f7ef` | `#1b7c4d` |
| `rejected` / `critical` | `#fdebec` | `#b03a48` |

Hotspot severity colors:

| Severity | Background | Text |
|---|---|---|
| `high` | `#fdebec` | `#b03a48` |
| `medium` | `#fff4d8` | `#9a6400` |
| `low` | `#e6f7ef` | `#1b7c4d` |
| `unknown` | `#edf2f5` | `#536875` |

## 7. Quick Summary

- Database kuu ya app imejengwa kwa `mysql`
- Core domain tables ni: `officers`, `violation_types`, `road_segments`, `road_rules`, `reports`, `evidence_files`, `rule_violations`, `hotspots`
- Seeders zilizopo ni mbili tu: officer wa admin na violation types sita
- UI ina color systems mbili: dark-gray public palette na teal-gold officer dashboard palette
