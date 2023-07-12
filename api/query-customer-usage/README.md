# Customer Usage Query Example

This example script queries the Prismatic API for customer usage information, and fetches the number of instances and unique integrations each customer had, aggregated over several months.

Run this script by first installing dependencies with `npm install`. Then, run the script with an environment variable `PRISMATIC_API_KEY` set. `prism` is helpful for getting an API key:

```
PRISMATIC_API_KEY=$(prism me:token) npm run start
```

After running, this script will write out a file `cusotmer-usage-YEAR.csv` that looks like this:

```csv
Customer ID,Customer Name,Usage Year,Usage Month,Deployed Instances,Unique Integrations
customer-abc,Customer 2,2023,3,0.05241935483870968,0.05241935483870968
customer-abc,Customer 2,2023,4,0.8194444444444444,0.8194444444444444
customer-abc,Customer 2,2023,5,2.2419354838709675,2.2419354838709675
customer-abc,Customer 2,2023,6,5.711111111111111,5.711111111111111
customer-abc,Customer 2,2023,7,2.8051075268817205,2.8051075268817205
```

Note that a snapshot of instance count data is generated each hour. Instance counts are likely decimals because instance count is averaged over the number of hours in a month.
