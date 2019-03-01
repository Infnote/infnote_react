export class Languages {
    static words = {
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
            'post': 'Post',
            'dialog.privatekey.copy': 'Copy to Clipboard',
            'loading': 'Loading...',
            'no_more_data': 'No More Note',
            'anonymous': 'Anonymous',
            'anonymous.status': 'As Anonymous',
            'expand': 'Expand to Read All',
            'user.notfound': 'Cannot find user, please sign up first',
            'private_key.important_hint': '⚠️IMPORTANT: Private key is only saved locally in your browser. We won\'t retrive your key in any form. Please save your key somewhere carefully, it cannot be restored if lost.'
        },
        'zh-CN': {
            'apiserver': 'API 服务器',
            'cancel': '取消',
            'close': '关闭',
            'connectionError': '连接错误',
            'email': '邮箱',
            'error': '错误',
            'login':'登录',
            'logout':'登出',
            'logout?': '确定要登出吗？',
            'register':'注册',
            'save': '保存',
            'nickname': '昵称',
            'myPrivateKey': '我的密钥',
            'ok': '确定',
            'privateKeyWIF': '秘钥 (WIF格式)',
            'post': '发帖',
            'dialog.privatekey.copy': '复制到剪贴板',
            'loading': '加载中...',
            'no_more_data': '没有更多 Note 了',
            'anonymous': '匿名',
            'anonymous.status': '匿名状态',
            'expand': '阅读全文',
            'user.notfound': '用户未注册',
            'private_key.important_hint': '⚠️重要：私钥将只会保存于本地浏览器中。本站不会以任何形式获取您的私钥，若不慎丢失将无法恢复，请妥善保管。'
        }
    }

    static index = ''

    static read(key){
        return Languages.words[Languages.index][key]
    }
}

function __(key){
    return Languages.read(key)
}

export default __

