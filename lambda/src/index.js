const { CloudWatch, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch')

exports.handler = async (event) => {
  const cloudwatch = new CloudWatch()
  console.log('Event received: ', JSON.stringify(event))
  console.log('Posting metrics in ', process.env.METRIC_NAMESPACE)
  const timestamp = new Date(event['timestamp'])
  const device = event['device']
  console.log('Timestamp:', timestamp)
  const response = await cloudwatch.send(new PutMetricDataCommand({
    Namespace: process.env.METRIC_NAMESPACE,
    MetricData: [
      {
        MetricName: 'Temperature',
        Dimensions: [{
          Name: process.env.METRIC_DIMENSION,
          Value: device,
        }],
        Timestamp: timestamp,
        Value: event['temperature'],
        Unit: 'None',
      },
      {
        MetricName: 'Humidity',
        Dimensions: [{
          Name: process.env.METRIC_DIMENSION,
          Value: device,
        }],
        Timestamp: timestamp,
        Value: event['humidity'],
        Unit: 'None',
      }
    ],
  }))

  console.log('Response from cloudwatch: ', JSON.stringify(response))

  return {
    statusCode: 200
  }
}
