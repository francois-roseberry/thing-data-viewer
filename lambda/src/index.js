const { CloudWatch, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch')

exports.handler = async (event) => {
  const cloudwatch = new CloudWatch()
  cloudwatch.send(new PutMetricDataCommand({
    Namespace: 'ThingData',
    MetricData: [
      {
        MetricName: 'Temperature',
        Dimensions: [{
          Name: 'Device',
          Value: event['device'],
        }],
        Timestamp: event['timestamp'],
        Value: event['temperature'],
        Unit: 'None',
      },
      {
        MetricName: 'Humidity',
        Dimensions: [{
          Name: 'Device',
          Value: event['device'],
        }],
        Timestamp: event['timestamp'],
        Value: event['humidity'],
        Unit: 'None',
      }
    ],
  }))
}
