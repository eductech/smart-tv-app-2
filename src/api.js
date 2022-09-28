/* global process */
import { parseAssetsData, chunkArray, createAssetRows, getImageUrl } from './utils'

async function get(path, params = {}) {
  const response = await fetch(process.env.APP_API_ENDPOINT + path, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.APP_API_KEY,
    },
    ...params,
  })
  return await response.json()
}

const config = {
  data: null,
  baseUrl: null,
}

async function getConfig() {
  const data = await get('/configuration')

  if (config.data && config.baseUrl) {
    return config
  }

  config.data = data
  config.baseUrl = data.images.base_url
  return config
}

async function getInitData(cb) {
  await Promise.all([getConfig()])
  if (typeof cb === 'function') {
    cb()
  }
}

export const homePageData = {
  currentPage: 0,
  leftoverTiles: [],
  chunks: [],
}

async function getMoreUpcomingMovies() {
  homePageData.currentPage++
  const { results } = await get('/movie/upcoming?page=' + homePageData.currentPage)
  const tiles = homePageData.leftoverTiles.concat(parseAssetsData(results))
  const chunks = chunkArray(tiles)
  if (chunks[chunks.length - 1].length < 5) {
    homePageData.leftoverTiles = chunks.pop()
  } else {
    homePageData.leftoverTiles = []
  }
  homePageData.chunks = homePageData.chunks.concat(createAssetRows(chunks))
}

async function getHomePageData() {
  homePageData.currentPage = 0
  homePageData.leftoverTiles = []
  homePageData.chunks = []
  return getMoreUpcomingMovies().then(getMoreUpcomingMovies)
}

export const detailPageData = {
  recommendations: [],
  src: '',
  srcP: '',
  data: {},
}

async function getDetailPageData(_, { id }) {
  detailPageData.recommendations = []

  const { results } = await get(`/movie/${id}/recommendations`)
  detailPageData.recommendations = parseAssetsData(results.slice(0, 10))

  const data = await get(`/movie/${id}`)
  detailPageData.src = getImageUrl(data.backdrop_path, 'original')
  detailPageData.srcP = getImageUrl(data.poster_path, 'original')
  detailPageData.data = data
}

export { config, getInitData, getHomePageData, getMoreUpcomingMovies, getDetailPageData }
