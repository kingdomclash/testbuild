const wax = new waxjs.WaxJS({rpcEndpoint: 'https://wax.greymass.com'});
var api = null

//autologin
autoLogin = async function () {
    let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
    if (isAutoLoginAvailable) {
        let userAccount = wax.userAccount;
        let pubKeys = wax.pubKeys;
    }
};

//normal login. Triggers a popup for non-whitelisted dapps
waxLogin = async function () {
    try {
        //if autologged in, this simply returns the userAccount w/no popup
        let userAccount = await wax.login();
        api = wax.api;
        let pubKeys = wax.pubKeys;
        console.log(userAccount.toString());
        return userAccount
    } catch (e) {
       console.log(e);
    }
};

waxGetBalance = async function(userAccount) {
    const balance = await api.rpc.get_currency_balance('eosio.token', userAccount, 'WAX');
    const balanceStrings = balance[0].split(' ');
    const balanceUnit = parseFloat(balanceStrings[0]);
    return balanceUnit.toFixed(2);
};

sign = async function () {
    if (!wax.api) {
        return document.getElementById('response').append('* Login first *');
    }

    try {
        const result = await wax.api.transact(
            {
                actions: [
                    {
                        account: 'eosio',
                        name: 'delegatebw',
                        authorization: [
                            {
                                actor: wax.userAccount,
                                permission: 'active',
                            },
                        ],
                        data: {
                            from: wax.userAccount,
                            receiver: wax.userAccount,
                            stake_net_quantity: '0.00000001 WAX',
                            stake_cpu_quantity: '0.00000000 WAX',
                            transfer: false,
                            memo: 'This is a WaxJS/Cloud Wallet Demo.',
                        },
                    },
                ],
            },
            {
                blocksBehind: 3,
                expireSeconds: 30,
            },
        );
        document.getElementById('response').append(JSON.stringify(result, null, 2));
    } catch (e) {
        document.getElementById('response').append(e.message);
    }
};
