// Shared constants for HeroScene3D — kept separate to satisfy react-refresh lint rule.

export const BRAND = {
  navy:    0x2E3192,
  cyan:    0x2DB6E3,
  purple:  0x6C63FF,
  lavender:0x9D97FF,
  gray:    0xB0B3B8,
}

export const SHAPES = [
  { geo: 'Icosahedron', r: 0.4,  color: BRAND.cyan,    pos: [-2.6,  1.0,  0],    speed: 0.7 },
  { geo: 'Sphere',      r: 0.3,  color: BRAND.navy,     pos: [ 1.2, -1.2,  0.2],  speed: 0.5 },
  { geo: 'TorusKnot',   r: 0.28, color: BRAND.purple,   pos: [-1.2, -0.4, -0.3],  speed: 0.6 },
  { geo: 'Sphere',      r: 0.2,  color: BRAND.lavender, pos: [ 2.2,  0.8, -0.1],  speed: 0.45 },
  { geo: 'Octahedron',  r: 0.35, color: BRAND.cyan,     pos: [ 0,    1.5,  0.1],  speed: 0.55 },
  { geo: 'Box',         r: 0.2,  color: BRAND.gray,     pos: [-2.0, -1.0,  0.3],  speed: 0.4 },
  { geo: 'Cone',        r: 0.18, color: BRAND.navy,     pos: [ 2.6, -0.2, -0.2],  speed: 0.65 },
]

export const GEO_TYPES = ['Icosahedron','Sphere','TorusKnot','Sphere','Octahedron','Box','Cone']

export function createGeo(THREE, type, r) {
  switch (type) {
    case 'Icosahedron': return new THREE.IcosahedronGeometry(r, 0)
    case 'TorusKnot':   return new THREE.TorusKnotGeometry(r, r * 0.3, 48, 8)
    case 'Octahedron':  return new THREE.OctahedronGeometry(r, 0)
    case 'Box':         return new THREE.BoxGeometry(r * 1.4, r * 1.4, r * 1.4)
    case 'Cone':        return new THREE.ConeGeometry(r, r * 2, 6)
    default:            return new THREE.SphereGeometry(r, 24, 24)
  }
}
