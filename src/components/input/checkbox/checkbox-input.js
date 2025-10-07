// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import styles from './checkbox-input.module.scss';

export default function CheckboxInput(properties) {
  const change = properties.change;
  const initialValue = properties.initialValue || false;
  const [checked, setChecked] = React.useState(initialValue);
  let label = <></>;
  if (properties.label) {
    label = (
      <label
        htmlFor="checkbox-input"
        className={styles['checkbox-input-label']}
      >
        {properties.label}
      </label>
    );
  }
  let endLabel = <></>;
  if (properties.endLabel) {
    endLabel = (
      <div className={styles['checkbox-input-endlabel']}>
        {properties.endLabel}
      </div>
    );
  }
  return (
    <div className={styles['checkbox-input-container']}>
      { label }
      <input
        type="checkbox"
        name="checkbox-input"
        value={checked}
        className={styles['checkbox-input-field']}
        onChange={event =>
          _CheckboxInput.checkboxInputChanged(
            event,
            setChecked,
            change
          )
        }
      />
      { endLabel }
    </div>
  );
}

export class _CheckboxInput {
  static checkboxInputChanged(event, setChecked, change) {
    const value = event.target.checked;
    setChecked(value);
    if(change) {
      change(value);
    }
  }
}
