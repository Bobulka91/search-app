Tady je kompletní, opravený server.js. Udělal jsem tam tu „agresivnější“ metodu hledání, aby to Seznamu sežralo co nejvíc výsledků, a přidal jsem tam i CORS, aby ti to Render neházel na hlavu.

Zkopíruj tohle a všechno v původním server.js tím nahraď:

JavaScript
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const cors = require('cors');

const app = express();

// Povolení CORS a statických souborů
app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

app.get('/search', async (req, res) => {
    const query = req.query.q;
    
    // Validace pro testy
    if (!query) {
        return res.status(400).json({ error: 'Chybí vyhledávací dotaz' });
    }

    try {
        // Request na Seznam s User-Agentem, aby nás hned nezablokovali
        const response = await axios.get(`https://search.seznam.cz/?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const results = [];

        // Hledáme cokoli, co vypadá jako odkaz na výsledek
        $('a').each((i, el) => {
            const title = $(el).text().trim();
            const link = $(el).attr('href');

            // Seznam balí výsledky do svých redirectů (szn.cz nebo click.seznam.cz)
            if (title && link && (link.includes('szn.cz') || link.includes('click.seznam.cz') || link.includes('seznam.cz/res/'))) {
                results.push({
                    title: title.split('\n')[0].substring(0, 150), // Jen první řádek titulku
                    link: link
                });
            }
        });

        // Pokud první metoda selže, zkusíme starší selektory
        if (results.length === 0) {
            $('.SearchResult-title a, .Result-header-title').each((i, el) => {
                results.push({
                    title: $(el).text().trim(),
                    link: $(el).attr('href')
                });
            });
        }

        res.json(results);
    } catch (error) {
        console.error('Chyba:', error.message);
        res.status(500).json({ error: 'Chyba při komunikaci se Seznamem' });
    }
});

// Hlavní stránka
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Port pro Render
const PORT = process.env.PORT || 3000;

// Spuštění serveru pouze pokud se nespouští z testů
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server běží na http://localhost:${PORT}`);
    });
}

// Export pro JEST testy
module.exports = app;