/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/


var router = new geddy.RegExpRouter();

router.get('/').to('Main.index');

// Basic routes
// router.match('/moving/pictures/:id', 'GET').to('Moving.pictures');
//
// router.match('/farewells/:farewelltype/kings/:kingid', 'GET').to('Farewells.kings');
//
// Can also match specific HTTP methods only
// router.get('/xandadu').to('Xanadu.specialHandler');
// router.del('/xandadu/:id').to('Xanadu.killItWithFire');
//
// Resource-based routes
// router.resource('hemispheres');
//
// Nested Resource-based routes
// router.resource('hemispheres', function(){
//   this.resource('countries');
//   this.get('/print(.:format)').to('Hemispheres.print');
// });

router.resource('places');
router.resource('wares');
router.resource('transactions');
router.resource('orders');
router.match('/allorders', 'GET').to({controller:'Orders', action:'full'});
router.match('/orders/add/place/:placeId', 'GET').to({controller: 'Orders', action: 'add'});
router.match('/orders/add/ware/:wareId', 'GET').to({controller: 'Orders', action: 'add'});
router.match('/orders/add/wp/:wareId/:placeId', 'GET').to({controller: 'Orders', action: 'add'});

//mark order as completed to build transactions
router.match('/orders/manage/:id', 'GET').to({controller: 'Orders', action: 'manage'});
router.match('/orders/status/:id', 'GET').to({controller: 'Orders', action: 'status'});
router.match('/orders/reopen/:id', 'GET').to({controller: 'Orders', action: 'reopen'});
router.match('/orders/remove/:id', 'GET').to({controller: 'Orders', action: 'remove'});
router.match('/orders/complete/:id', 'POST').to({controller: 'Orders', action: 'complete'});

router.match('/transactions/remove/:id', 'GET').to({controller: 'Transactions', action: 'remove'});

router.get('/login').to('Main.login');
router.get('/logout').to('Main.logout');
router.post('/auth/local').to('Auth.local');
router.get('/auth/facebook').to('Auth.facebook');
router.get('/auth/facebook/callback').to('Auth.facebookCallback');
router.resource('users');
exports.router = router;
