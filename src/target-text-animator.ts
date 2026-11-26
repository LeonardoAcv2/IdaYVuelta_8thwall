import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'target-text-animator',
  schema: {
    // @label "Nombre del Image Target"
    targetName: ecs.string,

    // @label "Entidad de Texto a Animar"
    // @description "Selecciona la entidad UI de texto que corresponde a este target"
    textEntity: ecs.eid,

    // @label "Posición Inicial (bottom %)"
    // @min -500
    // @max 0
    fromBottom: ecs.f32,

    // @label "Posición Final Visible (bottom %)"
    // @min -100
    // @max 100
    toBottom: ecs.f32,

    // @label "Posición de Salida (bottom %)"
    // @min -500
    // @max 0
    exitBottom: ecs.f32,

    // @label "Duración Animación (ms)"
    // @min 100
    // @max 5000
    duration: ecs.f32,

    // @label "Espera antes de Ocultar (ms)"
    // @min 0
    // @max 10000
    hideDelay: ecs.f32,
  },
  schemaDefaults: {
    targetName: 'BURGOS',
    fromBottom: -350,   // Tus parámetros actuales
    toBottom: 0,
    exitBottom: -300,   // Tus parámetros actuales
    duration: 1500,     // Tus parámetros actuales
    hideDelay: 2000,    // Tus parámetros actuales
  },
  add: (world, component) => {
    const { targetName, textEntity, fromBottom, toBottom, exitBottom, duration, hideDelay } = component.schema
    const managerEid = component.eid
    let hideTimeout: any = null

    // Validar que se haya asignado una entidad de texto
    if (!textEntity) {
      console.warn(`[TargetTextAnimator] No se asignó 'textEntity' para el target "${targetName}".`)
      return
    }

    // 1. Al encontrar el target: animar la entidad de texto externa
    world.events.addListener(world.events.globalId, 'reality.imagefound', (event: any) => {
      if (event.data?.name !== targetName) return

      if (hideTimeout) {
        world.time.clearTimeout(hideTimeout)
        hideTimeout = null
      }

      // Animamos la entidad de texto referenciada (no la del componente)
      ecs.CustomPropertyAnimation.set(world, managerEid, {
        target: textEntity, // 👈 Apunta a la entidad de texto independiente
        attribute: 'ui',
        property: 'bottom',
        from: fromBottom,
        to: toBottom,
        duration: duration,
        loop: false,
        easeOut: true,
        easingFunction: 'Cubic',
      })
    })

    // 2. Al perder el target: esperar y animar la salida
    world.events.addListener(world.events.globalId, 'reality.imagelost', (event: any) => {
      if (event.data?.name !== targetName) return

      if (hideTimeout) {
        world.time.clearTimeout(hideTimeout)
      }

      hideTimeout = world.time.setTimeout(() => {
        ecs.CustomPropertyAnimation.set(world, managerEid, {
          target: textEntity, // La misma entidad de texto
          attribute: 'ui',
          property: 'bottom',
          from: toBottom,
          to: exitBottom,
          duration: duration,
          loop: false,
          easeOut: true,
          easingFunction: 'Cubic',
        })
        hideTimeout = null
      }, hideDelay)
    })
  },
})