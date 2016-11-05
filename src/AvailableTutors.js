import React from "react";
import logo from './logo.svg';
import TAEntry from "./TAEntry";
import InstructorEntry from "./InstructorEntry";
import SS from "./SpreadSheetConstants";

function availableTAs(sessions) {
  return (
    sessions.map((session) => {
      return (
        <div key={"available"+session[SS.DISPLAY_NAME]} className="availableTAMain">
          <div className="availableTACell">
            <img src={session[SS.IMAGE]} className="availableTAImage"/>
            <p>{session[SS.DISPLAY_NAME]}</p>
            <p>{session[SS.LOCATIONNAME]}</p>
            <p>{session[SS.ADD_INFO]}</p>
          </div>
        </div>
      )
    })
  )
}

function AvailableTutors(props) {
  const totalTAs = props.ta.length;
  const totalInst = props.inst.length;
  const taCells = availableTAs(props.ta.concat(props.inst));
  return (
    <div className="App-header">
      <h2>{taCells.length === 0 ? "No Tutors are available at this moment. Check the schedule below"
                                :"Currently Available"}
      </h2>
      <div className="availableTutorsTable">
        {taCells}
      </div>
    </div>
  );
}

AvailableTutors.propTypes = {
  ta: React.PropTypes.array.isRequired,
  inst:React.PropTypes.array.isRequired
}

export default AvailableTutors;

// <p className="App-intro">
//       To get started, edit <code>src/App.js</code> and save to reload.
//     </p>
