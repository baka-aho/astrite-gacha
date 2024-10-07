var f_reso_five_pity = 0;
var f_weap_five_pity = 0;
var s_weap_five_pity = 0;

fetch(chrome.runtime.getURL("./data.json"))
  .then((response) => {
    if (!response.ok) {
    }
    return response.json();
  })
  .then((json) => {
    f_reso_five_pity = json["featured-reso-pity"];
    f_weap_five_pity = json["featured-weap-pity"];
    s_weap_five_pity = json["standard-weap-pity"];
  })
  .catch((error) => {});

var f_reso_four_pity = f_reso_five_pity % 10;
var f_weap_four_pity = f_weap_five_pit % 10;
var s_weap_four_pity = s_weap_five_pit % 10;
