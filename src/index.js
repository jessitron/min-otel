import { WebTracingProvider } from "@opentelemetry/sdk-trace-web";

function initializeTracing() {
  console.log("it's time to set up tracing baby");
}

window.initializeTracing = initializeTracing;
