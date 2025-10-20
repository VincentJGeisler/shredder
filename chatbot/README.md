# SHRED Chatbot

A simple web-based chatbot for analyzing Canadian SHRED tax credit eligibility. Just describe your task and get an instant analysis!

## Features

- **🎯 Simple Interface**: Just enter your task description and get analysis
- **🔍 Google Search Integration**: Automatically researches current SHRED requirements
- **🤖 AI-Ready**: Generates prompts optimized for Claude Sonnet 4.5
- **📱 Responsive Design**: Works on desktop and mobile
- **⚡ Fast Analysis**: Quick results for decision-making

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google API (Optional)

For full functionality, set up Google Custom Search API:

```bash
cp ../google/env.example .env
```

Edit `.env`:
```
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

### 3. Start the Server

```bash
npm start
```

The chatbot will be available at: http://localhost:3000

## Usage

1. **Open your browser** to http://localhost:3000
2. **Enter your task description** in the text area
3. **Add company context** (optional)
4. **Click "Analyze SHRED Eligibility"**
5. **Get instant analysis** with Google research and AI-ready prompt

## Example Inputs

### Software Development
```
Task: "Developing machine learning algorithms to optimize energy consumption in manufacturing processes"
Company: "Software company specializing in industrial automation"
```

### Research & Development
```
Task: "Researching new materials for battery technology with improved energy density"
Company: "Clean energy startup"
```

### Manufacturing
```
Task: "Testing new manufacturing processes to reduce waste in production"
Company: "Automotive parts manufacturer"
```

## Output

The chatbot provides:

1. **Google Research**: Current SHRED requirements from web search
2. **Analysis Prompt**: Ready-to-use prompt for Claude Sonnet 4.5
3. **Structured Format**: Professional analysis framework
4. **Quick Decision**: YES/NO eligibility with reasoning

## API Endpoints

### POST /api/analyze
Analyze a task for SHRED eligibility.

**Request:**
```json
{
  "task_description": "Your task description",
  "company_context": "Optional company context"
}
```

**Response:**
```json
{
  "success": true,
  "analysis_prompt": "Generated prompt for Claude Sonnet 4.5",
  "shred_research": "Google search results",
  "task_description": "Your task",
  "company_context": "Your context"
}
```

### GET /api/health
Check server status and Google API configuration.

## Development

```bash
# Start with auto-reload
npm run dev

# Production start
npm start
```

## Configuration

The server runs on port 3000 by default. Set the `PORT` environment variable to change:

```bash
PORT=8080 npm start
```

## Troubleshooting

### Google API Not Working
- Check that `GOOGLE_API_KEY` and `GOOGLE_SEARCH_ENGINE_ID` are set correctly
- Verify the API key has Custom Search API enabled
- Ensure the search engine ID is correct

### Server Won't Start
- Make sure port 3000 is available
- Check that all dependencies are installed (`npm install`)
- Verify Node.js version compatibility

## Use Cases

- **Quick Eligibility Check**: Fast analysis for R&D activities
- **Tax Planning**: Determine if activities qualify for SHRED credits
- **Project Evaluation**: Assess new projects for tax benefits
- **Documentation**: Generate analysis prompts for professional review
