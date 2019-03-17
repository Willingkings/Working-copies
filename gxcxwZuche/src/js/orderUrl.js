let orderDomain = 'http://192.168.36.11:8096'; //测试环境

let orderUrls = {
  listOrder: '/order', //订单列表
  detailOrder: '/order/detail', //订单详情
  formOrder: '/order/form'  //订单查询
};

for (let i in orderUrls) {
  orderUrls[i] = orderDomain + orderUrls[i];
}
export {orderUrls};
