// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import Component from '../../component';
import styles from './radio-input.module.scss';

export default class RadioInput extends Component {
  constructor (properties) {
    super(properties);
    this._inputReference = React.createRef();
  }

  get _input () {
    return this._inputReference.current;
  }

  get value () {
    return this._input.value;
  }

  set value (value) {
    this._input.value = value;
  }

  render () {
    const properties = this.props;

    return(
      <div className={styles.container}>
        <label>
          <input
          type="radio"
          className={styles['radio-button']}
          checked={properties.value}
          onChange={() => properties.change()}
          ref={this._inputReference} />
        {properties.label}
        </label>
      </div>
    );
  }
}
