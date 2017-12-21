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
    beforeEach((done) => { // clear stores database before each test
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
    });

});
