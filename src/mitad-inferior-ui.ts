import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'mitad-inferior-ui',
  schema: {
    imageAsset: ecs.string,
  },
  schemaDefaults: {
    imageAsset: 'assets/CARTA.png', // Asegúrate de que esta ruta sea correcta
  },
  add: (world, component) => {
    const { imageAsset } = component.schema

    // 1. Crear el elemento UI de tipo overlay y asignarle la imagen
    ecs.Ui.set(world, component.eid, {
      type: 'overlay',
      image: imageAsset,
      backgroundSize: 'cover',
    })

    // 2. Posicionar y dimensionar el elemento para que ocupe la mitad inferior
    ecs.Ui.mutate(world, component.eid, (cursor) => {
      cursor.position = 'absolute'
      cursor.top = '50%'
      cursor.left = '0%'
      cursor.height = '50%'
      cursor.width = '100%'
      return false
    })
  },
})