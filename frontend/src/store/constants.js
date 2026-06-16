export const ROLES = { ENGINEER: 1, SUPERVISOR: 2, SUPERADMIN: 3 }

export const VIEWS = {
  LOGIN:               'login',
  DASHBOARD:           'dashboard',
  WORKSPACE:           'workspace',
  EDITOR:              'editor',
  SIMULATION:          'simulacion',
  REPORT:              'reporte',
  MONITOR:             'monitor',
  CONFIGURATION:       'configuracion',
  PROJECT_MANAGEMENT:   'gestion_proyectos',
  LOG_VIEWER:          'visor_logs',
  VERSION_HISTORY:     'historial_versiones',
}

export const MEDIUM_PROPS = {
  fiber:    { vProp: 200_000, bw: 1000, atenDB_per_km: 0.2 },
  copper:   { vProp: 200_000, bw: 100,  atenDB_per_km: 1.5 },
  wireless: { vProp: 300_000, bw: 54,   atenDB_per_km: 6.0 },
}

export const OBSTACLE_ATTENUATION = {
  drywall:   0.4,
  wood:      0.6,
  glass:     0.8,
  brick:     2.0,
  concrete:  3.5,
  metal:     6.0,
}
