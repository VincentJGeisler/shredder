#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class SHREDAnalyzerMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'shred-analyzer-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'analyze_shred_eligibility',
            description: 'Analyze if a daily task description fits within the Canadian SHRED tax credit program definition',
            inputSchema: {
              type: 'object',
              properties: {
                task_description: {
                  type: 'string',
                  description: 'The daily task description to analyze for SHRED eligibility',
                },
                company_context: {
                  type: 'string',
                  description: 'Optional context about the company or industry (e.g., "software development company", "manufacturing")',
                },
              },
              required: ['task_description'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'analyze_shred_eligibility') {
        return await this.handleSHREDAnalysis(request.params.arguments);
      }
      throw new Error(`Unknown tool: ${request.params.name}`);
    });
  }

  async handleSHREDAnalysis(args) {
    const { task_description, company_context = '' } = args;

    // Create a comprehensive prompt for Claude Sonnet 4.5 to analyze SHRED eligibility
    const analysisPrompt = this.createSHREDAnalysisPrompt(task_description, company_context);

    return {
      content: [
        {
          type: 'text',
          text: `# SHRED Tax Credit Eligibility Analysis

## Task Description:
${task_description}

${company_context ? `## Company Context:
${company_context}` : ''}

## Analysis Prompt for Claude Sonnet 4.5:

${analysisPrompt}

---

**Note:** This prompt is designed to be used with Claude Sonnet 4.5 to perform a comprehensive analysis of SHRED tax credit eligibility. The AI should research the current SHRED program requirements and provide detailed reasoning for the eligibility determination.`,
        },
      ],
    };
  }

  createSHREDAnalysisPrompt(taskDescription, companyContext) {
    return `You are a tax expert specializing in Canadian tax credits. Please analyze the following task description to determine if it qualifies for the Canadian SHRED (Scientific Research and Experimental Development) tax credit program.

**Task to Analyze:**
"${taskDescription}"

${companyContext ? `**Company Context:** ${companyContext}` : ''}

**Instructions:**
1. First, research and provide the current definition and requirements of the Canadian SHRED tax credit program
2. Analyze the task description against SHRED criteria including:
   - Scientific or technological advancement
   - Systematic investigation
   - Technical uncertainty resolution
   - Experimental development activities
3. Determine if the task fits within SHRED parameters
4. Provide detailed reasoning for your conclusion
5. If eligible, explain which specific SHRED criteria the task meets
6. If not eligible, explain what would be needed to qualify

**Required Output Format:**
- **SHRED Definition:** [Current program definition and requirements]
- **Task Analysis:** [Detailed analysis of the specific task]
- **Eligibility Determination:** [YES/NO with clear reasoning]
- **Reasoning:** [Detailed explanation of why the task does/doesn't qualify]
- **Recommendations:** [If not eligible, what changes would make it eligible]

Please provide a thorough, professional analysis suitable for tax planning purposes.`;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('SHRED Analyzer MCP server running on stdio');
  }
}

const server = new SHREDAnalyzerMCPServer();
server.run().catch(console.error);
