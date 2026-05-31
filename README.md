# Planer treningów

Projekt zaliczeniowy z przedmiotu „Języki programowania Objective-C/Swift" - Mobilna Aplikacja "Planer treningów".

Technologie: React Native, Expo SDK 54, TypeScript, SQLite, Zustand, NativeWind.

## Opis

Aplikacja pozwala użytkownikowi tworzyć własne plany treningowe (rutyny), a potem na ich podstawie przeprowadzać trening: zapisuje kolejne serie (ciężar i powtórzenia), odhacza wykonane i korzysta z timera odpoczynku między seriami. Zakończony trening trafia do historii, a aplikacja wylicza podstawowe statystyki i rekordy.

## Wymagania funkcjonalne

1. **Biblioteka ćwiczeń** - przeglądanie i wyszukiwanie ćwiczeń z bazy oraz dodawanie własnych.
2. **Plany treningowe** - tworzenie i edycja rutyn z ćwiczeniami i ilością serii.
3. **Śledzenie treningu** - zapisywanie serii (ciężar x powtórzenia) i oznaczanie ich jako wykonane.
4. **Timer odpoczynku** - odliczanie przerwy po wykonanej serii, można go skrócić, wydłużyć albo pominąć.
5. **Historia treningów** - lista zakończonych treningów ze szczegółami (data, czas, objętość).
6. **Statystyki** - liczba treningów, łączna objętość i rekordy dla poszczególnych ćwiczeń.

## Wymagania pozafunkcjonalne

1. **Działanie offline** - pełna funkcjonalność bez internetu i bez zewnętrznych API.
2. **Prywatność** - dane treningowe zostają na telefonie, nic nie jest wysyłane na serwer.
3. **Prostota obsługi** - najważniejsze akcje (start treningu, dodanie serii) w 1-2 dotknięciach.
4. **Architektura** - logika oddzielona od widoku, kod w TypeScript ze ścisłym typowaniem.
5. **Interfejs po polsku** - cała aplikacja w języku polskim, w ciemnym motywie.

## Potencjalni odbiorcy

- Osoby trenujące na siłowni, które chcą śledzić swoje postępy.
- Trenerzy personalni przygotowujący plany dla podopiecznych.

## Korzyści dla użytkownika

- Śledzenie postępów (objętość, rekordy) motywuje do dalszych treningów.
- Gotowe plany pozwalają od razu zacząć trening, bez układania go za każdym razem.
- Działa bez internetu, więc sprawdza się na siłowni bez zasięgu.

## Uruchomienie

```
pnpm install
pnpm start
```

Następnie zeskanuj kod QR w aplikacji Expo Go (Android lub iOS). Gdy sieć lokalna jest zablokowana (np. przez firewall), użyj tunelu:

```
pnpm start --tunnel
```

## Struktura kodu

Kod siedzi w `src/`:

- `src/app/` - ekrany (Expo Router, file-based routing)
- `src/components/` - komponenty UI
- `src/hooks/` - hooki Reacta z loading state'em i refetchem on focus
- `src/lib/` - logika i zapytania do bazy
- `src/db/` - schemat bazy + seed wbudowanej listy ćwiczeń
- `src/store/` - Zustand: draft edytora rutyny, aktywna sesja, timer odpoczynku
- `src/data/` - statyczne dane (lista wbudowanych ćwiczeń)
- `src/constants/` - drobne stałe (kolory, polskie etykiety)

Wywołania idą tak: ekran → hook → lib → drizzle.

## Struktura bazy danych

Lokalna SQLite przez `expo-sqlite` + Drizzle ORM. Schemat w `src/db/schema.ts`, migracje w `drizzle/` (generowane przez `drizzle-kit`, wykonują się przy starcie aplikacji).

Tabele dzielą się na dwie gałęzie: **plan** (`routines` → `routine_exercises` → `routine_sets`) i **odbyty trening** (`workouts` → `workout_exercises` → `sets`). Po rozpoczęciu treningu plan jest kopiowany do tabel `workout_*` (snapshot), żeby późniejsza edycja rutyny nie zmieniała zapisanej historii.

### Tabele

**`exercises`** - katalog ćwiczeń.

- `id`
- `name`
- `muscle_group` - enum: chest, back, legs, shoulders, arms, core, other
- `equipment` - enum: barbell, dumbbell, machine, cable, bodyweight, other
- `is_custom` - true dla dodanych przez użytkownika
- `created_at`

**`routines`** - plany treningowe.

- `id`
- `name`
- `created_at`

**`routine_exercises`** - ćwiczenia w planie z kolejnością i przerwą.

- `id`
- `routine_id` (FK kaskada)
- `exercise_id` (FK restrict)
- `position`
- `rest_sec` (nullable)

**`routine_sets`** - zaplanowane serie.

- `id`
- `routine_exercise_id` (FK kaskada)
- `position`
- `target_weight` (nullable)
- `target_reps` (nullable)

**`workouts`** - rozpoczęte i zakończone treningi.

- `id`
- `name`
- `routine_id` (FK set null)
- `started_at`
- `finished_at` (null = sesja w toku)
- `duration_sec`
- `total_volume` - suma `weight * reps` zaznaczonych serii, liczona przy zakończeniu

**`workout_exercises`** - ćwiczenia w treningu (snapshot z planu).

- `id`
- `workout_id` (FK kaskada)
- `exercise_id` (FK restrict)
- `position`
- `rest_sec` (nullable)

**`sets`** - logowane serie w trakcie sesji.

- `id`
- `workout_exercise_id` (FK kaskada)
- `position`
- `weight`
- `reps`
- `is_done` - zaznaczone tylko jeśli faktycznie wykonane (tylko takie liczą się do statystyk i rekordów)

### Relacje

- Rutyna ma wiele `routine_exercises`, każde ma wiele `routine_sets`.
- Trening ma wiele `workout_exercises`, każde ma wiele `sets`.
- `exercises` jest używane jako referencja w obu gałęziach (`routine_exercises.exercise_id` i `workout_exercises.exercise_id`).

Kaskady na FK dziećmi pozwalają usunąć rutynę albo trening jednym `DELETE`. Dla `exercises` użyte jest `restrict` - nie można usunąć ćwiczenia z biblioteki, jeśli jest gdziekolwiek użyte.

# Grupa 30

- Wiktor Gronostaj 165812

- Seweryn Filipkowski 165666

- Adrian Wojciechowski 167079
