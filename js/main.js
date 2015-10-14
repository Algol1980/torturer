var quizWordArr = ["К", "О", "П", "И", "Л", "К", "А"];
var alphabet = ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь", "Э", "Ю", "Я"];


function Game() {
  this.quizWordArr = quizWordArr;
  this.currentWordArr = getLetterArray();
  this.ltrCount = this.currentWordArr.length;
  this.rewardQuantity = 0;
  this.usedWords = [];
  this.torturer = 0;
  this.minReward = 10;
  this.maxReward = 50;
  this.dblGuess = 1;
  this.ltrIsTrue = false;
  this.view = new GameView();

  function getLetterArray() {
    var arr = [];
    for (var i = 0; i < this.quizWordArr.length; i++) {
      arr.push("_");
    }
    return arr;
  };
};

Game.prototype.initialize = function() {
  var self = this;
  this.view.renderPage();
  this.view.renderWord();
  this.view.renderKeyboard();
  this.view.renderScore();
  this.view.renderTorturer();
  var keyboardFragment = document.body.querySelector("#keyboardJs");
  var modalBlockFragment = document.body.querySelector("#modalJsBlock");
  var ltr;


  keyboardFragment.onclick = function(event) {
    event.preventDefault();
    var target = event.target;
    if (target.tagName.toLowerCase() == 'li') {
      ltr = target.innerHTML;
      target.classList.add("disable")
      self.ltrIsTrue = false;
      self.guessLetter(ltr);
    }
  }
  modalBlockFragment.onclick = function(event) {
    event.preventDefault();
    var target = event.target;
    if (target.id == 'ok') {
      game = new Game();
      game.initialize();
    }
    if (target.id == 'no') {
      window.location = "http://javascript.ru"
    }
  }
};

Game.prototype.guessLetter = function(ltr) {
  var meassageOk = "Поздравляем! Данная буква есть!";
  var meassageFail = "Такой буквы нет! Палач все ближе!";
  var meassageWin = "Поздравляем! Вы отгадали слово!";
  var meassageLose = "Палач уже здесь! Ты Продул!";

  this.quizWordArr.forEach(function(item, i, arr) {
    if (item === ltr.toUpperCase()) {
      game.currentWordArr[i] = item;
      game.ltrIsTrue = true;
      game.rndReward = Math.floor(Math.random() * (game.maxReward - game.minReward + 1)) + game.minReward;
    }
  });
  this.view.renderWord();
  var self = this;

  if (this.ltrIsTrue) {
    game.rewardQuantity += game.rndReward * game.dblGuess;
    this.dblGuess = 2;
    this.view.renderScore();
    this.torturer--;
    this.view.renderTorturer();
    this.view.renderMessage(meassageOk);
  } else {
    this.dblGuess = 1;
    this.torturer++;
    this.view.renderTorturer();
    this.view.renderMessage(meassageFail);
  };

  if (this.torturer >= 6) {
    this.view.renderMessage(meassageLose);
    this.view.viewModal();
  }

  this.ltrCount = this.currentWordArr.join("").split("_").length - 1;

  if (this.ltrCount === 0) {
    this.view.renderWord();
    this.view.renderMessage(meassageWin);
    this.view.viewModal();
  } else {
    this.view.renderWord();
  };

};


function GameView() {
  this.templatePage = '<div class="modal" id="modalJs"><div class="modalBlock" id="modalJsBlock"><p>Еще раз сыграем?</p><button id="ok">Да</button><button id="no">Нет</button></div></div><div class="wrapper"><h1>Игра "Палач"</h1><div class="row"><div class="left"><h2>Слово:</h2><ul class="word"  id="wordJS"></ul></div><div class="right"><h2 id="score" >Счет: <span></span></h2><div class="torturer" id="torturerJS"></div></div></div><h3 class="message" id="meassageJS"></h3><ul class="keyboard" id="keyboardJs"></ul></div>';
};

GameView.prototype.renderPage = function() {
  document.body.innerHTML = this.templatePage;
};

GameView.prototype.renderWord = function() {
  var template = _.template("<%_.forEach(game.currentWordArr, function (ltr) {%><li><%=ltr%></li><%})%>");
  var wordFragment = document.querySelector("#wordJS");
  wordFragment.innerHTML = template(this.currentWordArr);
};

GameView.prototype.renderKeyboard = function() {
  var template = _.template("<%_.forEach(alphabet, function (ltr) {%><li><%=ltr%></li><%})%>");
  var keyboardFragment = document.querySelector("#keyboardJs");
  keyboardFragment.innerHTML = template(alphabet);
};

GameView.prototype.renderScore = function() {
  var template = _.template('Счет: <span><%=game.rewardQuantity%></span>');
  var scoreFragment = document.querySelector("#score");
  scoreFragment.innerHTML = template(game.rewardQuantity);
};

GameView.prototype.renderTorturer = function() {
  var template = _.template('<%=game.torturer%>');
  var torturerFragment = document.querySelector("#torturerJS");
  torturerFragment.innerHTML = template(game.torturer);
};

GameView.prototype.renderMessage = function(mes) {
  var messageFragment = document.querySelector("#meassageJS");
  messageFragment.innerHTML = mes;
};

GameView.prototype.viewModal = function() {
  var modal = document.querySelector("#modalJs");
  modal.style.display = "block";
};



game = new Game();
game.initialize();
