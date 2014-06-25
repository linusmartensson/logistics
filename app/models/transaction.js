var Transaction = function () {

  this.defineProperties({
    timestamp: {type: 'datetime'}, //Each transaction occurs at a set time.
    count: {type: 'int'} //Each transaction covers a set number of items.
  });
  this.hasOne('Ware'); //Each transaction considers one ware.
  this.hasOne('Pair', {model:'Transaction'}); //Two transactions are paired together to describe a movement from one place to another.
  this.hasOne('Place'); //Each transaction has a target location.
  this.hasOne('Creator', {model:'User'});

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
Transaction.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Transaction.someStaticMethod = function () {
  // Do some other stuff
};
Transaction.someStaticProperty = 'YYZ';
*/

Transaction = geddy.model.register('Transaction', Transaction);
