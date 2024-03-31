jest.mock('@aws-sdk/client-cloudwatch')

const { handler } = require('../src')
const { sendMock } = require('./__mocks__/@aws-sdk/client-cloudwatch')

describe('Mqtt to cloudwatch metrics lambda', () => {
  it('should put temperature and humidity in the MQTT payload into CloudWatch metrics', () => {
    const device = 'SomeDevice'
    const temperature = 32
    const humidity = 55.20
    const timestamp = '123456789'

    handler({
      device,
      temperature,
      humidity,
      timestamp,
    })

    expect(sendMock).toHaveBeenCalledWith({
      Namespace: 'ThingData',
      MetricData: [
        {
          MetricName: 'Temperature',
          Dimensions: [{
            Name: 'Device',
            Value: device
          }],
          Timestamp: timestamp,
          Value: temperature,
          Unit: 'None',
        },
        {
          MetricName: 'Humidity',
          Dimensions: [{
            Name: 'Device',
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
