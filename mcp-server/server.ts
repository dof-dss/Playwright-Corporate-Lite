#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import
{
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PlaywrightTestResult
{
    status: "passed" | "failed" | "skipped" | "timedOut";
    title: string;
    duration: number;
    file: string;
    error?: string;
}

// Helper to get project root
function getProjectRoot(): string
{
    return path.resolve(__dirname, "..");
}

// Helper to parse Playwright test results
function parsePlaywrightResults(output: string): PlaywrightTestResult[]
{
    const results: PlaywrightTestResult[] = [];
    const lines = output.split("\n");

    for (const line of lines)
    {
        if (line.includes("✓") || line.includes("✗") || line.includes("⊘"))
        {
            const match = line.match(/(?:✓|✗|⊘)\s+(.+?)\s+\((\d+)ms\)/);
            if (match)
            {
                const status = line.includes("✓")
                    ? "passed"
                    : line.includes("✗")
                        ? "failed"
                        : "skipped";
                results.push({
                    status,
                    title: match[1],
                    duration: parseInt(match[2]),
                    file: "",
                });
            }
        }
    }

    return results;
}

// Tool definitions
const tools = [
    {
        name: "run_tests",
        description: "Run Playwright tests with optional filters",
        inputSchema: {
            type: "object",
            properties: {
                project: {
                    type: "string",
                    description:
                        "Browser project to run (chromium, firefox, webkit, or leave empty for all)",
                },
                grep: {
                    type: "string",
                    description:
                        "Filter tests by pattern (e.g., @smoke, specific test name)",
                },
                file: {
                    type: "string",
                    description:
                        "Specific test file to run (relative to tests directory)",
                },
                headed: {
                    type: "boolean",
                    description: "Run tests in headed mode (show browser)",
                },
                debug: {
                    type: "boolean",
                    description: "Run tests in debug mode",
                },
            },
        },
    },
    {
        name: "list_tests",
        description: "List all available tests",
        inputSchema: {
            type: "object",
            properties: {
                grep: {
                    type: "string",
                    description: "Filter tests by pattern",
                },
            },
        },
    },
    {
        name: "get_test_results",
        description: "Get results from the last test run",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "get_project_info",
        description: "Get information about the Playwright project setup",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "analyze_failure",
        description: "Analyze a test failure and suggest fixes",
        inputSchema: {
            type: "object",
            properties: {
                testName: {
                    type: "string",
                    description: "Name of the failed test",
                },
            },
        },
    },
];

// Tool implementation
async function processToolCall(
    toolName: string,
    toolInput: Record<string, unknown>
): Promise<string>
{
    const projectRoot = getProjectRoot();

    switch (toolName)
    {
        case "run_tests": {
            const project = (toolInput.project as string) || "";
            const grep = (toolInput.grep as string) || "";
            const file = (toolInput.file as string) || "";
            const headed = (toolInput.headed as boolean) || false;
            const debug = (toolInput.debug as boolean) || false;

            let command = "npx playwright test";

            if (project)
            {
                command += ` --project ${project}`;
            }
            if (grep)
            {
                command += ` --grep "${grep}"`;
            }
            if (file)
            {
                command += ` ${file}`;
            }
            if (headed)
            {
                command += " --headed";
            }
            if (debug)
            {
                command += " --debug";
            }

            try
            {
                const output = execSync(command, {
                    cwd: projectRoot,
                    encoding: "utf-8",
                });
                const results = parsePlaywrightResults(output);
                return JSON.stringify({
                    success: true,
                    output,
                    results,
                    exitCode: 0,
                });
            } catch (error)
            {
                const errorOutput =
                    error instanceof Error ? error.message : String(error);
                return JSON.stringify({
                    success: false,
                    output: errorOutput,
                    exitCode: 1,
                });
            }
        }

        case "list_tests": {
            const grep = (toolInput.grep as string) || "";
            let command = "npx playwright test --list";

            if (grep)
            {
                command += ` --grep "${grep}"`;
            }

            try
            {
                const output = execSync(command, {
                    cwd: projectRoot,
                    encoding: "utf-8",
                });
                return JSON.stringify({
                    success: true,
                    tests: output,
                });
            } catch (error)
            {
                const errorOutput =
                    error instanceof Error ? error.message : String(error);
                return JSON.stringify({
                    success: false,
                    error: errorOutput,
                });
            }
        }

        case "get_test_results": {
            try
            {
                const reportPath = path.join(projectRoot, "playwright-report");
                if (fs.existsSync(reportPath))
                {
                    const files = fs.readdirSync(reportPath);
                    return JSON.stringify({
                        success: true,
                        reportExists: true,
                        reportPath,
                        files,
                    });
                } else
                {
                    return JSON.stringify({
                        success: true,
                        reportExists: false,
                        message: "No test results found. Run tests first.",
                    });
                }
            } catch (error)
            {
                const errorOutput =
                    error instanceof Error ? error.message : String(error);
                return JSON.stringify({
                    success: false,
                    error: errorOutput,
                });
            }
        }

        case "get_project_info": {
            try
            {
                const configPath = path.join(projectRoot, "playwright.config.ts");
                const packagePath = path.join(projectRoot, "package.json");

                const packageJson = fs.existsSync(packagePath)
                    ? JSON.parse(fs.readFileSync(packagePath, "utf-8"))
                    : {};

                return JSON.stringify({
                    success: true,
                    projectRoot,
                    playwrightVersion:
                        packageJson.dependencies?.["@playwright/test"] || "unknown",
                    testDir: "./tests",
                    configExists: fs.existsSync(configPath),
                });
            } catch (error)
            {
                const errorOutput =
                    error instanceof Error ? error.message : String(error);
                return JSON.stringify({
                    success: false,
                    error: errorOutput,
                });
            }
        }

        case "analyze_failure": {
            const testName = toolInput.testName as string;
            if (!testName)
            {
                return JSON.stringify({
                    success: false,
                    error: "testName is required",
                });
            }

            try
            {
                const reportPath = path.join(
                    projectRoot,
                    "playwright-report",
                    "results.xml"
                );
                if (fs.existsSync(reportPath))
                {
                    const results = fs.readFileSync(reportPath, "utf-8");
                    if (results.includes(testName))
                    {
                        return JSON.stringify({
                            success: true,
                            testName,
                            message:
                                "Test found in results. Check the HTML report in playwright-report/index.html for detailed failure information.",
                            nextSteps: [
                                "Review the test code for the failure",
                                "Check the trace files in playwright-report/trace/",
                                "Run the test in debug mode with debug=true",
                            ],
                        });
                    }
                }
                return JSON.stringify({
                    success: true,
                    message: `No results found for test: ${testName}. Run the test first to analyze failures.`,
                });
            } catch (error)
            {
                const errorOutput =
                    error instanceof Error ? error.message : String(error);
                return JSON.stringify({
                    success: false,
                    error: errorOutput,
                });
            }
        }

        default:
            return JSON.stringify({
                success: false,
                error: `Unknown tool: ${toolName}`,
            });
    }
}

// Create server instance with proper options
const server = new Server(
    {
        name: "playwright-mcp-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) =>
{
    const result = await processToolCall(
        request.params.name,
        request.params.arguments as Record<string, unknown>
    );

    return {
        content: [
            {
                type: "text",
                text: result,
            },
        ],
    };
});

// Start server
async function main()
{
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Playwright MCP server running on stdio");
}

main().catch(console.error);
