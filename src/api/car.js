import request from '@/utils/request'

/**
 * 获取规则列表
 * @param { page, pageSize} params
 * @returns
 */
export function getRuleListAPI (params) {
  return request({
    url: 'parking/rule/list',
    params
  })
}
/**
 *
 * @param {*} id
 */
export function delRuleAPI (id) {
  return request({
    url: `parking/rule/${id}`,
    method: 'DELETE'
  })
}
/**
 * 创建规则
 * @returns
 */
export function createRuleAPI (data) {
  return request({
    url: '/parking/rule',
    method: 'POST',
    data
  })
}
/**
 *
 * @param {*} id
 */
export function getRuleDetailAPI (id) {
  return request({
    url: `parking/rule/${id}`,
    method: 'GET'
  })
}
/**
 *
 * @param {*} data
 */
export function editRuleAPI (data) {
  return request({
    url: `parking/rule`,
    method: 'PUT',
    data
  })
}
