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

class GoogleSearchMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'google-search-mcp',
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
            name: 'google_search',
            description: 'Search Google for information on any topic',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'The search query to execute',
                },
                num_results: {
                  type: 'number',
                  description: 'Number of search results to return (default: 10, max: 10)',
                  default: 10,
                  minimum: 1,
                  maximum: 10,
                },
              },
              required: ['query'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'google_search') {
        return await this.handleGoogleSearch(request.params.arguments);
      }
      throw new Error(`Unknown tool: ${request.params.name}`);
    });
  }

  async handleGoogleSearch(args) {
    const { query, num_results = 10 } = args;

    if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Google API key or Search Engine ID not configured. Please set GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID environment variables.',
          },
        ],
      };
    }

    try {
      const response = await this.customsearch.cse.list({
        auth: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: query,
        num: Math.min(num_results, 10),
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
            text: `# Google Search Results for: "${query}"\n\nFound ${results.length} results:\n\n`,
          },
          ...formattedResults,
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error performing Google search: ${error.message}`,
          },
        ],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Google Search MCP server running on stdio');
  }
}

const server = new GoogleSearchMCPServer();
server.run().catch(console.error);
