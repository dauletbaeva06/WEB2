import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static('public'));

const COUNTRY_LAYER_KEY = process.env.COUNTRY_LAYER_KEY;
const EXCHANGE_RATE_KEY = process.env.EXCHANGE_RATE_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

app.get('/get-profile', async (req, res) => {
    try {
        const userRes = await axios.get('https://randomuser.me/api/');
        const user = userRes.data.results[0];

        const userData = {
            firstName: user.name.first,
            lastName: user.name.last,
            gender: user.gender,
            profilePic: user.picture.large,
            age: user.dob.age,
            dob: user.dob.date.split('T')[0],
            city: user.location.city,
            country: user.location.country,
            address: `${user.location.street.number} ${user.location.street.name}`
        };

        let countryData = { capital: 'N/A', languages: 'N/A', currencyCode: 'N/A', flag: '', alpha2: 'US' };

try {
    const countryRes = await axios.get(`http://api.countrylayer.com/v2/name/${userData.country}?access_key=${COUNTRY_LAYER_KEY}&fullText=true`);
    
    let countryInfo = countryRes.data[0];
    if (!countryInfo) {
        const searchRes = await axios.get(`http://api.countrylayer.com/v2/name/${userData.country}?access_key=${COUNTRY_LAYER_KEY}`);
        countryInfo = searchRes.data[0] || {};
    }

    countryData = {
        capital: countryInfo.capital || 'N/A',
        languages: countryInfo.languages ? countryInfo.languages.map(l => l.name).join(', ') : 'N/A',
        currencyCode: countryInfo.currencies ? countryInfo.currencies.map(c => c.code).join(', ') : 'N/A',
        flag: `https://flagcdn.com/w320/${countryInfo.alpha2Code?.toLowerCase()}.png`
    };
} catch (e) {
    console.error("Country API error, using default flag.");
    countryData.flag = 'https://flagcdn.com/w320/un.png';
}

let exchangeData = { base: countryData.currencyCode, toUSD: 'N/A', toKZT: 'N/A' };
try {
    const exchangeRes = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_KEY}/latest/EUR`);
    const rates = exchangeRes.data.conversion_rates;
    
    exchangeData = {
        base: countryData.currencyCode,
        toUSD: rates.USD ? rates.USD.toFixed(2) : 'N/A',
        toKZT: rates.KZT ? rates.KZT.toFixed(2) : 'N/A'
    };
} catch (e) {
    console.error("Exchange Rate Fetch Failed");
}

        let newsData = [];
        try {
            const newsRes = await axios.get(`https://newsapi.org/v2/everything?q=${userData.country}&language=en&pageSize=5&apiKey=${NEWS_API_KEY}`);
            newsData = newsRes.data.articles.map(article => ({
                title: article.title,
                image: article.urlToImage,
                description: article.description,
                url: article.url
            }));
        } catch (e) { console.error("News API failed"); }

        res.json({ user: userData, country: countryData, exchange: exchangeData, news: newsData });

    } catch (error) {
        console.error("Main API Error:", error.message);
        res.status(500).json({ error: "Server error occurred while fetching data." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});