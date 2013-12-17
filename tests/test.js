var should = require('chai').should(),
	supertest = require('supertest'),
	api = supertest('http://localhost:3001');

describe('Authenticate: ', function() {
	it('errors if user and password does not exist', function(done) {
		api.post('/authenticate')
		.send({ username: 'tester', password: 'tester' })
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(true);
			res.body.should.have.deep.property('data.user');
			res.body.should.have.deep.property('data.key');
			done();
		});
	});
});

describe('Key:', function() {
	it('errors if x-api-key header does not exist or not found in db', function(done) {
		api.post('/keytest')
		.set('X-API-KEY', 'ABCDEFG')
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.have.deep.property('status.success').and.equal(true);
			res.body.should.have.deep.property('status.message').and.equal('Authorized');
			done();
		});
	});
});

describe('/blog', function() {

	it('returns blog posts as JSON', function(done) {
		api.get('/blog')
		.set('x-api-key', '123myapikey')
		.auth('correct', 'credentials')
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.have.property('posts').and.be.instanceof(Array);
			done();
		});
	});

});