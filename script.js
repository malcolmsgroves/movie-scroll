let $movies;
let loading = false;
let movieArray;
let currPage = 1;
let query = 'strange';


$(function() {
  $movies = $('.movies');
  $('button.search').on('click', function() {
    query = $('input').val();
    currPage = 1;
    $movies.children().remove();
    movieQuery();
    setInfiniteScroll();
  });

});

const movieQuery = function() {
  $.ajax({
    url: `http://www.omdbapi.com/?s=${query}&page=${currPage}&apikey=c7136695`,
    dataType: 'json',
    success: function(data) {
      movieArray = data.Search;
    },
    error: function(error) {
      console.log(error);
    }
  }).done(function() {
    console.log(currPage);
    ++currPage;
    loadItems();
  });
};

const getMovieInfo = function(id) {
  $.ajax({
    url: `http://www.omdbapi.com/?i=${id}&apikey=c7136695`,
    dataType: 'json',
    success: function(data) {
      display(data);
    },
    error: function(error) {
      console.log(error);
    }
  });
};

const loadItems = function() {
  while(movieArray.length) {
    getMovieInfo(movieArray.shift().imdbID);
  }
  stopLoading();
};


function display(data) {

  let item = $('<li class="item"></li>');
  let info = $('<div class="info"></div>');
  info.append(`<h4>${data.Title}</h4>`);
  info.append(`<div>${data.Year}</div>`);
  info.append(`<div>${data.Runtime}</div>`);
  info.append(`<div>${data.Rated}</div>`);
  info.append(`<p>${data.Plot}</p>`);
  item.append(info);
  item.append(`<img src="${data.Poster}" class="poster">`);
  $movies.append(item);
}

function setInfiniteScroll() {
  window.onscroll = function(ev) {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          if(!loading) {
            startLoading();
            movieQuery();
          }
      }
  };
}

function startLoading() {
  loading = true;
  $movies.append('<div id="loading">...loading</div>');
}

function stopLoading() {
  loading = false;
  $('#loading').remove();
}
