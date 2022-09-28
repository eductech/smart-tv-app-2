import { Row } from '@lightningjs/ui-components'
import { Card } from './Card'
import { config } from './api'

const DEFAULT_IMAGE_SIZE = 'w300'

export function getImageUrl(path, posterSize = DEFAULT_IMAGE_SIZE) {
  return config.baseUrl + posterSize + path
}

export function chunkArray(array, size = 5) {
  let chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function parseAssetsData(assets = []) {
  return assets.map(asset => {
    return {
      type: Card,
      src: getImageUrl(asset.poster_path || asset.profile_path),
      w: 185,
      h: 278,
      title: asset.title || asset.name,
      data: asset,
    }
  })
}

export function createAssetRows(items = []) {
  return items.map(items => ({
    type: Row,
    itemSpacing: 52,
    h: 300,
    neverScroll: true,
    items,
  }))
}
