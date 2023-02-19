function loadUserinfoToMainDiv() {
  $.ajax({
    url: "http://localhost:5000/check",
    type: "get",
    success: (r) => {
      $("#userinfo").append(`
                    <p> Hello, ${r[0].username}</p>


                `);
    },
  });
}

function loadEventsToMainDiv() {
  count_time = 0;
  $.ajax({
    url: "http://localhost:5000/timelines/getallevents",
    type: "get",
    success: (r) => {
      if (r == "fail_auth") {
        window.location.replace("http://localhost:5000/login_logout.html");
      } else {
        for (i = 0; i < r.length; i++) {
          count_time += 1;

          $("#timeline")
            .append(`<div class="timelineContainer">                         
                <p> Event text - ${r[i].text} </p>

                <p> Event Time - ${r[i].time} </p>

                <p> Event hits - ${r[i].hits} </p>
                <button class="LikeButtons" id="${r[i]["_id"]}"> Like! </button>
                <button class="DeleteButtons" id="${r[i]["_id"]}"> Delete! </button>


                </div>
                `);
        }
      }
    },
  });
}

async function call_pre() {
  count_checkout = 0;
  await $.ajax({
    type: "get",
    url: `http://localhost:5000/shoppingcart/callpre`,
    success: function (data) {
      for (i = 0; i < data.length; i++) {
        count_checkout += 1;

        $("#checkout").append(`
             <div id="${data[i]._id}" class="CartContainer">
             <p>  
             PokeID: ${data[i].pokeID}
             </P>
             <p>  
             price: ${data[i].price}
             </P>
             <p>  
             quantity: ${data[i].quantity}
             </P>
             <button class="PreDeleteButtons" id="${data[i]._id}"> Delete! </button>
             </div>
             `);
      }
    },
  });
}

async function predeleteCart() {
  pokeID = this.id;
  await $.ajax({
    type: "get",
    url: `http://localhost:5000/shoppingcart/predelete/${pokeID}`,
    // data: "",
    success: function (s) {
      console.log(s);
    },
  });

  $("#checkout").empty();
  $("#timeline").empty();

  call_pre();
  loadEventsToMainDiv();
}

function increaseHits() {
  x = this.id;
  $.ajax({
    url: `http://localhost:5000/timelines/increasehits/${x}`,
    type: "get",
    success: function (data) {
      console.log(data);
    },
  });
  $("#checkout").empty();
  $("#timeline").empty();

  call_pre();
  loadEventsToMainDiv();
}

function DeleteINfo() {
  x = this.id;
  console.log(x);

  $.ajax({
    url: `http://localhost:5000/timelines/delete/${x}`,

    success: function (data) {
      console.log(data);
    },
  });
  $("#checkout").empty();
  $("#timeline").empty();

  call_pre();
  loadEventsToMainDiv();
}

function setup() {
  loadEventsToMainDiv();
  loadUserinfoToMainDiv();
  call_pre();

  $("body").on("click", ".LikeButtons", increaseHits);
  $("body").on("click", ".DeleteButtons", DeleteINfo);
  $("body").on("click", ".PreDeleteButtons", predeleteCart);
}

$(document).ready(setup);
