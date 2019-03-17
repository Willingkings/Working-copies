import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

/* 测试数据 */
const date = '';
const ruleForm = {
  orderType: '多日用车',
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
  detail:''
};

const oneRuleForm ={
  orderType: '单日用车',
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
  detail:''
};

const oneWayForm ={
  orderType: '单程用车',
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
  detail:''
}

const wayForm ={
  orderType: '单程用车',
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
  detail:''
}

/* 活动管理测试数据 */
/*
 * ruleForm  1、多日用车
 * oneRuleForm  2、单日用车
 * oneWayForm 3、单程用车
 * wayForm  4、单程用车
 * */
const state = {
    ruleForm: ruleForm,
    oneRuleForm: oneRuleForm,
    oneWayForm: oneWayForm,
    wayForm: wayForm,
    memberHead: window.sessionStorage.getItem('memberHead'),   //当前头像
    memberName: window.sessionStorage.getItem('memberName'),    //用户名
    memberId: window.sessionStorage.getItem('memberId'),  //会员ID
    phone: window.sessionStorage.getItem('phone'),    //手机号码
    token: window.sessionStorage.getItem('token'),   //令牌
    isDriver: window.sessionStorage.getItem('isDriver'), //一个是否是司机  0 否 1 是
    isWeChatBount: window.sessionStorage.getItem('isWeChatBount'),  //一个是否绑定微信
    userType: window.sessionStorage.getItem('userType'),   //用户类型  1企业  2旅行团  3 个人
    isLogin: false,  //登录\退出
    status: 0    //状态
}

/* 从本地存储读取数据 */
for(var item in state){
  localStorage.getItem(item)?
    state[item] = JSON.parse(localStorage.getItem(item)): false;
}

const mutations = {
    setRuleForm(state, payload) {
        Object.assign(state.ruleForm, payload);
        localStorage.setItem('ruleForm',JSON.stringify(payload));
    },
    setSignForm(state, payload) {
        Object.assign(state.oneRuleForm, payload);
      localStorage.setItem('oneRuleForm',JSON.stringify(payload));

    },
    setShareForm(state, payload) {
        Object.assign(state.oneWayForm, payload);
      localStorage.setItem('oneWayForm',JSON.stringify(payload));
    },
    setSelfForm(state, payload) {
        Object.assign(state.wayForm, payload);
      localStorage.setItem('wayForm',JSON.stringify(payload));
    },

  //登录时获取新的用户名
    newUserName(state, msg) {
      state.memberName = msg;
      window.sessionStorage.setItem('memberName', msg);
    },
  //登录时新的会员ID
    newMemberId(state, msg) {
      state.memberId = msg;
      window.sessionStorage.setItem('memberId', msg);
    },
  //保留上传头像
    newUserHead(state, msg) {
      state.memberHead = msg;
      window.sessionStorage.setItem('memberHead', msg);
    },
  //设置手机号码
    GetPhone(state, msg) {
      state.phone = msg;
      window.sessionStorage.setItem('loginName', msg);
    },
  //设置用户类型
    SET_USERTYPE(state, msg) {
      state.userType = msg;
      window.sessionStorage.setItem('userType', msg);
    },
  //将token保存到sessionStorage里，token表示登录状态
    SET_TOKEN(state, msg) {
        state.token = msg;
        window.sessionStorage.setItem('token', msg);
    },
  //登陆成功
  isLogin(state, msg) {
    state.isLogin = msg;
    sessionStorage.setItem('isLogin', msg);
  },
  //登出
    logout(state, msg) {
      state.isLogin = false;
      sessionStorage.removeItem('isLogin', false);
    },
    getStatus(state, msg) {
        state.status = msg;
    }
};

export default  new Vuex.Store({
    state,
    mutations
})
