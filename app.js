var geddy = require('geddy');

geddy.startCluster({
 hostname: 'logistics-env-27fmmzstfv.elasticbeanstalk.com',
 port: process.env.PORT || '3000',
 environment: process.env.NODE_ENV || 'development'
});
