#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class SHREDResearchMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'shred-research-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupGoogleAPI();
  }

  setupGoogleAPI() {
    // Initialize Google Custom Search API
    this.customsearch = google.customsearch('v1');
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'research_shred_eligibility',
            description: 'Research SHRED tax credit requirements and analyze task eligibility using Google search and AI reasoning',
            inputSchema: {
              type: 'object',
              properties: {
                task_description: {
                  type: 'string',
                  description: 'The daily task description to analyze for SHRED eligibility',
                },
                company_context: {
                  type: 'string',
                  description: 'Optional context about the company or industry',
                },
                search_depth: {
                  type: 'string',
                  description: 'Search depth: basic, comprehensive, or detailed',
                  enum: ['basic', 'comprehensive', 'detailed'],
                  default: 'comprehensive',
                },
              },
              required: ['task_description'],
            },
          },
          {
            name: 'search_shred_requirements',
            description: 'Search for current SHRED tax credit requirements and guidelines',
            inputSchema: {
              type: 'object',
              properties: {
                search_focus: {
                  type: 'string',
                  description: 'Specific aspect to focus search on',
                  enum: ['general', 'eligibility_criteria', 'qualifying_activities', 'documentation', 'recent_changes'],
                  default: 'general',
                },
              },
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'research_shred_eligibility') {
        return await this.handleSHREDResearch(request.params.arguments);
      } else if (request.params.name === 'search_shred_requirements') {
        return await this.handleSHREDSearch(request.params.arguments);
      }
      throw new Error(`Unknown tool: ${request.params.name}`);
    });
  }

  async handleSHREDResearch(args) {
    const { task_description, company_context = '', search_depth = 'comprehensive' } = args;

    // First, search for current SHRED requirements
    const shredInfo = await this.searchSHREDRequirements(search_depth);
    
    // Create comprehensive analysis prompt
    const analysisPrompt = this.createComprehensiveAnalysisPrompt(
      task_description, 
      company_context, 
      shredInfo
    );

    return {
      content: [
        {
          type: 'text',
          text: `# SHRED Tax Credit Eligibility Research & Analysis

## Task Description:
${task_description}

${company_context ? `## Company Context:
${company_context}` : ''}

## Current SHRED Requirements Research:
${shredInfo}

---

## Comprehensive Analysis Prompt for Claude Sonnet 4.5:

${analysisPrompt}`,
        },
      ],
    };
  }

  async handleSHREDSearch(args) {
    const { search_focus = 'general' } = args;
    
    const searchQueries = this.getSHREDSearchQueries(search_focus);
    const searchResults = [];

    for (const query of searchQueries) {
      try {
        const results = await this.performGoogleSearch(query, 5);
        searchResults.push({
          query,
          results: results.content
        });
      } catch (error) {
        searchResults.push({
          query,
          error: error.message
        });
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `# SHRED Tax Credit Requirements Research

## Search Results:

${searchResults.map(sr => 
  sr.error 
    ? `**Query:** ${sr.query}\n**Error:** ${sr.error}\n\n`
    : `**Query:** ${sr.query}\n${sr.results.map(r => r.text).join('\n')}\n\n`
).join('---\n\n')}`,
        },
      ],
    };
  }

  getSHREDSearchQueries(focus) {
    const baseQueries = {
      general: [
        'Canadian SHRED tax credit 2024 requirements',
        'SHRED scientific research experimental development Canada',
        'SHRED tax credit eligibility criteria Canada'
      ],
      eligibility_criteria: [
        'SHRED tax credit eligibility criteria 2024',
        'what activities qualify for SHRED tax credit',
        'SHRED qualifying activities Canada CRA'
      ],
      qualifying_activities: [
        'SHRED qualifying R&D activities Canada',
        'experimental development SHRED tax credit',
        'scientific research SHRED eligibility'
      ],
      documentation: [
        'SHRED tax credit documentation requirements',
        'SHRED claim documentation CRA',
        'SHRED tax credit supporting documents'
      ],
      recent_changes: [
        'SHRED tax credit changes 2024',
        'recent SHRED program updates Canada',
        'SHRED tax credit new requirements 2024'
      ]
    };

    return baseQueries[focus] || baseQueries.general;
  }

  async searchSHREDRequirements(depth) {
    const queries = this.getSHREDSearchQueries('general');
    let results = '';

    for (const query of queries.slice(0, depth === 'basic' ? 1 : depth === 'comprehensive' ? 2 : 3)) {
      try {
        const searchResult = await this.performGoogleSearch(query, 3);
        results += `**Search Query:** ${query}\n${searchResult.content.map(r => r.text).join('\n')}\n\n---\n\n`;
      } catch (error) {
        results += `**Search Query:** ${query}\n**Error:** ${error.message}\n\n---\n\n`;
      }
    }

    return results;
  }

  async performGoogleSearch(query, numResults = 5) {
    if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
      throw new Error('Google API credentials not configured');
    }

    const response = await this.customsearch.cse.list({
      auth: process.env.GOOGLE_API_KEY,
      cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
      q: query,
      num: Math.min(numResults, 10),
    });

    const results = response.data.items || [];

    if (results.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No search results found for query: "${query}"`,
          },
        ],
      };
    }

    const formattedResults = results.map((item, index) => {
      return {
        type: 'text',
        text: `**Result ${index + 1}:**
**Title:** ${item.title}
**URL:** ${item.link}
**Snippet:** ${item.snippet || 'No description available'}

---`,
      };
    });

    return {
      content: [
        {
          type: 'text',
          text: `# Search Results for: "${query}"\n\nFound ${results.length} results:\n\n`,
        },
        ...formattedResults,
      ],
    };
  }

  createComprehensiveAnalysisPrompt(taskDescription, companyContext, shredInfo) {
    return `You are a senior tax expert specializing in Canadian tax credits, particularly the SHRED (Scientific Research and Experimental Development) program. You have access to current SHRED requirements and need to analyze a specific task for eligibility.

**CURRENT SHRED REQUIREMENTS RESEARCH:**
${shredInfo}

**TASK TO ANALYZE:**
"${taskDescription}"

${companyContext ? `**COMPANY CONTEXT:** ${companyContext}` : ''}

**ANALYSIS INSTRUCTIONS:**

1. **SHRED Program Understanding:**
   - Review the current SHRED requirements from the research above
   - Identify the key eligibility criteria and qualifying activities
   - Note any recent changes or updates to the program

2. **Task Analysis Framework:**
   Analyze the task against these SHRED criteria:
   - **Scientific or Technological Advancement**: Does the task seek to advance scientific or technological knowledge?
   - **Systematic Investigation**: Is there a systematic approach to resolving technical uncertainty?
   - **Technical Uncertainty**: Does the task involve resolving technical problems where the solution is not readily apparent?
   - **Experimental Development**: Does the task involve experimental work to achieve technological advancement?

3. **Detailed Assessment:**
   - Break down the task into its component activities
   - Evaluate each component against SHRED criteria
   - Consider the company context and industry standards
   - Assess the level of technical uncertainty involved

4. **Professional Determination:**
   - Provide a clear YES/NO eligibility determination
   - Support your conclusion with specific reasoning
   - Reference relevant SHRED criteria and requirements
   - Consider potential challenges or limitations

**REQUIRED OUTPUT FORMAT:**

## SHRED Eligibility Analysis Report

### Executive Summary
- **Task:** [Brief description]
- **Eligibility Determination:** [YES/NO]
- **Confidence Level:** [High/Medium/Low]
- **Key Reasoning:** [2-3 sentence summary]

### Detailed Analysis

#### 1. SHRED Criteria Assessment
- **Scientific/Technological Advancement:** [Analysis and reasoning]
- **Systematic Investigation:** [Analysis and reasoning]
- **Technical Uncertainty:** [Analysis and reasoning]
- **Experimental Development:** [Analysis and reasoning]

#### 2. Task Breakdown
- **Primary Activities:** [List and analyze each major activity]
- **Technical Challenges:** [Identify specific technical problems being solved]
- **Innovation Level:** [Assess the degree of innovation and advancement]

#### 3. Eligibility Determination
- **Overall Assessment:** [Comprehensive reasoning for the determination]
- **Supporting Evidence:** [Specific examples from the task that support the determination]
- **Potential Concerns:** [Any aspects that might challenge eligibility]

#### 4. Recommendations
- **If Eligible:** [Specific documentation and evidence needed to support the claim]
- **If Not Eligible:** [Specific changes or modifications needed to qualify]
- **Next Steps:** [Recommended actions for the company]

#### 5. Documentation Requirements
- **Required Documentation:** [List of documents needed to support the SHRED claim]
- **Evidence Collection:** [Specific evidence that should be gathered]
- **Record Keeping:** [Recommended record-keeping practices]

### Professional Notes
- **Risk Assessment:** [Potential risks or challenges with this determination]
- **Alternative Approaches:** [Other ways the task might be structured to qualify]
- **Industry Context:** [How similar activities are typically handled in the industry]

Please provide a thorough, professional analysis suitable for tax planning and compliance purposes. Your analysis should be detailed enough to support decision-making and documentation requirements.`;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('SHRED Research MCP server running on stdio');
  }
}

const server = new SHREDResearchMCPServer();
server.run().catch(console.error);
