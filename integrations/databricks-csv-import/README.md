# Prismatic Example Integration: Send CSV to Databricks

This folder contains an example integration for Prismatic that provides multiple ways to create a table in Databricks containing information from a CSV using AWS S3.

The integration has three main flows:

1. **Send CSV to Databricks**: This flow provides an endpoint to which you can POST CSV data along with a filename to write the CSV, and a tablename to be used in Databricks. Here's an example how to call this endpoint:

```
curl --location 'https://hooks.prismatic.io/trigger/SW5zdGFuY2VGbG93Q29uZmlnOjdlNjljMmQ5LTk5ZjQtNGE4NC05ZTlhLTFmYjM1MWYzMTkxYg==?filename=companies.csv&tablename=companies' \
--header 'Content-Type: text/plain' \
--data 'Index,Organization Id,Name,Website,Country,Description,Founded,Industry,Number of employees
1,FAB0d41d5b5d22c,Ferrell LLC,https://price.net/,Papua New Guinea,Horizontal empowering knowledgebase,1990,Plastics,3498
2,6A7EdDEA9FaDC52,"Mckinney, Riley and Day",http://www.hall-buchanan.info/,Finland,User-centric system-worthy leverage,2015,Glass / Ceramics / Concrete,4952
3,0bFED1ADAE4bcC1,Hester Ltd,http://sullivan-reed.com/,China,Switchable scalable moratorium,1971,Public Safety,5287
4,2bFC1Be8a4ce42f,Holder-Sellers,https://becker.com/,Turkmenistan,De-engineered systemic artificial intelligence,2004,Automotive,921
'
```

1. **Get CSV from SFTP**: This flow creates an endpoint to receive a POST request containing the path to a CSV file in an SFTP server. It grabs the file from SFTP and forwards to the flow above, which sends it to Databricks.

2. **Sync Google Sheet Daily**: This flow runs on a daily schedule and will take the Google Sheet setup in the config wizard and pass each worksheet into the first flow to send to Databricks.
