# Vyhledávací aplikace

Webová aplikace pro vyhledávání na Googlu pomocí Google Custom Search API.

## Tech Stack

| Vrstva | Technologie |
|--------|-------------|
| Backend | Node.js, Express |
| Frontend | HTML, CSS, JavaScript |
| API | Google Custom Search API |
| HTTP klient | Axios |

## Funkce

- Vyhledávání pomocí Google Custom Search API
- Zobrazení výsledků (název, odkaz, popis)
- Stažení výsledků ve formátu JSON nebo CSV

## Spuštění

1. Nainstaluj závislosti:
```bash
npm install
```

2. Nastav své API klíče v `server.js`:
```javascript
const GOOGLE_API_KEY = 'tvuj_api_klic';
const SEARCH_ENGINE_ID = 'tvuj_search_engine_id';
```

3. Spusť server:
```bash
node server.js
```

4. Otevři prohlížeč na `http://localhost:3000`

## Jak získat API klíč

1. Jdi na [console.cloud.google.com](https://console.cloud.google.com)
2. Vytvoř projekt a povol **Custom Search API**
3. Vytvoř API klíč
4. Jdi na [cse.google.com](https://cse.google.com) a vytvoř Search Engine ID