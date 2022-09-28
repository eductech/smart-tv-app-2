import lng from '@lightningjs/core'
import { GRID, TYPOGRAPHY } from '@lightningjs/ui-components/Styles'
import { MarqueeText } from '@lightningjs/ui-components'

export class Info extends lng.Component {
  static _template() {
    const maxTitleWidth = 1200
    return {
      x: GRID.margin.x,
      Title: {
        y: 40,
        type: MarqueeText,
        w: maxTitleWidth,
      },
      ShortSynopsis: {
        y: 140,
        w: maxTitleWidth,
        text: {
          ...TYPOGRAPHY.headline2,
          maxLines: 4,
        },
      },
      Release: {
        y: 360,
        text: {
          ...TYPOGRAPHY.headline2,
        },
      },
    }
  }

  _focus() {
    super._focus()
    this._Title.startScrolling && this._Title.startScrolling()
  }

  _unfocus() {
    super._unfocus()
    this._Title.stopScrolling && this._Title.stopScrolling()
  }

  set release(date) {
    this.tag('Release').patch({
      text: `Release: ${date}`,
    })
  }

  set title(title) {
    this._Title.text = { ...TYPOGRAPHY.display2, text: title }
  }

  set shortSynopsis(shortSynopsis) {
    this._ShortSynopsis.text = shortSynopsis
  }

  get _Title() {
    return this.tag('Title')
  }
  get _ShortSynopsis() {
    return this.tag('ShortSynopsis')
  }
  get _WatchOptions() {
    return this.tag('WatchOptions')
  }
}
