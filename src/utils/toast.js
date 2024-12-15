const toastContent = document.querySelector('.toast');
const toast = new bootstrap.Toast(toastContent);

function toastMessage(responseText,code){
  const toastStyle = document.querySelector('.toast-body')

  if (code === 0) {
    toastStyle.classList.remove('bi-x-square-fill')
    toastStyle.classList.add('bi-check-square-fill')
    toastStyle.style.color = 'green'
  } else {
    toastStyle.classList.remove('bi-check-square-fill')
      toastStyle.classList.add('bi-x-square-fill')
      toastStyle.style.color = 'red'
  }

  toastStyle.innerHTML =  '&ensp;' + responseText
  toast.show()
}

export default toastMessage