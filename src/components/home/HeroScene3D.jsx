// Hero 3D scene — lazy-loaded, self-contained.
// Renders floating branded shapes on a transparent canvas.
// Falls back to the static illustration when WebGL is unavailable or reduced motion is active.

import { useEffect, useRef, useState } from 'react'
import { SHAPES, GEO_TYPES, createGeo } from './heroScene3DData'
import PlaceholderIllustration from './PlaceholderIllustration'

function HeroScene3D({ className }) {
  const containerRef = useRef(null)
  const [rendering, setRendering] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let disposed = false
    let raf
    let renderer
    let scene
    let camera
    let meshes = []
    let mouse = { x: 0, y: 0 }
    let visible = true
    let observer

    const init = async () => {
      try {
        const THREE = await import('three')
        if (disposed) return

        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50)
        camera.position.z = 6

        const canvas = document.createElement('canvas')
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(280, 280)
        renderer.setClearColor(0x000000, 0)
        renderer.outputColorSpace = THREE.SRGBColorSpace

        const container = containerRef.current
        if (!container) return
        container.appendChild(renderer.domElement)

        scene.add(new THREE.AmbientLight(0xffffff, 0.85))
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
        dirLight.position.set(3, 4, 5)
        scene.add(dirLight)

        meshes = SHAPES.map((s, i) => {
          const geo = createGeo(THREE, GEO_TYPES[i], s.r)
          const mat = new THREE.MeshStandardMaterial({
            color: s.color,
            roughness: 0.72,
            metalness: 0.12,
            flatShading: true,
          })
          const mesh = new THREE.Mesh(geo, mat)
          mesh.position.set(...s.pos)
          scene.add(mesh)
          return { mesh, baseY: s.pos[1], speed: s.speed, phase: i * 0.9 }
        })

        const onPointerMove = (e) => {
          const rect = container.getBoundingClientRect()
          mouse.x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
          mouse.y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2
        }
        window.addEventListener('mousemove', onPointerMove, { passive: true })

        observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting
        }, { threshold: 0 })
        observer.observe(container)

        setRendering(true)

        const clock = new THREE.Clock()
        const tick = () => {
          raf = requestAnimationFrame(tick)
          if (!visible) return
          const t = clock.getElapsedTime()
          meshes.forEach(({ mesh, baseY, speed, phase }) => {
            mesh.position.y = baseY + Math.sin(t * speed + phase) * 0.18
            mesh.rotation.x = t * speed * 0.25
            mesh.rotation.y = t * speed * 0.35
          })
          scene.rotation.y = mouse.x * 0.12
          scene.rotation.x = -mouse.y * 0.08
          renderer.render(scene, camera)
        }
        tick()
      } catch {
        // WebGL unavailable — fallback stays visible.
      }
    }

    init()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      observer?.disconnect()
      renderer?.dispose()
      meshes.forEach(({ mesh }) => {
        mesh.geometry?.dispose()
        mesh.material?.dispose()
      })
      renderer?.domElement?.remove()
    }
  }, [])

  return (
    <div className={className} ref={containerRef}>
      {!rendering && (
        <PlaceholderIllustration
          className="h-80 sm:h-[420px]"
          label="hero-scene.svg"
        />
      )}
    </div>
  )
}

export default HeroScene3D
