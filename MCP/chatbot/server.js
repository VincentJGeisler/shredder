#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Google Custom Search API
let customsearch;
if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID) {
  customsearch = google.customsearch('v1');
}

// Google Search function
async function searchSHREDRequirements() {
  if (!customsearch) {
    return "Google API not configured. Please set GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID environment variables.";
  }

  const queries = [
    'Canadian SHRED tax credit 2024 requirements',
    'SHRED scientific research experimental development Canada',
    'SHRED tax credit eligibility criteria Canada'
  ];

  let results = '';
  
  for (const query of queries.slice(0, 2)) { // Limit to 2 queries for speed
    try {
      const response = await customsearch.cse.list({
        auth: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: query,
        num: 3,
      });

      const items = response.data.items || [];
      if (items.length > 0) {
        results += `**${query}:**\n`;
        items.forEach((item, index) => {
          results += `${index + 1}. ${item.title}\n   ${item.snippet}\n   ${item.link}\n\n`;
        });
        results += '---\n\n';
      }
    } catch (error) {
      results += `**${query}:** Error - ${error.message}\n\n`;
    }
  }

  return results || "No search results found.";
}

// Create analysis prompt
function createAnalysisPrompt(taskDescription, companyContext, shredInfo) {
  return `You are a senior tax expert specializing in Canadian SHRED (Scientific Research and Experimental Development) tax credits. 

**CURRENT SHRED REQUIREMENTS:**
${shredInfo}

**TASK TO ANALYZE:**
"${taskDescription}"

${companyContext ? `**COMPANY CONTEXT:** ${companyContext}` : ''}

**ANALYSIS INSTRUCTIONS:**
1. Review the SHRED requirements above
2. Analyze the task against SHRED criteria:
   - Scientific/Technological Advancement
   - Systematic Investigation  
   - Technical Uncertainty Resolution
   - Experimental Development

**REQUIRED OUTPUT FORMAT:**

## SHRED Eligibility Analysis

### Quick Answer
**Eligible:** [YES/NO]
**Confidence:** [High/Medium/Low]

### Reasoning
[2-3 sentences explaining why the task does/doesn't qualify for SHRED]

### Key Criteria Met
- [List specific SHRED criteria the task meets, or "None" if not eligible]

### Recommendations
- [If eligible: What documentation is needed]
- [If not eligible: What changes would make it eligible]

Please provide a clear, concise analysis suitable for quick decision-making.`;
}

// API Routes
app.post('/api/analyze', async (req, res) => {
  try {
    const { task_description, company_context = '' } = req.body;

    if (!task_description) {
      return res.status(400).json({ error: 'Task description is required' });
    }

    // Get SHRED requirements
    const shredInfo = await searchSHREDRequirements();
    
    // Create analysis prompt
    const analysisPrompt = createAnalysisPrompt(task_description, company_context, shredInfo);

    res.json({
      success: true,
      analysis_prompt: analysisPrompt,
      shred_research: shredInfo,
      task_description,
      company_context
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    google_configured: !!(process.env.GOOGLE_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID)
  });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SHRED Chatbot server running on http://localhost:${PORT}`);
  console.log(`Google API configured: ${!!(process.env.GOOGLE_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID)}`);
});
