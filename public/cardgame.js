hasFlippedCard = false;
firstcard = undefined;
secondcard = undefined;
final_count = 3;
count = 0;
lockboard = false;
var cards = document.querySelectorAll(".card");
total_card_num = null;
var now = new Date(Date.now());
var formatted =
  now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

function reset() {
  lockboard = false;
  hasFlippedCard = false;
  firstcard = null;
  secondcard = null;
}

function shuffle() {
  cards.forEach((card) => {
    let randompos = Math.floor(Math.random() * 12);
  });
}

function make_board(
  num_horizontal_cards,
  row_total_card_num,
  input_poke_num,
  level
) {
  $("#game_grid").empty();
  horizontal_count = 100 / num_horizontal_cards;
  time_limit = level * row_total_card_num;
  move(time_limit);
  j = 0;
  for (i = 0; i < row_total_card_num; i++) {
    if (i % input_poke_num == 0) {
      j = 0;
    }

    $("#game_grid").append(` <div class="card">
            <img id="img${i}" class="front_face" src="/img/a${j}.png">
            <img class="back_face" src="/img/main.png" alt="">
            </div>`);
    j += 1;

    document.getElementsByClassName("card")[
      i
    ].style.width = `calc(${horizontal_count}% - 10px)`;
  }
}

function addNewEvent(result) {
  $.ajax({
    url: "http://localhost:5000/timelines/insert",
    type: "put",
    data: {
      text: `client ${result} Poke Card game!!!`,
      hits: 1,
      time: `${now}`,
    },
    success: (res) => {
      console.log(res);
    },
  });
}

function move(time) {
  const element = document.getElementById("myBar");
  let width = 0;
  const id = setInterval(frame, time);
  function frame() {
    if (width == 100) {
      clearInterval(id);
      alert("Time over");
      addNewEvent("Lose");
      window.location.replace("http://localhost:5000/cardgame.html");
    } else {
      width++;
      element.style.width = width + "%";
    }
  }
}

function setup() {
  $("body").on("click", "#start_game", function () {
    var f = document.getElementById("input_search");
    var e = document.getElementById("dimension");
    var t = document.getElementById("level");
    if (!f.value) {
      alert("Please enter the poke number");
    } else if (f.value > e.options[e.selectedIndex].value / 2 || f.value < 2) {
      alert("Please enter the right number");
    } else {
      make_board(
        e.options[e.selectedIndex].id,
        e.options[e.selectedIndex].value,
        f.value,
        t.options[t.selectedIndex].value
      );
    }
  });

  $("#dimension").change(() => {
    var e = document.getElementById("dimension");
    max_num = e.options[e.selectedIndex].value / 2;
    document.getElementById(
      "txt_card_num"
    ).innerHTML = `(Only even Number between Min = 2, Max =${max_num})`;
  });

  $("body").on("click", ".card", function () {
    if (lockboard) return;
    if ($(this).find(".front_face")[0] == firstcard) return;

    $(this).toggleClass("flip");

    if (!hasFlippedCard) {
      ///this is the first card flipped
      firstcard = $(this).find(".front_face")[0]; // find 한번 보자
      hasFlippedCard = true;
    } else {
      // there is a card flipped and this is the 2nd one
      secondcard = $(this).find(".front_face")[0];
      hasFlippedCard = false;
      console.log(secondcard);
      if (
        $(`#${firstcard.id}`).attr("src") == $(`#${secondcard.id}`).attr("src")
      ) {
        $(`#${firstcard.id}`).parent().off("click");
        $(`#${secondcard.id}`).parent().off("click");
        reset();
        count += 1;
        if (count == final_count) {
          setTimeout(() => {
            alert("You Win");
            count = 0;
            lockboard = true;
            addNewEvent("won");
          }, 800);
        }
      } else {
        lockboard = true;
        console.log("not match");
        setTimeout(() => {
          $(`#${firstcard.id}`).parent().removeClass("flip");
          $(`#${secondcard.id}`).parent().removeClass("flip");
          reset();
        }, 1000);
      }
    }
  });
}

$(document).ready(setup);
