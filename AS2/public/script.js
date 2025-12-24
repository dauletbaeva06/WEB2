const generateBtn = document.getElementById('generate-btn');
const userSection = document.getElementById('user-section');
const countrySection = document.getElementById('country-section');
const newsArticles = document.getElementById('news-articles');

generateBtn.addEventListener('click', async () => {
    userSection.innerHTML = '<p class="status-msg">Fetching random user data...</p>';
    countrySection.innerHTML = '';
    newsArticles.innerHTML = '';

    try {
        const response = await fetch('/get-profile');
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        userSection.innerHTML = `
            <div class="card">
                <img src="${data.user.profilePic}" alt="Profile Picture" class="profile-img">
                <div class="info-content">
                    <h2>${data.user.firstName} ${data.user.lastName}</h2>
                    <p><strong>Gender:</strong> ${data.user.gender}</p>
                    <p><strong>Age:</strong> ${data.user.age}</p>
                    <p><strong>DOB:</strong> ${data.user.dob}</p>
                    <p><strong>City:</strong> ${data.user.city}</p>
                    <p><strong>Country:</strong> ${data.user.country}</p>
                    <p><strong>Full Address:</strong> ${data.user.address}</p>
                </div>
            </div>
        `;

        countrySection.innerHTML = `
            <div class="card country-card">
                <h3>Country Details: ${data.user.country}</h3>
                <img src="${data.country.flag}" alt="National Flag" class="flag-img">
                <p><strong>Capital City:</strong> ${data.country.capital}</p>
                <p><strong>Official Language(s):</strong> ${data.country.languages}</p>
                <p><strong>Currency:</strong> ${data.country.currencyCode}</p>
                <hr>
                <h4>Exchange Rates</h4>
                <p><strong>1 ${data.exchange.base} =</strong> ${data.exchange.toUSD} USD</p>
                <p><strong>1 ${data.exchange.base} =</strong> ${data.exchange.toKZT} KZT</p>
            </div>
        `;

        newsArticles.innerHTML = data.news.map(article => `
            <div class="news-card">
                <img src="${article.image || 'https://via.placeholder.com/300x150?text=No+Image'}" alt="News Image">
                <div class="news-info">
                    <h4>${article.title}</h4>
                    <p>${article.description || 'No description available for this article.'}</p>
                    <a href="${article.url}" target="_blank">Read Full Article</a>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Frontend Error:', error);
        userSection.innerHTML = `
            <p class="error-msg">Error: ${error.message}. Please check your server and API keys.</p>
        `;
    }
});