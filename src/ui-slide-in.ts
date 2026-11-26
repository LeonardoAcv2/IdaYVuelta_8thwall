import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'ui-slide-in',
  schema: {
    imageAsset: ecs.string,
  },
  schemaDefaults: {
    imageAsset: 'assets/CARTA.png',
  },
  add: (world, component) => {
    const { imageAsset } = component.schema
    const eid = component.eid
    let hideTimeout: any = null // Guardamos el ID del temporizador

    // Configuración inicial de la UI (sin cambios)
    ecs.Ui.set(world, eid, {
      type: 'overlay',
      image: imageAsset,
      backgroundSize: 'cover',
    })

    // Estado inicial: oculto debajo de la pantalla
    ecs.Ui.mutate(world, eid, (cursor) => {
      cursor.position = 'absolute'
      cursor.bottom = '-100%'
      cursor.left = '0%'
      cursor.height = '50%'
      cursor.width = '100%'
      return false
    })

    // 1. Al encontrar un target: mostrar (animación de entrada)
    world.events.addListener(world.events.globalId, 'reality.imagefound', (event: any) => {
      const name = event.data?.name
      if (!['BURGOS', 'TOLEDO', 'MADRID', 'CORDOBA'].includes(name)) return

      // Si había un temporizador pendiente de ocultar, lo cancelamos
      if (hideTimeout) {
        world.time.clearTimeout(hideTimeout)
        hideTimeout = null
      }

      // Animación de entrada (deslizar hacia arriba)
      ecs.CustomPropertyAnimation.set(world, eid, {
        attribute: 'ui',
        property: 'bottom',
        from: -350, // o el valor que estés usando ahora (ej. -300)
        to: 0,
        duration: 1500,
        loop: false,
        easeOut: true,
        easingFunction: 'Cubic',
      })
    })

    // 2. Al perder el target: esperar 5s y ocultar (animación de salida)
    world.events.addListener(world.events.globalId, 'reality.imagelost', (event: any) => {
      const name = event.data?.name
      if (!['BURGOS', 'TOLEDO', 'MADRID', 'CORDOBA'].includes(name)) return

      // Si ya había un temporizador en marcha, lo reiniciamos
      if (hideTimeout) {
        world.time.clearTimeout(hideTimeout)
      }

      // Programar la ocultación después de 5000 ms (5 segundos)
      hideTimeout = world.time.setTimeout(() => {
        ecs.CustomPropertyAnimation.set(world, eid, {
          attribute: 'ui',
          property: 'bottom',
          from: 0,      // Parte de la posición visible (mitad inferior)
          to: -300,     // Se desliza hacia abajo, fuera de la pantalla
          duration: 1500, // Duración de la animación de salida
          loop: false,
          easeOut: true,
          easingFunction: 'Cubic',
        })
        hideTimeout = null
      }, 2000)
    })
  },
})