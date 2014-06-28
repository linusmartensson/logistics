var Ware = function () {

  this.defineProperties({
    name: {type: 'string', required: true},
    orderno: {type: 'string'},
    packaging: {type: 'string'},
    price: {type: 'number'},
    storage: {type: 'string'},
    position: {type: 'string'},
    data: {type: 'string'}
  });
  this.hasMany("Transactions");
  this.hasMany("Orders");

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Ware.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Ware.someStaticMethod = function () {
  // Do some other stuff
};
Ware.someStaticProperty = 'YYZ';
*/

Ware = geddy.model.register('Ware', Ware);
