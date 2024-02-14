const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET home page. */
router.all('/', async function (req, res, next) {
    let fromContent = '';
    let toContent = '';
    if (req.method === 'POST') {
        fromContent = req.body.fromContent;
        const lang = req.body.lang;
        const result = fromContent.match(/(.|\n|\s){1,5000}/g) || []
        for (let i = 0; i < result.length; i++) {
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&ie=UTF-8&oe=UTF-8&tl=${lang}&dt=t&q=${encodeURI(result[i])}`,
                headers: {}
            }
            const txt = await axios.request(config)
                .catch((error) => {
                    console.log(error)
                })
            const txtData = txt.data[0];
            for (let j = 0; j < txtData.length; j++) {
                toContent = toContent.concat(txtData[j][0]);
            }
        }
    }
    return res.render('index', {
        title: 'Express',
        fromContent: fromContent,
        toContent: toContent
    });
});

module.exports = router;
