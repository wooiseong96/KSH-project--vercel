import '@/utils/auth.js'
import '@/utils/form-serialize.js'
import toastMessage  from '@/utils/toast.js'
import '@/stylesheets/all.css'

const serialize = require('form-serialize')

// 1.1 更新導航欄目
document.querySelector('.navbar-nav .active').classList.remove('active')
document.querySelector('.nav_login_link').classList.add('active')

// 2.1 獲取home頁面的參數
const login = document.querySelector('.login_form')
const register = document.querySelector('.register_form')
const urlParams = new URLSearchParams(window.location.search);
const param = urlParams.get('page'); 
if (param === 'register') {
  login.classList.toggle('d-none')
  register.classList.toggle('d-none')
}

// 2.2 點擊切換登入和注冊
document.querySelector('.control_btn').addEventListener('click', () => {
  login.classList.toggle('d-none')
  register.classList.toggle('d-none')
})

//2.3 登入校驗
$(login_form).bootstrapValidator({
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  fields: {
    username: {
      validators: {
        notEmpty: {
          message: '用户名不能为空'
        },
        stringLength: {
          min: 6,
          max: 10,
          message: '用户名长度必须在6到10之间'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9_\.]+$/,
          message: '用户名由数字字母下划线和.组成'
        }
      }
    },
    password: {
      validators: {
        notEmpty: {
          message: '密碼不能为空'
        },
        stringLength: {
          min: 6,
          max: 10,
          message: '密碼长度必须在6到10之间'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9_\.]+$/,
          message: '密碼由数字字母下划线和.组成'
        }
      }
    }
  }
})
$(".login_form").on('success.form.bv', function (e) {
  e.preventDefault();
  loginRender()
})

// 2.4 注冊校驗
$(register_form).bootstrapValidator({
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  excluded: [':disabled'],
  fields: {
    username: {
      validators: {
        notEmpty: {
          message: '用户名不能为空'
        },
        stringLength: {
          min: 6,
          max: 10,
          message: '用户名长度必须在6到10之间'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9_\.]+$/,
          message: '用户名由数字字母下划线和.组成'
        }
      }
    },
    password: {
      validators: {
        notEmpty: {
          message: '密碼不能为空'
        },
        stringLength: {
          min: 6,
          max: 10,
          message: '密碼长度必须在6到10之间'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9_\.]+$/,
          message: '密碼由数字字母下划线和.组成'
        }
      }
    },
    repassword: {
      validators: {
        notEmpty: {
          message: '密碼不能为空'
        },
        stringLength: {
          min: 6,
          max: 10,
          message: '密碼长度必须在6到10之间'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9_\.]+$/,
          message: '密碼由数字字母下划线和.组成'
        },
        identical: {
          field: 'password',
          message: '兩次輸入的密碼不一致'
        }
      }
    }
  }
})
$(".register_form").on('success.form.bv', function (e) {
  e.preventDefault();
  registerRender()
})

// 2.5 發送登入請求
  async function loginRender (){
    const loginData =  serialize(login, { hash: true, empty: true})
    try{
      const res = await axios({
        url: 'http://big-event-vue-api-t.itheima.net/api/login',
        method: 'post',
        data: {
          username: loginData.username,
          password: loginData.password
        }
      })
      const responseText = res.data.message
      const code = res.data.code
      toastMessage(responseText,code)

      if (code === 0) {
        localStorage.setItem('token', res.data.token)
        setTimeout(() => {
          location.href = '../home/home.html'     
        } ,2200)   
      } else {
        setTimeout(() => {
          $(".login_form").bootstrapValidator("resetForm",true);
        }, 2000)
      }
    }
     catch (error) {
      console.log(error)
      const responseText = error.response.request.statusText
      const code = error.response.request.status
      toastMessage(responseText,code)
    }
}

// 2.6 發送注冊請求
async function registerRender (){
  const registerData =  serialize(register, { hash: true, empty: true})
  try{
    const res = await 
    axios({
      url: 'http://big-event-vue-api-t.itheima.net/api/reg',
      method: 'post',
      data: {
        username: registerData.username,
        password: registerData.password,
        repassword: registerData.repassword
      }
    })
    const responseText = res.data.message
    const code = res.data.code
    toastMessage(responseText,code)

    if (code === 0) {
      setTimeout(() => {
        login.classList.toggle('d-none')
        register.classList.toggle('d-none')   
      } ,2200)   
    } else {
      setTimeout(() => {
        $(".register_form").bootstrapValidator("resetForm",true);
      }, 2000)
    }
  }
   catch (error) {
    const responseText = error.response.request.statusText
    const code = error.response.request.status
    toastMessage(responseText,code)
  }
}