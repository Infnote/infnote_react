class Message {
    static generateID() {
        return Math.random().toString(36).substr(2)
    }

    static fromJSON(jsonString) {
        var data = JSON.parse(jsonString)
        var message = Message.fromDict(data)
        return message
    }

    static fromDict(data) {
        var message = new Message()
        message.type = data['type']
        message.data = data['data']
        message.id = data['id']
        return message
    }

    static fromBehavior(behavior) {
        let firstCap = new RegExp("(.)([A-Z][a-z]+)")
        let allCap = new RegExp("([a-z0-9][A-Z])")

        var name = behavior.constructor.name
        name = name.replace(firstCap, '$1:$2')
        name = name.replace(allCap, "$1:$2")

        return new Message(name.toLowerCase(), behavior.toDict())
    }

    static fromError(error) {
        return new Message('error', error.toDict())
    }

    constructor(type = null, data = null, id = null) {
        this.type = type
        this.data = data
        if (id === null)
            this.id = Message.generateID()
        else
            this.id = id
    }

    toDict() {
        let data = {
            'type': this.type,
            'data': this.data,
            'id': this.id,
        }
        return data
    }

    toJSON() {
        return JSON.stringify(this.toDict())
    }
}

export default Message