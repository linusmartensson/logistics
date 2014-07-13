var crypto = require('crypto')
  , bcrypt = require('bcrypt');

exports.actions = require('./actions');

// Redirect to the login page unless the user has an authenticated session.
// Leaves open the index, login, logout (on Main), and (of course) the actual
// authentication endpoints
exports.requireAuth = function () {
  if (!(this.session.get('userId') ||
      this.name == 'Main' ||
      this.name == 'Auth')) {
    // Record the page the user was trying to get to, will
    // try to return them there after login
    this.session.set('successRedirect', this.request.url);
    this.flash.keep('success');
    this.redirect('/login');
  }
};
exports.requireGroup = function (group) {
 var sgroup = this.session.get('userGroup');
 if(!sgroup || (group instanceof String && sgroup != group)) this.redirect('/');
 else {
  for(var v=0;v<group.length;++v){
   if(sgroup == group[v]) return; 
  }
  this.redirect('/');
 }
}

exports.generateHash = function (cleartextPass) {
  if (!geddy.config.secret) {
    throw new Error('Need application secret');
  }

  return bcrypt.hashSync(cleartextPass + geddy.config.secret, 10);
};



