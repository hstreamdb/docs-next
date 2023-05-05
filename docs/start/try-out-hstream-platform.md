# Try out HStream Platform

This page guides you on how to try out the HStream Platform quickly from scratch.
You will learn how to create a stream, write records to the stream, and query records from the stream.

## Apply for a Trial

Before starting, you need to apply for a trial account for the HStream Platform.
If you already have an account, you can skip this step.

### Create a new account

::: info
By creating an account, you agree to the [Terms of Service](https://www.emqx.com/en/policy/terms-of-use) and [Privacy Policy](https://www.emqx.com/en/policy/privacy-policy).
:::

To create a new account, please fill in the required information on the form provided on the [Sign Up](https://dev.cloud.hstream.io/app/signup) page, all fields are shown below:

- **Name**: Your full name.
- **Email**: Your email address. This email address will be used for the HStream Platform login.
- **Password**: Your password. The password must be at least eight characters long.
- **Company (Optional)**: Your company name.

After completing the necessary fields, click the **Sign Up** button to proceed with creating your new account. In case of a successful account creation, you will be redirected to the login page.

### Log in to the HStream Platform

To log in to the HStream Platform after creating an account, please fill in the required information on the form provided on the [Log In](https://dev.cloud.hstream.io/app/login) page, all fields are shown below:

- **Email**: Your email address.
- **Password**: Your password.

Once you have successfully logged in, you will be redirected to the home of HStream Platform.

## Create a stream

To create a new stream, follow the steps below:

1. Head to the **Streams** page and locate the **New Stream** button.
2. Once clicked, you will be directed to the **New Stream** page.
3. Here, simply provide a name for the stream and leave the other fields as default.
4. Finally, click on the **Confirm** button to finalize the stream creation process.

The stream will be created immediately, and you will see the stream listed on the **Streams** page.

::: tip
For more information about how to create a stream, see [Create a Stream](../write/create-a-stream-in-platform.md).
:::

## Write records to the stream

After creating a stream, you can write records to the stream. Go to the stream details page by clicking the stream name in the table and
then click the **Write Records** button. A drawer will appear, and you can write records to the stream in the drawer.

In this example, we will write the following record to the stream:

```json
{ "name": "Alice", "age": 18 }
```

Please fill it in the **Value** Field and click the **Produce** button.

If the record is written successfully, you will see a success message and the response
of the request.

Next, we can query this record from the stream.

::: tip
For more information about how to write records to a stream, see [Write Records to a Stream](../manage-streams/write-records-to-a-stream.md).
:::

## Query records from the stream

After writing records to the stream, you can query records from the stream. Go back
to the stream page, click the **Records** tab, you will see a empty table.

Click the **Search** button, and then the record written in the previous step will be displayed.

## Next steps

- Explore the [stream in details](../manage-streams/stream-details.md).
- [Create a subscription](../manage-subscriptions/create-a-subscription.md) to consume records from the stream.
- [Query records](../data-query/query-records.md) from streams.