<template>
  <div class="systemManage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>类别管理</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">修改分类</el-button> -->
      </div>
      <div class="text item">
        <div class="checkList">
          <h4>已有类别：</h4>
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="item in checkOptions" :key="item.value" :label="item.label"></el-checkbox>
          </el-checkbox-group>
        </div>

        <el-form :model="textform" ref="textform" label-width="80px">
          <el-row>
            <el-col :span="14">
              <el-form-item label="新增类别">
                <el-input v-model.trim="textform.textipt" placeholder="新增类别"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item>
                <el-button type="primary" @click="onSubmit">确认</el-button>
                <el-button type="primary" @click="upLB">修改</el-button>
                <el-button type="primary" @click="delLB">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-dialog title="修改类别" :visible.sync="LBvisible" width="40%" @close="LBvisible=false">
      <div style=" margin-left: 10px;
    font-weight: 600; margin-bottom: 15px;
    color: #000;">已选类别：{{LBIDS.lbmc}}</div>
      <el-form :model="lbform" ref="lbform" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="修改类别">
              <el-input v-model.trim="lbform.lbipt" placeholder="填入修改类别"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="LBvisible= false">取 消</el-button>
        <el-button type="primary" @click="sureVisible">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>轮播管理</span>
        <el-button style="float: right; padding: 3px 0" type="text">修改轮播</el-button>
      </div>
      <div class="text item">
        <el-button type="primary">修改轮播</el-button>
      </div>
    </el-card> -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>图书购选数量管理</span>
      </div>
      <div class="text item">
        <!-- <div class="DDPE">
          <h4>已有图书最大购选数量:</h4>
          <span>{{DDPE}}</span>
        </div> -->
        <el-form :model="orderform" ref="orderform" label-width="163px">
          <el-row>
            <el-col :span="14">
              <el-form-item label="图书最大购选数量">
                <el-input-number
                  v-model.trim="orderform.ordeript"
                  placeholder="填入图书最大购选数量"
                  :min="1"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item>
                <el-button type="primary" @click="sureOrder">确认</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { setDDPE, getDdpe, saveSJLB, deleteSJLB, upSJLB } from "@/api/system";
import { getSjlb } from "@/api/booksManage";
export default {
  data() {
    return {
      LBvisible: false,
      checkList: [],
      checkOptions: [],
      lbform: {
        lbipt: ""
      },
      textform: {
        textipt: ""
      },
      DDPE: "",
      peid: "",
      orderform: {
        ordeript: ""
      },
      LBIDS: {}
    };
  },
  mounted() {
    this.initPeData();
    this.getBooksCategary();
  },
  methods: {
    async initPeData() {
      const res = await getDdpe();
      this.orderform.ordeript=res.records[0].DDPE;
      this.peid = res.records[0].ID;
      console.log("initPeData :>> ", res);
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
      this.checkOptions = op;
    },
    initRes(res) {
      const a = res.slice(res.indexOf("rows"), -1); //从开始截取到倒数第二个字符串
      const str = res.substring(res.indexOf("results"), res.indexOf(",rows")); //从某个开始 截取到 某个下标的字符串
      const total = str.substr(str.indexOf(":") + 1); //从某个开始截取到结尾的字符串
      const list = eval(a);
      return { list, total };
    },

    async addSJLB() {
      const obj = {
        lbmc: this.textform.textipt
      };
      console.log("obj :>> ", obj);
      const res = await saveSJLB(obj);
      console.log("res :>> ", res);
      if (res) {
        this.$message.success("添加成功！");
        this.textform.textipt = "";
        this.getBooksCategary();
      }
    },
    sureLabel() {},
    upLB() {
      if (this.checkList.length == 1) {
        this.LBvisible = true;
        let obj = {};
        this.checkOptions.map(item => {
          this.checkList.map(op => {
            if (op == item.label) {
              obj.lbmc = item.label;
              obj.lbid = item.value;
            }
          });
        });
        this.LBIDS = obj;
        console.log("obj :>> ", obj);
      } else {
        this.$message.error("每次只能勾选一个类别进行修改");
      }

      console.log("this.LBIDS :>> ", this.LBIDS);
    },
    sureVisible() {
      let obj = {
        lbmc: this.lbform.lbipt,
        lbid: this.LBIDS.lbid
      };
      this.sureLBs(obj);
    },

    async sureLBs(obj) {
      const res = await upSJLB(obj);
      console.log("res :>> ", res);
      if (res.success) {
        this.LBvisible = false;
        this.$message.success("修改成功！");
        this.LBIDS={};
        this.checkList=[];
        this.getBooksCategary();
      }
    },
    delLB() {
      let arr = [];
      this.checkOptions.map(item => {
        this.checkList.map(op => {
          if (op == item.label) {
            arr.push(item.value);
          }
        });
      });

      let obj = {
        ids: arr
      };
      this.delCategarys(obj);
    },

    async delCategarys(obj) {
      const res = await deleteSJLB(obj);
      console.log("res :>> ", res.success);
      if (res.success) {
        this.$message.success("删除成功！");
        this.getBooksCategary();
      }else{
        this.$message.error('存在已被书籍引用的类别，无法删除!')
      }
    },
    async setOrderPE() {
      const obj = {
        ddpe: this.orderform.ordeript,
        peid: this.peid
      };
      console.log("obj :>> ", obj);
      const res = await setDDPE(obj);
      console.log("res :>> ", res);
      if (res.success) {
        this.$message.success("设置成功！");
        this.initPeData();
      }
    },
    onSubmit() {
      if(this.textform.textipt){
        this.addSJLB();
      }else{
        this.$message.error('请先填写类别再添加')
      }
      
    },
    sureOrder() {
      this.setOrderPE();
    }
  }
};
</script>


<style lang="scss" scoped>
/deep/.el-form-item__label {
  color: #000;
}
.systemManage {
  padding: 10px;
  background: #f2f2f2;
  .checkList {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    margin-left: 12px;
  }
  .DDPE {
    display: flex;
    align-items: center;
    h4 {
      margin-left: 23px;
      margin-right: 5px;
    }
    span {
      font-size: 15px;
      font-weight: 600;
      color: #409eff;
    }
  }
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  //   width: 480px;
  margin-bottom: 10px;
}
</style>