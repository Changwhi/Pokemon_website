to_add = "";
color_code = "";
lastpage = null;
order_start = 1;
order_end = 9;
const colors = {
  fire: "rgb(255, 185, 113),rgb(187, 201, 228)", //
  grass: "rgb(168, 255, 152),rgb(214, 162, 228)", //
  electric: "rgb(168, 255, 152),rgb(214, 162, 228)",
  water: "rgb(140, 196, 226),rgb(218, 117, 137)", //
  ground: "rgb(168, 255, 152),rgb(214, 162, 228)",
  rock: "rgb(168, 255, 152),rgb(214, 162, 228)",
  fairy: "rgb(168, 255, 152),rgb(214, 162, 228)",
  poison: "rgb(214, 162, 228),rgb(230, 154, 116)", //
  bug: "rgb(186, 224, 95),rgb(168, 255, 152)", //
  dragon: "rgb(168, 255, 152),rgb(214, 162, 228)",
  psychic: "rgb(168, 255, 152),rgb(214, 162, 228)",
  flying: "rgb(220, 220, 220),rgb(187, 201, 228)", //
  fighting: "rgb(168, 255, 152),rgb(214, 162, 228)",
  normal: "rgb(220, 220, 220),rgb(253, 185, 233)",
};

function processpokeresp(data) {
  for (var key in colors) {
    if (key == data.types[0].type.name) color_code = colors[key];
  }

  console.log(color_code);
  to_add += `<div class="img_box" style="background:linear-gradient(${color_code}")>  
    <a href="/profile/${data.id}"> 
    <img class="itmes" src="${data.sprites.other["official-artwork"].front_default}"> 
    </a>
    <button class="gotocart" onclick="addtocart(${data.id}, ${data.weight})"> Add to Cart </button>
    <p>${data.name}</P>
    </div>`;
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

async function loadmainimages() {
  to_add += `<div class="container">`;

  for (i = order_start; i <= order_end; i++) {
    x = Math.floor(Math.random() * 500) + 1;

    await $.ajax({
      type: "GET",
      url: `https://pokeapi.co/api/v2/pokemon/${x}/`,
      success: processpokeresp,
    });
  }

  to_add += `</div>`;
  $("main").html(to_add);
}

function setup() {
  console.log("Doc ready");
  loadmainimages();
}

$(document).ready(setup);
