(function () {
  let interval;
  let nIntervId;
  const gameField = document.createElement('div');

  function shuffle(arr) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  function createGameForm() {
    const formContainer = document.createElement('div');
    const form = document.createElement('form');
    const title = document.createElement('h1');
    const input = document.createElement('input');
    const buttonWrapper = document.createElement('div');
    const button = document.createElement('button');

    formContainer.classList.add('d-flex', 'justify-content-center', 'mt-5');
    form.classList.add('input-group', 'mb-3', 'pl-5', 'pr-5', 'pt-3');
    input.classList.add('form-control');
    input.placeholder = 'Кол-во карточек по вертикали/горизонтали от 2 до 10';
    buttonWrapper.classList.add('iput-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Начать игру';
    title.innerText = 'Игра в пары';
    title.classList.add = ('justify-content-center');

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    formContainer.append(title);

    document.body.append(formContainer);
    document.body.append(form);

    return {
      form,
      button,
      input,
    };
  }

  function getRandomColor() {
    const letters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
    let bgcolor = '#';
    for (let i = 0; i < 6; i++) {
      bgcolor += letters[Math.floor(Math.random() * 16)];
    }
    return bgcolor;
  }

  function createGameField(num) {
    gameField.classList.add('d-flex', 'justify-content-center', 'width-600', 'flex-wrap', 'center', 'p-3');

    const pairs = [];
    for (let e = 0, k = 0; e < num; e++, k += 2) {
      pairs[k] = e;
      pairs[k + 1] = e;
    }

    const pairsShuffled = shuffle(pairs);
    const cardsArr = [];
    for (let i = num * 2 - 1; i > -1; i--) {
      cardsArr[i] = document.createElement('button');
      cardsArr[i].innerHTML = pairsShuffled[i];
      cardsArr[i].style.backgroundColor = getRandomColor();
      cardsArr[i].classList.add('border', 'p-20', 'mr-10', 'mb-10', 'card', 'text-transparent');
      gameField.append(cardsArr[i]);
    }

    document.body.append(gameField);
  }

  function turnUpCard(clickedCard) {
    clickedCard.classList.remove('text-transparent');
    clickedCard.classList.add('turned', 'bg-white');
  }

  function turnDownCard(checkedCard) {
    checkedCard.classList.add('text-transparent');
    checkedCard.classList.remove('turned', 'bg-white');
  }

  function compaire(cardOne, cardTwo) {
    return cardOne.innerHTML === cardTwo.innerHTML;
  }

  function createTimer() {
    const timer = document.createElement('div');
    const frame = document.createElement('div');
    const title = document.createElement('p');

    title.innerText = 'До окончания игры осталось (секунд):';
    frame.textContent = 60;

    timer.classList.add('d-flex', 'flex-column', 'align-items-center');
    title.classList.add('pr-20');
    frame.classList.add('border', 'p-20');

    timer.append(title);
    timer.append(frame);
    document.body.append(timer);

    return {
      timer,
      frame,
    };
  }

  function clearInt() {
    clearInterval(nIntervId);
  }

  function victory() {
    const result = document.createElement('p');

    result.classList.add('text-center', 'font-weight-bold', 'text-success', 'pt-10');
    result.textContent = 'Победа!';
    document.body.append(result);
  }

  function loss() {
    const result = document.createElement('p');

    result.classList.add('text-center', 'font-weight-bold', 'text-primary', 'pt-10');
    result.textContent = 'Вы поиграли :(';
    document.body.append(result);
  }

  function stepDown(timer, match, num) {
    if (interval > 0) {
      timer.frame.textContent = interval - 1;
      interval--;
    } else {
      clearInt();
      if (match < num) {
        loss();
      } else {
        victory();
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const gameForm = createGameForm();
    let timer;
    let numStr;
    let num;
    let k = 0;
    const turnedCards = [];
    let match = 0;

    gameForm.button.addEventListener('click', (e) => {
      e.preventDefault();
      numStr = gameForm.input.value;
      num = Number(numStr);
      if ((num % 2 !== 0) || (num < 2) || (num > 10)) {
        num = 4;
      }

      createGameField(num);
      timer = createTimer();
      gameForm.button.setAttribute('disabled', true);
      interval = timer.frame.textContent;
      nIntervId = setInterval(stepDown, 1000, timer, match, num);
    });

    gameField.addEventListener('click', (e) => {
      const clickCard = e.target;
      if (k < 2) {
        turnUpCard(clickCard);
        turnedCards.push(clickCard);
        k++;
      }
      if (k === 2) {
        gameField.setAttribute('disabled', true);
        if (compaire(turnedCards[0], turnedCards[1])) {
          k = 0;
          match++;
          turnedCards.length = 0;
          gameField.removeAttribute('disabled');
        } else {
          gameField.setAttribute('disabled', true);
          setTimeout(() => {
            turnDownCard(turnedCards[0]);
            turnDownCard(turnedCards[1]);
            k = 0;
            turnedCards.length = 0;
            gameField.removeAttribute('disabled');
          }, 1500);
        }
      }
      if (match === num) {
        victory();
        clearInt();
      }
    });
  });
}());
