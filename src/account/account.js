import { getUserInfo, picConvertor } from '@/utils/auth.js'
import '@/utils/form-serialize.js'
import toastMessage from '@/utils/toast.js'
import '@/stylesheets/all.css'

const serialize = require('form-serialize')


// 1.1 更新導航欄目
document.querySelector('.navbar-nav .active').classList.remove('active')
document.querySelector('.nav_personal_link').classList.add('active')

// 2.1 獲取頭像，渲染在更換頭像區域
const changeImg = document.querySelector('.changeImg')
function getUserImg(){
  const Authorization = localStorage.getItem('token')
  async function getImg(){
    const res = await axios({
      url: 'https://big-event-vue-api-t.itheima.net/my/userinfo',
      method: 'GET',
      headers: {
         Authorization
      }
    }) 
    const userBase64 = res.data.data.user_pic

    if(userBase64 === null) return
    const imageUrl = picConvertor(userBase64)
    changeImg.src = imageUrl
    changeImg.classList.remove('invisible')
  }
  getImg()
  }
getUserImg()

// 2.2 接收用戶上傳的頭像
const formImg = document.querySelector('.formImg')
const removeImg = document.querySelector('.removeImg')
const uploadImg = document.querySelector('.uploadImg')
const input = ''

formImg.addEventListener('change', (input) => {
  renderImg(input)
})

function renderImg(input){
  removeImg.classList.remove('disabled')
  uploadImg.classList.remove('disabled')
  const file = input.target.files[0]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    changeImg.src = reader.result
    changeImg.classList.remove('invisible')
    const avatar = reader.result
    uploadDecodedImg(avatar)
  }
}

//2.3 移除預覽頭像
removeImg.addEventListener('click', () => {
  formImg.value = ''
  changeImg.src = ''
  changeImg.classList.add('invisible')
  toastMessage('預覽頭像移除成功', 0)
})

// 2.4 上傳頭像至後臺
function uploadDecodedImg(avatar){
  uploadImg.addEventListener('click', async () => {
    const Authorization = localStorage.getItem('token')
    try {
      const res = await axios({
      url: 'https://big-event-vue-api-t.itheima.net/my/update/avatar',
      method: 'patch',
      headers: {
        Authorization
      },
      data: {
        avatar: avatar
      }
    })
      getUserInfo()
      getUserImg()
      const responseText = res.data.message
      const code = res.data.code
      toastMessage(responseText,code)
    } catch (error){
      console.log(error)
        const responseText = error.response.request.statusText
        const code = error.response.request.status
        toastMessage(responseText,code)
    }
  })
}

// 3.1 更新密碼表單校驗
$(password_form).bootstrapValidator({
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  fields: {
    old_pwd: {
      validators: {
        notEmpty: {
          message: '舊密碼不能为空'
        },
        stringLength: {
          min: 6,
          max: 10,
          message: '密碼长度必须在6到10之间'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9_\.]+$/,
          message: '用户名由数字字母下划线和.组成'
        }
      }
    },
    new_pwd: {
      validators: {
        notEmpty: {
          message: '新密碼不能为空'
        },
        stringLength: {
          min: 6,
          max: 10,
          message: '新密碼长度必须在6到10之间'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9_\.]+$/,
          message: '新密碼由数字字母下划线和.组成'
        }
      }
    },
    re_pwd: {
      validators: {
        notEmpty: {
          message: '確認密碼不能为空'
        },
        stringLength: {
          min: 6,
          max: 10,
          message: '確認密碼长度必须在6到10之间'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9_\.]+$/,
          message: '確認密碼由数字字母下划线和.组成'
        },
        identical: {
          field: 'new_pwd',
          message: '輸入的密碼和新密碼不一致'
        }
      }
    }
  }
})

$(".password_form").on('success.form.bv', function (e) {
  e.preventDefault()
  updatePassword()
})

// 3.2 點擊清空密碼表單
document.querySelector('.clearPassword').addEventListener('click', () => {
  $(".password_form").bootstrapValidator("resetForm",true);
})

// 3.3 發送更新密碼請求
const pwdForm = document.querySelector('.password_form')
async function updatePassword() {
  const Authorization = localStorage.getItem('token')
  const pwdData=  serialize(pwdForm, { hash: true, empty: true})
  try {
    const res = await axios({
    url: 'https://big-event-vue-api-t.itheima.net/my/updatepwd',
    method: 'patch',
    headers: {
      Authorization
    },
    data: {
      ...pwdData
    }
    })
    const responseText = res.data.message
    const code = res.data.code
    toastMessage(responseText,code)
    setTimeout(() => {
      $(".password_form").bootstrapValidator("resetForm",true);
    }, 2200)
  } catch (error){
      const responseText = error.response.request.statusText
      const code = error.response.request.status
      toastMessage(responseText,code)
  }
}

// 4.1 跳轉至登入頁面
document.querySelector('.clearToken').addEventListener('click', () => {
  location.href = 'login.html'
})