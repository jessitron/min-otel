# minimal otel for the browser

Can I make a .js file that I can import from HTML?

It needs to do the basics:

https://opentelemetry.io/docs/instrumentation/js/getting-started/browser/

## progress so far

I have it making some sort of bundle, and I can call it from an html file

I have to say 'module' for my script in the html, and then import this from within there. Not my preference but it's what I could get parcel to do.

I can run the collector locally in Docker -- that's in ./run-collector

parcel serve crashes though!!

and parcel build doesn't build the html?

I tried copying the index.js output over to another project and importing it in html, but I got an error, something mysterious in import syntax.

It is time to give up :sad:

the 'build' and 'serve' commands seem to fight. When one crashes and does nothing, try removing `.parcel-cache`
