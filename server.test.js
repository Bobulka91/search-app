const request = require('supertest');
const app = require('./server'); // Importujeme server.js

describe('Validace vyhledávací aplikace', () => {

    // Test 1: Kontrola, zda funguje hlavní stránka (Bod 1 zadání)
    test('GET / by měl vrátit HTML stránku', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe('text/html');
    });

    // Test 2: Kontrola, zda API vrací strukturovaný JSON (Bod 2 & 3 zadání)
    test('GET /hledat by měl vrátit strukturovaná data v JSONu', async () => {
        const hledanyTermin = 'auto';
        const response = await request(app).get(`/hledat?search=${hledanyTermin}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe('application/json');
        
        // Kontrola struktury (strojově čitelný formát)
        expect(response.body).toHaveProperty('hledano', hledanyTermin);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        
        // Pokud jsou výsledky, zkontrolujeme, zda mají ID a text
        if (response.body.data.length > 0) {
            expect(response.body.data[0]).toHaveProperty('id');
            expect(response.body.data[0]).toHaveProperty('text');
        }
    });

    // Test 3: Kontrola chyby při prázdném dotazu
    test('GET /hledat bez parametru by měl vrátit chybu 400', async () => {
        const response = await request(app).get('/hledat');
        expect(response.statusCode).toBe(400);
    });
});