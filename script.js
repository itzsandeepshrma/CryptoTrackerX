const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
const cardContainer = document.getElementById('crypto-cards');
const searchInput = document.getElementById('search');
const loading = document.getElementById('loading');
const lastUpdated = document.getElementById('last-updated');
let coins = [];

function formatNumber(num) {
  return num.toLocaleString('en-US');
}

function formatPrice(price) {
  if (price >= 1) {
    return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  } else {
    return '$' + price.toFixed(6);
  }
}

async function fetchData() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    coins = await res.json();
    renderCards(coins);
    updateTime();
    loading.style.display = 'none';
    cardContainer.style.display = 'grid';
  } catch (err) {
    loading.textContent = '⚠️ Failed to load data. Retrying in 1 min...';
    console.error("API Fetch Error:", err);
  }
}

function renderCards(data) {
  cardContainer.innerHTML = '';
  data.forEach(coin => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h2>
        <img src="${coin.image}" alt="${coin.name}" />
        ${coin.name} <span class="symbol">(${coin.symbol.toUpperCase()})</span>
      </h2>
      <div class="price">${formatPrice(coin.current_price)}</div>
      <div class="marketcap">
        Market Cap: $${formatNumber(coin.market_cap)}
      </div>
      <div class="change ${coin.price_change_percentage_24h >= 0 ? 'green' : 'red'}">
        24h Change: ${coin.price_change_percentage_24h.toFixed(2)}%
      </div>
    `;
    cardContainer.appendChild(card);
  });
}

function updateTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour12: true });
  lastUpdated.textContent = `Last Updated: ${timeStr}`;
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = coins.filter(c => c.name.toLowerCase().includes(query));
  renderCards(filtered);
});

fetchData();
setInterval(() => {
  fetchData();
  updateTime();
}, 60000); 
