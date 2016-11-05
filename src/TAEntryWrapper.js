import React from "react";
import TAEntry from "./TAEntry";
import SS from "./SpreadSheetConstants";

function buildRows(sessions) {

  return (
    sessions.map((session, index) => {
      const taName = session[SS.DISPLAY_NAME];
      const taLocation = session[SS.LOCATIONNAME];
      return (
        <tr key={taName+""+index}>
          <TAEntry key={"ta"+index}
                   name={taName}
                   location={taLocation} />
        </tr>
      )
    })
  );
}

function TAEntryWrapper(props) {
  const rows = buildRows(props.ta);
  return (
    <td className="taEntries">
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    </td>
  )
}

TAEntryWrapper.propTypes = {
  ta: React.PropTypes.array.isRequired
}

export default TAEntryWrapper;
