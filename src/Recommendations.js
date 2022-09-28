import { Row } from '@lightningjs/ui-components'

export class Recommendations extends Row {
  static _template() {
    return {
      ...super._template(),
      Title: {
        text: {
          x: 0,
          y: 0,
        },
        zIndex: 5,
      },
    }
  }

  _active() {
    super._active && super._active()
    this.patch({
      Items: {
        y: 70,
      },
    })
  }

  set title(val) {
    this.Title.text = val
  }

  get title() {
    return this.Title.text.text
  }

  get Title() {
    return this.tag('Title')
  }
}
