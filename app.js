const express = require('express');
const morgan= require('morgan');
const playStore= require('./playStore.js');

const app = express();


app.use(morgan('dev'));

app.get('/apps', (req,res)=>{
  const sort=req.query.sort;
  const genres=req.query.genres;
  let filteredApps;

  if (sort && sort.toLowerCase()!=='rating' && sort.toLowerCase()!=='app'){
    res
      .status(400)
      .send('Invalid sort value');
  }

  const genreOptions=['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'];

  if (genres && !(genreOptions.includes(genres.toLowerCase()))){
    res
      .status(400)
      .send('Invalid genres value');
  }

  if (genres){
    filteredApps=playStore.filter(app => {
      return app.Genres.toLocaleLowerCase()===genres.toLowerCase();
    });
  }else{
    filteredApps=playStore;
  }

  if(sort==='rating'){
    filteredApps.sort((app1,app2) =>{
      return app2.Rating-app1.Rating;
    });
  }else if(sort==='app'){
    filteredApps.sort((app1,app2)=>{
      return app1.App.toLowerCase().charCodeAt(0) -app2.App.toLowerCase().charCodeAt(0);
    });
  }
  res.json(filteredApps);
});


module.exports = app;
