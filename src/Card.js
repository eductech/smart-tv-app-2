import { Lightning } from '@lightningjs/sdk'
import { getHexColor } from '@lightningjs/ui-components/Styles'

export class Card extends Lightning.Component {
  static _template() {
    return {
      Item: {
        Placeholder: {
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
          alpha: 0.1,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 8,
          },
        },
      },
      FocusRing: {
        alpha: 0,
      },
    }
  }

  _construct() {
    super._construct()
    this.spacing = 20
    this.radius = 4
  }

  set src(val) {
    this._src = val
  }

  get src() {
    return this._src
  }

  set id(val) {
    this._id = val
  }

  get id() {
    return this._id
  }

  _focus() {
    this.tag('FocusRing').smooth = { alpha: 1 }
    this.fireAncestors('$focusMessage', this.data)
  }

  _unfocus() {
    this.tag('FocusRing').smooth = { alpha: 0 }
  }

  _firstEnable() {
    this.tag('FocusRing').patch({
      w: this.w + this.spacing,
      h: this.h + this.spacing,
      mount: 0.5,
      x: this.w / 2,
      y: this.h / 2,
      zIndex: 2,

      texture: Lightning.Tools.getRoundRect(
        this.w + this.spacing,
        this.h + this.spacing,
        0,
        this.radius,
        false,
        false
      ),
    })

    this.tag('Item.Placeholder').patch({
      w: this.w,
      h: this.h,
    })

    this.tag('Item.Image').patch({
      rtt: true,
      zIndex: 2,
      w: this.w,
      h: this.h,
      texture: {
        type: Lightning.textures.ImageTexture,
        src: this._src,
        resizeMode: { type: 'cover', w: this.w, h: this.h },
      },
    })

    this.tag('Item.Image').on('txLoaded', () => {
      this.tag('Item.Image').patch({
        smooth: { alpha: 1 },
      })
    })
  }
}
