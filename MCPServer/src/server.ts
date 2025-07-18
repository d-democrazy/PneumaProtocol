import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ServerConfig, ToolResult, FileInfo } from "./types.js";
import { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";

/**
 * Our MCP Server class
 * This is like the main brain of our server - it handles all the requests
 * from Claude Code and decides what to do with them
 */
export class PneumaMCPServer {
    private server: Server;
    private config: ServerConfig;

    /**
     * Constructor - this runs when we create a new server
     * Think of this as the initialization ritual that sets up everything
     */
    constructor(config: ServerConfig) {
        this.config = config;

        // Create a actual MCP Server with our configuration
        this.server = new Server(
            {
                name: config.name,
                version: config.version,
            },
            {
                capabilities: {
                    tools: {}, // We can provide tools (functions)
                    resources: {}, // We can provide resources (data)
                },
            }
        );

        // Set up all our request handlers
        this.setupHandlers();
    }

    /**
     * Set up all the different types of request our server can handle
     * This is like training your staff to handle different types of customers
     */
    private setupHandlers(): void {
        // Handler 1: When Claude Code asks "What tools do you have?"
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: "read_file",
                        description: "Read the contents of a file",
                        InputSchema: {
                            type: "object",
                            properties: {
                                path: {
                                    type: "string",
                                    description: "The path to the file you want to read",
                                },
                            },
                            required: ["path"],
                        },
                    },
                    {
                        name: "list_files",
                        description: "List all files in a directory",
                        inputSchema: {
                            type: "object",
                            properties: {
                                directory: {
                                    type: "string",
                                    description: "The directory path to list files from",
                                },
                            },
                            required: ["directory"],
                        },
                    },
                ],
            };
        });

        // Handler 2: When Claude Code asks us to actually run a tool
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                switch (name) {
                    case "read_file":
                        return await this.handleReadFile(args as { path: string });

                    case "list_files":
                        return await this.handleListFiles(args as { directory: string });

                    default:
                        throw new Error(`Unknown tool: $(name)`);
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                    isError: true,
                };
            }
        });

        // Handler 3: When Claude Code asks "What resources do you have?"
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            return {
                resources: [
                    {
                        uri: "file://current-directory",
                        name: "Current Directory Files",
                        description: "Access to files in the current directory",
                        mimeType: "text/plain",
                    },
                ],
            };
        });

        // Handler 4: When Claude Code asks to read a specific resource
        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            const { uri } = request.params;

            if (uri.startsWith("file://")) {
                const filePath = uri.replace("file://", "");
                return await this.handleReadResource(filePath);
            }

            throw new Error(`Unsupport resource URI: ${uri}`);
        });
    }

    /**
     * Handles reading a file when Claude Code asks
     * This is like having a librarian who can fetch any book for you
     */
    private async handleReadFile(args: { path: string }): Promise<any> {
        try {
            const content = await fs.readFile(args.path, "utf-8");

            return {
                content: [
                    {
                        type: "text",
                        text: `File content of ${args.path}: \n\n${content}`,
                    },
                ],
            };
        } catch (error) {
            throw new Error(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Handles listing files in a directory when Claude Code asks
     * This is like having a directory assistant who can tell you what's in any folder
     */
    private async handleListFiles(args: { directory: string }): Promise<any> {
        try {
            const files = await fs.readdir(args.directory);
            const fileList = files.join("\n");

            return {
                content: [
                    {
                        type: "text",
                        text: `Files in ${args.directory}:\n${fileList}`,
                    },
                ],
            };
        } catch (error) {
            throw new Error(`Failed to list files: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Handles reading a source when Claude Code asks
     * This similar to handleReadFile but for the resource system
     */
    private async handleReadResource(filePath: string): Promise<any> {
        try {
            const content = await fs.readFile(filePath, "utf-8");

            return {
                contents: [
                    {
                        uri: `file://${filePath}`,
                        mimeType: "text/plain",
                        text: content,
                    },
                ],
            };
        } catch (error) {
            throw new Error(`Failed to read resource: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
         * Starts the server and begins listening for requests
         * This is like opening your business for customers
         */
    public async start(): Promise<void> {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Pneuma MCP Server started successfully! 🪬");
    }
}