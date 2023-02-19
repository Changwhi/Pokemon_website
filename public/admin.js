var now = new Date(Date.now());
var formatted =
  now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

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

function diplay_users(data) {
  for (i = 0; i < data.length; i++) {
    if (data[i].admin == "yes") {
      $("#cards").append(`
            <div id="${data[i]._id}" class="CartContainer">
            <p>  
            Database ID: ${data[i]._id}
            </P>
            <p>  
            UserID: ${data[i].username}
            </P>
            <p>  
            Admin?: ${data[i].admin}
            </P>
            <label> Enter new password </label>
            <input type="text" placeholder="Enter new password" id="nwe_password_${data[i]._id}">
            <button class="changeInfo" id="${data[i]._id}" value="${data[i].username}"> change! </button>

            <button class="" id="${data[i]._id}" value="${data[i].username}"> Can't delete! </button>



            </div>

            `);
    } else {
      $("#cards").append(`
            <div id="${data[i]._id}" class="CartContainer">
            <p>  
            Database ID: ${data[i]._id}
            </P>
            <p>  
            UserID: ${data[i].username}
            </P>
            <p>  
            Admin?: ${data[i].admin}
            </P>
            <label> Enter new password </label>
            <input type="text" placeholder="Enter new password" id="new_password">
            <button class="changeInfo" id="${data[i]._id}" value="${data[i].username}"> change! </button>

            <button class="DeleteButtons" id="${data[i]._id}" value="${data[i].username}"> Delete! </button>
            </div>
            `);
    }
  }
}

async function init() {
  $("#cards").empty();
  await $.ajax({
    type: "get",
    url: `http://localhost:5000/user`,
    success: diplay_users,
  });
}

async function deleteUser() {
  justID = this.id;
  UserID = this.value;

  await $.ajax({
    type: "get",
    url: `http://localhost:5000/user/${justID}`,
    // data: "",
    success: function (s) {
      console.log(s);
      addNewEvent(`Customer deleted User in user list - UserID :${UserID}`);
    },
  });
  init();
}

function addUser() {
  $.ajax({
    url: "http://localhost:5000/user/insert",
    type: "put",
    data: {
      userID: $("#input_userid").val(),
      password: $("#input_userpassword").val(),
      admin: $("#check_amin option:selected").val(),
      time: `${now}`,
    },
    success: (res) => {
      console.log(res);
      window.location.replace("http://localhost:5000/admin.html");
    },
  });
}

async function changeinfo() {
  x = this.id;
  await $.ajax({
    url: `http://localhost:5000/user/changeInfo/${x}`,
    type: "put",
    data: {
      newpassword: $(`#nwe_password_${x}`).val(),
    },
    success: function (data) {
      console.log(data);
    },
  });

  init();
}

function setup() {
  init();
  $("body").on("click", ".DeleteButtons", deleteUser);
  $("body").on("click", "#search_poke", addUser);
  $("body").on("click", ".changeInfo", changeinfo);
}

$(document).ready(setup);
