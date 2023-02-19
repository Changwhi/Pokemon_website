async function setup() {
  console.log("working?");

  await $.ajax({
    type: "get",
    url: "http://localhost:5000/loginout",
    success: (x) => {
      console.log(x);
      window.location.replace("http://localhost:5000/login_logout.html");
    },
  });
}

$(document).ready(setup);
