(function(){
  var movieList = null;
  var requestHTTP = false;
  var beginQuiz = false;
  var userScore = 0;
  var correctAnswer;
  var inputName;

  // API call to server for movie data
  var request = function(name) {
    $.ajax({
      url: '/api/values/' + name,
      error: function(err){
        movieList = window.testJSON.results;
        movieList.forEach(function(el){
          el.character = el.release_date.slice(0,4);
        });
        $('#questionText').html('What year was this movie?')
        requestHTTP = false;
        startQuiz();
      }
    }).done(function(response){
      movieList = response.cast.filter(function(el){
        if (el.poster_path && el.character) {
          return el;
        }
      });
      requestHTTP = false;
      startQuiz();
    });
  };

  // Fisher-Yates Shuffle for shuffling movie data on startQuiz
  var shuffleMovies = function(array) {
    var copy = [], n = array.length, i;
    while (n) {
      i = Math.floor(Math.random() * array.length);
      if (i in array) {
        copy.push(array[i]);
        delete array[i];
        n--;
      }
    }
    return copy;
  };

  // Enter key handler for input
  $('#inputName').keyup(function(evt){
    inputName = $('#inputName').val();
    if (evt.key === 'Enter' && !requestHTTP && inputName.length > 0) {
      requestHTTP = true;
      request(inputName);
    }
  });

  // Click handlers for buttons
  $('#submit').click(function(evt){
    inputName = $('#inputName').val();
    if (!requestHTTP && inputName.length > 0) {
      requestHTTP = true;
      request(inputName);
    }
  });
  $('#answer-0').click(function(evt){
    if (correctAnswer === 0) {
      updateScore(true);
    } else {
      updateScore(false);
    }
  });
  $('#answer-1').click(function(evt){
    if (correctAnswer === 1) {
      updateScore(true);
    } else {
      updateScore(false);
    }
  });
  $('#answer-2').click(function(evt){
    if (correctAnswer === 2) {
      updateScore(true);
    } else {
      updateScore(false);
    }
  });
  $('#playButton').click(function(evt){
    startQuiz();
  });

  var updateScore = function(answer) {
    var result = $('#result');
    if (answer) {
      userScore++
      result.html('CORRECT!')
    } else {
      result.html('WRONG!')
    }
    $('#currentScore').html(userScore);
    $('.scoreModal').removeClass('noDisplay');
  }

  // Selects random movie and adds img and text to DOM
  var buildQuestion = function(array) {
    correctAnswer = Math.floor(Math.random() * 3);
    console.log('correct ', correctAnswer)
    var imgUrl = "https://image.tmdb.org/t/p/w500" + array[correctAnswer].poster_path;
    $('#actor').html(inputName);
    $('#question').removeClass('hidden');
    $('#questionImage').attr('src', imgUrl);
    array.forEach(function(el,i){
      $('#answer-'+i).html(el.character);
    })
  };

  // Starts quiz and shuffles list of current actor's movies
  // selects first three and invokes buildQuestion
  var startQuiz = function() {
    $('.scoreModal').addClass('noDisplay')
    movieList = shuffleMovies(movieList);
    var choices = movieList.slice(0, 3);
    console.log('starting quiz', choices)
    buildQuestion(choices);
  };

  // Check to see if url has search params to auto start quiz
  if (window.location.search.length > 0) {
    var path = window.location.search;
    path = path.split('=');
    path = path[1].split(/[^A-z]+/).join(' ')
    $('#inputName').val(path);
    $('#actor').html(path);
    request(path);
    requestHTTP = true;
  }

})();
