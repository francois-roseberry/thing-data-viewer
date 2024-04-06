import path from "path";

import { Duration, Stack } from "aws-cdk-lib";
import {
  Dashboard,
  GraphWidget,
  type IWidget,
  MathExpression,
} from "aws-cdk-lib/aws-cloudwatch";
import {
  Effect,
  type IPrincipal,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { CfnTopicRule } from "aws-cdk-lib/aws-iot";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { type Construct } from "constructs";

export interface DataViewerStackProps {
  readonly region: string;
  readonly account: string;
}

const METRIC_NAMESPACE = "ThingData";
const METRIC_DIMENSION = "Device";

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
      environment: {
        METRIC_NAMESPACE,
        METRIC_DIMENSION,
      },
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

    const ruleLoggingRole = new Role(this, "valmetal-putToS3Action-role", {
      assumedBy: new ServicePrincipal("iot.amazonaws.com") as IPrincipal,
    });

    // Allow action to send to S3
    const logPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "logs:PutLogEvents",
        "logs:CreateLogStream",
        "logs:CreateLogGroup",
      ],
      resources: [`arn:aws:logs:${region}:${account}:*`],
    });
    ruleLoggingRole.addToPolicy(logPolicy);

    new CfnTopicRule(this, "ThingDataRule", {
      ruleName: "thing_data_rule",
      topicRulePayload: {
        awsIotSqlVersion: "2016-03-23",
        description: "Rule created to forward MQTT payloads to a lambda",
        sql: "SELECT *, timestamp() as timestamp, topic(1) as device from '$aws/rules/thing_data_rule/+'",
        actions: [
          {
            lambda: {
              functionArn: lambda.functionArn,
            },
          },
        ],
        errorAction: {
          cloudwatchLogs: {
            logGroupName: "rule-errors",
            roleArn: ruleLoggingRole.roleArn,
          },
        },
      },
    });

    // This expression will return a Set of 1 metric per Device (ex: 2 devices publish, then 2 metrics will be returned)
    // The metric label will be the device name.
    // When graphing this, it will then generate one data series per unique device
    const temperatureMetricSet = new MathExpression({
      expression: `SELECT AVG(Temperature) FROM SCHEMA(${METRIC_NAMESPACE}, ${METRIC_DIMENSION}) GROUP BY ${METRIC_DIMENSION}`,
      period: Duration.minutes(1),
      label: "",
    });

    const humidityMetricSet = new MathExpression({
      expression: `SELECT AVG(Humidity) FROM SCHEMA(${METRIC_NAMESPACE}, ${METRIC_DIMENSION}) GROUP BY ${METRIC_DIMENSION}`,
      period: Duration.minutes(1),
      label: "",
    });

    const dashboard = new Dashboard(this, "MqttMetricsDashboard", {
      dashboardName: "ThingDataViewer",
    });

    dashboard.addWidgets(
      new GraphWidget({
        left: [temperatureMetricSet],
        leftYAxis: {
          label: "Temperature (°C)",
          min: 10,
          max: 50,
          showUnits: false,
        },
        width: 12,
        height: 6,
        liveData: true,
      }) as IWidget,
      new GraphWidget({
        left: [humidityMetricSet],
        leftYAxis: {
          label: "Humidity (%)",
          min: 20,
          max: 70,
          showUnits: false,
        },
        width: 12,
        height: 6,
        liveData: true,
      }) as IWidget,
    );
  }
}
