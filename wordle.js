document.addEventListener("DOMContentLoaded", function () {
  const titulo = document.querySelector(".titulo");
  const explicacion = document.querySelector(".explicacion");
  const tituloEjemplo = document.querySelector(".tituloEjemplo");
  const uno = document.querySelector(".uno");
  const dos = document.querySelector(".dos");
  const tres = document.querySelector(".tres");
  const cuatro = document.querySelector(".cuatro");
  const cinco = document.querySelector(".cinco");
  const textoUno = document.querySelector(".textoUno");
  const seis = document.querySelector(".seis");
  const siete = document.querySelector(".siete");
  const ocho = document.querySelector(".ocho");
  const nueve = document.querySelector(".nueve");
  const diez = document.querySelector(".diez");
  const textoDos = document.querySelector(".textoDos");
  const once = document.querySelector(".once");
  const doce = document.querySelector(".doce");
  const trece = document.querySelector(".trece");
  const catorce = document.querySelector(".catorce");
  const quince = document.querySelector(".quince");
  const textoTres = document.querySelector(".textoTres");
  const textoFinal = document.querySelector(".textoFinal");
  let history = [];
  let currentAttempt = "";
  let secret;
  let secretWord;
  let username;
  let juego = document.querySelector(".juego");
  let grid = document.getElementById("grid");
  let keyboard = document.getElementById("keyboard");
  let keyboardButtons = new Map();
  let languageModal = document.getElementById("languageModal");
  let resultadoModal = document.getElementById("resultadoModal");
  let mensaje = document.querySelector(".mensaje");
  let secreto = document.querySelector(".secreto");
  let usuario = document.querySelector(".usuario");
  const botonOtraPalabra = document.querySelector(".boton-otra-palabra");
  const botonReiniciarJuego = document.querySelector(".boton-reiniciar-juego");

  function handleKeyDown(e) {
    if (e.metaKey || e.altKey) {
      return;
    }
    handleKey(e.key);
  }

  function handleKey(key) {
    if (history.length === 6) {
      return;
    }
    if (isAnimating) {
      return;
    }
    let letter = key.toLowerCase();
    if (letter === "enter") {
      if (activeLanguage === "es") {
        if (currentAttempt.length < 5) {
          alert("HAS DE TENER UNA PALABRA DE CINCO LETRAS");
          return;
        }
        if (!palabrasES.includes(currentAttempt)) {
          alert("La palabra no está en la lista de palabras en español.");
          return;
        }
        if (history.length === 5 && currentAttempt !== secret) {
          resumenModal("NO LA HAS ADIVINADO");
        }
        if (currentAttempt === secret) {
          resumenModal("FELICIDADES LA HAS ADIVINADO");
        }
      } else if (activeLanguage === "cat") {
        if (currentAttempt.length < 5) {
          alert("HAS DE TENIR UNA PARAULA DE CINC LLETRES");
          return;
        }
        if (!palabrasCAT.includes(currentAttempt)) {
          alert("La paraula no està a la llista de paraules en català.");
          return;
        }
        if (history.length === 5 && currentAttempt !== secret) {
          resumenModal("NO L'HAS ENDEVINAT");
        }
        if (currentAttempt === secret) {
          resumenModal("FELICITATS L'HAS ENDEVINAT");
        }
      }
      history.push(currentAttempt);
      currentAttempt = "";
      updateKeyboard();
      pauseInput();
    } else if (letter === "backspace") {
      currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1);
    } else if (letter) {
      if (currentAttempt.length < 5) {
        currentAttempt += letter;
        animatePress(currentAttempt.length - 1);
      }
    }
    updateGrid();
  }

  let isAnimating = false;
  function pauseInput() {
    if (isAnimating) throw Error("should never happen");
    isAnimating = true;
    setTimeout(() => {
      isAnimating = false;
    }, 2000);
  }

  function buildGrid() {
    for (let i = 0; i < 6; i++) {
      let row = document.createElement("div");
      for (let j = 0; j < 5; j++) {
        let cell = document.createElement("div");
        cell.className = "cell";
        let front = document.createElement("div");
        front.className = "front";
        let back = document.createElement("div");
        back.className = "back";
        let surface = document.createElement("div");
        surface.className = "surface";
        surface.style.transitionDelay = j * 300 + "ms";
        surface.appendChild(front);
        surface.appendChild(back);
        cell.appendChild(surface);
        row.appendChild(cell);
      }
      grid.appendChild(row);
    }
  }

  function updateGrid() {
    for (let i = 0; i < 6; i++) {
      let row = grid.children[i];
      if (i < history.length) {
        drawAttempt(row, history[i], true);
      } else if (i === history.length) {
        drawAttempt(row, currentAttempt, false);
      } else {
        drawAttempt(row, "", false);
      }
    }
  }

  function drawAttempt(row, attempt, solved) {
    for (let i = 0; i < 5; i++) {
      let cell = row.children[i];
      let surface = cell.firstChild;
      let front = surface.children[0];
      let back = surface.children[1];
      if (attempt[i] !== undefined) {
        front.textContent = attempt[i];
        back.textContent = attempt[i];
      } else {
        front.innerHTML = '<div style="opacity: 0">X</div>';
        back.innerHTML = '<div style="opacity: 0">X</div>';
        clearAnimation(cell);
      }
      front.style.backgroundColor = "white";
      front.style.borderColor = "";
      if (attempt[i] !== undefined) {
        front.style.borderColor = MIDDLEGREY;
      }
      back.style.backgroundColor = getBgColor(attempt, i);
      back.style.color = "LightGray";
      back.style.borderColor = getBgColor(attempt, i);
      if (solved) {
        cell.classList.add("solved");
      } else {
        cell.classList.remove("solved");
      }
    }
  }

  let BLACK = "#111";
  let GREY = "#111";
  let MIDDLEGREY = "#111";
  let LIGHTGREY = "#888";
  let GREEN = "#538d4e";
  let YELLOW = "#b59f3b";

  function getBgColor(attempt, i) {
    let correctLetter = secret[i];
    let attemptLetter = attempt[i];
    if (attemptLetter === undefined || secret.indexOf(attemptLetter) === -1) {
      return GREY;
    }
    if (correctLetter === attemptLetter) {
      return GREEN;
    }
    return YELLOW;
  }

  function buildKeyboard() {
    buildKeyboardRow("qwertyuiop", false);
    buildKeyboardRow("asdfghjklñ", false);
    buildKeyboardRow("zxcvbnm", true);
  }

  function buildKeyboardRow(letters, isLastRow) {
    let row = document.createElement("div");
    if (isLastRow) {
      let button = document.createElement("button");
      button.className = "button";
      button.textContent = "Enter";
      button.style.backgroundColor = LIGHTGREY;
      button.style.fontSize = "12px";
      button.onclick = () => {
        handleKey("enter");
      };
      row.appendChild(button);
    }
    for (let letter of letters) {
      let button = document.createElement("button");
      button.className = "button";
      button.textContent = letter;
      button.style.backgroundColor = LIGHTGREY;
      button.onclick = () => {
        handleKey(letter);
      };
      keyboardButtons.set(letter, button);
      row.appendChild(button);
    }
    if (isLastRow) {
      let button = document.createElement("button");
      button.className = "button";
      button.textContent = "«";
      button.style.fontSize = "25px";
      button.style.backgroundColor = LIGHTGREY;
      button.onclick = () => {
        handleKey("backspace");
      };
      row.appendChild(button);
    }
    keyboard.appendChild(row);
  }

  function getBetterColor(a, b) {
    if (a === GREEN || b === GREEN) {
      return GREEN;
    }
    if (a === YELLOW || b === YELLOW) {
      return YELLOW;
    }
    return GREY;
  }

  function updateKeyboard() {
    let bestColors = new Map();

    for (let attempt of history) {
      for (let i = 0; i < attempt.length; i++) {
        let color = getBgColor(attempt, i);
        let key = attempt[i];

        let bestColor = bestColors.get(key);
        bestColors.set(key, getBetterColor(color, bestColor));
      }
    }
    for (let [key, button] of keyboardButtons) {
      button.style.backgroundColor = bestColors.get(key);
      button.style.borderColor = bestColors.get(key);
    }
  }

  function animatePress(index) {
    let rowIndex = history.length;
    let row = grid.children[rowIndex];
    let cell = row.children[index];
    cell.style.animationName = "press";
    cell.style.animationDuration = "100ms";
    cell.style.animationTimingFunction = "ease-out";
  }

  function clearAnimation(cell) {
    cell.style.animationName = "";
    cell.style.animationDuration = "";
    cell.style.animationTimingFunction = "";
  }

  function startGame(secretWord) {
    // activeWordList = wordList;
    secret = secretWord;
    console.log(secret);
    buildGrid();
    buildKeyboard();
    updateGrid();
    updateKeyboard();
  }
  document.querySelector(".es").addEventListener("click", function () {
    languageModal.style.visibility = "hidden";
    activeLanguage = "es";
    updateModalContent(activeLanguage);
    let aleatorio = Math.floor(Math.random() * palabrasES.length);
    secretWord = palabrasES[aleatorio];
    startGame(secretWord);
    username = document.getElementById("username").value;
    localStorage.setItem("username", username);
    
  });

  document.querySelector(".cat").addEventListener("click", function () {
    languageModal.style.visibility = "hidden";

    activeLanguage = "cat";
    updateModalContent(activeLanguage);
    let aleatorio = Math.floor(Math.random() * palabrasCAT.length);
    secretWord = palabrasCAT[aleatorio];
    startGame(secretWord);
    username = document.getElementById("username").value;
    localStorage.setItem("username", username);
    console.log(username);
  });
  function resumenModal(ocurrido) {
    resultadoModal.style.visibility = "visible";
    juego.style.opacity = "0.5";
    let username = localStorage.getItem("username");
    usuario.textContent = username;

    mensaje.innerHTML = ocurrido;
    secreto.innerHTML = secretWord;
    botonOtraPalabra.addEventListener("click", function() {
      let nuevaPalabra;
      if (activeLanguage === "es") {
          nuevaPalabra = palabrasES[Math.floor(Math.random() * palabrasES.length)];
          history = [];
          currentAttempt = "";
          grid.innerHTML = "";
          keyboard.innerHTML = "";
          juego.style.opacity = "1"

      } else if (activeLanguage === "cat") {
          nuevaPalabra = palabrasCAT[Math.floor(Math.random() * palabrasCAT.length)];
      }
      secretWord = nuevaPalabra;
      resultadoModal.style.visibility = "hidden"
      startGame(secretWord);
    });
    botonReiniciarJuego.addEventListener("click", function() {
      localStorage.removeItem("username");
      window.location.reload();
    });

  }
  function showModal() {
    languageModal.style.visibility = "visible";
  }
  function updateModalContent(activeLanguage) {
    if (activeLanguage === "es") {
      titulo.textContent = "Cómo Jugar";
      explicacion.innerHTML =
        "<p>Adivina la palabra secreta en seis intentos,Cada intento debe ser una palabra válida de 5 letras.Los acentos de la palabras no se tendran en cuenta.</p>";
      tituloEjemplo.textContent = "Ejemplos:";
      uno.innerHTML = "G";
      dos.innerHTML = "U";
      tres.innerHTML = "A";
      cuatro.innerHTML = "S";
      cinco.innerHTML = "A";
      textoUno.textContent =
        'La letra "G" esta en la palabra y en la posicion correcta.';
      seis.innerHTML = "H";
      siete.innerHTML = "U";
      ocho.innerHTML = "E";
      nueve.innerHTML = "V";
      diez.innerHTML = "O";
      textoDos.innerHTML =
        'La letra "E" esta en la palabra pero no en la posicion correcta.';
      once.innerHTML = "A";
      doce.innerHTML = "N";
      trece.innerHTML = "D";
      catorce.innerHTML = "A";
      quince.innerHTML = "R";
      textoTres.innerHTML = 'La letra "R" no esta en la palabra.';
      textoFinal.innerHTML =
        "Puede haber letras repetidas.Las pistas son independientes para cada letra.";
    } else if (activeLanguage === "cat") {
      titulo.innerHTML = "COM JUGAR";
      explicacion.innerHTML =
        "<p>Endevina la paraula secreta en sis intents,cada intent ha de ser una paraula vàlida de cinc lletres, els accents no es tindran en compte</p>";
      tituloEjemplo.innerHTML = "Exemples:";
      uno.innerHTML = "G";
      dos.innerHTML = "A";
      tres.innerHTML = "B";
      cuatro.innerHTML = "I";
      cinco.innerHTML = "A";
      textoUno.innerHTML =
        'La lletra "G" aquesta a la paraula ia la posició correcta.';
      seis.innerHTML = "R";
      siete.innerHTML = "U";
      ocho.innerHTML = "E";
      nueve.innerHTML = "C";
      diez.innerHTML = "S";
      textoDos.innerHTML =
        'La lletra "E" aquesta en la paraula però no en la posició correcta.';
      once.innerHTML = "X";
      doce.innerHTML = "U";
      trece.innerHTML = "T";
      catorce.innerHTML = "A";
      quince.innerHTML = "R";
      textoTres.innerHTML = 'La lletra "R" no està a la paraula.';
      textoFinal.innerHTML =
        "Pot haver-hi lletres repetides. Les pista són independents per a cada lletra.";
    }

    document.getElementById("gameModal").style.visibility = "visible";
  }

  document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("gameModal").style.visibility = "hidden";
    juego.style.visibility = "visible";

    window.addEventListener("keydown", handleKeyDown);
  });

  showModal();
});
