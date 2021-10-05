class ChatBox {
    constructor(params) {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }
        this.state = false;
        this.message = []
    }
    display() {
        const { openButton, chatBox, sendButton } = this.args;
        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));
        const node = document.querySelector('input');
        node.addEventListener('keyup', (key) => {
            if (key == 'Enter') {
                this.onSendButton(chatBox)
            }
        })
    }
    toggleState(chatBox) {
        this.state = !this.state;

        chatBox.classList[this.state ? 'add' : 'remove']('chatbox--active')
    }
    onSendButton(chatbox) {
        let textField = chatbox.querySelector('input');
        if (textField.value == "") {
            return
        }
        let msg = { name: 'user', message: textField.value }
        this.message.push(msg);
        fetch('predict', {
            method: 'POST',
            body: JSON.stringify({ message: textField.value }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(r => {
                textField.value = "";
                const msg2 = { user: 'Sam', message: r }
                this.message.push(msg2)
                this.updateMessage()
                console.log(r);
            })
    }

    updateMessage() {
        let html = '';
        this.message.slice().reverse().forEach(i => {
            if (i.user == 'Sam') {
                html += '<div class="messages__item messages__item--operator">' + i.message.answer + '</div>'
            } else
                html += '<div class="messages__item messages__item--visitor">' + i.message + '</div>'
        })
        const chatBox = document.querySelector('.chatbox__messages');
        chatBox.innerHTML = html;
    }
}

const chatbox = new ChatBox();
chatbox.display();