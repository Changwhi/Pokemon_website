async function check_amin() {
  await $.ajax({
    type: "GET",
    url: `http://localhost:5000/check/admin`,
    success: (result) => {
      console.log(result);
      if (result == "fail_auth") {
        window.location.replace("http://localhost:5000/login_logout.html");
      } else if (result == "yes") {
        $("#menu")
          .append(`<a href="/admin.html" style="border: black solid 2px;"> Admin page !</a>
            `);
      }
    },
  });
}

function setup() {
  check_amin();
}

$(document).ready(setup);
