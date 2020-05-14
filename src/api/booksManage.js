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
  
  //获取图书类别
  const  getSjlb=()=> {
    return request({
      url: '/api/bookManagementAction.do?method=getSjlb',
      method: 'get'   
    })
  }
//获取书籍管理列表
const  getBookList=(params)=> {
  return request({
    url: '/api/bookManagementAction.do?method=getBookList',
    method: 'get',
    params   
  })
}
//批次详情

const  getBookInfo=(params)=> {
    return request({
      url: '/api/bookManagementAction.do?method=getBookInfo',
      method: 'get',
      params
      
    })
  }
  //批次列表新增
  
  const  addBookItem=(params)=> {
    return request({
      url: '/api/bookManagementAction.do?method=saveBookInfo',
      method: 'post',
      params   
    })
  }
   //批次列表修改
  const  updateBookItem=(params)=> {
    return request({
      url: '/api/bookManagementAction.do?method=saveBookInfo',
      method: 'post',
      params   
    })
  }
  //批次列表删除条
  const  delBookInfos=(data)=> {
    return request({
      url: '/api/bookManagementAction.do?method=delBookInfos',
      method: 'get',
      params:{objIds:data},
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false })
      }
    })
  }


export {
    getBatchTab,
    getSjlb,
    getBookList,
    getBookInfo,
    addBookItem,
    delBookInfos,
    updateBookItem
}
