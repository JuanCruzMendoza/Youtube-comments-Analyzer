/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: "youtube-comment-insights",
            removal: input?.stage === "production" ? "retain" : "remove",
            home: "aws",
        };
    },
    async run() {
        // Define resources here
        // const bucket = new sst.aws.Bucket("MyBucket");
    },
});
