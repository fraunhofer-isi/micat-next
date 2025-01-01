// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Footer from './../../../../src/sections/input/table/footer';

it('construction', () => {
  const properties = {
    disabled: false,
    addRow: () => {}
  };

  const result = Footer(properties);

  const onClick = result.props.onClick;
  spyOn(properties, 'addRow');
  onClick();
  expect(properties.addRow).toHaveBeenCalled();
});
