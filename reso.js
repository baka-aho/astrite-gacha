var currentPity = 5;
let totalPulls = 0;

const container = document.querySelector(".my-2.flex.flex-row.flex-wrap.gap-2");
// Clear the initial list
container.innerHTML = "";

fetch(
  "https://raw.githubusercontent.com/baka-aho/astrite-gacha/refs/heads/main/resonator.json"
)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const characters = data.characters;
    const images = data.images;

    // Initialize total pulls
    characters.forEach((character) => {
      totalPulls += character.value;

      var fourStars = Math.ceil((totalPulls + currentPity) / 10 + 13);
      var fiveStars = characters.length;

      // Function to update the cell based on the label and new value
      const updateCell = (label, newValue, index = 0) => {
        const cells = Array.from(
          document.querySelectorAll("tbody tr td")
        ).filter((td) => td.textContent.includes(label));
        if (cells.length > index) {
          cells[index].nextElementSibling.innerText = newValue; // Update the next <td>
        }
      };

      // Update the stats data in the table
      updateCell("Total Pulls", totalPulls + currentPity);
      updateCell("5✦ Pulls", fiveStars);
      updateCell("4✦ Pulls", fourStars);
      updateCell("└ Character", fourStars - 24);
      updateCell("└ Weapon", 24);
      updateCell("50:50 Attempts", 10);
      updateCell("└ Wins", 5);
      updateCell("50:50 Attempts", 31, 1); // Update the second 50:50 Attempts
      updateCell("└ Wins", 14, 1); // Update the second └ Wins

      // Create character div
      const characterDiv = document.createElement("div");
      characterDiv.className =
        "flex items-center gap-x-2 rounded-lg px-1 pl-0 text-lg transition-transform hover:scale-110 bg-neutral-100/20";

      // Create image container and image
      const img = document.createElement("img");
      img.alt = character.name;
      img.loading = "lazy";
      img.src = images[character.name.toLowerCase()];
      img.style.color = "transparent";
      img.className = "mr-.5 h-8 rounded-bl-lg";

      characterDiv.appendChild(img);

      // Create character name and value
      const nameSpan = document.createElement("span");
      nameSpan.textContent = character.name;

      const valueSpan = document.createElement("span");
      valueSpan.className = "ml-1 font-bold";

      if (character.value < 60 && character.value > 39) {
        valueSpan.className += " text-r4";
      } else if (character.value > 59) {
        valueSpan.className += " text-destructive";
      } else {
        valueSpan.className += " text-success";
      }

      valueSpan.textContent = character.value;

      characterDiv.appendChild(nameSpan);
      characterDiv.appendChild(valueSpan);

      container.appendChild(characterDiv);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
