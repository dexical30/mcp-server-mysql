# MCP Server for MySQL

> **This is a fork of [benborla/mcp-server-mysql](https://github.com/benborla/mcp-server-mysql)**, published as `@dexical30/mcp-server-mysql`.
> It adds [1Password secret reference support](#1password-secret-references) for `MYSQL_PASS`.
> All credit for the original project goes to Ben Borla and its contributors.

[![MCP Toplist](https://mcptoplist.com/badge/glama%2Fbenborla%2Fmcp-server-mysql.svg)](https://mcptoplist.com/server/glama%2Fbenborla%2Fmcp-server-mysql)

[![Trust Score](https://archestra.ai/mcp-catalog/api/badge/quality/benborla/mcp-server-mysql)](https://archestra.ai/mcp-catalog/benborla__mcp-server-mysql)

## Sponsor — Bloome

[![Bloome](assets/bloome.png)](https://bloome.im/login?ref=2x7GfeSw)

Using mcp-server-mysql to let your AI query MySQL? [**Bloome**](https://bloome.im/login?ref=2x7GfeSw) brings that to your whole team — an AI-agent IM platform where AI agents are members of the chat. Connect your MCP tools and have agents inspect schemas, run queries, and answer data questions for everyone in one thread. Zero local setup, runs in the cloud, on web and mobile.

---

MCP server that gives Claude and other LLMs access to MySQL — inspect schemas, run queries, and optionally write data, all through the Model Context Protocol.

## Key Features

- **Read-only by default** — write operations opt-in via env flags
- **Claude Code integration** — optimized for Anthropic's Claude Code CLI
- **SSH tunnel support** — built-in support for remote databases
- **Multi-DB mode** — query across multiple databases without reconnecting
- **Schema-specific permissions** — per-database read/write control
- **PII redaction** — automatic masking of sensitive data in results
- **Remote mode** — HTTP transport with bearer token auth
- **SSL/TLS support** — encrypted connections with mTLS option

## Requirements

- Node.js v20+
- MySQL 5.7+ (8.0+ recommended)
- MySQL user with appropriate privileges

## Quick Install

**Claude Code (simplest):**

```bash
claude mcp add mcp_server_mysql \
  -e MYSQL_HOST="127.0.0.1" \
  -e MYSQL_PORT="3306" \
  -e MYSQL_USER="root" \
  -e MYSQL_PASS="your_password" \
  -e MYSQL_DB="your_database" \
  -- npx @dexical30/mcp-server-mysql
```

**Claude Desktop / other clients:**

```json
{
  "mcpServers": {
    "mcp_server_mysql": {
      "command": "npx",
      "args": ["-y", "@dexical30/mcp-server-mysql"],
      "env": {
        "MYSQL_HOST": "127.0.0.1",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "root",
        "MYSQL_PASS": "your_password",
        "MYSQL_DB": "your_database"
      }
    }
  }
}
```

All write operations are disabled by default. Enable with `ALLOW_INSERT_OPERATION=true`, `ALLOW_UPDATE_OPERATION=true`, `ALLOW_DELETE_OPERATION=true`.

## 1Password Secret References

Set `MYSQL_PASS` to a [1Password secret reference](https://developer.1password.com/docs/cli/secret-reference-syntax/) instead of a plaintext password:

```json
"env": {
  "MYSQL_PASS": "op://Private/MySQL Dev/password"
}
```

When `MYSQL_PASS` starts with `op://`, the server runs `op read` itself at startup and keeps the password only in memory. The plaintext never enters the process environment, so it does not show up in `ps eww` or in your MCP client config.

Requirements:

- [1Password CLI](https://developer.1password.com/docs/cli/get-started/) (`op`) installed
- 1Password desktop app → **Settings → Developer → Integrate with 1Password CLI** enabled (approve with Touch ID on startup)
- If your MCP client can't find `op` on its `PATH` (common for GUI apps), set `MYSQL_OP_PATH`, e.g. `/opt/homebrew/bin/op`

Do **not** wrap the server in `op run`: it would inject the plaintext password into the environment, which is exactly what this avoids.

## Documentation

- [Installation Guide](docs/INSTALLATION.md) — Smithery, Cursor, Codex, Claude Code, local repo, remote mode
- [Configuration & Environment Variables](docs/CONFIGURATION.md) — all env vars, advanced config
- [Multi-DB Mode](README-MULTI-DB.md) — querying multiple databases
- [PII Redaction](docs/PII-REDACTION.md) — automatic data masking
- [Testing](docs/TESTING.md) — test setup and running
- [Troubleshooting](docs/TROUBLESHOOTING.md) — common issues and fixes
- [Changelog](CHANGELOG.md)

## Tools & Resources

**Tool: `mysql_query`**
Execute SQL queries. Read-only by default. Write operations enabled per flag.

**Resources: `mysql://tables`**
Lists all tables and column metadata for the connected database.

## Contributing

PRs welcome at [github.com/benborla/mcp-server-mysql](https://github.com/benborla/mcp-server-mysql).

```bash
git clone https://github.com/benborla/mcp-server-mysql.git
pnpm install
pnpm run build
pnpm test
```

[![Contributors](https://contrib.rocks/image?repo=benborla/mcp-server-mysql)](https://github.com/benborla/mcp-server-mysql/graphs/contributors)

## License

MIT — see [LICENSE](LICENSE) for details.
