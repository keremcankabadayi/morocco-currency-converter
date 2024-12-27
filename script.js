let rates = {
    TRY: 1,
    MAD: 0,
    USD: 0,
    EUR: 0
};

// Kurları API'den çek
function fetchRates() {
    $.ajax({
        url: 'https://api.exchangerate-api.com/v4/latest/TRY',
        method: 'GET',
        success: function(data) {
            rates.MAD = data.rates.MAD;
            rates.USD = data.rates.USD;
            rates.EUR = data.rates.EUR;
            
            // Kurları ekranda göster
            showLatestRates();
        },
        error: function(xhr, status, error) {
            console.error('Kurlar çekilemedi:', error);
            alert('Kurlar çekilemedi. Lütfen daha sonra tekrar deneyin.');
        }
    });
}

// Güncel kurları ekranda göster
function showLatestRates() {
    const ratesHtml = `
        <div class="rates-info">
            <p>1 USD = ${(1/rates.USD).toFixed(2)} TRY</p>
            <p>1 EUR = ${(1/rates.EUR).toFixed(2)} TRY</p>
            <p>1 MAD = ${(1/rates.MAD).toFixed(2)} TRY</p>
        </div>
    `;
    
    // Eğer rates-info elementi varsa güncelle, yoksa converter-box'tan sonra ekle
    if ($('.rates-info').length) {
        $('.rates-info').html(ratesHtml);
    } else {
        $('.converter-box').after(ratesHtml);
    }
}

function convert(from) {
    const amount = document.getElementById(from.toLowerCase()).value;
    
    // Eğer input boşsa, tüm inputları placeholder durumuna getir
    if (!amount) {
        Object.keys(rates).forEach(currency => {
            const element = document.getElementById(currency.toLowerCase());
            element.value = '';
        });
        return;
    }
    
    // TRY'ye çevir
    const tryAmount = from === 'TRY' ? 
        amount : 
        amount * (rates.TRY / rates[from]);

    // Diğer para birimlerine çevir
    Object.keys(rates).forEach(currency => {
        if (currency !== from) {
            const element = document.getElementById(currency.toLowerCase());
            const convertedAmount = tryAmount * rates[currency];
            element.value = convertedAmount.toFixed(2);
        }
    });
}

// Sayfa yüklendiğinde kurları çek
$(document).ready(function() {
    fetchRates();
    
    // Her 1 saatte bir kurları güncelle
    setInterval(fetchRates, 3600000);
}); 