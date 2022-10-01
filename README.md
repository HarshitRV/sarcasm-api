# sarcasm-api

## A REST API that returns random Chandler Bing's sarcastic comment.

## Link

### Get random sarcastic comment
[https://sarcasmapi.onrender.com](https://sarcasmapi.onrender.com)
```json
{
"sarcasm": "I'm not great at the advice. Can I interest you in a sarcastic comment."
}
```

### Using fetch
```js
const response = await fetch('https://sarcasmapi.onrender.com');
const data = await response.json();
console.log(data.sarcasm);
```

### Get all sarcastic comments
[https://sarcasmapi.onrender.com/all](https://sarcasmapi.onrender.com/all)

