// const buttonQuery = document.querySelector('#clickme');

// //khi click 1 lần vào button : đổi nội dung content từ click me!
// //thành Clicked!

// function handleClick() {
//     buttonQuery.innerText = 'SURPRISE';
//     alert('CHÀO MỪNG NGÀY NHÀ GIÁO VIỆT NAM')
// }


const btnLoginQuery = document.querySelector('#loginBtn')

const inputEmail =  document.querySelector('#email')
const inputPassword = document.querySelector('#password')


function oneClick(params) {
    btnLoginQuery.innertext = 'Success'
    const email_value = inputEmail.value;
    const password_value = inputPassword.value;
    if(email_value.length > 10 && email_value.includes('@') && password_value.length >=6){
        alert('Đăng nhập thành công')
        window.location.href='end2.html'

    } else{
        alert('Đăng nhập thất bại!')
        //mở file html buổi 10.html
        alert('Có vẻ bạn đã sai chỗ nào đấy(email cần @ ,mật khẩu cần 6 kí tự trở lên)')
        window.location.href ='index.html'

    }
}