// 1.1 登入時，獲取個人信息
export function getUserInfo(){
  const Authorization = localStorage.getItem('token')
  if (Authorization){
    async function getNav(){
      const res = await axios({
        url: 'http://big-event-vue-api-t.itheima.net/my/userinfo',
        method: 'GET',
        headers: {
           Authorization
        }
      }) 
      const userNav = res.data.data.username
      const userBase64 = res.data.data.user_pic
      renderInfo(userNav,userBase64)
    }
    getNav()
  }
}
getUserInfo()

// 1.2 渲染主頁的導航
export function renderInfo(userNav,userBase64){
  const loginNav = document.querySelector('.nav_login')
  const personalNav = document.querySelector('.nav_personal')
  const personalText = document.querySelector('.nav_personalText')
  const personalImg = document.querySelector('.nav_personalImg')
  
  if (userNav){
    loginNav.style.display = 'none'
    personalNav.style.display = 'block'
    personalText.innerHTML = userNav
  } else {
    loginNav.style.display = 'block'
    personalNav.style.display = 'none'
  }
  
  if (userBase64){
    const imageUrl = picConvertor(userBase64)
    personalImg.src = imageUrl
  } else {
    personalImg.src = '/assets/default.png'
  }
}

// 1.3 轉換base64圖片的函數
export function picConvertor(userBase64){
  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
  function getImageUrlFromBase64(base64, mimeType) {
    const blob = base64ToBlob(base64, mimeType);
    return URL.createObjectURL(blob);
  }
  const base64Image = userBase64;
  const imageUrl = getImageUrlFromBase64(base64Image.split(',')[1], 'image/png');
  return imageUrl
}

//1.4 上傳圖片時，更新頭像
function getUserImg(){
  const changeImg = document.querySelector('.changeImg')
  async function getNav(){
    const res = await axios({
      url: 'http://big-event-vue-api-t.itheima.net/my/userinfo',
      method: 'GET',
      headers: {
         Authorization
      }
    }) 
    changeImg = res.data.data.user_pic
  }
}
getUserImg()

// 1.5 登出
document.querySelector('.clearToken').addEventListener('click', () => {
  localStorage.removeItem('token')
  setTimeout( () => {
    window.location.reload();
  },2000)
})
