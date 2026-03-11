const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path'); // Přidáno pro správné cesty
const app = express();

// 1. DŮLEŽITÉ: Tohle řekne Renderu, kde najde tvůj index.html
app.use(express.static(path.join(__dirname, '.')));

app.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const response = await axios.get(`https://search.seznam.cz/?q=${encodeURIComponent(query)}`);
        const $ = cheerio.load(response.data);
        const results = [];

        $('.Result-header-title').each((i, el) => {
            const title = $(el).text().trim();
            const link = $(el).attr('href');
            if (title && link) {
                results.push({ title, link });
            }
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Chyba při vyhledávání' });
    }
});

// 2. DŮLEŽITÉ: Tohle zajistí, že se při vstupu na hlavní adresu zobrazí tvůj web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. DŮLEŽITÉ: Port, který si Render určí sám (nebo 3000 jako záloha)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
});