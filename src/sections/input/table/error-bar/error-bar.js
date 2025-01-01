// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import styles from './error-bar.module.scss';

export default function ErrorBar(properties) {
  const value = properties.value;
  const reset = properties.reset;
  const listener = React.useCallback(event => {
    if(event.key === 'Escape') {
      // console.log('Esc pressed');
      reset();
    }
  });

  const [errorMessage, setErrorMessage] = React.useState();

  React.useEffect(() => {
    if(value === undefined){
      // TO DO: currently does not work correctly; listener is still active
      document.removeEventListener('keyup', listener, true);
      setErrorMessage();
    } else {
      const errorMessage = 'Invalid value of ' + value + '. Press ESC to discard last change.';
      setErrorMessage(errorMessage);
      document.addEventListener('keyup', listener, true);
    }
  }, [value]);

  return <div
      className={styles['error-messages']}
    >
      {errorMessage}
    </div>;
}
