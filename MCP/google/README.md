# Google Search MCP Server

A simple Model Context Protocol (MCP) server that provides Google search functionality.

## Features

- Search Google using the Custom Search API
- Configurable number of results (1-10)
- Formatted search results with titles, URLs, and snippets
- Error handling and validation

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google API

You need to set up Google Custom Search API:

1. **Get a Google API Key:**
   - Go to [Google Cloud Console](https://console.developers.google.com/)
   - Create a new project or select an existing one
   - Enable the "Custom Search API"
   - Create credentials (API Key)

2. **Create a Custom Search Engine:**
   - Go to [Google Custom Search](https://cse.google.com/cse/)
   - Create a new search engine
   - Copy the Search Engine ID

3. **Configure Environment Variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   GOOGLE_SEARCH_ENGINE_ID=your_actual_search_engine_id_here
   ```

### 3. Run the Server

```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

## Usage

The MCP server provides a single tool called `google_search` with the following parameters:

- `query` (required): The search query string
- `num_results` (optional): Number of results to return (1-10, default: 10)

### Example MCP Client Configuration

Add this to your MCP client configuration:

```json
{
  "mcpServers": {
    "google-search": {
      "command": "node",
      "args": ["/path/to/your/google-search-mcp/index.js"],
      "env": {
        "GOOGLE_API_KEY": "your_api_key",
        "GOOGLE_SEARCH_ENGINE_ID": "your_search_engine_id"
      }
    }
  }
}
```

## API Limits

- Google Custom Search API has a free tier of 100 queries per day
- Each search can return up to 10 results
- For higher limits, you may need to enable billing in Google Cloud Console

## Error Handling

The server handles various error conditions:
- Missing API credentials
- Invalid search queries
- API rate limits
- Network errors

All errors are returned as formatted text responses to the MCP client.
