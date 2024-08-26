(function () {
  'use strict'

  /**
   * 监听 dom class 变化
   *
   * let targetNode = document.getElementById('test')
   *
   * function workOnClassAdd() {
   *     alert("I'm triggered when the class is added")
   * }
   *
   * function workOnClassRemoval() {
   *     alert("I'm triggered when the class is removed")
   * }
   *
   * // watch for a specific class change
   * let classWatcher = new ClassWatcher(targetNode, 'trigger', workOnClassAdd, workOnClassRemoval)
   *
   * // tests:
   * targetNode.classList.add('trigger') // triggers workOnClassAdd callback
   * targetNode.classList.add('trigger') // won't trigger (class is already exist)
   * targetNode.classList.add('another-class') // won't trigger (class is not watched)
   * targetNode.classList.remove('trigger') // triggers workOnClassRemoval callback
   * targetNode.classList.remove('trigger') // won't trigger (class was already removed)
   * targetNode.setAttribute('disabled', true) // won't trigger (the class is unchanged)
   *
   */
  class ClassWatcher {

    constructor(targetNode, classToWatch, classAddedCallback, classRemovedCallback) {
      this.targetNode = targetNode
      this.classToWatch = classToWatch
      this.classAddedCallback = classAddedCallback
      this.classRemovedCallback = classRemovedCallback
      this.observer = null
      this.lastClassState = targetNode.classList.contains(this.classToWatch)

      this.init()
    }

    init() {
      this.observer = new MutationObserver(this.mutationCallback)
      this.observe()
    }

    observe() {
      this.observer.observe(this.targetNode, { attributes: true })
    }

    disconnect() {
      this.observer.disconnect()
    }

    mutationCallback = mutationsList => {
      for(let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          let currentClassState = mutation.target.classList.contains(this.classToWatch)
          if(this.lastClassState !== currentClassState) {
            this.lastClassState = currentClassState
            if(currentClassState) {
              this.classAddedCallback()
            }
            else {
              this.classRemovedCallback()
            }
          }
        }
      }
    }
  }


  BJUI.tools.Watcher = {
    ClassWatcher: ClassWatcher
  }

}())
