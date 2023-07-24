# Execution Replay

This script illustrates how to replay failed executions for a given instance.
It will query for all failed executions for an instance, filter out those that have succeeded on a subsequent replay, and replay the remaining failed executions.

Run this script by first installing dependencies with `npm install`. Then, run the script with an environment variable `PRISMATIC_API_KEY` set. `prism` is helpful for getting an API key:

```
PRISMATIC_API_KEY=$(prism me:token) npm run start
```
