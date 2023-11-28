import { WebTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-web";
import { trace } from "@opentelemetry/api";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

function initializeTracing(serviceName = "browser") {
  const provider = new WebTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      "browser.user_agent": window.navigator.userAgent,
      "browser.language": window.navigator.language,
      "browser.mobile": window.navigator.mobile,
      "browser.url": window.location.href,
      "http.url": window.location.href,
    }),
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));

  provider.register({
    contextManager: new ZoneContextManager(),
  });
  console.log("Tracing initialized");
}

function instrumentGlobalErrors() {
  const tracer = trace.getTracer("@jessitron/errors");
  window.addEventListener("error", (e) => {
    const span = tracer.startSpan("Error on page");
    span.setAttributes({
      error: true,
      "error.message": e.message,
      "error.stack": e.error?.stack,
      "error.filename": e.filename,
      "error.line_number": e.lineno,
      "error.column_number": e.colno,
    });
    span.end();
  });
}

function sendTestSpan() {
  const span = trace.getTracer("test span").startSpan("test span");
  console.log("Sending test span", span.spanContext());
  span.end();
}

// Now for the REAL export
export const Otel = { sendTestSpan, initializeTracing, trace, instrumentGlobalErrors };
window.Otel = Otel;
