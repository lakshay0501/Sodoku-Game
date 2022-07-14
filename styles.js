
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

  let timer;
  let timeremaining;
  let lives;
  let selectednum;
  let selectedtile;
  let disableselect;

  window.onload = function() {

    id("start-btn").addEventListener("click", startGame);

    for(let i=0;i<id("number-container").children.length;i++) {
      id("number-container").children[i].addEventListener("click", function() {

        if(!disableselect){

          if(this.classList.contains("selected")){
            this.classList.remove("selected");
            selectednum = null;
          }
          else{
            // deselect any other numbers

            for(let i=0;i<9;i++){
              id("number-container").children[i].classList.remove("selected");
            }

            // select the number
            this.classList.add("selected");
            selectednum = this;
            updateMove();
          }
        }
      });
    }
  }

  function startGame() {
    
     let board;

     if(id("diff-1").checked) board = easy[0];
     else if(id("diff-2").checked) board = medium[0];
     else board = hard[0];

     lives = 3;
     disableselect = false;
     id("lives").textContent = "Lives Remaining: " + lives;

     generateBoard(board);

     // starts the timer
      startTimer();

      // sets theme based on input

      if(id("theme-1").checked){
        qs("body").classList.remove("dark");
      }
      else{
        qs("body").classList.add("dark");
      }

      // show number container
      id("number-container").classList.remove("hidden");
  }
  
  // function to start the timer
  function startTimer(){
     
    if(id("time-1").checked) timeremaining=300;
    else if(id("time-2").checked) timeremaining=600;
    else timeremaining=900;

    // sets timer for first second

    id("timer").textContent = timeconversion(timeremaining);

    timer = setInterval(function(){
      timeremaining--;
      
      if(timeremaining===0){
        endgame();
      }
      id("timer").textContent = timeconversion(timeremaining);
    },1000);
  }

  // function to convert time to minutes and seconds MM:SS

  function timeconversion(time){
    let minutes = Math.floor(time/60);
    if(minutes < 10){
      minutes = "0" + minutes;
    }
    let seconds = time%60;
    if(seconds < 10){
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  }

  function generateBoard(board){
    
     // need to clear previous board
     clearPreviousBoard();

     // let used to increment tile ids
     let idcount = 0;

     // create tiles

     for(let i=0;i<81;i++){

       // create a new paragraph element;

       let tile = document.createElement("p");
       // if the tile is not supposed to be empty, add the number to it
       if(board.charAt(i)!='-'){
         tile.textContent = board.charAt(i);
       }
       else{
          // add click event listener to the tile

          tile.addEventListener("click",function() {
            if(!disableselect){

              if(tile.classList.contains("selected")){
                tile.classList.remove("selected");
                selectedtile = null;
              }
              else{

                for(let i=0;i<81;i++){
                  qsa(".tile")[i].classList.remove("selected");
                }

                tile.classList.add("selected");
                selectedtile = tile;
                updateMove();

              }
            }
          })
       }
       // assign tile id

       tile.id = idcount;

       // increment idcount
        idcount++;

        // add tile to the board
        tile.classList.add("tile");
        if((tile.id>17 && tile.id <=26) || (tile.id>44 && tile.id<=53)){
          tile.classList.add("bottomborder");
        }

        if((tile.id+1)%9==3 || (tile.id+1)%9==6){
          tile.classList.add("rightborder");
        }

        id("board").appendChild(tile);
     }

  }

  function updateMove(){

    if(selectedtile && selectednum){
      selectedtile.textContent = selectednum.textContent;
      // selectednum.classList.remove("selected");
      
      // if number matches the corresponding number in the board
      if(checkCorrect(selectedtile)){
          
        selectedtile.classList.remove("selected");
        selectednum.classList.remove("selected");
        // clear the selected tile and number
        selectedtile = null;
        selectednum = null;

        if(checkWin()){
          endgame();
        }
      }
      else{
         disableselect = true;
         // make the tile and number red
          selectedtile.classList.add("incorrect");

          setTimeout(function(){
            // subtract lives by one
            lives--;
            // if no loves left end game
            if(lives==0) endgame();
            else{

              id("lives").textContent = "Lives Remaining: " + lives;

              disableselect = false;
            }

            // remove the red class and remove selected class

            selectedtile.classList.remove("incorrect");
            selectednum.classList.remove("selected");
            selectedtile.classList.remove("selected");

            selectedtile.textContent = "";
            selectedtile = null;
            selectednum = null;
          },1000)
      }
    }
  }

  function checkWin(){

    let tiles = qsa(".tile");
    for(let i=0;i<tiles.length;i++){
      if(tiles[i].textContent===""){
        return false;
      }
    }

    return true;
  }

  function endgame(){

    // disable moves and stop timer
    // body.backgroundColor = "red";

    clearTimeout(timer);

    // display win or loss message

    if(lives==0 || timeremaining==0){
      id("lives").textContent = "You Lost!";
    }
    else{
      id("lives").textContent = "You Won!";
    }
  }

  function checkCorrect(tile){

    let solution;

    if(id("diff-1").checked) solution = easy[1];
    else if(id("diff-2").checked) solution = medium[1];
    else solution = hard[1];

    if(tile.textContent==solution.charAt(tile.id)){
      return true;
    }
    else{
      return false;
    }
  }

  function clearPreviousBoard(){
     
    // accessing each tile
     let tiles = qsa(".tile");
     
     for(let i=0;i<tiles.length;i++){
       tiles[i].remove();
     }

     // if there is a timer, clear it
      if(timer){
        clearTimeout(timer);
      }

      // Deselect any numbers

      for(let i=0;i<id("number-container").children.length;i++){
        id("number-container").children[i].classList.remove("selected");
      }

      // clear selected variables
      selectednum = null;
      selectedtile = null;
  }

  // helper functions
  function id(id){
    return document.getElementById(id);
  }

  function qs(selector){
    return document.querySelector(selector);
  }

  function qsa(selector){
    return document.querySelectorAll(selector);
  }