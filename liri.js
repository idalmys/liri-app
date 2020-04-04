var axios=require("axios");
var fs=require("fs");
var moment=require("moment");
require("dotenv").config();
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);


var command=process.argv[2];
var search=process.argv.slice(3).join(" ");

function liri(command,search){

switch (command) {
    case "concert-this":
        GetConcert(search);
        break;

    case "spotify-this-song":
        GetSong(search);
        break;
    case "movie-this":
        GetMovie(search);
        break;
    case "do-what-it-says":
        GetRandom(search);
        break;
    }
}

function GetMovie(search){
    if(!search ){
        search= " Mr Nobody";
    }

    var QueryUrl="http://www.omdbapi.com/?t="+ search +"&apikey=trilogy"
   
        axios
        .get(QueryUrl)
        .then(function (response) {
               
                 var movie= "\n.......Movie's Data.............\n" + 
                 "\n Title: "+ response.data.Title + 
                 "\n Year :" + response.data.Year + 
                 "\n IMDB rating: " + response.data.Ratings[0].Value +
                 "\n Rotten tomatoes rating: " + response.data.Ratings[1].Value +
                 "\n Country: " + response.data.Country +
                 "\n Language: " + response.data.Language +
                 "\n Plot: " + response.data.Plot +
                 "\n Actors: " + response.data.Actors +"\n" +
                 "\n.......End Movie's Data.............\n"
                 console.log(movie)
             
                 fs.appendFile("log.txt",movie,function(err){
                     if (err) {
                         console.log(err);
                     }
                 });
                
                       
     
    })
         .catch(function (error) {
        // handle error
         console.log(error);
    })
}


function GetSong(search){

    if(!search){
        search="The Sign";
    }
    spotify
    .search({ type: 'track', query: search, limit:3 })
    .then(function(response) {

      
       for(var i=0 ; i<response.tracks.items.length ; i++){
           var song="\n.......Song's Data.............\n" +  
           "\n Artist(s) : "+ response.tracks.items[i].artists[0].name +
           "\n Song's name: " + response.tracks.items[i].name +
           "\n Preview link (Spotify): " + response.tracks.items[i].href + 
           "\n Album's name: " + response.tracks.items[i].album.name+ "\n" +
         
           "\n.......End Song's Data.............\n"
        
        console.log(song);
        fs.appendFile("log.txt",song,function(err){
            if(err){
                console.log(err);
            }
        });
       }
   
  })
    .catch(function(err) {
    console.log(err);
    });
}
function GetConcert(search){
   
    
    var QueryUrl="https://rest.bandsintown.com/artists/"+ search +"/events?app_id=codingbootcamp"
    axios
    .get(QueryUrl)
    .then(function (response) {
        
         for(var i=0; i< response.data.length;i++){
             var artist="\n.......Artist/Band's Data.............\n" + 
             "\n Artist or Band: "+ search +
              "\n Name of the venue: " + response.data[i].venue.name +
              "\n Location: "+ response.data[i].venue.city +
              "\n Date of the event: " + moment(response.data[i].datetime).format('MM-DD-YYYY')+"\n"+ 
              "\n.......End Artist/band's Data.............\n"
              console.log(artist); 
              
          fs.appendFile("log.txt",artist,function(err){
              if(err){
                  console.log(err);
              }
          })
        }
 
     })
     .catch(function (error) {
     // handle error
      console.log(error);
     })
}

function GetRandom(search){
  fs.readFile("random.txt", "utf8", function(error, data) {

    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    command=dataArr[0];
    search=dataArr[1];
    
    liri(command,search);
  
  });
}

liri(command,search);