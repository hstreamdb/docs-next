# Distribute Data

This Chapter will show you how to use sink connectors to Distribute your streaming data into HStreamDB.
As a example, we will use sink-mysql to continually fetch
and Distribute your streaming data from HStreamDB to mysql.


## Install sink-mysql

A connector plugin is a docker image,
so before you can set up the connectors,
you should download and update their plugins with `docker pull`:
```shell
docker pull hstreamdb/sink-mysql
```

## Set up a Mysql

Set up a MySQL instance with docker:

```shell
docker run --network=hstream-quickstart --name mysql-s1 -e MYSQL_ROOT_PASSWORD=password -d mysql
```

Here we use the `hstream-quickstart` network if you set up your HStreamDB
cluster based on
[quick-start](https://hstream.io/docs/en/latest/start/quickstart-with-docker.html).

Connect to the MySQL instance:

```shell
docker exec -it mysql-s1 mysql -uroot -h127.0.0.1 -P3306 -ppassword
```

Create a database `d1`, a table `person` and insert some records:

```sql
create database d1;
use d1;
create table person (id int primary key, name varchar(256), age int);
insert into person values (1, "John", 20), (2, "Jack", 21), (3, "Ken", 33);
```

the table `person` must include a primary key, or the `DELETE` statement may not
be synced correctly.

## Create a Connector Task

Connect to the HStream server:

```shell
docker run -it --rm --network host hstreamdb/hstream:latest hstream sql --port 6570
```

After connecting an HStream Server, you can use `create sink connector`
SQL to create a sink connector:

```sql
create sink connector sink01 to mysql with (
  "host" = "mysql-s1",
  "port" = 3306,
  "user" = "root",
  "password" = "password",
  "database" = "d1",
  "table" = "person",
  "stream" = "stream01"
);
```

And use `show connectors` to check whether the connector task is running:

```sql
show connectors;
```

## Insert Data into the Stream

## Delete a Connector Task

You can use `drop connector` SQL to delete connector task:

```sql
drop connector sink01;
```

