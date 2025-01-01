// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import styles from './accordion.module.scss';
import { CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';

export default function Accordion(properties) {
  const title = properties.title || '';
  const [isUnfolded, setIsUnfolded] = React.useState(
    properties.initiallyUnfolded
  );

  React.useEffect(() => {
    if (properties.unfolded !== undefined && properties.unfolded !== isUnfolded) {
      setIsUnfolded(properties.unfolded);
    }
  }, [properties.unfolded]);

  return (
    <div className={styles['accordion-container']}>
      <div
        className={styles['accordion-header']}
        onClick={() => setIsUnfolded(!isUnfolded)}
      >
        <div>{title}</div>
        <div>{isUnfolded ? <CaretUpFill /> : <CaretDownFill />}</div>
      </div>
      {/* <div className={styles['accordion-content']} aria-expanded={isUnfolded}>
        {<React.Fragment>{properties.children}</React.Fragment>}
      </div> */}
      {isUnfolded && (
        <div className={styles['accordion-content']} aria-expanded={isUnfolded}>
          <React.Fragment>{properties.children}</React.Fragment>
        </div>
      )}
    </div>
  );
}
