import { menuSelector } from '@/utils/static'
import { getGUID } from './index'

const createMenuHtml = (treeData) => {
  let html = ''
  treeData.forEach(val => {
    html += '<li class="sidebar-item">'
    let icon = ''
    if (val.icon && val.icon.length) {
      icon = `<i class="align-middle" data-feather="${val.icon}"></i>`
    }
    if (val.children && val.children.length) {
      const id = getGUID()

      html +=
        `<a data-target="#${id}" data-toggle="collapse" class="sidebar-link collapsed">
              ${icon}
              <span class="align-middle">
                ${val.name}
              </span>
        </a>`
      html += `<ul id="${id}" class="sidebar-dropdown list-unstyled collapse" data-parent="${menuSelector}">`
      html += createMenuHtml(val.children)
      html += `</ul>`
    } else {
      const path = val.path && val.path.length ? (`href="${val.path}"`) : ''
      html +=
        `<a class="sidebar-link" ${path}>
            ${icon}
            <span class="align-middle">${val.name}</span>
        </a>`
    }
    html += '</li>'
  })
  return html
}

export default createMenuHtml
