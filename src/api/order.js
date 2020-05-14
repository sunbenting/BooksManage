import request from '@/utils/request'
import qs from 'qs'

//获取批次列表
const  getBatchTab=(params)=> {
    return request({
      url: '/api/batchManagementAction.do?method=getBatchTab',
      method: 'get',
      params   
    })
  }
//订单管理管理员列表（查询）
const  getOrderList=(params)=> {
    return request({
      url: '/api/orderManagementAction.do?method=getOrderList',
      method: 'get',
      params   
    })
  }
  
//获取书籍管理列表
const  checkReject=(data)=> {
  return request({
    url: '/api/orderManagementAction.do?method=udpDdztReiect',
    method: 'get',
    params:{objIds:data},
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    } 
  })
}
//审核通过

const  checkPass=(data)=> {
    return request({
      url: '/api/orderManagementAction.do?method=udpDdztApprove',
      method: 'get',
      params:{objIds:data},
      paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }      
    })
  }

export {
    getBatchTab,
    getOrderList,
    checkPass,
    checkReject
}
