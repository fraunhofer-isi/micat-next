// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import Component from '../../../components/component';
import styles from './id-selector.module.css';

export default class IdSelector extends Component {
  constructor(properties){
    super(properties);
    this._selectReference = React.createRef();
  }

  componentDidMount(){
    const defaultIdValue = this.props['default-id-value'];
    this._select.selectedIndex = this._optionIndexForIdValue(defaultIdValue);
  }

  _optionIndexForIdValue(idValue){
    const options = [...this._select.options];
    const wantedOption = options.find(option => {
      const currentIdValue = Number.parseInt(option.dataset.idValue);
      return currentIdValue === idValue;
    });
    const index = options.indexOf(wantedOption);
    return index;
  }

  _createOption(row){
    const idValue = row[0];
    const label = row[1];
    const description = row[2];
    return <option
            key={idValue}
            data-id-value={idValue}
            title={description}
            className={styles['micat-select-option']}
        >
        {label}
        </option>;
  }

  render(){
    const properties = this.props;
    const label = properties.label ?? '';
    const idTable = properties['id-table'];
    const change = properties.change;

    const isEmpty = !idTable || !idTable.rows || idTable.rows.length === 0;
    if(isEmpty){
      return '!! Id table is empty !! ' + label;
    }

    return (<div
            className={styles['micat-id-selector']}
        >
            <label
                className={styles['micat-select-label']}
            >{label}</label>
            <select
                onChange={() => change(this.idValue, this.value)}
                ref={this._selectReference}
                className={styles['micat-select']}
            >
                {
                    idTable.rows.map(row => this._createOption(row))
                }
            </select>
        </div>);
  }

  get _select(){
    return this._selectReference.current;
  }

  get value(){
    return this._select.value;
  }

  // The property 'id' is already defined in Component class for usage with dom.
  // This property 'idValue' is related to the id table used by the id-selector
  get idValue(){
    const index = this._select.selectedIndex;
    const option = this._select.options[index];
    const idValue = Number.parseInt(option.dataset.idValue);
    return idValue;
  }

  get description(){
    const index = this._select.selectedIndex;
    const option = this._select.options[index];
    const description = option.title;
    return description;
  }
}
