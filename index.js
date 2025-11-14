import express from "express";
import { NodeServer } from "@modelcontextprotocol/sdk/server";
import { createRPCHandler } from "@modelcontextprotocol/sdk/rpc";

const app = express();
const port = process.env.PORT || 3000;

// MCP Server Definition
const server = new NodeServer({
  name: "mcp-n8n-server",
  version: "1.0.0",

  capabilities: {
    tools: {
      list: async () => ({
        tools: [
          {
            name: "ping",
            description: "Simple test tool that returns 'pong'",
            inputSchema: { type: "object", properties: {} }
          }
        ]
      }),

      call: async (toolName, args) => {
        if (toolName === "ping") {
          return { content: "pong" };
        }

        throw new Error(`Unknown tool: ${toolName}`);
      }
    }
  }
});

// Create RPC handler
const handler = createRPCHandler({ server });

app.use(express.json());

// MCP endpoint
app.post("/mcp", async (req, res) => {
  try {
    const response = await handler(req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Basic homepage
app.get("/", (req, res) => {
  res.send("MCP server is running");
});

// Start the server
app.listen(port, () => {
  console.log(`MCP server running on port ${port}`);
});
