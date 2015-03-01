Tinytest.add('Cordova: Variables', function (test) {
  test.equal(SetByAll, 144);
  test.equal(typeof SetByServer, 'undefined');
  test.equal(SetByClient, 5023);
  test.equal(SetByCordova, 9121);
  test.equal(SetByNotServer, 3192);
  test.equal(SetByElseNotServer, 8301);
  test.equal(typeof SetByNotClient, 'undefined');
  test.equal(typeof SetByNotCordova, 'undefined');
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
