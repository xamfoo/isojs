var esprima = Npm.require('esprima');

Tinytest.add('Server: Variables', function (test) {
  test.equal(SetByAll, 144);
  test.equal(SetByServer, 1029);
  test.equal(typeof SetByClient, 'undefined');
  test.equal(typeof SetByCordova, 'undefined');
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
      esprima.parse("ServerFunc = " + ServerFunc.toString()),
      esprima.parse("ServerFunc = function () {true;}")
    )
  );
});
