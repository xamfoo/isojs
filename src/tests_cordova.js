Tinytest.add('Cordova: Variables', function (test) {
  test.equal(SetByAll, 144);
  test.equal(typeof SetByServer, 'undefined');
  test.equal(SetByClient, 5023);
  test.equal(SetByCordova, 9121);
  test.equal(SetByServerElse, 3293);
  test.equal(typeof SetByClientElse, 'undefined');
  test.equal(typeof SetByCordovaElse, 'undefined');
  test.equal(SetByNotServer, 3192);
  test.equal(typeof SetByNotClient, 'undefined');
  test.equal(typeof SetByNotCordova, 'undefined');
  test.equal(SetByElseNotServer, 8301);
  test.equal(typeof SetByElseNotClient, 'undefined');
  test.equal(typeof SetByElseNotCordova, 'undefined');
});

Tinytest.add('Cordova: Server block removed', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + PlainFunc.toString()),
      esprima.parse("x = " + ServerFunc.toString())
    )
  );
});

Tinytest.add('Cordova: Client block cleaned', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("ClientFunc = " + ClientFunc.toString()),
      esprima.parse("ClientFunc = function () {true;}")
    )
  );
});

Tinytest.add('Cordova: Cordova block cleaned', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("CordovaFunc = " + CordovaFunc.toString()),
      esprima.parse("CordovaFunc = function () {true;}")
    )
  );
});

Tinytest.add('Cordova: Only server else block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + FalseFunc.toString()),
      esprima.parse("x = " + ServerElseFunc.toString())
    )
  );
});

Tinytest.add('Cordova: Only client true block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + TrueFunc.toString()),
      esprima.parse("x = " + ClientElseFunc.toString())
    )
  );
});

Tinytest.add('Cordova: Only cordova true block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + TrueFunc.toString()),
      esprima.parse("x = " + CordovaElseFunc.toString())
    )
  );
});

Tinytest.add('Cordova: Only server else if block remains', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseFunc.toString()),
      esprima.parse("x = " + ServerElseIfFunc.toString())
    )
  );
});

Tinytest.add('Cordova: Client else if block removed', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + TrueFunc.toString()),
      esprima.parse("x = " + ClientElseIfFunc.toString())
    )
  );
});

Tinytest.add('Cordova: Cordova else if block removed', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + TrueFunc.toString()),
      esprima.parse("x = " + CordovaElseIfFunc.toString())
    )
  );
});

Tinytest.add('Cordova: Server block removed from if else if block', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseFunc.toString()),
      esprima.parse("x = " + ServerIfElseIfFunc.toString())
    )
  );
});

Tinytest.add('Cordova: Client block cleaned in if else if block', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseTrueFunc.toString()),
      esprima.parse("x = " + ClientIfElseIfFunc.toString())
    )
  );
});

Tinytest.add('Cordova: Cordova block cleaned in if else if block', function (test) {
  test.isTrue(
    _.isEqual(
      esprima.parse("x = " + IfElseTrueFunc.toString()),
      esprima.parse("x = " + CordovaIfElseIfFunc.toString())
    )
  );
});
