import React from "react";
import InstructorEntry from "./InstructorEntry";
import SS from "./SpreadSheetConstants";

function buildRows(sessions) {
  return (
    sessions.map((session, index) => {
      const instName = session[SS.DISPLAY_NAME];
      const instLocation = session[SS.LOCATIONNAME];
      return (
        <tr key={instName+""+index}>
          <InstructorEntry key={"inst"+index}
                   name={instName}
                   location={instLocation} />
        </tr>
      )
    })
  );
}

function InstructorEntryWrapper(props) {
  const rows = buildRows(props.inst);
  return (
    <td>
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    </td>
  )
}

InstructorEntryWrapper.propTypes = {
  inst: React.PropTypes.array.isRequired
}

export default InstructorEntryWrapper;
