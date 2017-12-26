//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// workaround for require bug in node/mocha
const Store = require(`${__dirname}/../api/models/storeModel`);
const repo = require('../api/data/storesRepo');

// import dev dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;
const db = require('diskdb');

chai.use(chaiHttp);

db.connect(`${__dirname}/data`);
db.loadCollections(['stores']);

describe('Stores Controller', () => {

    // runs before all tests in this block
    before('clearing stores db', (done) => { // clear stores database before all tests
            db.stores.remove();
            db.loadCollections(['stores']);
            done();
    });

    it('it should has 0 objects in collection', (done) => {
        expect(db.stores.count()).to.be.equal(0);
        done();
    });

    describe('/POST stores', ()  => {
        it('should not allow non admin user to add a Store', (done) => {
            chai.request(server)
                .post('/api/stores')
                .send(new Store()) // error expected as no x-admin is passed on HEAD
                .end((err, res) => {
                    expect(res).to.have.status(403); // forbiden, as user is not an admin
                    done();
                });
        });

        it('should not add a Store with empty values', (done) => {
            chai.request(server)
                .post('/api/stores')
                .set('x-admin', true)
                .send(new Store()) // bad request expected as the object is empty
                .end((err, res) => {
                    expect(res).to.have.status(400); // bad request
                    done();
                });
        });

        it('should not add a Store with empty code', (done) => {
            var store = new Store();
            store.description = 'some store name';
            store.postalcode = 140100000;

            chai.request(server)
                .post('/api/stores/')
                .set('x-admin', true)
                .send(store)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                })
        })

        it('should not add a Store without name', (done) => {
            var store = new Store();
            store.code = 1
            store.postalcode = 140100000;

            chai.request(server)
                .post('/api/stores/')
                .set('x-admin', true)
                .send(store)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                })
        })

        it('should not add a Store without postal code', (done) => {
            var store = new Store();
            store.code = 1
            store.description = 'some store name';

            chai.request(server)
                .post('/api/stores/')
                .set('x-admin', true)
                .send(store)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                })
        })

        it('should accept a valid new store', (done) => {
            var store = new Store();
            store.code = 1
            store.description = 'store n1';
            store.postalcode = 140100000;

            chai.request(server)
                .post('/api/stores/')
                .set('x-admin', true)
                .send(store)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                })
        })

        it('should reject a store with same code', (done) => {
            var store = new Store();
            store.code = 1
            store.description = 'store n1';
            store.postalcode = 140100000;

            chai.request(server)
                .post('/api/stores/')
                .set('x-admin', true)
                .send(store)
                .end((err, res) => {
                    expect(res).to.have.status(500);                    
                    expect(res.body).to.have.be.equal(`duplicated store ${store.code}`);
                    done();
                })
        })
        
    });

    describe('/GET stores', () => {

        before('clearing stores db', (done) => { // clear stores database before all GET tests
            db.stores.remove();
            db.loadCollections(['stores']);
            done();
        });

        it('should get an empty array with a clean DB', (done) => {
            chai.request(server)
                .get('/api/stores')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(0);
                    done();
                });
        });

        it('shoud return items after insert', (done) => {
            var store = new Store();
            store.code = 1;
            store.description = 'store n1';
            store.postalcode = 1401000;
            repo.add(store);

            chai.request(server)
                .get('/api/stores')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(1);
                    done();
                });
        });

    });

    describe('/GET closest stores by code', () => {

        before('clearing stores and inserting', (done) => { // clear stores database before all GET tests
            db.stores.remove();
            db.loadCollections(['stores']);

            db.stores.save({
                "code": 1,
                "description": "Loja Matriz",
                "postalcode": 14400020,
                "address": "Jesus Maria José, Franca - SP, 14400-020, Brazil",
                "lat": -20.5401572,
                "lng": -47.40518050000001
            });
            db.stores.save({
                "code": 2,
                "description": "Loja Sertãozinho",
                "postalcode": 14160170,
                "address": "R. Dr. Olidair Ambrósio - Centro, Sertãozinho - SP, 14160-170, Brazil",
                "lat": -21.129585,
                "lng": -47.988292
            });
            db.stores.save({
                "code": 3,
                "description": "Loja Cuiaba",
                "postalcode": 78005030,
                "address": "Araes, Cuiabá - MT, 78005-030, Brazil",
                "lat": -15.5902348,
                "lng": -56.09565389999999
            });
            db.stores.save({
                "code": 4,
                "description": "Loja Ribeirão",
                "postalcode": 14010120,
                "address": "R. Barão do Amazonas - Centro, Ribeirão Preto - SP, 14010-120, Brazil",
                "lat": -21.1838026,
                "lng": -47.81370219999999
            });
            db.stores.save({
                "code": 5,
                "description": "Loja São Paulo",
                "postalcode": 1505010,
                "address": "Sé, São Paulo - SP, 01505-010, Brazil",
                "lat": -23.5539935,
                "lng": -46.63110930000001
            });
            db.stores.save({
                "code": 6,
                "description": "Loja Curitiba",
                "postalcode": 80010100,
                "address":"Av. Visc. de Guarapuava - Centro, Curitiba - PR, 80010-100, Brazil",
                "lat": -25.436828,
                "lng": -49.2685786
            });            
            done();
        });
       
        it('should get stores ordered by distance', (done) => {
            chai.request(server)
                .get('/api/stores?code=1&code=2&code=3&code=4&code=5&code=6&lat=-21.12760065601982&lng=-47.844003817142315')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(6);
                    store = res.body[0];
                    expect(res.body.code).to.be.equal(4);
                    store = res.body[1];
                    expect(res.body.code).to.be.equal(2);
                    store = res.body[2];
                    expect(res.body.code).to.be.equal(1);
                    store = res.body[3];
                    expect(res.body.code).to.be.equal(5);
                    store = res.body[4];
                    expect(res.body.code).to.be.equal(6);
                    store = res.body[5];
                    expect(res.body.code).to.be.equal(3);
                    done();
                });
        });

        it('should work even if its passed only 1 store', (done) => {
            chai.request(server)
                .get('/api/stores?code=1&clat=-21.12760065601982&lng=-47.844003817142315')
                .end( (err, res) => {
                    expe
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(1);
                    store = res.body[0];
                    expect(res.body.code).to.be.equal(1);
                });
        });

        it('should return all stores when no stores is provided', (done) => {
            console.log('this test is covered by /GET stores');
            expect(true).to.be.equal(true);
            done();
        });

        it('should return stores selected not sorted when no location is provided', (done) => {
            chai.request(server)
            .get('/api/stores/code=1&code=2')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf(2);
                done();
            });
        });

        it('should return stores selected not sorted when only latitude is provided', (done) => {
            chai.request(server)
            .get('/api/stores/code=1&code=2lat=-20.00')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf(2);
                done();
            });
        });

        it('should return stores selected not sorted when only longitude is provided', (done) => {
            chai.request(server)
            .get('/api/stores/code=1&code=lng=-47.00')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf(2);
                done();
            });
        });
    });
});
