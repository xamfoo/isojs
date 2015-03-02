var _ = Npm.require('underscore');
var path = Npm.require('path');
var esprima = Npm.require('esprima');
var escodegen = Npm.require('escodegen');

// Convert source to abstract syntax tree
var toAst = function (source, options) {
  var ast = esprima.parse(
    source,
    {
      raw: true, tokens: true, range: true, comment: true,
      loc: true, source: options && options.source
    }
  );
  return ast;
}

// Convert abstract syntax tree back to source
var toSource = function (ast, options) {
  ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
  var source = escodegen.generate(
    ast,
    {comment: true, sourceMap: (options && options.source) || true, sourceMapWithCode: true}
  );
  return source;
}

// Check if tree contains the key and values in the properties object using
// deep comparision
var partialMatch = function (tree, properties) {
  if (!(tree instanceof Object && properties instanceof Object)) return false;
  var missingProps = _.difference(_.keys(properties), _.keys(tree));
  if (!missingProps || !missingProps.length) {
    var result = true;
    _.each(properties, function (v, k) {
      if (v === tree[k]) return;
      if (!partialMatch(tree[k], v)) result = false;
    });
    return result;
  }
  else return false;
}

// Return a copy of the abstract syntax tree after passing through the filter
var filterTree = function (tree, match, options) {
  if (!tree || !match) return tree;
  if (tree.type === 'IfStatement' && partialMatch(tree.test, match)) {
    if (options && typeof options.onMatch === 'function')
      return options.onMatch.call(this, tree);
  }
  if (tree instanceof Array) {
    return _.map(tree, function (subTree, k) {
      return filterTree.call(
        {parent: tree, parentKey: k}, subTree, match, options
      );
    });
  }
  else if (tree instanceof Object) {
    var newTree = _.reduce(tree, function (memo, subTree, k) {
      var newTree = filterTree.call(
        {parent: tree, parentKey: k}, subTree, match, options
      );
      if (k === 'body' && newTree instanceof Array)
        newTree = _.filter(newTree, function (x) {
          return x instanceof Object;
        });
      return _.extend(memo, _.object([[k, newTree]]));
    }, {});

    return newTree;
  }
  else return tree;
}

// Replace an if statement with the else block
var replaceWithAlternate = function (tree) {
  var self = this;

  if ('alternate' in tree) {
    if (!tree.alternate) return tree.alternate;
    if (tree.alternate.type === 'BlockStatement') {
      if (self.parentKey === 'alternate' || self.parentKey === 'consequent')
        return tree.alternate;
      else return _.extend(tree.alternate, {type: 'Program'});
    }
    return tree.alternate;
  }
  else throw "Alternate does not exist in if statement";
}

// Replace an if statement with the if block
var replaceWithConsequent = function (tree) {
  var self = this;

  if ('consequent' in tree) {
    if (!tree.consequent) return tree.consequent;
    if (tree.consequent.type === 'BlockStatement') {
      if (self.parentKey === 'alternate' || self.parentKey === 'consequent')
        return tree.consequent;
      else
        return _.extend(tree.consequent, {type: 'Program'});
    }
    return tree.consequent;
  }
  else throw "Consequent does not exist in if statement";
}

// Define positive ast filters
var astFilters = {
  server: function (ast) {
    return filterTree(ast, {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": "Meteor"
      },
      "property": {
        "type": "Identifier",
        "name": "isServer"
      }
    }, {onMatch: replaceWithAlternate});
  },
  cordova: function (ast) {
    return filterTree(ast, {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": "Meteor"
      },
      "property": {
        "type": "Identifier",
        "name": "isCordova"
      }
    }, {onMatch: replaceWithAlternate});
  },
  client: function (ast) {
    return filterTree(ast, {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": "Meteor"
      },
      "property": {
        "type": "Identifier",
        "name": "isClient"
      }
    }, {onMatch: replaceWithAlternate});
  }
};

// Define negative ast filters
var negativeAstFilters = {
  server: function (ast) {
    return filterTree(ast, {
      "type": "UnaryExpression",
      "operator": "!",
      "argument": {
        "type": "MemberExpression",
        "object": {
          "type": "Identifier",
          "name": "Meteor"
        },
        "property": {
          "type": "Identifier",
          "name": "isServer"
        }
      }
    }, {onMatch: replaceWithAlternate});
  },
  cordova: function (ast) {
    return filterTree(ast, {
      "type": "UnaryExpression",
      "operator": "!",
      "argument": {
        "type": "MemberExpression",
        "object": {
          "type": "Identifier",
          "name": "Meteor"
        },
        "property": {
          "type": "Identifier",
          "name": "isCordova"
        }
      }
    }, {onMatch: replaceWithAlternate});
  },
  client: function (ast) {
    return filterTree(ast, {
      "type": "UnaryExpression",
      "operator": "!",
      "argument": {
        "type": "MemberExpression",
        "object": {
          "type": "Identifier",
          "name": "Meteor"
        },
        "property": {
          "type": "Identifier",
          "name": "isClient"
        }
      }
    }, {onMatch: replaceWithAlternate});
  }
};

// Define ast filters which removes redundant if statements given the
// architecture is known
var astIfFilters = {
  server: function (ast) {
    return filterTree(ast, {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": "Meteor"
      },
      "property": {
        "type": "Identifier",
        "name": "isServer"
      }
    }, {onMatch: replaceWithConsequent});
  },
  client: function (ast) {
    return filterTree(ast, {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": "Meteor"
      },
      "property": {
        "type": "Identifier",
        "name": "isClient"
      }
    }, {onMatch: replaceWithConsequent});
  },
  cordova: function (ast) {
    return filterTree(ast, {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": "Meteor"
      },
      "property": {
        "type": "Identifier",
        "name": "isCordova"
      }
    }, {onMatch: replaceWithConsequent});
  }
}

// Returns a single filter function which takes ast as an argument and outputs
// a modified ast
var getFilter = function (arch) {
  var filters = {};
  if (arch === 'server')
    _.extend(
      filters, _.pick(astFilters, 'client', 'cordova'),
      _.pick(negativeAstFilters, 'server'), _.pick(astIfFilters, 'server')
    );
  else if (arch === 'browser')
    _.extend(
      filters, _.pick(astFilters, 'server', 'cordova'),
      _.pick(negativeAstFilters, 'client'), _.pick(astIfFilters, 'client')
    );
  else if (arch === 'cordova')
    _.extend(
      filters, _.pick(astFilters, 'server'),
      _.pick(negativeAstFilters, 'cordova'),
      _.pick(astIfFilters, 'cordova', 'client')
    );

  return _.reduce(filters, function (memo, f) {
      if (!memo) return f;
      else return _.compose(memo, f);
    }
  );
};

// Compile handler
var handler = function (compileStep) {
  var source = compileStep.read().toString('utf8');
  try {
    var ast = toAst(source, {source: compileStep.pathForSourceMap});
  }
  catch (e) {
    throw new Error(
      compileStep.inputPath + ':' +
        (e.location ? (e.location.first_line + ': ') : ' ') + e.message
    );
  }
  var outputFile = compileStep.inputPath + '.js';

  if (compileStep.arch === 'os') {
    ast = getFilter('server')(ast);
  }
  else if (compileStep.arch === 'web.browser') {
    ast = getFilter('browser')(ast);
  }
  else if (compileStep.arch === 'web.cordova') {
    ast = getFilter('cordova')(ast);
  }

  if (!ast) {
    console.log("isojs: Cannot generate source from " + compileStep.inputPath);
    return;
  }
  try {
    source = toSource(ast);
  }
  catch (e) {
    throw new Error(
      compileStep.inputPath + ':' +
        (e.location ? (e.location.first_line + ': ') : ' ') + e.message
    );
  }
  if (typeof source.code === 'string') {
    if (!source.code.length) return;

    compileStep.addJavaScript({
      path: outputFile,
      sourcePath: compileStep.inputPath,
      data: source.code,
      sourceMap: JSON.parse(source.map.toString()),
      bare: compileStep.fileOptions.bare
    });
  }
  else {
    console.log("isojs: Cannot generate source from " + compileStep.inputPath);
  }
}

Plugin.registerSourceHandler('isojs', handler);
