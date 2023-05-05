# Write Records to Streams in HStream Platform

After creating a stream, you can write records to it according to the needs of your application.
This page describes how to write records to streams.

## Preparation

To write records, you need to create a stream first.

1. If you do not have a stream, please refer to [Create a Stream](./stream-in-platform.md#create-a-stream) to create a stream.

2. Go into any stream you want to write records to on the **Streams** page.

3. Click the **Write Records** button to write records to the stream.

## Write records

A record is like a piece of JSON data. You can add arbitrary fields to a record, only ensure that the record is a valid JSON object.

A record also ships with a partition key, which is used to determine which shard the record will be allocated to and improve the read/write performance.

::: tip
For more details about the partition key, please refer to [Partition Key](./write.md#write-records-with-partition-keys).
:::

Take the following steps to write records to a stream:

1. Specify the optional **Key**. This is the partition key of the record. The server will automatically assign a default key to the record if not provided.

2. Fill in the **Value**. This is the content of the record. It must be a valid JSON object.

3. Click the **Produce** button to write the record to the stream.

4. If the record is written successfully, you will see a success message below the **Produce** button.

5. If the record is written failed, you will see a failure message below the **Produce** button.

## Query Records

After writing records to a stream, you can query records from the **Records** page or the **Stream Details** page.

### Query records from the Records page

After navigating to the **Records** page, you can query records from a stream.

Below are several filters you can use to query records:

- **Stream**: Select the stream you want to query records.
- **Shard**: Select one of the shards in the stream you want to query records.
- **Starting record ID**: Search from a specified record ID.

::: info
The **Stream** and **Shard** will be filled automatically after loading the page.
By default, the filled value is the first stream and the first shard in the stream.
You can change them to query records from other streams.
:::

::: info
We default to showing at most **100 records** after querying. If you want to query more records,
please specify a recent record ID in the **Starting record ID** field.
:::

After filling in the filters, click the **Search** button to query records.

For each record, you can view the following information:

1. The **ID** of the record.
2. The **Key** of the record.
3. The **Value** of the record.
4. The **Shard ID** of the record.
5. The **Creation time** of the record.

In the next section, you will learn how to query records from the Stream Details page.

### Query records from the Stream Details page

Similar to [Query records from Records page](#query-records-from-the-records-page),
you can also query records from the **Stream Details** page.

The difference is that you can query records without specifying the stream.
The records will automatically be queried from the stream you are currently viewing.

For more details, please refer to [Search records in a stream](./stream-in-platform.md#search-records-in-a-stream).
