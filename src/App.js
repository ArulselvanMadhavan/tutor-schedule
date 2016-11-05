import React, { Component } from 'react';
import './App.css';
// import {Table, Tr, Thead, Td, Th} from "reactable";
import SS from "./SpreadSheetConstants";
import data from "./data";
import moment from "moment";
import SlotEntry from "./SlotEntry.js";
import TAEntry from "./TAEntry.js";
import ScheduleEntry from "./ScheduleEntry";
import AvailableTutors from "./AvailableTutors";
import GoogleSpreadSheetParser from "./GoogleSpreadSheetToJSON";

const SLOT_TITLE = "Slots";
/**
 * IMPORTANT: Timing convention followed throughout this program
 * is hh:mm AM/PM
 * Example: 08:00 AM (Note the space and the zeros)
 * [OFFICE_HOUR_START description]
 * @type {String}
 */
const TIMESTRING_FORMAT = "LT"; //Moment js notation for hh:mm AM/PM
const OFFICE_HOUR_START = "08:00 AM";
const OFFICE_HOUR_END = "09:30 PM";
const MIN_TIME_SLOT_DURATION = "30"; //minutes
const DATA_DISPLAY_NAME = "display_name";
const DATA_INSTRUCTOR = "instructor";
const GOOGLE_SPREADSHEET_ID = "1or82wlxmGIIFchRlKuibYigtFr9vDLXxQCY8k8LxGME";
// The below IDS are used for column index.
// 0 is reserved for slots.
// These IDs also match the worksheet id in the google spreasheet.
// DO NOT CHANGE.
const DAYS_TO_ID = {
  "Monday":1,
  "Tuesday":2,
  "Wednesday": 3,
  "Thursday": 4,
  "Friday": 5,
  "Saturday": 6
}; //First Letter capitalized.
const TA_COLSPAN = 2;
const INST_COLSPAN = 1;
const INST_COLOR = "#FF69B4";
const ALIGNMENT = "center";
const TABLE_TA_KEY = "ta";
const TABLE_INST_KEY = "professor";
const PUBLISHED_URL = "https://docs.google.com/spreadsheets/d/1or82wlxmGIIFchRlKuibYigtFr9vDLXxQCY8k8LxGME/pubhtml";

class App extends Component {
  constructor(props) {
    super(props);
    this.days = GoogleSpreadSheetParser(GOOGLE_SPREADSHEET_ID, DAYS_TO_ID);
    this.timeslots = data["timeslots"];
    this.cols = [SLOT_TITLE, ...Object.keys(this.days)];
    const results = this.generateTimeSlots(OFFICE_HOUR_START, OFFICE_HOUR_END);
    this.slotToId = results["slotToId"];
    this.idToSlot = results["idToSlot"];
    this.table = this.createTable([Object.keys(this.idToSlot).length, this.cols.length]);
  }

  componentWillMount() {
    console.log("Fetch data here? Not sure.");
  }

  createTable(dimensions) {
    let array = [];
    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length === 1 ? {[TABLE_TA_KEY]:[],[TABLE_INST_KEY]:[]}
           : this.createTable(dimensions.slice(1)));
    }
    return array;
  }

  get_column_heads() {
    return (
      this.cols.map((col) => {
          return <th key={col} className="headCell"> {col} </th>;
      })
    );
  }

  get_table_head() {
    return (
      <thead className="scheduleHead">
        <tr className="headRow">
          {this.get_column_heads()}
        </tr>
      </thead>
    )
  }

  /**
   * time in hh:mm am/pm format.
   */
  generateTimeSlots(startStr, endStr) {
    const start = moment(startStr, TIMESTRING_FORMAT);
    const end = moment(endStr, TIMESTRING_FORMAT);
    start.minutes(Math.ceil(start.minutes() / MIN_TIME_SLOT_DURATION) * MIN_TIME_SLOT_DURATION);
    let slotToId = {};
    let idToSlot = {}
    let current = moment(start);
    let id = 0;
    while(current < end) {
      const formattedTimeStr = current.format(TIMESTRING_FORMAT)
      slotToId[formattedTimeStr] = id;
      idToSlot[id] = formattedTimeStr;
      id += 1;
      current.add(MIN_TIME_SLOT_DURATION, "minutes");
    }
    return {
      slotToId,
      idToSlot
    };
  }

  countTimeSlots(startStr, endStr) {
    const start = moment(startStr, TIMESTRING_FORMAT);
    const end = moment(endStr, TIMESTRING_FORMAT);
    start.minutes(Math.ceil(start.minutes() / MIN_TIME_SLOT_DURATION) * MIN_TIME_SLOT_DURATION);
    let current = moment(start);
    let count = 0;
    while(current < end) {
      current.add(MIN_TIME_SLOT_DURATION, "minutes");
      count += 1;
    }
    return count;
  }

  getNextSlot(start) {
    let current = moment(start, TIMESTRING_FORMAT);
    current.add(MIN_TIME_SLOT_DURATION, "minutes");
    return current.format(TIMESTRING_FORMAT);
  }

  getFormattedTime(timeAsString) {
    const time_obj = moment(timeAsString, TIMESTRING_FORMAT);
    return time_obj.format(TIMESTRING_FORMAT);
  }

  getRowIdFromTime(timeAsStr) {
    //Regardless of how the user inputs time format it to the standard form.
    const formattedTime = this.getFormattedTime(timeAsStr);
    const rowId = this.slotToId[formattedTime];
    if(Number.isInteger(rowId) && rowId >= 0)
      return rowId
    else
      console.error("Invalid Slot time", timeAsStr);
      //TODO: Get the nearest slot time and return its rowId
  }

  addSlotsToTable(slots, day, session) {
    slots.map((slot) => {
      const rowId = this.getRowIdFromTime(slot);
      const colId = DAYS_TO_ID[day];
      const tutorName = session[SS.DISPLAY_NAME];
      let tutorType = TABLE_TA_KEY;
      if(session[SS.TUTOR_TYPE].toLowerCase() === TABLE_INST_KEY)
        tutorType = TABLE_INST_KEY;
      this.table[rowId][colId][tutorType].push({
        ...session
      });
    });
  }

  parseScheduleForDay(day) {
    const allEntries = this.days[day];
    allEntries.forEach((session, index) => {
      const start = session[SS.STARTTIME];
      const end = session[SS.ENDTIME];
      const slotsToId = this.generateTimeSlots(start, end)["slotToId"];
      this.addSlotsToTable(Object.keys(slotsToId), day, session);
    });
  }

  parseSchedule() {
    const days = Object.keys(this.days);
    days.map((day) => {
      this.parseScheduleForDay(day);
    });
  }

  getSessionEntry(entry, rowId, colIndex) {
    const availableTAs = entry[TABLE_TA_KEY].length;
    const availableInst = entry[TABLE_INST_KEY].length;
    if(availableTAs === 0 && availableInst === 0) {
      return <td key={"empty"+rowId+colIndex}></td>;
    } else {
      return <ScheduleEntry key={"ScheduleEntry"+rowId+colIndex}
                            ta={entry[TABLE_TA_KEY]}
                            inst={entry[TABLE_INST_KEY]} />
    }
  }

  buildRow(rowId, row) {
    return (
      row.map((tutors, colIndex) => {
        if(colIndex === 0){
          const start = this.idToSlot[rowId];
          const end = this.getNextSlot(start);
          return <SlotEntry key={"slot"+rowId+""+colIndex} start={start} end={end}/>
        } else {
          return this.getSessionEntry(tutors, rowId, colIndex);
        }
      })
    )
  }

  buildRows() {
    return this.table.map((row, rowId) => {
      return (
        <tr key={rowId}>
          {this.buildRow(rowId, row)}
        </tr>
      )
    });
  }

  getCurrentTutors() {
    const currentTime = moment();
    currentTime.startOf("hour");
    currentTime.add(MIN_TIME_SLOT_DURATION, "minutes");
    let slotId;
    if(moment() > currentTime) {
      slotId = currentTime.format(TIMESTRING_FORMAT);
    } else {
      currentTime.startOf("hour");
      slotId = currentTime.format(TIMESTRING_FORMAT);
    }
    // currentTime.subtract(MIN_TIME_SLOT_DURATION, "minutes");
    // const slotId = currentTime.format(TIMESTRING_FORMAT);
    const rowId = this.slotToId[slotId];
    const day = currentTime.format("dddd");
    const colId = DAYS_TO_ID[day];
    let allTutors = {[TABLE_TA_KEY]:[],[TABLE_INST_KEY]:[]};
    if(rowId)
      allTutors = this.table[rowId][colId];
    return allTutors;
  }

  render() {
    this.parseSchedule();
    const currentTutors = this.getCurrentTutors();
    return (
      <div className="App">
        <AvailableTutors
          ta={currentTutors[TABLE_TA_KEY]}
          inst={currentTutors[TABLE_INST_KEY]}
        />
        <table className="scheduleMain">
          {this.get_table_head(this.cols)}
          <tbody className="scheduleBody">
            {this.buildRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;

//TODO write tests for formatted Strings.
//TODO werite tests for all possible user inputs.
