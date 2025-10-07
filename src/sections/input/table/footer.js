// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import parentStyles from './annual-table.module.scss';
import { PlusSquare } from 'react-bootstrap-icons';

export default function Footer(properties) {
  return <button
    title='Add row'
    onClick={() => properties.addRow()}
    className={parentStyles['icon-button']}
    disabled={properties.disabled}
  >
    <PlusSquare/> Row
  </button>;
}
