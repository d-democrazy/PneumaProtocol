/**
 * Configuration object for our MCP Server
 * This defines what infomation our server needs to start up
 */
export interface ServerConfig {
    /** The name of our server (like a business name) */
    name: string;
    /** The version number (helps track updates) */
    version: string;
}

/**
 * Represents the result when we try to do something
 * This is a common pattern in programming called a "Result type"
 */
export interface ToolResult {
    /** Whether the operation worked or not */
    success: boolean;
    /** The error message (if something gone wrong) */
    error?: string;
}

/**
 * Represent a file and its contents
 * This help us organize file information in one place
 */
export interface FileInfo {
    /** What type of file it is (text, image, etc.) */
    mimeType: string;
}