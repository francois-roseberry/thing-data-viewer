import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { DataViewerStack } from "../data-viewer-stack";

describe("Data Viewer stack", () => {
  let stack: DataViewerStack;

  beforeEach(() => {
    const app = new App();
    stack = new DataViewerStack(app, "TestStack", {
      region: "region",
      account: "1234",
    });
  });

  it("should match snapshot", () => {
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });
});
