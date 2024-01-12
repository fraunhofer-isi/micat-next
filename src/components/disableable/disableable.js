// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import styles from './disableable.module.scss';

export default function Disableable (properties) {
  return properties.disabled
    ? <div className={styles.disabled} data-testid='disableable' disabled>
       {properties.children}
     </div>
    : <React.Fragment>{properties.children}</React.Fragment>;
}
