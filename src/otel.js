import { WebTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-web";
import { trace } from "@opentelemetry/api";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

export function initializeTracing() {
  console.log("it's time to set up tracing baby");
  const provider = new WebTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "browser",
    }),
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));

  provider.register({
    // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
    contextManager: new ZoneContextManager(),
  });
  console.log("Tracing initialized");
}

export function sendTestSpan() {
  const span = trace.getTracer("test span").startSpan("test span");
  console.log("Sending test span", span.spanContext());
  span.end();
}

window.Otel = { sendTestSpan, initializeTracing };
