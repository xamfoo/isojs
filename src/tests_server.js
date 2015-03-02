var esprima = Npm.require('esprima');

Tinytest.add('Server: Variables', function (test) {
  test.equal(SetByAll, 144);
  test.equal(SetByServer, 1029);
  test.equal(typeof SetByClient, 'undefined');
  test.equal(typeof SetByCordova, 'undefined');
  test.equal(typeof SetByServerElse, 'undefined');
  test.equal(SetByClientElse, 4852);
  test.equal(SetByCordovaElse, 8392);
  test.equal(typeof SetByNotServer, 'undefined');
  test.equal(typeof SetByElseNotServer, 'undefined');
  test.equal(SetByNotClient, 2830);
  test.equal(SetByNotCordova, 4702);
  test.equal(SetByElseNotClient, 3851);
  test.equal(SetByElseNotCordova, 3750);
});

Tinytest.add('Server: Client block removed', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + PlainFunc.toString()),
      esprima.parse("x = " + ClientFunc.toString())
    )
  );
});

Tinytest.add('Server: Cordova block removed', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + PlainFunc.toString()),
      esprima.parse("x = " + CordovaFunc.toString())
    )
  );
});

Tinytest.add('Server: Server block cleaned', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + ServerFunc.toString()),
      esprima.parse("x = " + TrueFunc.toString())
    )
  );
});

Tinytest.add('Server: Only server true block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + TrueFunc.toString()),
      esprima.parse("x = " + ServerElseFunc.toString())
    )
  );
});

Tinytest.add('Server: Only client else block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + FalseFunc.toString()),
      esprima.parse("x = " + ClientElseFunc.toString())
    )
  );
});

Tinytest.add('Server: Only cordova else block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + FalseFunc.toString()),
      esprima.parse("x = " + CordovaElseFunc.toString())
    )
  );
});

Tinytest.add('Server: Server else if block removed', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + TrueFunc.toString()),
      esprima.parse("x = " + ServerElseIfFunc.toString())
    )
  );
});

Tinytest.add('Server: Only client else if block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseFunc.toString()),
      esprima.parse("x = " + ClientElseIfFunc.toString())
    )
  );
});

Tinytest.add('Server: Only cordova else if block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseFunc.toString()),
      esprima.parse("x = " + CordovaElseIfFunc.toString())
    )
  );
});

Tinytest.add('Server: Server block cleaned in if else if block', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseTrueFunc.toString()),
      esprima.parse("x = " + ServerIfElseIfFunc.toString())
    )
  );
});

Tinytest.add('Server: Client block removed from if else if block', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseFunc.toString()),
      esprima.parse("x = " + ClientIfElseIfFunc.toString())
    )
  );
});

Tinytest.add('Server: Cordova block removed from if else if block', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseFunc.toString()),
      esprima.parse("x = " + CordovaIfElseIfFunc.toString())
    )
  );
});
