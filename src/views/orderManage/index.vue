<template>
  <div class="reviewsManage">
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane :label="item.PCMC" :name="item.ID" v-for="(item) in tablist" :key="item.ID">
          <el-form ref="form" :model="reviewsSearchForm" label-width="80px">
            <el-row type="flex" justify="space-between">
              <el-col :span="9">
                <el-form-item label="订单编号:">
                  <el-input
                    v-model.trim="reviewsSearchForm.DDBH"
                    size="small"
                    placeholder="请输入订单编号"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="9">
                <el-form-item label="订单状态:">
                  <el-select
                    v-model="reviewsSearchForm.auditStatus"
                    placeholder="请选择订单状态"
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
        <!-- <el-col :span="2" style="margin-right:20px">
          <el-button type="primary" icon="el-icon-check" size="small" @click="publish">审核通过</el-button>
        </el-col> -->
        <el-col :span="2" style="margin-right:20px">
          <el-button type="primary" icon="el-icon-refresh-left" size="small" @click="withdraw">驳回</el-button>
        </el-col>
        <el-col :span="2" style="margin-right:20px">
          <download-excel
            class="export-excel-wrapper"
            :data="json_data"
            :fields="json_fields"
            :name="orderName"
          >
            <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
            <el-button type="primary" size="small" icon="el-icon-download">导出订单</el-button>
          </download-excel>
          <!-- <el-button type="primary" icon="el-icon-download" size="small" @click="outPass">导出已审核订单</el-button> -->
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
            :header-cell-style="headClass"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column align="center" label="订单编号" min-width="220">
            <template slot-scope="scope">{{ scope.row.orderNumber }}</template>
            </el-table-column>
              <el-table-column align="left" prop="ORG_NAME" label="部门" min-width="220"></el-table-column>
              <el-table-column align="center" prop="ISBN" label="ISBN" min-width="180"></el-table-column>
            <!-- <el-table-column prop="reviewsName" label="批次名称" width="130"></el-table-column> -->
            <el-table-column align="center" prop="bookName" label="图书名称" min-width="220" show-overflow-tooltip></el-table-column>
           <el-table-column align="center" prop="bookNumber" label="订单数量" min-width="80"></el-table-column>
            <el-table-column align="center" prop="submitter" label="提交人" min-width="120"></el-table-column>
           <el-table-column align="center" prop="submitTime" label="提交日期" min-width="150"></el-table-column>
            <el-table-column align="center" label="订单状态" min-width="120">
              <template slot-scope="scope">
                <el-tag
                  style="border:none;background: border-box;"
                  :type="scope.row.auditStatus==1?'success':'danger'"
                  effect="plain"
                >{{ scope.row.auditStatus==1?'已提交':'驳回' }}</el-tag>
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
  </div>
</template>
<script>
import { getBatchTab, getOrderList, checkPass, checkReject,exportDdList } from "@/api/order";
import { Col } from "element-ui";
export default {
  data() {
    return {
      json_fields: {
        "订单编号": "DDBH", //常规字段
        "部门":"ORG_NAME",
        "ISBN":"ISBN",
        "图书名称": "SJMC", //支持嵌套属性
        "订单数量": "DDSL",
         "提交人": "CJR_NAME",
        "提交日期": "CJSJ"
      },
      json_data: [],
      orderName:'',
      json_meta: [
        [
          {
            key: "charset",
            value: "utf-8"
          }
        ]
      ],
      activeName: "",
      tablist: [],
      options: [
        {
          value: 1,
          label: "已提交"
        },
        {
          value: 2,
          label: "驳回"
        }
      ],
      total: 0,
      formLabelWidth: "120px",
      dialogFormVisible: false, //控制 modal 显示
      currentPage: 1,
      reviewsSearchForm: {
        DDBH: "",
        auditStatus: ""
      },
      tableForm: {
        reviewsName: "",
        publishTime: "",
        entryTime: "",
        endTime: "",
        author: ""
      },
      tableData: [],
      requestParams: {
        limit: 10,
        start: 0,
        PCID: this.activeName,
        DDBH: "",
        DDZT: null
      },
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
    this.initTab();
   
  },
  methods: {
    init() {
      this.getOrderLists();
    },
        //导出
    outPass() {},
    async downdata(){
      console.log('this.activeName :>> ', this.activeName);
      const res= await exportDdList({PCID:this.activeName});
      console.log('res :>> ', res);
      let arr=[]
     res.records.map(item=>{
        let obj={
          DDBH:item.DDBH,
          ISBN:item.SJBH,
          ORG_NAME:item.ORG_NAME,
          CJR_NAME:item.CJR_NAME,
          SJMC:item.SJMC,
          DDSL:item.DDSL,
          CJSJ:item.CJSJ
        }
        arr.push(obj);
      })
      this.json_data=arr;
       console.log('json_data :>> ', arr);
    },
    async initTab() {
      const res = await getBatchTab();
      const { list } = this.initRes(res);
      this.tablist = list;
      this.activeName = list[0].ID;
      console.log('list :>> ', list);
      this.orderName=`${list[0].PCMC}采购订单.xls`;
      console.log('this.orderName :>> ', this.orderName);
      this.requestParams.PCID = this.activeName;
      this.getOrderLists();
       this.downdata();
    },
    initRes(res) {
      const a = res.slice(res.indexOf("rows"), -1); //从开始截取到倒数第二个字符串
      const str = res.substring(res.indexOf("results"), res.indexOf(",rows")); //从某个开始 截取到 某个下标的字符串
      const total = str.substr(str.indexOf(":") + 1); //从某个开始截取到结尾的字符串
      const list = eval(a);
      return { list, total };
    },
    async getOrderLists() {
      const paramsobj = this.invalidProperty(this.requestParams);
      let res = await getOrderList(paramsobj);
      const { list, total } = this.initRes(res);
      let arr = list.map(item => {
        let obj = {
          PCID: this.activeName,
          ID: item.ID,
          orderNumber: item.DDBH || "暂无数据",
          reviewsName: item.SJMC,
          bookName: item.SJMC || "暂无数据",
          bookNumber: item.DDSL || "暂无数据",
          submitter: item.CJR_NAME,
          submitTime: item.CJSJ,
          auditStatus: Number(item.DDZT),
          reviewer: item.CJR,
          ISBN:item.SJBH,
          ORG_NAME:item.ORG_NAME
        };
        return obj;
      });
      this.tableData = arr;
      this.total = Number(total);
    },
    handleClick(tab, event) {
      this.activeName = tab.name;
      this.requestParams.PCID = tab.name;
      this.init();
    },
    //查询
    search() {
      let obj = this.invalidProperty(this.reviewsSearchForm);
      const { DDBH, auditStatus } = this.reviewsSearchForm;
      this.requestParams.DDBH = DDBH;
      this.requestParams.DDZT = auditStatus;
      this.init();
    },
    clear() {
      this.reviewsSearchForm = {};
      this.requestParams = {
        limit: 10,
        start: 0,
        PCID: this.activeName
      };
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
      this.requestParams.limit = val;
      this.init();
    },
    handleCurrentChange(val) {
       this.currentPage=val;
      this.requestParams.start = (val - 1) * this.requestParams.limit;
      this.init();
    },

    // //审核通过
    // publish() {
    //   if (this.multipleSelection.length > 0) {
    //     let objIds = [];
    //     this.multipleSelection.map(item => {
    //       objIds.push(item.ID);
    //     });
    //     this.orderPass(objIds);
    //   }
    // },
    // async orderPass(ids) {
    //   const res = await checkPass(ids);
    //   this.init();
    //    this.downdata();
    //   this.$message.success("审核通过");
    // },
    //审核驳回
    withdraw() {
      if (this.multipleSelection.length > 0) {
        let nodePass = false;
        let objIds = [];
        this.multipleSelection.map(item => {
          objIds.push(item.ID);
          if (item.auditStatus == 2) {
            nodePass = true;
          }
        });
        if (nodePass == false) {
          this.orderReject(objIds);
        } else {
          this.$message.error("请勿重复驳回操作！");
        }
      }
    },
    async orderReject(ids) {
      const res = await checkReject(ids);
      this.init();
      this.$message.success("审核驳回");
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