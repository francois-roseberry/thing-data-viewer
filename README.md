# thing-data-viewer

This project contains an infrastructure stack in the /infra folder, written in TypeScript using CDK [CDK](https://aws.amazon.com/cdk/) project that will deploy the following:

- An IoT Core Rule
- A Lambda
- A Cloudwatch Custom Dashboard

As for the device sending information to that cloud infrastructure, you will find the code [here](https://github.com/francois-roseberry/iot-demo-samples)

When your device sends a message with some data over MQTT to the cloud, what will happen is this: 

- The AWS IoT MQTT engine will receive it, and will match it against the rules it have
- The rule will be triggered and it will call a lambda (serverlesss function)
- The lambda will put that data into custom Cloudwatch metrics. These metrics will then be monitored in a Cloudwatch dashboard.

At the time of writing this, all of the AWS resources in this project are within the free tier.
