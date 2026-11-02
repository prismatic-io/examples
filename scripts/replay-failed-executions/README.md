# Execution Replay

This script illustrates how to replay failed executions for a given instance.
It will query for all failed executions for an instance, filter out those that have succeeded on a subsequent replay, and replay the remaining failed executions.

## Running this script

This script requires Node.js 22 or later. Install dependencies with:

```bash
npm install
```

Then, run the script with the ID of the instance whose failed executions you'd like to replay.
Note the `--` after `npm run start`, which tells npm to pass the remaining arguments to the script:

```bash
npm run start -- --instance-id SW5zdGFuY2U6...
```

To see which executions would be replayed without actually replaying them, add `--dry-run`:

```bash
npm run start -- --instance-id SW5zdGFuY2U6... --dry-run
```

The `start` script uses the [prism CLI tool](https://www.npmjs.com/package/@prismatic-io/prism) to fetch an API token (`prism me:token`), so make sure you've logged in with `prism login`.
If you'd rather supply a token yourself, set a `PRISMATIC_API_KEY` environment variable and run `npx tsx index.ts` with the same arguments.

Note that this script runs against the US Commercial stack by default. If you'd like to run it against another region (EU, AUS, CA, GovCloud, private cloud, etc.) also provide a `PRISMATIC_URL` environment variable for your region.
