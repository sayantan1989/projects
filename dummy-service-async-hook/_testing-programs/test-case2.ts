import axios from 'axios';
const port = '8080';
const path = 'user-service/case2';

const url = `http://localhost:${port}/${path}`;

async function makeCall(i:number) {
    let randomReq = Math.random() * 10000000000000000;
    try {
         axios.get<any>(
            url,
            {
                headers: {
                    Accept: 'application/json',
                    testheader: randomReq
                },
            },
        ).then(function (response: any) {
            var randomRes: number = +response.data.value.testheader;
            console.log(`${i} : ${randomRes}`);

            if (randomReq !== randomRes) {
                console.error(`${randomReq} -- not equal -- ${randomRes}`);
            }
        });



    } catch (e) {
        console.log(e.message);
        console.error('------ issue !!!!!')
    }
}
for (let i = 0; i < 100; i++) {
    makeCall(i);
}