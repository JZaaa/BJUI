import startsWith from 'xe-utils/startsWith'
import getBaseURL from 'xe-utils/getBaseURL'

/**
 * 获取框架hash Url
 * @param url
 * @return {string}
 */
export function getAppHashUrl(url) {
  let hash = url
  const baseUrl = getBaseURL()
  if (startsWith(hash, 'http')) {
    hash = hash.trim(baseUrl, 'left')
  }
  if (startsWith(hash, '#')) {
    return hash
  }
  if (!startsWith(hash, '/')) {
    hash = '/' + hash
  }
  hash = '#' + hash
  return hash
}
