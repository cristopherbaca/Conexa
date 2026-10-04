# Access matrix

| Role | Chat | Knowledge bases | Analytics | Team | Settings | Billing | Training | Compliance |
|---|---|---|---|---|---|---|---|---|
| Agent | Yes | No | No | No | No | No | No | No |
| Trainee | Yes | No | No | No | No | No | Yes | No |
| Supervisor | Yes | No | Yes | Yes | No | No | No | No |
| Editor | Yes | Yes | Yes | No | No | No | No | No |
| Admin | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| QA/Compliance | Yes | No | Yes | No | No | No | No | Yes |
| Developer | Yes | No | Yes | No | No | No | No | No |
| Viewer | No | Yes | Yes | No | No | No | No | No |

Plan gating is defined in `src/js/config/access.js`. The Demo Control Room can switch role, plan, and workspace state. Blocked workspace states override feature access except Settings.
