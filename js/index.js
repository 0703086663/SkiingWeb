$(function () {
  var siteSticky = function () {
    $(".js-sticky-header").sticky({ topSpacing: 0 });
  };
  siteSticky();

  var siteDropdown = function () {
    $("nav .dropdown").hover(
      function () {
        var $this = $(this);
        $this.addClass("show");
        $this.find("> a").attr("aria-expanded", true);
        $this.find(".dropdown-menu").addClass("show");
      },
      function () {
        var $this = $(this);
        $this.removeClass("show");
        $this.find("> a").attr("aria-expanded", false);
        $this.find(".dropdown-menu").removeClass("show");
      }
    );

    $(".navbar .dropdown > a").click(function () {
      location.href = this.href;
    });
  };
  siteDropdown();
});

// Effect on mouse
const targetElement = document.querySelector("#ghost");
new cursoreffects.emojiCursor({ emoji: ["❄️"] });

// Geolocation
window.addEventListener("load", function () {
  //Display item
  if (navigator.geolocation) {
    getWeatherData();
  } else {
    console.log("Geolocation failed!!");
  }
});

//Calculate temperature
function calculateTemperature(temp) {
  (temp = temp - 273), 15;
  return temp.toFixed(1);
}
function getWeatherData() {
  $("#loading-gif").show();
  $("#btn-load-more").hide();
  navigator.geolocation.getCurrentPosition(
    (position) => {
      $.get(
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
          position.coords.latitude +
          "&lon=" +
          position.coords.longitude +
          "&appid=" +
          "954a319419de9c51c94e1dfd5e59118a",
        function (data) {
          var list = data.list;
          for (var i = 0; i < data.list.length - 1; i++) {
            $("#list-weather").append(
              '<div class="card"><div class="card-body p-4"><div class="d-flex"><h6 class="flex-grow-1">' +
                data.city.name +
                "</h6><h6>" +
                data.list[i].dt_txt +
                '</h6></div><div class="d-flex flex-column text-center mt-5 mb-4"><h6 class="display-4 mb-0 font-weight-bold">' +
                calculateTemperature(list[i].main.temp) +
                ' °C</h6><span class="small">' +
                list[i].weather[0].description +
                '</span></div><div class="d-flex align-items-center"><div class="flex-grow-1" style="font-size: 1rem;"><div><i class="fas fa-cloud"></i> <span class="ms-1"> ' +
                list[i].clouds.all +
                ' N/m<span class="equation-badge">3</span></span></div><div><i class="fas fa-wind"></i> <span class="ms-1"> ' +
                list[i].wind.speed +
                ' km/h</span></div><div><i class="fas fa-tint"></i> <span class="ms-1">' +
                list[i].main.humidity +
                ' % </span></div></div><div><img src="http://openweathermap.org/img/wn/' +
                list[i].weather[0].icon +
                '@2x.png"width="100px"></div></div></div></div>'
            );
          }
          $(".main-content-title").html("Snow Report in " + data.city.name);
          $("#loading-gif").remove();
          $("#btn-load-more").show();
          $(".snowreport-section .card:lt(6)").show();
        }
      );
    },
    (error) => {
      if (error.PERMISSION_DENIED)
        alert(
          "Location services are off. Please enable location services, or use zip code search."
        );
      showError("Geolocation is not enabled.");
    }
  );
}

var currentIndex = 6;
function loadMore() {
  //Load more btn
  arrLength = $(".snowreport-section .card").length;
  console.log(arrLength);
  currentIndex = currentIndex + 6 <= arrLength ? currentIndex + 6 : arrLength;
  $(".snowreport-section .card:lt(" + currentIndex + ")").show();
  console.log(currentIndex);
  if (currentIndex >= 39) $("#btn-load-more").remove();
}

// ============= Journey =================
const planCoordinates = [];

// Push the first current location
navigator.geolocation.getCurrentPosition((position) => {
  planCoordinates.push({
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  });
});

// Push the current location each minute
setInterval(function () {
  navigator.geolocation.getCurrentPosition((position) => {
    planCoordinates.push({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  });
  initMap();
}, 10000);

// Initial map
function initMap() {
  navigator.geolocation.getCurrentPosition((position) => {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: { lat: position.coords.latitude, lng: position.coords.longitude },
      mapTypeId: "terrain",
    });
    const skiingPath = new google.maps.Polyline({
      path: planCoordinates,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 1,
    });
    skiingPath.setMap(map);
  });
}

// ========================= Amination search ==============================
function aminationSearch() {
  $("#search-container").addClass("animation-search");
}
