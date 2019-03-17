let domain = '';
//let orderDomain = 'http://192.168.36.11:8096';//测试环境

let urls = {
  login: '/doLogin', //登录
};

for (let i in urls) {
  urls[i] = domain + urls[i];
}
export {urls};

export function uploadUri() {
  return process.env.BASE_API + '/api/v1/upload/head'
}
