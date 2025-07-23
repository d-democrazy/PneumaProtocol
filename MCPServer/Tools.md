```bash
# List tools
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | npm start

# Read a file
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "read_file", "arguments": {"path": "./"}}}' | npm start

# List files in current directory
echo '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "list_files", "arguments": {"directory": "./"}}}' | npm start

# List resources
echo '{"jsonrpc": "2.0", "id": 4, "method": "resources/list", "params": {}}' | npm start

# Read a resource
echo '{"jsonrpc": "2.0", "id": 5, "method": "resources/read", "params": {"uri": "file://server.ts"}}' | npm start

# Write a file
echo '{"jsonrpc": "2.0", "id": 6, "method": "tools/call", "params": {"name": "write_file", "arguments": {"path": "./"}}}' | npm start
```