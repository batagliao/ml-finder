import { request } from 'http';

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

describe('Stores', () => {

    // runs before all tests in this block
    before('clearing stores db', (done) => { // clear stores database before all tests
        return db.stores.remove({}).then(done());
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
                    expect(res).to.have.status(403) // forbiden, as user is not an admin                    
                    expect(res).to.have.body.length.equal(0);
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
                    expect(res).to.have.message.equal(`duplicated store ${store.code}`);
                    done();
                })
        })
        
    });

    describe('/GET stores', () => {

        before('clearing stores db', (done) => { // clear stores database before all GET tests
            return db.stores.remove({}).then(done());
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
            store.postalcode = 14010000;
            repo.add(store);

            chai.request(server)
                .get('/api/stores')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(1);
                });
        });

    });

});
