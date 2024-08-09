const accounts = JSON.parse(localStorage.getItem('users')) || [];

async function simpleHash(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

function getAccount(email){
    return accounts.find(account => account.email === email);
}

function checkAccount(email){
    return !accounts.some(account => account.email === email);
}

function checkPassword(email,password){
    return accounts.some(account => account.email === email && account.password === password);
}

function saveCurrUser(account){
    localStorage.setItem('account-in-use',JSON.stringify(account));
}

function addAccount(acc){
    if (!checkAccount(acc.email)) return false;
    saveCurrUser(acc);
    accounts.push(acc);
    localStorage.setItem('users',JSON.stringify(accounts));
    return true;
}

