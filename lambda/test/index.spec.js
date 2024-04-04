jest.mock('@aws-sdk/client-cloudwatch')

const { handler } = require('../src')
const { sendMock } = require('./__mocks__/@aws-sdk/client-cloudwatch')

describe('Mqtt to cloudwatch metrics lambda', () => {
  it('should put temperature and humidity in the MQTT payload into CloudWatch metrics', () => {
    process.env.METRIC_NAMESPACE = 'namespace'
    process.env.METRIC_DIMENSION = 'dimension'
    const device = 'SomeDevice'
    const temperature = 32
    const humidity = 55.20
    const timestamp = new Date()

    handler({
      device,
      temperature,
      humidity,
      timestamp,
    })

    expect(sendMock).toHaveBeenCalledWith({
      Namespace: 'namespace',
      MetricData: [
        {
          MetricName: 'Temperature',
          Dimensions: [{
            Name: 'dimension',
            Value: device
          }],
          Timestamp: timestamp,
          Value: temperature,
          Unit: 'None',
        },
        {
          MetricName: 'Humidity',
          Dimensions: [{
            Name: 'dimension',
            Value: device,
          }],
          Timestamp: timestamp,
          Value: humidity,
          Unit: 'None',
        }
      ],
    })
  })
})
