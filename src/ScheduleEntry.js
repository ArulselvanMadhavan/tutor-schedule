import React from "react";
import TAEntryWrapper from "./TAEntryWrapper";
import InstructorEntryWrapper from "./InstructorWrapper";

function ScheduleEntry(props) {
  return (
    <td className="scheduleCell">
      <table className="schedule">
        <tbody>
          <tr>
            <TAEntryWrapper ta={props.ta} />
            <InstructorEntryWrapper inst={props.inst} />
          </tr>
        </tbody>
      </table>
    </td>
  )
}

ScheduleEntry.propTypes = {
  ta: React.PropTypes.array.isRequired,
  inst: React.PropTypes.array.isRequired
}

export default ScheduleEntry;
