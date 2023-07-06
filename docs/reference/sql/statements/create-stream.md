CREATE STREAM
=============

Create a new hstream stream with the given name. An exception will be thrown if a stream with the same name already exists.

## Synopsis

```sql
CREATE STREAM stream_name [ AS select_query ] WITH ([ REPLICATE = INT, DURATION = INTERVAL ]);
```

## Notes

- `stream_name` is a valid identifier.
- `select_query` is an optional `SELECT` (Stream) query. For more information, see `SELECT` section. When `<select_query>` is specified, the created stream will be filled with records from the `SELECT` query continuously. Otherwise, the stream will only be created and kept empty.
- `WITH` clause contains some stream options. Only `REPLICATE` and `DURATION` options are supported now, which represents the replication factor and the retention time of the stream. If it is not specified, they will be set to default value.
- Sources in `select_query` can be both stream(s) and materialized view(s).

## Examples

```sql
CREATE STREAM foo;

CREATE STREAM abnormal_weather AS SELECT * FROM weather WHERE temperature > 30 AND humidity > 80;
```
