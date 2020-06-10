<template>
  <div class="batchManage">
    <el-card class="box-card">
      <el-form ref="form" :model="batchForm" label-width="80px">
        <el-row type="flex" justify="space-between">
          <el-col :span="7">
            <el-form-item label="批次编号:">
              <el-input v-model.trim="batchForm.batchNumber" size="small" placeholder="请输入批次编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="批次名称:">
              <el-input v-model.trim="batchForm.batchName" size="small" placeholder="请输入批次名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="批次状态:">
              <el-select
                v-model="batchForm.batchStatus"
                placeholder="请选择批次状态"
                size="small"
                style="width:230px"
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
          <el-button type="primary" icon="el-icon-s-promotion" size="small" @click="publish">发布</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-refresh-left" size="small" @click="withdraw">撤回</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;margin-top:15px;"
            :stripe="true"
            :cell-style="rowClass"
            :header-cell-style="headClass"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="批次编号" min-width="100">
              <template slot-scope="scope">{{ scope.row.batchNumber }}</template>
            </el-table-column>
            <el-table-column prop="batchName" label="批次名称" width="130" show-overflow-tooltip></el-table-column>
            <el-table-column label="批次状态" min-width="120">
              <template slot-scope="scope">
                <el-tag
                  style="border:none;background: border-box;"
                  :type="scope.row.batchStatus==0?'danger':'success'"
                  effect="plain"
                >{{ scope.row.batchStatus==0?'草稿':'已发布' }}</el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="publishTime" label="发布时间" min-width="120"></el-table-column> -->
            <el-table-column prop="entryTime" label="生效时间" min-width="120"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" min-width="120"></el-table-column>
            <el-table-column prop="author" label="发布人" min-width="120"></el-table-column>
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
      <el-form :model="tableForm" :rules="batchRules" ref="batchForm">
        <el-form-item label="批次名称" :label-width="formLabelWidth" prop="batchName">
          <el-input
            v-model.trim="tableForm.batchName"
            autocomplete="off"
            placeholder="请填写批次名称"
            size="small"
          ></el-input>
        </el-form-item>
      
        <el-form-item label="生效时间" :label-width="formLabelWidth" prop="entryTime">
          <el-date-picker
            v-model="tableForm.entryTime"
            type="datetime"
            placeholder="选择生效时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="结束时间"
          :label-width="formLabelWidth"
          prop="endTime"
          :rules="[
            { required: true, message: '请选择生效时间111', trigger: 'change'},      
            { validator: validateDate, trigger:'change' }
          ]"
        >
          <el-date-picker
            v-model="tableForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="发布人" :label-width="formLabelWidth" prop="author" v-if="upper==false">
          <el-input v-model="tableForm.author" autocomplete="off" size="small"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cacle('batchForm')">取 消</el-button>
        <el-button type="primary" @click="sure('batchForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getList,
  addBatchInfo,
  getBatchInfo,
  deleteBatch,
  batchRecall,
  batchPublish,
  updateBatchInfo
} from "@/api/batch";
import { Col } from "element-ui";
export default {
  data() {
    return {
      options: [
        {
          value: 0,
          label: "草稿"
        },
        {
          value: 1,
          label: "已发布"
        }
      ],
      batchRules: {
        batchName: [
          { required: true, message: "请填写批次名称", trigger: "blur" }
        ],
        author: [{ required: true, message: "请填写发布人", trigger: "blur" }],
        entryTime: [
          { required: true, message: "请选择生效时间", trigger: "change" }
        ]
      },
      total: 0,
      formLabelWidth: "120px",
      dialogFormVisible: false, //控制 modal 显示
      currentPage: 1,
      batchForm: {
        batchNumber: "",
        batchName: "",
        batchStatus: null
      },
      tableForm: {
        batchName: "",
        entryTime: "",
        endTime: "",
        author: ""
      },
      tableData: [],
      multipleSelection: [],
      upper: false,
      params: {
        limit: 10,
        start: 0,
        PCBH: "",
        PCMC: "",
        PCZT: null
      },
      rowContent: []
    };
  },
  watch: {
    dialogFormVisible: function(val, oldVa) {
      if (val == false) {
        this.tableForm = {};
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getBatchList();
    },
    async getBatchList() {
      const paramsobj = this.invalidProperty(this.params);
      let res = await getList(paramsobj);
      const a = res.slice(res.indexOf("rows"), -1); //从开始截取到倒数第二个字符串
      const str = res.substring(res.indexOf("results"), res.indexOf(",rows")); //从某个开始 截取到 某个下标的字符串
      const total = str.substr(str.indexOf(":") + 1); //从某个开始截取到结尾的字符串
      const list = eval(a);
      let arr = list.map(item => {
        let obj = {
          ID: item.ID,
          batchNumber: item.PCBH,
          batchName: item.PCMC,
          batchStatus: Number(item.PCZT), //0:草稿 1：已发布
          entryTime: item.KSSJ,
          endTime: item.JSSJ,
          author: item.CJR_NAME
        };
        return obj;
      });
      this.tableData = arr;
      this.total = Number(total);
    },
    //查询
    search() {
      let obj = this.invalidProperty(this.batchForm);
      const { batchNumber, batchName, batchStatus } = this.batchForm;
      this.params.PCBH = batchNumber;
      this.params.PCMC = batchName;
      this.params.PCZT = batchStatus;
      this.init();
    },
    clear() {
      this.batchForm = {};
      this.params = {
        limit: 10,
        start: 0
      };
      this.init();
    },
    invalidProperty(obj) {
      let b = {};
      for (let key in obj) {
        if (obj[key] || obj[key] == 0) {
          b[key] = obj[key];
        }
      }
      return b;
    },
    //时间校验
    validateDate(rule, value, callback) {
      if (value) {
        let end = new Date(value).getTime();
        let start = new Date(this.tableForm.entryTime).getTime();
        if (end < start) {
          callback(new Error("结束时间要大于生效时间"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      this.params.limit = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.params.start = (val - 1) * this.params.limit;
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
        let nouper = false;
        this.multipleSelection.map(item => {
          if (item.batchStatus == 1) {
            nouper = true;
          }
        });
        if (nouper == false) {
          this.dialogFormVisible = true;
          this.upper = true;
          this.tableForm = this.multipleSelection[0];
          this.rowInfo({ ID: this.multipleSelection[0].ID });
        } else {
          this.$message.error("已发布的批次无法修改，若要修改请先修改批次状态");
        }
      }
    },
    async rowInfo(id) {
      const res = await getBatchInfo(id);
      const str = res.slice(res.indexOf("data"), -1);
      const str2 = str.substr(str.indexOf(":") + 1);
      const str3 = str2.slice(1, -1).split(",");
      let arr = str3.map(item => {
        return item.split(":");
      });
      let obj = {};
      arr.map(item => {
        if (item[0] == "KSSJ" || item[0] == "JSSJ") {
          item[1] = `${item[1]}:${item[2]}:${item[3]}`;
        }

        item[1] = item[1].replace(/"/g, "");
        Object.defineProperty(obj, item[0], {
          value: item[1],
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj;
      });
      this.rowContent = obj;
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
            let nodelete = false;
            let objIds = [];
            this.multipleSelection.map(item => {
              objIds.push(item.ID);
              if (item.batchStatus == 1) {
                nodelete = true;
              }
            });
            if (nodelete == false) {
              this.deleteItem(objIds);
            } else {
              this.$message.error(
                "已发布的批次无法删除，若要删除请先修改批次状态"
              );
            }
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
      const res = await deleteBatch(objIds);
      this.$message.success("删除成功！");
      this.init();
    },
    //发布
    publish() {
      if (this.multipleSelection.length > 1) {
        this.$message.error("只能选择一条数据进行发布");
      } else if (this.multipleSelection.length == 0) {
        this.$message.error("请在选择一条数据后发布");
      } else if (this.multipleSelection.length == 1) {
        let id = { ID: this.multipleSelection[0].ID };
        this.publishItem(id);
      }
    },
    async publishItem(id) {
      const res = await batchPublish(id);
      this.init();
      this.$message.success("发布成功！");
    },

    //撤回
    withdraw() {
      if (this.multipleSelection.length > 1) {
        this.$message.error("只能选择一条数据进行撤回");
      } else if (this.multipleSelection.length == 0) {
        this.$message.error("请在选择一条数据后撤回");
      } else if (this.multipleSelection.length == 1) {
        let id = { ID: this.multipleSelection[0].ID };
        this.RecallItem(id);
      }
    },
    async RecallItem(id) {
      const res = await batchRecall(id);
      this.init();
      this.$message.success("撤回成功！");
    },

    sure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const {
            ID,
            author,
            batchName,
            entryTime,
            endTime,
            batchNumber
          } = this.tableForm;
          let t1 = this.initTime(entryTime);
          let t2 = this.initTime(endTime);
          if (this.upper) {
            //修改
            console.log("upps-----");
            let currentIndex = this.tableData.indexOf(
              this.multipleSelection[0]
            );
            this.rowContent.ID = ID;
            this.rowContent.KSSJ = t1;
            this.rowContent.JSSJ = t2;
            this.rowContent.PCMC = batchName;
            this.updateItem(this.rowContent);
          } else {
            //新增
            console.log("add-----");
            let formobj = {
              KSSJ: t1,
              JSSJ: t2,
              CJR_NAME: author,
              PCMC: batchName
            };
            this.addItem(formobj);
          }
          this.dialogFormVisible = false;
        } else {
          this.$message.error("请先填写必填项再提交");
          return false;
        }
      });
    },
    async addItem(form) {
      const res = await addBatchInfo(form);
      this.$message.success("添加成功！");
      this.init();
    },
    async updateItem(form) {
      const res = await updateBatchInfo(form);
      this.$message.success("修改成功！");
      this.init();
    },
    cacle(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    initTime(t) {
      let d = new Date(t).getTime(new Date(t));
      let time = new Date(d + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 19)
        .replace("T", " ")
        .replace(/\./g, "-");
      return time;
    }
  }
};
</script>
<style lang="scss">
.batchManage {
  padding: 10px;
  background: #f2f2f2;
}
</style>