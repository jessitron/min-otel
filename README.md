# My minimal OpenTelemetry-for-the-browser distribution

Currently (November 2023), OpenTelemetry doesn't offer a single .js file that I can import in a script tag.

I want this so that my toy app can send spans to Honeycomb to tell me that someone hit the page, and when some JS threw an error.

This repository constructs a .js file, wrapping the OpenTelemetry libraries, using Parcel to bundle the necessary code up. It publishes the .js as a GitHub release.

## Make your own distribution

I don't recommend using this; instead, I recommend copying it and making your own tiny distribution that does what you want and nothing else.

## Use

`<script href=https://github.com/jessitron/min-otel/releases/download/v0.0.3/otel.js"></script>`

(where v0.0.3 is the current prerelease)

This adds an object `Otel` to the global `window`. Use it in your other JavaScript.

|global| use |
|------|-----|
|`Otel.initializeTracing()`|Call this first. It configures OpenTelemetry to send spans over HTTP with Protobuf to a local collector, at port 4318, endpoint `/v1/traces`.|
|`Otel.sendTestSpan()`|Look for a span named "test span" to see whether tracing works|
|`Otel.trace`|The `trace` object from `@opentelemetry/api`. Call `getTracer("custom library.name")` to make your own spans|
|`Otel.instrumentGlobalErrors()`| Listen for errors on the window, and send a span when it happens.|


This little wrapper follows [OpenTelemetry's browser instructions](https://opentelemetry.io/docs/instrumentation/js/getting-started/browser/). It doesn't add any automatic instrumentation.

Currently this results in a binary under half a meg.

### examples

See [otel.js](https://github.com/jessitron/min-otel/blob/main/src/otel.js) for the code.

See [index.html](https://github.com/jessitron/min-otel/blob/main/src/index.html) for an example of use; but you'll change the script tag that brings it in, because that one expects `otel.js` locally.

## Development

Change something in otel.js,`npm install`, and `npm run build`. This builds a parcel target defined in `package.json`. The output goes to `dist/otel.js`. 

To test, change `index.html` and then run `npm run futz` to copy it to dist and serve it. Load the page, and then check the dev tools. Network tab should show hits to `/v1/traces`.

which won't work until you run a collector.

### Run a local collector

Edit `otel-local-config.yaml` and put a Honeycomb API key in the spot.

Start Docker.

`./run-collector`

## notes

Why GitHub releases? Because password reset on npmjs.com is not working. 
