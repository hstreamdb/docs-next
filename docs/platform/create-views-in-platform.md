# Create and Manage Materialized Views

This page describes how to create and manage materialized views in HStream Platform.

## Create a view

Create a view is similar to create a query. The main difference is that the SQL is a `CREATE VIEW` statement.

Please refer to [Create a query](./create-queries-in-platform.md#create-a-query) for more details.

## View views

The **Views** page displays all the views in your account. For each view, you can view the following information:

- The **Name** of the view.
- The **Created time** of the view.
- The **Status** of the view.
- **Actions**, which for the extra operations of the view:

  - **Delete**: Delete the view.

To view a specific view, you can click the **Name** of the view to go to the [details page](#view-view-details).

## View view details

The details page displays the detailed information of a view:

1. All the information in the [views](#view-views) page.
2. Different tabs are provided to display the related information of the view:

   - [**Overview**](#view-view-overview): Besides the basic information, also can view the metrics of the view.
   - [**SQL**](#view-view-sql): View the SQL of the view.

## View view overview

The **Overview** page displays the metrics of a view. The default duration is **last 5 minutes**. You can select different durations to control the time range of the metrics:

- last 5 minutes
- last 1 hour
- last 3 hours
- last 6 hours
- last 12 hours
- last 1 day
- last 3 days
- last 1 week

The metrics of the view include (with last 5 minutes as an example), from left to right:

- **Execution queries throughput**: The number of queries that the view executes per second.
- **Execution queries**: The number of queries that the view executes in the last 5 minutes.

## View view SQL

The **SQL** page displays the SQL of a view. You can only view the SQL of the view, but cannot edit it.

## Delete a view

This section describes how to delete a view.

### Delete a view from the Views page

1. Navigate to the **Views** page.
2. Click the **Delete** icon of the view you want to delete. A confirmation dialog will pop up.
3. Confirm the deletion by clicking the **Confirm** button in the dialog.

### Delete a view from the View Details page

1. Navigate to the details page of the view you want to delete.
2. Click the **Delete** button. A confirmation dialog will pop up.
3. Confirm the deletion by clicking the **Confirm** button in the dialog.
