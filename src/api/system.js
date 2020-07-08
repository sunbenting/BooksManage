import request from '@/utils/request'
import qs from 'qs'

//test

// //设置配额 
const setDDPE = (params) => {
  return request({
    url: '/union-web/tsglAction.do?method=setDDPE',
    method: 'get',
    params
  })
}
//新增书籍类别
const saveSJLB = (params) => {
  return request({
    url: '/union-web/tsglAction.do?method=saveSJLB',
    method: 'get',
    params
  })
}

//修改书籍类别
const upSJLB = (params) => {
  return request({
    url: '/union-web/tsglAction.do?method=update',
    method: 'get',
    params
  })
}

//删除书籍类别

const deleteSJLB = (params) => {
  return request({
    url: '/union-web/tsglAction.do?method=delete',
    method: 'get',
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}


//获取配额列表

const getDdpe = (data) => {
  return request({
    url: '/union-web/tsglAction.do?method=getDdpe',
    method: 'get'

  })
}


// development
//设置配额 
// const  setDDPE=(params)=> {
//     return request({
//       url: '/api/tsglAction.do?method=setDDPE',
//       method: 'get',
//       params   
//     })
//   }
// //新增书籍类别
// const  saveSJLB=(params)=> {
//     return request({
//       url: '/api/tsglAction.do?method=saveSJLB',
//       method: 'get',
//       params   
//     })
//   }

// //修改书籍类别
// const  upSJLB=(params)=> {
//   return request({
//     url: '/api/tsglAction.do?method=update',
//     method: 'get',
//   params
//   })
// }
// //删除书籍类别

// const  deleteSJLB=(params)=> {
//     return request({
//       url: '/api/tsglAction.do?method=delete',
//       method: 'get',
//       params,
//       paramsSerializer: params => {
//                   return qs.stringify(params, { indices: false })
//                 }  
//     })
//   }
//   //获取配额列表

//   const  getDdpe=(data)=> {
//     return request({
//       url: '/api/tsglAction.do?method=getDdpe',
//       method: 'get'

//     })
//   }

export {
  setDDPE,
  saveSJLB,
  upSJLB,
  deleteSJLB,
  getDdpe
}
