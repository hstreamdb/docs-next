# Ingest Data

This Chapter will show you how to use source connectors to ingest your streaming data into HStreamDB.
As an example, we will use `source-generator` to continually generate
and ingest some random JSON data into HStreamDB.


## Install source-generator

A connector plugin is a docker image,
so before you can set up the connectors,
you should download and update their plugins with `docker pull`:
```shell
docker pull hstreamdb/source-generator
```

## Create a Connector Task

After connecting an HStream Server, you can use `create source connector`
SQL to create source connectors.

Connect to the HStream server:

```shell
docker run -it --rm --network host hstreamdb/hstream:latest hstream sql --port 6570
```

Create a source connector:

```sql
create source connector source01 from generator with (
  "stream" = "result_stream_01",
  "type" = "sequence",
  "batchSize" = 1;
  "period" = 1;
);
```

And use `show connectors` to check whether the connector task is running:

```sql
show connectors;
```

After you create the connector,
the random JSON data will be written to the stream `result_stream_01`,
you can use use the `select` statement to fetch data from the stream:
```
select * from result_stream_01 emit changes;
```

## Delete a Connector Task

You can use `drop connector` SQL to delete the connector task:

```sql
drop connector source01;
```

`drop connector` will only delete the source task,
we do not delete the result stream.
