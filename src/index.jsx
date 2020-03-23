import './styles/main.scss';
import text from './assets/example-text';

const MAX_LENGTH = 200;
const MIN_LENGTH = 10;

class Pool {

    constructor() {
        this.chars = text.text;
        this.lengthValue = 0;
        this.limitValue = 0;
        this.btnElm = undefined;
        this.outputElm = undefined;
        this.progressElm = undefined;
        this.inProgress = 0;
    }

    init() {
        this.outputElm = document.getElementById('output');
        this.btnElm = document.getElementById('startButton');
        this.progressElm = document.getElementById('progress');
        this.btnElm.addEventListener('click', this.run.bind(this));
    };

    getRandomInt(max) {
        return MIN_LENGTH + Math.floor(Math.random() * (max - MIN_LENGTH + 1));
    }

    getRandomText(max) {
        return this.chars.substr(this.getRandomInt(this.chars.length - MAX_LENGTH),
            this.getRandomInt(max));
    }

    getRandomStingArray(length) {
        return [...Array(length | 0)].map((_, i) => {
            return {
                title: `${i}. ${this.getRandomText(100)}`,
                content: this.getRandomText(200),
            }
        });
    };

    clear() {
        const elms = document.querySelectorAll("div.tile");
        if (elms) {
            elms.forEach((elm) => {
                elm.remove();
            });
            this.inProgress = 0;
        }
    };

    addElementToDOM(textInner, index, count) {
        this.inProgress += 1;
        this.progressElm.innerHTML = (`<div class="progress">Progress: ${this.inProgress} of ${count}</div>`);

        const tag = document.createElement('div');
        tag.classList.add('tile');
        tag.setAttribute('id', index);
        tag.innerHTML = (`<div class="title">${textInner}</div>`);
        this.outputElm.appendChild(tag);
    };

    addContentToElement(text, index) {
        const elm = document.getElementById(index);
        if (elm) {
            elm.innerHTML += (`<div class="description">${text}</div>`);
        }
    };

    queue(arr, fnMapper, limit) {
        const _self = this;
        async function doWork(iterator) {
            for (let [index, item] of iterator) {
                await fnMapper(item.content, index);
                _self.addElementToDOM(item.title, index, arr.length);
            }
        }

        const workers = new Array(limit).fill(arr.entries()).map(doWork);
        Promise.all(workers).then((items) => this.btnElm.disabled = '');
    };

    run() {
        this.lengthValue = document.getElementById('length').value;
        this.limitValue = document.getElementById('limit').value;

        if (this.lengthValue && this.limitValue) {
            this.clear();
            this.btnElm.disabled = 'disabled';
            const myArray = this.getRandomStingArray(this.lengthValue);

            this.queue(myArray, (elm, index) => new Promise((resolve) => {
                setTimeout(resolve, Math.round(Math.random() * 90) + 1000);
                setTimeout(() => {
                    this.addContentToElement(elm, index);
                }, 2000);
            }), this.limitValue);
        }
    };
}

document.addEventListener("DOMContentLoaded", function(event) {
    new Pool().init();
});

window.onInput = function (value) {
 return value.replace(/[^\d]/g,'').trim();
};
