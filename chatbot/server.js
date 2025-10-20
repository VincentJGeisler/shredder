#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import Anthropic from '@anthropic-ai/sdk';
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

// Initialize Claude API
let anthropic;
if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
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

**CRITICAL ANALYSIS INSTRUCTIONS:**

⚠️ **IMPORTANT EXCLUSIONS - These activities DO NOT qualify for SHRED:**
- Standard software development lifecycle (SDLC) tasks
- Routine deployment, setup, configuration, or maintenance
- Standard testing, monitoring, or operational tasks
- Following established procedures or best practices
- Planning phases for standard development work
- Production deployments using existing technologies
- Routine database operations or standard architecture work

✅ **SHRED REQUIRES ALL THREE CRITERIA:**
1. **Scientific/Technological Advancement**: Must advance scientific or technological knowledge beyond current state-of-the-art
2. **Systematic Investigation**: Must involve systematic approach to resolve technical uncertainty
3. **Technical Uncertainty**: Must involve technical problems where the solution is not readily apparent or available

🎯 **POTENTIAL SHRED ACTIVITIES - These MAY qualify if they meet the three criteria:**
- Performance optimization research with technical uncertainty
- Throughput testing to resolve novel technical challenges
- Investigation of new approaches to solve technical problems
- Research into emerging technologies or methodologies
- Experimental development of new solutions
- Systematic investigation of technical unknowns

**ANALYSIS FRAMEWORK:**
1. **BREAK DOWN THE TASK**: Split the task description into individual components/activities
2. **Evaluate each component separately**:
   - Check exclusions for each part
   - Look for potential SHRED indicators in each part
   - Evaluate SHRED criteria for each part individually
   - Assess innovation level for each part
3. **Provide component-by-component analysis**: List each activity and its eligibility
4. **Overall determination**: Based on the component analysis
5. **When in doubt, ask clarifying questions**: If any component is ambiguous, request more details

**REQUIRED OUTPUT FORMAT:**

## SHRED Eligibility Analysis

### Task Breakdown
**Component Analysis:** [Break down the task into individual activities and evaluate each separately]

### Component-by-Component Evaluation
1. **[Activity 1]**: [Eligible/Not Eligible] - [Brief reasoning]
2. **[Activity 2]**: [Eligible/Not Eligible] - [Brief reasoning]
3. **[Activity 3]**: [Eligible/Not Eligible] - [Brief reasoning]
[Continue for each component...]

### Overall Assessment
**Overall Eligible:** [YES/NO/PARTIAL]
**Confidence:** [High/Medium/Low]

### Reasoning
[2-3 sentences explaining the overall determination based on component analysis]

### Eligible Components
- [List only the components that qualify for SHRED]

### Non-Eligible Components
- [List components that don't qualify and why]

### Follow-up Questions Needed
**ALWAYS provide follow-up questions when:**
- Confidence is Medium or Low
- Any component involves testing, research, investigation, or performance work
- Component descriptions are ambiguous about technical uncertainty
- You cannot definitively determine eligibility for any component

**List 2-3 specific questions that would help clarify eligibility. Focus on:**
- Technical uncertainty being resolved in specific components
- Innovation level and advancement beyond current state-of-the-art
- Systematic investigation methods being used
- Novel approaches or experimental development

### Recommendations
- [If eligible: What documentation is needed for eligible components]
- [If partial: How to separate eligible from non-eligible work]
- [If not eligible: What changes would make components eligible]

Please provide a thorough component-by-component analysis that emphasizes the innovation and advancement requirements of SHRED.`;
}

// Claude API function
async function getClaudeAnalysis(prompt) {
  if (!anthropic) {
    throw new Error('Claude API not configured. Please set ANTHROPIC_API_KEY environment variable.');
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return response.content[0].text;
  } catch (error) {
    throw new Error(`Claude API error: ${error.message}`);
  }
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

    // Get Claude analysis
    let claudeAnalysis = null;
    let claudeError = null;
    
    try {
      claudeAnalysis = await getClaudeAnalysis(analysisPrompt);
    } catch (error) {
      claudeError = error.message;
    }

    res.json({
      success: true,
      task_description,
      company_context,
      shred_research: shredInfo,
      claude_analysis: claudeAnalysis,
      claude_error: claudeError,
      analysis_prompt: claudeError ? analysisPrompt : null // Only show prompt if Claude failed
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
    google_configured: !!(process.env.GOOGLE_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID),
    claude_configured: !!process.env.ANTHROPIC_API_KEY
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
