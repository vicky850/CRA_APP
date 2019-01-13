import React from "react";
import Joyride from "react-joyride";

export default function PageGuide() {
  return (
    <Joyride
      run={true}
      callback={() => null}
      steps={[
        {
            content:
              "This column has been configured to listen to an onDoubleClick event. When the cell is double clicked a message will be logged to the console",
            target: ".react-grid-Cell:nth-child(2) "
          },
          {
            content:
              "This column has been configured to listen to an onMouseOver event. When the cell is moused over, a message will be logged to the console",
            target: ".react-grid-Cell:nth-child(3) "
          },
          {
            content:
              "This column has been configured to listen to an onContextMeny event. When the cell is right clicked, a message will be logged to the console",
            target: ".react-grid-Cell:nth-child(4) "
          }
      ]}
    />
  );
}
