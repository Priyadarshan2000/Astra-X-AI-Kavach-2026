export function nextAction(mission) {
  if (mission.tests) return { to: '/reports', label: 'Open Report' }
  if (mission.fuzz) return { to: '/regression', label: 'Run Tests' }
  if (mission.patch) return { to: '/fuzz', label: 'Fuzz Twin' }
  if (mission.scan) return { to: '/patch', label: 'Synthesize Patch' }
  if (mission.twin) return { to: '/scan', label: 'Run Scan' }
  return { to: '/twin', label: 'Arm Twin' }
}

export function loopSteps(mission) {
  return [
    { key: 'twin', label: 'Twin', to: '/twin', done: Boolean(mission.twin) },
    { key: 'scan', label: 'Scan', to: '/scan', done: Boolean(mission.scan) },
    { key: 'patch', label: 'Patch', to: '/patch', done: Boolean(mission.patch) },
    { key: 'fuzz', label: 'Fuzz', to: '/fuzz', done: Boolean(mission.fuzz) },
  ]
}
