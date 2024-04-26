# 创建和管理 Connector

This page describes how to create and manage connectors in HStream Platform.

## Create a connector

Connector has two types: source connector and sink connector. The source connector is used to ingest data from external systems into HStream Platform, while the sink connector is used to distribute data from HStream Platform to external systems.

### Create a source connector

First, navigate to the **Sources** page and click the **New source** button to go to the **Create a new source** page.

In this page, you should first select the **Connector type**. Currently, HStream Platform supports the following source connectors:

- MongoDB
- MySQL
- PostgreSQL
- SQL Server
- Generator

Click one of them to select it, and then the page will display the corresponding configuration form.

After filling in the configuration, click the **Create** button to create the source connector.

::: tip

For more details about the configuration of each source connector, please refer to [Connectors](../develop/ingest-and-distribute/connectors.md).

:::

### Create a sink connector

Create a sink connector is similar to create a source connector. First, navigate to the **Sinks** page and click the **New sink** button to go to the **Create a new sink** page.

Then the next steps are the same as creating a source connector.

Currently, HStream Platform supports the following sink connectors:

- MongoDB
- MySQL
- PostgreSQL
- Blackhole

## View connectors

The **Sources** and **Sinks** pages display all the connectors in your account. For each connector, you can view the following information:

- The **Name** of the connector.
- The **Created time** of the connector.
- The **Status** of the connector.
- The **Type** of the connector.
- **Actions**, which for the extra operations of the connector:

  - **Duplicate**: Duplicate the connector.
  - **Delete**: Delete the connector.

To view a specific connector, you can click the **Name** of the connector to go to the [details page](#view-connector-details).

## View connector details

The details page displays the detailed information of a connector:

1. All the information in the [connectors](#view-connectors) page.
2. Different tabs are provided to display the related information of the connector:

   - [**Overview**](#view-connector-overview): Besides the basic information, also can view the metrics of the connector.
   - **Config**: View the configuration of the connector.
   - [**Consumption Process**](#view-connector-consumption-process): View the consumption process of the connector.
   - **Logs**: View the tasks of the connector.

## View connector overview

The **Overview** page displays the metrics of a connector. The default duration is **last 5 minutes**. You can select different durations to control the time range of the metrics:

- last 5 minutes
- last 1 hour
- last 3 hours
- last 6 hours
- last 12 hours
- last 1 day
- last 3 days
- last 1 week

The metrics of the connector include (with last 5 minutes as an example), from left to right:

- **Processed records throughput**: The number of records that the connector processes per second.
- **Processed bytes throughput**: The number of bytes that the connector processes per second.
- **Total records** (Sink): The number of records that the connector processes in the last 5 minutes.

## View connector consumption process

The **Consumption Process** page displays the consumption process of a connector. Different connectors have different consumption processes.

## Delete a connector

This section describes how to delete a connector.

### Delete a connector from the Connectors page

1. Navigate to the **Connectors** page.
2. Click the **Delete** icon of the connector you want to delete. A confirmation dialog will pop up.
3. Confirm the deletion by clicking the **Confirm** button in the dialog.

### Delete a connector from the Connector Details page

1. Navigate to the details page of the connector you want to delete.
2. Click the **Delete** button. A confirmation dialog will pop up.
3. Confirm the deletion by clicking the **Confirm** button in the dialog.
