const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

// Initialize Clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

app.get('/', (req, res) => {
  res.send('Project Nexus API is running live!');
});

// Generate Trip Endpoint
app.post('/api/generate-trip', async (req, res) => {
  try {
    const { destination, days, budget, companion } = req.body;

    const prompt = `Generate a detailed trip itinerary for ${destination} for ${days} days with a ${budget} budget, traveling with ${companion}.
    Provide response STRICTLY in valid JSON format matching this schema:
    {
      "tripTitle": "string",
      "destination": "string",
      "duration": "string",
      "itinerary": [
        {
          "day": 1,
          "theme": "string",
          "activities": [
            { "time": "Morning", "placeName": "string", "details": "string", "ticketPrice": "string", "geoCoordinates": "lat,lng" }
          ]
        }
      ],
      "hotelRecommendations": [
        { "hotelName": "string", "address": "string", "pricePerNight": "string", "rating": "string" }
      ]
    }`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedJson);

    return res.json(parsedData);
  } catch (error) {
    console.error('Error generating trip:', error);
    return res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

// Save Trip Endpoint
app.post('/api/save-trip', async (req, res) => {
  try {
    const { userId, destination, days, budget, companion, tripData } = req.body;

    const { data, error } = await supabase
      .from('trips')
      .insert([
        {
          user_id: userId || null,
          destination,
          days: parseInt(days),
          budget,
          companion,
          trip_data: tripData,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase Save Error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Trip saved successfully!', trip: data[0] });
  } catch (err) {
    console.error('Save API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

