# SHRED Research MCP Server

A comprehensive MCP server that combines Google search capabilities with AI-powered analysis to research and determine Canadian SHRED (Scientific Research and Experimental Development) tax credit eligibility.

## Features

- **Google Search Integration**: Automatically searches for current SHRED requirements and guidelines
- **AI-Powered Analysis**: Generates detailed prompts for Claude Sonnet 4.5 to analyze task eligibility
- **Comprehensive Research**: Multiple search strategies to gather current SHRED information
- **Professional Reporting**: Structured analysis reports suitable for tax planning
- **Flexible Search Depth**: Basic, comprehensive, or detailed research options

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google API

You need the same Google API setup as the Google Search MCP:

1. **Get a Google API Key** from Google Cloud Console
2. **Create a Custom Search Engine** at Google CSE
3. **Set Environment Variables**:

```bash
cp ../google/env.example .env
```

Edit `.env`:
```
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

### 3. Run the Server

```bash
npm start
```

## Tools Available

### 1. `research_shred_eligibility`

Comprehensive analysis tool that:
- Searches for current SHRED requirements
- Analyzes task descriptions against SHRED criteria
- Generates detailed prompts for Claude Sonnet 4.5

**Parameters:**
- `task_description` (required): The task to analyze
- `company_context` (optional): Company/industry context
- `search_depth` (optional): basic, comprehensive, or detailed

### 2. `search_shred_requirements`

Focused search tool for SHRED requirements:

**Parameters:**
- `search_focus` (optional): general, eligibility_criteria, qualifying_activities, documentation, recent_changes

## Usage Examples

### Basic Eligibility Analysis

```json
{
  "name": "research_shred_eligibility",
  "arguments": {
    "task_description": "Developing machine learning algorithms to optimize energy consumption in manufacturing processes",
    "company_context": "Software company specializing in industrial automation"
  }
}
```

### Detailed Research

```json
{
  "name": "research_shred_eligibility",
  "arguments": {
    "task_description": "Researching new materials for battery technology",
    "company_context": "Clean energy startup",
    "search_depth": "detailed"
  }
}
```

### Focused Requirements Search

```json
{
  "name": "search_shred_requirements",
  "arguments": {
    "search_focus": "eligibility_criteria"
  }
}
```

## Output Format

The server generates comprehensive analysis reports including:

1. **Executive Summary**: Quick determination and confidence level
2. **Detailed Analysis**: Component-by-component assessment
3. **SHRED Criteria Assessment**: Specific criteria evaluation
4. **Recommendations**: Actionable next steps
5. **Documentation Requirements**: Required supporting materials

## Integration with Claude Sonnet 4.5

The generated prompts are specifically designed for Claude Sonnet 4.5 to:

- Research current SHRED program requirements
- Apply advanced tax expertise
- Provide professional-grade analysis
- Deliver actionable recommendations
- Generate compliance-ready documentation

## MCP Client Configuration

```json
{
  "mcpServers": {
    "shred-research": {
      "command": "node",
      "args": ["/path/to/MCP/shred-research/index.js"],
      "env": {
        "GOOGLE_API_KEY": "your_api_key",
        "GOOGLE_SEARCH_ENGINE_ID": "your_search_engine_id"
      }
    }
  }
}
```

## Use Cases

- **Tax Planning**: Comprehensive R&D activity analysis
- **Compliance**: Ensure activities meet SHRED requirements
- **Documentation**: Generate professional analysis reports
- **Research**: Stay current with SHRED program changes
- **Decision Making**: Support strategic R&D investment decisions

## Search Strategies

The server uses multiple search strategies:

- **General Requirements**: Current SHRED program overview
- **Eligibility Criteria**: Specific qualification requirements
- **Qualifying Activities**: Examples of eligible activities
- **Documentation**: Required supporting materials
- **Recent Changes**: Latest program updates

This ensures comprehensive, up-to-date information for accurate analysis.
