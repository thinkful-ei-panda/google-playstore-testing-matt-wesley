const app = require ('../app');
const supertest = require ('supertest');
const {expect} = require ('chai');

describe('GET /apps 200', () => {
  it('should return full array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-type',/json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
      });
      
  });
  
  describe('For valid sorts', () => {
    it('should return array of apps sorted by rating', () =>{
      return supertest(app)
        .get('/apps')
        .query({sort:'Rating'})
        .expect(200)
        .expect('Content-type',/json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.be.an('object');
          expect(res.body[0].Rating>=res.body[1].Rating);
        });
    });
    it('should return array of apps sorted by app name', () =>{
      return supertest(app)
        .get('/apps')
        .query({sort:'App'})
        .expect(200)
        .expect('Content-type',/json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.be.an('object');
          expect(res.body[0].App.toLowerCase()<res.body[1].App.toLowerCase());
        });
    });
  });  
  
  describe('For Valid Genres', ()=>{
    const validGenres = ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'];
    validGenres.forEach(genre => {
      it(`should return array of apps with genres matching ${genre}`, () => {
        return supertest(app)
          .get('/apps')
          .query({genres:genre})
          .expect(200)
          .expect('Content-type',/json/)
          .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.be.an('object');
            expect(res.body[0].Genres.toLowerCase()).to.include(genre);
          });
      });
    });
  });
});
  
describe('GET /apps 404', ()=>{
  it('should return 404 when path is bad', () => {
    return supertest(app)
      .get('/somelocation')
      .expect(404);
  });
});  

describe('GET /apps 400', () => {
  it('should return 400 when sort value is invalid', () => {
    return supertest(app)
      .get('/apps')
      .query({sort:'invalidSort'})
      .expect(400,'Invalid sort value');
  });

  it('should return 400 when genres value is invalid', () => {
    return supertest(app)
      .get('/apps')
      .query({genres:'invalidGenre'})
      .expect(400, 'Invalid genres value');
  });
});
  
