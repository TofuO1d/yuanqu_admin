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
/**
 *
 * @param {*} data
 */
export function addCardAPI (data) {
  return request({
    url: '/parking/card',
    method: 'POST',
    data
  })
}
/**
 *
 * @param {*} id
 */
export function getCardDetailAPI (id) {
  return request({
    url: `/parking/card/detail/${id}`
  })
}
/**
 *
 * @param {*} data
 */
export function editCardAPI (data) {
  return request({
    url: '/parking/card/edit',
    method: 'PUT',
    data
  })
}
/**
 *
 * @param {*} id
 */
export function delCardAPI (id) {
  return request({
    url: `/parking/card/${id}`,
    method: 'delete'
  })
}
