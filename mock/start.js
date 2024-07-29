var mockserver = require("mockserver-node");

async function start(){
  mockserver.start_mockserver({
    serverPort: 1088,
    jvmOptions: "-Dmockserver.enableCORSForAllResponses=true",
    verbose: false,
    trace: false,
  });

  console.log("started listening on 1088");
}

start().then(() => {});

