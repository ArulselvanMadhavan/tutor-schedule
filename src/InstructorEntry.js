import React from 'react';

function InstructorEntry(props) {
  return (
    <td className="instEntry">
      <table>
        <thead>
          <tr className="instHead">
            <td className="instName">
              {props.name}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="instLocation">
              {props.location}
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  )
}

InstructorEntry.propTypes = {
  name: React.PropTypes.string.isRequired,
  location: React.PropTypes.string.isRequired
}

export default InstructorEntry;
