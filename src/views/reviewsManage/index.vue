<template>
  <div class="reviewsManage">
    <el-card class="box-card">
      <el-form ref="form" :model="reviewsSearchForm" label-width="80px">
        <el-row type="flex" justify="space-between">
          <el-col :span="7">
            <el-form-item label="图书名称:">
              <el-input
                v-model.trim="reviewsSearchForm.bookName"
                size="small"
                placeholder="请输入图书名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="批次名称:">
              <el-input
                v-model.trim="reviewsSearchForm.reviewsName"
                size="small"
                placeholder="请输入批次名称"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <el-form-item label="评论状态:">
              <el-select
                v-model="reviewsSearchForm.commentStatus"
                placeholder="请选择评论状态"
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
        <el-col :span="2" style="margin-right:20px">
          <el-button type="primary" icon="el-icon-check" size="small" @click="publish">审核通过</el-button>
        </el-col>
        <el-col :span="2" style="margin-right:20px">
          <el-button type="primary" icon="el-icon-refresh-left" size="small" @click="withdraw">审核撤回</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-star-off" size="small">奖励</el-button>
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
            
            <el-table-column prop="bookName" label="图书名称" min-width="120"></el-table-column>
            <el-table-column prop="batchActivity" label="批次活动" min-width="120"></el-table-column>
            <el-table-column prop="commentator" label="评论人" min-width="120"></el-table-column>
            <el-table-column prop="comments" label="评论内容" min-width="120"></el-table-column>
            <el-table-column label="评论状态" min-width="120">
              <template slot-scope="scope">
                <el-tag
                  style="border:none;background: border-box;"
                  :type="scope.row.commentStatus==0?'error':'success'"
                  effect="plain"
                >{{ scope.row.commentStatus==0?'审核中':'通过' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reviewer" label="审核人" min-width="120"></el-table-column>
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
      <el-form :model="tableForm" :rules="reviewsRules" ref="reviewsForm">
        <el-form-item label="批次名称" :label-width="formLabelWidth" prop="reviewsName">
          <el-input
            v-model.trim="tableForm.reviewsName"
            autocomplete="off"
            placeholder="请填写批次名称"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="发布时间" :label-width="formLabelWidth" prop="publishTime">
          <el-date-picker
            v-model="tableForm.publishTime"
            type="date"
            placeholder="选择发布时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="生效时间" :label-width="formLabelWidth" prop="entryTime">
          <el-date-picker
            v-model="tableForm.entryTime"
            type="date"
            placeholder="选择生效时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth" prop="endTime">
          <el-date-picker v-model="tableForm.endTime" type="date" placeholder="选择结束时间" size="small"></el-date-picker>
        </el-form-item>
        <el-form-item label="发布人" :label-width="formLabelWidth" prop="author">
          <el-input v-model="tableForm.author" autocomplete="off" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cacle('reviewsForm')">取 消</el-button>
        <el-button type="primary" @click="sure('reviewsForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Col } from "element-ui";
export default {
  data() {
    return {
      options: [
        {
          value: 0,
          label: "审核中"
        },
        {
          value: 1,
          label: "通过"
        }
      ],
      reviewsRules: {
        reviewsName: [
          { required: true, message: "请填写批次名称", trigger: "blur" }
        ],

        author: [{ required: true, message: "请填写发布人", trigger: "blur" }],

        publishTime: [
          { required: true, message: "请选择发布时间", trigger: "change" }
        ],
        entryTime: [
          { required: true, message: "请选择生效时间", trigger: "change" }
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" }
        ]
      },
      total: 0,
      formLabelWidth: "120px",
      dialogFormVisible: false, //控制 modal 显示
      currentPage: 1,
      reviewsSearchForm: {
        bookName: "",
        reviewsName: "",
        commentStatus: ""
      },
      tableForm: {
        reviewsName: "",

        publishTime: "",
        entryTime: "",
        endTime: "",
        author: ""
      },
      tableData: [
        {
   
          bookName: '钢铁是怎样炼成的1', //0:草稿 1：已发布
          batchActivity: "2020夏季读书节1",
          commentator: "张三",
          comments: "只有战胜困难，才能创造奇迹1",
          commentStatus: 0,
          reviewer:'李四'
        },
       {
   
          bookName: '钢铁是怎样炼成的2', //0:草稿 1：已发布
          batchActivity: "2020夏季读书节2",
          commentator: "张三",
          comments: "只有战胜困难，才能创造奇迹2",
          commentStatus: 0,
          reviewer:'李四'
        },
         {
   
          bookName: '钢铁是怎样炼成的3', //0:草稿 1：已发布
          batchActivity: "2020夏季读书节3",
          commentator: "张三",
          comments: "只有战胜困难，才能创造奇迹3",
          commentStatus: 1,
          reviewer:'李四'
        },
         {
   
          bookName: '钢铁是怎样炼成的4', //0:草稿 1：已发布
          batchActivity: "2020夏季读书节4",
          commentator: "张三",
          comments: "只有战胜困难，才能创造奇迹4",
          commentStatus: 1,
          reviewer:'李四'
        }
      ],
          initData: [
         {
   
          bookName: '钢铁是怎样炼成的1', //0:草稿 1：已发布
          batchActivity: "2020夏季读书节1",
          commentator: "张三",
          comments: "只有战胜困难，才能创造奇迹1",
          commentStatus: 0,
          reviewer:'李四'
        },
       {
   
          bookName: '钢铁是怎样炼成的2', //0:草稿 1：已发布
          batchActivity: "2020夏季读书节2",
          commentator: "张三",
          comments: "只有战胜困难，才能创造奇迹2",
          commentStatus: 0,
          reviewer:'李四'
        },
         {
   
          bookName: '钢铁是怎样炼成的3', //0:草稿 1：已发布
          batchActivity: "2020夏季读书节3",
          commentator: "张三",
          comments: "只有战胜困难，才能创造奇迹3",
          commentStatus: 1,
          reviewer:'李四'
        },
         {
   
          bookName: '钢铁是怎样炼成的4', //0:草稿 1：已发布
          batchActivity: "2020夏季读书节4",
          commentator: "张三",
          comments: "只有战胜困难，才能创造奇迹4",
          commentStatus: 1,
          reviewer:'李四'
        }
      ],
     
      currentIndex: 4,
      multipleSelection: [],
      upper: false
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
      this.total = this.tableData.length;
    },
    //查询
    search() {
      console.log(this.reviewsSearchForm);
      let obj = this.invalidProperty(this.reviewsSearchForm);
   
      if (obj.reviewsName && !obj.bookName) {
        this.tableData = this.tableData.filter(
          item => item.reviewsName == obj.reviewsName
        );
      } else if (!obj.reviewsName && obj.bookName) {
        this.tableData = this.tableData.filter(
          item => item.bookName == obj.bookName
        );
      } else if (obj.reviewsName && obj.bookName) {
        this.tableData = this.tableData.filter(
          item =>
            item.bookName == obj.bookName &&
            obj.reviewsName == obj.reviewsName
        );
      } else {
        this.tableData = this.initData;
      }
         if(obj.commentStatus){
         this.tableData = this.tableData.filter(
          item => item.commentStatus == obj.commentStatus
        );
      }
    },
    clear() {
      this.reviewsSearchForm = {};
      this.tableData = this.initData;
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
      console.log("object :>> ", this.multipleSelection);
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
        this.tableForm = this.multipleSelection[0];
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
            this.multipleSelection.map(item => {
              this.tableData = this.tableData.filter(
                op => op.reviewsNumber != item.reviewsNumber
              );
            });
            this.$message({
              type: "success",
              message: "删除成功!"
            });
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
    //发布
    publish() {
      if (this.multipleSelection.length > 1) {
        this.$message.error("只能选择一条数据进行发布");
      } else if (this.multipleSelection.length == 0) {
        this.$message.error("请在选择一条数据后发布");
      } else if (this.multipleSelection.length == 1) {
        this.tableData.forEach(item => {
          if (item.bookName == this.multipleSelection[0].bookName) {
            item.commentStatus = 1;
            this.$message.success("发布成功！");
          }
        });
      }
    },
    //撤回
    withdraw() {
      if (this.multipleSelection.length > 1) {
        this.$message.error("只能选择一条数据进行撤回");
      } else if (this.multipleSelection.length == 0) {
        this.$message.error("请在选择一条数据后撤回");
      } else if (this.multipleSelection.length == 1) {
        this.tableData.forEach(item => {
          if (item.bookName == this.multipleSelection[0].bookName) {
            item.commentStatus = 0;
            this.$message.success("撤回成功！");
          }
        });
      }
    },
    sure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const {
            author,
            reviewsName,
            entryTime,
            endTime,
            publishTime,
            reviewsNumber
          } = this.tableForm;
          let t1 = this.initTime(entryTime);
          let t2 = this.initTime(endTime);
          let t3 = this.initTime(publishTime);
          if (this.upper) {
            //修改
            console.log("upps-----");
            let currentIndex = this.tableData.indexOf(
              this.multipleSelection[0]
            );
            let obj = {
              author,
              reviewsName,
              entryTime: t1,
              endTime: t2,
              publishTime: t3,
              reviewsNumber,
              reviewsStatus: 0
            };
            this.$set(this.tableData, currentIndex, obj);
            this.$set(this.multipleSelection, 0, obj);
          } else {
            //新增
            console.log("add-----");
            let formobj = {
              entryTime: t1,
              endTime: t2,
              publishTime: t3,
              author,
              reviewsName,
              reviewsNumber: `0000${++this.currentIndex}`
            };
            this.tableData.push(formobj);
          }
          this.dialogFormVisible = false;
        } else {
          this.$message.error("请先填写必填项再提交");
          return false;
        }
      });
    },

    cacle(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
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
  }
};
</script>
<style lang="scss">
.reviewsManage {
  padding: 10px;
  background: #f2f2f2;
}
</style>