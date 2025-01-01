// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Parameters from './../../../../src/sections/input/parameters/parameters';

it('parameters', async () => {
  const properties = {
    templateBlob: () => {},
    change: () => {}
  };
  const result = Parameters(properties);
  expect(result).toBeDefined();

  const download = result.props.children[0];
  const blob = download.props.blob;
  spyOn(properties, 'templateBlob');
  await blob('mocked_fileName');
  expect(properties.templateBlob).toHaveBeenCalled();

  const upload = result.props.children[1];
  const change = upload.props.change;
  spyOn(properties, 'change');
  await change('mocked_jsonData');
  expect(properties.change).toHaveBeenCalled();
});
