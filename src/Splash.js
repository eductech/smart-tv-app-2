import { Lightning, Utils } from '@lightningjs/sdk'
import { TYPOGRAPHY } from '@lightningjs/ui-components/Styles'

export class Splash extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      Logo: {
        mountX: 1,
        x: 1820,
        y: 80,
        texture: Lightning.Tools.getSvgTexture(Utils.asset('images/tmdb-logo.svg'), 360, 142),
        alpha: 0.1,
      },
      Text: {
        mount: 0.5,
        x: 960,
        y: 540,
        alpha: 0.1,
        text: {
          ...TYPOGRAPHY.display1,
          text: 'LOADING',
        },
      },
    }
  }

  _active() {
    this.tag('Logo').on('txLoaded', () => {
      this.patch({
        Logo: { smooth: { alpha: 1 } },
        Text: { smooth: { alpha: 1 } },
      })
    })

    let dots = 0
    this.inteval = setInterval(() => {
      this.tag('Text').text = [
        [...Array(dots % 4).keys()].map(() => ' ').join(''),
        'LOADING',
        [...Array(dots % 4).keys()].map(() => '.').join(''),
      ].join(' ')
      dots++
    }, 500)
  }

  _inactive() {
    this.inteval && clearInterval(this.inteval)
  }
}
