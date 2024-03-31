/* istanbul ignore file */
import { App } from "aws-cdk-lib";

import { DataViewerStack } from "./data-viewer-stack";

const ACCOUNT = "888882793194";

const app = new App();
new DataViewerStack(app, "data-viewer", {
  region: "us-eqst-1",
  account: ACCOUNT,
});
app.synth();
