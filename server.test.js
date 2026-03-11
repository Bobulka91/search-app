const request = require('supertest');
const app = require('./server');

describe('Testy vyhledávače', () => {
    test('GET / by měl vrátit úvodní stránku', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('<!DOCTYPE html>');
    });

    test('GET /search by měl vrátit pole výsledků', async () => {
        const res = await request(app).get('/search?q=auto');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /search bez dotazu by měl vrátit 400', async () => {
        const res = await request(app).get('/search');
        expect(res.statusCode).toBe(400);
    });
});