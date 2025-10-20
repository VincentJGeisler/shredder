# SHRED Tax Credit Analysis System

A comprehensive system for analyzing Canadian SHRED (Scientific Research and Experimental Development) tax credit eligibility using AI and web search integration.

## 🏗️ System Architecture

This project consists of multiple components working together to provide professional-grade SHRED analysis:

```mermaid
graph TB
    subgraph "User Interface"
        UI[Web Browser<br/>HTML/CSS/JavaScript]
    end
    
    subgraph "Backend Services"
        WEB[Express.js Server<br/>Port 3000]
        API[Claude Sonnet 4.5 API<br/>Anthropic]
        GOOGLE[Google Custom Search API<br/>Real-time SHRED Research]
    end
    
    subgraph "MCP Servers (Optional)"
        MCP_GOOGLE[Google Search MCP<br/>Standalone Tool]
        MCP_ANALYZER[SHRED Analyzer MCP<br/>Prompt Generator]
        MCP_RESEARCH[SHRED Research MCP<br/>Combined Analysis]
    end
    
    subgraph "Data Flow"
        ENV[Environment Variables<br/>API Keys & Configuration]
    end
    
    UI -->|HTTP Requests| WEB
    WEB -->|Search Queries| GOOGLE
    WEB -->|Analysis Prompts| API
    API -->|SHRED Analysis| WEB
    GOOGLE -->|Research Results| WEB
    WEB -->|Formatted Response| UI
    
    MCP_GOOGLE -.->|Alternative Access| MCP_RESEARCH
    MCP_ANALYZER -.->|Prompt Generation| MCP_RESEARCH
    
    ENV --> WEB
    ENV --> MCP_GOOGLE
    ENV --> MCP_RESEARCH
```

## 📁 Project Structure

```mermaid
graph TD
    ROOT["/Users/vince/carol test/"]
    
    ROOT --> CHATBOT["chatbot/ 🎯 Main Web Application"]
    ROOT --> MCP["MCP/ 🔧 Model Context Protocol Servers"]
    
    CHATBOT --> CB_PKG["package.json<br/>Node.js dependencies"]
    CHATBOT --> CB_SERVER["server.js<br/>Express.js server with API integration"]
    CHATBOT --> CB_PUBLIC["public/<br/>Frontend files"]
    CHATBOT --> CB_README["README.md<br/>Chatbot documentation"]
    
    CB_PUBLIC --> CB_HTML["index.html<br/>Web interface"]
    
    MCP --> MCP_GOOGLE["google/ 📍 Google Search MCP"]
    MCP --> MCP_ANALYZER["shred-analyzer/ 🔍 Simple SHRED Analysis"]
    MCP --> MCP_RESEARCH["shred-research/ 🔬 Advanced SHRED Research"]
    
    MCP_GOOGLE --> MG_INDEX["index.js<br/>MCP server implementation"]
    MCP_GOOGLE --> MG_PKG["package.json<br/>MCP dependencies"]
    MCP_GOOGLE --> MG_ENV["env.example<br/>API configuration template"]
    
    MCP_ANALYZER --> MA_INDEX["index.js<br/>Prompt generation MCP"]
    MCP_ANALYZER --> MA_PKG["package.json<br/>MCP dependencies"]
    
    MCP_RESEARCH --> MR_INDEX["index.js<br/>Combined Google + AI analysis"]
    MCP_RESEARCH --> MR_PKG["package.json<br/>Full dependencies"]
    MCP_RESEARCH --> MR_README["README.md<br/>MCP documentation"]
```

## 🔄 System Flow

### 1. Main Chatbot Flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant UI as 🌐 Web Interface
    participant Server as 🖥️ Express Server
    participant Google as 🔍 Google API
    participant Claude as 🤖 Claude API
    
    User->>UI: Enter task description + company context
    UI->>Server: POST /api/analyze
    Server->>Google: Search SHRED requirements
    Google-->>Server: Current SHRED info
    Server->>Server: Create analysis prompt
    Server->>Claude: Send prompt for analysis
    Claude-->>Server: SHRED eligibility analysis
    Server-->>UI: Formatted response
    UI-->>User: Display analysis + follow-up questions
```

### 2. MCP Server Architecture

```mermaid
graph LR
    subgraph "MCP Protocol"
        CLIENT[MCP Client<br/>Cursor/Claude Desktop]
        TRANSPORT[Stdio Transport<br/>stdin/stdout]
        SERVER[MCP Server<br/>Node.js Process]
    end
    
    subgraph "Tool Registration"
        LIST_TOOLS[ListTools Request]
        CALL_TOOL[CallTool Request]
    end
    
    subgraph "Our MCP Servers"
        GOOGLE_TOOL[google_search]
        ANALYZE_TOOL[analyze_shred_eligibility]
        RESEARCH_TOOL[research_shred_eligibility]
    end
    
    CLIENT -->|Connect| TRANSPORT
    TRANSPORT -->|Connect| SERVER
    CLIENT -->|ListTools| LIST_TOOLS
    LIST_TOOLS -->|Available Tools| CLIENT
    CLIENT -->|CallTool| CALL_TOOL
    CALL_TOOL --> GOOGLE_TOOL
    CALL_TOOL --> ANALYZE_TOOL
    CALL_TOOL --> RESEARCH_TOOL
```

## 🛠️ How MCP (Model Context Protocol) Works

### MCP Overview

MCP is a protocol that allows AI assistants to connect to external tools and services. Think of it as a standardized way for AI to "plug into" different capabilities.

### Our MCP Servers Explained

#### 1. Google Search MCP (`MCP/google/`)

**Purpose**: Provides Google search capabilities to AI assistants

```mermaid
graph TD
    A[MCP Client Request] --> B[google_search tool]
    B --> C[Google Custom Search API]
    C --> D[Search Results]
    D --> E[Formatted Response]
    E --> F[MCP Client]
    
    style A fill:#e1f5fe
    style F fill:#e8f5e8
    style C fill:#fff3e0
```

**Key Components**:
- **Tool Name**: `google_search`
- **Parameters**: `query`, `num_results`
- **Output**: Formatted search results with titles, URLs, snippets

#### 2. SHRED Analyzer MCP (`MCP/shred-analyzer/`)

**Purpose**: Generates professional SHRED analysis prompts

```mermaid
graph TD
    A[MCP Client] --> B[analyze_shred_eligibility tool]
    B --> C[Task Description Input]
    C --> D[Generate Analysis Prompt]
    D --> E[Structured Prompt for Claude]
    E --> F[Return to MCP Client]
    
    style A fill:#e1f5fe
    style F fill:#e8f5e8
    style D fill:#f3e5f5
```

**Key Components**:
- **Tool Name**: `analyze_shred_eligibility`
- **Parameters**: `task_description`, `company_context`
- **Output**: Professional analysis prompt for AI assistants

#### 3. SHRED Research MCP (`MCP/shred-research/`)

**Purpose**: Combines Google search with SHRED analysis

```mermaid
graph TD
    A[MCP Client] --> B[research_shred_eligibility tool]
    B --> C[Google Search for SHRED Requirements]
    C --> D[Current SHRED Info]
    D --> E[Generate Analysis Prompt]
    E --> F[Comprehensive Analysis Framework]
    F --> G[Return to MCP Client]
    
    style A fill:#e1f5fe
    style G fill:#e8f5e8
    style C fill:#fff3e0
    style E fill:#f3e5f5
```

**Key Components**:
- **Tool Name**: `research_shred_eligibility`
- **Parameters**: `task_description`, `nlpany_context`, `search_depth`
- **Output**: Complete analysis with current SHRED research

## 🌐 Web Server Architecture

### Express.js Server (`chatbot/server.js`)

```mermaid
graph TB
    subgraph "Express.js Server"
        ROUTES[API Routes]
        MIDDLEWARE[Middleware Stack]
        STATIC[Static File Serving]
    end
    
    subgraph "API Endpoints"
        POST_ANALYZE[POST /api/analyze]
        GET_HEALTH[GET /api/health]
        GET_ROOT[GET /]
    end
    
    subgraph "External APIs"
        GOOGLE_API[Google Custom Search]
        CLAUDE_API[Claude Sonnet 4.5]
    end
    
    ROUTES --> POST_ANALYZE
    ROUTES --> GET_HEALTH
    ROUTES --> GET_ROOT
    
    POST_ANALYZE --> GOOGLE_API
    POST_ANALYZE --> CLAUDE_API
    
    MIDDLEWARE --> CORS[CORS]
    MIDDLEWARE --> JSON[JSON Parser]
    MIDDLEWARE --> DOTENV[Environment Variables]
    
    STATIC --> HTML[HTML/CSS/JS Files]
    
    style POST_ANALYZE fill:#e3f2fd
    style GOOGLE_API fill:#fff3e0
    style CLAUDE_API fill:#f3e5f5
```

### Frontend Architecture (`chatbot/public/index.html`)

```mermaid
graph TD
    subgraph "Frontend Components"
        FORM[Task Input Form]
        LOADING[Loading Spinner]
        RESULTS[Results Display]
        FOLLOWUP[Follow-up Questions]
    end
    
    subgraph "JavaScript Functions"
        ANALYZE[analyzeTask Function]
        SHOW_FOLLOWUP[showFollowupQuestions Function]
        SUBMIT_FOLLOWUP[submitFollowup Function]
        CHECK_STATUS[checkStatus Function]
    end
    
    subgraph "API Communication"
        FETCH_ANALYZE[fetch /api/analyze]
        FETCH_HEALTH[fetch /api/health]
    end
    
    FORM --> ANALYZE
    ANALYZE --> FETCH_ANALYZE
    FETCH_ANALYZE --> RESULTS
    RESULTS --> SHOW_FOLLOWUP
    SHOW_FOLLOWUP --> FOLLOWUP
    FOLLOWUP --> SUBMIT_FOLLOWUP
    SUBMIT_FOLLOWUP --> FETCH_ANALYZE
    
    CHECK_STATUS --> FETCH_HEALTH
    
    style FORM fill:#e8f5e8
    style RESULTS fill:#e3f2fd
    style FOLLOWUP fill:#fff3e0
```

## 🔧 Technical Implementation Details

### 1. Component-by-Component Analysis

The system uses a sophisticated approach to handle mixed tasks:

```mermaid
graph TD
    A[Task Description Input] --> B[Task Breakdown]
    B --> C[Component 1: Routine Activity]
    B --> D[Component 2: Research Activity]
    B --> E[Component 3: Testing Activity]
    
    C --> F[Evaluate Against Exclusions]
    D --> G[Evaluate Against SHRED Criteria]
    E --> H[Evaluate Against SHRED Criteria]
    
    F --> I[Not Eligible]
    G --> J[Potentially Eligible]
    H --> K[Potentially Eligible]
    
    I --> L[Overall Assessment]
    J --> L
    K --> L
    
    L --> M[Follow-up Questions]
    M --> N[Final Recommendations]
    
    style A fill:#e1f5fe
    style I fill:#ffebee
    style J fill:#e8f5e8
    style K fill:#e8f5e8
    style L fill:#e3f2fd
```

### 2. SHRED Analysis Framework

```mermaid
graph TD
    A[SHRED Requirements] --> B[Three Core Criteria]
    B --> C[Scientific/Technological Advancement]
    B --> D[Systematic Investigation]
    B --> E[Technical Uncertainty Resolution]
    
    C --> F[Beyond State-of-the-Art?]
    D --> G[Systematic Approach?]
    E --> H[Novel Technical Problems?]
    
    F --> I[ALL THREE Required]
    G --> I
    H --> I
    
    I --> J[Eligible Components]
    I --> K[Non-Eligible Components]
    
    J --> L[Documentation Requirements]
    K --> M[Improvement Recommendations]
    
    style A fill:#e1f5fe
    style I fill:#e3f2fd
    style J fill:#e8f5e8
    style K fill:#ffebee
```

### 3. Follow-up Question System

```mermaid
graph TD
    A[Analysis Confidence] --> B{Confidence Level}
    B -->|High| C[No Follow-up Needed]
    B -->|Medium/Low| D[Generate Follow-up Questions]
    
    D --> E[Technical Uncertainty Questions]
    D --> F[Innovation Level Questions]
    D --> G[Systematic Investigation Questions]
    
    E --> H[User Provides Additional Info]
    F --> H
    G --> H
    
    H --> I[Re-analyze with Enhanced Context]
    I --> J[Updated Assessment]
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e8
    style D fill:#f3e5f5
    style J fill:#e3f2fd
```

## 🚀 Setup Instructions

### Prerequisites

```mermaid
graph LR
    A[Node.js v16+] --> B[npm/yarn]
    B --> C[Google API Key]
    C --> D[Anthropic API Key]
    D --> E[System Ready]
    
    style A fill:#e8f5e8
    style B fill:#e3f2fd
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#e1f5fe
```

### 1. Main Chatbot Setup

```bash
# Navigate to chatbot directory
cd chatbot

# Install dependencies
npm install

# Configure environment variables
cp ../MCP/google/env.example .env

# Edit .env file with your API keys
# GOOGLE_API_KEY=your_google_api_key
# ANTHROPIC_API_KEY=your_anthropic_api_key

# Start the server
npm start
```

### 2. MCP Server Setup

```mermaid
graph TD
    A[Choose MCP Server] --> B{Which Server?}
    
    B -->|Google Search| C[cd MCP/google npm install node index.js]
    B -->|SHRED Analyzer| D[cd MCP/shred-analyzer npm install node index.js]
    B -->|SHRED Research| E[cd MCP/shred-research npm install node index.js]
    
    C --> F[Google Search MCP Running]
    D --> G[SHRED Analyzer MCP Running]
    E --> H[SHRED Research MCP Running]
    
    style A fill:#e1f5fe
    style F fill:#e8f5e8
    style G fill:#e3f2fd
    style H fill:#fff3e0
```

## 🔑 API Configuration Flow

```mermaid
graph TD
    A[API Setup Required] --> B{Which API?}
    
    B -->|Google| C[Google Cloud Console]
    B -->|Anthropic| D[Anthropic Console]
    
    C --> E[Enable Custom Search API]
    E --> F[Create API Key]
    F --> G[Create Search Engine]
    G --> H[Get Search Engine ID]
    
    D --> I[Create Account]
    I --> J[Generate API Key]
    
    H --> K[Add to .env File]
    J --> K
    K --> L[APIs Configured]
    
    style A fill:#e1f5fe
    style L fill:#e8f5e8
```

## 📊 Usage Examples

### Web Interface Usage Flow

```mermaid
graph TD
    A[Open Browser] --> B[Navigate to localhost:3000]
    B --> C[Enter Task Description]
    C --> D[Add Company Context]
    D --> E[Click Analyze]
    E --> F[View Analysis Results]
    F --> G{Follow-up Questions?}
    G -->|Yes| H[Answer Questions]
    G -->|No| I[Analysis Complete]
    H --> J[Re-analyze]
    J --> I
    
    style A fill:#e8f5e8
    style I fill:#e3f2fd
```

### MCP Server Usage Flow

```mermaid
sequenceDiagram
    participant Client as MCP Client
    participant Server as MCP Server
    participant Google as Google API
    participant Claude as Claude API
    
    Client->>Server: List available tools
    Server-->>Client: Return tool list
    
    Client->>Server: Call google_search tool
    Server->>Google: Execute search query
    Google-->>Server: Return search results
    Server-->>Client: Formatted results
    
    Client->>Server: Call analyze_shred_eligibility
    Server->>Server: Generate analysis prompt
    Server-->>Client: Analysis prompt for Claude
```

## 🎯 Key Features Overview

```mermaid
graph TB
    subgraph "Core Features"
        FEATURE1[Intelligent Task Breakdown]
        FEATURE2[Real-time Research Integration]
        FEATURE3[Professional AI Analysis]
        FEATURE4[Interactive Follow-up System]
    end
    
    subgraph "Technical Capabilities"
        CAP1[Component-by-component Analysis]
        CAP2[Google Search Integration]
        CAP3[Claude Sonnet 4.5 Integration]
        CAP4[Smart Question Generation]
    end
    
    subgraph "Output Quality"
        OUT1[Structured Analysis Reports]
        OUT2[Actionable Recommendations]
        OUT3[Professional Documentation]
        OUT4[Tax Planning Support]
    end
    
    FEATURE1 --> CAP1
    FEATURE2 --> CAP2
    FEATURE3 --> CAP3
    FEATURE4 --> CAP4
    
    CAP1 --> OUT1
    CAP2 --> OUT2
    CAP3 --> OUT3
    CAP4 --> OUT4
```

## 🔍 Troubleshooting Flow

```mermaid
graph TD
    A[Issue Encountered] --> B{What Type?}
    
    B -->|Server Won't Start| C[Check Port 3000 Available]
    B -->|Google API Errors| D[Verify API Key & Search Engine ID]
    B -->|Claude API Errors| E[Check Anthropic API Key]
    B -->|MCP Connection Issues| F[Verify MCP Server Running]
    
    C --> G[Check Node.js Version]
    D --> H[Enable Custom Search API]
    E --> I[Check API Credits]
    F --> J[Check Stdio Transport]
    
    G --> K[Issue Resolved]
    H --> K
    I --> K
    J --> K
    
    style A fill:#ffebee
    style K fill:#e8f5e8
```

## 📈 System Benefits

```mermaid
mindmap
  root((SHRED Analysis System))
    Accuracy
      Component Breakdown
      Mixed Task Handling
      False Positive Prevention
      False Negative Prevention
    Efficiency
      Automated Research
      Real-time Updates
      Quick Analysis
      Batch Processing
    Professional Quality
      Expert AI Analysis
      Structured Output
      Tax Planning Ready
      Documentation Support
    Flexibility
      Web Interface
      MCP Integration
      Multiple Analysis Types
      Follow-up Questions
```

## 🤝 Contributing Areas

```mermaid
graph LR
    A[Contribution Opportunities] --> B[New MCP Tools]
    A --> C[Enhanced UI]
    A --> D[Integration Options]
    A --> E[Analysis Algorithms]
    
    B --> F[Additional Analysis Capabilities]
    C --> G[Better User Experience]
    D --> H[More External Services]
    E --> I[Improved SHRED Evaluation]
    
    style A fill:#e1f5fe
    style F fill:#e8f5e8
    style G fill:#e3f2fd
    style H fill:#fff3e0
    style I fill:#f3e5f5
```

## 📄 License

MIT License - See individual component README files for specific licensing information.

---

This comprehensive system provides professional-grade SHRED tax credit analysis with intelligent task breakdown, real-time research integration, and expert AI analysis capabilities.