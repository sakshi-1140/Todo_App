const redirectSignupElement = document.querySelector(".redirect-signup");
redirectSignupElement.addEventListener('click',()=>{
    console.log('clicked');
     // Redirect to signup page
     window.location.href = "/signup";
})
