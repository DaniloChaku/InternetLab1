const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const xml2js = require('xml2js');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// File paths
const JSON_FILE = path.join(
  __dirname,
  'data',
  'records.json'
);
const XML_FILE = path.join(
  __dirname,
  'data',
  'records.xml'
);

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir);
  }
}

// Initialize files if they don't exist
async function initializeFiles() {
  await ensureDataDir();

  try {
    await fs.access(JSON_FILE);
  } catch {
    await fs.writeFile(JSON_FILE, JSON.stringify([]));
  }

  try {
    await fs.access(XML_FILE);
  } catch {
    const builder = new xml2js.Builder();
    const xml = builder.buildObject({
      records: { record: [] },
    });
    await fs.writeFile(XML_FILE, xml);
  }
}

// Save records to both JSON and XML
async function saveRecords(records) {
  // Save to JSON
  await fs.writeFile(
    JSON_FILE,
    JSON.stringify(records, null, 2)
  );

  // Save to XML
  const builder = new xml2js.Builder();
  const xml = builder.buildObject({
    records: { record: records },
  });
  await fs.writeFile(XML_FILE, xml);
}

// Get all records
app.get('/records', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading records:', error);
    res
      .status(500)
      .json({ error: 'Error reading records' });
  }
});

// Create new record
app.post('/records', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    const records = JSON.parse(data);

    const newRecord = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };

    records.push(newRecord);
    await saveRecords(records);

    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error creating record:', error);
    res
      .status(500)
      .json({ error: 'Error creating record' });
  }
});

// Update record
app.put('/records/:id', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    let records = JSON.parse(data);

    const index = records.findIndex(
      (r) => r.id === req.params.id
    );
    if (index === -1) {
      return res
        .status(404)
        .json({ error: 'Record not found' });
    }

    records[index] = {
      ...records[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString(),
    };

    await saveRecords(records);

    res.json(records[index]);
  } catch (error) {
    console.error('Error updating record:', error);
    res
      .status(500)
      .json({ error: 'Error updating record' });
  }
});

// Delete record
app.delete('/records/:id', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    let records = JSON.parse(data);

    records = records.filter((r) => r.id !== req.params.id);
    await saveRecords(records);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting record:', error);
    res
      .status(500)
      .json({ error: 'Error deleting record' });
  }
});

// Initialize files and start server
initializeFiles().then(() => {
  app.listen(port, () => {
    console.log(
      `Server running at http://localhost:${port}`
    );
  });
});
