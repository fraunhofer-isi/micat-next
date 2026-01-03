// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import Router from 'next/router';

// This is main ile Of Next.Js Application . Now we have to go to index.js which is inside
// the pages/[id-mode]\[id_region]

export default function Index(properties) {
  React.useEffect(() => {
    setDefaultRoute(properties);
  }, []);

  const message = createTemporalMessageForRouting(properties);

  return <>{message}</>;
}
function createTemporalMessageForRouting(properties) {
  const modeLabel = properties.defaultMode.label;
  const regionLabel = properties.defaultRegion.label;
  const message = 'Routing to default mode "' + modeLabel + '" ' +
    'and region "' + regionLabel + '"...';
  return message;
}

function setDefaultRoute(properties) {
  const modeId = properties.defaultMode.id;
  const regionId = properties.defaultRegion.id;
  Router.push('/' + modeId + '/' + regionId);
}
