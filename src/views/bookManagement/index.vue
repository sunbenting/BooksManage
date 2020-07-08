<template>
  <div class="bookManagement">
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane :label="item.PCMC" :name="item.ID" v-for="(item) in tablist" :key="item.ID">
          <el-form ref="form" :model="bookSearchForm" label-width="80px">
            <el-row type="flex" justify="space-between">
                 <el-col :span="7">
                <el-form-item label="ISBN:">
                  <el-input
                    v-model.trim="bookSearchForm.bookNumber"
                    size="small"
                    placeholder="请输入ISBN"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="图书名称:">
                  <el-input
                    v-model.trim="bookSearchForm.bookName"
                    size="small"
                    placeholder="请输入图书名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7" >
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
            </el-row>
            <el-row type="flex" justify="end">
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
        <el-col :span="3" style="margin-right: 8px;">
          <el-button type="primary" icon="el-icon-upload2" size="small" @click="exportExcel">批量导入数据</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-upload2" size="small" @click="exportImgs">批量上传封面</el-button>
        </el-col>
        <!-- <el-col :span="4">
          <el-button type="primary" icon="el-icon-upload2" size="small" @click="uplodadImg(rowyy)">上传单一封面</el-button>
        </el-col>-->
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
            <!-- <el-table-column
              prop="publishTime"
              label="图书上架时间"
              min-width="180"
              show-overflow-tooltip
              align="center"
            ></el-table-column>-->

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
            :page-size="pageSize"
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
                maxlength="20"
                @keyup.native="btKeyUp"
                :disabled="upper==true?true:false"
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
                maxlength="20"
                @keyup.native="btKeyUp"
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
                maxlength="20"
                @keyup.native="btKeyUp"
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
                maxlength="20"
                @keyup.native="btKeyUp"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="图书大类:" :label-width="formLabelWidth" prop="bookCategory">
              <el-select
                v-model="bookTableForm.bookCategory"
                placeholder="请选择图书类别"
                size="small"
                @change="selechangehad"
              >
                <el-option
                  v-for="item in optionAdd"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图书小类:" :label-width="formLabelWidth" prop="LBXQ">
              <el-input
                v-model.trim="bookTableForm.LBXQ"
                placeholder="请填写图书小类"
                maxlength="20"
                @keyup.native="btKeyUp"
              ></el-input>
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
                maxlength="20"
                @keyup.native="btKeyUp"
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
                maxlength="20"
                @keyup.native="btKeyUp"
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
        <el-button type="primary" @click="rarSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 上传单个封面 -->
    <el-dialog title="上传封面" :visible.sync="imgdilog" width="30%">
      <el-upload
        :before-upload="beforeAvatarUpload"
        action="https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"
        :on-remove="uploadRemoveHandle"
        :on-success="uploadSuccessHandle"
        :on-error="imgFileError"
        accept="image/jpeg, image/jpg, image/png"
        :limit="1"
        :file-list="fileImg"
      >
        <el-button size="small" type="primary">上传封面</el-button>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="imgdilog = false">取 消</el-button>
        <el-button type="primary" @click="imgdilogSure">确 定</el-button>
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
                maxlength="20"
                @keyup.native="btKeyUp"
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
                maxlength="20"
                @keyup.native="btKeyUp"
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
                  maxlength="20"
                  @keyup.native="btKeyUp"
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
                maxlength="20"
                @keyup.native="btKeyUp"
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
                maxlength="20"
                @keyup.native="btKeyUp"
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
            <el-button type="success" icon="el-icon-upload">上传文件</el-button>
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
      pageSize: 10,
      importProgressPercent: 0,
      importProgressFlag: false,
      progressFlag: false, //进度条初始值隐藏
      progressPercent: 0, //进度条初始值
      closeOnClickModal: false,
      limitUpload: 1,
      dialogVisible: false,
      seedilog: false,
      fileImg: [], //单个图片文件列表
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
        bookNumber: "",
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
        bookImageUrl: ""
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
      rarfile: "",
      bookstr: 0, //类别传值
      rowyy: {
        CJR: "1111",
        CJR_NAME: "周星星",
        GXR: null,
        GXSJ: null,
        LBXQ: "亲子教育",
        NRJJ:
          "你是否知道，你本人（没错，就是你！）比任何玩具都更让孩子喜欢和着迷呢？↵↵孩子们并不需要智力玩具或者电视节目，他们需要的是你！他们真正看重的是和你在一起的快乐时光，他们需要被重视，需要和父母单独相处而不被打扰的时间，需要和父母建立一生的亲密关系！↵↵在处理与孩子沟通的问题时，控制、放任、贿赂、威胁都是家长们常用的方法。这些不同类型的教育方法都有一个严重的缺陷，那就是可能导致孩子无法以恰当的方式来表达情感和进行沟通，从而无法建立起父母与孩子的亲密关系，孩子也就无法得到家庭关系所带来的归属感和安全感。↵↵与这些方法相比，情感引导的教育方法更加充满关爱，也更符合逻辑和人性。因为只有情感引导型父母才会把这些棘手的情况当成了解孩子内心世界的好机会，并且对孩子的情绪给予同情和理解，在沟通中增进亲子关系，进而提高孩子的情商和沟通能力，为他们将来的成长打下有益的基础。",
        PCID: "421",
        SJID: "1419",
        ZZJJ:
          "金伯莉·布雷恩，最早在世界上提出“情感引导式教育”的儿童教育专家，注册家庭与儿童心理治疗师，同时也是两个孩子的母亲。金伯莉是网络教育电视台www.TheGoToMom.TV的创始人和制作人，同时还是雅虎的节目制作人、雅虎妈妈博客协会的成员。她还经常在加州大学洛杉矶分校开办早期儿童大脑发育和正面管教策略方面的讲座，并担任美国健康和人文服务部下属的SAMHSA分支发起的一项早期儿童心理健康促进活动的社会推广总监。",
        author: "（美）金伯莉·布雷恩",
        bookCategory: "生活",
        bookName: "你就是孩子最好的玩具",
        bookNumber: "202005290058",
        fmimg: false,
        press: "南方出版社",
        publishTime: "2020-07-06 11:40:09"
      },
      imgprogressFlag: false,
      imgprogressPercent: 0
    };
  },
  watch: {
    dialogFormVisible: function(val, oldVa) {
      if (val == false) {
        this.bookTableForm = {
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
        };
        this.$refs.bookTableForm.resetFields();
      }
    },
    rardilog: function(val, oldval) {
      if (val == false) {
        this.progressFlag = false;
        this.progressPercent = 0;
        this.rarList = [];
      }
    },
    dialogVisible: function(val, oldval) {
      if (val == false) {
        this.importProgressFlag = false;
        this.importProgressPercent = 0;
        this.fileTemp = null;
        // this.rarList=[];
      }
    }
  },
  mounted() {
    this.initTab();
  },
  methods: {
    //限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(
        /[`~@#$%^*_\-+=<>?:"{}|,.\/;'\\[\]·~@#￥%……*——\-+={}]/g,
        ""
      );
    },
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

    async initTab() {
      const res = await getBatchTab();
      const { list } = this.initRes(res);
      console.log("list :>> ", list);
      if (list.length == 0) {
        this.$message.error("缺少批次，请先发布批次");
      } else {
        this.tablist = list;
        this.activeName = list[0].ID;
        this.requestParams.ID = this.activeName;
        this.getBooksList();
        this.getBooksCategary();
      }
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
      let that = this;

      this.$axios({
        url: "/union-web/tsglAction.do?method=uploadFile",
        // url: "/api/tsglAction.do?method=uploadFile",
        method: "post",
        data: formData,
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          //进度条
          that.importProgressFlag = true;
          that.importProgressPercent =
            ((progressEvent.loaded / progressEvent.total) * 100 - 1) | 0;
        }
      })
        .then(res => {
          console.log("sureimport :>> ", res.data);
          if (res.data.success == true && that.importProgressPercent === 99) {
            that.$message.success("上传成功！");
            that.init();
            that.importProgressPercent = 100;
            that.dialogVisible = false;
          } else {
            that.importProgressFlag = true;
            that.importProgressPercent = 99;
            that.$message({
              message: res.data.msg,
              type: "error"
            });
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
      const { bookName, bookCategory ,bookNumber} = this.bookSearchForm;
      this.requestParams.SJMC = bookName;
      this.requestParams.SJBH = bookNumber;
      this.requestParams.LBID = bookCategory;
      this.init();
      this.pageSize = 10;
      this.currentPage = 1;
    },
    clear() {
      this.pageSize = 10;
      this.currentPage = 1;
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
      // this.rarList = [file.raw];
      this.rarfile = file.raw;
      this.$forceUpdate();
      console.log("rarRemove :>> ", file, fileList);
    },
    rarFileError(err, file, fileList) {
      console.log("err, file, fileList) :>> ", err, file, fileList);
    },
    rarSuccess(response, file, fileList) {
      console.log("res rarSuccess :>> ", response, file, fileList);
      // this.$forceUpdate();
    },
    rarSure() {
      // this.rardilog=false;
      let formData = new FormData();
      formData.append("file", this.rarfile);
      formData.append("pcid", this.activeName);
      let that = this;
      this.$axios({
        url: "/union-web/tsglAction.do?method=uploadAttachment",
        // url: "/api/tsglAction.do?method=uploadAttachment",
        method: "post",
        data: formData,
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          //进度条
          that.progressFlag = true;
          that.progressPercent =
            ((progressEvent.loaded / progressEvent.total) * 100 - 1) | 0;
        }
      })
        .then(res => {
          console.log("res666 :>> ", res.data);
          if (res.data.success == true && that.progressPercent === 99) {
            that.$message.success("上传成功！");
            that.progressPercent = 100;
            that.rardilog = false;
          } else {
            console.log("res.data :>> ", res.data.msg);
            that.progressFlag = false;
            that.progressPercent = 99;
            that.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(error => {
          that.progressFlag = false;
          that.progressPercent = 99;
          that.$message({
            message: "上传失败！",
            type: "error"
          });
        });
    },
    beforeFileUpload(file) {
      const isZip = file.name.endsWith(".zip") || file.name.endsWith(".rar");
      // if (!isZip) {
      //   this.$message.error("请选择zip或rar文件!");
      //   this.rarList = []; //你那里的这个如果是数组就置为空
      //   return false;
      // }
      this.rarList = [file];
      return false; // 若返回 false 或者返回 Promise 且被 reject，则停止上传。
      // 如果你是自己实现上传功能就要return false 反之不需要
    },
    imgFileError(err, file, fileList) {
      console.log("err--- :>> ", err, file, fileList);
    },
    //上传封面图片
    uploadRemoveHandle(file, fileList) {
      this.imgfile = file.raw;
      console.log("uploadRemoveHandlee :>> ", this.imgfile, file);
      this.$forceUpdate();
    },
    uploadSuccessHandle(response, file, fileList) {
      this.imgfile = file.raw;
      console.log("uploadSuccessHandle ", this.imgfile, file);

      this.$forceUpdate();
    },
    beforeAvatarUpload(file) {
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //    this.fileImg = [];
      //   this.$message.error("上传封面图片大小不能超过 2MB!");
      // }
      this.fileImg = [file];
      return false;
    },

    //上传封面
    uplodadImg(row) {
      this.imgdilog = true;
      this.imgsjbh = row.bookNumber;
      console.log("row :>> ", row);
    },
    //上传图片确定事件
    imgdilogSure() {
      let formData = new FormData();
      formData.append("file", this.imgfile);
      formData.append("pcid", this.activeName);
      formData.append("sjbh", this.imgsjbh);
      this.upfm(formData);
      console.log("formData :>> ", this.imgsjbh);
    },
    async upfm(obj) {
      const res = await uploadImg(obj);
      console.log("res :>> ", res.data);
      if (res.data.success) {
        this.imgdilog = false;
        this.rardilog = false;
        this.init();
        this.$message.success("上传成功！");
        this.bookTableData.map(item => {
          if (item.bookNumber == this.imgsjbh) {
            item.fmimg = true;
          }
        });
      } else {
        this.$message({
          type: "error",
          message: res.data.msg
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
      this.pageSize = val;
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
        } = this.multipleSelection[0];
        this.bookTableForm.author = author;
        this.bookTableForm.bookName = bookName;
        this.bookTableForm.press = press;
        this.bookTableForm.bookNumber = bookNumber;
        this.bookTableForm.LBXQ = LBXQ;
        this.bookTableForm.NRJJ = NRJJ;
        this.bookTableForm.ZZJJ = ZZJJ;
        this.bookTableForm.CJR = CJR;
        this.bookTableForm.CJR_NAME = CJR_NAME;
        this.bookTableForm.GXR = GXR;
        this.bookTableForm.GXSJ = GXSJ;
        this.bookTableForm.SJID = SJID;
        this.bookTableForm.publishTime = publishTime;
        this.optionAdd.map(item => {
          if (item.label == bookCategory) {
            this.bookstr = item.value;
            this.bookTableForm.bookCategory = item.value;
          }
        });
        console.log(" this.bookstr 11 :>> ", this.bookstr);
        console.log(
          "this.multipleSelection[0].bookCategory :>> ",
          this.multipleSelection[0].bookCategory
        );
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
    selechangehad(v) {
      console.log("v :>> ", v);
      // console.log(' this.bookTableForm.bookCategory :>> ',  this.bookTableForm.bookCategory);
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

            // console.log("str :>> ", str);

            this.bookstr = bookCategory;
            console.log("this.bookstr :>> ", this.bookstr);
            let obj = {
              SJID,
              SJBH: bookNumber,
              SJMC: bookName,
              SJZZ: author,
              ZZJJ,
              NRJJ,
              SJCBS: press,
              LBID: this.bookstr,
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
      if (res.success) {
        console.log("res :>> ", res.success);
        this.init();
        this.$message.success("添加成功");
      } else {
        const str = res.substring(res.indexOf("'") + 1, res.indexOf("!')"));
        //  console.log('str :>> ', str);
        this.$message.error(`${str}!`);
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