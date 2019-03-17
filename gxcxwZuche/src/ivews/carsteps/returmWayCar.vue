<template>
  <div>
    <div v-if="!previewShow">
      <div class="headStep">{{orderTypeName}}-填写用车信息 <span>（请将信息填写完整，以便车队报价准确）</span></div>
      <div class="stepFrom">
        <el-form ref="wayForm" :model="wayForm" :rules="rules" :label-position="labelPosition" label-width="130px" class="demo-ruleForm clearfix">
          <el-form-item label="添加团号" prop="groupNumber">
            <el-col :span="9">
              <el-input v-model="wayForm.groupNumber"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="上传行程单">
            <el-col :span="9">
              <v-update :img-arr="wayForm.itinerary"></v-update>
            </el-col>
          </el-form-item>
          <el-form-item label="出发城市" required>
            <!-- 自己封装的一个二级联动地址选择器 -->
            <address-select :forms="wayForm" :isAddressTrue="isAddressTrue"></address-select>
          </el-form-item>
          <el-form-item label="途径地点" required>
            <el-row>
              <el-col :span="8">
                <el-button type="primary" size="large" @click.native="addWayLocation"><i class="iconfont el-icon--left">&#xe639;</i>新增途径地点</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item class="item-bottom" v-for="(wayLocation, index) in wayForm.crossCitys" :key="wayLocation.key" :prop="'crossCitys.' + index + '.value'" :rules="{required:true, message: '请输入途径地点', trigger: 'change'}">
                <el-col :span="18">
                  <el-input v-model="wayLocation.value" :placeholder="'请输入途径地点'+wayLocation.title"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-button @click.native.prevent="removeWayLocation(wayLocation)" icon="delete"><i class="iconfont el-icon--left">&#xe637;</i>删除</el-button>
                </el-col>
              </el-form-item>
            </el-row>
          </el-form-item>
          <el-form-item label="目的城市" required>
            <!-- 自己封装的一个二级联动地址选择器 -->
            <destination-select :forms="wayForm" :isAddressTrue="isAddressTrue"></destination-select>
          </el-form-item>
          <el-form-item label="出发日期" prop="beginDate">
            <el-col :span="8">
              <el-date-picker type="datetime" v-model="wayForm.beginDate"  value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"   placeholder="选择日期" :picker-options="pickerBeginDateBefore"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="结束日期" prop="beginDate">
            <el-col :span="8">
              <el-date-picker type="datetime" v-model="wayForm.detailedDate"  value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"   placeholder="选择日期" :picker-options="pickerBeginDateBefore"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="详细行程" required>
            <el-col :span="8">
              <el-form-item prop="detailedDate">
                <el-date-picker type="datetime" v-model="wayForm.beginDate"  value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"   placeholder="选择日期" :picker-options="pickerBeginDateBefore"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <el-form-item prop="detailDistance">
                <el-input type="text" v-model="wayForm.detailDistance" placeholder="请输入行程"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="联系人" required>
            <el-col :span="18" style="width: 100%">
              <el-form-item  style="width: 100% !important" class="item-bottom" v-for="(contactName, index) in wayForm.name" :key="contactName.key" :prop="'name.' + index + '.value'" :rules="{required: true, message: '请输入联系人姓名', trigger: 'change'}">
                <el-input style="float: left; width: 74% !important;" v-model="contactName.value" :placeholder="'请输入联系人姓名' + contactName.title"></el-input>
                <el-col :span="3"  style="float: left">
                  <!--<el-button icon="delete" @click="index==0 ?addContact():deleteContact(contactName)"><i class="iconfont el-icon&#45;&#45;left">{{index == 0 ? "&#xe639;" : "&#xe637;" }}</i>{{index == 0 ? "常用" : "删除" }}</el-button>-->
                  <el-button icon="delete" @click="frequently()"><i class="iconfont el-icon--left">&#xe639;</i>常用</el-button>
                </el-col>
                <!-- 常用联系人窗口-->
                <ul class="commonContacts" v-if="frequentlyBtn == true">
                  <!--<ul class="commonContacts">-->
                  <li v-for="(item, index) in wayForm.frequentlyData" :key="item.key"  @click="pitchOnContacts(index)">
                    <div>
                      <img src="" alt="">
                    </div>
                    <div>
                      <span><p>{{item.name}}</p>{{item.phone}}</span>
                    </div>
                  </li>
                </ul>
              </el-form-item>
            </el-col>
            <!--<el-col :span="3">-->
            <!--<el-button icon="delete" @click="addContact"><i class="iconfont el-icon&#45;&#45;left">&#xe639;</i>常用</el-button>-->
            <!--</el-col>-->
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-col :span="18">
              <el-input v-model="wayForm.phone" placeholder="请输入手机号码"></el-input>
            </el-col>
          </el-form-item>
          <el-row>
            <el-col :span="11">
              <el-form-item label="用车人数" prop="person">
                <el-col :span="22">
                  <!--<el-input v-model="wayForm.person" placeholder="人"></el-input>-->
                  <el-input v-model.number="wayForm.person" placeholder="人"  type="number"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="用车数量" prop="carNumber">
                <el-col :span="22">
                  <el-select v-model="wayForm.carNumber" placeholder="请选择车辆">
                    <el-option label="1辆" value="1"></el-option>
                    <el-option label="2辆" value="2"></el-option>
                    <el-option label="3辆" value="3"></el-option>
                    <el-option label="4辆" value="4"></el-option>
                    <el-option label="5辆" value="5"></el-option>
                    <el-option label="6辆" value="6"></el-option>
                    <el-option label="7辆" value="7"></el-option>
                    <el-option label="8辆" value="8"></el-option>
                    <el-option label="9辆" value="9"></el-option>
                    <el-option label="10辆" value="10"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="选择车型" required>
            <el-col :span="7">
              <el-form-item prop="selectCarBrand">
                <el-select v-model="wayForm.selectCarBrand" placeholder="请选择品牌">
                  <el-option label="品牌1" value="1"></el-option>
                  <el-option label="品牌2" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="selectCarModel">
                <el-select v-model="wayForm.selectCarModel" placeholder="请选择">
                  <el-option label="型号1" value="1"></el-option>
                  <el-option label="型号2" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="selectCarSeat">
                <el-select v-model="wayForm.selectCarSeat" placeholder="请选择座位">
                  <el-option label="座位1" value="1"></el-option>
                  <el-option label="座位2" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="备注">
            <el-col :span="21">
              <el-input v-model="wayForm.remarks" type="textarea"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="需要发票">
            <el-radio-group v-model="invoiceRadio">
              <el-radio class="redRadio" label="否"></el-radio>
              <el-radio class="redRadio" label="是"></el-radio>
            </el-radio-group>
          </el-form-item>
          <transition name="list">
            <el-row v-show="invoiceRadio == '是'">
              <el-col :span="24">
                <div class="textCol">
                  增值税普通发票 <span>（发票将产生6%税点用车完成后寄出）</span>
                </div>
              </el-col>
            </el-row>
          </transition>
          <transition name="list">
            <el-form-item  v-if="invoiceRadio == '是'" label="发票抬头人" required>
              <el-col :span="18">
                <el-form-item class="item-bottom" v-for="(invoiceHeader, index) in wayForm.invoiceHead" :key="invoiceHeader.key" :prop="'invoiceHead.' + index + '.value'" :rules="{required: true, message: '请输入发票抬头人', trigger: 'change'}">
                  <el-input id="invoiceHeader" v-model="invoiceHeader.value"
                            :placeholder="'请输入发票抬头人' + invoiceHeader.title"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-button icon="delete" @click="addInvoiceHeader"><i class="iconfont el-icon--left">&#xe639;</i>常用</el-button>
              </el-col>
            </el-form-item>
          </transition>
          <transition name="list">
            <el-form-item  v-if="invoiceRadio == '是'" label="收件人" prop="invoicePerson">
              <el-col :span="18">
                <el-input v-model="wayForm.invoicePerson" placeholder="请输入联系人姓名"></el-input>
              </el-col>
            </el-form-item>
          </transition>
          <transition name="list">
            <el-form-item  v-if="invoiceRadio == '是'" label="手机号码" prop="invoiceTel">
              <el-col :span="18">
                <el-input v-model="wayForm.invoiceTel" placeholder="请输入手机号码"></el-input>
              </el-col>
            </el-form-item>
          </transition>
          <transition name="list">
            <el-form-item  v-if="invoiceRadio == '是'" label="收件地址" prop="invoiceAddr">
              <el-col :span="18">
                <el-input v-model="wayForm.invoiceAddr" type="textarea" placeholder="请输入收件地址"></el-input>
              </el-col>
            </el-form-item>
          </transition>
          <transition name="list">
            <el-form-item  v-if="invoiceRadio == '是'" label="税号" prop="taxNumber">
              <el-col :span="18">
                <el-input v-model="wayForm.taxNumber" placeholder="请输入税号"></el-input>
              </el-col>
            </el-form-item>
          </transition>
          <el-form-item>
            <el-button type="primary" class="stepBtn" @click="preview(wayForm)">预览订单</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <main class="releaseBox clearfix" v-show="previewShow">
      <div class="headTxt">预览发布行程信息</div>
      <div class="previewFrom clearfix">
        <dl class="from">
          <dt>您的用车类型：</dt>
          <dd>{{orderTypeName}}</dd>
          <dt>添加团号：</dt>
          <dd>{{wayForm.groupNumber}}</dd>
          <dt>上传行程单：</dt>
          <dd><img :src="wayForm.itinerary" alt=""></dd>
          <dt>出发城市：</dt>
          <dd>{{wayForm.province + wayForm.city + wayForm.detail}}</dd>
          <dt>途径地点：</dt>
          <dd><span v-for="(item, index) in wayForm.crossCitys">{{item.value}} -</span></dd>
          <dt>目的地：</dt>
          <dd>{{wayForm.overProvince + wayForm.overCity + wayForm.overDetail}}</dd>
          <dt>出发日期：</dt>
          <dd>{{wayForm.beginDate}}</dd>
          <dt>结束日期：</dt>
          <dd>{{wayForm.detailedDate}}</dd>
          <dt>详细行程：</dt>
          <dd>{{wayForm.detailedDate + "  "}}{{wayForm.detailDistance}}</dd>
          <dt>联系人：</dt>
          <dd><span v-for="(item,index) in wayForm.name">{{"  " +item.value}}</span></dd>
          <dt>手机号码:</dt>
          <dd>{{wayForm.phone}}</dd>
          <dt>用车人数：</dt>
          <dd>{{wayForm.person}} 人</dd>
          <dt>用车数量：</dt>
          <dd>{{wayForm.carNumber}} 辆</dd>
          <dt>选择车型：</dt>
          <dd>{{wayForm.selectCarBrand + " " + wayForm.selectCarModel + " " + wayForm.selectCarSeat}}</dd>
          <dt>备注：</dt>
          <dd>{{wayForm.remarks}}</dd>
          <dt>车辆座位：</dt>
          <dd>24 座 * 1 辆</dd>
        </dl>
        <dl class="from" v-if="invoiceRadio == '是'">
          <dt>发票抬头人：</dt>
          <dd><span v-for="(item, index) in wayForm.invoiceHead">{{"  " + item.value}}</span></dd>
          <dt>收件人：</dt>
          <dd>{{wayForm.invoicePerson}}</dd>
          <dt>手机号码：</dt>
          <dd>{{wayForm.invoiceTel}}</dd>
          <dt>收件地址：</dt>
          <dd>{{wayForm.invoiceAddr}}</dd>
          <dt>税号：</dt>
          <dd>{{wayForm.taxNumber}}</dd>
        </dl>
        <el-col :span="24">
          <el-checkbox class="redCheck" v-model="agreeRead" value="agreeRead">同意遵守 <span class="gray">《大巴租车协议》</span></el-checkbox>
        </el-col>
        <el-col :span="24">
          <el-button class="releaseBtn" @click="submitFormWay(wayForm)">确认发布</el-button>
          <el-button class="releaseBtn" @click="modification(wayForm)">返回修改</el-button>
        </el-col>
      </div>
    </main>
  </div>
</template>

<script>
  import updateFile from "@/components/updateFile"
  import addressSelect from '@/components/address'
  import destinationSelect from '@/components/destination'

  import { validatePhone, isInteger} from '@/js/validate.js'

  export default {
    components: {
      VUpdate: updateFile,
      AddressSelect: addressSelect,
      DestinationSelect: destinationSelect
    },
    data() {
      const date = '';
      return {
        labelPosition: 'left',
        isAddressTrue: false,
        ruleFormChange: false,
        previewShow: false,
        frequentlyBtn: false,
        stepForm: {},  //步骤条
        invoiceRadio: '否',
        //wayForm[]全部数组
        orderTypeName: '往返用车',
        wayForm: {
          orderType: Number(4),
          groupNumber: '',
          itinerary: [],
          crossCitys: [{title: '', value: ''}],
          beginDate: date,
          detailedDate: '',
          detailDistance: '',
          name: [{title: '', value: ''}],
          phone: '',
          person: '',
          passengersNum: '',
          carNumber: '',
          selectCarBrand: '',
          selectCarModel: '',
          selectCarSeat: '',
          remarks: '',
          invoiceHead: [{title: '', value: ''}],
          invoicePerson: '',
          invoiceTel: '',
          invoiceAddr: '',
          taxNumber: '',
          province:'',
          city:'',
          detail:'',
          overProvince:'',
          overCity:'',
          overDetail:'',
          frequentlyData: ''
        },
        // 禁止用户选择过去和今日日期
        pickerBeginDateBefore:{
          disabledDate(time) {
            let timeSpace = time.getTime() < Date.now();
            return timeSpace;

          }
        },
        rules: {
          groupNumber: [{required: true, message: '请填写团号', trigger: 'change'}],
          crossCitys: [{required: true, message: '请输入途径地点', trigger: 'change'}],
          beginDate: [{required: true, message: '请选择出发日期', trigger: 'change'}],
          detailedDate: [{required: true, message: '请选择出发日期', trigger: 'change'}],
          detailDistance: [{required: true, message: '请输入行程', trigger: 'change'}],
          //    name: [{required: true, message: '请输入联系人姓名', trigger: 'change'}],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'change'},
            { len: 11, message: '请输入11位数手机号码', trigger: 'change' },
            { validator: validatePhone, trigger: 'change' }
          ],
          passengersNum: [{required: true, message: '请输入用车人数', trigger: 'change'}],
          vehiclesNum: [{required: true, message: '请输入用车数量', trigger: 'change'}],
          selectCarBrand: [{required: true, message: '请选择品牌', trigger: 'change'}],
          selectCarModel: [{required: true, message: '请选择型号', trigger: 'change'}],
          selectCarSeat: [{required: true, message: '请选择座位', trigger: 'change'}],
          // invoiceHead: [{required: true, message: '请输入发票抬头人', trigger: 'change'}],
          invoicePerson: [{required: true, message: '请输入联系人姓名', trigger: 'change'}],
          invoiceTel: [
            {required: true, message: '请输入手机号码', trigger: 'change'},
            { len: 11, message: '请输入11位数手机号码', trigger: 'change' },
            { validator: validatePhone, trigger: 'change' }
          ],
          invoiceAddr: [{required: true, message: '请输入收件地址', trigger: 'change'}],
          taxNumber: [{required: true, message: '请输入税号', trigger: 'change'}]
        },
        agreeRead: true
      }
    },
    created: function () {
      // 记录初始时间
//      var currentdate = new  Date(this.createdTimeFormat(new  Date().getTime()))
      var currentdate = this.createdTimeFormat(new  Date().getTime())
      this.wayForm.beginDate = currentdate; // 默认出发日期
      this.wayForm.detailedDate = currentdate; // 默认详细行程日期
    },
    watch: {
      wayForm: {
        handler: function (val, oldVal) {
          this.ruleFormChange = true ;
          this.wayForm.province = val.province;
          this.wayForm.city = val.city;
          this.wayForm.detail = val.detail;
          this.wayForm.overProvince = val.overProvince;
          this.wayForm.overCity = val.overCity;
          this.wayForm.overDetail = val.overDetail;
        },
        deep: true
      }
    },
    methods: {
      exit: function () {
        console.log(11)
        this.$emit('update:visible', false);
        var currentdate = new Date(this.createdTimeFormat(new  Date().getTime()))
        // 重置初始设置时间
        this.wayForm.beginDate = currentdate; // 默认出发日期
        this.wayForm.detailedDate = currentdate; // 默认详细行程日期
      },
      createdTimeFormat(timestamp) {
        let date = new Date(timestamp);
        let Y = date.getFullYear();
        let M = date.getMonth() + 1;
        M = (M < 10 ? '0' + M : M);
        let D = (date.getDate()+1 < 10 ? '0' + (date.getDate() + 1) : date.getDate() + 1);
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
      },
      preview: function (wayForm) {
        this.$refs.wayForm.validate((valid) => {
          this.isAddressTrue = true;
          if (valid && this.invoiceRadio == '否') {
            this.previewShow = true;
          }else if (valid && this.invoiceRadio == '是') {
            this.previewShow = true;
          } else {
            return false;
          }
        });
      },

      modification: function (wayForm) {
            this.previewShow = false;
      },
      submitFormWay: function(wayForm) {
        let url = 'http://new.api.db.glchuxingwang.com/sales/order/addOrder';
        let _this = this;
        var approach;
        for (var i = 0; i < this.wayForm.crossCitys.length; i ++) {
          if(this.wayForm.crossCitys.length != 1) {
            if(this.wayForm.crossCitys.length - 1 != i) {
              approach += this.wayForm.crossCitys[i].value + ","
            } else {
              approach += this.wayForm.crossCitys[i].value
            }
          } else {
            approach = this.wayForm.crossCitys[0].value
          }
        }
        function XS(str) {
          var i = str.lastIndexOf(":")
          str = str.substr(0,str.lastIndexOf(":",i))
          return str
        }
        if (this.agreeRead) {
          $.ajax({
            type: 'post',
            url: url,
            data: {
              id: '',    //订单主键
              orderNo: '',  //订单编号
              orderStatus: '',  //订单状态
              groupNumber: this.wayForm.groupNumber,
              orderType: this.wayForm.orderType,
              fromCity: this.wayForm.province + this.wayForm.city + this.wayForm.detail,
              crossCitys: approach,
              aimCity: this.wayForm.overProvince + this.wayForm.overCity + this.wayForm.overDetail,
              beginDate: XS(this.wayForm.beginDate),
              backDate: XS(this.wayForm.detailedDate),
              detailDistance: this.wayForm.detailDistance,
              name: this.wayForm.name[0].value,
              phone: this.wayForm.phone,
              person: this.wayForm.person,
              carNumber: this.wayForm.carNumber,
              remarks: this.wayForm.remarks,
              invoiceHead: this.wayForm.invoiceHead[0].value,
              invoicePerson: this.wayForm.invoicePerson,
              invoiceTel: this.wayForm.invoiceTel,
              invoiceAddr: this.wayForm.invoiceAddr,
              taxNumber: this.wayForm.taxNumber,
              memberId: sessionStorage.getItem('memberId'),  //会员ID
              token: sessionStorage.getItem('token')  //令牌
            },
            success: function (response) {
              _this.$message.success('下单成功');
              _this.$router.push('/order');
            }
          })
        }
      },
      addWayLocation() {
        let n = this.wayForm.crossCitys ? this.wayForm.crossCitys.length + 1 : 1;
        this.wayForm.crossCitys.push({
          title: n,
          value: '',
          key: Date.now()
        });
      },
      removeWayLocation(item) {
        let index = this.wayForm.crossCitys.indexOf(item);
        if(index !== -1) {
          this.wayForm.crossCitys.splice(index, 1);
        }
      },
      // 打开和关闭常用联系人列表
      frequently() {
        var that = this;
        var url = 'http://new.api.db.glchuxingwang.com/sales/order/contactName';
        if(this.frequentlyBtn == false) {
          this.frequentlyBtn = true;
          $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data: {
              memberId: sessionStorage.getItem('memberId'),  //会员ID
              token: sessionStorage.getItem('token')  //令牌
            },
            success: function (response) {
              if (response.success) {
                that.wayForm.frequentlyData = response.msg;
                console.log(that.wayForm.frequentlyData)
              } else {
                console.log("获取常用联系人失败")
              }
            }
          })
        } else {
          this.frequentlyBtn = false;
        }
      },
      // 用户选中常用联系人
      pitchOnContacts(index) {
        this.wayForm.name[0].value = this.wayForm.frequentlyData[index].name;     // 联系人名字
        this.wayForm.phone = this.wayForm.frequentlyData[index].phone                       // 联系人号码
        this.frequentlyBtn = false;
      },
      // 添加常用联系人
      addContact() {
        let n = this.wayForm.name ? this.wayForm.name.length + 1 : 1;
        this.wayForm.name.push({
          title: n,
          value: '',
          key: Date.now()
        });
      },
      // 删除常用联系人
      deleteContact(item) {
        let index = this.wayForm.name.indexOf(item);
        if(index !== -1) {
          this.wayForm.name.splice(index, 1);
        }
      },
      addInvoiceHeader() {
        let n = this.wayForm.invoiceHead ? this.wayForm.invoiceHead.length + 1 : 1;
        this.wayForm.invoiceHead.push({
          title: n,
          value: '',
          key: Date.now()
        });
      }
    }
  }
</script>

<style lang="scss">
  .headStep {
    height: 50px;
    line-height: 50px;
    background-color: #FE4A54;
    color: #fff;
    font-size: 20px;
    padding: 0 10px;
    span {
      font-size: 14px;
      opacity: .8;
    }
  }
  .stepFrom {
    border: 1px solid #999;
    border-top: 0;
    padding: 30px;
    .el-form-item.item-bottom {
      margin-bottom: 20px;
    }
    .el-form-item.item-bottom:last-child {
      margin-bottom: 0;
    }
    .el-form-item .commonContacts {
      position: absolute;
      left:0;
      top: 40px;
      width: 22%;
      padding: 15px 10px;
      border: 1px solid #ddd;
      background: #fff;
      z-index: 10;
    }
    .el-form-item .commonContacts li {
      display: flex;
      padding-bottom: 5px;
      border-bottom: 1px solid #ddd;
    }
    .el-form-item .commonContacts li > div:nth-of-type(1) {
      display: flex;
      width: 30%;
      justify-content:center;
      align-items: center;
    }
    .el-form-item .commonContacts li > div:nth-of-type(1) img {
      display: block;
      width: 48px;
      height: 48px;
      border-radius:50%;
      background: green;
    }
    .el-form-item .commonContacts li > div:nth-of-type(2) {
      margin-left: 10px;
    }
    .el-form-item .commonContacts li > div:nth-of-type(2) p {
      height: 20px;
      font-weight:bold;
    }
    .el-form-item__label {
      font-size: 20px;
      color: #333;
    }
    .el-button--primary {
      margin-bottom: 22px;
    }
    .el-input {
      width: auto !important;
      display: block;
      margin-right: 10px;
    }
    .el-select .el-input .el-icon-arrow-up {
      font-family: "iconfont" !important;
      -webkit-text-stroke-width: 0.2px;
      font-size: 24px;
      color: #999;
      -webkit-transform: rotateZ(0);
      transform: rotateZ(0);
    }
    .el-icon-arrow-up:before {
      content: '\e63a';
    }
    .el-button {
      width: 100%;
      background-color: #FE4A54;
      border-color: #FE4A54;
      border-radius: 8px;
      color: #fff;
      padding: 10px 14px;
      font-size: 18px;
      margin-right: 10px;
    }
    .el-button--primary:focus, .el-button--primary:hover,.el-button:focus, .el-button:hover {
      background-color: #FE4A54;
      border-color: #FE4A54;
      color: #fff;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100%;
    }
    .el-textarea {
      width: 98%;
      margin-right: 10px;
    }
    .el-form-item.is-required .el-form-item__label:before {
      content: '';
      display: none;
    }
    .el-form-item.is-required .el-form-item__label::after {
      content: '*';
      color: #f56c6c;
      margin-left: 4px;
    }
    .textCol {
      font-size: 20px;
      color: #333;
      margin-bottom: 22px;
      span {
        color: #7D7D7D;
        font-size: 16px;
      }
    }
    .stepBtn {
      border-radius: 30px;
      width: auto;
      padding: 20px 50px;
      text-align: center;
    }
    .inputIcon i {
      top: 0;
    }
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-active {
    opacity: 0;
    transform: translateY(30px);
  }
  .releaseBox {
    width: 900px;
    margin: 0 auto 60px;
    .headTxt {
      height: 50px;
      line-height: 50px;
      background-color: #FE4A54;
      color: #fff;
      font-size: 20px;
      padding: 0 20px;
    }
    .previewFrom {
      border: 1px solid #999;
      border-top: 0;
      padding: 30px 40px;
      .from {
        margin-bottom: 40px;
      }
      .from dt {
        width: 140px;
        float: left;
        color: #333;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 22px;
        line-height: 1.4
      }
      .from dd {
        color: #868686;
        font-size: 18px;
        margin-bottom: 22px;
        line-height: 1.4;
      }
      .el-radio__input.is-checked .el-radio__inner {
        border-color: #FE4A54;
        background: #FE4A54;
      }
      .el-radio__input.is-checked+.el-radio__label {
        color: #333;
        font-size: 16px;
      }
      .gray {
        color: #999;
      }
      .releaseBtn {
        background: #FE4A54;
        border-color: #FE4A54;
        color: #fff;
        padding: 20px 50px;
        border-radius: 30px;
        font-size: 18px;
        margin: 20px 0 40px;
      }
    }
  }
</style>
