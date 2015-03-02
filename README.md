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

### Format

Wrap your code in the any of the following formats:

`if (Meteor.isServer) {...}`

`if (Meteor.isClient) {...}`

`if (Meteor.isCordova) {...}`

`if (!Meteor.isServer) {...}`

`if (!Meteor.isClient) {...}`

`if (!Meteor.isCordova) {...}`

The parser also recognizes `else if` blocks so the following formats would also
be processed:

`if (...) {...} else if (Meteor.isServer) {...} else {...}`

`if (...) {...} else if (...) {...} else if (Meteor.isServer) {...} else {...}`

### Filenames

Save your code with file extension `.isojs`

Configure your IDE to recognize `.isojs` as javascript

## How it works

These NPM packages are used:

- esprima
- escodegen

The package parses all files ending with `.isojs` into ASTs (abstract syntax
tree) with `esprima`. Wrapped nodes are replaced or removed, then the ASTs are
parsed back into javascript with `escodegen`.
