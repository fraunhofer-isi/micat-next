// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import styles from './number-input.module.css';

export default function NumberInput(properties) {
  const change = properties.change;
  const initialValue = properties.initialValue || 0;
  const minimumValue = properties.minimumValue;
  const maximumValue = properties.maximumValue;
  const step = properties.step || 0.1;
  const [value, setValue] = React.useState(initialValue);
  const [number, setNumber] = React.useState(Number(initialValue));
  React.useEffect(() => {
    change(number);
  }, [number]);
  let label = <></>;
  if (properties.label) {
    label = (
      <label htmlFor="number-input" className={styles['number-input-label']}>
        {properties.label}
      </label>
    );
  }
  let endLabel = <></>;
  if (properties.endLabel) {
    endLabel = (
      <div className={styles['number-input-endlabel']}>
        {properties.endLabel}
      </div>
    );
  }
  return (
    <div className={styles['number-input-container']}>
      {label}
      <input
        type="number"
        name="number-input"
        value={value}
        min={minimumValue}
        max={maximumValue}
        step={step}
        className={styles['number-input-field']}
        onChange={event =>
          _NumberInput.numberInputChanged(event, setValue, setNumber)
        }
        ref={properties.inputReference}
      ></input>
      {endLabel}
    </div>
  );
}

export class _NumberInput {
  static numberInputChanged(event, setValue, setNumber) {
    const value = event.target.value;
    setValue(value);
    if (event.target.validity.valid) {
      const number = Number(value);
      setNumber(number);
    }
  }
}
