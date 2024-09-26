const redirectLoginElement = document.querySelector(".redirect-login");
redirectLoginElement.addEventListener('click',()=>{
    console.log('clicked');
     // Redirect to login page
     window.location.href = "/login";
})

