// 문의사항 메시지 전송
(function() {
    function handleFormSubmit(event){
        event.preventDefault();
        var conFirm = confirm('메시지를 전송하겠습니까?');
        if (!conFirm) return false;
        
        var form = event.target;
        var data = new Object;

        data.name = document.getElementById("name").value;
        data.email = document.getElementById("email").value;
        data.subject = document.getElementById("subject").value;
        data.message = document.getElementById("message").value;
        
        //스팸 방지 - honeypot
        if (document.getElementById("honeypot").value) return false;
    
        disableAllButtons(form);
        var url = "https://script.google.com/macros/s/********************************************/exec";
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        // xhr.withCredentials = true;
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                form.reset();

                var formElements = form.querySelector("submitErrorMessage")
                if (formElements) {
                    formElements.style.display = "none";
                }
                var thankYouMessage = form.querySelector("submitSuccessMessage");
                if (thankYouMessage) {
                    thankYouMessage.style.display = "block";
                }
                document.getElementById("submitButton").disabled = false;
                alert("메세지가 전송되었습니다. 감사합니다.");
            }
        };
        // url encode form data for sending data
        var encoded = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
        }).join('&');
        xhr.send(encoded);
    };

    function loaded() {
        var forms = document.querySelectorAll("form.gform");
        for (var i = 0; i < forms.length; i++) {
        forms[i].addEventListener("submit", handleFormSubmit, false);
        }
    };

    document.addEventListener("DOMContentLoaded", loaded, false);
    function disableAllButtons(form) {
        var buttons = form.querySelectorAll("button");
        for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
        }
    };
})();
