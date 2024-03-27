/* istanbul ignore file */
import { App } from "aws-cdk-lib";

import { DataViewerStack } from "./data-viewer-stack";

const app = new App();
new DataViewerStack(app, "data-viewer");
app.synth();
