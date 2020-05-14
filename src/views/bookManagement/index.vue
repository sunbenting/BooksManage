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
            <el-table-column prop="bookName" label="图书名称" width="130"></el-table-column>
            <el-table-column prop="author" label="图书作者" min-width="120"></el-table-column>
            <el-table-column prop="press" label="图书出版社" min-width="120"></el-table-column>
            <el-table-column label="图书类别" min-width="120">
              <template
                slot-scope="scope"
              >{{ scope.row.bookCategory==1?'中文':scope.row.bookCategory==2?'英文':'儿童' }}</template>
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
        <el-form-item label="图书名称" :label-width="formLabelWidth" prop="bookName">
          <el-input
            v-model.trim="bookTableForm.bookName"
            placeholder="请填写图书名称"
            autocomplete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="图书作者" :label-width="formLabelWidth" prop="author">
          <el-input
            v-model.trim="bookTableForm.author"
            placeholder="请填写图书作者"
            autocomplete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="图书出版社" :label-width="formLabelWidth" prop="press">
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
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">上传图片压缩包文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传zip/rar文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cacle('bookTableForm')">取 消</el-button>
        <el-button type="primary" @click="sure('bookTableForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
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
      fileList:[],
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
        ]
      },

      options: [
        {
          value: 1,
          label: "中文"
        },
        {
          value: 2,
          label: "英文"
        },
        {
          value: 3,
          label: "儿童"
        }
      ],
      options1: [
        {
          value: 1,
          label: "中文"
        },
        {
          value: 2,
          label: "英文"
        },
        {
          value: 3,
          label: "儿童"
        }
      ],
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
        bookCategory: "" //图书类别
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
        SJLB: null
      }
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
    async initTab() {
      const res = await getBatchTab();
      const { list } = this.initRes(res);
      this.tablist = list;
      this.activeName = list[0].ID;
      this.requestParams.PCID = this.activeName;
      this.getBooksList();
      this.getBooksCategary();
    },
    async getBooksCategary(){
      const res=await getSjlb();
      const {list}=this.initRes(res);
    let op= list.map(item=>{
        let obj={
          label:item.LBMC,
          value:item.LBID
        }
       return obj;
      })
      this.options=op;
      console.log('op :>> ', op);
      console.log('list :>> ', list);
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
          bookCategory: Number(item.SJLB),
          publishTime: item.CJSJ || "暂无数据",
          press: item.SJCBS,
          author: item.SJZZ
        };
        return obj;
      });
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
      console.log("表格 :>> ");
    },
    //查询
    search() {
      let obj = this.invalidProperty(this.bookSearchForm);
      const { bookName, bookCategory } = this.bookSearchForm;
      this.requestParams.SJMC = bookName;
      this.requestParams.SJLB = bookCategory;
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log("multipleSelection ", this.multipleSelection);
    },
    //上传图片压缩包
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
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
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
            publishTime,
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
              publishTime: this.initTime(publishTime),
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
}
</style>