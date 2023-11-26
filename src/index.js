import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { trace } from "@opentelemetry/api";
import { ZoneContextManager } from "@opentelemetry/context-zone";

export function initializeTracing() {
  console.log("it's time to set up tracing baby");
  const provider = new WebTracerProvider();

  provider.register({
    // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
    contextManager: new ZoneContextManager(),
  });

  console.log(provider);
}

export function sendTestSpan() {
  const span = trace.getTracer("test span").startSpan("test span");
  console.log("Sending test span", span.spanContext());
  span.end();
}
