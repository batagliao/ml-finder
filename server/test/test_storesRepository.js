//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// workaround for require bug in node/mocha
const Store = require(`${__dirname}/../api/models/storeModel`);
const repo = require('../api/data/storesRepo');

const chai = require('chai');
const expect = chai.expect;
const db = require('diskdb');

db.connect(`${__dirname}/data`);
db.loadCollections(['stores']);

describe('Store Repository', () => {
    
    before('clearing stores db', (done) => {
        return db.stores.remove({}).then(done());
    });

    it('it should has 0 objects in collection', (done) => {
        expect(db.stores.count()).to.be.equal(0);
        done();
    });

    describe('Store CRUD', () => {
        it('should add Store to db', (done) => {
            var store = new Store();
            store.code = 1;
            store.description = 'store n1';
            store.postalcode = 14010000;
            repo.add(store);

            var storesFromDb = db.stores.find();
            expect(storesFromDb).to.be.a('array');
            expect(storesFromDb).to.have.lengthOf(1);
            done();
        });

        it('should read all values from db', (done) => {
            var storesFromDb = repo.get();
            expect(storesFromDb).to.be.a('array');
            expect(storesFromDb).to.have.lengthOf(1);
            done();
        });

        it('should read all values from db with criteria', (done) => {
            var storesFromDb = repo.get({code: 1});
            expect(storesFromDb).to.be.a('array');
            expect(storesFromDb).to.have.lengthOf(1);
            done();
        });

        it('should read single value from db', (done) => {
            var storeFromDb = repo.getOne({code: 1});
            expect(storeFromDb).to.be.a('object');
            expect(storeFromDb).to.have.code.equal(1);
            done();
        });

        it('should update a value to db', (done) => {
            var storesFromDb = db.stores.findOne();  //get first item
            storeFromDb.description = 'store n1 - updated';
            repo.update(storeFromDb);

            var newStoreFromDb = db.stores.findOne();
            expect(newStoreFromDb).to.have.deep.equals(storeFromDb);
            done();
        });

        it('should remove a value from db', (done) => {
            repo.delete({code: 1});
            var storesFromDb = db.stores.find();
            expect(storesFromDb).to.be.a('array');
            expect(storesFromDb).to.have.lengthOf(0);
            done();
        });
    });
});