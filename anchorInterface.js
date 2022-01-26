const transport = new AnchorLinkBrowserTransport()
const link = new AnchorLink({
    transport,
    chains: [
        {
            chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
            nodeUrl: 'https://wax.greymass.com',
        }
    ],
})

var anchorSession = null
var rpc = null


anchorLogin = async function () {
    const identity = await link.login('kingdomclash');
// Save the session within your application for future use
    const session = identity.session;
    anchorSession = session;
    rpc = anchorSession.getClient;
    console.log(`Logged in as ${session.auth}`);
    return anchorSession;
};

anchorGetBalance = async function(userAccount) {
    const { client } = anchorSession.link;
    const balance = await client.v1.chain.get_currency_balance('eosio.token', userAccount, 'WAX');
    const balanceUnits = parseFloat(balance[0].toString().split(' '));
    return balanceUnits.toFixed(2);
};



