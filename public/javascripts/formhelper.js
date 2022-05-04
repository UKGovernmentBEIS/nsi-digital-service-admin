const acceptNotification = {
    init: () => {

      var acceptBtn = document.getElementById('acceptNotificationButton');

      if (acceptBtn) {
        acceptBtn.addEventListener('click', function(e) {
            document.getElementById('acceptNotificationButton').disabled = 'true';
            document.acceptForm.submit();   
        });
      }
    },
  };

  acceptNotification.init();
  