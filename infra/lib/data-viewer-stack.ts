import path from "path";

import { Duration, Stack } from "aws-cdk-lib";
import { Effect, PolicyStatement, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { CfnTopicRule } from "aws-cdk-lib/aws-iot";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { type Construct } from "constructs";

export interface DataViewerStackProps {
  readonly region: string;
  readonly account: string;
}

export class DataViewerStack extends Stack {
  constructor(scope: Construct, id: string, props: DataViewerStackProps) {
    super(scope, id);

    const { region, account } = props;

    const projectRoot = path.join(__dirname, "../../lambda/");
    const lambda = new NodejsFunction(this, "MqttToCloudwatchMetricsLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "./src/index.handler",
      functionName: "MqttToCloudwatchMetricsLambda",
      projectRoot,
      entry: path.join(projectRoot, "src/index.js"),
      depsLockFilePath: path.join(projectRoot, "yarn.lock"),
      timeout: Duration.seconds(60),
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            "logs:PutLogEvents",
            "logs:CreateLogStream",
            "logs:CreateLogGroup",
          ],
          resources: [`arn:aws:logs:${region}:${account}:*`],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["cloudwatch:PutMetricData"],
          resources: ["*"],
        }),
      ],
    });
    lambda.grantInvoke(new ServicePrincipal("iot.amazonaws.com"));

    // I don't seem to be able to put dimensions in the metric with this action. Might have to go with a lambda

    new CfnTopicRule(this, "ThingDataRule", {
      ruleName: "thing_data_rule",
      topicRulePayload: {
        awsIotSqlVersion: "2016-03-23",
        description: "Rule created to forward MQTT payloads to a lambda",
        sql: "SELECT topic(1) as thing_name from $aws/rules/thing_data_rule/+",
        actions: [
          {
            lambda: {
              functionArn: lambda.functionArn,
            },
          },
        ],
      },
    });

    // const metric = new Metric({
    //   namespace: 'ThingData',
    //   metricName: 'Temperature',
    // })
    //
    // const dashboard = new Dashboard(this, 'MqttMetricsDashboard', {
    //   dashboardName: 'ThingDataViewer',
    // })

    // dashboard.addWidgets(new GraphWidget({
    //   left: [metric],
    //   leftYAxis: {
    //     label: 'Temperature',
    //     min: 0,
    //     max: 60,
    //   },
    // }))
  }
}
