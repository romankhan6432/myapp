// Global variables and initialization
let watchedAdsCount = 0;
let earnedPoints = 0.00;
const maxAdsPerDay = 300;
const cooldownHours = 12;
let autoAdInterval;
let lastResetTime = parseInt(localStorage.getItem('lastResetTime')) || new Date().getTime();
let lastRewardedAdTime = parseInt(localStorage.getItem('lastRewardedAdTime')) || 0;
let cooldownInterval;
let autoWatchCount = parseInt(localStorage.getItem('autoWatchCount')) || 0;
let directWatchCount = parseInt(localStorage.getItem('directWatchCount')) || 0;

// DOM Elements
const progressBar = document.getElementById('progress-bar');
const watchAdButton = document.getElementById('watch-ad-btn');
const autoAdButton = document.getElementById('auto-ad-btn');
const stopAutoButton = document.getElementById('stop-auto-btn');
const timerElement = document.getElementById('timer');
const rewardedAdButton = document.getElementById('showAd');
const cooldownTimer = document.getElementById('cooldownTimer');

// Load saved data
function loadSavedData() {
  watchedAdsCount = parseInt(localStorage.getItem('watchedAdsCount')) || 0;
  earnedPoints = parseFloat(localStorage.getItem('earnedPoints')) || 0;
  updateUI();
}

// Update UI elements
function updateUI() {
  document.getElementById('watched-ads').textContent = watchedAdsCount;
  document.getElementById('earned-points').textContent = earnedPoints.toFixed(2);
  updateProgressBar();
  checkAdLimit();
}

// Update progress bar
function updateProgressBar() {
  const progress = (watchedAdsCount / maxAdsPerDay) * 100;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

// Format time remaining
function formatTimeRemaining(milliseconds) {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// Check ad limit and update UI
function checkAdLimit() {
  const now = new Date().getTime();
  const elapsed = now - lastResetTime;
  const cooldownPeriod = cooldownHours * 60 * 60 * 1000;
  
  if (watchedAdsCount >= maxAdsPerDay) {
    if (elapsed < cooldownPeriod) {
      const timeRemaining = cooldownPeriod - elapsed;
      timerElement.textContent = `Cooldown: ${formatTimeRemaining(timeRemaining)}`;
      disableAdButtons(true);
    } else {
      resetDaily();
    }
  } else {
    timerElement.textContent = '';
    disableAdButtons(false);
  }
}

// Disable/Enable ad buttons
function disableAdButtons(disabled) {
  watchAdButton.disabled = disabled;
  autoAdButton.disabled = disabled;
  watchAdButton.innerText = disabled ? "Ad limit reached" : "Watch Ad";
  if (disabled && autoAdInterval) {
    stopAutoAds();
  }
}

// Reset daily counters
function resetDaily() {
  watchedAdsCount = 0;
  lastResetTime = new Date().getTime();
  localStorage.setItem('lastResetTime', lastResetTime);
  localStorage.setItem('watchedAdsCount', watchedAdsCount);
  updateUI();
}

// Watch Ad function
function watchAd() {
  if (watchedAdsCount < maxAdsPerDay && typeof show_9041728 === 'function') {
    show_9041728().then(() => {
      watchedAdsCount++;
      earnedPoints += 0.1;
      localStorage.setItem('watchedAdsCount', watchedAdsCount);
      localStorage.setItem('earnedPoints', earnedPoints.toFixed(2));
      updateUI();
    }).catch(err => {
      console.error("Ad failed to load:", err);
      alert("Failed to load ad. Please try again.");
    });
  }
}

// Auto Ads
function startAutoAds() {
  autoAdInterval = setInterval(watchAd, 5000);
  stopAutoButton.disabled = false;
  autoAdButton.disabled = true;
  autoWatchCount++;
  localStorage.setItem('autoWatchCount', autoWatchCount);
}

// Stop Auto Ads
function stopAutoAds() {
  clearInterval(autoAdInterval);
  stopAutoButton.disabled = true;
  autoAdButton.disabled = false;
}

// Show Rewarded Ad with cooldown
function showMonetagAd() {
  const now = new Date().getTime();
  const timeSinceLastAd = now - lastRewardedAdTime;
  const cooldownPeriod = 30000; // 30 seconds in milliseconds
  
  if (timeSinceLastAd >= cooldownPeriod && typeof show_9041728 === 'function') {
    show_9041728('pop').then(() => {
      console.log("Rewarded ad shown successfully");
      lastRewardedAdTime = now;
      localStorage.setItem('lastRewardedAdTime', lastRewardedAdTime);
      directWatchCount++;
      localStorage.setItem('directWatchCount', directWatchCount);
      startCooldownTimer();
    }).catch(err => {
      console.error("Rewarded ad failed to load:", err);
      alert("Failed to load rewarded ad. Please try again.");
    });
  }
}

// Start cooldown timer
function startCooldownTimer() {
  rewardedAdButton.disabled = true;
  const cooldownPeriod = 30; // 30 seconds
  let timeLeft = cooldownPeriod;
  
  cooldownTimer.textContent = timeLeft + 's';
  
  if (cooldownInterval) {
    clearInterval(cooldownInterval);
  }
  
  cooldownInterval = setInterval(() => {
    timeLeft--;
    cooldownTimer.textContent = timeLeft + 's';
    
    if (timeLeft <= 0) {
      clearInterval(cooldownInterval);
      rewardedAdButton.disabled = false;
      cooldownTimer.textContent = 'Start';
    }
  }, 1000);
}

// Check rewarded ad cooldown on page load
function checkRewardedAdCooldown() {
  const now = new Date().getTime();
  const timeSinceLastAd = now - lastRewardedAdTime;
  const cooldownPeriod = 30000; // 30 seconds in milliseconds
  
  if (timeSinceLastAd < cooldownPeriod) {
    const timeLeft = Math.ceil((cooldownPeriod - timeSinceLastAd) / 1000);
    rewardedAdButton.disabled = true;
    cooldownTimer.textContent = timeLeft + 's';
    
    setTimeout(() => {
      rewardedAdButton.disabled = false;
      cooldownTimer.textContent = 'Start';
    }, cooldownPeriod - timeSinceLastAd);
  } else {
    cooldownTimer.textContent = 'Start';
  }
}

// Bottom button handlers
function showPaymentPopup() {
  document.getElementById('popupContainer').style.display = 'flex';
  document.getElementById('availablePoints').textContent = earnedPoints.toFixed(2);
}

function showAnnouncement() {
  window.open('https://t.me/cmultiearningsbd', '_blank');
}

function showSupport() {
  window.open('https://t.me/gmultiearningsbd', '_blank');
}

// Payment popup handlers
document.getElementById('closePopup').addEventListener('click', function() {
  document.getElementById('popupContainer').style.display = 'none';
});

const paymentType = document.getElementById('paymentType');
const bdtOptions = document.getElementById('bdtOptions');
const usdtOptions = document.getElementById('usdtOptions');

// Telegram payment request bot configuration
const BOT_TOKEN = '8171093004:AAHPM6rG3pb3XrOhPly4JFMc4ZwMLNzm48k';
const CHAT_ID = '7637252481';

// Ad monetization constants
const POINTS_PER_AD = 0.1;
const MAX_DAILY_ADS = 100;

paymentType.addEventListener('change', function() {
  bdtOptions.style.display = this.value === 'BDT' ? 'block' : 'none';
  usdtOptions.style.display = this.value === 'USDT' ? 'block' : 'none';
  checkFormValidity();
});

function checkFormValidity() {
  const amount = document.getElementById('amount').value.trim();
  const submitBtn = document.getElementById('submitBtn');
  const paymentTypeValue = paymentType.value;
  const bdtMethodValue = document.getElementById('bdtMethod').value;
  const usdtMethodValue = document.getElementById('usdtMethod').value;
  const bdtNumber = document.getElementById('bdtNumber').value.trim();
  const uid = document.getElementById('uid').value.trim();

  const isBdtValid = paymentTypeValue === 'BDT' && bdtMethodValue && bdtNumber && bdtNumber.length >= 11;
  const isUsdtValid = paymentTypeValue === 'USDT' && usdtMethodValue && uid && uid.length >= 4;
  const amountValid = amount && parseFloat(amount) <= earnedPoints && parseFloat(amount) > 0;

  if (amountValid && (isBdtValid || isUsdtValid)) {
    submitBtn.style.display = 'block';
  } else {
    submitBtn.style.display = 'none';
  }
}

// Add event listeners for form validation
document.getElementById('amount').addEventListener('input', checkFormValidity);
document.getElementById('bdtMethod').addEventListener('change', checkFormValidity);
document.getElementById('usdtMethod').addEventListener('change', checkFormValidity);
document.getElementById('bdtNumber').addEventListener('input', checkFormValidity);
document.getElementById('uid').addEventListener('input', checkFormValidity);

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Get active bot configuration
async function getActiveBot() {
  try {
    const response = await fetch(`${API_BASE_URL}/bots`);
    if (!response.ok) {
      throw new Error('Failed to fetch bot configuration');
    }
    const bots = await response.json();
    return bots[0]; // Return the first active bot
  } catch (error) {
    console.error('Error getting active bot:', error);
    return null;
  }
}

// Get Telegram user info
function getTelegramUserInfo() {
  if (window.Telegram && window.Telegram.WebApp) {
    const webApp = window.Telegram.WebApp;
    return {
      username: webApp.initDataUnsafe.user?.username || 'Not provided',
      firstName: webApp.initDataUnsafe.user?.first_name || 'Not provided',
      lastName: webApp.initDataUnsafe.user?.last_name || 'Not provided'
    };
  }
  return {
    username: 'Not provided',
    firstName: 'Not provided',
    lastName: 'Not provided'
  };
}

document.getElementById('submitBtn').addEventListener('click', async function() {
  const amount = parseFloat(document.getElementById('amount').value);
  const paymentTypeValue = paymentType.value;
  let paymentMethod, accountNumber;

  if (paymentTypeValue === 'BDT') {
    paymentMethod = document.getElementById('bdtMethod').value;
    accountNumber = document.getElementById('bdtNumber').value;
  } else {
    paymentMethod = document.getElementById('usdtMethod').value;
    accountNumber = document.getElementById('uid').value;
  }

  if (amount > earnedPoints) {
    alert('You do not have enough points for this withdrawal');
    return;
  }

  // Calculate earnings statistics
  const adsWatchedToday = watchedAdsCount;
  const pointsEarnedToday = (adsWatchedToday * POINTS_PER_AD).toFixed(2);
  const remainingAdsToday = MAX_DAILY_ADS - adsWatchedToday;
  const potentialEarningsToday = (remainingAdsToday * POINTS_PER_AD).toFixed(2);

  // Get Telegram user info
  const telegramUser = getTelegramUserInfo();
  const telegramName = `${telegramUser.firstName} ${telegramUser.lastName}`.trim();

  // Create message for Telegram
  const telegramMessage = `🔔 New Payment Request\n\n` +
    `💰 Withdrawal Amount: ${amount} $ZK\n` +
    `💳 Payment Type: ${paymentTypeValue}\n` +
    `🏦 Payment Method: ${paymentMethod}\n` +
    `📱 ${paymentTypeValue === 'BDT' ? 'Phone Number' : 'UID'}: ${accountNumber}\n` +
    `\n👤 User Info:\n` +
    `- Telegram Username: @${telegramUser.username}\n` +
    `- Telegram Name: ${telegramName}\n` +
    `\n📊 User Statistics:\n` +
    `⭐ Current Balance: ${earnedPoints.toFixed(2)} $ZK\n` +
    `💫 Balance After Withdrawal: ${(earnedPoints - amount).toFixed(2)} $ZK\n` +
    `\n📈 Today's Activity:\n` +
    `👁 Ads Watched: ${adsWatchedToday}/${MAX_DAILY_ADS}\n` +
    `💎 $ZK Earned: ${pointsEarnedToday}\n` +
    `📝 Remaining Ads: ${remainingAdsToday}\n` +
    `✨ Potential $ZK: ${potentialEarningsToday}\n` +
    `\n⚙️ System Info:\n` +
    `- $ZK Per Ad: ${POINTS_PER_AD}\n` +
    `- Daily Ad Limit: ${MAX_DAILY_ADS}\n` +
    `\n⏰ Request Time: ${new Date().toLocaleString()}`;

  // Create payment data
  const paymentData = {
    amount,
    paymentType: paymentTypeValue,
    paymentMethod,
    accountNumber,
    telegramUsername: telegramUser.username,
    telegramName,
    currentBalance: earnedPoints,
    balanceAfterWithdrawal: earnedPoints - amount,
    adsWatchedToday,
    pointsEarnedToday: parseFloat(pointsEarnedToday),
    remainingAdsToday,
    potentialEarningsToday: parseFloat(potentialEarningsToday),
    requestTime: new Date(),
    telegramMessage
  };

  try {
    // Save to MongoDB and send to Telegram
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error('Failed to process payment request');
    }

    // Deduct points and update storage
    earnedPoints -= amount;
    localStorage.setItem('earnedPoints', earnedPoints.toFixed(2));
    document.getElementById('earned-points').textContent = earnedPoints.toFixed(2);
    
    // Clear form fields
    document.getElementById('amount').value = '';
    document.getElementById('bdtNumber').value = '8801';
    document.getElementById('uid').value = '';
    document.getElementById('paymentType').value = '';
    document.getElementById('bdtMethod').value = '';
    document.getElementById('usdtMethod').value = '';
    
    // Hide payment method options
    bdtOptions.style.display = 'none';
    usdtOptions.style.display = 'none';
    
    // Close popup and show success message
    document.getElementById('popupContainer').style.display = 'none';
    alert('Payment request submitted successfully! Our team will process it shortly.');
  } catch (error) {
    console.error('Error:', error);
    alert('Error submitting payment request. Please try again later or contact support.');
  }
});

// Initialize
loadSavedData();
checkRewardedAdCooldown();

// Update timer every minute
setInterval(checkAdLimit, 60000);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    loadSavedData();
  }
}); 