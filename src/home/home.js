import '@/utils/auth.js'
import '@/utils/form-serialize.js'
import '@/utils/toast.js'
import '@/stylesheets/all.css'

const serialize = require('form-serialize')

// 1.1 更新導航欄目
  document.querySelector('.navbar-nav .active').classList.remove('active')
  document.querySelector('.nav_home_link').classList.add('active')
  
// 2.1 鄉鎮選項更新
async function selectList(){
   const res = await axios({
      url: 'https://api.kcg.gov.tw/api/service/Get/0696fe30-a7b7-42f7-9458-f4716138109d',
      params: {
       fields: '鄉鎮'
      }
     })
    //排除重複的選項
     const raw = res.data.data
     const raw2 = new Set(raw.map((item) => JSON.stringify(item)))
     const result = Array.from(raw2).map((item) => JSON.parse(item))

     const list = ` <option selected value="0" >地區</option>` +
      result.map(item =>  `<option value="${item.鄉鎮}">${item.鄉鎮}</option>`).join('')
      document.querySelector('.form-select').innerHTML = list
}
selectList()

// 2.2 搜索時，自動跳轉到搜索區域
function nav_searchPosition (inputClass){
  const height = document.querySelector(`.${inputClass}`).offsetTop
  document.documentElement.scrollTop = height
}

// 2.3 輸入和查詢
document.querySelector('.btnSearch').addEventListener('click', () => {
  nav_searchPosition('search_area')
  document.querySelector('.zero_result').classList.add('d-none')
  document.querySelector('.data-table').classList.add('d-none')
  document.querySelector('.pagination_area').classList.add('d-none')
  async function searchList(){
    const resOriginal = await axios({
        url: 'https://api.kcg.gov.tw/api/service/Get/0696fe30-a7b7-42f7-9458-f4716138109d',
      })
      const result = resOriginal.data.data
      const form = document.querySelector('.formSearch')
      const data =  serialize(form, { hash: true, empty: true})
      let filterData = []
      function dataChecker (){
        if (data.name !== '' && data.region === '0'  ){
          filterData = result.filter(item => item.旅宿名稱 === data.name)
          return filterData 
        } else if (data.name === '' && data.region !== '0'  ){
          filterData = result.filter(item => item.鄉鎮 === data.region)
          return filterData
        } else if (data.name === '' && data.region === '0' ){
          return result
        } else if(data.name !== '' && data.region !== '0' ){
          filterData = result.filter(item =>item.旅宿名稱 === data.name && item.鄉鎮 === data.region)
          return filterData
        } 
      }
      dataChecker()

    const filterResult = dataChecker()
    async function loading () {
      return new Promise((resolve) => {
        const loader = document.querySelector('.loading')
        loader.classList.remove('d-none')
        setTimeout(() => {
          loader.classList.add('d-none')
          resolve('')
        }, 3000)
      })
    }
    async function renderAction() {
      await loading()
      renderTable(filterResult)
      renderPage(filterResult)
    }
    renderAction()
    }
  searchList()
})

// 2.4 渲染分頁
const zeroResult =  document.querySelector('.zero_result')
const dataTable = document.querySelector('.data-table')
const paginationArea = document.querySelector('.pagination_area')
function renderTable (finalResult, k = 1 ) {
    if(finalResult.length === 0 ){
      zeroResult.classList.remove('d-none')
      document.querySelector('.list_thead').innerHTML = ''
      document.querySelector('.list_tbody').innerHTML = ''  
   }
    else {
     zeroResult.classList.add('d-none')
     dataTable.classList.remove('d-none')
     paginationArea.classList.remove('d-none')
     document.querySelector('.list_thead').innerHTML = `
     <tr class="table border-bottom border-dark">
       <th scope="col" class="text-nowrap col-2"></th>
       <th scope="col" class="text-nowrap col-1 col-md-2">名稱</th>
       <th scope="col" class="text-nowrap col-1 col-md-2">地區</th>
       <th scope="col" class="text-nowrap col-1 col-md-2">房間</th>
       <th></th>
     </tr>`
     
     let i = 0    
     let number = (k * 5) - 4 - 1
 
     const listBody = finalResult.map(item => {
     i++
     number++
     if (i <= 5  ){
     return `
     <tr class="list_tr">
     <th scope="row">${number}</th>
     <td data-title="名稱">${item.旅宿名稱}</td>
     <td data-title="地区">${item.鄉鎮}</td>
     <td data-title="房间">${item.房間數}</td>
     <td>
     <div class="py-1">
     <button class="btn btn-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample${i}" aria-expanded="false" aria-controls="collapseExample">
       <i class="bi bi-info-square-fill text-primary fs-4"></i>
     </button>
     </div>
     <div class="collapse" id="collapseExample${i}">
     <div class="card card-body border border-dark fs-6 mb-1 text-start">
     <p>
       1. 地址： ${item.地址} <br>
       2. 網址： ${item.網址 === '' ? `暫無網址` : ` ${item.網址}`} <br>
       3. 電話： ${item.電話} <br>
       4. 類別： ${item.類別}
     </p>
     </div>
     </div>
     </td>
     </tr>
     `
     }
     }).join('')
     document.querySelector('.list_tbody').innerHTML = listBody
   } 
}
function renderPage(finalResult){
  if(finalResult.length === 0 ){
    document.querySelector('.pagination').innerHTML = ''
  } else {
   const totalCount = finalResult.length
   const page = Math.ceil(totalCount/5)
   const pageArr = [`<li class="page-item mb-1" ><a class="page-link active" data-page='1' href="javascript:;">1</a></li>`]
   const pagination =  document.querySelector('.pagination')
   for (let j = 2; j <= page; j++){
     pageArr.push(`<li class="page-item mb-1" ><a class="page-link" data-page='${j}' href="javascript:;">${j}</a></li>`)
   }
   pagination.innerHTML = pageArr.join('')
  }
}

// 2.5 依分頁渲染對應資料
  document.querySelector('.pagination').addEventListener('click', (e) => {
    if (e.target.tagName === 'A'){
      nav_searchPosition('display_area')
      let k = e.target.dataset.page
      document.querySelector('.pagination .active').classList.remove('active')
      document.querySelector(`.pagination li:nth-child(${k})`).classList.add('active')
      const offset = (k * 5) - 4 - 1
      async function searchPage(){
        const resOriginal = await axios({
           url: 'https://api.kcg.gov.tw/api/service/Get/0696fe30-a7b7-42f7-9458-f4716138109d',
           params: {
            limit: 5,
            offset: offset
           }
        })
      const result = resOriginal.data.data
       renderTable(result, k)
      }
      searchPage()
    }
  })

// 3.1 插畫區域點擊注冊跳轉
  const login = document.querySelector('.login_form')
  const register = document.querySelector('.register_form')
  document.querySelector('.register_btn').addEventListener('click', () => {
  location.replace('login.html?' + 'page=register')
})
