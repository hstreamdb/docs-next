# 创建和管理 Streaming Query

This page describes how to create and manage streaming queries in HStream Platform.

## Create a query

First, navigate to the **Queries** page and click the **Create query** button to
go to the **Create query** page.

In this page, you can see 3 areas used throughout the creation process:

- The **Stream Catalog** area on the left is used to select the streams you
  want to use in the query.
- The **Query Editor** area on the top right is used to write the query.
- The **Query Result** area on the bottom right is used to display the query result.

Below sections describe how these areas are used in the creation process.

### Stream Catalog

The **Stream Catalog** will display all the streams as a list. You can use one of
them as the source stream of the query. For example, if a stream is `test`, after
selecting it, the **Query Editor** will be filled with the following query:

```sql
CREATE STREAM stream_iyngve AS SELECT * FROM test;
```

This can help you quickly create a query. You can also change the query to meet your needs.

::: tip
The auto-generated query is commented by default. You need to uncomment it to make it work.
:::

::: info
The auto-generated query will generate a stream with a `stream_` prefix and a random suffix after
creating it. You can change the name of the stream to meet your needs.
:::

### Query Editor

The **Query Editor** is used to write the query.

Besides the textarea, there are still a right sidebar to assist you in writing the query.
To create a query, you need to provide a **Query name** to identify the query, an text field in the right sidebar will automatically generate a query name for you. You can also change it to meet your needs.

Once you finish writing the query, click the **Save & Run** button to create the query and run it.

### Query Result

After creating the query, the **Query Result** area will display the query result in real time.

The query result is displayed in a table. Each row represents a record in the stream. You can refer to [Get Records](./write-in-platform.md#get-records) to learn more about the record.

If you want to stop viewing the query result, you can click the **Cancel** button to stop it. For re-viewing the query result, you can click the **View Live Result** button to view again.

::: info

When creating a materialized view, it will internally create a query and its result is the view. So the query result is the same as the view result.

:::

## View queries

The **Queries** page displays all the queries in your account. For each query, you can view the following information:

- The **Name** of the query.
- The **Created time** of the query.
- The **Status** of the query.
- The **SQL** of the query.
- **Actions**, which for the extra operations of the query:

  - **Terminate**: Terminate the query.
  - **Duplicate**: Duplicate the query.
  - **Delete**: Delete the query.

To view a specific query, you can click the **Name** of the query to go to the [details page](#view-query-details).

## View query details

The details page displays the detailed information of a query:

1. All the information in the [queries](#view-queries) page.
2. Different tabs are provided to display the related information of the query:

   - [**Overview**](#view-query-overview): Besides the basic information, also can view the metrics of the query.
   - [**SQL**](#view-query-sql): View the SQL of the query.

## View query overview

The **Overview** page displays the metrics of a query. The default duration is **last 5 minutes**. You can select different durations to control the time range of the metrics:

- last 5 minutes
- last 1 hour
- last 3 hours
- last 6 hours
- last 12 hours
- last 1 day
- last 3 days
- last 1 week

The metrics of the query include (with last 5 minutes as an example), from left to right:

- **Input records throughput**: The number of records that the query receives from the source stream per second.
- **Output records throughput**: The number of records that the query outputs to the result stream per second.
- **Total records**: The number of records to the query in the last 5 minutes. Including input and output records.
- **Execution errors**: The number of errors that the query encounters in the last 5 minutes.

## View query SQL

The **SQL** page displays the SQL of a query. You can only view the SQL of the query, but cannot edit it.

## Delete a query

This section describes how to delete a query.

### Delete a query from the Queries page

1. Navigate to the **Queries** page.
2. Click the **Delete** icon of the query you want to delete. A confirmation dialog will pop up.
3. Confirm the deletion by clicking the **Confirm** button in the dialog.

### Delete a query from the Query Details page

1. Navigate to the details page of the query you want to delete.
2. Click the **Delete** button. A confirmation dialog will pop up.
3. Confirm the deletion by clicking the **Confirm** button in the dialog.
