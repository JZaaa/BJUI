import { ContentTypeEnum } from '@/js/util/enums/httpEnum'

// 默认配置
export default {
  // 主页默认主页url
  homeUrl: '/views/sys.html',
  // 请求默认配置
  request: {
    contentType: ContentTypeEnum.JSON // 请求类型。 form-data格式ContentTypeEnum.FORM_URLENCODED
  }
}
