document.getElementById('resumeButton').addEventListener('click', function () {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    function (activeTabs) {
      chrome.tabs.sendMessage(activeTabs[0].id, { action: 'executeCode' });
    },
  );
});

document.getElementById('login-button').addEventListener('click', function () {
  const mail = document.getElementById('input-mail').value;
  const password = document.getElementById('input-password').value;
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('loader-login').style.display = 'block';

  setTimeout(() => {
    document.getElementById('loader-login').style.display = 'none';
    document.getElementById('import-view').style.display = 'block';
  }, 3000);

  chrome.tabs.query(
    { active: true, currentWindow: true },
    function (activeTabs) {
      chrome.tabs.sendMessage(activeTabs[0].id, {
        action: 'executeLogin',
        mail: mail,
        password: password,
      });
    },
  );
});
