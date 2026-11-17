import * as THREE from 'three'

// Draws a small terracotta tile pattern on a canvas and uses it as a floor texture.
export function createFloorTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const tiles = [
    ['#d9a273', '#c98a5a'],
    ['#c98a5a', '#d9a273'],
  ]
  const tileSize = size / 2

  tiles.forEach((row, y) => {
    row.forEach((color, x) => {
      ctx.fillStyle = color
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
    })
  })

  // grout lines
  ctx.strokeStyle = 'rgba(120, 80, 50, 0.35)'
  ctx.lineWidth = 2
  ctx.strokeRect(0, 0, size, size)
  ctx.beginPath()
  ctx.moveTo(tileSize, 0)
  ctx.lineTo(tileSize, size)
  ctx.moveTo(0, tileSize)
  ctx.lineTo(size, tileSize)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(8, 8)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
