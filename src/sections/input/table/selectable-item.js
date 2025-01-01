// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class SelectableItem {
  constructor(id, label, description){
    this.id = id;
    this.label = label;
    this._description = description;
  }

  toString(){
    return '<span title="' + this._description + '">' + this.label + '</span>';
  }

  match(){
    // dummy implementation to fulfill interface required by tabulator sorting
    // Also see https://gitlab.cc-asp.fraunhofer.de/isi/micat/-/issues/174
    return true;
  }
}
