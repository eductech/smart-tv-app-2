import { Lightning, Router } from '@lightningjs/sdk'
import { Column } from '@lightningjs/ui-components'
import { getHexColor, TYPOGRAPHY } from '@lightningjs/ui-components/Styles'
import { getMoreUpcomingMovies, homePageData } from './api'
import { getImageUrl } from './utils'

const THRESHOLD = 5

export class Home extends Lightning.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      Wrapper: {
        x: 0,
        y: 0,
        w: 1920,
        h: 1080,
        clipping: true,
        Column: {
          x: 21,
          y: 40,
          type: Column,
          itemSpacing: 42,
          plinko: true,
          signals: {
            selectedChange: '_loadMore',
          },
        },
      },
      Description: {
        mount: 0.5,
        x: 1620,
        y: 540,
        w: 600,
        h: 900,
        Image: {
          rtt: true,
          w: 600,
          h: 900,
          clipping: true,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 12,
          },
          Placeholder: {
            w: 600,
            h: 900,
            rect: true,
            colorUl: getHexColor('2a2c2a'),
            colorUr: getHexColor('151615'),
            colorBr: getHexColor('2a2c2a'),
            colorBl: getHexColor('151615'),
          },
          Image: {
            w: 600,
            h: 900,
            shader: {
              type: Lightning.shaders.Dithering,
              graining: 0.1,
            },
          },
          Bubble: {
            w: 600,
            h: 900,
            rect: true,
            color: getHexColor('080808', 70),
            visible: false,
          },
        },
        Title: {
          mountX: 0.5,
          mountY: 1,
          x: 300,
          y: 360,
          w: 500,
          text: {
            ...TYPOGRAPHY.headline1,
            maxLines: 2,
            textAlign: 'center',
          },
        },
        Text: {
          mountX: 0.5,
          mountY: 1,
          x: 300,
          y: 680,
          w: 500,
          text: {
            ...TYPOGRAPHY.headline3,
            maxLines: 6,
            textAlign: 'center',
          },
        },
      },
    }
  }

  _active() {
    const column = this.tag('Wrapper.Column')
    column.items = [...homePageData.chunks]

    const showDescription = () => {
      this.tag('Description').patch({
        smooth: {
          x: 1550,
          alpha: 1,
        },
      })
    }

    this.tag('Description.Image.Image').on('txLoaded', showDescription)
    this.tag('Description.Image.Image').on('txError', showDescription)
  }

  async _loadMore() {
    const column = this.tag('Wrapper.Column')
    const prevChunksAmount = homePageData.chunks.length
    if (column.items.length && column.selectedIndex > column.items.length - THRESHOLD) {
      await getMoreUpcomingMovies()
      column.appendItems(homePageData.chunks.slice(prevChunksAmount))
    }
  }

  _handleEnter() {
    let fp = this.application.focusPath
    let activeTile = fp[fp.length - 1].data || {}
    Router.navigate(`detail/${activeTile.id}`)
  }

  _getFocused() {
    return this.tag('Wrapper.Column')
  }

  $focusMessage(data) {
    this.tag('Description').patch({
      x: 1620,
      alpha: 0.1,
      Image: {
        Image: {
          texture: getImageUrl(data.poster_path || data.profile_path)
            ? {
                type: Lightning.textures.ImageTexture,
                src: getImageUrl(data.poster_path || data.profile_path),
                resizeMode: { type: 'cover', w: 600, h: 900 },
              }
            : null,
        },
        Bubble: {
          visible: true,
        },
      },
      Title: {
        text: {
          text: data.title.toUpperCase(),
        },
      },
      Text: {
        text: {
          text: data.overview.toUpperCase(),
        },
      },
    })
  }
}
