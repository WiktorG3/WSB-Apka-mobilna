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
