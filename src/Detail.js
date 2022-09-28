import { Lightning, Router } from '@lightningjs/sdk'
import { SCREEN, GRID, getHexColor } from '@lightningjs/ui-components/Styles'
import { FocusManager, Button } from '@lightningjs/ui-components'

import { Recommendations } from './Recommendations'
import { Info } from './Info'
import { detailPageData } from './api'

export class Detail extends Lightning.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      Backdrop: {
        w: SCREEN.w,
        alpha: 0.1,
      },
      Bubble: {
        rect: true,
        x: 0,
        y: 0,
        w: 1920,
        h: 1080,
        color: getHexColor('080808', 56),
      },
      Poster: {
        x: 1400,
        y: 75,
        w: 350,
        h: 500,
        Placeholder: {
          w: 350,
          h: 500,
          rect: true,
          colorUl: getHexColor('2a2c2a'),
          colorUr: getHexColor('151615'),
          colorBr: getHexColor('2a2c2a'),
          colorBl: getHexColor('151615'),
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 8,
          },
        },
        Image: {
          w: 350,
          h: 500,
          alpha: 0.1,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 8,
          },
        },
      },
      EntityInfo: {
        type: Info,
        w: SCREEN.w,
        y: 100,
        h: 500,
        entityType: 'movie',
        zIndex: 1,
      },
      SectionsContainer: {
        type: FocusManager,
        direction: 'column',
        items: [
          {
            ref: 'Recommendations',
            type: Recommendations,
            title: 'Recommendations',
            w: 700,
            x: GRID.margin.x,
            h: 300,
            y: 600,
            alpha: 0.8,
            itemSpacing: 32,
          },
        ],
      },
    }
  }

  _firstActive() {
    this.tag('Backdrop').patch({
      w: 1920,
      h: 1080,
      texture: {
        type: Lightning.textures.ImageTexture,
        src: detailPageData.src,
        resizeMode: { type: 'cover', w: 1920, h: 1080 },
      },
    })

    this.tag('Backdrop').on('txLoaded', () => {
      this.tag('Backdrop').patch({
        smooth: { alpha: 1 },
      })
    })

    this.tag('Poster.Image').patch({
      rtt: true,
      zIndex: 5,
      texture: {
        type: Lightning.textures.ImageTexture,
        src: detailPageData.srcP,
        resizeMode: {
          type: 'cover',
          w: 350,
          h: 500,
        },
      },
    })

    this.tag('Poster.Image').on('txLoaded', () => {
      this.tag('Poster.Image').patch({
        smooth: { alpha: 1 },
      })
    })

    const { title, overview, name, release_date: releaseDate } = detailPageData.data
    this._EntityInfo.title = title || name
    this._EntityInfo.shortSynopsis = overview
    this._EntityInfo.release = releaseDate
    this._EntityInfo.buttons = {
      type: Button,
      title: 'Open Homepage',
      backgroundType: 'stroke',
      onEnter: () => {
        window.open(detailPageData.data.homepage)
      },
    }

    this._SectionsContainer.tag('Items.Recommendations').items = detailPageData.recommendations
  }

  _onChanged() {
    this._SectionsContainer.selectedIndex = 0
  }

  _handleEnter() {
    let fp = this.application.focusPath
    let activeTile = fp[fp.length - 1].data || {}
    if (activeTile.id) {
      Router.navigate(`detail/${activeTile.id}`)
    }
  }

  get _EntityInfo() {
    return this.tag('EntityInfo')
  }

  get id() {
    return 'EntityPage'
  }

  get _SectionsContainer() {
    return this.tag('SectionsContainer')
  }

  _getFocused() {
    return this._SectionsContainer
  }
}
