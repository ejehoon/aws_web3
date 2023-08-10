// login-page.js

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); // 폼이 기본적으로 제출되는 것을 방지합니다.
  
      const usernameField = document.getElementById("username-field");
      const passwordField = document.getElementById("password-field");
  
      // 실제 로그인 유효성 검사 로직으로 대체하세요.
      // 예를 들어, 입력한 자격 증명을 데이터베이스나 하드코딩된 값과 비교할 수 있습니다.
      if (usernameField.value === "3355" && passwordField.value === "0000") {
        // 로그인 성공
        window.location.href = "index.html"; // "index.html"을 메인 페이지의 실제 URL로 대체하세요.
      } else {
        // 로그인 실패
        const loginErrorMsg = document.getElementById("login-error-msg");
        loginErrorMsg.style.opacity = 1;
      }
    });
});
