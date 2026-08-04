# n8n-nodes-asyntai

This is an n8n community node for [Asyntai](https://asyntai.com) — an AI chatbot that answers your website visitors 24/7 using your own content, and captures leads.

## Installation

In n8n: **Settings → Community Nodes → Install** and enter `n8n-nodes-asyntai`.

Or on self-hosted n8n:

```bash
npm install n8n-nodes-asyntai
```

## Credentials

You need an Asyntai API key: sign in at [asyntai.com](https://asyntai.com) and copy your key from [API Settings](https://asyntai.com/settings/api/).

## Nodes

### Asyntai

| Resource | Operations |
| --- | --- |
| Chat | Send Message (get an AI answer, with optional conversation memory via Session ID) |
| Lead | Get Many (emails/phones captured in chat) |
| Conversation | Get (full message history of a session) |
| Session | Get Many (recent chat sessions) |
| Knowledge | Get Many, Add Text, Add URL, Delete |
| Website | Get Many |
| Account | Get (account info and usage) |

### Asyntai Trigger

Starts a workflow when something happens in your chatbot:

- **Message Received** — a visitor sent a message
- **Conversation Started** — a new chat began
- **Escalation Requested** — a visitor asked for a human
- **Takeover Started** — a human agent took over

## Example workflows

- When Asyntai captures a lead → add it to your CRM and notify the team.
- When a visitor requests a human → create a ticket and ping Slack.
- Nightly: fetch new leads → append to a spreadsheet.
- On new blog post → add its URL to the Asyntai knowledge base.

## Resources

- [Asyntai API documentation](https://asyntai.com/documentation/api/)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT
