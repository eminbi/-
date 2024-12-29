// backend/server.js
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Google API setup
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
  ]
});

// Routes setup
const researchRoutes = require('./routes/research');
const presentationRoutes = require('./routes/presentation');
const aiRoutes = require('./routes/ai');

app.use('/api/research', researchRoutes);
app.use('/api/presentation', presentationRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// routes/research.js
const express = require('express');
const router = express.Router();
const { getResearchList, addResearchItem, updateResearchItem } = require('../controllers/researchController');

router.get('/list', getResearchList);
router.post('/item', addResearchItem);
router.put('/item/:id', updateResearchItem);

module.exports = router;
