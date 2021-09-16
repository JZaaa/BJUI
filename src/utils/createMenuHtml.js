import { sidebarSelector } from '@/utils/static'
import { getGUID } from './index'
import { trim } from './index'
import getBaseURL from 'xe-utils/getBaseURL'
import startsWith from 'xe-utils/startsWith'

const BaseUrl = getBaseURL()

const createMenuHtml = (treeData, parentSelector = sidebarSelector) => {
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
      html += `<ul id="${id}" class="sidebar-dropdown list-unstyled collapse" data-parent="${parentSelector}">`
      html += createMenuHtml(val.children, '#' + id)
      html += `</ul>`
    } else {
      let path = ''
      if (val.path && val.path.length) {
        let hash = trim(val.path, BaseUrl, 'left')
        if (!startsWith(hash, '/')) {
          hash = '/' + hash
        }
        path = (`href="${val.path}" data-hash="#${hash}" `)
      }
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
