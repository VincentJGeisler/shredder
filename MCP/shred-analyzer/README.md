# SHRED Analyzer MCP Server

An MCP server that generates comprehensive prompts for analyzing Canadian SHRED (Scientific Research and Experimental Development) tax credit eligibility.

## Features

- Generates detailed analysis prompts for Claude Sonnet 4.5
- Analyzes task descriptions against SHRED criteria
- Provides structured reasoning framework
- Includes company context consideration
- Professional tax analysis format

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Server

```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

## Usage

The MCP server provides a single tool called `analyze_shred_eligibility` with the following parameters:

- `task_description` (required): The daily task description to analyze
- `company_context` (optional): Additional context about the company or industry

### Example Usage

```json
{
  "name": "analyze_shred_eligibility",
  "arguments": {
    "task_description": "Developing machine learning algorithms to optimize energy consumption in manufacturing processes",
    "company_context": "Software company specializing in industrial automation"
  }
}
```

## Output

The server generates a comprehensive prompt that includes:

1. **SHRED Definition Research**: Instructions to research current SHRED requirements
2. **Task Analysis Framework**: Structured approach to analyze the specific task
3. **Eligibility Determination**: Clear YES/NO with reasoning
4. **Detailed Reasoning**: Professional explanation of the determination
5. **Recommendations**: Guidance for making tasks eligible if needed

## Integration with Claude Sonnet 4.5

The generated prompt is specifically designed for Claude Sonnet 4.5 to:

- Research current SHRED program requirements
- Apply tax expertise to analyze task eligibility
- Provide professional-grade reasoning
- Deliver actionable recommendations

## MCP Client Configuration

Add this to your MCP client configuration:

```json
{
  "mcpServers": {
    "shred-analyzer": {
      "command": "node",
      "args": ["/path/to/MCP/shred-analyzer/index.js"]
    }
  }
}
```

## Use Cases

- **Tax Planning**: Determine if R&D activities qualify for SHRED credits
- **Project Analysis**: Evaluate specific tasks for tax credit eligibility
- **Compliance**: Ensure activities meet SHRED requirements
- **Documentation**: Generate professional analysis for tax purposes
