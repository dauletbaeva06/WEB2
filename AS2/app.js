require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const { fileURLToPath } = require('url');

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

        const countryRes = await axios.get(`https://restcountries.com/v3.1/all`);
        const countryInfo = countryRes.data[0] || {};

        const countryData = {
            capital: countryInfo.capital || 'N/A',
            languages: countryInfo.languages ? countryInfo.languages.map(l => l.name).join(', ') : 'N/A',
            currencyCode: countryInfo.currencies ? countryInfo.currencies[0].code : 'USD',
            flag: countryInfo.flag || '' 
        };

        const exchangeRes = await axios.get(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_KEY}/latest/${countryData.currencyCode}`);
        const rates = exchangeRes.data.conversion_rates;
        
        const exchangeData = {
            base: countryData.currencyCode,
            toUSD: rates.USD ? rates.USD.toFixed(2) : 'N/A',
            toKZT: rates.KZT ? rates.KZT.toFixed(2) : 'N/A'

        };

        const newsRes = await axios.get(`https://newsapi.org/v2/everything?q=${userData.country}&language=en&pageSize=5&apiKey=${NEWS_API_KEY}`);
        
        const newsData = newsRes.data.articles.map(article => ({
            title: article.title, 
            image: article.urlToImage, 
            description: article.description,
            url: article.url
        }));

        res.json({
            user: userData,
            country: countryData,
            exchange: exchangeData,
            news: newsData
        });

    } catch (error) {
        console.error("Error fetching API data:", error.message);
        res.status(500).json({ error: "Failed to fetch data from one or more APIs. Please check your keys." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});