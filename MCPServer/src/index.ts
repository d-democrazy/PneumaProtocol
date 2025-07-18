import { PneumaMCPServer } from "./server";

/**
 * Main function - this is where our program starts
 * Think of this as the "main entrance" to our application
 */
async function main() {
    const server = new PneumaMCPServer({
        name: "Pneuma Protocol MCP Server",
        version: "1.0.0",
    });

    await server.start();
}

// Run the main function that handle any errors
main().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});