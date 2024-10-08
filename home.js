function editR5Text(index, newText) {
  const elements = document.querySelectorAll(".text-3xl.text-r5");
  elements[index].innerHTML = newText;
}

function editR4Text(index, newText) {
  const elements = document.querySelectorAll(".text-3xl.text-r4");
  elements[index].innerHTML = newText;
}

function editSpanText(index, newText, className) {
  const elements = document.querySelectorAll(`${className}`);
  if (index >= 0 && index < elements.length) {
    const spanElement = elements[index];
    const textNode = spanElement.lastChild; // access the last child node, which should be the text node
    textNode.textContent = newText;
  } else {
    console.error(`Index ${index} is out of range`);
  }
}

function editConvenesWorthText(newText) {
  const elements = document.querySelectorAll(
    ".flex.h-fit.w-full.items-center.rounded-2xl.bg-item.p-6"
  );
  if (elements.length > 0) {
    const textNode = elements[0].lastChild; // access the last child node, which should be the text node
    textNode.textContent = newText;
  } else {
    console.error(`Element not found`);
  }
}

function getSpanText(index, className) {
  const elements = document.querySelectorAll(`${className}`);
  if (index >= 0 && index < elements.length) {
    const spanElement = elements[index];
    const textNode = spanElement.lastChild; // access the last child node, which should be the text node
    return textNode.textContent;
  } else {
    console.error(`Index ${index} is out of range`);
    return null;
  }
}

if (getSpanText(1, ".text-3xl") != 0) {
  var f_reso_five_pity = 10;
  var f_weap_five_pity = 9;
  var s_weap_five_pity = 37;

  var f_reso_four_pity = f_reso_five_pity % 10;
  var f_weap_four_pity = f_weap_five_pity % 10;
  var s_weap_four_pity = s_weap_five_pity % 10;

  editR5Text(0, f_reso_five_pity);
  editR5Text(1, f_weap_five_pity);
  editR5Text(3, s_weap_five_pity);

  editR4Text(0, f_reso_four_pity);
  editR4Text(1, f_weap_four_pity);
  editR4Text(3, s_weap_four_pity);

  fetch(
    "https://raw.githubusercontent.com/baka-aho/astrite-gacha/refs/heads/main/featured-resonator.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const characters = data.characters;
      var totalPullsReso = 0;

      characters.forEach((character) => {
        totalPullsReso += character.value;
      });
      totalPullsReso += f_reso_five_pity;

      const elements = document.querySelectorAll(".text-3xl");
      elements[1].innerHTML = totalPullsReso;

      editSpanText(
        0,
        totalPullsReso * 160,
        ".flex.items-center.text-neutral-400"
      );

      return totalPullsReso;
    })
    .then((totalPullsReso) => {
      fetch(
        "https://raw.githubusercontent.com/baka-aho/astrite-gacha/refs/heads/main/featured-weapon.json"
      )
        .then((response) => response.json())
        .then((data) => {
          const weapons = data.weapons;
          var totalPullsWeap = 0;

          weapons.forEach((weapon) => {
            totalPullsWeap += weapon.value;
          });
          totalPullsWeap += f_weap_five_pity;

          const elements = document.querySelectorAll(".text-3xl");
          elements[4].innerHTML = totalPullsWeap;

          editSpanText(
            1,
            totalPullsWeap * 160,
            ".flex.items-center.text-neutral-400"
          );

          const totalPullsOverall =
            totalPullsReso +
            totalPullsWeap +
            Number(getSpanText(13, ".text-3xl")) +
            Number(getSpanText(16, ".text-3xl")) +
            Number(getSpanText(7, ".text-3xl"));
          editConvenesWorthText(
            ` ${(totalPullsOverall * 160).toLocaleString()}`
          );
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
