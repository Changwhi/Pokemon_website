type_g = "";
color_code = "";
var now = new Date(Date.now());
var formatted =
  now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

var total_number_of_this_types = 0;
var poke_name = "";
var poke_id;
const colors = {
  fire: "rgb(255, 185, 113),rgb(187, 201, 228)",
  grass: "rgb(168, 255, 152),rgb(214, 162, 228)",
  electric: "rgb(220, 220, 220),rgb(187, 201, 228)",
  water: "rgb(140, 196, 226),rgb(218, 117, 137)",
  ground: "rgb(255, 230, 98)),rgb(255, 230, 98)",
  rock: "rgb(214, 162, 228),rgb(230, 154, 116)",
  fairy: "rgb(255, 230, 98),rgb(159, 184, 185)",
  poison: "rgb(214, 162, 228),rgb(159, 184, 185)",
  bug: "rgb(186, 224, 95),rgb(168, 255, 152)",
  dragon: "rgb(168, 255, 152),rgb(214, 162, 228)",
  psychic: "rgb(140, 196, 226),rgb(140, 196, 226)",
  flying: "rgb(220, 220, 220),rgb(187, 201, 228)",
  fighting: "rgb(220, 220, 220),rgb(220, 220, 220)",
  normal: "rgb(220, 220, 220),rgb(253, 185, 233)",
};

function addNewEvent(poke_type) {
  $.ajax({
    url: "http://localhost:5000/timelines/insert",
    type: "put",
    data: {
      text: `client has search for ${poke_type}`,
      hits: 1,
      time: `${now}`,
    },
    success: (res) => {
      console.log(res);
    },
  });
}

function process_poke(data) {
  for (var key in colors) {
    if (key == data.types[0].type.name) color_code = colors[key];
  }

  for (i = 0; i < data.types.length; i++)
    if (data.types[i].type.name == type_g) {
      total_number_of_this_types += 1;
      $("#total_container").append(
        `<div class='poke_container' style="background:linear-gradient(${color_code})"> <a href="/profile/${data.id}"><img src="${data.sprites.other["official-artwork"].front_default}">` +
          `</a>  <button class="gotocart" onclick="addtocart(${data.id}, ${data.weight})"> Add to Cart </button><p>${data.name}</P></div>`
      );
    }
}

function addtocart(id, price) {
  $.ajax({
    type: "GET",
    url: `http://localhost:5000/shoppingcart/insert/${id}/${price}`,
    success: () => {
      console.log("cart Delete success");
    },
  });
}

function display(type_) {
  $("#buttons").hide();
  $("#total_container").empty();
  type_g = type_;
  for (i = 1; i < 500; i++)
    $.ajax({
      type: "get",
      url: `https://pokeapi.co/api/v2/pokemon/${i}`,
      success: process_poke,
    });
}

function process_poke_name(data) {
  for (var key in colors) {
    if (key == data.types[0].type.name) color_code = colors[key];
  }
  var target_name = data.name;
  if (target_name.includes(poke_name)) {
    total_number_of_this_types += 1;
    $("#total_container").append(
      `<div class='poke_container' style="background:linear-gradient(${color_code})"> <a href="/profile/${data.id}"><img src="${data.sprites.other["official-artwork"].front_default}">` +
        `</a>     <button class="gotocart" onclick="addtocart(${data.id}, ${data.weight})"> Add to Cart </button>
        <p>${data.name}</P></div>`
    );
  }
}

function process_poke_id(data) {
  for (var key in colors) {
    if (key == data.types[0].type.name) color_code = colors[key];
  }
  target_id = data.id.toString();

  if (target_id == poke_id) {
    total_number_of_this_types += 1;
    $("#total_container").append(
      `<div class='poke_container' style="background:linear-gradient(${color_code})"> <a href="/profile/${data.id}"><img src="${data.sprites.other["official-artwork"].front_default}">` +
        `</a>     <button class="gotocart" onclick="addtocart(${data.id}, ${data.weight})"> Add to Cart </button>
        <p>${data.name}</P></div>`
    );
  }
}

function findpokebyname() {
  $("#buttons").hide();
  $("#total_container").empty();
  $("#history").append(
    `<span><button id="${$("#input_search").val()}" class='search_again'>${$(
      "#input_search"
    ).val()}</button><button class="del">Delete</button></span>`
  );

  if ($("#search_type option:selected").val() == "Name") {
    poke_name = $("#input_search").val();

    addNewEvent(poke_name);
    for (i = 1; i < 500; i++)
      $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/pokemon/${i}`,
        success: process_poke_name,
      });
  } else if ($("#search_type option:selected").val() == "ID") {
    poke_id = $("#input_search").val();
    addNewEvent(poke_id);

    for (i = 1; i < 500; i++)
      $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/pokemon/${i}`,
        success: process_poke_id,
      });
  }
}

function validation_input() {
  input_val = $("#input_search").val();
  if (
    $("#search_type option:selected").val() == "Name" &&
    isNaN(input_val) == false
  ) {
    alert("Please enter the string only");
  } else if (
    $("#search_type option:selected").val() == "ID" &&
    isNaN(input_val) == true
  ) {
    alert("Please enter the integer only");
  } else if (input_val == "") {
    alert("Fill out the search bar");
  } else if ($("#search_type option:selected").val() == "none") {
    alert("Select Name or ID");
  } else {
    findpokebyname();
  }
}

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function del() {
  $(this).parent().remove();
}

function search_again() {
  $("#total_container").empty();

  $("#input_search").val(this.id);

  x = $("#input_search").val();
  if (isNaN(x) == true) {
    console.log("If1 works");
    poke_name = $("#input_search").val();
    console.log(poke_name);

    for (i = 1; i < 500; i++) {
      $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/pokemon/${i}`,
        success: process_poke_name,
      });
    }
  } else if (isNaN(x) == false) {
    console.log("If2 works");

    poke_id = $("#input_search").val();
    console.log(poke_id);

    for (i = 1; i < 500; i++) {
      $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/pokemon/${i}`,
        success: process_poke_id,
      });
    }
  }
}

function setup() {
  type_g = $("#poke_type option:selected").val();

  $("#buttons").hide();
  $("#poke_type").change(() => {
    display($("#poke_type option:selected").val());
    addNewEvent(type_g);
  });

  $("body").on("click", "#search_poke", validation_input);

  $("body").on("click", ".del", del);
  $("body").on("click", ".search_again", search_again);
}

$(document).ready(setup);
