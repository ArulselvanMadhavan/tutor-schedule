import React from 'react';

function TAEntry(props) {
  return (
    <td className="taEntry">
      <table>
        <thead>
          <tr className="taHead">
            <td className="taName">
              {props.name}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className = "taLocation">
              {props.location}
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  )
}

TAEntry.propTypes = {
  name: React.PropTypes.string.isRequired,
  location: React.PropTypes.string.isRequired
}

export default TAEntry;
