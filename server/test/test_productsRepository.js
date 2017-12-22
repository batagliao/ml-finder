//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// workaround for require bug in node/mocha
const Product = require(`${__dirname}/../api/models/productModel`);
const repo = require('../api/data/productsRepo');

const chai = require('chai');
const expect = chai.expect;
const db = require('diskdb');

db.connect(`${__dirname}/data`);
db.loadCollections(['products']);

describe('Product Repository', () => {
    
    before('clearing products db', (done) => {
        return db.products.remove({}).then(done());
    });

    it('it should has 0 objects in collection', (done) => {
        db.products.remove();
        db.loadCollections(['products']);
        done();
    });

    describe('Product CRUD', () => {
        it('should add Product to db', (done) => {
            var Product = new Product();
            Product.code = 1;
            Product.description = 'Product n1';
            Product.price = 12.99;
            repo.add(Product);

            var productsFromDb = db.products.find();
            expect(productsFromDb).to.be.a('array');
            expect(productsFromDb).to.have.lengthOf(1);
            done();
        });

        it('should read all values from db', (done) => {
            var productsFromDb = repo.get();
            expect(productsFromDb).to.be.a('array');
            expect(productsFromDb).to.have.lengthOf(1);
            done();
        });

        it('should read all values from db with criteria', (done) => {
            var productsFromDb = repo.get({code: 1});
            expect(productsFromDb).to.be.a('array');
            expect(productsFromDb).to.have.lengthOf(1);
            done();
        });

        it('should read single value from db', (done) => {
            var ProductFromDb = repo.getOne({code: 1});
            expect(ProductFromDb).to.be.a('object');
            expect(ProductFromDb).to.have.code.equal(1);
            done();
        });

        it('should update a value to db', (done) => {
            var productsFromDb = db.products.findOne();  //get first item
            ProductFromDb.description = 'Product n1 - updated';
            repo.update(ProductFromDb);

            var newProductFromDb = db.products.findOne();
            expect(newProductFromDb).to.have.deep.equals(ProductFromDb);
            done();
        });

        it('should remove a value from db', (done) => {
            repo.delete({code: 1});
            var productsFromDb = db.products.find();
            expect(productsFromDb).to.be.a('array');
            expect(productsFromDb).to.have.lengthOf(0);
            done();
        });
    });
});