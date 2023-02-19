function try_login() {
  user_id = $("#user_id").val();
  user_password = $("#user_password").val();

  $.ajax({
    type: "put",
    url: `http://localhost:5000/login/try`,
    data: {
      user_id: user_id,
      user_password: user_password,
    },
    success: function (message) {
      if (message == "fail_auth") {
        console.log("Log-in error");

        $("#login_box").show();
      } else if (message == "Admin Login!") {
        window.location.replace("/admin.html");
      } else {
        window.location.replace("/timeline.html");
      }
    },
  });
}

async function init() {
  $("#login_box").hide();

  await $.ajax({
    type: "get",
    url: `http://localhost:5000/check/admin`,
    success: function (message) {
      console.log(message);

      if (message == "fail_auth") {
        console.log(message);
        console.log("Log-in error");
        $("#login_box").show();
      } else if (message == "yes") {
        window.location.replace("/admin.html");
      } else {
        window.location.replace("/timeline.html");
      }
    },
  });
}

function setup() {
  init();
  $("#login_box").hide();
  $("body").on("click", "#try_login", try_login);
}

$(document).ready(setup);
