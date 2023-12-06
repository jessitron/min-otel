import { WebTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-web";
import { trace } from "@opentelemetry/api";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';



var tracer;

const defaultParameters = {
  serviceName: "browser",
  defaultTracerName: "default tracer",
  collectorUrl: "http://localhost:4318/v1/traces",
};

function initializeTracing(input) {
  const { serviceName, defaultTracerName, collectorUrl } = { ...defaultParameters, ...input };
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
  provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter({ url: collectorUrl })));

  provider.register({
    contextManager: new ZoneContextManager(),
  });

  registerInstrumentations({
    instrumentations: [new DocumentLoadInstrumentation()],
  });

  tracer = trace.getTracer(defaultTracerName);
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

function inSpan(name, callback) {
  return tracer.startActiveSpan(name, (span) => {
    const result = callback(span);
    span.end();
    return result;
  });
}

function setAttributes(obj) {
  trace.getActiveSpan()?.setAttributes(obj);
}

/* I'm exporting 'trace' here, but I have a feeling some of the functionality on it is stripped off.
 * getActiveSpan() was missing, when I tried to use that outside of this project, while this project was not
 * using it.
 * Someday, don't export 'trace' because it is a lie. Or do, but document which parts of TraceAPI are gonna be on it.
 */
export const Otel = { sendTestSpan, initializeTracing, trace, instrumentGlobalErrors, inSpan, setAttributes };
// Now for the REAL export
window.Otel = Otel;
