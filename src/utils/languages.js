let words = {
    'en-US': {
        'apiserver': 'API Server',
        'cancel': 'Cancel',
        'close': 'Close',
        'connectionError': 'Connection Error',
        'email': 'Email',
        'error': 'Error',
        'login':'Login',
        'logout':'Logout',
        'logout?': 'Are you sure to logout?',
        'register':'Register',
        'save': 'Save',
        'nickname': 'Nickname',
        'myPrivateKey': 'My Private Key',
        'ok': 'OK',
        'privateKeyWIF': 'Private Key (Wallet Import Format)',
        'post': 'Post'
    },
    'zh-CN': {
        'apiserver': 'API 服务器',
        'cancel': '取消',
        'close': '关闭',
        'connectionError': '连接错误',
        'email': '邮箱',
        'error': '错误',
        'login':'登陆',
        'logout':'登出',
        'logout?': '确定要登出吗？',
        'register':'注册',
        'save': '保存',
        'nickname': '昵称',
        'myPrivateKey': '我的密钥',
        'ok': '确定',
        'privateKeyWIF': '秘钥 (WIF格式)',
        'post': '发帖'
    }
}

export class Languages {
    static index = ''

    static read(key){
        return words[Languages.index][key]
    }
}

function __(key){
    return Languages.read(key)
}

export default __

