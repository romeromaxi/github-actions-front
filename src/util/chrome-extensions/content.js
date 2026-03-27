chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === 'executeCode') {
    handleResumeInput();
  }
  if (request.action === 'executeLogin') {
    const mail = request.mail;
    const password = request.password;

    const data = {
      mail: mail,
      ipClient: '',
      password: password,
    };

    handleLogin(data);
  }
});

async function handleLogin(submitData) {
  const encoder = {
    key: 'KEYencodeSAGCoreABCDEFGHSAGIJKLMNCore',
    keyLength: 32,
    iv: 'IVencodeSAGCoreABCDEF',
    ivLength: 16,
  };

  let key = new TextEncoder().encode(
    encoder.key.substring(0, encoder.keyLength),
  );
  let iv = new TextEncoder().encode(encoder.iv.substring(0, encoder.ivLength));

  let passwordData = new TextEncoder().encode(submitData.password);

  let cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-CBC' },
    false,
    ['encrypt'],
  );

  let encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv: iv,
    },
    cryptoKey,
    passwordData,
  );

  const encryptedPassword = btoa(
    String.fromCharCode.apply(null, new Uint8Array(encryptedData)),
  );

  const dataEncrypted = {
    ...submitData,
    password: encryptedPassword,
  };

  try {
    const response = await fetch(`https://localhost:7239/api/v1/auth`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(dataEncrypted),
    });

    console.log('res ', response);
  } catch (err) {
    console.log('error', err);
  }
}

async function handleResumeInput() {
  const remoteResumeURL =
    'https://cms.fi.uba.ar/uploads/RESCD_2023_526_Informatica_Plan_2023_Aprobacion_15d3cee700.pdf';

  const designFile = await createFile(remoteResumeURL);

  const dt = new DataTransfer();
  dt.items.add(designFile);

  const event = new MouseEvent('change', {
    bubbles: true,
  });

  const input = document.querySelector('input[type="file"]');
  input.files = dt.files;
  input.dispatchEvent(event);
}

async function createFile(url) {
  let response = await fetch(url);

  let data = await response.blob();

  let metadata = {
    type: 'application/pdf',
  };

  return new File([data], 'resume.pdf', metadata);
}
