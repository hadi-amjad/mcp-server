import express from "express";
import { NodeServer } from "@modelcontextprotocol/sdk/server";
import { createRPCHandler } from "@modelcontextprotocol/sdk/rpc";


const app = express();
const port = process.env.PORT || 3000;

// MCP handler
const handler = createRPCHandler({
  server: new NodeServer({
    name: "mcp-n8n-server",
    version: "1.0.0",
    capabilities: {
      tools: {
        list: async () => ({
          tools: [
            {
              name: "ping",
              description: "Simple test ping tool",
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
  })
});

// Express endpoint for MCP
app.use(express.json());

app.post("/mcp", async (req, res) => {
  const response = await handler(req.body);
  res.json(response);
});

app.get("/", (req, res) =>
  res.send("MCP server is running")
);

app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
