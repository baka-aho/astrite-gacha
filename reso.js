var currentPity = 5;
let totalPulls = 0;

fetch(
  "https://raw.githubusercontent.com/baka-aho/wuwa-gacha/refs/heads/main/resonator.json"
)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const characters = data.characters;

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
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
