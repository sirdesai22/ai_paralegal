const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { v4: uuidv4 } = require('uuid');

const upload = multer({ dest: 'uploads/' });
const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4000;

// --- In-memory data ---
let documents = [];
let tasks = [];
let calendar = [];
let analysisResults = {};

// --- Document Upload & AI Analysis (stub) ---
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  let fileType = req.file.mimetype;
  let text = '';
  try {
    if (fileType === 'application/pdf') {
      const data = fs.readFileSync(req.file.path);
      text = (await pdfParse(data)).text;
    } else {
      text = fs.readFileSync(req.file.path, 'utf8');
    }
    fs.unlinkSync(req.file.path);
  } catch (err) {
    fs.unlinkSync(req.file.path);
    return res.status(500).json({ error: err.message });
  }

  const id = uuidv4();
  documents.push({ id, name: req.file.originalname, type: fileType, text, uploadedAt: new Date() });
  res.json({ id, name: req.file.originalname });
});

// --- Document Analysis (stub only) ---
app.post('/analyze', (req, res) => {
  const { documentId, agent } = req.body;
  if (!documentId || !agent) return res.status(400).json({ error: 'Missing fields' });
  const analysisId = uuidv4();
  analysisResults[analysisId] = {
    summary: 'Stub summary for document ' + documentId,
    keyPoints: ['Point one', 'Point two'],
    issues: ['Issue one', 'Issue two'],
    citations: ['Citation1', 'Citation2']
  };
  res.json({ analysisId });
});

app.get('/results/:id', (req, res) => {
  if (!analysisResults[req.params.id]) return res.status(404).end();
  res.json(analysisResults[req.params.id]);
});

// --- Task Management ---
// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Add new task (usable from Calendar or elsewhere)
app.post('/tasks', (req, res) => {
  const { name, deadline, priority, type } = req.body;
  if (!name || !deadline || !priority || !type) {
    return res.status(400).json({ error: 'Missing required fields: name, deadline, priority, type' });
  }
  const newTask = {
    id: uuidv4(),
    name,
    deadline: new Date(deadline),
    priority,
    type,
    status: 'in-progress'
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Remove a task
app.delete('/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== req.params.id);
  res.json({ success: true });
});

// Update task status
app.patch('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (req.body.status) task.status = req.body.status;
  res.json(task);
});

// Task filtering
app.get('/tasks/filter', (req, res) => {
  let filtered = tasks;
  if (req.query.priority) filtered = filtered.filter(t => t.priority === req.query.priority);
  if (req.query.type) filtered = filtered.filter(t => t.type === req.query.type);
  if (req.query.status) filtered = filtered.filter(t => t.status === req.query.status);
  res.json(filtered);
});

// --- Calendar Integration ---
// Get upcoming tasks/events
app.get('/calendar', (req, res) => {
  const now = new Date();
  res.json(tasks.filter(t => new Date(t.deadline) > now));
});

// Add event to calendar (manual calendar array, optional)
app.post('/calendar/add', (req, res) => {
  const { taskId } = req.body;
  const found = tasks.find(t => t.id === taskId);
  if (!found) return res.status(404).json({ error: 'Task not found' });
  // To prevent duplicates
  if (!calendar.find(e => e.taskId === taskId)) calendar.push({ ...found, taskId });
  res.json({ success: true });
});

// Remove event from calendar
app.post('/calendar/remove', (req, res) => {
  calendar = calendar.filter(e => e.taskId !== req.body.taskId);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log('Backend running on ' + PORT);
});
