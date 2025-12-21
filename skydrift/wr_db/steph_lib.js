// Global var
const data = {};
const characters = {};
const tracks = {};
const uiTextLabels = [
  "main_header_display_settings",
  "main_header_language",
  "main_header_date_format",
  "main_header_time_format",
  "main_header_chara_display_mode",
  "main_header_leaderboard_filters",
  "main_header_mode",
  "main_header_track",
  "main_header_category",
  "main_header_board",
  "main_header_rider",
  "select_all_tracks",
  "select_all_characters",
  "main_header_video_status",
  "main_header_video_type",
  "main_header_replay_file",
  "main_wr_table_track_version",
  "main_wr_table_track",
  "main_wr_table_category",
  "main_wr_table_date",
  "main_wr_table_player",
  "main_wr_table_time",
  "main_wr_table_board",
  "main_wr_table_rider",
  "main_wr_table_video",
  "main_wr_table_replay",
  "main_wr_table_note",
  "main_header_wr_table",
  "main_title",
  "main_subtitle",
  "main_version_nb",
  "main_last_update",
  "main_nb_records_identified"
]
const trackPath = {
  1:"MariCircuit1",
  2:"ForestOfMagic",
  3:"HumanVillage",
  4:"ScarletDevilMansion",
  5:"LostBambooThicket",
  6:"YoukaiMountain",
  7:"Seirensen",
  8:"Hakugyokuro",
  9:"EmbersOfBlazingHell",
  10:"MistyLake",
  11:"OldCapital",
  12:"MariCircuit2",
  13:"TheOutsideWorld",
  14:"VoileLibrary",
  15:"SeaOfTranquility",
  16:"MoonlitThicket",
  17:"UnderworldCityDepths",
  18:"RedevelopmentAreaA",
  19:"RedevelopmentAreaB",
  20:"Heaven",
  21:"CirnoCircuit"
}
const uiTexts = {};
for (let ii=0; ii < uiTextLabels.length; ii++) {
  uiTexts[uiTextLabels[ii]] = {};
}
// Wait for page to lad before doing anything
if (document.readyState !== 'loading') {
  ready()
} else {
  document.addEventListener('DOMContentLoaded', ready)
}

// When page is loaded, load JSON files then executes main function
function ready(){
  // Remove JS necessary warning
  document.querySelector("#js-required-warning").remove();
  
  let list = [];
  let jsonList = ["characters.json", "tracks.json", "lang_ui.json", "WR_record.json", "WR_no_day_dupe.json", "WR_no_player_dupe.json"];
  jsonList.forEach(file => {
    list.push(
      fetch(file).then(response => response.json()).then(fileData => {
        switch (file) {
          case "characters.json":
            fileData[0].rows.forEach(chara => {
                characters[chara[0]] = {};
                for (let ii = 0; ii < chara.length; ii++){
                    characters[chara[0]][fileData[0].header[ii]] = chara[ii];
                };
            })
            break;
          case "tracks.json":
            fileData[0].rows.forEach(track => {
                tracks[track[0]] = {};
                for (let ii = 0; ii < track.length; ii++){
                    tracks[track[0]][fileData[0].header[ii]] = track[ii];
                };
            })
            break;
          case "lang_ui.json":
            Object.keys(fileData).forEach(lang => {
                Object.keys(fileData[lang]).forEach(key => {
                    uiTexts[key][lang] = fileData[lang][key]
                })
            })
            break;
          default:
            data[file.replace(/^WR_/, "").replace(/\.json$/, "")] = fileData[0];
            break;
        }
      })
    );
  });

  // Wait for all JSON to load before launching main function
  Promise
    .all(list).then(function() {
      mainScript();
    });
}

function mainScript() {
    const mainTableBody = document.querySelector("#wr-runs tbody");
    const nbRecords = document.querySelector("#nb-runs-found");
    const lastDataUpdate = document.querySelector("#last-data-udpate");
    const timeRegexp = /(\d+):(\d+)\.(\d+)/;
    const dateRegexp = /(~?)(.{4})-(.{2})-(.{2})/;

    // Funciton definition
    function getLangUi() {
      return document.querySelector("#fs-language").value
    }
    function getLangData() {
      let lang = getLangUi();
      if (lang === "fre") {
        return "en"
      }
      return lang
    }
    function getDateFormat() {
      return document.querySelector("#fs-date-format").value
    }
    function getTimeFormat() {
      return document.querySelector("#fs-time-format").value
    }
    function getCharaDisplaymode() {
      return document.querySelector("#fs-chara-display-mode").value
    }
    function getMode() {
      return document.querySelector("#fs-mode").value
    }
    function headerNameToIndex(name) {
      return data[getMode()].header.indexOf(name)
    };
    function getRowCellByName(row, name) {
      return row[headerNameToIndex(name)]
    };
    function filterRowsByProperty(propertyName, propertyValue) {
        let output = [];
        data[getMode()].rows.forEach(row => {
            if (getRowCellByName(row, propertyName) == propertyValue) {
              output.push(row)
            }
        })
        return output
    };
    function filterRowsByProperties(
            videoStatus=null,
            videoType=null,
            replayFile=null,
            track=null,
            category=null,
            board=null,
            rider=null
          ) {
        // Nullify variable when filter is setto all
        if (videoStatus==="ALL"){videoStatus=null;}
        if (videoType==="ALL"){videoType=null;}
        if (replayFile==="ALL"){replayFile=null;}
        if (track==="ALL"){track=null;}
        if (category==="ALL"){category=null;}
        if (board==="ALL"){board=null;}
        if (rider==="ALL"){rider=null;}
        let output = [];
        // For eahc row, if the filter is not null, use the value to filter data
        data[getMode()].rows.forEach(row => {
            if (
              (videoStatus === null || getRowCellByName(row, "runs.video_status") == videoStatus)
              && (videoType === null || getRowCellByName(row, "runs.video_type") == videoType)
              && (replayFile === null || getRowCellByName(row, "runs.replay_file") == replayFile)
              && (track === null || getRowCellByName(row, "runs.track") == track)
              && (category === null || getRowCellByName(row, "runs.category") == category)
              && (board === null || getRowCellByName(row, "runs.board") == board)
              && (rider === null || getRowCellByName(row, "runs.rider") == rider)
            ) {
              output.push(row)
            }
        })
        return output
    };

    function updateMainTable() {
      // Empty current data
      mainTableBody.innerHTML = "";
      let filteredRows = filterRowsByProperties(
        videoStatus=document.querySelector("#fs-video-status").value,
        videoType=document.querySelector("#fs-video-type").value,
        replayFile=document.querySelector("#fs-replay-file").value,
        track=document.querySelector("#fs-track").value,
        category=document.querySelector("#fs-category").value,
        board=document.querySelector("#fs-board").value,
        rider=document.querySelector("#fs-rider").value
      )
      // Don't need sorting because SQL export does it
      // Add filtered rows to the table
      filteredRows.forEach(row => {generateRunRow(row)})
      // Update number of runs found
      nbRecords.innerText = filteredRows.length;
      
    }

    function generateRunRow(row) {
      let lang = getLangData();
      let elem = document.createElement("tr");
      let trackVersionElem = document.createElement("td");
      trackVersionElem.innerText = getRowCellByName(row, "track_versions.name");
      elem.appendChild(trackVersionElem);
      let trackElem = document.createElement("td");
      trackElem.innerText = capitalizeTracks(getRowCellByName(row, "tracks.name_" + lang));
      trackElem.dataset.id = getRowCellByName(row, "runs.track");
      elem.appendChild(trackElem);
      let categoryElem = document.createElement("td");
      let tempCategory = getRowCellByName(row, "runs.category");
      categoryElem.innerText = UIcategoryText(tempCategory);
      categoryElem.dataset.category = tempCategory;
      elem.appendChild(categoryElem);
      let dateElem = document.createElement("td");
      dateElem.innerText = UIdateText(getRowCellByName(row, "runs.date_str"));
      elem.appendChild(dateElem);
      let playerElem = document.createElement("td");
      playerElem.innerText = getRowCellByName(row, "runs.player");
      elem.appendChild(playerElem);
      let timeElem = document.createElement("td");
      timeElem.innerText = UItimeText(getRowCellByName(row, "runs.time"));
      elem.appendChild(timeElem);
      let boardElem = document.createElement("td");
      boardElem.innerHTML = UIcharaText(row, "board");
      elem.appendChild(boardElem);
      let riderElem = document.createElement("td");
      riderElem.innerHTML = UIcharaText(row, "rider");
      elem.appendChild(riderElem);
      let videoElem = document.createElement("td");
      let tempVideoStatus = getRowCellByName(row, "runs.video_status");
      videoElem.dataset.videoStatus = tempVideoStatus;
      if (tempVideoStatus === "None") {
        videoElem.innerText = "None";
      } else {
        let videoLink = document.createElement("a");
        videoLink.href = getRowCellByName(row, "runs.video_url");
        videoLink.innerHTML = tempVideoStatus + "<br/>(" + getRowCellByName(row, "runs.video_type") + ")";
        videoElem.appendChild(videoLink);
      }
      elem.appendChild(videoElem);
      let replayFileElem = document.createElement("td");
      replayFileElem.innerHTML = UIreplayFileText(row);
      replayFileElem.dataset.replayFile = getRowCellByName(row, "runs.replay_file");
      elem.appendChild(replayFileElem);
      let noteElem = document.createElement("td");
      noteElem.innerText = UInoteText(getRowCellByName(row, "runs.note"));
      elem.appendChild(noteElem);
      // Append the row to main table
      mainTableBody.appendChild(elem);
    }

    // ----- UI text transformation -----
    function capitalizeTracks(text) {
      let output = [];
      text.split(" ").forEach(substr => {
        if (substr.toUpperCase() === "OF"){
            output.push("of");
            return;
        }
        if (substr.indexOf("-") > -1) {
          let temp = [];
          substr.split("-").forEach(subsubstr => {
            temp.push(subsubstr.charAt(0).toUpperCase() + subsubstr.substring(1).toLowerCase());
          })
          output.push(temp.join("-"));
        } else {
          output.push(substr.charAt(0).toUpperCase() + substr.substring(1).toLowerCase());
        }
      })
      return output.join(" ")
    }
    function UIcategoryText(value) {
      if (value === "OoB"){
        return "Out of bounds"
      }
      return value
    }
    function UIdateText(value) {
      let arr = dateRegexp.exec(value);
      if (arr === null) {
        return value
      }
      return arr[1] + getDateFormat().replace(/y+/, arr[2]).replace(/m+/, arr[3]).replace(/d+/, arr[4]);
    }
    function UItimeText(value) {
      let arr = timeRegexp.exec(value);
      return getTimeFormat().replace("QUOTE", '"').replace(/m+/, arr[1]).replace(/s+/, arr[2]).replace(/0{3}$/, arr[3])
    }
    function UIcharaText(row, type) {
      // type : "board" or "rider"
      switch (getCharaDisplaymode()){
        case "short":
          return getRowCellByName(row, "characters." + type + ".name")
        case "full":
          return getRowCellByName(row, "characters." + type + ".name_" + getLangData())
        case "icon":
          return "<span class='chara-icon chara-" + getRowCellByName(row, "runs." + type) +"'><span class='hidden'>" + getRowCellByName(row, "characters." + type + ".name") + "</span></span>"
      }
    }
    function UIreplayFileText(row) {
      if (getRowCellByName(row, "runs.replay_file") === "1") {
        return `<a href="replay_files/${trackPath[getRowCellByName(row, "runs.track")]}/${getRowCellByName(row, "runs.player")}_${getRowCellByName(row, "runs.time").replace(/[:|\.]/g, "_")}.dat">Yes</a>`;
      }
      return "No"
    }
    function UInoteText(value) {
      if (value === "NULL") {
        return ""
      }
      return value
    }
    function UIlastDataUpdateText() {
      if (lastDataUpdate.dataset["date"] === lastDataUpdate.innerText) {
        lastDataUpdate.innerText = UIdateText(lastDataUpdate.dataset["date"]);
      } else {
        lastDataUpdate.innerHTML = lastDataUpdate.dataset["date"] + "<br/>(might be wrong, dates are incoherent)"
      }
    }
    function UIupdateUIlang() {
      let lang = getLangUi();
      let langData = getLangData();
      // Update text stuff
      for (let ii=0; ii < uiTextLabels.length; ii++) {
        document.getElementById(uiTextLabels[ii]).innerText = uiTexts[uiTextLabels[ii]][lang];
        if (uiTextLabels[ii] === "select_all_characters") {
          document.getElementById("select_all_characters2").innerText = uiTexts[uiTextLabels[ii]][lang];
        }
      }
      // Update track names
      document.querySelectorAll("#fs-track option").forEach(opt => {
          if(opt.value === "ALL"){return}
          opt.innerText = capitalizeTracks(tracks[opt.value]["name_" + langData]);
      })
      // Update character names
      document.querySelectorAll("#fs-board option, #fs-rider option").forEach(opt => {
          if(opt.value === "ALL"){return}
          switch (getCharaDisplaymode()){
            case "full":
              opt.innerText = characters[opt.value]["name_" + langData];
              break;
            default:
              opt.innerText = characters[opt.value]["name"];
              break;
          }
      })
    }

    // Actual stuff done on load
    document.querySelectorAll("#filter-settings select").forEach(select => {
      select.addEventListener("change", updateMainTable, false);
    });
    updateMainTable();
    document.querySelector("#fs-date-format").addEventListener("change", UIlastDataUpdateText, false);
    UIlastDataUpdateText();
    document.querySelector("#fs-language").addEventListener("change", UIupdateUIlang, false);
    document.querySelector("#fs-chara-display-mode").addEventListener("change", UIupdateUIlang, false);
    UIupdateUIlang();
}