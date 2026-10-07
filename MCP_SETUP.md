# Playwright MCP Setup Guide

This project now includes a Model Context Protocol (MCP) server that allows AI tools like Claude to interact with your Playwright tests.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that enables AI systems to safely integrate with external tools and data sources. In this case, it allows Claude and other AI assistants to:

- Run your Playwright tests
- List available tests
- Analyze test failures
- Get project information
- Access test reports and traces

## Installation & Setup

### Step 1: Install MCP Dependencies

```bash
npm install
cd mcp-server
npm install
cd ..
```

### Step 2: Build the MCP Server

```bash
npm run mcp:build
```

This compiles the TypeScript MCP server to JavaScript and places it in `mcp-server/dist/`.

## Usage

### Run the MCP Server Locally

```bash
npm run mcp:start
```

The server will start and listen on stdio for MCP protocol messages.

### Integration with Claude Desktop

To use this MCP server with Claude Desktop, add the following to your Claude configuration:

**On macOS/Linux:** `~/.config/Claude/claude_desktop_config.json`
**On Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["C:\\path\\to\\playwright-dept\\mcp-server\\dist\\server.js"]
    }
  }
}
```

Replace `C:\\path\\to\\playwright-dept\\mcp-server\\dist\\server.js` with the absolute path to your MCP server.

## Available Tools

The MCP server exposes the following tools to AI assistants:

### 1. `run_tests`
Run Playwright tests with optional filters.

**Parameters:**
- `project` (optional): Browser project - `chromium`, `firefox`, `webkit`
- `grep` (optional): Filter tests by pattern (e.g., `@smoke`, test name)
- `file` (optional): Specific test file to run
- `headed` (optional): Run in headed mode (show browser)
- `debug` (optional): Run in debug mode

**Example:**
```
Run all smoke tests in chromium with grep="@smoke" and project="chromium"
```

### 2. `list_tests`
List all available tests.

**Parameters:**
- `grep` (optional): Filter tests by pattern

**Example:**
```
List all tests matching the pattern "@regression"
```

### 3. `get_test_results`
Get results from the last test run.

### 4. `get_project_info`
Get information about the Playwright project setup, including:
- Project root directory
- Playwright version
- Test directory
- Config file existence

### 5. `analyze_failure`
Analyze a test failure and suggest fixes.

**Parameters:**
- `testName` (required): Name of the failed test

## Available Resources

The MCP server also exposes these resources:

- `playwright://project` - Project root path
- `playwright://tests` - List of test files
- `playwright://report` - HTML test report

## Development

To make changes to the MCP server:

1. Edit `mcp-server/server.ts`
2. Run `npm run mcp:build` to recompile
3. Restart the server

## Workflow Examples

### Example 1: Run tests and get results
```
1. Ask Claude: "Run my smoke tests"
2. Claude uses: run_tests with grep="@smoke"
3. Claude reads: playwright://report
```

### Example 2: Debug a failing test
```
1. Ask Claude: "Why is my login test failing?"
2. Claude uses: analyze_failure with testName="login test"
3. Claude uses: get_test_results
4. Claude provides analysis and suggestions
```

### Example 3: List and run specific tests
```
1. Ask Claude: "List all regression tests"
2. Claude uses: list_tests with grep="@regression"
3. Ask Claude: "Run the first three"
4. Claude uses: run_tests with specific files
```

## Troubleshooting

### Server won't start
- Ensure Node.js is installed and in your PATH
- Run `npm run mcp:build` first to compile TypeScript
- Check file permissions

### MCP not working with Claude Desktop
- Verify the path in `claude_desktop_config.json` is correct
- Make sure the server is built: `npm run mcp:build`
- Restart Claude Desktop after updating the config

### Tests not running through MCP
- Ensure your `.env` file (usersecrets.env) is properly configured
- Run tests manually first to verify they work: `npm run test:chromium`
- Check that the project root is correctly identified

## Next Steps

1. Build and start the MCP server: `npm run mcp:build && npm run mcp:start`
2. Update Claude configuration with the server path
3. Restart Claude Desktop
4. Start asking Claude to manage your Playwright tests!

For more information about MCP, visit: https://modelcontextprotocol.io/
