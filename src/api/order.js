import request from '@/utils/request'
import qs from 'qs'

//test

// //获取批次列表
const  getBatchTab=(params)=> {
  return request({
    url: '/union-web/batchManagementAction.do?method=getBatchTab',
    method: 'get',
    params   
  })
}
//订单管理管理员列表（查询）
const  getOrderList=(params)=> {
  return request({
    url: '/union-web/orderManagementAction.do?method=getOrderList',
    method: 'get',
    params   
  })
}

//审核驳回
const  checkReject=(data)=> {
return request({
  url: '/union-web/orderManagementAction.do?method=udpDdztReiect',
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
    url: '/union-web/orderManagementAction.do?method=udpDdztApprove',
    method: 'get',
    params:{objIds:data},
    paramsSerializer: params => {
    return qs.stringify(params, { indices: false })
  }      
  })
}

  //导出已审核数据
  const  exportDdList=(data)=> {
    return request({
      url: '/union-web/tsglAction.do?method=exportDdList',
      method: 'get',
      params:data
    })
  }
  

// // development
// // 获取批次列表
// const  getBatchTab=(params)=> {
//     return request({
//       url: '/api/batchManagementAction.do?method=getBatchTab',
//       method: 'get',
//       params   
//     })
//   }
// //订单管理管理员列表（查询）
// const  getOrderList=(params)=> {
//     return request({
//       url: '/api/orderManagementAction.do?method=getOrderList',
//       method: 'get',
//       params   
//     })
//   }
  
// //审核驳回
// const  checkReject=(data)=> {
//   return request({
//     url: '/api/orderManagementAction.do?method=udpDdztReiect',
//     method: 'get',
//     params:{objIds:data},
//     paramsSerializer: params => {
//       return qs.stringify(params, { indices: false })
//     } 
//   })
// }
// //审核通过

// const  checkPass=(data)=> {
//     return request({
//       url: '/api/orderManagementAction.do?method=udpDdztApprove',
//       method: 'get',
//       params:{objIds:data},
//       paramsSerializer: params => {
//       return qs.stringify(params, { indices: false })
//     }      
//     })
//   }
//   //导出已审核数据
//   const  exportDdList=(data)=> {
//     return request({
//       url: '/api/tsglAction.do?method=exportDdList',
//       method: 'get',
//       params:data
//     })
//   }
  

export {
    getBatchTab,
    getOrderList,
    checkPass,
    checkReject,
    exportDdList
}
