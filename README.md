# isojs

This Meteor package makes sharing code between client, server and mobile
better by parsing and removing extraneous code for the server, client or mobile.
This means code wrapped with `if (Meteor.isServer) {...}` won't be served to
the client or vice versa. The advantages of this is:

- Smaller payload for the client, mobile and server
- Better sercurity since wrapped server code won't be exposed to the client
- Slightly better performance due to reduction in extraneous code

Methods and functions can now be written for server, client and mobile without
worrying too much about payload, security and performance. A good place to use
this would be in Meteor methods for stubbing.

#### Example

The package transforms the following code

    Meteor.methods({
      sendMessage: function (msg) {
        if (Meteor.isClient) {
          UpdateView();

          if (Meteor.isCordova) {
            SendPush();
          }
        }

        if (Meteor.isServer) {
          Messages.insert({msg: msg});
        }
      }
    });

to this:

##### Server

    Meteor.methods({
      sendMessage: function (msg) {
        Messages.insert({msg: msg});
      }
    });

##### Client - Browser

    Meteor.methods({
      sendMessage: function (msg) {
        UpdateView();
      }
    });

##### Client - Mobile
    Meteor.methods({
      sendMessage: function (msg) {
        UpdateView();
        SendPush();
      }
    });


## Usage

### Warning!

This package is a proof of concept and is not recommended for use in
production.

### Install

    meteor add xamfoo:isojs

### Filenames

Save your code with file extension `.isojs`

Configure your IDE to recognize `.isojs` as javascript

### Wrapping

Wrap your code in the any of the following formats.

#### If blocks

    if (Meteor.isXX) {...}

Code wrapped in `if (Meteor.isServer) {...}` is removed in the client
payload and flattened in the server payload.

Code wrapped in `if (Meteor.isClient) {...}` is removed in the server
payload and flattened in the client payload.

Code wrapped in `if (Meteor.isCordova) {...}` is removed in the server
and browser payload, and flattened in the cordova payload.

Flattening means the following:

>     if (Meteor.isServer) {doSomething();}
>
> transforms to this in the server payload:
>
>     doSomething();

#### NOT(!) operator

    if (!Meteor.isXX) {...}

A single `!` operator is supported to turn a truthy block to a falsy one.

Code wrapped in `if (!Meteor.isServer) {...}` is removed in the server
payload and flattened in the client payload.

Code wrapped in `if (!Meteor.isClient) {...}` is removed in the client
payload and flattended in the server payload.

Code wrapped in `if (!Meteor.isCordova) {...}` is removed in the cordova
payload, and flattened in the server and browser payload.

#### If Else blocks

    if (Meteor.isXX) {...}
    else {doSomethingElse();}

Same as If blocks except that Else blocks will remain when the If block is
removed. For example, the following code

>     if (Meteor.isServer) {...}
>     else {doSomethingElse();}
>
> transforms to this for the client payload:
>
>     doSomethingElse();

#### Else If blocks

    if (Meteor.isXX) {...}
    else if (...) {doSomethingElse();}
    else {doAnythingElse();}

    if (...) {...}
    else if (Meteor.isXX) {doSomethingElse();}
    else {doAnythingElse();}

Else If blocks are also parsed and processed. For example,

>     if (Meteor.isServer) {doSomething();}
>     else if (...) {doSomethingElse();}
>     else {doAnythingElse();}
>
> becomes the following:
>
>     // in Server payload
>     doSomething();
>
>     // in Client payload
>     if (...) {doSomethingElse();}
>     else {doAnythingElse();}

In another case,

>     if (...) {doSomething();}
>     else if (Meteor.isServer) {doSomethingElse();}
>     else {doAnythingElse();}
>
> becomes the following:
>
>     // in Server payload
>     if (...) {doSomething();}
>     else {doSomethingElse();}
>
>     // in Client payload
>     if (...) {doSomething();}
>     else {doAnythingElse();}

## How it works

These NPM packages are used:

- esprima
- escodegen

The package parses all files ending with `.isojs` into ASTs (abstract syntax
tree) with `esprima`. Wrapped nodes are replaced or removed, then the ASTs are
parsed back into javascript with `escodegen`. Source maps are also generated
so that line numbers matches when debugging.

## Unsupported

- Code in eval statements
- Parser doesn't match now when `&& ||` operators are used i.e.
`if (i > 0 && Meteor.isXX)`
- Writing packages with `.isojs` is untested but should work.
- Doesn't work with CoffeeScript for now
