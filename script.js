const city = document.getElementById("text");
let inputedCity = "";

let image = document.querySelector(".img");
let saved = [];
if (localStorage.getItem("saved")) {
  saved = JSON.parse(localStorage.getItem("saved"));
}

city.addEventListener("change", (event) => {
  inputedCity = event.target.value.toLowerCase();
});

const apiKey = "2528bb449c83030b0b8168f0cf74654c";
const photoAccesKey = "41m_D6EA4_GETdyj7jvE1WTmXjUGuJPiJRwU4XVLMWg";

const button = document.querySelector(".button");
button.addEventListener("click", async () => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputedCity}&cnt=5&appid=${apiKey}&units=metric`;
  const photoUrl = `https://api.unsplash.com/search/photos?page=1&per_page=1&query=${inputedCity}&client_id=${photoAccesKey}`;

  try {
    let data = await fetch(url);
    data = await data.json();
    let photo = await fetch(photoUrl);
    photo = await photo.json();
    let backPhoto = photo.results[0].urls.full;
    console.log(data);
    const days = data.list;
    const city = data.city.name;
    let dataDay = days.map((day) => {
      return {
        day: getDay(day.dt),
        temp: Math.round(day.main.temp),
      };
    });
    saved.push({ data:dataDay, city, image:backPhoto });
    localStorage.setItem("saved", JSON.stringify(saved));
    chartFunc(dataDay, city, backPhoto);
  } catch (err) {
    console.log("there is an error" + err);
  }
});

const chartFunc = (data, city, image) => {
  const cont = document.querySelector(".container");
  var tempContainer = document.createElement("div");
  tempContainer.classList.add(
    "row",
    "d-flex",
    "justify-content-center",
    "align-items-center",
    "flex-lg-row",
    "flex-column",
    "mb-5"
  );
  tempContainer.innerHTML = `<div class="col-lg-6 col-12 mb-4 mb-lg-0">
                            <div class="img" style="background-image:url('${image}');"></div>
                          </div>
                          <div class="col-lg-6 col-12 d-flex justify-content-center align-items-center">
                            <canvas id="${city}" style='width:100%'></canvas>
                          </div>`;
  cont.appendChild(tempContainer);

  new Chart(document.getElementById(city), {
    type: "bar",
    data: {
      labels: data.map((row) => row.day),
      datasets: [
        {
          label: `Temperature in ${city}`,
          data: data.map((row) => row.temp),
        },
      ],
    },
  });
};
const getDay = (day) => {
  const timestamp = parseInt(day);
  const millisec = timestamp * 1000;
  const date = new Date(millisec);
  const dayOfMonth = date.getDate();
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  const year = date.getFullYear();
  const fullDate = `${dayOfMonth}.${month}.${year}`;
  return fullDate;
};
if (saved.length > 0) {
  saved.forEach((element) => {
    chartFunc(element.data, element.city, element.image);
  });
}
