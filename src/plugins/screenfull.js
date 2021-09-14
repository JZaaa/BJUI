import screenfull from 'screenfull'

const _toggleScreenfull = () => {
  screenfull.toggle()
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.js-fullscreen').addEventListener('click', () => {
    _toggleScreenfull()
  })
})
