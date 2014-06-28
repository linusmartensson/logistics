var User = function () {
  this.defineProperties({
    username: {type: 'string'}
  , password: {type: 'string'}
  , familyName: {type: 'string', required: true}
  , givenName: {type: 'string', required: true}
  , email: {type: 'string'}
  , activationToken: {type: 'string'}
  , activatedAt: {type: 'datetime'}
  , group: {type: 'string'}
  });

  this.hasMany('Passports');
  this.hasMany('Transactions');
  this.hasMany('Orders');
};

User.prototype.isActive = function () {
  return !!this.activatedAt;
};

User = geddy.model.register('User', User);
