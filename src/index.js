import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";

export function initializeTracing() {
  console.log("it's time to set up tracing baby");
  const provider = new WebTracerProvider();
  console.log(provider);
}

initializeTracing();
