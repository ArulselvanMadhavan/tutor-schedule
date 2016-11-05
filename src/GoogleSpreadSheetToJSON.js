const GOOGLE_SPREADSHEET_PATH = "https://spreadsheets.google.com/feeds/cells/";
const GOOGLE_SPREADSHEET_FORMAT = "/public/values?alt=json";

function makeTitle(feedEntry) {
  let titles = [];
  for(let i = 0; i< feedEntry.length; i++){
    const obj = feedEntry[i];
    const cell = obj.gs$cell;
    if(!cell){
      return titles;
    }
    if(Number(cell.row) === 1){
      titles.push(cell.$t);
    } else {
      return titles;
    }
  }
  return titles;
}

function makeContents(feedEntry, titles) {
  let cell, columnCount, contents, j, len, obj, row, rowNumber;
  contents = [];
  if (!(feedEntry.length >= 1 && feedEntry[0].gs$cell)) {
    return contents;
  }
  columnCount = titles.length;
  rowNumber = 0;
  for (j = 0, len = feedEntry.length; j < len; j++) {
    obj = feedEntry[j];
    cell = obj.gs$cell;
    if (Number(cell.row) !== 1) {
      if (cell.row !== rowNumber) {
        rowNumber = cell.row;
        row = {};
      }
      row[titles[cell.col - 1]] = cell.$t;
      if (Number(cell.col) === columnCount) {
        contents.push(row);
        row = {};
      }
    }
  }
  return contents;
}

function googleSpreadSheetToJSON(url) {
  let xhr = new XMLHttpRequest()
  xhr.open("GET", url, false)
  xhr.send()
  let feeds = null;
  if(xhr.status === 200){
    feeds = JSON.parse(xhr.responseText);
  }
  let feedEntry = feeds.feed.entry;
  const titles = makeTitle(feedEntry);
  const contents = makeContents(feedEntry, titles);
  return contents;
}

function constructUrl(docId, wkId) {
  return GOOGLE_SPREADSHEET_PATH+docId+"/"+wkId+GOOGLE_SPREADSHEET_FORMAT;
}

function getDataFromGoogleSpreadSheet(docId, worksheets) {
  const worksheetIds = Object.keys(worksheets);
  let data = {};
  worksheetIds.forEach((wkname) => {
    const url = constructUrl(docId, worksheets[wkname]);
    const wkdata = googleSpreadSheetToJSON(url);
    data[wkname] = wkdata;
  });

  return data;
}

export default getDataFromGoogleSpreadSheet;
