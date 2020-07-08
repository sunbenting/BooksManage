import request from '@/utils/request'
import qs from 'qs'
import axios from 'axios'
//test
const  getBatchTab=(params)=> {
  return request({
    url: '/union-web/batchManagementAction.do?method=getBatchTab',
    method: 'get',
    params   
  })
}

//获取图书类别
const  getSjlb=()=> {
  return request({
    url: '/union-web/bookManagementAction.do?method=getSjlb',
    method: 'get'   
  })
}
//获取书籍管理列表
const  getBookList=(params)=> {
return request({
  url: '/union-web/bookManagementAction.do?method=getBookList',
  method: 'get',
  params   
})
}
//图书详情

const  getBookInfo=(params)=> {
  return request({
    url: '/union-web/bookManagementAction.do?method=getBookInfo',
    method: 'get',
    params
    
  })
}
//图书列表新增

const  addBookItem=(params)=> {
  return request({
    url: '/union-web/tsglAction.do?method=saveBookInfo',
    method: 'post',
    params   
  })
}
 //图书列表修改
const  updateBookItem=(params)=> {
  return request({
    url: '/union-web/tsglAction.do?method=saveBookInfo',
    method: 'post',
    params   
  })
}
//图书列表删除条
const  delBookInfos=(data)=> {
  return request({
    url: '/union-web/tsglAction.do?method=delBookInfos',
    method: 'get',
    params:{objIds:data},
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}
 //书籍模板导出
  
 const  exportExcel=(data)=> {
  return request({
    url: '/union-web/tsglAction.do?method=exportExcel',
    method: 'get'
  })
}
//书籍导入

const importExcel=(params)=>{
  return  axios.post('/union-web/tsglAction.do?method=uploadFile',params)
}



//上传图片
const uploadImg=(params)=>{
  return  axios.post('/union-web/tsglAction.do?method=uploadAttachment',params)
}











//development

// // 获取批次列表
// const  getBatchTab=(params)=> {
//     return request({
//       url: '/api/batchManagementAction.do?method=getBatchTab',
//       method: 'get',
//       params   
//     })
//   }
  
//   //获取图书类别
//   const  getSjlb=()=> {
//     return request({
//       url: '/api/bookManagementAction.do?method=getSjlb',
//       method: 'get'   
//     })
//   }
// //获取书籍管理列表
// const  getBookList=(params)=> {
//   return request({
//     url: '/api/bookManagementAction.do?method=getBookList',
//     method: 'get',
//     params   
//   })
// }
// //图书详情

// const  getBookInfo=(params)=> {
//     return request({
//       url: '/api/bookManagementAction.do?method=getBookInfo',
//       method: 'get',
//       params
      
//     })
//   }
//   //图书列表新增
  
//   const  addBookItem=(params)=> {
//     return request({
//       url: '/api/tsglAction.do?method=saveBookInfo',
//       method: 'get',
//       params   
//     })
//   }
//    //图书列表修改
//   const  updateBookItem=(params)=> {
//     return request({
//       url: '/api/tsglAction.do?method=saveBookInfo',
//       method: 'get',
//       params   
//     })
//   }
//   //图书列表删除条
//   const  delBookInfos=(data)=> {
//     return request({
//       url: '/api/tsglAction.do?method=delBookInfos',
//       method: 'get',
//       params:{objIds:data},
//       paramsSerializer: params => {
//         return qs.stringify(params, { indices: false })
//       }
//     })
//   }
//   //书籍模板导出
  
//   const  exportExcel=(data)=> {
//     return request({
//       url: '/api/tsglAction.do?method=exportExcel',
//       method: 'get'
//     })
//   }
//   //书籍导入

//   const importExcel=(params)=>{
//     return  axios.post('/api/tsglAction.do?method=uploadFile',params)
//   }

 
  
//   //上传图片
//   const uploadImg=(params)=>{
//     return  axios.post('/api/tsglAction.do?method=uploadAttachment',params)
//   }

export {
    getBatchTab,
    getSjlb,
    getBookList,
    getBookInfo,
    addBookItem,
    delBookInfos,
    updateBookItem,
    exportExcel,
    importExcel,
    uploadImg
}
