$(() => {
    const $form = $('#signup');
    var $form = $('#signup-form'),
      newFirstNameInput = $('#firstname'),
      newLastNameInput = $('#lastname'),
      newAgeInput = $('#age'),
      newEmailInput = $('#username'),
      newPasswordInput = $('#password'),
      newStateInput = $('#password')
  
    $form.on('submit', handleSignup);
  
    function handleSignup (e) {
      e.preventDefault();

      var newFirstName = newFirstNameInput.val();
      var newLastName = newLastNameInput.val();
      var newAge = newAgeInput.val();
      var newEmail = newEmailInput.val();
      var newPassword = newPasswordInput.val();
      var newState = newStateInput.val();
      
      var newContent = $('#new-content');
  
      if (newFirstName && newLastName && newAge && newEmail && newPassword && newState) {
        var useJson = false;
        if (useJson) {
          var requestConfig = {
            method: $form.attr('method'),
            url: $form.attr('action'),
            contentType: 'application/json',
            data: JSON.stringify({
              firstName : newFirstName,
              lastName : newLastName,
              age : newAge,
              userName : newEmail,
              password : newPassword,
              state : newState
            })
          };
  
          $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            newContent.html(responseMessage.message);
          });
        }
      }
    }
  })