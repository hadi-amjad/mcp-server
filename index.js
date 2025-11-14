import express from "express";
import {
  MCPServer,
  MemoryTool,
  ToolExecutionError
} from "@modelcontextprotocol/sdk";

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// Create MCP server instance
const server = new MCPServer({
  name: "mcp-n8n-server",
  version: "1.0.0",
});

// Add a sample tool
server.addTool(
  new MemoryTool({
    name: "ping",
    description: "Simple ping test",
    execute: async () => {
      return { content: "pong" };
    },
  })
);

// Route MCP requests
app.post("/mcp", async (req, res) => {
  try {
    const response = await server.handleRequest(req.body);
    res.json(response);
  } catch (err) {
    res.status(500).json({
      error: err instanceof ToolExecutionError ? err.message : "Server error",
    });
  }
});

// Basic homepage
app.get("/", (req, res) => {
  res.send("MCP server is running");
});

// Start server
app.listen(port, () => {
  console.log(`MCP server running on port ${port}`);
});
