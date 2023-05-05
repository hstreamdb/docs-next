# sink-mysql

`sink-mysql` is a jdbc sink plugin for MySQL,
sink-jdbc uses the UPSERT statement to implement INSERT and UPDATE for idempotence,
so it can deal with the duplicated records caused by resending.

## Data Example

There are some examples(source stream data and the result table data):
```
# stream records:
{"id": 1, "val": 1}
{"id": 2, "val": 2}
{"id": 3, "val": 3}

# result table rows:
+----+------+
| id | val  |
+----+------+
|  1 |    1 |
|  2 |    2 |
|  3 |    3 |
+----+------+
```

duplicated records:
```
# stream records:
{"id": 1, "val": 1}
{"id": 2, "val": 2}
{"id": 3, "val": 3}
{"id": 3, "val": 3}

# result table rows:
+----+------+
| id | val  |
+----+------+
|  1 |    1 |
|  2 |    2 |
|  3 |    3 |
+----+------+
```

records that have the same key but different values:
```
# stream records:
{"id": 1, "val": 1}
{"id": 2, "val": 2}
{"id": 3, "val": 3}
{"id": 3, "val": 3}
{"id": 3, "val": 1}

# result table rows:
+----+------+
| id | val  |
+----+------+
|  1 |    1 |
|  2 |    2 |
|  3 |    1 |
+----+------+
```

## Requirements

+ You need to create a table before creating a connector task
+ Your result MySQL table should have primary keys

## Configuration


| Property                 | Pattern | Type    | Deprecated | Definition | Title/Description          |
| ------------------------ | ------- | ------- | ---------- | ---------- | -------------------------- |
| + [stream](#stream )     | No      | string  | No         | -          | source HStream stream name |
| + [host](#host )         | No      | string  | No         | -          | mysql hostname             |
| + [port](#port )         | No      | integer | No         | -          | mysql port                 |
| + [user](#user )         | No      | string  | No         | -          | mysql user                 |
| + [password](#password ) | No      | string  | No         | -          | mysql password             |
| + [database](#database ) | No      | string  | No         | -          | target database name       |
| + [table](#table )       | No      | string  | No         | -          | table name of the database |

