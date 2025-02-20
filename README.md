# Kontrola Pristupa Objektu - Frontend

Ovo je frontend deo aplikacije za kontrolu pristupa objektima, izgrađen u **Next.js**, koji komunicira sa backend API-jem razvijenim u Laravelu.

## Tehnologije
- **Frontend:** Next.js (React)
- **UI Biblioteka:** Tailwind CSS
- **Autentifikacija:** Laravel Sanctum (API-based auth)
- **API komunikacija:** Axios / Fetch API

## Instalacija

1. Klonirajte repozitorijum:
   ```bash
   git clone https://github.com/gruyya/access-log-frontend.git
   cd access-log-fronted
   ```

2. Instalirajte zavisnosti:
   ```bash
   npm install
   ```

3. Konfigurišite **.env.local** fajl:
   ```plaintext
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

4. Pokrenite razvojni server:
   ```bash
   npm run dev
   ```

## Funkcionalnosti
- Skeniranje bar koda i slanje podataka ka API-u
- Prikaz informacija o licima koja trenutno pristupaju objektu


## API Endpointi koje koristi frontend
- `POST /api/employee-access-log` – Registracija dolaska zaposlenog
- `POST /api/login` – Login administratora

## Autor
[Nenad Grujic](https://github.com/gruyya)

## Licenca
MIT License
