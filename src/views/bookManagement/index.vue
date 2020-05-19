<template>
  <div class="bookManagement">
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane :label="item.PCMC" :name="item.ID" v-for="(item) in tablist" :key="item.ID">
          <el-form ref="form" :model="bookSearchForm" label-width="80px">
            <el-row>
              <el-col :span="9">
                <el-form-item label="图书名称:">
                  <el-input
                    v-model.trim="bookSearchForm.bookName"
                    size="small"
                    placeholder="请输入图书名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9" :offset="1">
                <el-form-item label="图书类别:">
                  <el-select
                    v-model="bookSearchForm.bookCategory"
                    placeholder="请选择图书类别"
                    size="small"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1" :offset="2">
                <el-button type="primary" @click="search" size="small">查询</el-button>
              </el-col>
              <el-col :span="1" style="margin: 0 22px;">
                <el-button type="primary" @click="clear" size="small">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card class="box-card" style="margin-top:10px">
      <el-row>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="addRow">新增</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-delete" size="small" @click="deleteRows">删除</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="updateRow">修改</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-upload2" size="small" @click="exportExcel">批量导入数据</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            ref="bookMultipleTable"
            :data="bookTableData"
            tooltip-effect="dark"
            style="width: 100%;margin-top:15px;"
            :stripe="true"
            :cell-style="rowClass"
            :header-cell-style="headClass"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="图书编号" min-width="100">
              <template slot-scope="scope">{{ scope.row.bookNumber }}</template>
            </el-table-column>
            <el-table-column prop="bookName" label="图书名称" width="130" show-overflow-tooltip></el-table-column>
            <el-table-column prop="author" label="图书作者" min-width="120"></el-table-column>
            <el-table-column prop="press" label="图书出版社" min-width="120"></el-table-column>
            <el-table-column label="图书类别" min-width="120">
              <template slot-scope="scope">{{ scope.row.bookCategory }}</template>
            </el-table-column>
            <el-table-column prop="publishTime" label="图书上架时间" min-width="120"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row style="margin:15px;float:right">
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 15, 20, 30]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :title="upper==false?'新增':'修改'" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="bookTableForm" :rules="bookRules" ref="bookTableForm">
        <el-form-item label="图书名称:" :label-width="formLabelWidth" prop="bookName">
          <el-input
            v-model.trim="bookTableForm.bookName"
            placeholder="请填写图书名称"
            autocomplete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="图书作者:" :label-width="formLabelWidth" prop="author">
          <el-input
            v-model.trim="bookTableForm.author"
            placeholder="请填写图书作者"
            autocomplete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="图书出版社:" :label-width="formLabelWidth" prop="press">
          <el-input
            v-model.trim="bookTableForm.press"
            placeholder="请填写图书出版社"
            autocomplete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="图书类别:" :label-width="formLabelWidth" prop="bookCategory">
          <el-select v-model="bookTableForm.bookCategory" placeholder="请选择图书类别" size="small">
            <el-option
              v-for="item in optionAdd"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图书封面:" :label-width="formLabelWidth" prop="bookImageUrl" ref="bookimg">
          <el-upload
          v-model="bookTableForm.bookImageUrl"
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            accept="image/jpeg,image/jpg,image/png"
          >
            <img v-if="bookTableForm.bookImageUrl" :src="bookTableForm.bookImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="el-upload__tip">请上传png、jpg及jpeg格式图片(大小2M以下,建议分辨率256*256)</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cacle('bookTableForm')">取 消</el-button>
        <el-button type="primary" @click="sure('bookTableForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="40%"
  >
 <el-row type="flex" justify="space-around">
   <el-col :span="6"><el-button type="primary" @click="downloadtp" icon="el-icon-download">下载模板</el-button>
    </el-col>
   <el-col :span="6">
       <!--limit:最大上传数，on-exceed：超过最大上传数量时的操作  -->
    <el-upload
        class="upload-demo"
        action=""
        :on-change="handleChange"
        :on-remove="handleRemove"
        :on-exceed="handleExceed"
        :limit="limitUpload"
        accept=".xlsx,application/vnd.openxmlformats-    
        officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        :auto-upload="false">
   <el-button type="success" @click="upfile" icon="el-icon-upload">上传文件</el-button>   
    </el-upload>
   </el-col>
 </el-row>
 
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
import {
  getBatchTab,
  getSjlb,
  getBookList,
  getBookInfo,
  addBookItem,
  delBookInfos,
  updateBookItem
} from "@/api/booksManage";
import { Col } from "element-ui";
export default {
  data() {
    return {
      limitUpload:1,
      dialogVisible:false,
      fileList: [],
      tablist: [],
      bookRules: {
        bookName: [
          { required: true, message: "请填写图书名称", trigger: "blur" }
        ],
        press: [
          { required: true, message: "请填写图书出版社", trigger: "blur" }
        ],
        author: [
          { required: true, message: "请填写图书作者", trigger: "blur" }
        ],
        bookCategory: [
          { required: true, message: "请选择图书类别", trigger: "change" }
        ],
        bookImageUrl:[{required: true,message: "请选择图书封面", trigger: "change" }]
      },
      options: [],
      optionAdd: [],
      activeName: "",
      total: 0,
      formLabelWidth: "120px",
      dialogFormVisible: false, //控制 modal 显示
      currentPage: 1,
      bookSearchForm: {
        bookName: "",
        bookCategory: ""
      },
      bookTableForm: {
        bookName: "", //图书名称
        press: "", //图书出版社
        author: "", //图书作者
        bookCategory: "", //图书类别
        bookImageUrl:"",//上传图书封面图
      },
      bookTableData: [],
      currentIndex: 4,
      multipleSelection: [],
      upper: false,
      requestParams: {
        limit: 10,
        start: 0,
        PCID: this.activeName,
        SJMC: "",
        LBID: null
      },
      outlist:[],//导出数据列表
      inputList:[],// 导入数据
      inputListLen:0// 导入数据长度
    };
  },
  watch: {
    dialogFormVisible: function(val, oldVa) {
      if (val == false) {
        this.bookTableForm = {};
        this.$refs.bookTableForm.resetFields();
      }
    }
  },
  mounted() {
    this.initTab();
  },
  methods: {
    init() {
      this.getBooksList();
    },
    downloadtp(){
  
      　require.ensure([], () => {
　　　　　　　　const { export_json_to_excel } = require('../../vendor/Export2Excel');
　　　　　　　　const tHeader = ['图书编号', '图书名称', '图书作者', '图书出版社', '图书类别','图书上架时间']; //对应表格输出的title
　　　　　　　　const filterVal = ['bookNumber', 'bookName', 'author', 'press', 'bookCategory','publishTime']; // 对应表格输出的数据
　　　　　　　　const list = this.outlist;
              console.log('this.bll :>> ', this.outlist);
　　　　　　　　const data = this.formatJson(filterVal, list);
　　　　　　　　export_json_to_excel(tHeader, data, '图书列表excel'); //对应下载文件的名字
　　　　　　})
    },
    formatJson(filterVal, jsonData) {
　　　　　　return jsonData.map(v => filterVal.map(j => v[j]))
　　　　},
    upfile(){},
    async initTab() {
      const res = await getBatchTab();
      const { list } = this.initRes(res);
      this.tablist = list;
      this.activeName = list[0].ID;
      this.requestParams.PCID = this.activeName;
      this.getBooksList();
      this.getBooksCategary();
    },
    async getBooksCategary() {
      const res = await getSjlb();
      const { list } = this.initRes(res);
      let op = list.map(item => {
        let obj = {
          label: item.LBMC,
          value: item.LBID
        };
        return obj;
      });
      this.options = op;
      this.optionAdd = op;
    },
    initRes(res) {
      const a = res.slice(res.indexOf("rows"), -1); //从开始截取到倒数第二个字符串
      const str = res.substring(res.indexOf("results"), res.indexOf(",rows")); //从某个开始 截取到 某个下标的字符串
      const total = str.substr(str.indexOf(":") + 1); //从某个开始截取到结尾的字符串
      const list = eval(a);
      return { list, total };
    },
    async getBooksList() {
      const paramsobj = this.invalidProperty(this.requestParams);
      let res = await getBookList(paramsobj);
      const { list, total } = this.initRes(res);
      let arr = list.map(item => {
        let obj = {
          PCID: this.activeName,
          SJID: item.SJID,
          bookNumber: item.SJBH || "暂无数据",
          bookName: item.SJMC,
          bookCategory: item.LBMC,
          publishTime: item.CJSJ || "暂无数据",
          press: item.SJCBS,
          author: item.SJZZ
        };
        return obj;
      });
           let arr2 = list.map(item => {
        let obj = {    
          bookNumber: item.SJBH || "暂无数据",
          bookName: item.SJMC,
          bookCategory: item.LBMC,
          publishTime: item.CJSJ || "暂无数据",
          press: item.SJCBS,
          author: item.SJZZ
        };
        return obj;
      });
      this.outlist=arr2;
      this.bookTableData = arr;
      this.total = Number(total);
    },
    handleClick(tab, event) {
      this.activeName = tab.name;
      this.requestParams.PCID = tab.name;
      this.init();
    },
    //导入表格
    exportExcel() {
      this.dialogVisible=true;
      console.log("表格 :>> ");
    },
            //上传文件时处理方法  
        handleChange(file, fileList){
            this.fileTemp = file.raw;
            if(this.fileTemp){
                if((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') 
                    || (this.fileTemp.type == 'application/vnd.ms-excel')){
                    this.importfxx(this.fileTemp);
                } else {
                    this.$message({
                        type:'warning',
                        message:'附件格式错误，请删除后重新上传！'
                    })
                }
            } else {
                this.$message({
                    type:'warning',
                    message:'请上传附件！'
                })
            }
        },
        //超出最大上传文件数量时的处理方法
        handleExceed(){
            this.$message({
                type:'warning',
                message:'超出最大上传文件数量的限制！'
            })
            return;
        },
        //移除文件的操作方法
        handleRemove(file,fileList){
            this.fileTemp = null
        },
                 importfxx(obj) {
            let _this = this;
            let inputDOM = this.$refs.inputer;
            // 通过DOM取文件数据
 
            this.file = event.currentTarget.files[0];
 
            var rABS = false; //是否将文件读取为二进制字符串
            var f = this.file;
 
            var reader = new FileReader();
            //if (!FileReader.prototype.readAsBinaryString) {
            FileReader.prototype.readAsBinaryString = function(f) {
                var binary = "";
                var rABS = false; //是否将文件读取为二进制字符串
                var pt = this;
                var wb; //读取完成的数据
                var outdata;
                var reader = new FileReader();
                reader.onload = function(e) {
                    var bytes = new Uint8Array(reader.result);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    //此处引入，用于解析excel
                    var XLSX = require("xlsx");
                    if (rABS) {
                        wb = XLSX.read(btoa(fixdata(binary)), {
                        //手动转化
                        type: "base64"
                        });
                    } else {
                        wb = XLSX.read(binary, {
                        type: "binary"
                        });
                    }
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); 
                    console.log('outdata :>> ', outdata);
                    //outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
                    //此处可对数据进行处理
                    let arr = [];
                    outdata.map(v => {
                        let obj = {};
                        obj.bookNumber = v['图书编号'];
                        obj.bookName = v['图书名称'];
                        obj.author = v['图书作者'];
                        obj.press = v['图书出版社'];
                        obj.bookCategory = v['图书类别'];
                          obj.publishTime = v['图书上架时间']
                        arr.push(obj);
                    });
                    _this.inputList=arr;
                    _this.inputListLen=arr.length;
                    console.log('arr :>> ', arr);
                    return arr;
                };
                reader.readAsArrayBuffer(f);
            };
            if (rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
        },
    //查询
    search() {
      let obj = this.invalidProperty(this.bookSearchForm);
      const { bookName, bookCategory } = this.bookSearchForm;
      this.requestParams.SJMC = bookName;
      this.requestParams.LBID = bookCategory;
      this.init();
    },
    clear() {
      this.bookSearchForm = {};
      this.requestParams = {
        limit: 10,
        start: 0,
        PCID: this.activeName,
        SJMC: "",
        SJLB: null
      };
      this.invalidProperty(this.requestParams);
      this.init();
    },
    invalidProperty(obj) {
      let b = {};
      for (let key in obj) {
        if (obj[key]) {
          b[key] = obj[key];
        }
      }
      return b;
    },
    //勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log("multipleSelection ", this.multipleSelection);
    },
    //上传图片压缩包
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },

    handleAvatarSuccess(res, file) {
      this.bookTableForm.bookImageUrl = URL.createObjectURL(file.raw);
      this.$refs.bookimg.clearValidate();
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传封面图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 表头样式设置
    headClass() {
      return "text-align: center;background:#f7f7f7;";
    },
    // 表格样式设置
    rowClass() {
      return "text-align: center;";
    },
    //page事件
    handleSizeChange(val) {
      this.requestParams.limit = val;
      this.init();
    },
    handleCurrentChange(val) {
       this.currentPage=val;
      this.requestParams.start = (val - 1) * this.requestParams.limit;
      this.init();
    },
    //新增
    addRow() {
      this.dialogFormVisible = true;
      this.upper = false;
    },
    //修改
    updateRow() {
      if (this.multipleSelection.length > 1) {
        this.$message.error("只能选择一条数据进行修改");
      } else if (this.multipleSelection.length == 0) {
        this.$message.error("请在选择一条数据后修改");
      } else if (this.multipleSelection.length == 1) {
        this.dialogFormVisible = true;
        this.upper = true;
        this.bookTableForm = this.multipleSelection[0];
      }
    },
    //删除
    deleteRows() {
      if (this.multipleSelection.length != 0) {
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // this.multipleSelection.map(item => {
            //   this.bookTableData = this.bookTableData.filter(
            //     op => op.bookNumber != item.bookNumber
            //   );
            // });
            let objIds = [];
            this.multipleSelection.map(item => {
              objIds.push(item.SJID);
            });
            this.deleteItem(objIds);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message.error("请勾选数据后再删除");
      }
    },

    async deleteItem(objIds) {
      const res = await delBookInfos(objIds);
      this.$message.success("删除成功！");
      this.init();
    },
    //提交
    sure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const {
            author,
            bookName,
            press,
            bookNumber,
            bookCategory
          } = this.bookTableForm;

          let t3 = this.initTime(publishTime);
          if (this.upper) {
            //修改
            let currentIndex = this.bookTableData.indexOf(
              this.multipleSelection[0]
            );

            let obj = {
              author,
              bookName,
              press,

              bookNumber,
              bookCategory
            };
            this.$set(this.bookTableData, currentIndex, obj);
            this.$set(this.multipleSelection, 0, obj);
            // this.multipleSelection[0]=obj;
          } else {
            //新增
            console.log("add-----");
            let formobj = {
              publishTime: t3,
              author,
              press,
              bookName,
              bookCategory,
              bookNumber: `0000${++this.currentIndex}`
            };
            this.bookTableData.push(formobj);
          }
          this.dialogFormVisible = false;
        } else {
          this.$message.error("请先填写必填项再提交");
          return false;
        }
      });
    },

    //取消
    cacle(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    }
  },
  initTime(date) {
    let time = date.toLocaleString("zh", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    let date2 = time.replace(/\//g, "-"); // 利用正则可以将/换成-的分隔符
    return date2;
  }
};
</script>
<style lang="scss">
.bookManagement {
  padding: 10px;
  background: #f2f2f2;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
}
</style>