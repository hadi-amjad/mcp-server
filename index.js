import express from "express";
import { NodeServer } from "@modelcontextprotocol/sdk/server";

const app = express();
const port = process.env.PORT || 3000;

// Create MCP server
const server = new NodeServer({
  name: "mcp-n8n-server",
  version: "1.0.0",
  capabilities: {
    tools: {
      list: async () => ({
        tools: [
          {
            name: "ping",
            description: "Returns pong",
            inputSchema: { type: "object", properties: {} }
          }
        ]
      }),

      call: async (toolName, args) => {
        if (toolName === "ping") {
          return { content: "pong" };
        }
        throw new Error("Unknown tool: " + toolName);
      }
    }
  }
});

// Express MUST take raw JSON for MCP
app.use(express.json());

// MCP request handler (built into NodeServer, no rpc import needed)
app.post("/mcp", async (req, res) => {
  try {
    const response = await server.handle(req.body);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Basic root endpoint
app.get("/", (req, res) => {
  res.send("MCP server is running");
});

app.listen(port, () => {
  console.log(`MCP server running on port ${port}`);
});
