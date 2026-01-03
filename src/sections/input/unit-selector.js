// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, { useState } from 'react';
import SelectionInput from '../../components/input/dropdown/selection-input';
import Modal from '../../components/modal/modal';

export default function UnitSelector({ units, defaultUnit, setUnit }) {
  const [showModal, setShowModal] = useState(false);

  const unitChanged = (unit) => {
    setUnit(units[unit]);
    setShowModal(true);
  };

  const message =
    'If you change the units, the annual values in the table for indicator calculations, ' +
    'will be converted from the selected unit to ktoe as the calculation is always performed in ktoe. ' +
    'The values shown in the table are not converted.';

  return (
    <>
      <SelectionInput
        label="Final energy savings in "
        options={Object.keys(units)}
        defaultValue={Object.keys(defaultUnit)[0]}
        change={(_event, unit) => unitChanged(unit)}
      />
      <Modal
        showModal={showModal}
        title={'Unit Change'}
        closeButtonTitle="OK"
        text={message}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
