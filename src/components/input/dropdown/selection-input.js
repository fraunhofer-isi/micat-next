// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import styles from './selection-input.module.scss';

export default function SelectionInput(properties) {
  const label = properties.label;
  const options = properties.options;
  const defaultValue = properties.defaultValue;
  const selectId = 'unit-select'; // Add a unique ID for the select element

  return (
    <div className={styles['select-container']}>
      <label htmlFor={selectId} className={styles['select-label']}>
        {label}
      </label>
      <select
        id={selectId}
        name="selection"
        defaultValue={defaultValue}
        className={styles.select}
        onChange={(event) => properties.change(event, event.target.value)}
      >
        {_SelectionInput._getOptions(options)}
      </select>
    </div>
  );
}

export class _SelectionInput {
  static _getOptions(options) {
    return (
      <>
        {options.map((option, index) => {
          return (
            <option key={index} className={styles['select-option']}>
              {option}
            </option>
          );
        })}
      </>
    );
  }
}
