# Create and Manage Subscriptions in HStream Platform

This tutorial guides you on how to create and manage subscriptions in HStream Platform.

## Preparation

1. If you do not have an account, please [apply for a trial](../start/try-out-hstream-platform.md#apply-for-a-trial) first and log in. After logging in, click **Subscriptions** on the left sidebar to enter the subscriptions page.

2. If you have already logged in, click **Subscriptions** on the left sidebar to enter the **Subscriptions** page.

3. Click the **New subscription** button to create a subscription.

## Create a subscription

After clicking the **New subscription** button, you will be directed to the **New subscription** page. You need to set some necessary properties for your stream and create it:

1. Specify the **Subscription ID**. You can refer to [Guidelines to name a resource](../write/stream.md#guidelines-to-name-a-resource) to name a subscription.

2. Select a stream as the source from the dropdown list.

3. Fill in with the **ACK timeout**. The default value is **60**. Unit is **second**.

4. Fill in the number of **max unacked records**. The default value is **100**.

5. Click the **Confirm** button to create a subscription.

::: tip
For more details about **ACK timeout** and **max unacked records**, please refer to [Attributes of a Subscription](../receive/subscription.md#attributes-of-a-subscription).
:::

::: warning
Currently, the number of **ACK timeout** and **max unacked records** are fixed for each subscription in HStream Platform. We will gradually adjust these attributes in the future.
:::

## View subscriptions

The **Subscriptions** page lists all the subscriptions in your account with a high-level overview. For each subscription, you can view the following information:

- The subscription's **ID**.
- The name of the **stream** source. You can click on the stream name to navigate the [stream details](./stream-in-platform.md#view-stream-details) page.
- The **ACK timeout** of the subscription.
- The **Max unacked records** of the subscription.
- The **Creation time** of the subscription.
- **Actions**, which is used to expand the operations of the subscription:

  - **Metrics**: View the metrics of the subscription.
  - **Consumers**: View the consumers of the subscription.
  - **Delete**: Delete the subscription.

To view a specific subscription, click the subscription's name. [The details page of the subscription](#view-subscription-details) will be displayed.

## View subscription details

The details page displays detailed information about a subscription:

1. All the information in the [subscriptions](#view-subscriptions) page.
2. Different tabs are provided to view the related information of the subscription:

   - [**Metrics**](#view-subscription-metrics): View the metrics of the subscription.
   - [**Consumers**](#view-subscription-consumers): View the consumers of the subscription.
   - [**Consumption progress**](#view-the-consumption-progress-of-the-subscription): View the consumption progress of the subscription.

### View subscription metrics

After clicking the **Metrics** tab, you can view the metrics of the subscription.
The default duration is **last 5 minutes**. You can select different durations to control the time range of the metrics:

- last 5 minutes
- last 1 hour
- last 3 hours
- last 6 hours
- last 12 hours
- last 1 day
- last 3 days
- last 1 week

The metrics of the subscription include (with last 5 minutes as an example), from left to right:

- The **Outcoming bytes throughput** chart shows the number of bytes sent by the subscription per second in the last 5 minutes.
- The **Outcoming records throughput** chart shows the number of records sent by the subscription per second in the last 5 minutes.
- The **Acknowledgements throughput** chart shows the number of acknowledgements received in the subscription per second in the last 5 minutes.
- The **Resent records** chart shows the number of records resent in the subscription in the last 5 minutes.

### View subscription consumers

After clicking the **Consumers** tab, you can view the consumers of the subscription.

For each consumer, you can view the following information:

- The **Name** of the consumer.
- The **Type** of the consumer.
- The **URI** of the consumer.

### View the consumption progress of the subscription

After clicking the **Consumption progress** tab, you can view the consumption progress of the subscription.

For each progress, you can view the following information:

- The **Shard ID** of the progress.
- The **Last checkpoint** of the progress.

## Delete a Subscription

This section describes how to delete a subscription.

### Delete a subscription on the Subscriptions page

1. Go to the **Subscriptions** page.
2. Click the **Delete** icon of the subscription you want to delete. A confirmation dialog will pop up.
3. Confirm the deletion by clicking the **Confirm** button in the dialog.

### Delete a subscription on Subscription Details page

1. Go to the details page of the subscription you want to delete.
2. Click the **Delete** button. A confirmation dialog will pop up.
3. Confirm the deletion by clicking the **Confirm** button in the dialog.
