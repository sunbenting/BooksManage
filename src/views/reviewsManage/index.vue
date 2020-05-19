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
            <el-form-item label="评论类型:">
              <el-select
                v-model="reviewsSearchForm.commentType"
                placeholder="请选择评论类型"
                size="small"
                style="width:230px"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
          <el-button type="primary" icon="el-icon-refresh-left" size="small" @click="withdraw">审核驳回</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-star-off" size="small" @click="selectedReviews">设置精选评论</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            ref="multipleTable"
            :data="commentData"
            tooltip-effect="dark"
            style="width: 100%;margin-top:15px;"
            :stripe="true"
            :cell-style="rowClass"
            :header-cell-style="headClass"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="bookName" label="图书名称" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="comments" label="评论内容" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="commentType" label="评论类型" min-width="120">
              <template slot-scope="scope">
                <el-tag
                  style="border:none;background: border-box;"
                  :type="scope.row.commentType==0?'':'success'"
                  effect="plain"
                >{{ scope.row.commentType==0?'普通评论':'精选评论' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="评论状态" min-width="120">
              <template slot-scope="scope" >
                <el-tag
                  style="border:none;background: border-box;"
                  :type="scope.row.commentStatus==0?'':scope.row.commentStatus==1?'success':'danger'"
                  effect="plain"
                >{{ scope.row.commentStatus==0?'待审核':scope.row.commentStatus==1?'通过':'驳回'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="commentTime" label="评论时间" min-width="130"></el-table-column>
            <el-table-column prop="commentator" label="评论人" min-width="120"></el-table-column>
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
  </div>
</template>
<script>
import {
  selectedComment,
  commentList,
  commentPass,
  commentReject
} from "@/api/comment";
import { Col } from "element-ui";
export default {
  data() {
    return {
      typeOptions: [
        { value: 0, label: "普通评论" },
        { value: 1, label: "精选评论" }
      ],
      options: [
        {
          value: 0,
          label: "待审核"
        },
        {
          value: 1,
          label: "通过"
        }
      ],
      total: 0,
      formLabelWidth: "120px",
      currentPage: 1,
      reviewsSearchForm: {
        bookName: "", //书名
        commentStatus: "", //搜索评论状态
        commentType: "" //搜索评论类型
      },
      commentData: [],
      multipleSelection: [],
      upper: false,
      requestParams: {
        limit: 10,
        start: 0,
        PLZT: null,
        PLLX: null,
        SJMC: ""
      }
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getCommentLists();
    },
    async getCommentLists() {
      const paramsobj = this.invalidProperty(this.requestParams);
      let res = await commentList(paramsobj);
      const { list, total } = this.initRes(res);
      let arr = list.map(item => {
        let obj = {
          PLID: item.PLID, //评论id
          bookName: item.SJMC, //书名
          comments: item.PLNR, //评论内容
          commentType: Number(item.PLLX), //评论类型
          commentStatus: Number(item.PLZT), //评论状态
          commentTime: item.CJSJ, //评论时间
          commentator: item.CJR_NAME, //评论人
          reviewer: item.CJR //提交人
        };
        return obj;
      });
      this.commentData = arr;
      this.total = Number(total);
    },
    initRes(res) {
      const a = res.slice(res.indexOf("rows"), -1); //从开始截取到倒数第二个字符串
      const str = res.substring(res.indexOf("results"), res.indexOf(",rows")); //从某个开始 截取到 某个下标的字符串
      const total = str.substr(str.indexOf(":") + 1); //从某个开始截取到结尾的字符串
      const list = eval(a);
      return { list, total };
    },
    //查询
    search() {
      console.log(this.reviewsSearchForm);
      let obj = this.invalidProperty(this.reviewsSearchForm);
       const { bookName, commentStatus, commentType } = this.reviewsSearchForm;
      this.requestParams.SJMC = bookName;
      this.requestParams.PLLX = commentType;
      this.requestParams.PCZT = commentStatus;
      this.init();
    },
    clear() {
      this.reviewsSearchForm = {};
       this.requestParams= {
        limit: 10,
        start: 0,
        PLZT: null,
        PLLX: null,
        SJMC: ""
      }
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
       console.log('size :>> ', val);
      this.init();
    },
    handleCurrentChange(val) {
      console.log('page :>> ', val);
      this.currentPage=val;
      this.requestParams.start = (val - 1) * this.requestParams.limit;
      this.init();
    },

    //发布
    publish() {
      if (this.multipleSelection.length > 0) {
        let objIds = [];
        this.multipleSelection.map(item => {
          objIds.push(item.PLID);
        });
        this.reviewsPass(objIds);
      }
    },
    async reviewsPass(ids) {
      const res = await commentPass(ids);
      this.init();
      this.$message.success("审核通过");
    },
    async reviewsReject(ids) {
      const res = await commentReject(ids);
      this.init();
      this.$message.success("审核驳回");
    },
       async selec(ids) {
      const res = await selectedComment(ids);
      this.init();
      this.$message.success("设置成功");
    },
    //撤回
    withdraw() {
      if (this.multipleSelection.length > 0) {
        let objIds = [];
        let nodePass=false;
        this.multipleSelection.map(item => {
          objIds.push(item.PLID);
          if (item.commentStatus == 1) {
            nodePass = true;
          }
        });
        if (nodePass == false) {
        
          this.reviewsReject(objIds);
        } else {
          this.$message.error("审核通过的评论无法驳回");
        }
      }
    },
    //设置精选评论
    selectedReviews() {
      if (this.multipleSelection.length > 0) {
        let objIds = [];
        let nodePass=false;
        this.multipleSelection.map(item => {
          objIds.push(item.PLID);
          if (item.commentStatus == 1) {
            nodePass = true;
          }
        });
        if (nodePass == true) {    
          this.selec(objIds);
        } else {
          this.$message.error("审核未通过的评论无法设置为精选评论");
        }
      }
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