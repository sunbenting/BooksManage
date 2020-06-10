import request from '@/utils/request'
import qs from 'qs'
//test

//批次列表
const  getList=(params)=> {
  return request({
    url: '/union-web/batchManagementAction.do?method=getBatchList',
    method: 'get',
    params   
  })
}
//批次详情

const  getBatchInfo=(params)=> {
    return request({
      url: '/union-web/batchManagementAction.do?method=getBatchInfo',
      method: 'get',
      params
      
    })
  }
  //批次列表新增
  
  const  addBatchInfo=(params)=> {
    return request({
      url: '/union-web/batchManagementAction.do?method=saveBatchInfo',
      method: 'post',
      params   
    })
  }
   //批次列表修改
  const  updateBatchInfo=(params)=> {
    return request({
      url: '/union-web/batchManagementAction.do?method=saveBatchInfo',
      method: 'post',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false })
      }  
    })
  }
  //批次列表删除条
  const  deleteBatch=(data)=> {
    return request({
      url: '/union-web/batchManagementAction.do?method=delBatchInfos',
      method: 'get',
      params:{objIds:data},
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false })
      }
    })
  }

  //批次列表发布  
const  batchPublish=(params)=> {
    return request({
      url: '/union-web/batchManagementAction.do?method=batchPublish',
      method: 'get',
      params   
    })
  }
    //批次列表撤回  
 const  batchRecall=(params)=> {
        return request({
          url: '/union-web/batchManagementAction.do?method=batchRecall',
          method: 'get',
          params   
        })
  }




// //development

// // 批次列表
// const  getList=(params)=> {
//   return request({
//     url: '/api/batchManagementAction.do?method=getBatchList',
//     method: 'get',
//     params   
//   })
// }
// //批次详情

// const  getBatchInfo=(params)=> {
//     return request({
//       url: '/api/batchManagementAction.do?method=getBatchInfo',
//       method: 'get',
//       params
      
//     })
//   }
//   //批次列表新增
  
//   const  addBatchInfo=(params)=> {
//     return request({
//       url: '/api/batchManagementAction.do?method=saveBatchInfo',
//       method: 'post',
//       params   
//     })
//   }
//    //批次列表修改
//   const  updateBatchInfo=(params)=> {
//     return request({
//       url: '/api/batchManagementAction.do?method=saveBatchInfo',
//       method: 'post',
//       params,
//       paramsSerializer: params => {
//         return qs.stringify(params, { indices: false })
//       }  
//     })
//   }
//   //批次列表删除条
//   const  deleteBatch=(data)=> {
//     return request({
//       url: '/api/batchManagementAction.do?method=delBatchInfos',
//       method: 'get',
//       params:{objIds:data},
//       paramsSerializer: params => {
//         return qs.stringify(params, { indices: false })
//       }
//     })
//   }

//   //批次列表发布  
// const  batchPublish=(params)=> {
//     return request({
//       url: '/api/batchManagementAction.do?method=batchPublish',
//       method: 'get',
//       params   
//     })
//   }
//     //批次列表撤回  
//  const  batchRecall=(params)=> {
//         return request({
//           url: '/api/batchManagementAction.do?method=batchRecall',
//           method: 'get',
//           params   
//         })
//   }
export {
    getList,
    getBatchInfo,
    addBatchInfo,
    deleteBatch,
    batchPublish,
    batchRecall,
    updateBatchInfo
}
