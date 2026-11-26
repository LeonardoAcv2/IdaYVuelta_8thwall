const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/BURGOS.json'),
      require('../image-targets/MADRID.json'),
      require('../image-targets/CORDOBA.json'),
      require('../image-targets/TOLEDO.json')
    ],
  })
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)