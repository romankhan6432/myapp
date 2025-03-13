const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());



const mongoose = require('mongoose');

// MongoDB Atlas connection
const atlasURI = 'mongodb+srv://romankhan6432:m8t1B2BjsafoQ8gR@cluster0.uxxmc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(atlasURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// MongoDB Connection
// Bot Configuration Schema
const botConfigSchema = new mongoose.Schema({
  botToken: {
    type: String,
    required: true,
    unique: true
  },
  chatId: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
});

const BotConfig = mongoose.model('BotConfig', botConfigSchema);

// Payment Schema
const paymentSchema = new mongoose.Schema({
  amount: Number,
  paymentType: String,
  paymentMethod: String,
  accountNumber: String,
  telegramUsername: String,
  telegramName: String,
  currentBalance: Number,
  balanceAfterWithdrawal: Number,
  adsWatchedToday: Number,
  pointsEarnedToday: Number,
  remainingAdsToday: Number,
  potentialEarningsToday: Number,
  requestTime: Date,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

// API Endpoints
app.post('/api/payments', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();

    // Get active bot configuration
    const activeBot = await BotConfig.findOne({ isActive: true });
    if (!activeBot) {
      throw new Error('No active bot configuration found');
    }

    // Send to Telegram using active bot
    const telegramResponse = await fetch(`https://api.telegram.org/bot${activeBot.botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: activeBot.chatId,
        text: req.body.telegramMessage,
        parse_mode: 'Markdown'
      })
    });

    if (!telegramResponse.ok) {
      throw new Error('Failed to send message to Telegram');
    }

    // Update last used timestamp
    await BotConfig.findByIdAndUpdate(activeBot._id, { lastUsed: new Date() });

    res.status(201).json({ message: 'Payment request saved and sent successfully', payment });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to process payment request' });
  }
});

// Get all payments
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ requestTime: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Update payment status
app.patch('/api/payments/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(payment);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Bot Configuration Endpoints
app.post('/api/bots', async (req, res) => {
  try {
    const { botToken, chatId } = req.body;
    const bot = new BotConfig({ botToken, chatId });
    await bot.save();
    res.status(201).json({ message: 'Bot configuration added successfully', bot });
  } catch (error) {
    console.error('Error adding bot:', error);
    res.status(500).json({ error: 'Failed to add bot configuration' });
  }
});

app.get('/api/bots', async (req, res) => {
  try {
    const bots = await BotConfig.find({ isActive: true });
    res.json(bots);
  } catch (error) {
    console.error('Error fetching bots:', error);
    res.status(500).json({ error: 'Failed to fetch bot configurations' });
  }
});

app.patch('/api/bots/:id', async (req, res) => {
  try {
    const bot = await BotConfig.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    );
    res.json(bot);
  } catch (error) {
    console.error('Error updating bot:', error);
    res.status(500).json({ error: 'Failed to update bot configuration' });
  }
});

// Delete bot configuration
app.delete('/api/bots/:id', async (req, res) => {
  try {
    const bot = await BotConfig.findByIdAndDelete(req.params.id);
    if (!bot) {
      return res.status(404).json({ error: 'Bot configuration not found' });
    }
    res.json({ message: 'Bot configuration deleted successfully' });
  } catch (error) {
    console.error('Error deleting bot:', error);
    res.status(500).json({ error: 'Failed to delete bot configuration' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 