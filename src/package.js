Npm.depends({'esprima': '2.0.0'});

Package.describe({
  name: 'xamfoo:isojs',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "compileIsojs",
  use: [],
  sources: [
    'plugin/compile-isojs.js'
  ],
  npmDependencies: {'esprima': '2.0.0', 'escodegen': '1.6.1'}
});

Package.onTest(function(api) {
  api.use(['tinytest', 'xamfoo:isojs']);
  api.addFiles('tests_setup.isojs', ['server', 'client']);
  api.addFiles('tests_server.js', ['server']);
  api.addFiles('esprima.js', ['client']);
  api.addFiles('tests_browser.js', ['web.browser']);
  api.addFiles('tests_cordova.js', ['web.cordova']);
});
