Tinytest.add('Browser: Variables', function (test) {
  test.equal(SetByAll, 144);
  test.equal(typeof SetByServer, 'undefined');
  test.equal(SetByClient, 5023);
  test.equal(typeof SetByCordova, 'undefined');
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
