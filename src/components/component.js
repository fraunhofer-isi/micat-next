// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
export default class Component extends React.Component {
  get id() {
    // returns the html id identifier:
    // uses given expicit id or name of component class as fallback
    if (this.props) {
      const id = this.props.id;
      if (id) {
        return id;
      }
    }
    const { name } = this.constructor;
    return name.toLowerCase();
  }

  render() {
    // should be overriden by inheriting classes
    return <div id={this.id} />;
  }
}
