pokeid = "";
quantity = null;
price = null;
total_info = null;
var now = new Date(Date.now());
var formatted =
  now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

async function call_pre() {
  await $.ajax({
    type: "get",
    url: `http://localhost:5000/shoppingcart/callpre`,
    success: function (data) {
      for (i = 0; i < data.length; i++) {
        $("#pre").append(`
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
            <button class="PreDeleteButtons" id="${data[i]._id}" value="${data[i].pokeID}"> Delete! </button>
            </div>
            `);
      }
    },
  });
}

function result(data) {
  if (data == "fail_auth") {
    window.location.replace("http://localhost:5000/login_logout.html");
  } else {
    if (data.length == 0) {
      $("#Checkoutbutton").hide();

      $("#details").hide();
    } else {
      total_info = data;
      totalprice = 0;
      $("#Checkoutbutton").show();
      $("#details").show();
      for (i = 0; i < data.length; i++) {
        totalprice += data[i].price * data[i].quantity;
        eachprice = data[i].price * data[i].quantity;
        $("#details").append(`
            <div class="price">#${i + 1} ID:${
          data[i].pokeID
        }  =  $${eachprice}<div>
        `);
        $("#cards").append(`
        <div id="${data[i]._id}" class="CartContainer">
        <p>  
        PokeID: ${data[i].pokeID}
        </P>


        <p>  
        price: ${data[i].price}
        </P>
        <div class="quantity">
        <button class="QuantityUpButtons" id="${data[i]._id}"> + </button>
        
        <p>  
        quantity: ${data[i].quantity}
        </P>
        <button class="QuantityDownButtons" id="${data[i]._id}" value="${data[i].quantity}"> - </button>
        </div>

        <button class="DeleteButtons" id="${data[i]._id}" value="${data[i].pokeID}"> Delete! </button>
        </div>
        `);
      }
      tax = null;
      tax = totalprice * 0.12;
      final = null;
      final = tax + totalprice;
      $("#details").append(`
    <br>
    <hr>
    <div id="totalprice">Total amount = $${totalprice} <div>
    <div id="totalprice">Tax = $${tax} <div>
    <div id="totalprice">Final price = $${final} <div>
`);
    }
  }
}

async function init() {
  call_pre();
  await $.ajax({
    type: "get",
    url: "http://localhost:5000/shoppingcart",
    success: result,
  });
}

async function deleteCart() {
  justID = this.id;
  pokeID = this.value;
  await $.ajax({
    type: "get",
    url: `http://localhost:5000/shoppingcart/delete/${justID}`,
    success: function (s) {
      console.log(s);
      addNewEvent(
        `Customer deleted poke Card in your Cart - poke ID :${pokeID}`
      );
    },
  });
  $("#details").empty();
  $("#cards").empty();
  $("#pre").empty();

  init();
}

function checkoutbutton() {
  let text = "Do you want to check out?\nChoose OK or Cancel.";
  if (confirm(text) == true) {
    $.ajax({
      type: "POST",
      url: `http://localhost:5000/shoppingcart/checkout`,
      success: function (s) {
        addNewEvent(`Customer pays for shopping cart items`);
      },
    });
    $("#pre").empty();
    $("#details").empty();
    $("#cards").empty();
    init();
  } else {
    console.log("checkout has been canceled");
  }
}

async function predeleteCart() {
  justid = this.id;
  pokeID = this.value;
  await $.ajax({
    type: "get",
    url: `http://localhost:5000/shoppingcart/predelete/${justid}`,
    success: function (s) {
      console.log(s);
      addNewEvent(
        `Customer deleted poke Card in Checkout history - poke ID :${pokeID}`
      );
    },
  });
  $("#pre").empty();
  call_pre();
}

function addNewEvent(content) {
  $.ajax({
    url: "http://localhost:5000/timelines/insert",
    type: "put",
    data: {
      text: `${content}`,
      hits: 1,
      time: `${now}`,
    },
    success: (res) => {
      console.log(res);
    },
  });
}

function qunatityup() {
  x = this.id;
  $.ajax({
    url: `http://localhost:5000/shoppingcart/increasehits/${x}`,
    type: "post",
    // data: {},
    success: function (data) {
      console.log(data);
    },
  });
  $("#pre").empty();
  $("#details").empty();
  $("#cards").empty();
  init();
}

function quantitydown() {
  y = this.value;
  console.log(y);

  if (y > 1) {
    x = this.id;
    $.ajax({
      url: `http://localhost:5000/shoppingcart/decreasehits/${x}`,
      type: "post",
      success: function (data) {
        console.log(data);
      },
    });
    $("#pre").empty();
    $("#details").empty();
    $("#cards").empty();
    init();
  } else {
    console.log("min number");
  }
}

function setup() {
  console.log("Shoppingcart doc ready");
  init();
  $("body").on("click", ".PreDeleteButtons", predeleteCart);
  $("body").on("click", ".DeleteButtons", deleteCart);
  $("body").on("click", "#Checkoutbutton", checkoutbutton);

  $("body").on("click", ".QuantityDownButtons", quantitydown);
  $("body").on("click", ".QuantityUpButtons", qunatityup);
}

$(document).ready(setup);
