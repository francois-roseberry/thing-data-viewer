# thing-data-viewer

This project contains two parts: a fake device, intended to run on your machine and send data to AWS IoT and a [CDK](https://aws.amazon.com/cdk/) project that will deploy the following:

- An IoT Core Rule
- A Lambda
- A Cloudwatch Custom Dashboard

When a device sends a message with some data over MQTT to the rule, it will call a lambda, which will put that data into custom Cloudwatch metrics. These metrics will then be monitored in a Cloudwatch dashboard.
