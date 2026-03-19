const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

const SERP_API_KEY = 'f72ad226058938d4ed8598afae3ff3203abe8513e471b5ca4d2b128698b98360';

app.get('/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Chybí vyhledávací dotaz' });
    }

    try {
        const response = await axios.get('https://serpapi.com/search', {
            params: {
                q: query,
                api_key: SERP_API_KEY,
                engine: 'google',
                num: 10
            }
        });

        const results = response.data.organic_results?.map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet
        })) || [];

        res.json(results);
    } catch (error) {
        console.error('Chyba:', error.message);
        res.status(500).json({ error: 'Chyba při komunikaci se SerpApi' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server běží na http://localhost:${PORT}`);
    });
}

module.exports = app;