const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const cors = require('cors'); // PŘIDÁNO: Nutné pro propojení s frontendem

const app = express();
app.use(cors()); // PŘIDÁNO: Bez tohohle ti to Render může blokovat
app.use(express.static(path.join(__dirname, '.')));

app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Chybí dotaz' }); // PŘIDÁNO: Oprava pro testy

    try {
        const response = await axios.get(`https://search.seznam.cz/?q=${encodeURIComponent(query)}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' } // PŘIDÁNO: Aby tě Seznam hned neodstřelil
        });
        
        const $ = cheerio.load(response.data);
        const results = [];

        // OPRAVA SELEKTORU: Seznam změnil třídy, tyhle jsou aktuální:
        $('a').each((i, el) => {
                        const title = $(el).text().trim();
                        const link = $(el).attr('href');
            if (title && link && (link.includes('szn.cz') || link.includes('click.seznam.cz'))) {
        results.push({ 
            title: title.substring(0, 100), // Ořízneme moc dlouhé texty
            link: link });
            }
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Chyba při vyhledávání' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
// OPRAVA PRO TESTY: Aby se port nebil s Jestem
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server běží na portu ${PORT}`);
    });
}

module.exports = app;