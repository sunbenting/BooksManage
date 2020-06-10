<template>
  <div class="bookManagement">
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane :label="item.PCMC" :name="item.ID" v-for="(item) in tablist" :key="item.ID">
          <el-form ref="form" :model="bookSearchForm" label-width="80px">
            <el-row>
              <el-col :span="8">
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
              <el-col :span="2" :offset="1">
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
        <el-col :span="3" style="margin-right: 8px;">
          <el-button type="primary" icon="el-icon-upload2" size="small" @click="exportExcel">批量导入数据</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-upload2" size="small" @click="exportImgs">批量上传封面</el-button>
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
            :header-cell-style="headClass"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column align="center" label="ISBN" width="150" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.bookNumber }}</template>
            </el-table-column>
            <el-table-column
              align="left"
              prop="bookName"
              label="图书名称"
              min-width="230"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              align="center"
              prop="author"
              label="作者"
              min-width="160"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              align="left"
              prop="press"
              label="出版社"
              min-width="160"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" label="图书大类" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.bookCategory }}</template>
            </el-table-column>
            <el-table-column align="center" label="图书小类" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.LBXQ }}</template>
            </el-table-column>
            <el-table-column
              prop="publishTime"
              label="图书上架时间"
              min-width="180"
              show-overflow-tooltip
              align="center"
            ></el-table-column>

            <el-table-column fixed="right" label="操作" width="130">
              <template slot-scope="scope">
                <el-button
                  @click="todetail(scope.row)"
                  type="text"
                  size="small"
                  style="float:left;"
                >查看详情</el-button>
                <el-button @click="uplodadImg(scope.row)" type="text" size="small">上传封面</el-button>
              </template>
            </el-table-column>
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
    <el-dialog :title="upper==false?'新增':'修改'" :visible.sync="dialogFormVisible" width="70%">
      <el-form :model="bookTableForm" :rules="bookRules" ref="bookTableForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="ISBN:" :label-width="formLabelWidth" prop="bookNumber">
              <el-input
                v-model.trim="bookTableForm.bookNumber"
                placeholder="请填写ISBN"
                autocomplete="off"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图书名称:" :label-width="formLabelWidth" prop="bookName">
              <el-input
                v-model.trim="bookTableForm.bookName"
                placeholder="请填写图书名称"
                autocomplete="off"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="作者:" :label-width="formLabelWidth" prop="author">
              <el-input
                v-model.trim="bookTableForm.author"
                placeholder="请填写作者"
                autocomplete="off"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版社:" :label-width="formLabelWidth" prop="press">
              <el-input
                v-model.trim="bookTableForm.press"
                placeholder="请填写出版社"
                autocomplete="off"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="图书大类:" :label-width="formLabelWidth" prop="bookCategory">
              <el-select v-model="bookTableForm.bookCategory" placeholder="请选择图书类别" size="small">
                <el-option
                  v-for="item in optionAdd"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图书小类:" :label-width="formLabelWidth" prop="LBXQ">
              <el-input v-model.trim="bookTableForm.LBXQ" placeholder="请填写图书小类"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="作者简介:" :label-width="formLabelWidth" prop="ZZJJ">
              <el-input
                type="textarea"
                v-model.trim="bookTableForm.ZZJJ"
                placeholder="请填写作者简介"
                autocomplete="off"
                size="medium"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容简介:" :label-width="formLabelWidth" prop="NRJJ">
              <el-input
                type="textarea"
                v-model.trim="bookTableForm.NRJJ"
                placeholder="请填写内容简介"
                size="medium"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cacle('bookTableForm')">取 消</el-button>
        <el-button type="primary" @click="sure('bookTableForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传封面压缩包 -->
    <el-dialog title="上传压缩包文件" :visible.sync="rardilog" width="30%">
      <el-upload
        action="https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"
        :before-upload="beforeFileUpload"
        :on-remove="rarRemove"
        :on-success="rarSuccess"
        :on-error="rarFileError"
        accept="aplication/zip, aplication/rar"
        :limit="1"
        :file-list="rarList"
      >
        <el-button size="small" type="primary">上传附件</el-button>
      </el-upload>
      <div v-show="progressFlag" class="head-img">
        <el-progress
          :text-inside="true"
          :stroke-width="14"
          :percentage="progressPercent"
          status="success"
        ></el-progress>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="rardilog = false">取 消</el-button>
        <el-button type="primary" @click="rarSure('imgForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 上传单个封面 -->
    <el-dialog title="上传封面" :visible.sync="imgdilog" width="30%">
      <el-form v-model="imgForm" ref="imgForm" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="图书封面:"
              :label-width="formLabelWidth"
              prop="bookImageUrl"
              ref="bookimg"
            >
              <el-upload
                v-model="imgForm.bookImageUrl"
                class="avatar-uploader"
                action="https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"
                :show-file-list="false"
                :on-success="uploadSuccessHandle"
                :before-upload="beforeAvatarUpload"
                accept="image/jpeg, image/jpg, image/png"
              >
                <img v-if="imgForm.bookImageUrl" :src="imgForm.bookImageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="el-upload__tip" style="margin-left: 40px;">请上传png、jpg及jpeg格式图片(大小2M以下)</div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="imgdilog = false">取 消</el-button>
        <el-button type="primary" @click="imgdilogSure('imgForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog
      title="查看详情"
      :visible.sync="seedilog"
      width="70%"
      :closeOnClickModal="closeOnClickModal"
    >
      <el-form :model="watchForm" disabled>
        <el-row>
          <el-col :span="12">
            <el-form-item label="ISBN:" :label-width="formLabelWidth" prop="bookNumber">
              <el-input
                v-model.trim="watchForm.bookNumber"
                placeholder="请填写ISBN"
                autocomplete="off"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图书名称:" :label-width="formLabelWidth" prop="bookName">
              <el-input
                v-model.trim="watchForm.bookName"
                placeholder="请填写图书名称"
                autocomplete="off"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="作者:" :label-width="formLabelWidth" prop="author">
              <el-input
                v-model.trim="watchForm.author"
                placeholder="请填写作者"
                autocomplete="off"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版社:" :label-width="formLabelWidth" prop="press">
              <el-input
                v-model.trim="watchForm.press"
                placeholder="请填写出版社"
                autocomplete="off"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="图书大类:" :label-width="formLabelWidth" prop="bookCategory">
              <el-select v-model="watchForm.bookCategory" placeholder="请选择图书类别" size="small">
                <el-option
                  v-for="item in optionAdd"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图书小类:" :label-width="formLabelWidth" prop="LBXQ">
              <el-input v-model.trim="watchForm.LBXQ" placeholder="请填写图书小类"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="作者简介:" :label-width="formLabelWidth" prop="ZZJJ">
              <el-input
                type="textarea"
                v-model.trim="watchForm.ZZJJ"
                placeholder="暂无数据"
                autocomplete="off"
                size="medium"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容简介:" :label-width="formLabelWidth" prop="NRJJ">
              <el-input
                type="textarea"
                v-model.trim="watchForm.NRJJ"
                placeholder="暂无数据"
                size="medium"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="图书封面:"
              :label-width="formLabelWidth"
              prop="bookImageUrl"
              ref="bookimg"
            >
              <img :src="watchForm.bookImageUrl" alt style="width:120px;height:120px" />
              
            </el-form-item>
          </el-col>
        </el-row>-->
      </el-form>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="40%">
      <el-row type="flex" justify="space-around">
        <el-col :span="6">
          <el-button type="primary" @click="downloadtp" icon="el-icon-download">下载模板</el-button>
        </el-col>
        <el-col :span="6">
          <!--limit:最大上传数，on-exceed：超过最大上传数量时的操作  -->
          <el-upload
            class="upload-demo"
            action
            :on-change="handleChange"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :limit="limitUpload"
            accept=".xlsx, application/vnd.openxmlformats-    
        officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :auto-upload="false"
          >
            <el-button type="success"  icon="el-icon-upload">上传文件</el-button>
          </el-upload>
            <div v-show="importProgressFlag" class="head-img">
        <el-progress
          :text-inside="true"
          :stroke-width="14"
          :percentage="importProgressPercent"
          status="success"
        ></el-progress>
      </div>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureimport">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import {
  getBatchTab,
  getSjlb,
  getBookList,
  getBookInfo,
  addBookItem,
  delBookInfos,
  updateBookItem,
  importExcel,
  uploadImg
} from "@/api/booksManage";
import { Col } from "element-ui";
export default {
  data() {
    return {
      importProgressPercent:0,
      importProgressFlag:false,
      progressFlag: false, //进度条初始值隐藏
      progressPercent: 0, //进度条初始值
      closeOnClickModal: false,
      limitUpload: 1,
      dialogVisible: false,
      seedilog: false,
      fileList: [],
      tablist: [],
      bookRules: {
        bookNumber: [
          { required: true, message: "请填写ISBN", trigger: "blur" }
        ],
        bookName: [
          { required: true, message: "请填写图书名称", trigger: "blur" }
        ],
        press: [{ required: true, message: "请填写出版社", trigger: "blur" }],
        author: [{ required: true, message: "请填写作者", trigger: "blur" }],
        bookCategory: [
          { required: true, message: "请选择图书类别", trigger: "change" }
        ]
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
        press: "", //出版社
        author: "", //作者
        bookCategory: "", //图书类别
        LBXQ: "",
        PCID: this.activeName,
        NRJJ: "",
        ZZJJ: "",
        CJR: "",
        CJR_NAME: "",
        GXR: "",
        GXSJ: "",
        SJID: ""
      },
      imgForm: {
        bookTableForm: ""
      },
      watchForm: {},
      bookTableData: [],
      currentIndex: 4,
      multipleSelection: [],
      upper: false,
      requestParams: {
        limit: 10,
        start: 0,
        ID: this.activeName,
        SJMC: "",
        LBID: null
      },
      outlist: [], //导出数据列表
      inputList: [], // 导入数据
      inputListLen: 0, // 导入数据长度
      imgdilog: false, //上传图书封面弹窗显示
      imgfile: "",
      imgsjbh: "",
      rardilog: false,
      rarList: [],
      rarfile: ""
    };
  },
  watch: {
    dialogFormVisible: function(val, oldVa) {
      if (val == false) {
        this.bookTableForm = {};
        this.$refs.bookTableForm.resetFields();
      }
    },
    rardilog:function(val,oldval){
      if(val==false){
        this.progressFlag=false;
        this.progressPercent=0;
        this.rarList=[];
      }
    },
    dialogVisible:function(val,oldval){
      if(val==false){
        this.importProgressFlag=false;
        this.importProgressPercent=0;
        this.fileTemp = null;
        // this.rarList=[];
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
    downloadtp() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../vendor/Export2Excel");
        const tHeader = [
          "ISBN",
          "图书名称",
          "作者",
          "作者简介",
          "内容简介",
          "出版社",
          "图书大类",
          "图书小类"
        ]; //对应表格输出的title
        const filterVal = [
          "bookNumber",
          "bookName",
          "author",
          "ZZJJ",
          "NRJJ",
          "press",
          "bookCategory",
          "LBXQ"
        ]; // 对应表格输出的数据
        const list = this.outlist;
        console.log("this.bll :>> ", this.outlist);
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "图书模板(excel)"); //对应下载文件的名字
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    // upfile() {},
    async initTab() {
      const res = await getBatchTab();
      const { list } = this.initRes(res);
      this.tablist = list;
      this.activeName = list[0].ID;
      this.requestParams.ID = this.activeName;
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
          author: item.SJZZ,
          LBXQ: item.LBXQ,
          NRJJ: item.NRJJ,
          ZZJJ: item.ZZJJ,
          CJR: item.CJR,
          CJR_NAME: item.CJR_NAME,
          GXR: item.GXR,
          GXSJ: item.GXSJ,
          fmimg: false
        };
        return obj;
      });
      let arr2 = [
        {
          bookNumber: "",
          bookName: "",
          author: "",
          ZZJJ: "",
          NRJJ: "",
          press: "",
          bookCategory: "",
          LBXQ: ""
        }
      ];
      this.outlist = arr2;
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
      this.dialogVisible = true;
    },
    //上传文件时处理方法
    handleChange(file, fileList) {
      this.fileTemp = file.raw;
      if (this.fileTemp) {
        if (
          this.fileTemp.type ==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          this.fileTemp.type == "application/vnd.ms-excel" ||
          this.fileTemp.type == ".xlsx"
        ) {
          this.importfxx(this.fileTemp);
        } else {
          this.$message({
            type: "warning",
            message: "附件格式错误，请删除后重新上传！"
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请上传填好的模板表格！"
        });
      }
    },
    //超出最大上传文件数量时的处理方法
    handleExceed() {
      this.$message({
        type: "warning",
        message: "超出最大上传文件数量的限制！"
      });
      return;
    },
    //移除文件的操作方法
    handleRemove(file, fileList) {
      this.fileTemp = null;
    },
    importfxx(obj) {
      let _this = this;
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      this.file = event.currentTarget.files[0];
    },
    sureimport() {
      let formData = new FormData();
      formData.append("FILE", this.file);
      formData.append("pcid", this.activeName);
      let that=this;
      // this.importdata(formData);
      // axios.post('/api/tsglAction.do?method=uploadFile',params)
      this.$axios({
        url: "/union-web/tsglAction.do?method=uploadFile",
        method: "post",
        data: formData,
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          //进度条
          that.importProgressFlag=true;
          that.importProgressPercent =
            ((progressEvent.loaded / progressEvent.total) * 100)-1 | 0;
        }
      })
        .then(res => {
          console.log("sureimport :>> ", res);
          if (res.status == 200 && that.importProgressPercent === 99) {
            that.$message.success("上传成功！");
             that.init();
            that.importProgressPercent = 100;
            that.dialogVisible=false;    
          }
        })
        .catch(error => {
          that.importProgressFlag = true;
          that.importProgressPercent = 99;
          that.$message({
            message: "上传失败！",
            type: "error"
          });
        });
    },
    async importdata(data) {
      const res = await importExcel(data);
      if (res) {
        this.init();
        this.$message.success("导入成功！");
        this.dialogVisible = false;
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
        ID: this.activeName,
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
    //批量上传封面
    exportImgs() {
      this.rardilog = true;
    },
    progresshandle(file) {
      console.log("file :>> ", file);
    },
    rarRemove(file, fileList) {
      this.rarList = [file.raw];
      this.rarfile = file.raw;
      this.fileList= [file.raw];
      console.log("rarRemove :>> ", file);
    },
    rarFileError(err, file, fileList) {
      console.log("err, file, fileList) :>> ", err, file, fileList);
    },
    rarSuccess(response, file, fileList) {

      console.log("res rarSuccess :>> ", response, file, fileList);
      this.$forceUpdate()
    },
    rarSure() {
      // this.rardilog=false;
      let formData = new FormData();
      formData.append("file", this.rarfile);
      formData.append("pcid", this.activeName);
      let that = this;
      this.$axios({
        url: "/union-web/tsglAction.do?method=uploadAttachment",
        method: "post",
        data: formData,
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          //进度条
          that.progressFlag=true;
          that.progressPercent =
            ((progressEvent.loaded / progressEvent.total) * 100)-1 | 0;
        }
      })
        .then(res => {
          console.log("res666 :>> ", res);
          if (res.status == 200 && that.progressPercent === 99) {
            that.$message.success("上传成功！");
            that.progressPercent = 100;
            that.rardilog=false;    
          }
        })
        .catch(error => {
          that.progressFlag = false;
          that.progressPercent = 0;
          that.$message({
            message: "上传失败！",
            type: "error"
          });
        });

      // this.upfm(formData);
      // this.axios.post('/union-web/tsglAction.do?method=uploadAttachment',params)
      console.log("this.$axios :>> ", this.$axios);
    },
    beforeFileUpload(file) {
      const isZip = file.name.endsWith(".zip") || file.name.endsWith(".rar");
      if (!isZip) {
        this.$message.error("请选择zip或rar文件!");
        this.rarList = []; //你那里的这个如果是数组就置为空
        return false;
      }
      this.rarList = [file];
      return false; // 若返回 false 或者返回 Promise 且被 reject，则停止上传。
      // 如果你是自己实现上传功能就要return false 反之不需要
    },

    //上传封面图片
    uploadSuccessHandle(res, file) {
      this.imgfile = file.raw;
      console.log("res file :>> ", res, file);
      this.imgForm.bookImageUrl = URL.createObjectURL(file.raw);
      this.$forceUpdate();
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传封面图片大小不能超过 2MB!");
      }
      return isLt2M;
    },

    //上传封面
    uplodadImg(row) {
      this.imgdilog = true;
      this.imgsjbh = row.bookNumber;
      console.log("row :>> ", row);
    },
    //上传图片确定事件
    imgdilogSure() {
      // this.imgdilog=false;
      if (!this.imgForm.bookImageUrl) {
        this.$message.error("请先上传图书封面再提交！");
      } else {
        let formData = new FormData();
        formData.append("file", this.imgfile);
        formData.append("pcid", this.activeName);
        formData.append("sjbh", this.imgsjbh);
        this.upfm(formData);
        console.log("formData :>> ", formData);
      }
    },
    async upfm(obj) {
      const res = await uploadImg(obj);
      if (res) {
        this.imgdilog = false;
        this.rardilog = false;
        this.$message.success("上传成功！");
        this.bookTableData.map(item => {
          if (item.bookNumber == this.imgsjbh) {
            item.fmimg = true;
          }
        });
      }
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
      this.currentPage = val;
      this.requestParams.start = (val - 1) * this.requestParams.limit;
      this.init();
    },
    //新增
    addRow() {
      this.dialogFormVisible = true;
      this.upper = false;
    },
    //详情
    todetail(row) {
      this.seedilog = true;
      this.watchForm = row;
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
            bookCategory,
            LBXQ,
            PCID,
            NRJJ,
            ZZJJ,
            CJR,
            CJR_NAME,
            GXR,
            GXSJ,
            SJID,
            publishTime
          } = this.bookTableForm;

          if (this.upper) {
            //修改
            let str;
            this.optionAdd.map(item => {
              if (item.label == bookCategory) {
                str = item.value;
              }
            });
            console.log("str :>> ", str);
            let obj = {
              SJID,
              SJBH: bookNumber,
              SJMC: bookName,
              SJZZ: author,
              ZZJJ,
              NRJJ,
              SJCBS: press,
              LBID: str,
              PCID: this.activeName,
              LBXQ,
              CJR,
              CJR_NAME,
              GXR,
              GXSJ
            };
            this.upperdata(obj);
          } else {
            //新增
            console.log("add-----");
            let formobj = {
              SJBH: bookNumber,
              SJMC: bookName,
              SJZZ: author,
              ZZJJ,
              NRJJ,
              SJCBS: press,
              LBID: bookCategory,
              PCID: this.activeName,
              LBXQ,
              CJR,
              CJR_NAME,
              GXR,
              GXSJ
            };
            console.log("this. :>> ", formobj, this.activeName);
            this.addData(formobj);
          }
          this.dialogFormVisible = false;
        } else {
          this.$message.error("请先填写必填项再提交");
          return false;
        }
      });
    },
    async addData(obj) {
      const res = await addBookItem(obj);
      if (res) {
        this.init();
        this.$message.success("添加成功");
      }
    },
    async upperdata(obj) {
      const res = await updateBookItem(obj);
      if (res) {
        this.init();
        this.$message.success("修改成功！");
      }
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
.el-textarea__inner {
  min-height: 80px !important;
}
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