import request from '@/utils/request'
/**
 *
 * @param {*} params
 */
export function getCardListAPI (params) {
  return request({
    url: '/parking/card/list',
    method: 'get',
    params
  })
}
