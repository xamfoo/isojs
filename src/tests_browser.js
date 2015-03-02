Tinytest.add('Browser: Variables', function (test) {
  test.equal(SetByAll, 144);
  test.equal(typeof SetByServer, 'undefined');
  test.equal(SetByClient, 5023);
  test.equal(typeof SetByCordova, 'undefined');
  test.equal(SetByServerElse, 3293);
  test.equal(typeof SetByClientElse, 'undefined');
  test.equal(SetByCordovaElse, 8392);
  test.equal(SetByNotServer, 3192);
  test.equal(SetByElseNotServer, 8301);
  test.equal(typeof SetByNotClient, 'undefined');
  test.equal(SetByNotCordova, 4702);
  test.equal(typeof SetByElseNotClient, 'undefined');
  test.equal(SetByElseNotCordova, 3750);
});

Tinytest.add('Browser: Server block removed', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + PlainFunc.toString()),
      esprima.parse("x = " + ServerFunc.toString())
    )
  );
});

Tinytest.add('Browser: Cordova block removed', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + PlainFunc.toString()),
      esprima.parse("x = " + CordovaFunc.toString())
    )
  );
});

Tinytest.add('Browser: Client block cleaned', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("ClientFunc = " + ClientFunc.toString()),
      esprima.parse("ClientFunc = function () {true;}")
    )
  );
});

Tinytest.add('Browser: Only server else block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + FalseFunc.toString()),
      esprima.parse("x = " + ServerElseFunc.toString())
    )
  );
});

Tinytest.add('Browser: Only client true block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + TrueFunc.toString()),
      esprima.parse("x = " + ClientElseFunc.toString())
    )
  );
});

Tinytest.add('Browser: Only cordova else block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + FalseFunc.toString()),
      esprima.parse("x = " + CordovaElseFunc.toString())
    )
  );
});

Tinytest.add('Browser: Only server else if block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseFunc.toString()),
      esprima.parse("x = " + ServerElseIfFunc.toString())
    )
  );
});

Tinytest.add('Browser: Client else if block removed', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + TrueFunc.toString()),
      esprima.parse("x = " + ClientElseIfFunc.toString())
    )
  );
});

Tinytest.add('Browser: Only cordova else if block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseFunc.toString()),
      esprima.parse("x = " + CordovaElseIfFunc.toString())
    )
  );
});

Tinytest.add('Browser: Server block removed from if else if block', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseFunc.toString()),
      esprima.parse("x = " + ServerIfElseIfFunc.toString())
    )
  );
});

Tinytest.add('Browser: Client block cleaned in if else if block', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseTrueFunc.toString()),
      esprima.parse("x = " + ClientIfElseIfFunc.toString())
    )
  );
});

Tinytest.add('Browser: Cordova block removed from if else if block', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseFunc.toString()),
      esprima.parse("x = " + CordovaIfElseIfFunc.toString())
    )
  );
});
