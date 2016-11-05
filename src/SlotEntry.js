import React from 'react';

const COLSPAN = 1;
const ALIGNMENT = "center";
function SlotEntry(props) {
  return (
    <td className="slotEntry">
      <table>
        <tbody>
          <tr>
            <td className="slotStart">{props.start}</td>
          </tr>
          <tr>
            <td className="slotTo"> to </td>
          </tr>
          <tr>
            <td className="slotEnd">{props.end}</td>
          </tr>
        </tbody>
      </table>
    </td>
  )
}

SlotEntry.propTypes = {
  start: React.PropTypes.string.isRequired,
  end: React.PropTypes.string.isRequired
}

export default SlotEntry;
