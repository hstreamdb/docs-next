# Create and Manage Streams

This tutorial guides you on how to create and manage streams in HStream Platform.

## Preparation

1. If you do not have an account, please [apply for a trial](../start/try-out-hstream-platform.md#apply-for-a-trial) first and log in. After logging in, click **Streams** on the left sidebar to enter the streams page.

2. If you have already logged in, click **Streams** on the left sidebar to enter the **Streams** page.

3. Click the **New stream** button to create a stream.

## Create a stream

After clicking the **New stream** button, you will be directed to the **New Stream** page. You need to set some necessary properties for your stream and create it:

1. Specify the **stream name**. You can refer to [Guidelines to name a resource](../develop/write/stream.md#guidelines-to-name-a-resource) to name a stream.

2. Fill in with the number of **shards** you want this stream to have. The default value is **1**.

   > Shard is the primary storage unit for the stream. For more details, please refer to [Sharding in HStreamDB](../develop/write/shards.md#sharding-in-hstreamdb).

3. Fill in with the number of **replicas** for each stream. The default value is **3**.

4. Fill in with the number of **retention** for each stream. Default value is **72**. Unit is **hour**.

5. Click the **Confirm** button to create a stream.

::: tip
For more details about **replicas** and **retention**, please refer to [Attributes of a Stream](../develop/write/stream.md#attributes-of-a-stream).
:::

::: warning
Currently, the number of **replicas** and **retention** are fixed for each stream in HStream Platform. We will gradually adjust these attributes in the future.
:::

## View streams

The **Streams** page lists all the streams in your account with a high-level overview. For each stream, you can view the following information:

- The **name** of the stream.
- The **Creation time** of the stream.
- The number of **shards** in a stream.
- The number of **replicas** in a stream.
- The **Data retention period** of the records in a stream.
- **Actions**, which for the extra operations of the stream:

  - **Metrics**: View the metrics of the stream.
  - **Subscriptions**: View the subscriptions of the stream.
  - **Shards**: View the shard details of the stream.
  - **Delete**: Delete the stream.

To view a specific stream, click the name. [The details page of the stream](#view-stream-details) will be displayed.

## View stream details

The details page displays the detailed information of a stream:

1. All the information in the [streams](#view-streams) page.
2. Different tabs are provided to display the related information of the stream:

   - [**Metrics**](#view-stream-metrics): View the metrics of the stream.
   - [**Subscriptions**](#view-stream-subscriptions): View the subscriptions of the stream.
   - [**Shards**](#view-stream-shards): View the shard details of the stream.
   - [**Records**](#get-records-in-a-stream): Search records in the stream.

### View stream metrics

After clicking the **Metrics** tab, you can view the metrics of the stream.
The default duration is **last 5 minutes**. You can select different durations to control the time range of the metrics:

- last 5 minutes
- last 1 hour
- last 3 hours
- last 6 hours
- last 12 hours
- last 1 day
- last 3 days
- last 1 week

The metrics of the stream include (with last 5 minutes as an example), from left to right:

- The **Append records throughout** chart shows the number of records to the stream per second in the last 5 minutes.
- The **Append bytes throughout** chart shows the number of bytes to the stream per second in the last 5 minutes.
- The **Total requests** chart shows the number of requests to the stream in the last 5 minutes. Including failed requests.
- The **Append requests throughout** chart shows the number of requests to the stream per second in the last 5 minutes.

### View stream subscriptions

After clicking the **Subscriptions** tab, you can view the subscriptions of the stream.

To create a new subscription, please refer to [Create a Subscription](./subscription-in-platform.md#create-a-subscription).

For more details about the subscription, please refer to [Subscription Details](./subscription-in-platform.md#subscription-details)

### View stream shards

After clicking the **Shards** tab, you can view the shard details of the stream.

For each shard, you can view the following information:

- The **ID** of the shard.
- The **Range start** of the shard.
- The **Range end** of the shard.
- The current **Status** of the shard.

You can use the ID to get records. Please refer to [Get records in a stream](#get-records-in-a-stream) or [Get Records](./write-in-platform.md#get-records).

### Get records in a stream

After clicking the **Records** tab, you can get records in the stream.

::: tip

To get records from any streams, please refer to [Get Records](./write-in-platform.md#get-records).

:::

You can specify the following filters to get records:

- **Shard**: Select one of the shards in the stream you want to get records from.
- Special filters:
  - **Start record ID**: Get records after a specified record ID. The default is the first record.
  - **Start date**: Get records after a specified date.

After providing the filters (or not), click the **Get records** button to get records. Each record is displayed in a row with the following information:

- The **ID** of the record.
- The **Key** of the record.
- The **Value** of the record.
- The **Shard ID** of the record.
- The **Creation time** of the record.

## Delete a Stream

This section describes how to delete a stream.

::: warning
If a stream has subscriptions, this stream cannot be deleted.
:::

::: danger
Deleting a stream is irreversible, and the data cannot be recovered after deletion.
:::

### Delete a stream on the Streams page

1. Navigate to the **Streams** page.
2. Click the **Delete** icon of the stream you want to delete. A confirmation dialog will pop up.
3. Confirm the deletion by clicking the **Confirm** button in the dialog.

### Delete a stream on the Stream Details page

1. Navigate to the details page of the stream you want to delete.
2. Click the **Delete** button. A confirmation dialog will pop up.
3. Confirm the deletion by clicking the **Confirm** button in the dialog.
