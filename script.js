var dictionary = "0123456789qwertyuiopasdfghjklzxcvbnm!?></\a`~+*=@#$%".split('');

var el = document.querySelector('h1');
var btn = document.querySelector('.button');

var ran = function() {
 return Math.floor(Math.random() * dictionary.length)
}

var ranString = function(amt) {
  var string = '';
  for(var i = 0; i < amt; i++) {
    string += dictionary[ran()];
  }
  return string;
}

var init = function(str) {
  var count = str.length;
  var delay = 50;
  
  btn.classList.remove('show');
  el.innerHTML = '';
  
  var gen = setInterval(function() {
    el.setAttribute('data-before', ranString(count));
    el.setAttribute('data-after', ranString(count));
    if(delay > 0) {
      delay--;
    }
    else {
      if(count < str.length) {
        el.innerHTML += str[str.length - count-1];
      }
      count--;
      if(count === -1) {
        clearInterval(gen);
        showButton();
      }
    }
  }, 32);
}

var showButton = function() {
  btn.classList.add('show');
}

init('Privacy is a fundemental human right.');