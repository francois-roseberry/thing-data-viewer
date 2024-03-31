const sendMock = jest.fn()

const CloudWatch = {
  send: sendMock,
}

module.exports = {
  CloudWatch: jest.fn().mockImplementation(() => CloudWatch),
  PutMetricDataCommand: jest.fn().mockImplementation((arg) => arg),
  sendMock,
}
