INSERT
======

Insert a record into specified stream.

## Synopsis

```sql
INSERT INTO stream_name (field_name [, ...]) VALUES (field_value [, ...]);
INSERT INTO stream_name VALUES CAST ('json_value'   AS JSONB);
INSERT INTO stream_name VALUES CAST ('binary_value' AS BYTEA);
INSERT INTO stream_name VALUES 'json_value'   :: JSONB;
INSERT INTO stream_name VALUES 'binary_value' :: BYTEA;
```

## Notes

- `field_value` represents the value of corresponding field, which is a [constant](../sql-overview.md#literals-constants). The correspondence between field type and inserted value is maintained by users themselves.
- `json_value` should be a valid JSON expression. And when inserting a JSON value, remember to put `'`s around it.
- `binary_value` can be any value in the form of a string. It will not be processed by HStreamDB and can only be fetched by certain client API. Remember to put `'`s around it.

## Examples

```sql
INSERT INTO weather (cityId, temperature, humidity) VALUES (11254469, 12, 65);
INSERT INTO foo VALUES CAST ('{"a": 1, "b": "abc"}' AS JSONB);
INSERT INTO foo VALUES '{"a": 1, "b": "abc"}' :: JSONB;
INSERT INTO bar VALUES CAST ('some binary value \x01\x02\x03' AS BYTEA);
INSERT INTO bar VALUES 'some binary value \x01\x02\x03' :: BYTEA;
```
