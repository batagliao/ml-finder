
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// workaround for require bug in node/mocha
const Product = require(`${__dirname}/../api/models/productModel`);
const repo = require('../api/data/productsRepo');

// import dev dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;
const db = require('diskdb');

chai.use(chaiHttp);

db.connect(`${__dirname}/data`);
db.loadCollections(['products']);

describe('Products Controller', () => {

    // runs before all tests in this block
    before('clearing products db', (done) => { // clear products database before all tests
        db.products.remove();
        db.loadCollections(['products']);
        done();
    });

    it('it should has 0 objects in collection', (done) => {
        expect(db.products.count()).to.be.equal(0);
        done();
    });

    describe('/POST product', ()  => {
        it('should not allow non admin user to add a product', (done) => {
            chai.request(server)
                .post('/api/products')
                .send(new Product()) // error expected as no x-admin is passed on HEAD
                .end((err, res) => {
                    expect(res).to.have.status(403) // forbiden, as user is not an admin                    
                    done();
                });
        });

        it('should not add a Product with empty values', (done) => {
            chai.request(server)
                .post('/api/products')
                .set('x-admin', true)
                .send(new Product()) // bad request expected as the object is empty
                .end((err, res) => {
                    expect(res).to.have.status(400); // bad request
                    done();
                });
        });

        it('should not add a Product with empty code', (done) => {
            var product = new Product();
            product.description = 'some product name';
            product.price = 20.90;

            chai.request(server)
                .post('/api/products/')
                .set('x-admin', true)
                .send(product)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                })
        })

        it('should not add a Product without name', (done) => {
            var product = new Product();
            product.code = 1
            product.price = 20.90;

            chai.request(server)
                .post('/api/products/')
                .set('x-admin', true)
                .send(product)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                })
        })

        it('should not add a Product without price', (done) => {
            var product = new Product();
            product.code = 1
            product.description = 'some product name';

            chai.request(server)
                .post('/api/products/')
                .set('x-admin', true)
                .send(product)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                })
        })

        it('should not add a Product without at least one store', (done) => {
            var product = new Product();
            product.code = 1
            product.description = 'product n1';
            product.price = 20.90;

            chai.request(server)
                .post('/api/products/')
                .set('x-admin', true)
                .send(product)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                })
        })
        
        it('should accept a valid new product', (done) => {
            var product = new Product();
            product.code = 1
            product.description = 'product n1';
            product.price = 20.90;
            product.stores.push(1);

            chai.request(server)
                .post('/api/products/')
                .set('x-admin', true)
                .send(product)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                })
        })

        it('should reject a product with same code', (done) => {
            var product = new Product();
            product.code = 1
            product.description = 'product n1';
            product.price = 20.90;
            product.stores = [1];

            chai.request(server)
                .post('/api/products/')
                .set('x-admin', true)
                .send(product)
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.body).to.be.equal(`duplicated product ${product.code}`);
                    done();
                })
        })
        
    });

    describe('/GET products', () => {

        before('clearing products db', (done) => { // clear products database before all GET tests
            db.products.remove()
            db.loadCollections(['products']);
            done();
        });

        it('should get an empty array with a clean DB', (done) => {
            chai.request(server)
                .get('/api/products')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(0);
                    done();
                });
        });

        it('shoud return items after insert', (done) => {
            var product = new Product();
            product.code = 1;
            product.description = 'product n1';
            product.postalcode = 20.90;
            repo.add(product);

            chai.request(server)
                .get('/api/products')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(1);
                    done();
                });
        });

        

    });

    describe('/GET products filtered by description', () => {
        before('inserting products to find', (done) => {
            db.products.remove();
            db.loadCollections(['products']);

            var product = new Product();
            product.code = 1;
            product.description = 'abc n1';
            product.price = 20.90;
            product.stores = [1, 2, 3, 4];

            repo.add(product);

            product = new Product();
            product.code = 2;
            product.description = 'zyb n2';
            product.price = 2.90;
            product.stores = [1];

            repo.add(product);
            done();
        });

        it('should ignore filter if param is incorrect', (done) => {
            chai.request(server)
            .get('/api/products?descriptionee=prod')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf(2);
                done();
            });
        });

        it('should return empty array if there are no matches', (done) => {
            chai.request(server)
            .get('/api/products?description=prod')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf(0);
                done();
            });
        });

        it('should be able to filter products by name', (done) => {            
            chai.request(server)
                .get('/api/products?description=ab')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(1);
                    var prod = res.body[0];
                    expect(prod.code).to.be.equal(1);
                    done();
                });                        
        });

        it('should be able to filter products by name 2', (done) => {            
            chai.request(server)
                .get('/api/products?description=n2')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(1);
                    var prod = res.body[0];
                    expect(prod.code).to.be.equal(2);
                    done();
                });                        
        });

        it('should be able to filter products by name 3', (done) => {            
            chai.request(server)
                .get('/api/products?description=b')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(2);
                    var prod = res.body[0];
                    expect(prod.code).to.be.equal(1);
                    done();
                });                        
        });
    });

    describe('/GET products by store', () => {

        before('inserting products to find', (done) => {
            db.products.remove();
            db.loadCollections(['products']);

            var product = new Product();
            product.code = 1;
            product.description = 'product n1';
            product.price = 20.90;
            product.stores = [1, 2, 3, 4];

            repo.add(product);

            product = new Product();
            product.code = 2;
            product.description = 'product n2';
            product.price = 2.90;
            product.stores = [1];

            repo.add(product);
            done();
        });

        it('should get an all products if param has wrong name', (done) => {
            chai.request(server)
                .get('/api/products?storeSSS=')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(2);
                    done();
                });
        });

        it('should get an all products if param is empty', (done) => {
            chai.request(server)
                .get('/api/products?store=')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(2);
                    done();
                });
        });

        it('should get an empty product array string is forced into param', (done) => {
            chai.request(server)
                .get('/api/products?store=abc')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(0);
                    done();
                });
        });        

        it('should get an empty product array if not exist in store', (done) => {
            chai.request(server)
                .get('/api/products?store=8')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(0);
                    done();
                });
        });

        it('should get only 1 products in store 4', (done) => {
            chai.request(server)
                .get('/api/products?store=4')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(1);
                    done();
                });
        });

        it('should get 2 products in store 1', (done) => {
            chai.request(server)
                .get('/api/products?store=1')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(2);
                    done();
                });
        });


    });

    describe('/GET product by code', () =>{
        before('inserting products to test', (done) => {
            db.products.remove();
            db.loadCollections(['products']);

            var product = new Product();
            product.code = 1;
            product.description = 'product n1';
            product.price = 20.90;
            product.stores = [1, 2, 3, 4];

            repo.add(product);

            product = new Product();
            product.code = 2;
            product.description = 'product n2';
            product.price = 2.90;
            product.stores = [1];

            repo.add(product);
            done();
        });

        it('should return empty object if no product match', (done) => {
            chai.request(server)
                .get('/api/products/99')
                .end( (err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.equal('');
                    done();                 
                });
        });

        it('should return empty object if no product match - string', (done) => {
            chai.request(server)
                .get('/api/products/abc')
                .end( (err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.equal('');        
                    done();            
                });
        });

        it('should return product object if matches', (done) => {
            chai.request(server)
                .get('/api/products/2')
                .end( (err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    var product = res.body;
                    expect(product.code).to.be.equal(2);
                    expect(product.stores).to.be.a('array');
                    done();
                });
        });
    });

});
