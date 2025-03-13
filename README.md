# Multi Earnings BD Telegram Mini App

A Telegram Mini App for earning points by watching ads and requesting payments.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Telegram Bot Token

## Setup Instructions

1. Install MongoDB on your system if you haven't already.

2. Install the server dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Telegram bot token:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

4. Start MongoDB service on your system.

5. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## Project Structure

- `index.html` - Main HTML file for the Telegram Mini App
- `styles.css` - CSS styles for the application
- `script.js` - Frontend JavaScript code
- `server.js` - Backend server with MongoDB integration
- `package.json` - Project dependencies and scripts

## Features

- Watch ads to earn points
- Auto-watch ads feature
- Daily ad limits with cooldown
- Payment request system
- MongoDB integration for storing payment requests
- Telegram bot integration for notifications

## API Endpoints

- `POST /api/payments` - Create a new payment request
- `GET /api/payments` - Get all payment requests
- `PATCH /api/payments/:id` - Update payment request status

## Database Schema

The MongoDB database stores payment requests with the following fields:
- amount
- paymentType
- paymentMethod
- accountNumber
- telegramUsername
- telegramName
- currentBalance
- balanceAfterWithdrawal
- adsWatchedToday
- pointsEarnedToday
- remainingAdsToday
- potentialEarningsToday
- requestTime
- status

## Security Notes

- Make sure to keep your Telegram bot token secure
- Use environment variables for sensitive information
- Implement proper validation and sanitization for user inputs
- Consider implementing rate limiting for API endpoints
