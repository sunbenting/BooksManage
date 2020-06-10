import request from '@/utils/request'
import qs from 'qs'


//test

const  selectedComment=(data)=> {
  return request({
    url: '/union-web/reviewManagementAction.do?method=updPllxFine',
    method: 'get',
    params:{objIds:data},
    paramsSerializer: params => {
    return qs.stringify(params, { indices: false })
  }     
  })
}

//评论管理员评论列表（查询）
const  commentList=(params)=> {
  return request({
    url: '/union-web/reviewManagementAction.do?method=getReviewList',
    method: 'get',
    params   
  })
}


//审核通过
const  commentPass=(data)=> {
  return request({
    url: '/union-web/reviewManagementAction.do?method=updPlztApprove',
    method:'get',
    params:{objIds:data},
    paramsSerializer: params => {
    return qs.stringify(params, { indices: false })
  }      
  })
}

//审核驳回
const  commentReject=(data)=> {
  return request({
    url: '/union-web/reviewManagementAction.do?method=updPlztRecall',
    method: 'get',
    params:{objIds:data},
    paramsSerializer: params => {
    return qs.stringify(params, { indices: false })
  }      
  })
}






//development


// // 设为精选评论

// const  selectedComment=(data)=> {
//     return request({
//       url: '/api/reviewManagementAction.do?method=updPllxFine',
//       method: 'get',
//       params:{objIds:data},
//       paramsSerializer: params => {
//       return qs.stringify(params, { indices: false })
//     }     
//     })
//   }

//   //评论管理员评论列表（查询）
// const  commentList=(params)=> {
//     return request({
//       url: '/api/reviewManagementAction.do?method=getReviewList',
//       method: 'get',
//       params   
//     })
//   }
  

// //审核通过
// const  commentPass=(data)=> {
//     return request({
//       url: '/api/reviewManagementAction.do?method=updPlztApprove',
//       method:'get',
//       params:{objIds:data},
//       paramsSerializer: params => {
//       return qs.stringify(params, { indices: false })
//     }      
//     })
//   }
  
// //审核驳回
// const  commentReject=(data)=> {
//     return request({
//       url: '/api/reviewManagementAction.do?method=updPlztRecall',
//       method: 'get',
//       params:{objIds:data},
//       paramsSerializer: params => {
//       return qs.stringify(params, { indices: false })
//     }      
//     })
//   }
export {
    selectedComment,
    commentList,
    commentPass,
    commentReject
}
