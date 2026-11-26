import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'txt-slide-in',
  schema: {
    // 1. Selector para la entidad de texto que se va a animar
    // @label "Entidad de Texto"
    textEntity: ecs.eid,
  },
  add: (world, component) => {
    const { textEntity } = component.schema
    const managerEid = component.eid // El componente se puede adjuntar a cualquier entidad "gestora"
    let hideTimeout: any = null

    // Validación por si no se asigna ninguna entidad
    if (!textEntity) {
      console.warn('[txt-slide-in] No se ha asignado una entidad de texto.')
      return
    }

    // 1. Al encontrar el target: animar la entidad de texto externa
    world.events.addListener(world.events.globalId, 'reality.imagefound', (event: any) => {
      const name = event.data?.name
      if (!['BURGOS', 'TOLEDO', 'MADRID', 'CORDOBA'].includes(name)) return

      if (hideTimeout) {
        world.time.clearTimeout(hideTimeout)
        hideTimeout = null
      }

      // La animación se aplica a 'textEntity', no a 'managerEid'
      ecs.CustomPropertyAnimation.set(world, managerEid, {
        target: textEntity, // 👈 Aquí está la clave
        attribute: 'ui',
        property: 'bottom',
        from: -350, // Usa tus mismos parámetros
        to: 0,
        duration: 1500,
        loop: false,
        easeOut: true,
        easingFunction: 'Cubic',
      })
    })

    // 2. Al perder el target: animar la salida de la entidad de texto
    world.events.addListener(world.events.globalId, 'reality.imagelost', (event: any) => {
      const name = event.data?.name
      if (!['BURGOS', 'TOLEDO', 'MADRID', 'CORDOBA'].includes(name)) return

      if (hideTimeout) {
        world.time.clearTimeout(hideTimeout)
      }

      hideTimeout = world.time.setTimeout(() => {
        ecs.CustomPropertyAnimation.set(world, managerEid, {
          target: textEntity, // De nuevo, apuntando al texto
          attribute: 'ui',
          property: 'bottom',
          from: 0,
          to: -300,
          duration: 1500,
          loop: false,
          easeOut: true,
          easingFunction: 'Cubic',
        })
        hideTimeout = null
      }, 2000)
    })
  },
})