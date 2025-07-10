const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// making the uploaded vids go to dir called uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});



// get every single video
app.get('/api/videos', (req, res) => {
  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.error('Error reading data.json:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    try {
      const videos = JSON.parse(data);
      console.log(`Returning ${videos.length} videos`);
      res.json(videos);
    } catch (parseError) {
      console.error('Error parsing data.json:', parseError);
      res.status(500).json({ error: 'Data corruption detected' });
    }
  });
});

// handle the file uploads
app.post('/upload', upload.array('videos', 3), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No videos uploaded');
    }

    const { title } = req.body;
    if (!title) {
      return res.status(400).send('Game title is required');
    }

    const newEntries = req.files.map(file => ({
      title: title.trim(),
      url: `/uploads/${file.filename}`,
      uploadedAt: new Date().toISOString()
    }));

    fs.readFile('data.json', (err, data) => {
      let existingData = [];
      if (!err && data) {
        try {
          existingData = JSON.parse(data);
        } catch (parseError) {
          console.error('Error parsing existing data:', parseError);
        }
      }

      const updatedData = [...existingData, ...newEntries];
      
      fs.writeFile('data.json', JSON.stringify(updatedData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing data:', writeErr);
          return res.status(500).send('Failed to save data');
        }
        
        console.log(`Successfully added ${newEntries.length} videos for "${title}"`);
        res.redirect('/');
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).send('Internal server error');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {

  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }
  

  if (!fs.existsSync('data.json')) {
    fs.writeFileSync('data.json', '[]', 'utf8');
  }
  
  console.log(`
  Server running on http://localhost:${PORT}
  --------------------------------
  Admin interface:   /admin.html
  Main showcase:     /
  API Endpoint:      /api/videos
  `);
});

// Error handling 
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});