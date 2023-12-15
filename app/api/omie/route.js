import { NextResponse } from 'next/server'
import axios from 'axios';

export async function POST(req) {
    const data = await req.json()
    console.log(data)

    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 403 });
    }

    const options = {
        method: 'POST',
        url: 'https://app.omie.com.br/api/v1/' + data.url,
        headers: { 'Content-Type': 'application/json' },
        data: {
            call: data.call,
            app_key: '2195462804535',
            app_secret: '613348abc256e52d487df9b388b8329a',
            param: [data.payload]
        }
    };


    // Process data here
    var resp;
    const response = await axios.request(options).then(function (response) {
        resp = response.data
    }).catch(function (error) {
        resp = { erro: error }, { status: 500 };
    });
    return NextResponse.json(resp);

}