"use server";

export const get = async () =>{
    const data = await fetch(`${process.env.APP_URL}/book`);
    const json = await data.json();
    return json.data;
};