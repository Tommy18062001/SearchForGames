const searchBtn = document.getElementById("search");
const url = "https://api.igdb.com/v4/"
const fields = "fields=name, genres.name, category, cover.image_id, release_dates.human, platforms.name, rating, url";

function mainRequest(value, field) {
  var myHeaders = new Headers();
  myHeaders.append("Client-ID", "0ftp8xskn83kccb5b1b6dws323stq1");
  myHeaders.append("Authorization", "Bearer m8zrqpddyoc2gcn9hcyimbe5p4iqr1");

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
  };


  fetch(`https://cors-anywhere.herokuapp.com/${url}games?search=${value}&${field};limit=30;`, requestOptions)
  .then(response => response.json())
  .then(result =>{
    // this is our data
    console.log(result);
    result.forEach(element => {
      console.log(element);
      displayGame(element);
    });
  })

  .catch(error => console.log('error', error));
}

function displayGame(gameData) {
  const container = document.createElement("div");
  const img = document.createElement("img");
  const linkImg = document.createElement("a");
  const ourSection = document.createElement("section");
  const title = document.createElement("a");
  const genre = document.createElement("p");
  const platform = document.createElement("p");
  const release = document.createElement("p");
  const rating = document.createElement("p");

  // create a direct link for each game
  // const link = document.createElement("a");
  title.setAttribute("href", gameData.url);
  title.setAttribute("target", "_blank");
  linkImg.setAttribute("href", gameData.url);
  linkImg.setAttribute("target", "_blank");
  linkImg.classList.add("img-effect");

  container.classList.add("game");

  if (gameData.cover) {
    img.setAttribute("src", `https://images.igdb.com/igdb/image/upload/t_cover_big/${gameData.cover.image_id}.png`)
    img.setAttribute("alt", "cover")
  }
  else {
    img.setAttribute("src", `https://images.igdb.com/igdb/image/upload/t_cover_big/undefined.png`)
    img.setAttribute("alt", "cover")
  }
  
  title.textContent = gameData.name;
  
  // game genres
  if (gameData.genres) {
    const genreList = []
    gameData.genres.forEach(element => {
      genreList.push(element.name);
    });
    genre.textContent = "Genre: " + genreList.join(", ");
  }
  else {genre.textContent = "Genre: N/A"};

  // Platforms
  if (gameData.platforms) {
    const platformList = []
    gameData.platforms.forEach(element => {
      platformList.push(element.name);
    });
    platform.textContent = "Platforms: " + platformList.join(", ");
  }
  else {platform.textContent = "Platforms: N/A"};

  // release date 
  if (gameData.release_dates) {
    release.textContent = "Release date: " + gameData.release_dates[0].human;
  }
  else {release.textContent = "Release date: N/A"};

  // game rating 
  if (gameData.rating) {
    if (parseInt(gameData.rating) >= 70) {
      rating.classList.add("high-rating");
    }
    else if (parseInt(gameData.rating) >= 50) {
      rating.classList.add("medium-rating");
    }
    else {
      rating.classList.add("low-rating");
    }

    rating.textContent = "Rating: " + parseInt(gameData.rating);
  }

  else {
    rating.classList.add("unknown-rating");
    rating.textContent = "Rating: N/A";
  }
  
  ourSection.appendChild(title);
  ourSection.appendChild(genre);
  ourSection.appendChild(platform);
  ourSection.appendChild(release);
  ourSection.appendChild(rating);

  linkImg.appendChild(img);

  container.appendChild(linkImg);
  container.appendChild(ourSection);
  
  document.querySelector(".results").appendChild(container);
}

function clearResults(result) {
    while (result.firstChild) {
      result.removeChild(result.firstChild);
    }
};

// this will check if the user already serched something before
if (localStorage.getItem("search") != "") {
  mainRequest(localStorage.getItem("search"), fields)
} 

searchBtn.addEventListener("click", () => {
  // clear the results 
  clearResults(document.querySelector(".results"));

  const searchInput = document.querySelector("input[type='search'");

  localStorage.setItem("search", searchInput.value);
  
  mainRequest(searchInput.value, fields)
})
