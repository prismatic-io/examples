# Customer Usage Query Example

This example script queries the Prismatic API for customer usage information, and fetches the number of instances and unique integrations each customer had, aggregated over several days.
This is helpful if you want to charge your customers per instance that they deploy.

It also fetches instance compute information (how much each instance used in megabyte-seconds), which is helpful if you plan to charge your customers for compute time.

Run this script by first installing dependencies with `npm install`.
Provide the script with `--start-date` and `--end-date` parameters.

```
npm run start --start-date 2024-12-01 --end-date 2025-02-13
```

After running, this script will write out two files:

- `customer-instance-data.csv` that looks like this:

  ```csv
  Customer ID,Customer Name,Date,Deployed Instances,Unique Integrations
  Q3VzdG9tZXI6MGFkZjJhNzUtZGRhMy00MDIxLWI4NmItZGY1ZDk5OWM5YjEw,Acme Corp,2024-12-01,8,8
  Q3VzdG9tZXI6MGFkZjJhNzUtZGRhMy00MDIxLWI4NmItZGY1ZDk5OWM5YjEw,Acme Corp,2024-12-02,8,8
  Q3VzdG9tZXI6MGFkZjJhNzUtZGRhMy00MDIxLWI4NmItZGY1ZDk5OWM5YjEw,Acme Corp,2024-12-03,8,8
  Q3VzdG9tZXI6MGFkZjJhNzUtZGRhMy00MDIxLWI4NmItZGY1ZDk5OWM5YjEw,Acme Corp,2024-12-04,8,8
  ```

- `instance-compute-data.csv` which looks like this:
  ```
  Customer ID,Customer Name,Instance ID,Instance Name,Date,Successful Executions,Failed Executions,Step Count,Execution Mb-Seconds
  Q3VzdG9tZXI6ODk4Y2Q1OTYtNzI5MS00NmQxLWE2YWMtZTA1YTNkZTEwZDJj,Johnson Homes,SW5zdGFuY2U6ZDVjNmU4YjYtMjQxYS00NDVjLTliMmItMTM2NTVlMTczZTFj,HubSpot,2/12/25,1440,0,5760,985819
  Q3VzdG9tZXI6ODk4Y2Q1OTYtNzI5MS00NmQxLWE2YWMtZTA1YTNkZTEwZDJj,Johnson Homes,SW5zdGFuY2U6ZDVjNmU4YjYtMjQxYS00NDVjLTliMmItMTM2NTVlMTczZTFj,HubSpot,2/11/25,1440,0,5760,946312
  Q3VzdG9tZXI6ODk4Y2Q1OTYtNzI5MS00NmQxLWE2YWMtZTA1YTNkZTEwZDJj,Johnson Homes,SW5zdGFuY2U6ZDVjNmU4YjYtMjQxYS00NDVjLTliMmItMTM2NTVlMTczZTFj,HubSpot,2/10/25,1440,0,5760,935477
  Q3VzdG9tZXI6ODk4Y2Q1OTYtNzI5MS00NmQxLWE2YWMtZTA1YTNkZTEwZDJj,Johnson Homes,SW5zdGFuY2U6ZDVjNmU4YjYtMjQxYS00NDVjLTliMmItMTM2NTVlMTczZTFj,HubSpot,2/13/25,1205,0,4820,793902
  Q3VzdG9tZXI6MDNlNWU1YzYtNDUxYy00MWI4LWI5MjMtOTRmMWZiZDE2YTBj,Smith Real Estate,SW5zdGFuY2U6NDIwNjg1ZmItODY2ZS00YzJjLWE0NTAtMDE2NDE4YTc0MTZm,Salesforce,2/11/25,1,0,4,3380
  Q3VzdG9tZXI6NzI2YWVlMzktOWRjOS00NzgzLTgzOWEtMDE3OWY5MjE5NmQ3,Smith Real Estate,SW5zdGFuY2U6ODQ0Y2I0NjgtOTM0Mi00NjJmLTg5MWYtMTkyMjQ5ZmNkNDQ3,Salesforce,2/12/25,0,5,0,515
  ```

Note that a snapshot of instance count data is generated each hour.
Daily instance counts can be fractions of whole numbers because instance count is averaged over several hours.
